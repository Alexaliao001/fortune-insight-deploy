import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Heart,
  Briefcase,
  Coins,
  Activity,
  Star,
  Sparkles,
  Lock,
  Palette,
  Hash,
  ChevronDown,
  ChevronUp,
  Orbit,
  Brain,
  Gem,
  Timer,
  Shield,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractPullQuote } from "@/lib/reportScan";

interface HoroscopeData {
  content: string | null;
  deepAnalysis?: string | null;
  overall: number | null;
  love: { score: number | null; advice: string };
  career: { score: number | null; advice: string };
  wealth: { score: number | null; advice: string };
  health: string | null;
  encouragement: string | null;
  luckyColor: string | null;
  luckyNumber: number | null;
  advice: string | null;
  signData?: {
    name: string;
    nameChinese: string;
    symbol: string;
    element: string;
    elementChinese: string;
    rulingPlanet: string;
    rulingPlanetChinese: string;
  };
}

interface HoroscopeReportProps {
  data: HoroscopeData;
  signName: string;
  signSymbol: string;
  isPaid?: boolean;
  onUnlock?: () => void;
}

// Score color
function getScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

// Circular progress component
function ScoreRing({ score, size = 80, label, icon: Icon }: { score: number; size?: number; label: string; icon: typeof Heart }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const gradientId = `scoreGradient-${label.replace(/\s/g, "")}`;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={4}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={score >= 60 ? "#d4a843" : "#ef4444"} />
              <stop offset="100%" stopColor={score >= 60 ? "#fbbf24" : "#f97316"} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={`w-3.5 h-3.5 ${getScoreColor(score)} mb-0.5`} />
          <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
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
  isFree: boolean;
}

const SECTION_CONFIGS: SectionConfig[] = [
  {
    key: "cosmic",
    icon: <Sparkles className="w-5 h-5" />,
    titleEn: "Cosmic Energy Overview",
    titleZh: "宇宙能量概览",
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/20",
    bgClass: "from-amber-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "planetary",
    icon: <Orbit className="w-5 h-5" />,
    titleEn: "Planetary Transit Analysis",
    titleZh: "行星轨迹解析",
    colorClass: "text-indigo-400",
    borderClass: "border-indigo-500/20",
    bgClass: "from-indigo-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "love",
    icon: <Heart className="w-5 h-5" />,
    titleEn: "Love & Emotional Landscape",
    titleZh: "爱情与情感波动",
    colorClass: "text-pink-400",
    borderClass: "border-pink-500/20",
    bgClass: "from-pink-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "career",
    icon: <Briefcase className="w-5 h-5" />,
    titleEn: "Career & Ambition Compass",
    titleZh: "事业与野心罗盘",
    colorClass: "text-blue-400",
    borderClass: "border-blue-500/20",
    bgClass: "from-blue-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "wealth",
    icon: <Coins className="w-5 h-5" />,
    titleEn: "Wealth & Financial Currents",
    titleZh: "财富与金融暗流",
    colorClass: "text-yellow-400",
    borderClass: "border-yellow-500/20",
    bgClass: "from-yellow-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "health",
    icon: <Activity className="w-5 h-5" />,
    titleEn: "Health & Vitality Guidance",
    titleZh: "健康与活力指引",
    colorClass: "text-green-400",
    borderClass: "border-green-500/20",
    bgClass: "from-green-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "spiritual",
    icon: <Brain className="w-5 h-5" />,
    titleEn: "Spiritual & Inner Growth",
    titleZh: "灵性与内在成长",
    colorClass: "text-violet-400",
    borderClass: "border-violet-500/20",
    bgClass: "from-violet-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "shadow",
    icon: <Shield className="w-5 h-5" />,
    titleEn: "Hidden Challenges & Shadow Work",
    titleZh: "潜在挑战与阴影工作",
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/20",
    bgClass: "from-purple-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "timing",
    icon: <Timer className="w-5 h-5" />,
    titleEn: "Timing & Key Moments",
    titleZh: "时机与关键时刻",
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/20",
    bgClass: "from-cyan-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "affirmation",
    icon: <Flame className="w-5 h-5" />,
    titleEn: "Affirmation & Cosmic Message",
    titleZh: "肯定语与宇宙寄语",
    colorClass: "text-rose-400",
    borderClass: "border-rose-500/20",
    bgClass: "from-rose-500/5 to-transparent",
    isFree: false,
  },
];

