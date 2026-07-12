import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lock,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Gem,
  Calendar,
  TrendingUp,
  Eye,
  Star,
  Heart,
  Briefcase,
  Coins,
  Activity,
  GraduationCap,
  Users,
  Compass,
  Sun,
  Shield,
  Brain,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractPullQuote } from "@/lib/reportScan";

// Types matching the backend BaziChart response
interface BaziPillar {
  chinese: string;
  heavenlyStem: string;
  earthlyBranch: string;
  stemElement: string;
  branchElement: string;
  animal: string;
  stemYinYang: string;
  hiddenStems: Array<{
    character: string;
    element: string;
    yinYang: string;
    tenGod?: { name: string; chinese: string; relationship: string };
  }>;
  lifeCycle: string;
  naYin: string;
}

interface FiveElementsDistribution {
  METAL: number;
  WOOD: number;
  WATER: number;
  FIRE: number;
  EARTH: number;
}

interface DayMasterInfo {
  character: string;
  element: string;
  yinYang: string;
  strength: string;
  favorableElements: string[];
  unfavorableElements: string[];
}

interface LuckPillar {
  number: number;
  chinese: string;
  stemCharacter: string;
  branchCharacter: string;
  stemElement: string;
  branchElement: string;
  animal: string;
  ageStart: number;
  yearStart: number;
  yearEnd: number;
}

interface BaZiChartData {
  yearPillar: BaziPillar;
  monthPillar: BaziPillar;
  dayPillar: BaziPillar;
  hourPillar: BaziPillar;
  dayMaster: DayMasterInfo;
  fiveElements: FiveElementsDistribution;
  dominantElement: string;
  weakestElement: string;
  luckPillars?: LuckPillar[];
}

interface BaZiReportProps {
  chart: BaZiChartData;
  reading: string;
  isPaid?: boolean;
  onUnlock?: () => void;
}

