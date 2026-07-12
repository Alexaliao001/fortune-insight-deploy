import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Lock, Sparkles, ArrowRight, Eye, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trialHookLong, trialHookShort } from "@/lib/trialCopy";

interface SoftPaywallProps {
  featureType: "tarot" | "bazi" | "dream" | "horoscope" | "compatibility";
  className?: string;
}

// Fake deep analysis preview content per feature type
const previewContent: Record<string, { zh: string[]; en: string[] }> = {
  tarot: {
    zh: [
      "[深层潜意识分析] 你抽到的这张牌揭示了你内心深处对安全感的渴望。在过去三个月中，你可能经历了一次重要的信任危机，这让你在面对新关系时变得更加谨慎...",
      "[未来30天能量预测] 根据牌阵的整体能量走向，接下来的两周将是你感情生活的关键转折期。特别是在第11天和第23天，宇宙能量将为你创造...",
      "[行动建议与时机选择] 基于你的牌面组合，最佳行动窗口在每周三和周五的傍晚时分。在这些时间点，你的直觉力和表达力会达到峰值...",
    ],
    en: [
      "[Deep Subconscious Analysis] The card you drew reveals a deep-seated longing for security. Over the past three months, you may have experienced a significant trust crisis that has made you more cautious in new relationships...",
      "[30-Day Energy Forecast] Based on the overall energy flow of your spread, the next two weeks will be a critical turning point in your love life. Especially on days 11 and 23, cosmic energy will create...",
      "[Action Advice & Timing] Based on your card combination, the optimal action windows are Wednesday and Friday evenings. During these times, your intuition and expressiveness will peak...",
    ],
  },
  bazi: {
    zh: [
      "[命宫深层解析] 你的日主为甲木，生于申月，虽然表面看来木受金克，但年柱的壬水暗中生扶，形成了「金水相涵」的特殊格局。这意味着你在逆境中反而能激发出惊人的创造力...",
      "[财运周期预测] 根据你的大运流年分析，2026年丙午年对你的财运影响深远。午火为你的食神，代表着创意变现的能力将在下半年达到巅峰...",
      "[感情深度分析] 你的八字中桃花星落在日支，说明你的正缘往往出现在日常生活和工作环境中。配合今年的流年桃花，最可能在4月和9月遇到...",
    ],
    en: [
      "[Destiny Palace Deep Analysis] Your Day Master is Jia Wood, born in Shen month. Although Wood appears constrained by Metal, the Ren Water in your year pillar secretly nourishes it, forming a special 'Metal-Water Harmony' pattern. This means you can unleash remarkable creativity under adversity...",
      "[Wealth Cycle Forecast] Based on your Luck Pillar analysis, 2026 (Bing Wu year) will profoundly impact your finances. Wu Fire represents your Eating God star, meaning your ability to monetize creativity will peak in the second half...",
      "[Love Deep Analysis] Your Peach Blossom star falls on the Day Branch, indicating your destined partner likely appears in daily life or work. Combined with this year's annual Peach Blossom, the most likely months are April and September...",
    ],
  },
  dream: {
    zh: [
      "[潜意识符号解码] 你梦中反复出现的水元素代表着情感的流动和变化。结合荣格原型理论分析，这个梦境揭示了你正处于心理转化的关键阶段...",
      "[梦境与现实关联] 通过对你近期梦境模式的分析，我们发现一个显著的规律——你的梦境内容与你白天未处理的情绪高度相关。特别是在工作压力大的日子...",
      "[个性化成长建议] 基于你的梦境分析，建议你在睡前进行5分钟的正念冥想，重点关注呼吸和身体感受。这将帮助你的潜意识更好地处理日间积累的情绪...",
    ],
    en: [
      "[Subconscious Symbol Decoding] The recurring water element in your dream represents emotional flow and change. Through Jungian archetype analysis, this dream reveals you're at a critical stage of psychological transformation...",
      "[Dream-Reality Connection] Analyzing your recent dream patterns, we've identified a significant pattern — your dream content is highly correlated with unprocessed daytime emotions. Especially on high-stress work days...",
      "[Personalized Growth Advice] Based on your dream analysis, we recommend a 5-minute mindfulness meditation before sleep, focusing on breath and body sensations. This will help your subconscious better process accumulated daytime emotions...",
    ],
  },
  horoscope: {
    zh: [
      "[本周关键转折点] 根据行星运行轨迹，水星将在周三进入你的第七宫（伴侣宫），这意味着你在人际关系和合作方面将迎来重要的沟通机会...",
      "[月度能量地图] 本月的满月落在你的第二宫（财帛宫），这是一个关于价值观和物质安全感的重要时刻。你可能会重新审视自己的收入来源...",
      "[年度运势深度解读] 2026年对你来说是「破茧重生」的一年。土星在你的太阳星座形成的相位，虽然带来挑战，但也为你奠定了未来十年的基础...",
    ],
    en: [
      "[This Week's Key Turning Point] Based on planetary trajectories, Mercury enters your 7th House (Partnership) on Wednesday, meaning significant communication opportunities in relationships and collaborations...",
      "[Monthly Energy Map] This month's Full Moon falls in your 2nd House (Finances), marking an important moment about values and material security. You may reassess your income sources...",
      "[Annual Deep Forecast] 2026 is your year of 'transformation and rebirth'. Saturn's aspect to your Sun sign, while challenging, lays the foundation for the next decade...",
    ],
  },
  compatibility: {
    zh: [
      "[灵魂契合度深层分析] 你们的月亮星座形成了120度三分相，这是最和谐的相位之一。这意味着你们在情感需求和安全感方面有着天然的默契...",
      "[潜在冲突预警] 你们的火星形成了90度四分相，这可能在激情消退后引发关于生活节奏和决策方式的分歧。建议在以下三个方面提前沟通...",
      "[长期关系发展建议] 基于你们的星盘互动分析，你们的关系将在第3个月和第7个月经历重要的成长节点。在这些时期，建议你们...",
    ],
    en: [
      "[Soul Compatibility Deep Analysis] Your Moon signs form a 120° trine, one of the most harmonious aspects. This means you share a natural understanding of each other's emotional needs and sense of security...",
      "[Potential Conflict Alert] Your Mars signs form a 90° square, which may trigger disagreements about life pace and decision-making after the initial passion fades. We recommend proactive communication in these three areas...",
      "[Long-term Relationship Advice] Based on your synastry analysis, your relationship will experience important growth milestones at months 3 and 7. During these periods, we suggest you...",
    ],
  },
};

