import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Heart,
  Flame,
  MessageCircle,
  Shield,
  Sprout,
  Zap,
  Home,
  Moon,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronUp,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompatibilityScores {
  loveScore: number;
  passionScore: number;
  communicationScore: number;
  trustScore: number;
  growthScore: number;
  longTermScore: number;
  summary: string;
}

interface CompatData {
  overallScore: number;
  scores: CompatibilityScores;
  deepAnalysis: string;
  elementCompat: { score: number; dynamic: string };
  modalityCompat: { score: number; dynamic: string };
  polarityCompat: { score: number; dynamic: string };
  sign1: { name: string; nameChinese: string; symbol: string; element: string; elementChinese: string };
  sign2: { name: string; nameChinese: string; symbol: string; element: string; elementChinese: string };
}

interface CompatibilityReportProps {
  data: CompatData;
  person1Name: string;
  person2Name: string;
  isPaid?: boolean;
  onUnlock?: () => void;
}

// Score ring component
function ScoreRing({ score, size = 100, label }: { score: number; size?: number; label: string }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const gradientId = `compat-${label.replace(/\s/g, "")}`;

  const getColor = (s: number) => {
    if (s >= 80) return ["#10b981", "#34d399"];
    if (s >= 60) return ["#f59e0b", "#fbbf24"];
    if (s >= 40) return ["#f97316", "#fb923c"];
    return ["#ef4444", "#f87171"];
  };
  const [c1, c2] = getColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c1} />
              <stop offset="100%" stopColor={c2} />
            </linearGradient>
          </defs>
          <circle
            cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={`url(#${gradientId})`} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color: c1 }}>{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 text-center max-w-[80px] leading-tight">{label}</span>
    </div>
  );
}

// Section configuration for the 10 compatibility dimensions
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
    titleEn: "Cosmic Connection Overview",
    titleZh: "宇宙连接概览",
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/20",
    bgClass: "from-amber-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "passion",
    icon: <Flame className="w-5 h-5" />,
    titleEn: "Passion & Physical Chemistry",
    titleZh: "激情与身体化学反应",
    colorClass: "text-red-400",
    borderClass: "border-red-500/20",
    bgClass: "from-red-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "emotional",
    icon: <Heart className="w-5 h-5" />,
    titleEn: "Emotional Resonance & Love Language",
    titleZh: "情感共鸣与爱的语言",
    colorClass: "text-pink-400",
    borderClass: "border-pink-500/20",
    bgClass: "from-pink-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "communication",
    icon: <MessageCircle className="w-5 h-5" />,
    titleEn: "Communication & Intellectual Bond",
    titleZh: "沟通与智性纽带",
    colorClass: "text-blue-400",
    borderClass: "border-blue-500/20",
    bgClass: "from-blue-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "trust",
    icon: <Shield className="w-5 h-5" />,
    titleEn: "Trust & Loyalty Dynamics",
    titleZh: "信任与忠诚动态",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/20",
    bgClass: "from-emerald-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "growth",
    icon: <Sprout className="w-5 h-5" />,
    titleEn: "Growth & Evolution Together",
    titleZh: "共同成长与进化",
    colorClass: "text-green-400",
    borderClass: "border-green-500/20",
    bgClass: "from-green-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "conflict",
    icon: <Zap className="w-5 h-5" />,
    titleEn: "Conflict Patterns & Resolution",
    titleZh: "冲突模式与化解之道",
    colorClass: "text-orange-400",
    borderClass: "border-orange-500/20",
    bgClass: "from-orange-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "longterm",
    icon: <Home className="w-5 h-5" />,
    titleEn: "Long-Term & Domestic Harmony",
    titleZh: "长期相处与家庭和谐",
    colorClass: "text-teal-400",
    borderClass: "border-teal-500/20",
    bgClass: "from-teal-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "shadow",
    icon: <Moon className="w-5 h-5" />,
    titleEn: "Shadow Work & Hidden Challenges",
    titleZh: "阴影工作与隐藏挑战",
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/20",
    bgClass: "from-purple-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "blessing",
    icon: <Sparkles className="w-5 h-5" />,
    titleEn: "Cosmic Blessing & Guidance",
    titleZh: "宇宙祝福与指引",
    colorClass: "text-rose-400",
    borderClass: "border-rose-500/20",
    bgClass: "from-rose-500/5 to-transparent",
    isFree: false,
  },
];

