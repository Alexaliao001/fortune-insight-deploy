import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Zap, Calendar, ArrowRight, Sparkles, Moon, BarChart3, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function MembershipStatusCard() {
  const { language } = useTranslation();
  const isZh = language === "zh";
  const { data: membership, isLoading } = trpc.payment.getMembership.useQuery();

  if (isLoading) {
    return (
      <Card className="glass-card border-cosmic-gold/20 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isActive = membership && membership.status === "active";
  const endDate = membership?.endDate ? new Date(membership.endDate) : null;
  const isLifetime = membership?.type === "lifetime" && !membership?.isTrial;
  const isTrial = !!membership?.isTrial || !!membership?.paymentMethod?.startsWith("trial:");
  const daysLeft = membership?.daysLeft as number | null | undefined;

  const typeLabels: Record<string, { zh: string; en: string }> = {
    monthly: { zh: "月度会员", en: "Monthly" },
    yearly: { zh: "年度会员", en: "Yearly" },
    lifetime: { zh: "终身会员", en: "Lifetime" },
  };

  if (isActive) {
    return (
      <Card className="glass-card border-cosmic-gold/40 mb-6 overflow-hidden relative">
        {/* Premium shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cosmic-gold/5 to-transparent animate-shimmer pointer-events-none" />
        <CardContent className="p-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cosmic-gold to-amber-600 flex items-center justify-center shrink-0 shadow-lg shadow-cosmic-gold/20">
              <Crown className="w-7 h-7 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-cosmic-gold">
                  {isTrial
                    ? isZh
                      ? "免费试用中"
                      : "Free Trial Active"
                    : isZh
                      ? "Premium 会员"
                      : "Premium Member"}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cosmic-gold/20 text-cosmic-gold font-medium">
                  {isTrial
                    ? isZh
                      ? "14天试用"
                      : "14-day trial"
                    : typeLabels[membership.type]?.[isZh ? "zh" : "en"] || membership.type}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isZh ? "无限使用所有功能" : "Unlimited access to all features"}</span>
                </div>
                {!isLifetime && endDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {isTrial && typeof daysLeft === "number"
                        ? isZh
                          ? `剩余 ${daysLeft} 天 · 到期 ${endDate.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}`
                          : `${daysLeft} days left · expires ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : `${isZh ? "到期：" : "Expires: "}${endDate.toLocaleDateString(isZh ? "zh-CN" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}`}
                    </span>
                  </div>
                )}
                {isLifetime && (
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cosmic-gold" />
                    <span>{isZh ? "永不过期" : "Never expires"}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-cosmic-gold/70">
              <Zap className="w-4 h-4" />
              <span>
                {isTrial
                  ? isZh
                    ? "试用结束后可升级续期"
                    : "Upgrade anytime after trial"
                  : isZh
                    ? "感谢您的支持！"
                    : "Thank you for your support!"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Free user - show upgrade CTA
  return (
    <Card className="glass-card border-violet-500/30 mb-6 overflow-hidden relative group">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 flex items-center justify-center shrink-0 group-hover:from-cosmic-gold/30 group-hover:to-amber-500/30 transition-all duration-500">
            <Crown className="w-7 h-7 text-violet-400 group-hover:text-cosmic-gold transition-colors duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold mb-1">
              {isZh ? "免费用户" : "Free Plan"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isZh
                ? "升级 Premium 解锁无限次数和深度分析报告"
                : "Upgrade to Premium for unlimited readings and in-depth reports"}
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-cosmic-gold to-amber-500 hover:from-cosmic-gold/90 hover:to-amber-500/90 text-black font-semibold gap-2 shrink-0"
          >
            <Link href="/membership">
              <Crown className="w-4 h-4" />
              {isZh ? "升级 Premium" : "Upgrade to Premium"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        {/* Feature comparison mini */}
        <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { zh: "无限塔罗", en: "Unlimited Tarot", icon: <Moon className="w-3.5 h-3.5" /> },
            { zh: "无限八字", en: "Unlimited BaZi", icon: <Sparkles className="w-3.5 h-3.5" /> },
            { zh: "深度报告", en: "Deep Reports", icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { zh: "优先客服", en: "Priority Support", icon: <MessageCircle className="w-3.5 h-3.5" /> },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              {feature.icon}
              <span>{isZh ? feature.zh : feature.en}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
