import { useEffect, useRef } from "react";

/**
 * Hook that uses IntersectionObserver to reveal elements on scroll.
 * Replaces framer-motion whileInView for better performance and reliability.
 * 
 * Usage:
 *   const ref = useRevealOnScroll();
 *   <div ref={ref} className="reveal-on-scroll">...</div>
 * 
 * For staggered children:
 *   const ref = useRevealOnScroll({ stagger: true });
 *   <div ref={ref} className="reveal-stagger">
 *     <div className="reveal-on-scroll" style={{ '--reveal-index': 0 }}>...</div>
 *     <div className="reveal-on-scroll" style={{ '--reveal-index': 1 }}>...</div>
 *   </div>
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  stagger?: boolean;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const threshold = options?.threshold ?? 0.1;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (options?.stagger) {
              // Reveal all children with reveal-on-scroll class
              const children = el.querySelectorAll(".reveal-on-scroll");
              children.forEach((child) => {
                child.classList.add("revealed");
              });
            } else {
              entry.target.classList.add("revealed");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [options?.threshold, options?.stagger]);

  return ref;
}
