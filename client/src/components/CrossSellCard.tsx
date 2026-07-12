import { Moon, Star, Compass, CloudMoon, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

type FeatureKey = "tarot" | "bazi" | "horoscope" | "dream" | "compatibility";

interface FeatureInfo {
  key: FeatureKey;
  href: string;
  icon: React.ElementType;
  nameEn: string;
  nameZh: string;
  descEn: string;
  descZh: string;
  tagEn: string;
  tagZh: string;
  gradient: string;
  iconColor: string;
  free: boolean;
}

const FEATURES: Record<FeatureKey, FeatureInfo> = {
  tarot: {
    key: "tarot",
    href: "/tarot",
    icon: Moon,
    nameEn: "Love Tarot Reading",
    nameZh: "爱情塔罗占卜",
    descEn: "Draw 3 cards to reveal your love destiny",
    descZh: "抽取三张牌揭示你的爱情命运",
    tagEn: "Most Popular",
    tagZh: "最受欢迎",
    gradient: "from-indigo-500/20 to-violet-500/20",
    iconColor: "text-indigo-400",
    free: true,
  },
  bazi: {
    key: "bazi",
    href: "/bazi",
    icon: Star,
    nameEn: "BaZi Destiny Analysis",
    nameZh: "八字命理精批",
    descEn: "Deep personality & destiny analysis from your birth chart",
    descZh: "根据生辰八字深度解析你的性格与命运",
    tagEn: "Deep Insight",
    tagZh: "深度解析",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    free: false,
  },
  horoscope: {
    key: "horoscope",
    href: "/horoscope",
    icon: Compass,
    nameEn: "Daily Horoscope",
    nameZh: "今日星座运势",
    descEn: "Love, career & wealth forecast for today",
    descZh: "今日爱情、事业、财运全面预测",
    tagEn: "Free Daily",
    tagZh: "每日免费",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    free: true,
  },
  dream: {
    key: "dream",
    href: "/dream",
    icon: CloudMoon,
    nameEn: "AI Dream Interpreter",
    nameZh: "AI解梦分析",
    descEn: "Decode your dreams with psychology-based AI",
    descZh: "用心理学AI解读你的梦境含义",
    tagEn: "Psychology-Based",
    tagZh: "心理学解读",
    gradient: "from-purple-500/20 to-fuchsia-500/20",
    iconColor: "text-purple-400",
    free: true,
  },
  compatibility: {
    key: "compatibility",
    href: "/compatibility",
    icon: Heart,
    nameEn: "Compatibility Analysis",
    nameZh: "合盘分析",
    descEn: "Explore the cosmic dynamics between two souls",
    descZh: "探索两个灵魂之间的宇宙动态",
    tagEn: "New Feature",
    tagZh: "新功能",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
    free: false,
  },
};

// Smart recommendation: which features to show based on current feature
const RECOMMENDATIONS: Record<FeatureKey, FeatureKey[]> = {
  tarot: ["compatibility", "bazi", "dream", "horoscope"],
  bazi: ["compatibility", "tarot", "horoscope", "dream"],
  horoscope: ["compatibility", "tarot", "dream", "bazi"],
  dream: ["tarot", "compatibility", "bazi", "horoscope"],
  compatibility: ["tarot", "horoscope", "bazi", "dream"],
};

interface CrossSellCardProps {
  currentFeature: FeatureKey;
  className?: string;
}

export default function CrossSellCard({ currentFeature, className = "" }: CrossSellCardProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const recommendations = RECOMMENDATIONS[currentFeature].slice(0, 2); // Show top 2

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`rounded-2xl border border-[rgba(212,168,67,0.15)] bg-gradient-to-br from-[rgba(212,168,67,0.05)] to-transparent p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#d4a843]" />
        <h3 className="text-sm font-medium text-[#d4a843] tracking-wider uppercase">
          {isEn ? "Continue Your Journey" : "继续探索"}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((featureKey, index) => {
          const feature = FEATURES[featureKey];
          const Icon = feature.icon;

          return (
            <Link key={featureKey} href={feature.href}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`group relative flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${feature.gradient} border border-white/5 cursor-pointer transition-all duration-300 hover:border-white/15 hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className={`w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground/90 truncate">
                      {isEn ? feature.nameEn : feature.nameZh}
                    </span>
                    {feature.free && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shrink-0">
                        {isEn ? "Free" : "免费"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {isEn ? feature.descEn : feature.descZh}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#d4a843] group-hover:translate-x-1 transition-all shrink-0" />
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Subtle membership upsell */}
      <div className="mt-3 text-center">
        <Link href="/membership">
          <span className="text-xs text-muted-foreground hover:text-[#d4a843] transition-colors cursor-pointer">
            {isEn ? "Unlock unlimited access to all features →" : "解锁所有功能无限使用 →"}
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
