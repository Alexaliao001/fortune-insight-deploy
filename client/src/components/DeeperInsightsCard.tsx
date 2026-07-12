import { Crown, Sparkles, Lock, ChevronRight, Check, Eye, Users, Shield, Clock, Star, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "@/contexts/LanguageContext";
import { useMemo } from "react";

interface DeeperInsightsCardProps {
  featureType: "tarot" | "bazi" | "dream" | "horoscope" | "compatibility";
  className?: string;
}

const FEATURE_INSIGHTS: Record<string, {
  freeItems: { zh: string; en: string }[];
  premiumItems: { zh: string; en: string }[];
  premiumOnly: { zh: string; en: string }[];
}> = {
  tarot: {
    freeItems: [
      { zh: "基础牌面解读", en: "Basic card meanings" },
      { zh: "单牌位置含义", en: "Individual card positions" },
    ],
    premiumItems: [
      { zh: "深度牌阵综合分析", en: "Deep spread synthesis" },
      { zh: "个性化行动建议", en: "Personalized action plan" },
      { zh: "感情/事业/财运详解", en: "Love/career/finance details" },
    ],
    premiumOnly: [
      { zh: "牌面之间的隐藏关联", en: "Hidden connections between cards" },
      { zh: "未来3个月趋势预测", en: "3-month trend forecast" },
    ],
  },
  bazi: {
    freeItems: [
      { zh: "基础命盘信息", en: "Basic chart overview" },
      { zh: "五行分布概览", en: "Five elements summary" },
    ],
    premiumItems: [
      { zh: "十神深度解析", en: "Ten Gods deep analysis" },
      { zh: "大运流年预测", en: "Luck cycle predictions" },
      { zh: "性格与天赋详解", en: "Personality & talent details" },
    ],
    premiumOnly: [
      { zh: "最佳职业方向建议", en: "Optimal career guidance" },
      { zh: "感情婚姻深度分析", en: "Relationship compatibility" },
    ],
  },
  dream: {
    freeItems: [
      { zh: "基础梦境符号解析", en: "Basic symbol interpretation" },
      { zh: "主题概述", en: "Theme overview" },
    ],
    premiumItems: [
      { zh: "荣格心理学深度分析", en: "Jungian psychology analysis" },
      { zh: "潜意识信息解读", en: "Subconscious message decoding" },
      { zh: "个性化行动建议", en: "Personalized action steps" },
    ],
    premiumOnly: [
      { zh: "梦境与现实关联分析", en: "Dream-reality connection map" },
      { zh: "心理成长路径建议", en: "Personal growth pathway" },
    ],
  },
  horoscope: {
    freeItems: [
      { zh: "宇宙能量概览", en: "Cosmic Energy Overview" },
      { zh: "行星轨迹解析", en: "Planetary Transit Analysis" },
      { zh: "爱情与情感波动", en: "Love & Emotional Landscape" },
    ],
    premiumItems: [
      { zh: "事业与野心罗盘", en: "Career & Ambition Compass" },
      { zh: "财富与金融暗流", en: "Wealth & Financial Currents" },
      { zh: "健康与活力指引", en: "Health & Vitality Guidance" },
      { zh: "灵性与内在成长", en: "Spiritual & Inner Growth" },
    ],
    premiumOnly: [
      { zh: "潜在挑战与阴影工作", en: "Hidden Challenges & Shadow Work" },
      { zh: "时机与关键时刻", en: "Timing & Key Moments" },
      { zh: "肯定语与宇宙寄语", en: "Affirmation & Cosmic Message" },
    ],
  },
  compatibility: {
    freeItems: [
      { zh: "宇宙连接概览", en: "Cosmic Connection Overview" },
      { zh: "激情与身体化学反应", en: "Passion & Physical Chemistry" },
      { zh: "情感共鸣与爱的语言", en: "Emotional Resonance & Love Language" },
    ],
    premiumItems: [
      { zh: "沟通与智性纽带", en: "Communication & Intellectual Bond" },
      { zh: "信任与忠诚动态", en: "Trust & Loyalty Dynamics" },
      { zh: "共同成长与进化", en: "Growth & Evolution Together" },
      { zh: "冲突模式与化解之道", en: "Conflict Patterns & Resolution" },
    ],
    premiumOnly: [
      { zh: "长期相处与家庭和谐", en: "Long-Term & Domestic Harmony" },
      { zh: "阴影工作与隐藏挑战", en: "Shadow Work & Hidden Challenges" },
      { zh: "宇宙祝福与指引", en: "Cosmic Blessing & Guidance" },
    ],
  },
};

// Emotional teaser hooks per feature
const TEASER_HOOKS: Record<string, { zh: string; en: string }> = {
  tarot: { zh: "你的牌面暗藏一个关键转折信号...", en: "Your cards hide a pivotal turning point..." },
  bazi: { zh: "你的命盘中有一个罕见的天赋格局...", en: "Your chart reveals a rare talent pattern..." },
  dream: { zh: "你的潜意识正在发出一个重要警示...", en: "Your subconscious is sending a vital warning..." },
  horoscope: { zh: "今天有一个行星相位专门影响你...", en: "A planetary aspect targets you specifically today..." },
  compatibility: { zh: "你们之间有一个隐藏的深层灵魂连接...", en: "There's a hidden soul-level bond between you..." },
};

function getRecentUnlocks(): number {
  const hour = new Date().getHours();
  const base = hour >= 8 && hour <= 23 ? 47 : 12;
  return base + (new Date().getMinutes() % 20);
}

export default function DeeperInsightsCard({ featureType, className = "" }: DeeperInsightsCardProps) {
  const { language } = useTranslation();
  const isEn = language === "en";
  const insights = FEATURE_INSIGHTS[featureType];
  const teaser = TEASER_HOOKS[featureType];
  const recentUnlocks = useMemo(() => getRecentUnlocks(), []);

  if (!insights) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#d4a843]/20 bg-gradient-to-br from-[#0d0f1a] via-[#131525] to-[#0d0f1a] ${className}`}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[rgba(212,168,67,0.05)] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[rgba(120,72,176,0.05)] rounded-full blur-[60px] pointer-events-none" />

      <div className="relative p-6 md:p-8">
        {/* Header with emotional hook */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a843]/30 to-[#d4a843]/10 flex items-center justify-center ring-1 ring-[#d4a843]/30 shrink-0">
            <Eye className="w-5 h-5 text-[#d4a843]" />
          </div>
          <div>
            <p className="text-[#d4a843] font-semibold font-serif italic text-base leading-snug">
              "{isEn ? teaser.en : teaser.zh}"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isEn ? "Unlock Premium to reveal the full analysis" : "升级会员解锁完整深度分析"}
            </p>
          </div>
        </div>

        {/* Social proof bar */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-5 px-1">
          <div className="flex -space-x-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-[#d4a843]/40 to-purple-500/40 border border-[#d4a843]/20" />
            ))}
          </div>
          <span>{isEn ? `${recentUnlocks} unlocked recently` : `${recentUnlocks}人最近解锁`}</span>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Free Column */}
          <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">
                {isEn ? "Free" : "免费版"}
              </span>
            </div>
            <ul className="space-y-2.5">
              {insights.freeItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <Check className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  <span>{isEn ? item.en : item.zh}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Column */}
          <div className="rounded-xl bg-gradient-to-br from-[#d4a843]/[0.08] to-[#d4a843]/[0.02] border border-[#d4a843]/20 p-4 relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#d4a843] bg-[#d4a843]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                {isEn ? "Premium" : "会员版"}
              </span>
            </div>
            <ul className="space-y-2.5">
              {insights.freeItems.map((item, i) => (
                <li key={`f-${i}`} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-[#d4a843] shrink-0 mt-0.5" />
                  <span>{isEn ? item.en : item.zh}</span>
                </li>
              ))}
              {insights.premiumItems.map((item, i) => (
                <li key={`p-${i}`} className="flex items-start gap-2 text-sm text-[#d4a843]/90">
                  <Check className="w-4 h-4 text-[#d4a843] shrink-0 mt-0.5" />
                  <span className="font-medium">{isEn ? item.en : item.zh}</span>
                </li>
              ))}
              {insights.premiumOnly.map((item, i) => (
                <li key={`e-${i}`} className="flex items-start gap-2 text-sm text-[#d4a843]">
                  <Sparkles className="w-4 h-4 text-[#d4a843] shrink-0 mt-0.5" />
                  <span className="font-semibold">{isEn ? item.en : item.zh}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blurred preview teaser */}
        <div className="relative rounded-xl overflow-hidden mb-5 border border-[#d4a843]/10">
          <div className="p-3 bg-white/[0.01]">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-[#d4a843]/10 rounded w-3/4 blur-[3px]" />
              <div className="h-2 bg-white/5 rounded w-full blur-[3px]" />
              <div className="h-2 bg-white/4 rounded w-5/6 blur-[3px]" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0d0f1a]/90 via-[#0d0f1a]/40 to-transparent">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/25">
              <Lock className="w-3 h-3 text-[#d4a843]" />
              <span className="text-xs text-[#d4a843]">{isEn ? "Premium content" : "付费内容"}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto bg-gradient-to-r from-[#d4a843] to-[#b8922e] hover:from-[#e0b84d] hover:to-[#c9a33a] text-black font-bold shadow-lg shadow-[#d4a843]/20 px-8 h-11"
          >
            <Link href="/membership">
              <Crown className="w-4 h-4 mr-2" />
              {isEn ? "Unlock Everything — $5/mo" : "解锁全部 — $5/月"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-0.5"><Shield className="w-3 h-3" /> {isEn ? "7-day refund" : "7天退款"}</span>
            <span className="flex items-center gap-0.5"><Zap className="w-3 h-3" /> {isEn ? "Instant" : "即时"}</span>
            <span className="flex items-center gap-0.5"><Heart className="w-3 h-3 text-pink-400/50" /> {isEn ? "Charity" : "公益"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
