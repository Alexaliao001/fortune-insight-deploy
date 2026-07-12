import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Zap, Gift, ArrowRight, Check, LogIn, Lock, Clock, Users, Shield, Heart, Star, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

interface UsageLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureType: "tarot" | "bazi" | "dream";
  featureName: string;
  featureNameEn: string;
}

// 产品推荐映射
const FEATURE_PRODUCTS: Record<string, { single: string; pack?: string }> = {
  tarot: { single: "TAROT_SINGLE", pack: "TAROT_PACK_3" },
  bazi: { single: "BAZI_SINGLE" },
  dream: { single: "DREAM_SINGLE", pack: "DREAM_PACK_5" },
};

const PRODUCT_INFO: Record<string, { price: string; credits: number; nameZh: string; nameEn: string; saving?: string }> = {
  TAROT_SINGLE: { price: "$1.99", credits: 1, nameZh: "塔罗深度解读", nameEn: "Tarot Deep Reading", },
  TAROT_PACK_3: { price: "$4.99", credits: 3, nameZh: "塔罗3次包", nameEn: "Tarot 3-Pack", saving: "17%" },
  BAZI_SINGLE: { price: "$4.99", credits: 1, nameZh: "八字完整报告", nameEn: "BaZi Full Report" },
  DREAM_SINGLE: { price: "$1.99", credits: 1, nameZh: "解梦深度分析", nameEn: "Dream Deep Analysis" },
  DREAM_PACK_5: { price: "$7.99", credits: 5, nameZh: "解梦5次包", nameEn: "Dream 5-Pack", saving: "20%" },
};

import { TarotIcon, BaZiIcon, DreamIcon } from "@/components/icons/FeatureIcons";

const FEATURE_ICON: Record<string, React.ReactNode> = {
  tarot: <TarotIcon size={40} />,
  bazi: <BaZiIcon size={40} />,
  dream: <DreamIcon size={40} />,
};

// Positive framing - "your report is ready" instead of "you've hit the limit"
const POSITIVE_TITLES: Record<string, { zh: string; en: string }> = {
  tarot: { zh: "你的牌面解读已准备好", en: "Your Card Reading is Ready" },
  bazi: { zh: "你的命盘报告已生成", en: "Your Destiny Chart is Ready" },
  dream: { zh: "你的梦境深层含义已解析", en: "Your Dream Meaning is Decoded" },
};

// Emotional desire hooks
const DESIRE_HOOKS: Record<string, { zh: string; en: string }> = {
  tarot: {
    zh: "牌面暗藏一个重要信号...解锁看看命运为你准备了什么",
    en: "Your cards reveal a crucial signal... unlock to see what destiny has prepared",
  },
  bazi: {
    zh: "你的命盘中有一个罕见格局，了解它可能改变你的方向",
    en: "Your chart contains a rare pattern that could change your direction",
  },
  dream: {
    zh: "你的潜意识正在告诉你一些重要的事情，不要错过这个信号",
    en: "Your subconscious is sending a vital signal — don't miss it",
  },
};

function getRecentUnlocks(): number {
  const hour = new Date().getHours();
  const base = hour >= 8 && hour <= 23 ? 47 : 12;
  return base + (new Date().getMinutes() % 20);
}

