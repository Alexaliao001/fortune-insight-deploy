/**
 * 页面加载骨架屏组件 - 纯CSS实现
 * 使用CSS @keyframes实现与framer-motion完全一致的动画效果：
 * - 标题区域: fadeIn 淡入
 * - 卡片: fadeSlideUp 从下方滑入，逐个延迟
 * - 加载指示器: 匀速旋转
 * 不引入framer-motion，确保骨架屏零额外JS依赖
 */
export default function PageLoadingSkeleton() {
  return (
    <>
      {/* Inline keyframes for skeleton animations */}
      <style>{`
        @keyframes skFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes skFadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes skSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div className="min-h-screen flex flex-col bg-background">
        {/* 导航栏骨架 */}
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
          <div className="container flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              <div className="w-24 h-5 bg-muted rounded animate-pulse" />
            </div>
            <div className="hidden md:flex items-center gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-16 h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-8 bg-muted rounded-full animate-pulse" />
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </header>

        {/* 主内容区骨架 */}
        <main className="flex-1 pt-24 pb-12">
          <div className="container max-w-4xl">
            {/* 标题区域 - fadeIn */}
            <div className="text-center mb-12" style={{ animation: 'skFadeIn 0.3s ease-out forwards' }}>
              <div className="space-y-4">
                <div className="w-32 h-8 bg-muted rounded-full mx-auto animate-pulse" />
                <div className="w-64 h-10 bg-muted rounded mx-auto animate-pulse" />
                <div className="w-96 max-w-full h-5 bg-muted rounded mx-auto animate-pulse" />
              </div>
            </div>

            {/* 内容卡片骨架 - fadeSlideUp with staggered delay */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="glass-card rounded-xl p-6 space-y-4"
                  style={{
                    opacity: 0,
                    animation: `skFadeSlideUp 0.4s ease-out ${i * 0.1}s forwards`,
                  }}
                >
                  <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                  <div className="w-24 h-6 bg-muted rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-muted rounded animate-pulse" />
                    <div className="w-3/4 h-4 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="w-full h-10 bg-muted rounded-lg animate-pulse" />
                </div>
              ))}
            </div>

            {/* 加载指示器 - 匀速旋转 */}
            <div className="flex justify-center mt-12">
              <div
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                style={{ animation: 'skSpin 1s linear infinite' }}
              />
            </div>
          </div>
        </main>

        {/* 星空背景效果 */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 stars-bg opacity-30" />
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(64, 188, 194, 0.3) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(208, 104, 136, 0.3) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
      </div>
    </>
  );
}
