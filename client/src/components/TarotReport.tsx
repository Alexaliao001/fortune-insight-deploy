import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lock,
  Star,
  Flame,
  Droplets,
  Wind,
  Mountain,
  RotateCcw,
  Eye,
  Brain,
  Link2,
  Clock,
  Target,
  Leaf,
  PenLine,
  Layers,
  Zap,
  Quote,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  extractPullQuote,
  formatSectionContent,
} from "@/lib/tarotReportFormat";

// Types matching the backend response
interface CardData {
  cardId: number;
  name: string;
  nameChinese: string;
  isReversed: boolean;
  position: string;
  positionChinese: string;
  meaningUsed: string;
  meaningUsedChinese: string;
  arcana: "major" | "minor";
  suit?: string;
  element: string;
  keywords: string[];
  keywordsChinese: string[];
}

interface SpreadData {
  id: string;
  name: string;
  nameChinese: string;
}

interface TarotReportProps {
  cards: CardData[];
  spread: SpreadData;
  reading: string;
  isPaid?: boolean;
  onUnlock?: () => void;
  questionType?: string;
  question?: string;
}

// Element icon mapping
function getElementIcon(element: string) {
  const el = element.toLowerCase();
  if (el.includes("fire")) return <Flame className="w-3.5 h-3.5" />;
  if (el.includes("water")) return <Droplets className="w-3.5 h-3.5" />;
  if (el.includes("air") || el.includes("wind")) return <Wind className="w-3.5 h-3.5" />;
  if (el.includes("earth")) return <Mountain className="w-3.5 h-3.5" />;
  return <Star className="w-3.5 h-3.5" />;
}

// Element color mapping
function getElementColor(element: string) {
  const el = element.toLowerCase();
  if (el.includes("fire")) return "text-orange-400 bg-orange-500/10 border-orange-500/30";
  if (el.includes("water")) return "text-blue-400 bg-blue-500/10 border-blue-500/30";
  if (el.includes("air") || el.includes("wind")) return "text-yellow-300 bg-yellow-500/10 border-yellow-500/30";
  if (el.includes("earth")) return "text-green-400 bg-green-500/10 border-green-500/30";
  return "text-purple-400 bg-purple-500/10 border-purple-500/30";
}

// Arcana symbol mapping
function getArcanaSymbol(card: CardData) {
  if (card.arcana === "major") {
    const majorSymbols: Record<number, string> = {
      0: "0", 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
      6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI",
      12: "XII", 13: "XIII", 14: "XIV", 15: "XV", 16: "XVI", 17: "XVII",
      18: "XVIII", 19: "XIX", 20: "XX", 21: "XXI",
    };
    return majorSymbols[card.cardId] || "✦";
  }
  const suitSymbols: Record<string, string> = {
    wands: "♦", cups: "♡", swords: "✠", pentacles: "★",
  };
  return suitSymbols[card.suit || ""] || "✦";
}

// Section configuration for the 10 analysis dimensions
interface SectionConfig {
  key: string;
  icon: React.ReactNode;
  titleEn: string;
  titleZh: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  isFree: boolean; // true = visible to free users
}

