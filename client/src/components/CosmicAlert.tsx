import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Clock, Flame, Sparkles, Star, Eye, Zap, X, Heart, Briefcase, Moon } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export type CosmicAlertIntensity = "full" | "compact";

interface CosmicEvent {
  icon: React.ReactNode;
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  subtitleEn: string;
  urgency: "high" | "medium" | "info";
  ctaZh: string;
  ctaEn: string;
  href: string;
}

/** Drama / tension hooks — KEEP and expand. Never "purify delete". */
export const cosmicEvents: CosmicEvent[] = [
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    titleZh: "水星逆行警告",
    titleEn: "Mercury Retrograde Alert",
    subtitleZh: "沟通易卡壳、旧线重连 — 先抽一副牌看清你该说什么",
    subtitleEn: "Messages stall, old threads return — draw cards before you reply",
    urgency: "high",
    ctaZh: "立刻看运势",
    ctaEn: "Check my chart",
    href: "/horoscope",
  },
  {
    icon: <Flame className="w-4 h-4" />,
    titleZh: "火星进入你的关系宫",
    titleEn: "Mars Enters Your Relationship House",
    subtitleZh: "欲望与冲突同时升温 — 爱情牌阵揭开对方没说出口的部分",
    subtitleEn: "Desire and friction spike — love spread shows what they won't say",
    urgency: "high",
    ctaZh: "抽取爱情牌",
    ctaEn: "Draw love cards",
    href: "/tarot",
  },
  {
    icon: <Star className="w-4 h-4" />,
    titleZh: "今日财运窗口开启",
    titleEn: "Today's Wealth Window Opens",
    subtitleZh: "木星金星吉相 — 用八字看清你适合推进还是收手",
    subtitleEn: "Jupiter-Venus favor — BaZi shows push or hold",
    urgency: "medium",
    ctaZh: "分析我的财运",
    ctaEn: "Analyze wealth",
    href: "/bazi",
  },
  {
    icon: <Eye className="w-4 h-4" />,
    titleZh: "你的潜意识在发出信号",
    titleEn: "Your Subconscious Is Signaling",
    subtitleZh: "反复出现的梦象不是噪音 — AI 解梦抓出它真正在推你什么",
    subtitleEn: "Recurring dream images aren't noise — decode what they're pushing",
    urgency: "medium",
    ctaZh: "解析我的梦境",
    ctaEn: "Decode my dream",
    href: "/dream",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    titleZh: "满月能量达到峰值",
    titleEn: "Full Moon Energy Peaks",
    subtitleZh: "情绪与直觉拉满 — 现在抽牌，比平时更「准」也更扎心",
    subtitleEn: "Emotion and intuition maxed — draw now while the signal is loud",
    urgency: "high",
    ctaZh: "立即占卜",
    ctaEn: "Read now",
    href: "/tarot",
  },
  {
    icon: <Heart className="w-4 h-4" />,
    titleZh: "你与 TA 的缘分指数今日最高",
    titleEn: "Compatibility Peaks With Them Today",
    subtitleZh: "合盘能量有利连结 — 测完再决定要不要发那条消息",
    subtitleEn: "Synastry favors connection — test before you text",
    urgency: "medium",
    ctaZh: "测试缘分",
    ctaEn: "Test compatibility",
    href: "/compatibility",
  },
  {
    icon: <Briefcase className="w-4 h-4" />,
    titleZh: "本周事业线出现重大变化",
    titleEn: "Major Career Shift This Week",
    subtitleZh: "土星压事业宫 — 跳槽/面试前用事业牌阵看清下一步",
    subtitleEn: "Saturn on career — career spread before you leap",
    urgency: "high",
    ctaZh: "事业牌阵",
    ctaEn: "Career spread",
    href: "/tarot?type=career",
  },
  {
    icon: <Moon className="w-4 h-4" />,
    titleZh: "暗月空窗 · 适合问真心问题",
    titleEn: "Dark Moon Window · Ask the Real Question",
    subtitleZh: "外界噪音变小 — 问一句你平时不敢问的，塔罗会接住",
    subtitleEn: "Outer noise drops — ask what you usually avoid",
    urgency: "medium",
    ctaZh: "开始抽牌",
    ctaEn: "Start reading",
    href: "/tarot",
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    titleZh: "金星顺行 · 表达欲被点燃",
    titleEn: "Venus Direct · Expression Ignites",
    subtitleZh: "告白、复合、破冰都更有戏 — 先看今日感情运势再动手",
    subtitleEn: "Confess, reconnect, break ice — check love fortune first",
    urgency: "info",
    ctaZh: "看今日运势",
    ctaEn: "Today's fortune",
    href: "/horoscope",
  },
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    titleZh: "决策窗口只开到今晚",
    titleEn: "Decision Window Closes Tonight",
    subtitleZh: "犹豫的事今天必须落地 — 三张牌帮你排出优先级",
    subtitleEn: "That stuck choice needs a call — three cards rank it",
    urgency: "high",
    ctaZh: "马上抽牌",
    ctaEn: "Draw now",
    href: "/tarot",
  },
];

function getCountdownToMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function CosmicAlert({
  intensity = "full",
  weak = false,
}: {
  /** full = max drama (classic/ritual); compact = shorter (focus/plans) */
  intensity?: CosmicAlertIntensity;
  /** @deprecated use intensity="compact" — kept for call sites */
  weak?: boolean;
}) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const compact = intensity === "compact" || weak;
  const [countdown, setCountdown] = useState(getCountdownToMidnight());
  const [dismissed, setDismissed] = useState(false);

  const todayEvent = useMemo(() => {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return cosmicEvents[dayOfYear % cosmicEvents.length];
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdownToMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dismissedDate = localStorage.getItem("fi_cosmic_alert_dismissed");
    const today = new Date().toDateString();
    if (dismissedDate === today) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("fi_cosmic_alert_dismissed", new Date().toDateString());
    setDismissed(true);
  };

  if (dismissed) return null;

  const urgencyColors = {
    high: "from-red-900/50 to-orange-900/35 border-red-500/40 shadow-[0_0_24px_rgba(239,68,68,0.15)]",
    medium: "from-amber-900/40 to-yellow-900/25 border-amber-500/35 shadow-[0_0_20px_rgba(245,158,11,0.12)]",
    info: "from-blue-900/35 to-indigo-900/25 border-blue-500/30",
  };
  const urgencyDot = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    info: "bg-blue-500",
  };

  const title = isEn ? todayEvent.titleEn : todayEvent.titleZh;
  const subtitle = isEn ? todayEvent.subtitleEn : todayEvent.subtitleZh;
  const cta = isEn ? todayEvent.ctaEn : todayEvent.ctaZh;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-r ${urgencyColors[todayEvent.urgency]} backdrop-blur-sm`}
      data-cosmic-alert
      data-cosmic-urgency={todayEvent.urgency}
      data-cosmic-intensity={compact ? "compact" : "full"}
    >
      <div className={`p-3 md:p-4 flex items-center gap-3 ${compact ? "py-2.5" : ""}`}>
        <div className="shrink-0 relative">
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${urgencyDot[todayEvent.urgency]}/25 flex items-center justify-center text-white/95 border border-white/10`}
          >
            {todayEvent.icon}
          </div>
          {todayEvent.urgency === "high" && (
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${urgencyDot[todayEvent.urgency]} rounded-full animate-pulse`}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-xs md:text-sm font-bold text-white/95 truncate">
              {title}
            </span>
            {todayEvent.urgency === "high" && !compact && (
              <span className="text-[10px] uppercase tracking-wider text-red-300/90 border border-red-400/30 px-1.5 py-0.5 rounded">
                {isEn ? "Hot" : "紧迫"}
              </span>
            )}
          </div>
          <p
            className={`text-[11px] md:text-xs text-white/65 leading-relaxed ${
              compact ? "line-clamp-1" : "line-clamp-2"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 md:gap-3">
          {!compact && (
            <div className="hidden sm:flex items-center gap-1 text-white/45">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] md:text-xs font-mono tabular-nums" title={isEn ? "Until midnight" : "距今日结束"}>
                {countdown}
              </span>
            </div>
          )}
          <Link href={todayEvent.href}>
            <button
              type="button"
              className="px-3 py-1.5 md:px-4 md:py-2 text-[11px] md:text-xs font-semibold rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all duration-200 whitespace-nowrap border border-white/20 shadow-sm"
            >
              {cta}
            </button>
          </Link>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-5 h-5 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
            aria-label={isEn ? "Dismiss" : "关闭"}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