// Parse the deep analysis text into sections
function parseDeepAnalysis(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  if (!text) return sections;

  const sectionPatterns: Array<{ key: string; patterns: RegExp[] }> = [
    { key: "cosmic", patterns: [/宇宙连接/i, /cosmic\s*connection/i] },
    { key: "passion", patterns: [/激情/i, /身体化学/i, /passion.*physical/i, /physical\s*chemistry/i] },
    { key: "emotional", patterns: [/情感共鸣/i, /爱的语言/i, /emotional\s*resonance/i, /love\s*language/i] },
    { key: "communication", patterns: [/沟通与智性/i, /communication.*intellectual/i, /智性纽带/i] },
    { key: "trust", patterns: [/信任与忠诚/i, /trust.*loyalty/i, /忠诚动态/i] },
    { key: "growth", patterns: [/共同成长/i, /growth.*evolution/i, /进化/i] },
    { key: "conflict", patterns: [/冲突模式/i, /conflict.*pattern/i, /化解之道/i, /conflict.*resolution/i] },
    { key: "longterm", patterns: [/长期相处/i, /long.?term/i, /家庭和谐/i, /domestic\s*harmony/i] },
    { key: "shadow", patterns: [/阴影工作/i, /shadow\s*work/i, /隐藏挑战/i, /hidden\s*challenge/i] },
    { key: "blessing", patterns: [/宇宙祝福/i, /cosmic\s*blessing/i, /宇宙指引/i, /cosmic\s*guidance/i] },
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
          .replace(/宇宙连接概览|激情与身体化学反应|情感共鸣与爱的语言|沟通与智性纽带|信任与忠诚动态|共同成长与进化|冲突模式与化解之道|长期相处与家庭和谐|阴影工作与隐藏挑战|宇宙祝福与指引/g, "")
          .replace(/Cosmic Connection Overview|Passion & Physical Chemistry|Emotional Resonance & Love Language|Communication & Intellectual Bond|Trust & Loyalty Dynamics|Growth & Evolution Together|Conflict Patterns & Resolution|Long-Term & Domestic Harmony|Shadow Work & Hidden Challenges|Cosmic Blessing & Guidance/gi, "")
          .trim();
        if (headerRemoved) buffer.push(headerRemoved);
        continue;
      }
    }

    if (currentKey) {
      buffer.push(line);
    }
  }
  flushBuffer();

  return sections;
}

