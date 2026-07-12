import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';

// ResizeObserver error suppression is handled in index.html <head> (capture phase, runs first)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

/**
 * 弱网优化配置
 */
const NETWORK_CONFIG = {
  // 请求超时时间（毫秒）- 默认
  timeout: 30000,
  // AI生成类请求超时时间（毫秒）- LLM深度分析需要更长时间
  llmTimeout: 180000,
  // 最大重试次数
  maxRetries: 3,
  // 重试延迟基数（毫秒）
  retryDelay: 1000,
  // 重试延迟最大值（毫秒）
  maxRetryDelay: 10000,
};

/**
 * 计算指数退避延迟
 */
function getRetryDelay(attemptIndex: number): number {
  const delay = Math.min(
    NETWORK_CONFIG.retryDelay * Math.pow(2, attemptIndex),
    NETWORK_CONFIG.maxRetryDelay
  );
  // 添加随机抖动避免雷群效应
  return delay + Math.random() * 1000;
}

/**
 * 判断错误是否可重试
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof TRPCClientError) {
    // 网络错误可重试
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return true;
    }
    // 服务器错误可重试
    const code = error.data?.code;
    if (code === 'INTERNAL_SERVER_ERROR' || code === 'TIMEOUT') {
      return true;
    }
  }
  // 原生fetch错误可重试
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  return false;
}

/**
 * 判断请求是否是AI/LLM生成类（需要更长超时）
 */
function isLLMRequest(input: RequestInfo | URL): boolean {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  // tRPC batch mutations containing AI-heavy procedures
  return /bazi\.getReading|bazi\.chat|tarot\.getReading|dream\.interpret|horoscope\.getReading/.test(url);
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeout?: number
): Promise<Response> {
  const effectiveTimeout = timeout ?? (isLLMRequest(input) ? NETWORK_CONFIG.llmTimeout : NETWORK_CONFIG.timeout);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), effectiveTimeout);
  
  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 带重试的fetch
 */
async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= NETWORK_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(input, {
        ...init,
        credentials: "include",
      });
      
      // 如果响应成功或是客户端错误（4xx），不重试
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }
      
      // 服务器错误（5xx）可能需要重试
      if (attempt < NETWORK_CONFIG.maxRetries) {
        console.log(`[Network] 请求失败 (${response.status})，${attempt + 1}/${NETWORK_CONFIG.maxRetries} 次重试中...`);
        await new Promise(resolve => setTimeout(resolve, getRetryDelay(attempt)));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // 检查是否是超时错误
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log(`[Network] 请求超时，${attempt + 1}/${NETWORK_CONFIG.maxRetries} 次重试中...`);
      } else if (isRetryableError(error)) {
        console.log(`[Network] 网络错误，${attempt + 1}/${NETWORK_CONFIG.maxRetries} 次重试中...`);
      } else {
        // 不可重试的错误直接抛出
        throw error;
      }
      
      if (attempt < NETWORK_CONFIG.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, getRetryDelay(attempt)));
      }
    }
  }
  
  throw lastError;
}

/**
 * QueryClient配置 - 优化弱网体验
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 重试配置
      retry: (failureCount, error) => {
        if (failureCount >= NETWORK_CONFIG.maxRetries) return false;
        return isRetryableError(error);
      },
      retryDelay: getRetryDelay,
      // 缓存时间
      staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
      gcTime: 30 * 60 * 1000, // 30分钟后清理缓存
      // 网络状态
      networkMode: 'offlineFirst', // 优先使用缓存
      // 重新获取策略
      refetchOnWindowFocus: false, // 窗口聚焦时不自动刷新
      refetchOnReconnect: true, // 网络恢复时刷新
    },
    mutations: {
      retry: (failureCount, error) => {
        if (failureCount >= NETWORK_CONFIG.maxRetries) return false;
        return isRetryableError(error);
      },
      retryDelay: getRetryDelay,
      networkMode: 'offlineFirst',
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch: fetchWithRetry,
      // Batch multiple tRPC calls within a 10ms window into a single HTTP request
      // This reduces the number of network round-trips on slow connections
      maxURLLength: 2048, // Prevent oversized GET URLs
    }),
  ],
});

// Remove skeleton screen with a smooth fade-out once React renders
const root = document.getElementById("root")!;
const skeleton = document.getElementById("skeleton");
if (skeleton) {
  // Add fade-out class, then remove after transition
  skeleton.classList.add('skeleton-hide');
  setTimeout(() => skeleton.remove(), 350);
}

createRoot(root).render(
  <HelmetProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </HelmetProvider>
);