// Element name mapping
const ELEMENT_NAMES: Record<string, { en: string; zh: string; color: string; icon: typeof Flame }> = {
  METAL: { en: "Metal", zh: "金", color: "text-yellow-300 bg-yellow-500/10 border-yellow-500/30", icon: Gem },
  WOOD: { en: "Wood", zh: "木", color: "text-green-400 bg-green-500/10 border-green-500/30", icon: TrendingUp },
  WATER: { en: "Water", zh: "水", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", icon: Droplets },
  FIRE: { en: "Fire", zh: "火", color: "text-red-400 bg-red-500/10 border-red-500/30", icon: Flame },
  EARTH: { en: "Earth", zh: "土", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: Mountain },
};

// Element color for pillar display
function getElementBg(element: string) {
  const el = element?.toUpperCase() || "";
  if (el.includes("METAL")) return "from-yellow-900/40 to-yellow-800/20 border-yellow-500/40";
  if (el.includes("WOOD")) return "from-green-900/40 to-green-800/20 border-green-500/40";
  if (el.includes("WATER")) return "from-blue-900/40 to-blue-800/20 border-blue-500/40";
  if (el.includes("FIRE")) return "from-red-900/40 to-red-800/20 border-red-500/40";
  if (el.includes("EARTH")) return "from-amber-900/40 to-amber-800/20 border-amber-500/40";
  return "from-gray-900/40 to-gray-800/20 border-gray-500/40";
}

function getElementTextColor(element: string) {
  const el = element?.toUpperCase() || "";
  if (el.includes("METAL")) return "text-yellow-300";
  if (el.includes("WOOD")) return "text-green-400";
  if (el.includes("WATER")) return "text-blue-400";
  if (el.includes("FIRE")) return "text-red-400";
  if (el.includes("EARTH")) return "text-amber-400";
  return "text-gray-400";
}

// Section configuration for the 12 analysis dimensions
interface SectionConfig {
  id: string;
  zhTitle: string;
  enTitle: string;
  icon: typeof Star;
  borderColor: string;
  bgGradient: string;
  titleColor: string;
  isFree: boolean; // Whether this section is visible for free users
}

const SECTION_CONFIGS: SectionConfig[] = [
  {
    id: "overview",
    zhTitle: "命盘总览与格局判定",
    enTitle: "Destiny Overview & Pattern",
    icon: Eye,
    borderColor: "border-[#d4a843]/30",
    bgGradient: "from-[#d4a843]/8 to-transparent",
    titleColor: "text-[#d4a843]",
    isFree: true,
  },
  {
    id: "tenGods",
    zhTitle: "十神详解与命局结构",
    enTitle: "Ten Gods Analysis",
    icon: Shield,
    borderColor: "border-indigo-500/30",
    bgGradient: "from-indigo-500/8 to-transparent",
    titleColor: "text-indigo-400",
    isFree: true,
  },
  {
    id: "personality",
    zhTitle: "性格深度剖析",
    enTitle: "Deep Personality Profile",
    icon: Brain,
    borderColor: "border-purple-500/30",
    bgGradient: "from-purple-500/8 to-transparent",
    titleColor: "text-purple-400",
    isFree: true,
  },
  {
    id: "career",
    zhTitle: "事业与职业发展",
    enTitle: "Career & Professional Development",
    icon: Briefcase,
    borderColor: "border-cyan-500/30",
    bgGradient: "from-cyan-500/8 to-transparent",
    titleColor: "text-cyan-400",
    isFree: false,
  },
  {
    id: "wealth",
    zhTitle: "财运与理财分析",
    enTitle: "Wealth & Financial Analysis",
    icon: Coins,
    borderColor: "border-yellow-500/30",
    bgGradient: "from-yellow-500/8 to-transparent",
    titleColor: "text-yellow-400",
    isFree: false,
  },
  {
    id: "love",
    zhTitle: "感情与婚姻分析",
    enTitle: "Love & Marriage Analysis",
    icon: Heart,
    borderColor: "border-pink-500/30",
    bgGradient: "from-pink-500/8 to-transparent",
    titleColor: "text-pink-400",
    isFree: false,
  },
  {
    id: "health",
    zhTitle: "健康与养生指导",
    enTitle: "Health & Wellness Guidance",
    icon: Activity,
    borderColor: "border-green-500/30",
    bgGradient: "from-green-500/8 to-transparent",
    titleColor: "text-green-400",
    isFree: false,
  },
  {
    id: "annual",
    zhTitle: "流年运势分析",
    enTitle: "Annual Fortune Analysis",
    icon: Sun,
    borderColor: "border-orange-500/30",
    bgGradient: "from-orange-500/8 to-transparent",
    titleColor: "text-orange-400",
    isFree: false,
  },
  {
    id: "luckPillarAnalysis",
    zhTitle: "大运走势与人生阶段",
    enTitle: "Luck Pillar Trajectory",
    icon: TrendingUp,
    borderColor: "border-teal-500/30",
    bgGradient: "from-teal-500/8 to-transparent",
    titleColor: "text-teal-400",
    isFree: false,
  },
  {
    id: "education",
    zhTitle: "学业与智慧发展",
    enTitle: "Education & Intellectual Development",
    icon: GraduationCap,
    borderColor: "border-blue-500/30",
    bgGradient: "from-blue-500/8 to-transparent",
    titleColor: "text-blue-400",
    isFree: false,
  },
  {
    id: "benefactors",
    zhTitle: "贵人与人际关系",
    enTitle: "Benefactors & Relationships",
    icon: Users,
    borderColor: "border-violet-500/30",
    bgGradient: "from-violet-500/8 to-transparent",
    titleColor: "text-violet-400",
    isFree: false,
  },
  {
    id: "fengshui",
    zhTitle: "开运建议与风水指导",
    enTitle: "Fortune Enhancement & Feng Shui",
    icon: Compass,
    borderColor: "border-emerald-500/30",
    bgGradient: "from-emerald-500/8 to-transparent",
    titleColor: "text-emerald-400",
    isFree: false,
  },
];

export default function BaZiReport({ chart, reading, isPaid = false, onUnlock }: BaZiReportProps) {
  const { language } = useTranslation();
  const [showLuckPillars, setShowLuckPillars] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["overview", "tenGods", "personality"]));
  const isEn = language === "en";

  const pillars = [
    { label: isEn ? "Year" : "年柱", pillar: chart.yearPillar },
    { label: isEn ? "Month" : "月柱", pillar: chart.monthPillar },
    { label: isEn ? "Day" : "日柱", pillar: chart.dayPillar },
    { label: isEn ? "Hour" : "时柱", pillar: chart.hourPillar },
  ];

  // Calculate total for percentage
  const totalElements = Object.values(chart.fiveElements).reduce((a, b) => a + b, 0) || 1;

  // Parse reading into sections
  const readingSections = parseReadingSections(reading);
  const pullQuote = extractPullQuote(reading, 140);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6" data-report-scan="bazi">
      {/* Theme pull-quote — scannable in ~3s */}
      {pullQuote && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#d4a843]/25 bg-gradient-to-r from-[#d4a843]/10 to-transparent px-5 py-4"
          data-report-scan="pull-quote"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#d4a843]/80 mb-1.5">
            {isEn ? "Key insight" : "核心一句话"}
          </div>
          <p className="text-sm md:text-base text-[#f0e6c8] leading-relaxed font-medium">
            “{pullQuote}”
          </p>
        </motion.div>
      )}

      {/* Day Master Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
        data-report-scan="day-master"
      >
        <div className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-b from-[#d4a843]/10 to-transparent border border-[#d4a843]/30">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {isEn ? "Day Master" : "日主"}
          </span>
          <span className={`text-4xl font-bold ${getElementTextColor(chart.dayMaster.element)}`}>
            {chart.dayMaster.character}
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full border ${ELEMENT_NAMES[chart.dayMaster.element]?.color || "text-gray-400"}`}>
              {isEn ? chart.dayMaster.element : ELEMENT_NAMES[chart.dayMaster.element]?.zh || chart.dayMaster.element}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
              {chart.dayMaster.yinYang === "Yang" ? (isEn ? "Yang" : "阳") : (isEn ? "Yin" : "阴")}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${chart.dayMaster.strength === "Strong" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"}`}>
              {chart.dayMaster.strength === "Strong" ? (isEn ? "Strong" : "身强") : (isEn ? "Weak" : "身弱")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Four Pillars Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-display text-sm text-[#d4a843] mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {isEn ? "Four Pillars" : "四柱八字"}
        </h3>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {pillars.map(({ label, pillar }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`rounded-xl border bg-gradient-to-b ${getElementBg(pillar.stemElement)} p-3 text-center`}
            >
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                {label}
              </div>
              {/* Heavenly Stem */}
              <div className={`text-2xl sm:text-3xl font-bold mb-1 ${getElementTextColor(pillar.stemElement)}`}>
                {pillar.heavenlyStem}
              </div>
              <div className="text-[10px] text-muted-foreground mb-2">
                {isEn ? pillar.stemElement : ELEMENT_NAMES[pillar.stemElement]?.zh || pillar.stemElement}
              </div>
              {/* Earthly Branch */}
              <div className={`text-2xl sm:text-3xl font-bold mb-1 ${getElementTextColor(pillar.branchElement)}`}>
                {pillar.earthlyBranch}
              </div>
              <div className="text-[10px] text-muted-foreground">
                {pillar.animal}
              </div>
              {/* Hidden Stems */}
              {pillar.hiddenStems.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="flex justify-center gap-1">
                    {pillar.hiddenStems.map((hs, i) => (
                      <span
                        key={i}
                        className={`text-xs px-1 rounded ${getElementTextColor(hs.element)}`}
                        title={hs.tenGod ? `${hs.tenGod.chinese} (${hs.tenGod.name})` : ""}
                      >
                        {hs.character}
                      </span>
                    ))}
                  </div>
                  <div className="text-[8px] text-muted-foreground mt-0.5">
                    {isEn ? "Hidden" : "藏干"}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Five Elements Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <h3 className="font-display text-sm text-[#d4a843] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {isEn ? "Five Elements Distribution" : "五行分布"}
        </h3>
        <div className="space-y-3">
          {(Object.entries(chart.fiveElements) as [string, number][]).map(([element, count]) => {
            const pct = Math.round((count / totalElements) * 100);
            const info = ELEMENT_NAMES[element];
            const Icon = info?.icon || Star;
            const isDominant = element === chart.dominantElement;
            const isWeakest = element === chart.weakestElement;
            return (
              <div key={element} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${info?.color.split(" ")[0] || "text-gray-400"}`} />
                    <span className="text-gray-300">
                      {isEn ? info?.en || element : info?.zh || element}
                    </span>
                    {isDominant && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-green-500/20 text-green-400">
                        {isEn ? "Dominant" : "旺"}
                      </span>
                    )}
                    {isWeakest && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400">
                        {isEn ? "Weakest" : "弱"}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400">{count} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className={`h-full rounded-full ${
                      element === "METAL" ? "bg-gradient-to-r from-yellow-500 to-yellow-300" :
                      element === "WOOD" ? "bg-gradient-to-r from-green-600 to-green-400" :
                      element === "WATER" ? "bg-gradient-to-r from-blue-600 to-blue-400" :
                      element === "FIRE" ? "bg-gradient-to-r from-red-600 to-red-400" :
                      "bg-gradient-to-r from-amber-600 to-amber-400"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* Favorable/Unfavorable Elements */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[10px] text-green-400 uppercase tracking-wider mb-1">
              {isEn ? "Favorable" : "喜用神"}
            </div>
            <div className="flex flex-wrap gap-1">
              {chart.dayMaster.favorableElements.map(el => (
                <span key={el} className={`px-2 py-0.5 rounded-full border text-[10px] ${ELEMENT_NAMES[el]?.color || "text-gray-400"}`}>
                  {isEn ? ELEMENT_NAMES[el]?.en || el : ELEMENT_NAMES[el]?.zh || el}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-red-400 uppercase tracking-wider mb-1">
              {isEn ? "Unfavorable" : "忌神"}
            </div>
            <div className="flex flex-wrap gap-1">
              {chart.dayMaster.unfavorableElements.map(el => (
                <span key={el} className={`px-2 py-0.5 rounded-full border text-[10px] ${ELEMENT_NAMES[el]?.color || "text-gray-400"}`}>
                  {isEn ? ELEMENT_NAMES[el]?.en || el : ELEMENT_NAMES[el]?.zh || el}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Luck Pillars Timeline */}
      {chart.luckPillars && chart.luckPillars.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <button
            onClick={() => setShowLuckPillars(!showLuckPillars)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-display text-sm text-[#d4a843] flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {isEn ? "Luck Pillars (大运)" : "大运流年"}
            </h3>
            {showLuckPillars ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          <AnimatePresence>
            {showLuckPillars && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 overflow-x-auto">
                  <div className="flex gap-2 min-w-max pb-2">
                    {chart.luckPillars.map((lp, i) => {
                      const currentAge = new Date().getFullYear() - (chart.yearPillar ? new Date().getFullYear() - (lp.yearStart - lp.ageStart) : 0);
                      const isCurrent = lp.yearStart <= new Date().getFullYear() && lp.yearEnd >= new Date().getFullYear();
                      return (
                        <div
                          key={i}
                          className={`flex-shrink-0 w-20 rounded-xl border bg-gradient-to-b ${getElementBg(lp.stemElement)} p-2 text-center ${isCurrent ? 'ring-2 ring-[#d4a843]/60' : ''}`}
                        >
                          <div className="text-[9px] text-muted-foreground">
                            {lp.ageStart}-{lp.ageStart + 9}{isEn ? "y" : "岁"}
                          </div>
                          <div className={`text-lg font-bold ${getElementTextColor(lp.stemElement)}`}>
                            {lp.stemCharacter}
                          </div>
                          <div className={`text-lg font-bold ${getElementTextColor(lp.branchElement)}`}>
                            {lp.branchCharacter}
                          </div>
                          <div className="text-[9px] text-muted-foreground">
                            {lp.yearStart}-{lp.yearEnd}
                          </div>
                          {isCurrent && (
                            <div className="text-[8px] text-[#d4a843] font-semibold mt-0.5">
                              {isEn ? "Current" : "当前"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* AI Reading - 12 Dimension Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="space-y-3"
      >
        {/* Section count indicator */}
        <div className="text-center text-xs text-muted-foreground mb-2">
          {isEn
            ? `${readingSections.length} analysis dimensions`
            : `${readingSections.length} 个分析维度`}
        </div>

        {readingSections.map((section, index) => {
          const config = SECTION_CONFIGS.find(c => c.id === section.id) || SECTION_CONFIGS[0];
          const isExpanded = expandedSections.has(section.id);
          const isLocked = !config.isFree && !isPaid;
          const Icon = config.icon;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.05 }}
              className={`rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} overflow-hidden`}
            >
              <button
                onClick={() => !isLocked && toggleSection(section.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bgGradient.replace('to-transparent', 'to-transparent')} border ${config.borderColor}`}>
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Icon className={`w-4 h-4 ${config.titleColor}`} />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-display text-sm ${isLocked ? 'text-gray-500' : config.titleColor}`}>
                      {isEn ? config.enTitle : config.zhTitle}
                    </h3>
                    {isLocked && (
                      <span className="text-[10px] text-gray-600">
                        {isEn ? "Premium" : "会员专享"}
                      </span>
                    )}
                  </div>
                </div>
                {!isLocked && (
                  isExpanded
                    ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                {isLocked && (
                  <Crown className="w-4 h-4 text-[#d4a843]/50 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {isExpanded && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                        {section.content}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Paywall for locked sections */}
        {!isPaid && readingSections.some(s => {
          const config = SECTION_CONFIGS.find(c => c.id === s.id);
          return config && !config.isFree;
        }) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#d4a843]/30 bg-gradient-to-br from-[#d4a843]/10 to-transparent p-6 text-center space-y-3"
          >
            <Lock className="w-8 h-8 text-[#d4a843] mx-auto" />
            <h3 className="font-display text-lg text-[#d4a843]">
              {isEn ? "Unlock Full Analysis" : "解锁完整分析报告"}
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              {isEn
                ? "Unlock 9 additional premium dimensions: Career, Wealth, Love, Health, Annual Fortune, Life Phases, Education, Benefactors, and Feng Shui guidance."
                : "解锁9个高级分析维度：事业发展、财运分析、感情婚姻、健康养生、流年运势、大运走势、学业发展、贵人关系、风水开运指导。"}
            </p>
            <Button
              onClick={onUnlock}
              className="bg-gradient-to-r from-[#d4a843] to-[#b8902e] text-black font-semibold hover:opacity-90 gap-2"
            >
              <Crown className="w-4 h-4" />
              {isEn ? "Unlock Full Report" : "解锁完整报告"}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ============================================================
// Section Parser - Matches AI output to 12 dimensions
// ============================================================

interface ParsedSection {
  id: string;
  content: string;
}

// Keywords for matching sections
const SECTION_MATCHERS: Array<{ id: string; keywords: string[] }> = [
  {
    id: "overview",
    keywords: ["命盘总览", "格局判定", "destiny overview", "pattern classification", "命盘概览", "总览"],
  },
  {
    id: "tenGods",
    keywords: ["十神详解", "命局结构", "ten gods", "十神分析", "十神"],
  },
  {
    id: "personality",
    keywords: ["性格深度", "性格剖析", "personality", "character", "性格特点", "性格"],
  },
  {
    id: "career",
    keywords: ["事业", "职业发展", "career", "professional"],
  },
  {
    id: "wealth",
    keywords: ["财运", "理财", "wealth", "financial"],
  },
  {
    id: "love",
    keywords: ["感情", "婚姻", "love", "marriage", "姻缘"],
  },
  {
    id: "health",
    keywords: ["健康", "养生", "health", "wellness"],
  },
  {
    id: "annual",
    keywords: ["流年", "今明两年", "annual fortune", "current year", "年运势"],
  },
  {
    id: "luckPillarAnalysis",
    keywords: ["大运走势", "人生阶段", "luck pillar trajectory", "life phases", "大运"],
  },
  {
    id: "education",
    keywords: ["学业", "智慧发展", "education", "intellectual"],
  },
  {
    id: "benefactors",
    keywords: ["贵人", "人际关系", "benefactor", "interpersonal"],
  },
  {
    id: "fengshui",
    keywords: ["开运", "风水", "fortune enhancement", "feng shui"],
  },
];

function matchSectionId(heading: string): string | null {
  const lower = heading.toLowerCase();
  for (const matcher of SECTION_MATCHERS) {
    for (const keyword of matcher.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return matcher.id;
      }
    }
  }
  return null;
}

function parseReadingSections(reading: string): ParsedSection[] {
  if (!reading) return [];

  const lines = reading.split("\n");
  const sections: ParsedSection[] = [];
  let currentId: string | null = null;
  let buffer: string[] = [];

  const flushBuffer = () => {
    if (currentId && buffer.length > 0) {
      const content = buffer
        .join("\n")
        .replace(/^[\s\n]+|[\s\n]+$/g, "")
        .replace(/^[-*]\s*/gm, "")  // Clean up markdown bullets
        .trim();
      if (content) {
        // Avoid duplicates
        const existing = sections.find(s => s.id === currentId);
        if (existing) {
          existing.content += "\n\n" + content;
        } else {
          sections.push({ id: currentId, content });
        }
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    // Check if this is a heading (## or ###)
    const headingMatch = line.match(/^#{1,3}\s+(.+)/);
    if (headingMatch) {
      const headingText = headingMatch[1].replace(/[*_`]/g, "").trim();
      const matchedId = matchSectionId(headingText);
      if (matchedId) {
        flushBuffer();
        currentId = matchedId;
        continue;
      }
    }

    // Add content to current section
    if (currentId) {
      // Skip empty lines at the start of a section
      if (buffer.length === 0 && !line.trim()) continue;
      // Clean markdown formatting but preserve structure
      const cleaned = line
        .replace(/^#{1,4}\s+/, "")  // Remove sub-headings markers
        .replace(/\*\*/g, "")       // Remove bold markers
        .trim();
      buffer.push(cleaned);
    } else {
      // Before first section detected, try to capture as overview
      const trimmed = line.replace(/^#{1,4}\s+/, "").replace(/\*\*/g, "").trim();
      if (trimmed && !trimmed.startsWith("---")) {
        if (!currentId) {
          currentId = "overview";
        }
        buffer.push(trimmed);
      }
    }
  }
  flushBuffer();

  // If no sections were parsed, create a single overview section
  if (sections.length === 0) {
    const plain = reading.replace(/[#*_`>\-]/g, "").trim();
    if (plain) {
      sections.push({ id: "overview", content: plain });
    }
  }

  // Sort sections according to SECTION_CONFIGS order
  const configOrder = SECTION_CONFIGS.map(c => c.id);
  sections.sort((a, b) => {
    const aIdx = configOrder.indexOf(a.id);
    const bIdx = configOrder.indexOf(b.id);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });

  return sections;
}
