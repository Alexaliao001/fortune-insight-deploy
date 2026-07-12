import { Crown, Sparkles, Zap, ArrowRight, Shield, Clock, Star, Gift, Lock, Eye, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState, useEffect, useMemo } from "react";

interface PaywallCTAProps {
  featureType: "tarot" | "bazi" | "dream" | "horoscope" | "compatibility";
  variant?: "inline" | "modal" | "banner";
  className?: string;
}

const FEATURE_PRODUCTS: Record<string, string> = {
  tarot: "TAROT_SINGLE",
  bazi: "BAZI_SINGLE",
  dream: "DREAM_SINGLE",
  horoscope: "HOROSCOPE_SINGLE",
  compatibility: "COMPATIBILITY_SINGLE",
};

const FEATURE_PRICES: Record<string, string> = {
  tarot: "$1.99",
  bazi: "$4.99",
  dream: "$1.99",
  horoscope: "$1.99",
  compatibility: "$2.99",
};

const FEATURE_NAMES: Record<string, { zh: string; en: string }> = {
  tarot: { zh: "塔罗深度解读", en: "Tarot Deep Reading" },
  bazi: { zh: "八字完整报告", en: "BaZi Full Report" },
  dream: { zh: "解梦深度分析", en: "Dream Deep Analysis" },
  horoscope: { zh: "星座完整运势", en: "Full Horoscope Report" },
  compatibility: { zh: "合盘完整报告", en: "Full Compatibility Report" },
};

// Emotional copy variants - tested against conversion psychology
const EMOTIONAL_COPY = {
  tarot: {
    teaser: {
      zh: "你的牌面暗藏一个重要信号...",
      en: "Your cards reveal a crucial signal...",
    },
    urgency: {
      zh: "牌面能量正在消散，趁它还鲜活",
      en: "Card energies are fading — unlock while fresh",
    },
    desire: {
      zh: "看看命运为你准备了什么惊喜",
      en: "See what destiny has in store for you",
    },
  },
  bazi: {
    teaser: {
      zh: "你的命盘中有一个罕见格局...",
      en: "Your chart contains a rare pattern...",
    },
    urgency: {
      zh: "这份报告揭示了你未来3年的关键转折",
      en: "This report reveals your key turning points for the next 3 years",
    },
    desire: {
      zh: "了解你天生的优势和最佳方向",
      en: "Discover your innate strengths and optimal path",
    },
  },
  dream: {
    teaser: {
      zh: "你的潜意识正在发出一个重要信号...",
      en: "Your subconscious is sending a vital signal...",
    },
    urgency: {
      zh: "梦境记忆会迅速消退，现在解读最准确",
      en: "Dream memories fade fast — decode now for accuracy",
    },
    desire: {
      zh: "揭开梦境背后隐藏的心理密码",
      en: "Unlock the hidden psychological code behind your dream",
    },
  },
  horoscope: {
    teaser: {
      zh: "今天有一个行星相位对你影响巨大...",
      en: "A planetary aspect today impacts you significantly...",
    },
    urgency: {
      zh: "今日运势窗口即将关闭",
      en: "Today's cosmic window is closing",
    },
    desire: {
      zh: "掌握今天最佳行动时机",
      en: "Master today's optimal timing for action",
    },
  },
  compatibility: {
    teaser: {
      zh: "你们之间有一个隐藏的深层连接...",
      en: "There's a hidden deep connection between you...",
    },
    urgency: {
      zh: "了解你们关系中最需要关注的领域",
      en: "Discover the area that needs most attention in your relationship",
    },
    desire: {
      zh: "看看你们的灵魂契合度有多高",
      en: "See how deeply your souls are aligned",
    },
  },
};

// Simulated social proof - recent unlock count
function getRecentUnlocks(): number {
  const hour = new Date().getHours();
  const base = hour >= 8 && hour <= 23 ? 47 : 12;
  return base + (new Date().getMinutes() % 20);
}