export default function CompatibilityReport({ data, person1Name, person2Name, isPaid = false, onUnlock }: CompatibilityReportProps) {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ cosmic: true, passion: true, emotional: true });

  const parsedSections = parseDeepAnalysis(data.deepAnalysis);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return isEn ? "Soulmate" : "灵魂伴侣";
    if (score >= 80) return isEn ? "Excellent" : "极佳";
    if (score >= 70) return isEn ? "Great" : "很好";
    if (score >= 60) return isEn ? "Good" : "良好";
    if (score >= 50) return isEn ? "Moderate" : "一般";
    return isEn ? "Challenging" : "需要磨合";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-400";
    if (score >= 60) return "from-amber-500 to-yellow-400";
    if (score >= 40) return "from-orange-500 to-amber-400";
    return "from-red-500 to-orange-400";
  };

  return (
    <div className="space-y-6">
      {/* Header: Two signs with heart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-[#d4a843]/30 bg-gradient-to-br from-[#1a1025] via-[#0d0f1a] to-[#1a1025] p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,168,67,0.08),transparent_70%)]" />
        
        <div className="relative flex flex-col items-center gap-4">
          {/* Signs display */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-2">{data.sign1.symbol}</div>
              <div className="text-sm font-medium text-gray-300">{person1Name}</div>
              <div className="text-xs text-gray-500">{isEn ? data.sign1.name : data.sign1.nameChinese}</div>
            </div>
            
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#d4a843]/20 to-pink-500/20 flex items-center justify-center ring-2 ring-[#d4a843]/30">
                <div className="text-center">
                  <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${getScoreColor(data.overallScore)} bg-clip-text text-transparent`}>
                    {data.overallScore}
                  </div>
                  <div className="text-[10px] text-gray-400">{getScoreLabel(data.overallScore)}</div>
                </div>
              </div>
              <Heart className="absolute -top-1 -right-1 w-5 h-5 text-pink-400 animate-pulse" />
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl mb-2">{data.sign2.symbol}</div>
              <div className="text-sm font-medium text-gray-300">{person2Name}</div>
              <div className="text-xs text-gray-500">{isEn ? data.sign2.name : data.sign2.nameChinese}</div>
            </div>
          </div>

          {/* Summary */}
          <p className="text-sm text-gray-400 text-center max-w-md">{data.scores.summary}</p>

          {/* Compatibility metrics */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-2">
            <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-xs text-gray-500 mb-1">{isEn ? "Element" : "元素"}</div>
              <div className="text-lg font-bold text-amber-400">{data.elementCompat.score}</div>
              <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{data.elementCompat.dynamic}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-xs text-gray-500 mb-1">{isEn ? "Modality" : "模式"}</div>
              <div className="text-lg font-bold text-indigo-400">{data.modalityCompat.score}</div>
              <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{data.modalityCompat.dynamic}</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
              <div className="text-xs text-gray-500 mb-1">{isEn ? "Polarity" : "极性"}</div>
              <div className="text-lg font-bold text-pink-400">{data.polarityCompat.score}</div>
              <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{data.polarityCompat.dynamic}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dimension scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <h3 className="text-sm font-medium text-gray-400 mb-4 text-center">
          {isEn ? "Dimension Scores" : "维度评分"}
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          <ScoreRing score={data.scores.loveScore} label={isEn ? "Love" : "爱情"} />
          <ScoreRing score={data.scores.passionScore} label={isEn ? "Passion" : "激情"} />
          <ScoreRing score={data.scores.communicationScore} label={isEn ? "Communication" : "沟通"} />
          <ScoreRing score={data.scores.trustScore} label={isEn ? "Trust" : "信任"} />
          <ScoreRing score={data.scores.growthScore} label={isEn ? "Growth" : "成长"} />
          <ScoreRing score={data.scores.longTermScore} label={isEn ? "Long-term" : "长期"} />
        </div>
      </motion.div>

      {/* 10 Dimension Sections */}
      <div className="space-y-3">
        {SECTION_CONFIGS.map((config, index) => {
          const content = parsedSections[config.key];
          const isLocked = !config.isFree && !isPaid;
          const isExpanded = expandedSections[config.key] ?? false;

          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`rounded-xl border ${config.borderClass} bg-gradient-to-r ${config.bgClass} overflow-hidden`}
            >
              <button
                onClick={() => {
                  if (isLocked && onUnlock) {
                    onUnlock();
                  } else {
                    toggleSection(config.key);
                  }
                }}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`${config.colorClass}`}>{config.icon}</div>
                  <div>
                    <span className={`font-medium ${config.colorClass}`}>
                      {isEn ? config.titleEn : config.titleZh}
                    </span>
                    {isLocked && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-500">
                        <Lock className="w-3 h-3" />
                        <Crown className="w-3 h-3 text-[#d4a843]" />
                      </span>
                    )}
                  </div>
                </div>
                {!isLocked && (
                  isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && !isLocked && content && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-12">
                      <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                        {content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