const SECTION_CONFIGS: SectionConfig[] = [
  {
    key: "energy",
    icon: <Zap className="w-5 h-5" />,
    titleEn: "Overall Energy Field",
    titleZh: "总体能量场",
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/20",
    bgClass: "from-amber-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "cards",
    icon: <Layers className="w-5 h-5" />,
    titleEn: "Card-by-Card Deep Dive",
    titleZh: "逐牌深度解读",
    colorClass: "text-[#d4a843]",
    borderClass: "border-[#d4a843]/20",
    bgClass: "from-[#d4a843]/5 to-transparent",
    isFree: true,
  },
  {
    key: "psychology",
    icon: <Brain className="w-5 h-5" />,
    titleEn: "Psychological Mirror",
    titleZh: "心理原型映射",
    colorClass: "text-violet-400",
    borderClass: "border-violet-500/20",
    bgClass: "from-violet-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "interaction",
    icon: <Link2 className="w-5 h-5" />,
    titleEn: "Card Interactions & Narrative",
    titleZh: "牌面互动与叙事",
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/20",
    bgClass: "from-cyan-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "symbolism",
    icon: <Sparkles className="w-5 h-5" />,
    titleEn: "Symbolic Deep Dive",
    titleZh: "深层象征探索",
    colorClass: "text-pink-400",
    borderClass: "border-pink-500/20",
    bgClass: "from-pink-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "timing",
    icon: <Clock className="w-5 h-5" />,
    titleEn: "Energy & Timing",
    titleZh: "能量与时机",
    colorClass: "text-blue-400",
    borderClass: "border-blue-500/20",
    bgClass: "from-blue-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "synthesis",
    icon: <Eye className="w-5 h-5" />,
    titleEn: "Synthesis & Core Truth",
    titleZh: "综合归纳与核心真相",
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/20",
    bgClass: "from-purple-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "action",
    icon: <Target className="w-5 h-5" />,
    titleEn: "Practical Action Steps",
    titleZh: "实践行动指南",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/20",
    bgClass: "from-emerald-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "ritual",
    icon: <Leaf className="w-5 h-5" />,
    titleEn: "Ritual & Meditation",
    titleZh: "仪式与冥想建议",
    colorClass: "text-teal-400",
    borderClass: "border-teal-500/20",
    bgClass: "from-teal-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "affirmation",
    icon: <PenLine className="w-5 h-5" />,
    titleEn: "Affirmation & Closing",
    titleZh: "肯定语与结语",
    colorClass: "text-rose-400",
    borderClass: "border-rose-500/20",
    bgClass: "from-rose-500/5 to-transparent",
    isFree: false,
  },
];