// Countdown timer hook
function useCountdown(minutes: number) {
  const [key] = useState(() => {
    const stored = sessionStorage.getItem("paywall_countdown_start");
    if (stored) return parseInt(stored);
    const now = Date.now();
    sessionStorage.setItem("paywall_countdown_start", now.toString());
    return now;
  });

  const [remaining, setRemaining] = useState(() => {
    const elapsed = Date.now() - key;
    return Math.max(0, minutes * 60 * 1000 - elapsed);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - key;
      const left = Math.max(0, minutes * 60 * 1000 - elapsed);
      setRemaining(left);
      if (left <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [key, minutes]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return { mins, secs, expired: remaining <= 0 };
}

export default function PaywallCTA({ featureType, variant = "inline", className = "" }: PaywallCTAProps) {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isEn = language === "en";
  const countdown = useCountdown(15); // 15-minute limited offer
  const recentUnlocks = useMemo(() => getRecentUnlocks(), []);
  const copy = EMOTIONAL_COPY[featureType];
  const featureName = FEATURE_NAMES[featureType];

  const createCheckout = trpc.payment.createCheckout.useMutation({
    onSuccess: (data) => {
      toast.success(isEn ? "Redirecting to checkout..." : "正在跳转到支付页面...");
      window.open(data.checkoutUrl, "_blank");
    },
    onError: (err) => {
      toast.error(err.message || (isEn ? "Payment failed" : "支付失败"));
    },
  });

  const handleBuySingle = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createCheckout.mutate({ productId: FEATURE_PRODUCTS[featureType] });
  };

  const handleSubscribe = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    createCheckout.mutate({ productId: "YEARLY_MEMBERSHIP" });
  };

  if (variant === "banner") {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-[#d4a843]/30 bg-gradient-to-br from-[#1a1520] via-[#0d0f1a] to-[#151020] ${className}`}>
        {/* Animated glow background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-32 bg-[#d4a843]/8 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-48 h-24 bg-purple-500/8 rounded-full blur-[60px]" />
        </div>

        <div className="relative p-6 md:p-8">
          {/* Top bar: Social proof + Countdown */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            {/* Social proof */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="flex -space-x-1.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-gradient-to-br from-[#d4a843]/40 to-purple-500/40 border border-[#d4a843]/20 flex items-center justify-center">
                    <Users className="w-2.5 h-2.5 text-[#d4a843]" />
                  </div>
                ))}
              </div>
              <span>
                {isEn
                  ? `${recentUnlocks} people unlocked in the last hour`
                  : `过去1小时有${recentUnlocks}人解锁了完整报告`}
              </span>
            </div>

            {/* Countdown timer */}
            {!countdown.expired && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                <Clock className="w-3 h-3 text-red-400" />
                <span className="text-xs font-mono text-red-400 tabular-nums">
                  {String(countdown.mins).padStart(2, "0")}:{String(countdown.secs).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-red-400/70">
                  {isEn ? "limited offer" : "限时优惠"}
                </span>
              </div>
            )}
          </div>

          {/* Teaser text - the hook */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4a843]/30 to-[#d4a843]/10 flex items-center justify-center ring-1 ring-[#d4a843]/30">
                <Eye className="w-4 h-4 text-[#d4a843]" />
              </div>
              <p className="text-[#d4a843] font-semibold text-lg font-serif italic">
                "{isEn ? copy.teaser.en : copy.teaser.zh}"
              </p>
            </div>
            <p className="text-gray-400 text-sm ml-10">
              {isEn ? copy.desire.en : copy.desire.zh}
            </p>
          </div>

          {/* Blurred preview teaser - shows "locked" content */}
          <div className="relative rounded-xl overflow-hidden mb-5 border border-[#d4a843]/10">
            <div className="p-4 bg-white/[0.02]">
              <div className="space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4 blur-[3px]" />
                <div className="h-3 bg-white/8 rounded w-full blur-[3px]" />
                <div className="h-3 bg-white/6 rounded w-5/6 blur-[3px]" />
                <div className="h-3 bg-[#d4a843]/10 rounded w-2/3 blur-[3px]" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0d0f1a]/90 via-[#0d0f1a]/50 to-transparent">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/30 backdrop-blur-sm">
                <Lock className="w-4 h-4 text-[#d4a843]" />
                <span className="text-sm text-[#d4a843] font-medium">
                  {isEn ? "Premium content locked" : "付费内容已锁定"}
                </span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Primary: Single purchase - low friction */}
            <Button
              onClick={handleBuySingle}
              disabled={createCheckout.isPending}
              className="flex-1 bg-gradient-to-r from-[#d4a843] to-[#b8922e] hover:from-[#e0b84d] hover:to-[#c9a33a] text-black font-bold shadow-lg shadow-[#d4a843]/20 h-12 text-base"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isEn ? `Unlock for ${FEATURE_PRICES[featureType]}` : `${FEATURE_PRICES[featureType]} 立即解锁`}
            </Button>

            {/* Secondary: Subscribe */}
            <Button
              onClick={handleSubscribe}
              disabled={createCheckout.isPending}
              variant="outline"
              className="flex-1 border-[#d4a843]/40 text-[#d4a843] hover:bg-[#d4a843]/10 h-12"
            >
              <Crown className="w-4 h-4 mr-2" />
              {isEn ? "Unlimited $5/mo" : "无限畅享 $5/月"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {isEn ? "Stripe Secure" : "Stripe安全支付"}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {isEn ? "Instant Access" : "即时解锁"}
            </span>
            <span className="flex items-center gap-1">
              <Gift className="w-3 h-3" />
              {isEn ? "7-day refund" : "7天退款保证"}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-pink-400/60" />
              {isEn ? "10% to charity" : "10%公益捐赠"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // inline variant - compact but emotionally engaging
  return (
    <div className={`flex flex-col items-center gap-3 py-5 ${className}`}>
      <p className="text-sm text-[#d4a843]/80 font-serif italic text-center">
        "{isEn ? copy.teaser.en : copy.teaser.zh}"
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Users className="w-3 h-3" />
        <span>{isEn ? `${recentUnlocks} unlocked recently` : `${recentUnlocks}人最近解锁`}</span>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={handleBuySingle}
          disabled={createCheckout.isPending}
          className="bg-gradient-to-r from-[#d4a843] to-[#b8922e] hover:from-[#e0b84d] hover:to-[#c9a33a] text-black font-bold"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          {isEn ? `Unlock ${FEATURE_PRICES[featureType]}` : `${FEATURE_PRICES[featureType]} 解锁`}
        </Button>
        <Button
          onClick={handleSubscribe}
          disabled={createCheckout.isPending}
          variant="outline"
          className="border-[#d4a843]/40 text-[#d4a843] hover:bg-[#d4a843]/10"
        >
          <Crown className="w-3.5 h-3.5 mr-1" />
          {isEn ? "$5/mo unlimited" : "$5/月无限"}
        </Button>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-0.5"><Shield className="w-3 h-3" /> {isEn ? "Secure" : "安全"}</span>
        <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" /> {isEn ? "Instant" : "即时"}</span>
        <span className="flex items-center gap-0.5"><Gift className="w-3 h-3" /> {isEn ? "7-day refund" : "7天退款"}</span>
      </div>
    </div>
  );
}
