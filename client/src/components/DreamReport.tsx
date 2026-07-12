import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Moon,
  Brain,
  Eye,
  Sparkles,
  Lock,
  BookOpen,
  Layers,
  Heart,
  Map,
  Compass,
  Shield,
  Activity,
  Flame,
  Feather,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractPullQuote } from "@/lib/reportScan";

interface SymbolAnalysis {
  symbol: string;
  symbolChinese: string;
  category: string;
  meaning: string;
  meaningChinese: string;
  jungianArchetype: string;
  psychologicalInsight: string;
}

interface DreamTheme {
  name: string;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
}

interface DreamProfile {
  dominantElement: string;
  elementDistribution: Record<string, number>;
  archetypePresence: string[];
  emotionalTone: string;
  narrativePattern: string;
}

interface DreamReportProps {
  interpretation: string;
  symbolAnalysis: SymbolAnalysis[];
  theme: DreamTheme | null;
  dreamContent: string;
  emotions: string[];
  keyElements: string[];
  isPaid?: boolean;
  onUnlock?: () => void;
  dreamProfile?: DreamProfile | null;
}

const categoryIcons: Record<string, string> = {
  nature: "⚘", animal: "•", person: "☆", object: "◇",
  action: "→", place: "△", emotion: "∼", body: "○", supernatural: "✦",
};

const categoryColors: Record<string, string> = {
  nature: "from-green-500/20 to-emerald-500/10 border-green-500/30",
  animal: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  person: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
  object: "from-purple-500/20 to-violet-500/10 border-purple-500/30",
  action: "from-red-500/20 to-rose-500/10 border-red-500/30",
  place: "from-indigo-500/20 to-blue-500/10 border-indigo-500/30",
  emotion: "from-pink-500/20 to-rose-500/10 border-pink-500/30",
  body: "from-teal-500/20 to-cyan-500/10 border-teal-500/30",
  supernatural: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
};

// Element colors for the profile display
const elementColors: Record<string, string> = {
  Water: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Fire: "text-red-400 bg-red-500/10 border-red-500/20",
  Earth: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Air: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Spirit: "text-violet-400 bg-violet-500/10 border-violet-500/20",
};

const elementEmoji: Record<string, string> = {
  Water: "≈", Fire: "♦", Earth: "■", Air: "◢", Spirit: "✦",
};

