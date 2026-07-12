import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Crown, X, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
/**
 * Mobile-only sticky bottom bar that drives conversion.
 * Context-aware: shows different CTAs based on which page the user is on.
 * - Info pages (/, /about, /community): "Free Reading" + "Premium"
 * - Feature pages (/tarot, /bazi, /dream, /horoscope): "Go Premium" for free users
 * - Membership page: hidden (already on the conversion page)
 */
export default function MobileStickyBar() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const isZh = language === "zh";

  // Determine page context
  const infoPages = ["/", "/faq", "/about", "/charity", "/community"];
  const featurePages = ["/tarot", "/bazi", "/dream", "/horoscope"];
  const isInfoPage = infoPages.includes(location);
  const isFeaturePage = featurePages.includes(location);
  
  // Show on info pages (always) and feature pages (only for non-premium users)
  // On feature pages, show upgrade CTA only for non-authenticated users
  // (authenticated users may already be premium, and the paywall handles the rest)
  const shouldShow = isInfoPage || (isFeaturePage && !isAuthenticated);

  useEffect(() => {
    if (!shouldShow) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  // Reset dismissed state when navigating to a different page type
  useEffect(() => {
    setDismissed(false);
  }, [isInfoPage, isFeaturePage]);

  if (!shouldShow || dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="glass border-t border-[rgba(212,168,67,0.15)] px-4 py-3 flex items-center gap-2">
        {isFeaturePage ? (
          // On feature pages: show upgrade CTA
          <>
            <Button
              asChild
              size="sm"
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold shadow-lg"
            >
              <Link href="/membership">
                <Crown className="w-4 h-4 mr-1.5" />
                {isZh ? "升级无限次使用" : "Upgrade for Unlimited"}
              </Link>
            </Button>
            <div className="text-[10px] text-muted-foreground leading-tight">
              {isZh ? "低至¥16.6/月" : "From $5/mo"}
            </div>
          </>
        ) : (
          // On info pages: show free reading + premium
          <>
            <Button
              asChild
              size="sm"
              className="flex-1 bg-gradient-to-r from-[#c06080] to-[#d4a843] hover:from-[#b05070] hover:to-[#c09030] text-white font-semibold shadow-lg"
            >
              <Link href="/tarot">
                <Moon className="w-4 h-4 mr-1.5" />
                {isZh ? "免费占卜" : "Free Reading"}
              </Link>
            </Button>
            {!isAuthenticated && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-[rgba(212,168,67,0.3)] text-[#d4a843]"
              >
                <Link href="/membership">
                  <Crown className="w-3.5 h-3.5 mr-1" />
                  {isZh ? "会员" : "Premium"}
                </Link>
              </Button>
            )}
          </>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
