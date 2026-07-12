import { Sparkles, Crown, Infinity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";

interface UsageBadgeProps {
  featureType: "tarot" | "bazi" | "dream" | "horoscope";
  className?: string;
}

export function UsageBadge({ featureType, className = "" }: UsageBadgeProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = language === "zh";

  const { data: usage } = trpc.usage.getStatus.useQuery(
    { featureType },
    { enabled: !!user }
  );

  if (!user || !usage) return null;

  // 会员 - 无限使用
  if (usage.isMember) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 ${className}`}>
        <Crown className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-xs font-medium text-amber-300">
          {t ? "会员无限" : "Member ∞"}
        </span>
      </div>
    );
  }

  // 无限免费（如星座）
  if (usage.freeRemaining === -1) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 ${className}`}>
        <Infinity className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-medium text-emerald-300">
          {t ? "免费无限" : "Free ∞"}
        </span>
      </div>
    );
  }

  const totalRemaining = usage.freeRemaining + usage.paidCredits;
  const isLow = usage.freeRemaining === 0 && usage.paidCredits === 0;
  const hasPaid = usage.paidCredits > 0;

  if (isLow) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 animate-pulse ${className}`}>
        <Sparkles className="w-3.5 h-3.5 text-red-400" />
        <span className="text-xs font-medium text-red-300">
          {t ? "次数已用完" : "No uses left"}
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
      usage.freeRemaining > 0
        ? "bg-emerald-500/10 border border-emerald-500/20"
        : "bg-purple-500/10 border border-purple-500/20"
    } ${className}`}>
      <Sparkles className={`w-3.5 h-3.5 ${usage.freeRemaining > 0 ? "text-emerald-400" : "text-purple-400"}`} />
      <span className={`text-xs font-medium ${usage.freeRemaining > 0 ? "text-emerald-300" : "text-purple-300"}`}>
        {usage.freeRemaining > 0 && (
          <>{t ? `免费 ${usage.freeRemaining} 次` : `${usage.freeRemaining} free`}</>
        )}
        {hasPaid && usage.freeRemaining > 0 && " + "}
        {hasPaid && (
          <>{t ? `付费 ${usage.paidCredits} 次` : `${usage.paidCredits} paid`}</>
        )}
      </span>
    </div>
  );
}
