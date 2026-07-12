import { useState, useEffect, useRef, useCallback } from "react";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  label?: string;
  labelClassName?: string;
}

/**
 * AnimatedCounter - 数字递增动画
 * 使用 IntersectionObserver + CSS transition 实现与 framer-motion 完全一致的视觉效果：
 * - 进入视口时从 opacity:0 scale:0.5 → opacity:1 scale:1
 * - 数字从0递增到目标值，使用 ease-out cubic 缓动
 */
export default function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  label,
  labelClassName = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // IntersectionObserver replaces framer-motion's useInView
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );
    observer.observe(el);
    // Fallback: force visible after 3s if IntersectionObserver fails
    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated.current) {
        setIsVisible(true);
      }
    }, 3000);
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Number counting animation - identical easing to original
  const startAnimation = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic - same as original
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  useEffect(() => {
    if (isVisible) startAnimation();
  }, [isVisible, startAnimation]);

  return (
    <div ref={ref} className="text-center">
      <div
        className={className}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        }}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      {label && (
        <div className={labelClassName}>{label}</div>
      )}
    </div>
  );
}
