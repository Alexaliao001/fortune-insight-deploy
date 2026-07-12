import { useEffect } from "react";

/**
 * Global animation fallback hook.
 * 
 * Problem: In production, third-party scripts injected by the hosting platform
 * (e.g., some host editors) can interfere with framer-motion's animation lifecycle,
 * causing elements with initial={{ opacity: 0 }} to remain invisible forever.
 * 
 * Solution: After a delay, scan the DOM for elements that are still at opacity 0
 * and force them visible. Also watches for new elements added dynamically (e.g., 
 * lazy-loaded pages) and applies the same fix.
 */

function forceVisibleIfStuck(root: Element | Document = document) {
  const elements = root.querySelectorAll("main *, [class*='container'] *");
  let fixed = 0;
  
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    
    // Skip non-rendered elements
    if (!htmlEl.offsetParent && htmlEl.style.position !== "fixed") return;
    
    // Skip elements explicitly marked
    if (htmlEl.hasAttribute("data-no-fallback")) return;
    
    // Skip decorative elements by class
    const cls = htmlEl.className;
    if (typeof cls === "string" && (
      cls.includes("shooting-star") ||
      cls.includes("starry") ||
      cls.includes("cursor") ||
      cls.includes("loading") ||
      cls.includes("skeleton") ||
      cls.includes("shimmer") ||
      cls.includes("backdrop") ||
      cls.includes("overlay")
    )) return;
    
    const computed = window.getComputedStyle(htmlEl);
    
    // Skip hidden elements
    if (computed.display === "none" || computed.visibility === "hidden") return;
    
    const opacity = parseFloat(computed.opacity);
    
    // Element is stuck at opacity 0 with content
    if (opacity === 0) {
      const hasContent = htmlEl.textContent?.trim() || htmlEl.children.length > 0;
      const hasInlineOpacity = htmlEl.style.opacity !== "";
      const hasInlineTransform = htmlEl.style.transform !== "";
      
      // Only fix elements that appear to be framer-motion targets
      // (they have inline styles set by the animation library)
      if (hasContent && (hasInlineOpacity || hasInlineTransform)) {
        htmlEl.style.opacity = "1";
        htmlEl.style.transform = "none";
        htmlEl.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
        fixed++;
      }
    }
  });
  
  if (fixed > 0) {
    console.log(`[AnimationFallback] Fixed ${fixed} stuck elements`);
  }
}

export function useAnimationFallback(delay = 2000) {
  useEffect(() => {
    // Initial scan after delay
    const timer = setTimeout(() => {
      forceVisibleIfStuck();
    }, delay);

    // Watch for dynamically added content (lazy-loaded pages)
    // and run fallback on new content after a short delay
    const observer = new MutationObserver((mutations) => {
      let hasNewContent = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const node of Array.from(mutation.addedNodes)) {
            if (node instanceof HTMLElement && node.querySelector("[style]")) {
              hasNewContent = true;
              break;
            }
          }
        }
        if (hasNewContent) break;
      }
      
      if (hasNewContent) {
        // Give framer-motion time to animate, then check for stuck elements
        setTimeout(() => forceVisibleIfStuck(), delay);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay]);
}
