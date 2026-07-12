import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

/**
 * 通用骨架屏组件
 * 用于在内容加载时显示占位符
 */
export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseStyles = "bg-muted";
  
  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };
  
  const animationStyles = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };
  
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };
  
  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={style}
    />
  );
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass-card rounded-xl p-6 space-y-4", className)}>
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton width="60%" height={24} />
      <div className="space-y-2">
        <Skeleton width="100%" height={16} />
        <Skeleton width="80%" height={16} />
        <Skeleton width="90%" height={16} />
      </div>
      <Skeleton variant="rounded" width="100%" height={40} />
    </div>
  );
}

/**
 * 列表项骨架屏
 */
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 p-4", className)}>
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height={16} />
        <Skeleton width="70%" height={14} />
      </div>
      <Skeleton width={60} height={24} />
    </div>
  );
}

/**
 * 表单骨架屏
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width={80} height={16} />
          <Skeleton variant="rounded" width="100%" height={40} />
        </div>
      ))}
      <Skeleton variant="rounded" width="100%" height={44} />
    </div>
  );
}

/**
 * 统计数据骨架屏
 */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-4 text-center space-y-2">
          <Skeleton width={60} height={32} className="mx-auto" />
          <Skeleton width={80} height={14} className="mx-auto" />
        </div>
      ))}
    </div>
  );
}

/**
 * 阅读报告骨架屏
 */
export function ReadingReportSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      {/* 标题 */}
      <div className="text-center space-y-2">
        <Skeleton width={200} height={28} className="mx-auto" />
        <Skeleton width={300} height={16} className="mx-auto" />
      </div>
      
      {/* 内容段落 */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton width="100%" height={16} />
            <Skeleton width="95%" height={16} />
            <Skeleton width="88%" height={16} />
            <Skeleton width="92%" height={16} />
          </div>
        ))}
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-center gap-4">
        <Skeleton variant="rounded" width={120} height={40} />
        <Skeleton variant="rounded" width={120} height={40} />
      </div>
    </div>
  );
}

/**
 * 塔罗牌骨架屏
 */
export function TarotCardSkeleton() {
  return (
    <div className="w-32 h-48 glass-card rounded-xl animate-pulse flex items-center justify-center">
      <Skeleton variant="circular" width={40} height={40} />
    </div>
  );
}

/**
 * 用户资料骨架屏
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="space-y-2">
          <Skeleton width={120} height={24} />
          <Skeleton width={180} height={16} />
        </div>
      </div>
      
      {/* 统计 */}
      <StatsSkeleton count={3} />
      
      {/* 列表 */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
