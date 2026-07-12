import { useState, useEffect, useCallback, useRef } from "react";
import { X, Gift, Star, Sparkles, Crown, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

interface Notification {
  id: string;
  type: "welcome" | "offer" | "streak" | "upgrade" | "tip";
  title: string;
  message: string;
  cta?: { label: string; href: string };
  icon: React.ReactNode;
  gradient: string;
  dismissable: boolean;
  expiresAt?: number;
}

const STORAGE_KEY = "fi_dismissed_notifications";
const FIRST_VISIT_KEY = "fi_first_visit_ts";
const USAGE_COUNT_KEY = "fi_usage_count";

function getDismissed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function dismiss(id: string) {
  const dismissed = getDismissed();
  if (!dismissed.includes(id)) {
    dismissed.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
  }
}

function getFirstVisitTs(): number {
  const ts = localStorage.getItem(FIRST_VISIT_KEY);
  if (ts) return parseInt(ts, 10);
  const now = Date.now();
  localStorage.setItem(FIRST_VISIT_KEY, String(now));
  return now;
}

function getUsageCount(): number {
  return parseInt(localStorage.getItem(USAGE_COUNT_KEY) || "0", 10);
}

export function incrementUsageCount() {
  const count = getUsageCount() + 1;
  localStorage.setItem(USAGE_COUNT_KEY, String(count));
}

/**
 * InAppNotifications - 应用内营销通知
 * 使用 CSS transitions 实现与 framer-motion AnimatePresence 一致的进出场动画：
 * - 进入: opacity 0→1, translateY -10px→0, height 0→auto
 * - 退出: opacity 1→0, translateY 0→-10px
 */
export default function InAppNotifications() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isEn = language === "en";
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animState, setAnimState] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const contentRef = useRef<HTMLDivElement>(null);

  const buildNotifications = useCallback(() => {
    const dismissed = getDismissed();
    const firstVisit = getFirstVisitTs();
    const hoursSinceFirst = (Date.now() - firstVisit) / (1000 * 60 * 60);
    const usageCount = getUsageCount();
    const notifications: Notification[] = [];

    // 1. Welcome notification
    if (hoursSinceFirst < 24) {
      notifications.push({
        id: "welcome",
        type: "welcome",
        title: isEn ? "Welcome to Fortune Insight!" : "欢迎来到洞察未来！",
        message: isEn
          ? "Try free core readings first — Tarot, horoscope, and more. Sign up for a 14-day unlimited trial when you're ready."
          : "先免费体验核心解读（塔罗、运势等）。准备好时注册可领 14 天无限试用。",
        cta: {
          label: isEn ? "Start Free Reading" : "开始免费体验",
          href: "/tarot",
        },
        icon: <Sparkles className="w-5 h-5" />,
        gradient: "from-purple-500/20 to-indigo-500/20",
        dismissable: true,
      });
    }

    // 2. Sign up prompt
    if (usageCount >= 2 && !user) {
      notifications.push({
        id: "signup_prompt",
        type: "offer",
        title: isEn ? "Save Your Readings" : "保存你的解读记录",
        message: isEn
          ? "Sign in to save all your readings and access them anytime. Your cosmic journey deserves to be remembered."
          : "登录后可保存所有解读记录，随时查看。你的命运之旅值得被铭记。",
        cta: {
          label: isEn ? "Sign In Free" : "免费登录",
          href: "/membership",
        },
        icon: <Star className="w-5 h-5" />,
        gradient: "from-amber-500/20 to-orange-500/20",
        dismissable: true,
      });
    }

    // 3. Upgrade offer
    if (hoursSinceFirst > 72 && usageCount >= 3) {
      notifications.push({
        id: "upgrade_offer_72h",
        type: "upgrade",
        title: isEn ? "Unlock Full Insights" : "解锁完整洞察",
        message: isEn
          ? "You've explored the surface. Premium members get deep AI analysis, unlimited readings, and exclusive reports."
          : "你已初窥门径。高级会员可获得深度AI分析、无限次解读和专属报告。",
        cta: {
          label: isEn ? "View Plans" : "查看方案",
          href: "/membership",
        },
        icon: <Crown className="w-5 h-5" />,
        gradient: "from-yellow-500/20 to-amber-500/20",
        dismissable: true,
      });
    }

    // 4. Upgrade nudge after 2+ uses (evergreen)
    if (usageCount >= 2 && !user) {
      notifications.push({
        id: "upgrade_nudge",
        type: "upgrade",
        title: isEn ? "Unlock Unlimited Readings" : "解锁无限次数",
        message: isEn
          ? "You've enjoyed free readings! Premium members get unlimited access to all features with deep analysis reports."
          : "你已体验了免费功能！高级会员可无限次使用所有功能，含深度分析报告。",
        cta: {
          label: isEn ? "See Plans" : "查看方案",
          href: "/membership",
        },
        icon: <Crown className="w-5 h-5" />,
        gradient: "from-amber-500/20 to-yellow-500/20",
        dismissable: true,
      });
    }

    // 5. Daily tip
    const tipIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 5;
    const tips = isEn
      ? [
          "Tip: Tarot readings are most accurate when you focus on a specific question.",
          "Tip: Your BaZi chart reveals hidden talents. Have you checked yours?",
          "Tip: Record your dreams right after waking for the most accurate interpretation.",
          "Tip: Each zodiac sign has unique strengths. Discover yours today!",
          "Tip: Premium reports include personalized action plans for your growth.",
        ]
      : [
          "小贴士：塔罗占卜时专注于一个具体问题，解读会更准确。",
          "小贴士：八字命盘能揭示你的隐藏天赋，你查看过了吗？",
          "小贴士：醒来后立即记录梦境，AI解梦会更准确。",
          "小贴士：每个星座都有独特的优势，今天就来发现你的！",
          "小贴士：高级报告包含个性化的成长行动计划。",
        ];
    notifications.push({
      id: `tip_${tipIndex}`,
      type: "tip",
      title: isEn ? "Daily Insight" : "每日洞察",
      message: tips[tipIndex],
      icon: <Bell className="w-5 h-5" />,
      gradient: "from-teal-500/20 to-cyan-500/20",
      dismissable: true,
    });

    return notifications.filter((n) => !dismissed.includes(n.id));
  }, [isEn, user]);

  useEffect(() => {
    const notifs = buildNotifications();
    setActiveNotifications(notifs);
    // Trigger entrance animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimState('visible'));
    });
  }, [buildNotifications]);

  const handleDismiss = useCallback((id: string) => {
    setAnimState('exiting');
    setTimeout(() => {
      dismiss(id);
      setActiveNotifications((prev) => prev.filter((n) => n.id !== id));
      setCurrentIndex(0);
      // Re-enter
      setAnimState('entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimState('visible'));
      });
    }, 300);
  }, []);

  const handleCycle = useCallback(() => {
    setAnimState('exiting');
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % activeNotifications.length);
      setAnimState('entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimState('visible'));
      });
    }, 200);
  }, [activeNotifications.length]);

  if (activeNotifications.length === 0) return null;

  const current = activeNotifications[currentIndex % activeNotifications.length];
  if (!current) return null;

  const isShown = animState === 'visible';

  return (
    <div
      ref={contentRef}
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r ${current.gradient} backdrop-blur-sm mb-4`}
      style={{
        opacity: isShown ? 1 : 0,
        transform: isShown ? 'translateY(0)' : 'translateY(-10px)',
        maxHeight: isShown ? '200px' : '0px',
        transition: 'opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease',
      }}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/80">
          {current.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white/90 mb-0.5">{current.title}</h4>
          <p className="text-xs text-white/60 leading-relaxed">{current.message}</p>
          {current.cta && (
            <Link href={current.cta.href}>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 px-3 text-xs text-white/80 hover:text-white hover:bg-white/10 gap-1"
              >
                {current.cta.label}
                <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {activeNotifications.length > 1 && (
            <button
              onClick={handleCycle}
              className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white/60 hover:bg-white/10 transition-colors text-xs"
            >
              {currentIndex + 1}/{activeNotifications.length}
            </button>
          )}
          {current.dismissable && (
            <button
              onClick={() => handleDismiss(current.id)}
              className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white/60 hover:bg-white/10 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