// Parse the deep analysis text into sections
function parseDeepAnalysis(text: string, isEn: boolean): Record<string, string> {
  const sections: Record<string, string> = {};
  if (!text) return sections;

  const sectionPatterns: Array<{ key: string; patterns: RegExp[] }> = [
    {
      key: "cosmic",
      patterns: [/宇宙能量/i, /cosmic\s*energy/i, /能量概览/i],
    },
    {
      key: "planetary",
      patterns: [/行星轨迹/i, /planetary\s*transit/i, /行星过境/i],
    },
    {
      key: "love",
      patterns: [/爱情与情感/i, /love.*emotional/i, /情感波动/i],
    },
    {
      key: "career",
      patterns: [/事业与野心/i, /career.*ambition/i, /事业运/i],
    },
    {
      key: "wealth",
      patterns: [/财富与金融/i, /wealth.*financial/i, /金融暗流/i],
    },
    {
      key: "health",
      patterns: [/健康与活力/i, /health.*vitality/i, /活力指引/i],
    },
    {
      key: "spiritual",
      patterns: [/灵性与内在/i, /spiritual.*inner/i, /内在成长/i],
    },
    {
      key: "shadow",
      patterns: [/潜在挑战/i, /hidden\s*challenge/i, /阴影工作/i, /shadow\s*work/i],
    },
    {
      key: "timing",
      patterns: [/时机与关键/i, /timing.*key/i, /关键时刻/i, /⏰/],
    },
    {
      key: "affirmation",
      patterns: [/肯定语/i, /宇宙寄语/i, /affirmation/i, /cosmic\s*message/i],
    },
  ];

  function detectSection(line: string): string | null {
    for (const sp of sectionPatterns) {
      for (const pattern of sp.patterns) {
        if (pattern.test(line)) return sp.key;
      }
    }
    return null;
  }

  const lines = text.split("\n");
  let currentKey: string | null = null;
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (currentKey && buffer.length > 0) {
      const content = buffer.join("\n").trim();
      if (content) {
        sections[currentKey] = (sections[currentKey] || "") + (sections[currentKey] ? "\n" : "") + content;
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    const isHeader = /^#{1,3}\s/.test(line);

    if (isHeader) {
      const detected = detectSection(line);
      if (detected) {
        flushBuffer();
        currentKey = detected;
        continue;
      }
    }

    if (!currentKey) {
      const detected = detectSection(line);
      if (detected) {
        flushBuffer();
        currentKey = detected;
        const cleaned = line.replace(/^[#*\-\d.]+\s*/, "").trim();
        const headerRemoved = cleaned
          .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\u2B50\u2728\u23F0]/g, "")
          .replace(/宇宙能量概览|行星轨迹解析|爱情与情感波动|事业与野心罗盘|财富与金融暗流|健康与活力指引|灵性与内在成长|潜在挑战与阴影工作|时机与关键时刻|肯定语与宇宙寄语/g, "")
          .replace(/Cosmic Energy Overview|Planetary Transit Analysis|Love & Emotional Landscape|Career & Ambition Compass|Wealth & Financial Currents|Health & Vitality Guidance|Spiritual & Inner Growth|Hidden Challenges & Shadow Work|Timing & Key Moments|Affirmation & Cosmic Message/gi, "")
          .trim();
        if (headerRemoved) buffer.push(headerRemoved);
        continue;
      }
    }

    if (currentKey) {
      const cleaned = line.replace(/^#{1,4}\s*/, "").trim();
      if (cleaned) {
        buffer.push(cleaned);
      } else if (buffer.length > 0) {
        buffer.push("");
      }
    }
  }
  flushBuffer();

  // Fallback
  if (Object.keys(sections).length === 0 && text.trim()) {
    const plain = text.replace(/^#{1,4}\s.*$/gm, "").trim();
    if (plain.length > 200) {
      const chunk = Math.floor(plain.length / 3);
      sections["cosmic"] = plain.slice(0, chunk).trim();
      sections["planetary"] = plain.slice(chunk, chunk * 2).trim();
      sections["love"] = plain.slice(chunk * 2).trim();
    } else {
      sections["cosmic"] = plain;
    }
  }

  return sections;
}

// Render markdown-like text with basic formatting
function RenderContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        // Bold text
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200 font-semibold">$1</strong>');
        // Sub-headers (### style within sections)
        if (line.startsWith("###") || line.startsWith("**") && line.endsWith("**")) {
          return (
            <p
              key={i}
              className="text-sm font-semibold text-gray-200 mt-3 mb-1"
              dangerouslySetInnerHTML={{ __html: formatted.replace(/^###\s*/, "").replace(/^\*\*|\*\*$/g, "") }}
            />
          );
        }
        // Bullet points
        if (line.startsWith("- ") || line.startsWith("• ") || /^\d+\.\s/.test(line)) {
          return (
            <p
              key={i}
              className="text-xs text-gray-400 leading-relaxed pl-3 border-l border-white/10"
              dangerouslySetInnerHTML={{ __html: formatted.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "") }}
            />
          );
        }
        return (
          <p
            key={i}
            className="text-xs text-gray-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      })}
    </div>
  );
}

export default function HoroscopeReport({
  data,
  signName,
  signSymbol,
  isPaid = false,
  onUnlock,
}: HoroscopeReportProps) {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["cosmic"])
  );
  /** Deep wall collapsed by default (PRODUCT_UX S01) */
  const [showDeep, setShowDeep] = useState(false);

  // Parse deep analysis if available
  const deepSections = data.deepAnalysis
    ? parseDeepAnalysis(data.deepAnalysis, isEn)
    : {};
  const hasDeepAnalysis = Object.keys(deepSections).length > 0;

  // Null-safe values
  const overall = data.overall ?? 0;
  const loveScore = data.love.score ?? 0;
  const careerScore = data.career.score ?? 0;
  const wealthScore = data.wealth.score ?? 0;
  const takeaway =
    (data.encouragement && data.encouragement.trim()) ||
    extractPullQuote(data.content || data.deepAnalysis || "", 120) ||
    (data.advice && data.advice.trim()) ||
    "";

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filledSections = SECTION_CONFIGS.filter(s => deepSections[s.key]).length;

  return (
    <div className="space-y-6" data-report-scan="horoscope">
      {/* Sign Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="text-5xl mb-2">{signSymbol}</div>
        <h2 className="font-display text-2xl text-[#d4a843]">{signName}</h2>
        {data.signData && (
          <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>{isEn ? data.signData.element : data.signData.elementChinese}</span>
            <span>·</span>
            <span>{isEn ? data.signData.rulingPlanet : data.signData.rulingPlanetChinese}</span>
          </div>
        )}
      </motion.div>

      {/* Above-fold daily takeaway */}
      {(takeaway || overall > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-500/10 via-transparent to-[#d4a843]/5 px-5 py-4"
          data-horoscope-takeaway
          data-report-scan="pull-quote"
        >
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/90">
              {isEn ? "Today at a glance" : "今日一览"}
            </span>
            {overall > 0 && (
              <span className={`text-sm font-bold ${getScoreColor(overall)}`}>
                {isEn ? "Overall" : "综合"} {overall}
              </span>
            )}
          </div>
          {takeaway && (
            <p className="text-sm md:text-base text-[#f0e6c8] leading-relaxed font-medium">
              “{takeaway}”
            </p>
          )}
        </motion.div>
      )}

      {/* Overall Score - Big Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="relative">
          <svg width={140} height={140} className="-rotate-90">
            <circle cx={70} cy={70} r={60} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
            <motion.circle
              cx={70} cy={70} r={60}
              fill="none"
              stroke="url(#overallGradientH)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 60}
              initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 60 - (overall / 100) * 2 * Math.PI * 60 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="overallGradientH" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4a843" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Star className="w-5 h-5 text-[#d4a843] mb-1" />
            <span className={`text-3xl font-bold ${getScoreColor(overall)}`}>{overall}</span>
            <span className="text-[10px] text-muted-foreground">{isEn ? "Overall" : "综合运势"}</span>
          </div>
        </div>
      </motion.div>

      {/* Category Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-6"
      >
        <ScoreRing score={loveScore} label={isEn ? "Love" : "爱情"} icon={Heart} />
        <ScoreRing score={careerScore} label={isEn ? "Career" : "事业"} icon={Briefcase} />
        <ScoreRing score={wealthScore} label={isEn ? "Wealth" : "财运"} icon={Coins} />
      </motion.div>

      {/* Lucky Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-4"
      >
        {data.luckyColor && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs text-gray-300">{data.luckyColor}</span>
          </div>
        )}
        {data.luckyNumber !== undefined && data.luckyNumber !== null && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Hash className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-gray-300">{data.luckyNumber}</span>
          </div>
        )}
      </motion.div>

      {/* Deep Analysis Sections — collapsed by default */}
      {hasDeepAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
          data-deep-analysis
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              {isEn
                ? `${filledSections} deep dimensions available`
                : `${filledSections} 个深度维度可选读`}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-300"
              onClick={() => setShowDeep((v) => !v)}
              aria-expanded={showDeep}
            >
              {showDeep ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  {isEn ? "Hide deep analysis" : "收起深度分析"}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  {isEn ? "Show deep analysis" : "展开深度分析"}
                </>
              )}
            </Button>
          </div>
          {!showDeep && (
            <p className="text-xs text-muted-foreground text-center py-2">
              {isEn
                ? "Scores & today’s message are above — open deep analysis when you want more."
                : "上方已有分数与今日寄语 — 需要时再展开深度分析。"}
            </p>
          )}
          {showDeep && (
          <>
          {/* Dimension count badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="px-3 py-1 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/30">
              <span className="text-xs text-[#d4a843]">
                {isEn
                  ? `${filledSections} Dimensions Analyzed`
                  : `${filledSections}个维度深度分析`}
              </span>
            </div>
          </div>

          {SECTION_CONFIGS.map((config, index) => {
            const content = deepSections[config.key];
            if (!content) return null;

            const isExpanded = expandedSections.has(config.key);
            const isLocked = !config.isFree && !isPaid;

            return (
              <motion.div
                key={config.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className={`rounded-xl border ${config.borderClass} bg-gradient-to-r ${config.bgClass} overflow-hidden`}
              >
                <button
                  onClick={() => !isLocked && toggleSection(config.key)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
                >
                  <span className={config.colorClass}>{config.icon}</span>
                  <span className={`text-sm font-medium ${config.colorClass} flex-1`}>
                    {isEn ? config.titleEn : config.titleZh}
                  </span>
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-gray-500" />
                  ) : (
                    isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && !isLocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <RenderContent text={content} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Paywall for locked sections */}
          {!isPaid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="rounded-2xl border border-[#d4a843]/30 bg-gradient-to-br from-[#d4a843]/10 to-transparent p-6 text-center space-y-3"
            >
              <Lock className="w-8 h-8 text-[#d4a843] mx-auto" />
              <p className="text-sm text-gray-400">
                {isEn
                  ? "Unlock 7 more dimensions: Career, Wealth, Health, Spiritual Growth, Shadow Work, Timing, and Cosmic Affirmations"
                  : "解锁7个深度维度：事业罗盘、财富暗流、健康指引、灵性成长、阴影工作、时机把握、宇宙寄语"}
              </p>
              <Button
                onClick={onUnlock}
                className="bg-gradient-to-r from-[#d4a843] to-[#b8902e] text-black font-semibold hover:opacity-90 gap-2"
              >
                <Lock className="w-4 h-4" />
                {isEn ? "Unlock Full Analysis" : "解锁完整分析"}
              </Button>
            </motion.div>
          )}
          </>
          )}
        </motion.div>
      )}

      {/* Fallback: Legacy simple display when no deep analysis */}
      {!hasDeepAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          {/* Love Advice */}
          {data.love.advice && (
            <div className="rounded-xl border border-pink-500/20 bg-gradient-to-r from-pink-500/5 to-transparent p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-sm font-medium text-pink-400">{isEn ? "Love" : "爱情运势"}</span>
                <span className={`ml-auto text-sm font-bold ${getScoreColor(loveScore)}`}>{loveScore}/100</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{data.love.advice}</p>
            </div>
          )}

          {/* Career Advice */}
          {data.career.advice && (
            <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-transparent p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">{isEn ? "Career" : "事业运势"}</span>
                <span className={`ml-auto text-sm font-bold ${getScoreColor(careerScore)}`}>{careerScore}/100</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{data.career.advice}</p>
            </div>
          )}

          {/* Wealth Advice */}
          {data.wealth.advice && (
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">{isEn ? "Wealth" : "财运"}</span>
                <span className={`ml-auto text-sm font-bold ${getScoreColor(wealthScore)}`}>{wealthScore}/100</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{data.wealth.advice}</p>
            </div>
          )}

          {/* Detailed Content */}
          <div className="relative">
            <div className={!isPaid ? "filter blur-sm select-none pointer-events-none" : ""}>
              {data.health && (
                <div className="rounded-xl border border-green-500/20 bg-gradient-to-r from-green-500/5 to-transparent p-4 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">{isEn ? "Health" : "健康"}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{data.health}</p>
                </div>
              )}
              {data.content && (
                <div className="rounded-2xl border border-[#d4a843]/20 bg-gradient-to-br from-[#d4a843]/5 to-transparent p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#d4a843]" />
                    <h3 className="font-display text-base text-[#d4a843]">
                      {isEn ? "Today's Reading" : "今日详解"}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{data.content}</p>
                </div>
              )}
              {data.encouragement && (
                <div className="mt-4 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-5 text-center">
                  <p className="text-sm text-purple-300 italic leading-relaxed">
                    &ldquo;{data.encouragement}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {!isPaid && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent rounded-2xl">
                <Lock className="w-8 h-8 text-[#d4a843] mb-3" />
                <p className="text-sm text-gray-400 mb-4 text-center px-4">
                  {isEn
                    ? "Unlock detailed health insights and personalized daily guidance"
                    : "解锁详细健康建议和个性化每日指引"}
                </p>
                <Button
                  onClick={onUnlock}
                  className="bg-gradient-to-r from-[#d4a843] to-[#b8902e] text-black font-semibold hover:opacity-90 gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {isEn ? "Unlock Full Reading" : "解锁完整运势"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Encouragement at bottom */}
      {hasDeepAnalysis && data.encouragement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-5 text-center"
        >
          <p className="text-sm text-purple-300 italic leading-relaxed">
            &ldquo;{data.encouragement}&rdquo;
          </p>
        </motion.div>
      )}
    </div>
  );
}
