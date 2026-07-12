import { useEffect, useRef } from "react";
import { Flame, Trophy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function StreakBadge() {
  const { isAuthenticated } = useAuth();
  const { language } = useTranslation();
  const isZh = language === "zh";
  const hasRecorded = useRef(false);

  const recordActivity = trpc.growth.recordActivity.useMutation({
    onSuccess: (data) => {
      if (data.isNewDay && data.streak > 1) {
        toast.success(
          isZh
            ? `连续使用 ${data.streak} 天！继续保持！`
            : `${data.streak}-day streak! Keep it up!`,
          { duration: 3000 }
        );
      }
    },
  });

  const { data: progress } = trpc.growth.getProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isAuthenticated && !hasRecorded.current) {
      hasRecorded.current = true;
      recordActivity.mutate();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !progress) return null;

  const streak = progress.currentStreak || 0;
  const longest = progress.longestStreak || 0;

  if (streak === 0) return null;

  const getFlameColor = () => {
    if (streak >= 30) return "text-red-500";
    if (streak >= 14) return "text-orange-500";
    if (streak >= 7) return "text-amber-500";
    return "text-yellow-500";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 cursor-default">
            <Flame className={`w-3.5 h-3.5 ${getFlameColor()}`} />
            <span className="text-xs font-semibold text-orange-400">{streak}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Flame className={`w-4 h-4 ${getFlameColor()}`} />
              <span className="font-semibold">
                {isZh ? `${streak} 天连续使用` : `${streak}-Day Streak`}
              </span>
            </div>
            {longest > streak && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Trophy className="w-3 h-3 text-cosmic-gold" />
                <span>
                  {isZh ? `最长记录：${longest} 天` : `Best: ${longest} days`}
                </span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {isZh
                ? "每天使用可增加连续天数"
                : "Use daily to build your streak"}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
