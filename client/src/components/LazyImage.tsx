import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number | string;
  height?: number | string;
  // 低质量占位图
  placeholder?: string;
  // 加载失败时的备用图
  fallback?: string;
  // 是否启用渐进式加载
  progressive?: boolean;
  // 触发加载的阈值（距离视口的距离）
  threshold?: number;
  // 加载完成回调
  onLoad?: () => void;
  // 加载失败回调
  onError?: () => void;
}

/**
 * 图片懒加载组件
 * 
 * 特性：
 * 1. Intersection Observer实现懒加载
 * 2. 骨架屏占位
 * 3. 渐进式加载效果
 * 4. 加载失败回退
 * 5. 低质量图片占位（LQIP）
 */
export function LazyImage({
  src,
  alt,
  className,
  placeholderClassName,
  width,
  height,
  placeholder,
  fallback = "/placeholder-image.svg",
  progressive = true,
  threshold = 200,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer监听
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(container);
          }
        });
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0,
      }
    );

    observer.observe(container);

    // Fallback: force load after 3s if IntersectionObserver fails
    const fallbackTimer = setTimeout(() => {
      setIsInView(true);
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [threshold]);

  // 当进入视口时开始加载图片
  useEffect(() => {
    if (!isInView) return;

    // 如果有占位图，先显示占位图
    if (placeholder && progressive) {
      setCurrentSrc(placeholder);
    }

    // 预加载真实图片
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);
      setCurrentSrc(fallback);
      onError?.();
    };
  }, [isInView, src, placeholder, fallback, progressive, onLoad, onError]);

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={style}
    >
      {/* 骨架屏占位 */}
      {!isLoaded && !hasError && (
        <Skeleton
          variant="rectangular"
          className={cn(
            "absolute inset-0 w-full h-full",
            placeholderClassName
          )}
        />
      )}

      {/* 图片 */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            // 渐进式加载时的模糊效果
            progressive && !isLoaded && currentSrc === placeholder
              ? "blur-sm scale-105"
              : "blur-0 scale-100"
          )}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* 加载失败提示 */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <span className="text-xs text-muted-foreground">图片加载失败</span>
        </div>
      )}
    </div>
  );
}

/**
 * 背景图片懒加载组件
 */
export function LazyBackgroundImage({
  src,
  className,
  children,
  placeholder,
  threshold = 200,
}: {
  src: string;
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
  threshold?: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(container);
          }
        });
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0,
      }
    );

    observer.observe(container);

    // Fallback: force load after 3s if IntersectionObserver fails
    const fallbackTimer = setTimeout(() => {
      setIsInView(true);
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [threshold]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [isInView, src]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-cover bg-center bg-no-repeat transition-all duration-500",
        isLoaded ? "" : "blur-sm",
        className
      )}
      style={{
        backgroundImage: isLoaded
          ? `url(${src})`
          : placeholder
          ? `url(${placeholder})`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}

export default LazyImage;