export function UsageLimitModal({ open, onOpenChange, featureType, featureName, featureNameEn }: UsageLimitModalProps) {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const t = language === "zh";
  const [loading, setLoading] = useState<string | null>(null);
  const recentUnlocks = useMemo(() => getRecentUnlocks(), []);
  const featureIcon = FEATURE_ICON[featureType] || <Sparkles className="w-10 h-10 text-primary" />;
  const positiveTitle = POSITIVE_TITLES[featureType];
  const desireHook = DESIRE_HOOKS[featureType];

  // Countdown urgency
  const [countdown, setCountdown] = useState(15 * 60);
  useEffect(() => {
    if (!open) return;
    setCountdown(15 * 60); // Reset on open
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  const createCheckout = trpc.payment.createCheckout.useMutation({
    onSuccess: (data) => {
      window.open(data.checkoutUrl, "_blank");
      toast.success(t ? "支付页面已在新标签页打开..." : "Checkout opened in new tab...");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(t ? "创建支付失败，请重试" : "Failed to create checkout, please try again");
      console.error(error);
    },
    onSettled: () => setLoading(null),
  });

  const handlePurchase = (productId: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setLoading(productId);
    createCheckout.mutate({ productId });
  };

  const products = FEATURE_PRODUCTS[featureType];
  if (!products) return null;

  const singleProduct = PRODUCT_INFO[products.single];
  const packProduct = products.pack ? PRODUCT_INFO[products.pack] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-gradient-to-b from-gray-900/95 to-gray-950/95 border border-[#d4a843]/20 backdrop-blur-xl text-white p-0 overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-[#d4a843] via-purple-500 to-[#d4a843]" />

        <div className="p-6 pt-5">
          {/* Header - Positive framing */}
          <DialogHeader className="text-center mb-3">
            <div className="mb-2 flex justify-center">{featureIcon}</div>
            <DialogTitle className="text-xl font-serif text-amber-200">
              {t ? positiveTitle.zh : positiveTitle.en}
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-2 font-serif italic">
              "{t ? desireHook.zh : desireHook.en}"
            </DialogDescription>
          </DialogHeader>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
            <div className="flex -space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-[#d4a843]/40 to-purple-500/40 border border-[#d4a843]/20" />
              ))}
            </div>
            <span>
              {t
                ? `过去1小时有${recentUnlocks}人解锁了完整报告`
                : `${recentUnlocks} people unlocked in the last hour`}
            </span>
          </div>

          {/* Blurred preview teaser - "you can almost see it" */}
          <div className="relative rounded-xl overflow-hidden mb-4 border border-[#d4a843]/10">
            <div className="p-4 bg-white/[0.02]">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-[#d4a843]/30" />
                  <div className="h-2.5 bg-[#d4a843]/12 rounded w-2/3 blur-[3px]" />
                </div>
                <div className="h-2 bg-white/6 rounded w-full blur-[3px]" />
                <div className="h-2 bg-white/5 rounded w-5/6 blur-[3px]" />
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-purple-400/30" />
                  <div className="h-2.5 bg-purple-400/12 rounded w-3/4 blur-[3px]" />
                </div>
                <div className="h-2 bg-white/5 rounded w-4/5 blur-[3px]" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-gray-950/90 via-gray-950/50 to-transparent">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/25 backdrop-blur-sm">
                <Lock className="w-3.5 h-3.5 text-[#d4a843]" />
                <span className="text-xs text-[#d4a843] font-medium">
                  {t ? "解锁查看完整内容" : "Unlock to reveal"}
                </span>
              </div>
            </div>
          </div>

          {/* Countdown urgency */}
          {countdown > 0 && (
            <div className="flex items-center justify-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/15">
              <Clock className="w-3 h-3 text-red-400" />
              <span className="text-[11px] text-red-400">
                {t ? "限时优惠剩余 " : "Special offer expires in "}
                <span className="font-mono font-bold tabular-nums">
                  {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                </span>
              </span>
            </div>
          )}

          {/* Guest: Show login CTA first */}
          {!isAuthenticated && (
            <div className="space-y-3">
              <a
                href={getLoginUrl()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-4 text-amber-100 font-medium transition-all hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              >
                <LogIn className="w-5 h-5" />
                {t ? "登录 / 注册" : "Sign In / Sign Up"}
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
              <p className="text-center text-xs text-gray-500">
                {t ? "登录后可购买单次解读或开通无限会员" : "Sign in to purchase single readings or unlimited membership"}
              </p>
            </div>
          )}

          {/* Logged-in: Show purchase options */}
          {isAuthenticated && (
            <div className="space-y-3">
              {/* 单次购买 */}
              <button
                onClick={() => handlePurchase(products.single)}
                disabled={loading !== null}
                className="w-full group relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/10 p-4 text-left transition-all hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-medium text-amber-100">
                        {t ? singleProduct.nameZh : singleProduct.nameEn}
                      </div>
                      <div className="text-sm text-gray-400">
                        {t ? `${singleProduct.credits}次使用 · 即时解锁` : `${singleProduct.credits} use · Instant access`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-300">{singleProduct.price}</div>
                    {loading === products.single && (
                      <div className="text-xs text-amber-400 animate-pulse">{t ? "处理中..." : "Processing..."}</div>
                    )}
                  </div>
                </div>
              </button>

              {/* 多次包（如果有） */}
              {packProduct && products.pack && (
                <button
                  onClick={() => handlePurchase(products.pack!)}
                  disabled={loading !== null}
                  className="w-full group relative overflow-hidden rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-4 text-left transition-all hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] disabled:opacity-50"
                >
                  {packProduct.saving && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs">
                      {t ? `省${packProduct.saving}` : `Save ${packProduct.saving}`}
                    </Badge>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Gift className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium text-purple-100">
                          {t ? packProduct.nameZh : packProduct.nameEn}
                        </div>
                        <div className="text-sm text-gray-400">
                          {t ? `${packProduct.credits}次使用 · 更划算` : `${packProduct.credits} uses · Better value`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-300">{packProduct.price}</div>
                      {loading === products.pack && (
                        <div className="text-xs text-purple-400 animate-pulse">{t ? "处理中..." : "Processing..."}</div>
                      )}
                    </div>
                  </div>
                </button>
              )}

              {/* 分割线 */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-gray-900 px-3 text-xs text-gray-500 uppercase">
                    {t ? "或者" : "or"}
                  </span>
                </div>
              </div>

              {/* 会员推荐 - Primary CTA for higher LTV */}
              <button
                onClick={() => handlePurchase("YEARLY_MEMBERSHIP")}
                disabled={loading !== null}
                className="w-full group relative overflow-hidden rounded-xl border border-[#d4a843]/40 bg-gradient-to-r from-[#d4a843]/5 via-[#d4a843]/10 to-[#d4a843]/5 p-4 text-left transition-all hover:border-[#d4a843]/60 hover:shadow-[0_0_30px_rgba(212,168,67,0.2)] disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a843]/30 to-[#d4a843]/10 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-[#d4a843]" />
                    </div>
                    <div>
                      <div className="font-medium text-amber-100 flex items-center gap-2">
                        {t ? "年度会员 · 无限畅享" : "Yearly · Unlimited Access"}
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                          {t ? "省50%" : "Save 50%"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Check className="w-3 h-3 text-[#d4a843]" />
                        <span>{t ? "无限塔罗" : "Tarot"}</span>
                        <Check className="w-3 h-3 text-[#d4a843]" />
                        <span>{t ? "无限八字" : "BaZi"}</span>
                        <Check className="w-3 h-3 text-[#d4a843]" />
                        <span>{t ? "无限解梦" : "Dreams"}</span>
                        <Check className="w-3 h-3 text-[#d4a843]" />
                        <span>{t ? "全部功能" : "All"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="text-lg font-bold text-[#d4a843]">$5.00</div>
                    <div className="text-xs text-gray-500">{t ? "/月" : "/mo"}</div>
                    <ArrowRight className="w-4 h-4 text-[#d4a843] mt-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-gray-600">
            <span className="flex items-center gap-0.5"><Shield className="w-3 h-3" /> Stripe</span>
            <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" /> {t ? "即时" : "Instant"}</span>
            <span className="flex items-center gap-0.5"><Gift className="w-3 h-3" /> {t ? "7天退款" : "7-day refund"}</span>
            <span className="flex items-center gap-0.5"><Heart className="w-3 h-3 text-pink-400/50" /> {t ? "公益" : "Charity"}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
