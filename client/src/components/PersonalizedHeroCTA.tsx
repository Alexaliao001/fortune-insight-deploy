import { useMemo } from "react";
import { Heart, Star, Moon, Sun, Sparkles, Eye, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import type { SecondaryCtaTarget } from "@/lib/homeVariant";

interface CTAConfig {
  primaryZh: string;
  primaryEn: string;
  primaryIcon: React.ReactNode;
  primaryHref: string;
  primaryClass: string;
  secondaryZh: string;
  secondaryEn: string;
  secondaryIcon: React.ReactNode;
  secondaryHref: string;
  secondaryClass: string;
  hookTextZh: string;
  hookTextEn: string;
}

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export interface PersonalizedHeroCTAProps {
  /** Variant flag: login vs membership for secondary guest CTA */
  secondaryTarget?: SecondaryCtaTarget;
  align?: "center" | "start";
}

export default function PersonalizedHeroCTA({
  secondaryTarget = "login",
  align = "center",
}: PersonalizedHeroCTAProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isEn = language === "en";

  const cta = useMemo((): CTAConfig => {
    const timeOfDay = getTimeOfDay();
    const secondaryHref =
      secondaryTarget === "membership" ? "/membership" : "/login";
    const secondaryZh =
      secondaryTarget === "membership" ? "14 天无限 · 看方案" : "注册领 14 天无限";
    const secondaryEn =
      secondaryTarget === "membership"
        ? "14-day unlimited · plans"
        : "Sign up · 14-day unlimited";
    const secondaryIcon =
      secondaryTarget === "membership" ? (
        <Crown className="w-5 h-5 mr-2" />
      ) : (
        <Star className="w-5 h-5 mr-2" />
      );
    const secondaryClass =
      "bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a] glow-gold";
    const primaryTarotClass =
      "bg-gradient-to-r from-[#c06080] to-[#d4a843] hover:from-[#b05070] hover:to-[#c09030] text-white shadow-[0_0_30px_rgba(192,96,128,0.3)]";

    // Auth: primary stays a reading path; secondary → membership or continue tarot
    if (user) {
      const name = user.name || (isEn ? "friend" : "朋友");
      const memberSecondaryHref = secondaryTarget === "membership" ? "/membership" : "/horoscope";
      const memberSecondaryZh =
        secondaryTarget === "membership" ? "了解会员权益" : "今日运势";
      const memberSecondaryEn =
        secondaryTarget === "membership" ? "Membership benefits" : "Daily horoscope";

      switch (timeOfDay) {
        case "morning":
          return {
            primaryZh: "查看今日运势",
            primaryEn: "Check Today's Fortune",
            primaryIcon: <Sun className="w-5 h-5 mr-2" />,
            primaryHref: "/horoscope",
            primaryClass:
              "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-[0_0_30px_rgba(245,158,11,0.3)]",
            secondaryZh: memberSecondaryZh === "今日运势" ? "免费抽一副塔罗" : memberSecondaryZh,
            secondaryEn:
              memberSecondaryEn === "Daily horoscope" ? "Free Tarot Reading" : memberSecondaryEn,
            secondaryIcon:
              memberSecondaryHref === "/membership" ? (
                <Crown className="w-5 h-5 mr-2" />
              ) : (
                <Heart className="w-5 h-5 mr-2" />
              ),
            secondaryHref: memberSecondaryHref === "/horoscope" ? "/tarot" : memberSecondaryHref,
            secondaryClass,
            hookTextZh: `${name}，先看今日运势？`,
            hookTextEn: `${name}, start with today's horoscope?`,
          };
        case "afternoon":
          return {
            primaryZh: "免费抽一副塔罗",
            primaryEn: "Free Tarot Reading",
            primaryIcon: <Heart className="w-5 h-5 mr-2" />,
            primaryHref: "/tarot",
            primaryClass: primaryTarotClass,
            secondaryZh: memberSecondaryZh,
            secondaryEn: memberSecondaryEn,
            secondaryIcon:
              memberSecondaryHref === "/membership" ? (
                <Crown className="w-5 h-5 mr-2" />
              ) : (
                <Sun className="w-5 h-5 mr-2" />
              ),
            secondaryHref: memberSecondaryHref,
            secondaryClass,
            hookTextZh: `${name}，下午适合一次清晰占卜`,
            hookTextEn: `${name}, afternoon is a good time for a clear reading`,
          };
        case "evening":
          return {
            primaryZh: "继续占卜",
            primaryEn: "Continue reading",
            primaryIcon: <Sparkles className="w-5 h-5 mr-2" />,
            primaryHref: "/tarot",
            primaryClass: primaryTarotClass,
            secondaryZh: memberSecondaryZh,
            secondaryEn: memberSecondaryEn,
            secondaryIcon:
              memberSecondaryHref === "/membership" ? (
                <Crown className="w-5 h-5 mr-2" />
              ) : (
                <Moon className="w-5 h-5 mr-2" />
              ),
            secondaryHref: memberSecondaryHref,
            secondaryClass,
            hookTextZh: `${name}，夜晚适合安静地问一个问题`,
            hookTextEn: `${name}, evening is a quiet time to ask one clear question`,
          };
        default:
          return {
            primaryZh: "AI 解梦",
            primaryEn: "AI Dream Analysis",
            primaryIcon: <Eye className="w-5 h-5 mr-2" />,
            primaryHref: "/dream",
            primaryClass:
              "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)]",
            secondaryZh: "免费抽一副塔罗",
            secondaryEn: "Free Tarot Reading",
            secondaryIcon: <Heart className="w-5 h-5 mr-2" />,
            secondaryHref: "/tarot",
            secondaryClass,
            hookTextZh: `${name}，也可以先从解梦开始`,
            hookTextEn: `${name}, you can also start with a dream reading`,
          };
      }
    }

    // Guest — shared conversion IA: primary tarot, secondary trial/login or plans
    return {
      primaryZh: "免费抽一副塔罗",
      primaryEn: "Free Tarot Reading",
      primaryIcon: <Heart className="w-5 h-5 mr-2" />,
      primaryHref: "/tarot",
      primaryClass: primaryTarotClass,
      secondaryZh,
      secondaryEn,
      secondaryIcon,
      secondaryHref,
      secondaryClass,
      hookTextZh: "先免费体验一次，再决定要不要深入",
      hookTextEn: "Try one free reading — go deeper when you're ready",
    };
  }, [user, isEn, secondaryTarget]);

  const alignClass =
    align === "start"
      ? "sm:justify-start text-center sm:text-left"
      : "justify-center text-center";

  return (
    <div data-home-hero-cta>
      <p
        className={`text-xs sm:text-sm md:text-base text-[#d4a843]/80 font-medium mb-3 md:mb-5 tracking-wide ${alignClass}`}
      >
        <Sparkles className="inline w-3.5 h-3.5 mr-1" />{" "}
        {isEn ? cta.hookTextEn : cta.hookTextZh}
      </p>

      <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${alignClass}`}>
        <Button
          asChild
          size="lg"
          className={`text-sm sm:text-base md:text-lg px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 rounded-xl font-semibold tracking-wide transition-all duration-300 ${cta.primaryClass}`}
        >
          <Link href={cta.primaryHref} data-home-cta-primary>
            {cta.primaryIcon}
            {isEn ? cta.primaryEn : cta.primaryZh}
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          className={`text-sm sm:text-base md:text-lg px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-6 rounded-xl font-semibold tracking-wide transition-all duration-300 ${cta.secondaryClass}`}
        >
          <Link href={cta.secondaryHref} data-home-cta-secondary>
            {cta.secondaryIcon}
            {isEn ? cta.secondaryEn : cta.secondaryZh}
          </Link>
        </Button>
      </div>
    </div>
  );
}