export default function SoftPaywall({ featureType, className = "" }: SoftPaywallProps) {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [dismissed, setDismissed] = useState(false);

  const previews = useMemo(() => {
    const content = previewContent[featureType] || previewContent.tarot;
    return isZh ? content.zh : content.en;
  }, [featureType, isZh]);

  if (dismissed) return null;

  return (
    <div className={`relative mt-6 ${className}`} data-soft-paywall={featureType}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#d4a843]" />
          <h3 className="text-sm font-semibold text-[#d4a843] tracking-wider uppercase">
            {isZh ? "深度分析预览" : "Deep Analysis Preview"}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md"
          aria-label={isZh ? "关闭" : "Dismiss"}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden">
        <div className="space-y-3 p-5 glass-card border-gradient">
          {previews.map((text, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed"
              style={{
                filter: `blur(${i === 0 ? 0 : i === 1 ? 3 : 6}px)`,
                opacity: i === 0 ? 0.9 : i === 1 ? 0.7 : 0.5,
              }}
            >
              {text}
            </p>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0f1a] pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-[#d4a843]" />
            <span className="text-sm font-medium text-[#d4a843]">
              {isZh
                ? "解锁完整深度、时机与行动建议"
                : "Unlock full depth, timing & action guidance"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3 text-center max-w-sm">
            {trialHookLong(isZh)}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              <Link href="/membership">
                <Sparkles className="w-4 h-4 mr-2" />
                {trialHookShort(isZh)}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/15 text-muted-foreground"
              onClick={() => setDismissed(true)}
            >
              {isZh ? "继续用免费额度" : "Keep free limits"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