export default function TarotReport({
  cards,
  spread,
  reading,
  isPaid = false,
  onUnlock,
  questionType,
  question,
}: TarotReportProps) {
  const { language } = useTranslation();
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["energy", "cards", "psychology"])
  );
  const [quoteCopied, setQuoteCopied] = useState(false);
  const isEn = language === "en";

  // Parse the AI reading into 10 sections
  const readingSections = parseReading(reading, isEn);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Count how many sections have content
  const filledSections = SECTION_CONFIGS.filter(
    (s) => readingSections[s.key]
  ).length;

  // Pull-quote: first scannable sentence from free "energy" section (share-friendly)
  const pullQuote = extractPullQuote(
    readingSections.energy || readingSections.psychology || readingSections.cards || ""
  );

  return (
    <div className="space-y-6">
      {/* Spread Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/30">
          <Sparkles className="w-4 h-4 text-[#d4a843]" />
          <span className="text-sm text-[#d4a843] font-medium">
            {isEn ? spread.name : spread.nameChinese}
          </span>
        </div>
        {question && (
          <p className="text-sm text-muted-foreground italic">"{question}"</p>
        )}
        {filledSections > 0 && (
          <p className="text-xs text-muted-foreground">
            {isEn
              ? `${filledSections} analysis dimensions generated`
              : `已生成 ${filledSections} 个分析维度`}
          </p>
        )}
      </motion.div>

      {/* Key insight — scannable + copy for share (F0-8 / F1-2) */}
      {pullQuote && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-[#d4a843]/35 bg-gradient-to-br from-[#d4a843]/12 via-[#1a1030]/80 to-transparent px-5 py-4 md:px-6 md:py-5"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-[#d4a843]/15 border border-[#d4a843]/30 flex items-center justify-center shrink-0">
              <Quote className="w-4 h-4 text-[#d4a843]" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#d4a843]/80 mb-1.5">
                {isEn ? "Key insight" : "一句话洞察"}
              </p>
              <p className="font-display text-base md:text-lg leading-relaxed text-[#f0e6c8]">
                {pullQuote}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-3 h-8 px-2.5 text-xs text-[#d4a843]/90 hover:text-[#d4a843] hover:bg-[#d4a843]/10"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(pullQuote);
                    setQuoteCopied(true);
                    toast.success(isEn ? "Insight copied" : "洞察已复制");
                    setTimeout(() => setQuoteCopied(false), 2000);
                  } catch {
                    toast.error(isEn ? "Copy failed" : "复制失败");
                  }
                }}
              >
                {quoteCopied ? (
                  <Check className="w-3.5 h-3.5 mr-1" />
                ) : (
                  <Copy className="w-3.5 h-3.5 mr-1" />
                )}
                {isEn ? "Copy for share" : "复制金句"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cards Visual Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={`${card.cardId}-${index}`}
            initial={{ opacity: 0, y: 30, rotateY: 180 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay: index * 0.3, duration: 0.6 }}
          >
            <TarotCardVisual
              card={card}
              index={index}
              isExpanded={expandedCard === index}
              onToggle={() =>
                setExpandedCard(expandedCard === index ? null : index)
              }
              isEn={isEn}
            />
          </motion.div>
        ))}
      </div>

      {/* 10-Dimension Deep Analysis */}
      <div className="space-y-4">
        {SECTION_CONFIGS.map((config, idx) => {
          const content = readingSections[config.key];
          if (!content) return null;

          const isLocked = !config.isFree && !isPaid;
          const isExpanded = expandedSections.has(config.key);

          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="relative"
            >
              <div
                className={`rounded-2xl border ${config.borderClass} bg-gradient-to-br ${config.bgClass} overflow-hidden transition-all duration-300`}
              >
                {/* Section Header - Always Clickable */}
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                  onClick={() => !isLocked && toggleSection(config.key)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${config.colorClass}`}
                    >
                      {config.icon}
                    </div>
                    <div>
                      <h3
                        className={`font-display text-base font-semibold ${config.colorClass}`}
                      >
                        {isEn ? config.titleEn : config.titleZh}
                      </h3>
                      {isLocked && (
                        <span className="text-[10px] text-muted-foreground">
                          {isEn ? "Members only" : "会员专享"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    ) : isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {isExpanded && !isLocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0">
                        <div className="border-t border-white/5 pt-4">
                          <div className="text-sm leading-relaxed text-gray-300 space-y-2.5">
                            {formatSectionContent(content)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Paywall for locked sections */}
      {!isPaid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="rounded-2xl border border-[#d4a843]/30 bg-gradient-to-br from-[#d4a843]/10 to-transparent p-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4a843]/30 to-[#d4a843]/10 flex items-center justify-center mb-4 mx-auto ring-2 ring-[#d4a843]/20 animate-pulse">
            <Lock className="w-8 h-8 text-[#d4a843]" />
          </div>
          <h4 className="text-lg font-serif text-[#d4a843] mb-2">
            {isEn
              ? "Unlock 7 More Deep Analysis Dimensions"
              : "解锁更多 7 个深度分析维度"}
          </h4>
          <p className="text-sm text-gray-400 mb-1 max-w-md mx-auto">
            {isEn
              ? "Including card interactions, symbolic deep dive, energy timing, core truth synthesis, action steps, ritual guidance, and personalized affirmations"
              : "包含牌面互动与叙事、深层象征探索、能量与时机、核心真相、实践行动指南、仪式冥想建议、个性化肯定语"}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            {isEn
              ? "Instant access · 7-day money-back guarantee"
              : "即时解锁 · 7天无理由退款"}
          </p>
          <Button
            onClick={onUnlock}
            size="lg"
            className="bg-gradient-to-r from-[#d4a843] to-[#b8902e] text-black font-bold hover:opacity-90 gap-2 shadow-lg shadow-[#d4a843]/20 px-8 py-3 text-base"
          >
            <Sparkles className="w-4 h-4" />
            {isEn ? "Unlock Full Report — $1.99" : "解锁完整报告 — ¥12.9"}
          </Button>
          <p className="text-[10px] text-gray-600 mt-2">
            {isEn
              ? "Or get unlimited with membership from $5/mo"
              : "或开通会员从¥16.6/月起无限使用"}
          </p>
        </motion.div>
      )}

      {/* Elemental Energy Distribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <h3 className="font-display text-sm text-[#d4a843] mb-3">
          {isEn ? "Elemental Energy" : "元素能量"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {getElementDistribution(cards).map(({ element, count }) => (
            <div
              key={element}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${getElementColor(element)}`}
            >
              {getElementIcon(element)}
              <span>{element}</span>
              <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function TarotCardVisual({
  card,
  index,
  isExpanded,
  onToggle,
  isEn,
}: {
  card: CardData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isEn: boolean;
}) {
  const positionColors = [
    "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  ];

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-b ${positionColors[index % 3]} overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
      onClick={onToggle}
    >
      {/* Card Header */}
      <div className="p-4 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          {isEn ? card.position : card.positionChinese}
        </div>
        <div className="text-3xl mb-2">{getArcanaSymbol(card)}</div>
        <div className="font-display text-base font-bold text-white">
          {isEn ? card.name : card.nameChinese}
        </div>
        {card.isReversed && (
          <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] border border-red-500/30">
            <RotateCcw className="w-2.5 h-2.5" />
            {isEn ? "Reversed" : "逆位"}
          </div>
        )}
      </div>

      {/* Keywords */}
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-1 justify-center">
          {(isEn ? card.keywords : card.keywordsChinese)
            .slice(0, 3)
            .map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-gray-300"
              >
                {kw}
              </span>
            ))}
        </div>
      </div>

      {/* Element Badge */}
      <div className="px-4 pb-3 flex justify-center">
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] ${getElementColor(card.element)}`}
        >
          {getElementIcon(card.element)}
          {card.element}
        </div>
      </div>

      {/* Expand Toggle */}
      <div className="border-t border-white/10 px-4 py-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
        {isEn ? "Details" : "详情"}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  {isEn ? "Meaning" : "牌义"}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {isEn ? card.meaningUsed : card.meaningUsedChinese}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="px-1.5 py-0.5 rounded bg-white/10">
                  {card.arcana === "major"
                    ? isEn
                      ? "Major Arcana"
                      : "大阿卡纳"
                    : isEn
                      ? "Minor Arcana"
                      : "小阿卡纳"}
                </span>
                {card.suit && (
                  <span className="px-1.5 py-0.5 rounded bg-white/10 capitalize">
                    {card.suit}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================

function getElementDistribution(cards: CardData[]) {
  const counts: Record<string, number> = {};
  for (const card of cards) {
    const el = card.element || "Unknown";
    counts[el] = (counts[el] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([element, count]) => ({ element, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Parse the AI reading into 10 analysis dimensions.
 * Supports both Chinese and English section headers with emoji markers.
 */
function parseReading(
  reading: string,
  isEn: boolean
): Record<string, string> {
  const sections: Record<string, string> = {};

  if (!reading) return sections;

  // Try to parse structured JSON first
  try {
    const parsed = JSON.parse(reading);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
  } catch {
    // Not JSON, parse markdown-style
  }

  // Section detection patterns - map header keywords to section keys
  const sectionPatterns: Array<{
    key: string;
    patterns: RegExp[];
  }> = [
    {
      key: "energy",
      patterns: [
        /总体能量/i,
        /overall\s*energy/i,
        /能量场/i,

      ],
    },
    {
      key: "cards",
      patterns: [
        /逐牌深度/i,
        /逐牌解读/i,
        /card.by.card/i,
        /deep\s*dive/i,

        /牌面解读/i,
      ],
    },
    {
      key: "psychology",
      patterns: [
        /心理原型/i,
        /psychological/i,
        /心理映射/i,

      ],
    },
    {
      key: "interaction",
      patterns: [
        /牌面互动/i,
        /card\s*interaction/i,
        /叙事/i,
        /narrative/i,

      ],
    },
    {
      key: "symbolism",
      patterns: [
        /深层象征/i,
        /symbolic/i,
        /象征探索/i,

      ],
    },
    {
      key: "timing",
      patterns: [
        /能量与时机/i,
        /energy.*timing/i,
        /时机/i,

      ],
    },
    {
      key: "synthesis",
      patterns: [
        /综合归纳/i,
        /核心真相/i,
        /synthesis/i,
        /core\s*truth/i,

      ],
    },
    {
      key: "action",
      patterns: [
        /实践行动/i,
        /行动指南/i,
        /practical\s*action/i,
        /action\s*step/i,

      ],
    },
    {
      key: "ritual",
      patterns: [
        /仪式与冥想/i,
        /仪式/i,
        /冥想建议/i,
        /ritual/i,
        /meditation/i,

      ],
    },
    {
      key: "affirmation",
      patterns: [
        /肯定语/i,
        /结语/i,
        /affirmation/i,
        /closing/i,

      ],
    },
  ];

  // Detect which section a line belongs to
  function detectSection(line: string): string | null {
    for (const sp of sectionPatterns) {
      for (const pattern of sp.patterns) {
        if (pattern.test(line)) {
          return sp.key;
        }
      }
    }
    return null;
  }

  const lines = reading.split("\n");
  let currentKey: string | null = null;
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (currentKey && buffer.length > 0) {
      const text = buffer.join("\n").trim();
      if (text) {
        sections[currentKey] = (sections[currentKey] || "") + (sections[currentKey] ? "\n" : "") + text;
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    // Check if this line is a section header (starts with ## or has emoji markers)
    const isHeader = /^#{1,3}\s/.test(line);

    if (isHeader) {
      const detected = detectSection(line);
      if (detected) {
        flushBuffer();
        currentKey = detected;
        continue;
      }
    }

    // Also check non-header lines for section markers (some LLMs don't use ##)
    if (!currentKey) {
      const detected = detectSection(line);
      if (detected) {
        flushBuffer();
        currentKey = detected;
        // If the line contains more than just the header, keep the content part
        const cleaned = line.replace(/^[#*\-\d.]+\s*/, "").trim();
        const headerRemoved = cleaned
          .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\u2B50\u2728\u23F0]/g, "")
          .replace(/总体能量场|逐牌深度解读|心理原型映射|牌面互动与叙事|深层象征探索|能量与时机|综合归纳与核心真相|实践行动指南|仪式与冥想建议|肯定语与结语/g, "")
          .replace(/Overall Energy Field|Card-by-Card Deep Dive|Psychological Mirror|Card Interactions & Narrative|Symbolic Deep Dive|Energy & Timing|Synthesis & Core Truth|Practical Action Steps|Ritual & Meditation Guidance|Affirmation & Closing/gi, "")
          .trim();
        if (headerRemoved) {
          buffer.push(headerRemoved);
        }
        continue;
      }
    }

    // Regular content line
    if (currentKey) {
      // Clean up markdown header markers but preserve content
      const cleaned = line.replace(/^#{1,4}\s*/, "").trim();
      if (cleaned) {
        buffer.push(cleaned);
      } else if (buffer.length > 0) {
        buffer.push(""); // preserve paragraph breaks
      }
    }
  }
  flushBuffer();

  // Fallback: if no sections were parsed, try to use the whole text
  if (Object.keys(sections).length === 0 && reading.trim()) {
    // Split the reading roughly into sections based on length
    const plain = reading.replace(/^#{1,4}\s.*$/gm, "").trim();
    if (plain.length > 200) {
      const third = Math.floor(plain.length / 3);
      sections["energy"] = plain.slice(0, third).trim();
      sections["cards"] = plain.slice(third, third * 2).trim();
      sections["synthesis"] = plain.slice(third * 2).trim();
    } else {
      sections["energy"] = plain;
    }
  }

  return sections;
}
