import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Listens for Service Worker update messages and shows a non-intrusive
 * banner prompting the user to reload for the latest version.
 * 
 * The SW sends { type: 'SW_UPDATED', version } via postMessage when
 * a new version activates. This component catches that and shows a
 * dismissible top banner.
 */
export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "SW_UPDATED") {
        console.log("[UpdateNotification] New version detected:", event.data.version);
        setShowUpdate(true);
      }
    }

    // Listen for messages from the SW
    navigator.serviceWorker.addEventListener("message", handleMessage);

    // Also detect when a new SW is waiting (controllerchange)
    let refreshing = false;
    function handleControllerChange() {
      if (refreshing) return;
      refreshing = true;
      // A new SW has taken control - this happens after skipWaiting + claim
      // The SW already sent SW_UPDATED, but as a safety net:
      setShowUpdate(true);
    }
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  if (!showUpdate) return null;

  const isZh = navigator.language.startsWith("zh");

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999]",
        "bg-gradient-to-r from-amber-600/95 to-amber-500/95 backdrop-blur-sm",
        "text-white shadow-lg",
        "animate-in slide-in-from-top duration-300"
      )}
    >
      <div className="container flex items-center justify-between py-2.5 px-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <RefreshCw size={14} className="animate-spin" style={{ animationDuration: "3s" }} />
          <span>
            {isZh
              ? "新版本已发布，刷新页面获取最新内容"
              : "A new version is available. Reload for the latest experience."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-semibold",
              "bg-white/20 hover:bg-white/30 transition-colors",
              "cursor-pointer"
            )}
          >
            {isZh ? "立即刷新" : "Reload Now"}
          </button>
          <button
            onClick={() => setShowUpdate(false)}
            className="p-1 rounded-md hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
