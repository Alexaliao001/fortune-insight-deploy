import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home, RefreshCw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

const RELOAD_KEY = "chunk-reload-attempted";

function isChunkLoadError(error: Error | null): boolean {
  if (!error) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("failed to fetch dynamically imported module") ||
    msg.includes("loading chunk") ||
    msg.includes("loading css chunk") ||
    msg.includes("dynamically imported module") ||
    msg.includes("failed to load module script") ||
    msg.includes("error loading dynamically imported module")
  );
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const isChunk = isChunkLoadError(error);
    return { hasError: true, error, isChunkError: isChunk };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);

    // Auto-reload for chunk load errors (stale deployment)
    if (isChunkLoadError(error)) {
      const hasReloaded = sessionStorage.getItem(RELOAD_KEY);
      if (!hasReloaded) {
        sessionStorage.setItem(RELOAD_KEY, "true");
        console.warn(
          "[ErrorBoundary] Chunk load error detected, auto-reloading..."
        );
        window.location.reload();
        return;
      }
      // Already tried once, show the error UI
      sessionStorage.removeItem(RELOAD_KEY);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
  };

  handleReload = () => {
    // Clear the flag and force reload
    sessionStorage.removeItem(RELOAD_KEY);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const isZh = navigator.language.startsWith("zh");
      const { isChunkError } = this.state;

      return (
        <div className="flex items-center justify-center min-h-[60vh] p-8">
          <div className="flex flex-col items-center w-full max-w-md text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle size={32} className="text-destructive" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {isChunkError
                  ? isZh
                    ? "页面版本已更新"
                    : "Page version updated"
                  : isZh
                    ? "页面出现了问题"
                    : "Something went wrong"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isChunkError
                  ? isZh
                    ? "网站已发布新版本，请刷新页面加载最新内容。"
                    : "A new version has been deployed. Please reload to get the latest content."
                  : isZh
                    ? "发生了意外错误，请尝试刷新页面"
                    : "An unexpected error occurred. Please try refreshing the page."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isChunkError ? (
                <button
                  onClick={this.handleReload}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-lg",
                    "bg-primary text-primary-foreground",
                    "hover:opacity-90 cursor-pointer text-sm font-medium"
                  )}
                >
                  <RefreshCw size={16} />
                  {isZh ? "刷新页面" : "Reload Page"}
                </button>
              ) : (
                <>
                  <button
                    onClick={this.handleRetry}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "bg-primary text-primary-foreground",
                      "hover:opacity-90 cursor-pointer text-sm font-medium"
                    )}
                  >
                    <RotateCcw size={16} />
                    {isZh ? "重试" : "Try Again"}
                  </button>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "border border-border bg-background text-foreground",
                      "hover:bg-muted cursor-pointer text-sm font-medium"
                    )}
                  >
                    <Home size={16} />
                    {isZh ? "返回首页" : "Go Home"}
                  </button>
                </>
              )}
            </div>

            {!isChunkError && this.state.error?.stack && (
              <details className="text-left text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 w-full">
                <summary className="cursor-pointer font-medium mb-1">
                  {isZh ? "错误详情" : "Error Details"}
                </summary>
                <pre className="whitespace-pre-wrap break-all mt-2 text-[10px]">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