// ============================================================
// 10-Dimension Section Configuration
// ============================================================

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
    key: "landscape",
    icon: <Moon className="w-5 h-5" />,
    titleEn: "Dream Landscape Overview",
    titleZh: "梦境全景概览",
    colorClass: "text-indigo-400",
    borderClass: "border-indigo-500/20",
    bgClass: "from-indigo-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "symbols",
    icon: <Eye className="w-5 h-5" />,
    titleEn: "Symbol Archaeology",
    titleZh: "符号考古学",
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/20",
    bgClass: "from-amber-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "emotional",
    icon: <Heart className="w-5 h-5" />,
    titleEn: "Emotional Cartography",
    titleZh: "情绪地图学",
    colorClass: "text-pink-400",
    borderClass: "border-pink-500/20",
    bgClass: "from-pink-500/5 to-transparent",
    isFree: true,
  },
  {
    key: "archetype",
    icon: <Brain className="w-5 h-5" />,
    titleEn: "Jungian Archetype Analysis",
    titleZh: "荣格原型深度解析",
    colorClass: "text-violet-400",
    borderClass: "border-violet-500/20",
    bgClass: "from-violet-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "subconscious",
    icon: <Map className="w-5 h-5" />,
    titleEn: "Subconscious Mapping",
    titleZh: "潜意识地图",
    colorClass: "text-teal-400",
    borderClass: "border-teal-500/20",
    bgClass: "from-teal-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "narrative",
    icon: <BookOpen className="w-5 h-5" />,
    titleEn: "Narrative Structure & Dream Logic",
    titleZh: "叙事结构与梦境逻辑",
    colorClass: "text-blue-400",
    borderClass: "border-blue-500/20",
    bgClass: "from-blue-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "bodymind",
    icon: <Activity className="w-5 h-5" />,
    titleEn: "Body-Mind Connection",
    titleZh: "身心连接",
    colorClass: "text-green-400",
    borderClass: "border-green-500/20",
    bgClass: "from-green-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "action",
    icon: <Compass className="w-5 h-5" />,
    titleEn: "Practical Action Guide",
    titleZh: "实践行动指南",
    colorClass: "text-orange-400",
    borderClass: "border-orange-500/20",
    bgClass: "from-orange-500/5 to-transparent",
    isFree: false,
  },
  {
    key: "ritual",
    icon: <Feather className="w-5 h-5" />,
    titleEn: "Meditation & Ritual Suggestions",
    titleZh: "冥想与仪式建议",
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/20",
    bgClass: "from-purple-500/5 to-transparent",
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

// ============================================================
// Parse 10-dimension deep analysis text into sections
// ============================================================

function parseDeepAnalysis(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  if (!text) return sections;

  const sectionPatterns: Array<{ key: string; patterns: RegExp[] }> = [
    {
      key: "landscape",
      patterns: [/梦境全景/i, /dream\s*landscape/i, /全景概览/i, /landscape\s*overview/i],
    },
    {
      key: "symbols",
      patterns: [/符号考古/i, /symbol\s*archaeo/i, /符号解析/i, /symbol\s*analysis/i],
    },
    {
      key: "emotional",
      patterns: [/情绪地图/i, /emotional\s*cartograph/i, /情绪解码/i, /emotional\s*decod/i],
    },
    {
      key: "archetype",
      patterns: [/荣格原型/i, /jungian\s*archetype/i, /原型分析/i, /archetype\s*analysis/i],
    },
    {
      key: "subconscious",
      patterns: [/潜意识地图/i, /subconscious\s*map/i, /潜意识/i, /subconscious/i],
    },
    {
      key: "narrative",
      patterns: [/叙事结构/i, /narrative\s*structure/i, /梦境逻辑/i, /dream\s*logic/i],
    },
    {
      key: "bodymind",
      patterns: [/身心连接/i, /body.*mind\s*connect/i, /身体.*心灵/i, /body.*mind/i],
    },
    {
      key: "action",
      patterns: [/实践行动/i, /practical\s*action/i, /行动指南/i, /action\s*guide/i],
    },
    {
      key: "ritual",
      patterns: [/冥想与仪式/i, /meditation.*ritual/i, /仪式建议/i, /ritual\s*suggest/i],
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
        // Strip the header text itself
        const cleaned = line.replace(/^[#*\-\d.]+\s*/, "").trim();
        const headerRemoved = cleaned
          .replace(/梦境全景概览|符号考古学|情绪地图学|荣格原型深度解析|潜意识地图|叙事结构与梦境逻辑|身心连接|实践行动指南|冥想与仪式建议|肯定语与宇宙寄语/g, "")
          .replace(/Dream Landscape Overview|Symbol Archaeology|Emotional Cartography|Jungian Archetype Analysis|Subconscious Mapping|Narrative Structure & Dream Logic|Body-Mind Connection|Practical Action Guide|Meditation & Ritual Suggestions|Affirmation & Cosmic Message/gi, "")
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

  // Fallback: if no sections parsed, split the text
  if (Object.keys(sections).length === 0 && text.trim()) {
    const plain = text.replace(/^#{1,4}\s.*$/gm, "").trim();
    if (plain.length > 200) {
      const chunk = Math.floor(plain.length / 3);
      sections["landscape"] = plain.slice(0, chunk).trim();
      sections["symbols"] = plain.slice(chunk, chunk * 2).trim();
      sections["emotional"] = plain.slice(chunk * 2).trim();
    } else {
      sections["landscape"] = plain;
    }
  }

  return sections;
}

// ============================================================
// Render markdown-like text with basic formatting
// ============================================================

function RenderContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200 font-semibold">$1</strong>');
        if (line.startsWith("###") || (line.startsWith("**") && line.endsWith("**"))) {
          return (
            <p
              key={i}
              className="text-sm font-semibold text-gray-200 mt-3 mb-1"
              dangerouslySetInnerHTML={{ __html: formatted.replace(/^###\s*/, "").replace(/^\*\*|\*\*$/g, "") }}
            />
          );
        }
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

// ============================================================
// Main DreamReport Component
// ============================================================

export default function DreamReport({
  interpretation,
  symbolAnalysis,
  theme,
  dreamContent,
  emotions,
  keyElements,
  isPaid = false,
  onUnlock,
  dreamProfile,
}: DreamReportProps) {
  const { language } = useTranslation();
  const isEn = language === "en";
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["landscape", "symbols", "emotional"])
  );
  const pullQuote = extractPullQuote(interpretation, 140);

  // Parse deep analysis
  const deepSections = parseDeepAnalysis(interpretation);
  const hasDeepAnalysis = Object.keys(deepSections).length > 0;
  const filledSections = SECTION_CONFIGS.filter(s => deepSections[s.key]).length;

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6" data-report-scan="dream">
      {/* Dream Analysis Report Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
          <Moon className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-300 font-medium">
            {isEn ? "Deep Dream Analysis Report" : "深度梦境解析报告"}
          </span>
        </div>
        {hasDeepAnalysis && (
          <div className="flex items-center justify-center gap-2">
            <div className="px-3 py-1 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/30">
              <span className="text-xs text-[#d4a843]">
                {isEn
                  ? `${filledSections} Dimensions Analyzed`
                  : `${filledSections}个维度深度分析`}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {pullQuote && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-500/10 to-transparent px-5 py-4"
          data-report-scan="pull-quote"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-violet-300/90 mb-1.5">
            {isEn ? "Key insight" : "核心一句话"}
          </div>
          <p className="text-sm md:text-base text-[#f0e6c8] leading-relaxed font-medium">
            “{pullQuote}”
          </p>
        </motion.div>
      )}

      {/* Dream Theme */}
      {theme && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/5 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-violet-300">
                {isEn ? "Dream Theme" : "梦境主题"}
              </h3>
              <p className="text-lg font-display text-white">
                {isEn ? theme.name : theme.nameChinese}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {isEn ? theme.description : theme.descriptionChinese}
          </p>
        </motion.div>
      )}

      {/* Dream Profile Cards (Element, Archetype, Emotional Tone, Narrative) */}
      {dreamProfile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {/* Dominant Element */}
          <div className={`rounded-xl border p-3 text-center ${elementColors[dreamProfile.dominantElement] || "text-gray-400 bg-gray-500/10 border-gray-500/20"}`}>
            <div className="text-2xl mb-1">{elementEmoji[dreamProfile.dominantElement] || "◇"}</div>
            <div className="text-[10px] text-muted-foreground mb-0.5">{isEn ? "Dominant Element" : "主导元素"}</div>
            <div className="text-xs font-semibold">{dreamProfile.dominantElement}</div>
          </div>

          {/* Emotional Tone */}
          <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-3 text-center">
            <div className="text-2xl mb-1">♡</div>
            <div className="text-[10px] text-muted-foreground mb-0.5">{isEn ? "Emotional Tone" : "情绪基调"}</div>
            <div className="text-xs font-semibold text-pink-400">{dreamProfile.emotionalTone}</div>
          </div>

          {/* Narrative Pattern */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-center">
            <div className="text-2xl mb-1">□</div>
            <div className="text-[10px] text-muted-foreground mb-0.5">{isEn ? "Narrative" : "叙事模式"}</div>
            <div className="text-xs font-semibold text-blue-400">{dreamProfile.narrativePattern}</div>
          </div>

          {/* Active Archetypes */}
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 text-center">
            <div className="text-2xl mb-1">✦</div>
            <div className="text-[10px] text-muted-foreground mb-0.5">{isEn ? "Archetypes" : "活跃原型"}</div>
            <div className="text-xs font-semibold text-violet-400">
              {dreamProfile.archetypePresence.slice(0, 2).join(", ")}
              {dreamProfile.archetypePresence.length > 2 && ` +${dreamProfile.archetypePresence.length - 2}`}
            </div>
          </div>
        </motion.div>
      )}

      {/* Element Distribution Bar */}
      {dreamProfile && Object.values(dreamProfile.elementDistribution).some(v => v > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#d4a843]" />
            <span className="text-xs font-medium text-[#d4a843]">{isEn ? "Element Energy Distribution" : "元素能量分布"}</span>
          </div>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-white/5">
            {Object.entries(dreamProfile.elementDistribution)
              .filter(([_, v]) => v > 0)
              .map(([element, value]) => {
                const total = Object.values(dreamProfile.elementDistribution).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (value / total) * 100 : 0;
                const colors: Record<string, string> = {
                  Water: "bg-blue-500", Fire: "bg-red-500", Earth: "bg-amber-500",
                  Air: "bg-cyan-500", Spirit: "bg-violet-500",
                };
                return (
                  <motion.div
                    key={element}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className={`${colors[element] || "bg-gray-500"} rounded-full`}
                    title={`${element}: ${value}`}
                  />
                );
              })}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.entries(dreamProfile.elementDistribution)
              .filter(([_, v]) => v > 0)
              .map(([element, value]) => (
                <span key={element} className="text-[10px] text-muted-foreground">
                  {elementEmoji[element]} {element} ({value})
                </span>
              ))}
          </div>
        </motion.div>
      )}

      {/* Emotion Tags */}
      {emotions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {emotions.map((emotion, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs bg-pink-500/10 border border-pink-500/20 text-pink-300"
            >
              {emotion}
            </span>
          ))}
        </motion.div>
      )}

      {/* Symbol Analysis Cards */}
      {symbolAnalysis.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-[#d4a843]" />
            <h3 className="text-sm font-semibold text-[#d4a843]">
              {isEn ? "Identified Symbols" : "识别符号"}
            </h3>
            <span className="text-xs text-muted-foreground ml-auto">
              {symbolAnalysis.length} {isEn ? "symbols found" : "个符号"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {symbolAnalysis.map((symbol, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`rounded-xl border bg-gradient-to-br p-4 ${
                  categoryColors[symbol.category] || "from-gray-500/20 to-gray-500/10 border-gray-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">
                    {categoryIcons[symbol.category] || "◇"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-white">
                        {isEn ? symbol.symbol : symbol.symbolChinese}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400">
                        {symbol.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-2">
                      {isEn ? symbol.meaning : symbol.meaningChinese}
                    </p>
                    {symbol.jungianArchetype && (
                      <div className="flex items-center gap-1.5 text-[10px] text-violet-400">
                        <Brain className="w-3 h-3" />
                        <span>{symbol.jungianArchetype}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 10-Dimension Deep Analysis Sections */}
      {hasDeepAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
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
                transition={{ delay: 0.6 + index * 0.05 }}
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
              transition={{ delay: 1 }}
              className="rounded-2xl border border-[#d4a843]/30 bg-gradient-to-br from-[#d4a843]/10 to-transparent p-6 text-center space-y-3"
            >
              <Lock className="w-8 h-8 text-[#d4a843] mx-auto" />
              <p className="text-sm text-gray-400">
                {isEn
                  ? "Unlock 7 more dimensions: Jungian Archetypes, Subconscious Mapping, Narrative Structure, Body-Mind Connection, Action Guide, Meditation & Rituals, and Cosmic Message"
                  : "解锁7个深度维度：荣格原型解析、潜意识地图、叙事结构、身心连接、行动指南、冥想仪式、宇宙寄语"}
              </p>
              <Button
                onClick={onUnlock}
                className="bg-gradient-to-r from-[#d4a843] to-[#b8902e] text-black font-semibold hover:opacity-90 gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {isEn ? "Unlock Full Analysis" : "解锁完整分析"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Key Elements */}
      {keyElements.length > 0 && isPaid && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {keyElements.map((el, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
            >
              {el}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
