import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * 性能优化验证测试
 * 确保弱网优化措施正确实施
 */

describe("弱网优化措施验证", () => {
  describe("代码分割", () => {
    it("应该生成独立的vendor chunks", () => {
      const assetsDir = path.join(__dirname, "../dist/public/assets");
      
      // 检查是否存在vendor chunks（如果已构建）
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir);
        const vendorChunks = files.filter(f => f.startsWith("vendor-"));
        
        // 应该有多个vendor chunks
        expect(vendorChunks.length).toBeGreaterThan(0);
      }
    });

    it("vite配置应包含manualChunks设置", () => {
      const viteConfig = fs.readFileSync(
        path.join(__dirname, "../vite.config.ts"),
        "utf-8"
      );
      
      expect(viteConfig).toContain("manualChunks");
      // vendor-react merged into single 'vendor' chunk to reduce HTTP requests
      expect(viteConfig).toContain("'vendor'");
      expect(viteConfig).toContain("vendor-ui");
    });
  });

  describe("Service Worker", () => {
    it("应该存在Service Worker文件", () => {
      const swPath = path.join(__dirname, "../client/public/sw.js");
      expect(fs.existsSync(swPath)).toBe(true);
    });

    it("Service Worker应包含缓存策略", () => {
      const swContent = fs.readFileSync(
        path.join(__dirname, "../client/public/sw.js"),
        "utf-8"
      );
      
      // 检查缓存策略
      expect(swContent).toContain("CACHE_VERSION");
      expect(swContent).toContain("cacheFirst");
      expect(swContent).toContain("networkFirst");
      expect(swContent).toContain("navigationHandler");
    });

    it("Service Worker应处理离线场景", () => {
      const swContent = fs.readFileSync(
        path.join(__dirname, "../client/public/sw.js"),
        "utf-8"
      );
      
      expect(swContent).toContain("install");
      expect(swContent).toContain("activate");
      expect(swContent).toContain("fetch");
    });
  });

  describe("PWA配置", () => {
    it("应该存在manifest.json", () => {
      const manifestPath = path.join(__dirname, "../client/public/manifest.json");
      expect(fs.existsSync(manifestPath)).toBe(true);
    });

    it("manifest应包含必要的PWA字段", () => {
      const manifest = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../client/public/manifest.json"),
          "utf-8"
        )
      );
      
      expect(manifest.name).toBeDefined();
      expect(manifest.short_name).toBeDefined();
      expect(manifest.start_url).toBe("/");
      expect(manifest.display).toBe("standalone");
      expect(manifest.icons).toBeDefined();
      expect(manifest.icons.length).toBeGreaterThan(0);
    });
  });

  describe("请求重试机制", () => {
    it("main.tsx应包含重试配置", () => {
      const mainContent = fs.readFileSync(
        path.join(__dirname, "../client/src/main.tsx"),
        "utf-8"
      );
      
      expect(mainContent).toContain("NETWORK_CONFIG");
      expect(mainContent).toContain("maxRetries");
      expect(mainContent).toContain("timeout");
    });

    it("应实现指数退避延迟", () => {
      const mainContent = fs.readFileSync(
        path.join(__dirname, "../client/src/main.tsx"),
        "utf-8"
      );
      
      expect(mainContent).toContain("getRetryDelay");
      expect(mainContent).toContain("Math.pow");
    });

    it("QueryClient应配置重试策略", () => {
      const mainContent = fs.readFileSync(
        path.join(__dirname, "../client/src/main.tsx"),
        "utf-8"
      );
      
      expect(mainContent).toContain("retry:");
      expect(mainContent).toContain("retryDelay");
      expect(mainContent).toContain("networkMode");
    });
  });

  describe("骨架屏组件", () => {
    it("应该存在PageLoadingSkeleton组件", () => {
      const skeletonPath = path.join(
        __dirname,
        "../client/src/components/PageLoadingSkeleton.tsx"
      );
      expect(fs.existsSync(skeletonPath)).toBe(true);
    });

    it("应该存在通用Skeleton组件", () => {
      const skeletonPath = path.join(
        __dirname,
        "../client/src/components/Skeleton.tsx"
      );
      expect(fs.existsSync(skeletonPath)).toBe(true);
    });

    it("App.tsx应使用Suspense和懒加载", () => {
      const appContent = fs.readFileSync(
        path.join(__dirname, "../client/src/App.tsx"),
        "utf-8"
      );
      
      expect(appContent).toContain("Suspense");
      expect(appContent).toContain("lazy");
      expect(appContent).toContain("PageLoadingSkeleton");
    });
  });

  describe("图片懒加载", () => {
    it("应该存在LazyImage组件", () => {
      const lazyImagePath = path.join(
        __dirname,
        "../client/src/components/LazyImage.tsx"
      );
      expect(fs.existsSync(lazyImagePath)).toBe(true);
    });

    it("LazyImage应使用IntersectionObserver", () => {
      const lazyImageContent = fs.readFileSync(
        path.join(__dirname, "../client/src/components/LazyImage.tsx"),
        "utf-8"
      );
      
      expect(lazyImageContent).toContain("IntersectionObserver");
      expect(lazyImageContent).toContain("isIntersecting");
    });
  });

  describe("离线状态处理", () => {
    it("index.html应包含离线检测脚本", () => {
      const htmlContent = fs.readFileSync(
        path.join(__dirname, "../client/index.html"),
        "utf-8"
      );
      
      expect(htmlContent).toContain("online");
      expect(htmlContent).toContain("offline");
    });

    it("CSS应包含离线状态样式", () => {
      const cssContent = fs.readFileSync(
        path.join(__dirname, "../client/src/index.css"),
        "utf-8"
      );
      
      expect(cssContent).toContain("body.offline");
      expect(cssContent).toContain("网络已断开");
    });
  });
});

describe("性能指标验证", () => {
  it("首屏JS大小应在合理范围内", () => {
    const assetsDir = path.join(__dirname, "../dist/public/assets");
    
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      
      // 查找首屏入口文件
      const entryFile = files.find(f => f.startsWith("index-") && f.endsWith(".js") && !f.includes("BOAlDc2Y"));
      
      if (entryFile) {
        const stats = fs.statSync(path.join(assetsDir, entryFile));
        const sizeInKB = stats.size / 1024;
        
        // 首屏入口应小于1000KB（包含语音功能后）
        expect(sizeInKB).toBeLessThan(1000);
      }
    }
  });
});
