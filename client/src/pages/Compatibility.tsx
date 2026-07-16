import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import CompatibilityReport from "@/components/CompatibilityReport";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Heart,
  Sparkles,
  Loader2,
  ArrowRight,
  RotateCcw,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackWidget from "@/components/FeedbackWidget";
import LoadingRitual from "@/components/LoadingRitual";
import TextToSpeech from "@/components/TextToSpeech";
import { ShareResultCard } from "@/components/ShareResultCard";
import SEOHead from "@/components/SEOHead";
import CrossSellCard from "@/components/CrossSellCard";
import DeeperInsightsCard from "@/components/DeeperInsightsCard";
import SoftPaywall from "@/components/SoftPaywall";
import PaywallCTA from "@/components/PaywallCTA";
import { toast } from "sonner";

// Zodiac data
const ZODIAC_SIGNS = [
  { id: "aries", symbol: "♈", nameZh: "白羊座", nameEn: "Aries", element: "Fire", elementZh: "火象", color: "from-red-500/20 to-orange-500/20", borderColor: "border-red-500/30" },
  { id: "taurus", symbol: "♉", nameZh: "金牛座", nameEn: "Taurus", element: "Earth", elementZh: "土象", color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-500/30" },
  { id: "gemini", symbol: "♊", nameZh: "双子座", nameEn: "Gemini", element: "Air", elementZh: "风象", color: "from-yellow-500/20 to-amber-500/20", borderColor: "border-yellow-500/30" },
  { id: "cancer", symbol: "♋", nameZh: "巨蟹座", nameEn: "Cancer", element: "Water", elementZh: "水象", color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/30" },
  { id: "leo", symbol: "♌", nameZh: "狮子座", nameEn: "Leo", element: "Fire", elementZh: "火象", color: "from-orange-500/20 to-red-500/20", borderColor: "border-orange-500/30" },
  { id: "virgo", symbol: "♍", nameZh: "处女座", nameEn: "Virgo", element: "Earth", elementZh: "土象", color: "from-emerald-500/20 to-teal-500/20", borderColor: "border-emerald-500/30" },
  { id: "libra", symbol: "♎", nameZh: "天秤座", nameEn: "Libra", element: "Air", elementZh: "风象", color: "from-pink-500/20 to-rose-500/20", borderColor: "border-pink-500/30" },
  { id: "scorpio", symbol: "♏", nameZh: "天蝎座", nameEn: "Scorpio", element: "Water", elementZh: "水象", color: "from-purple-500/20 to-violet-500/20", borderColor: "border-purple-500/30" },
  { id: "sagittarius", symbol: "♐", nameZh: "射手座", nameEn: "Sagittarius", element: "Fire", elementZh: "火象", color: "from-indigo-500/20 to-blue-500/20", borderColor: "border-indigo-500/30" },
  { id: "capricorn", symbol: "♑", nameZh: "摩羯座", nameEn: "Capricorn", element: "Earth", elementZh: "土象", color: "from-gray-500/20 to-slate-500/20", borderColor: "border-gray-500/30" },
  { id: "aquarius", symbol: "♒", nameZh: "水瓶座", nameEn: "Aquarius", element: "Air", elementZh: "风象", color: "from-cyan-500/20 to-sky-500/20", borderColor: "border-cyan-500/30" },
  { id: "pisces", symbol: "♓", nameZh: "双鱼座", nameEn: "Pisces", element: "Water", elementZh: "水象", color: "from-violet-500/20 to-purple-500/20", borderColor: "border-violet-500/30" },
];

type Step = "input" | "loading" | "result";

export default function Compatibility() {
  const { t, language } = useTranslation();
  const isEn = language === "en";
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState<Step>("input");
  const [person1Name, setPerson1Name] = useState("");
  const [person2Name, setPerson2Name] = useState("");
  const [person1Sign, setPerson1Sign] = useState<string | null>(null);
  const [person2Sign, setPerson2Sign] = useState<string | null>(null);
  const [activeSelector, setActiveSelector] = useState<1 | 2>(1);

  // Quick score (instant, no LLM)
  const quickScore = trpc.compatibility.getQuickScore.useQuery(
    { sign1: person1Sign || "", sign2: person2Sign || "" },
    { enabled: !!person1Sign && !!person2Sign }
  );

  // Full analysis mutation
  const analyzeMutation = trpc.compatibility.analyze.useMutation({
    onSuccess: (data) => {
      if (data.degradation) {
        toast.info(data.degradation.message);
      }
      setStep("result");
    },
    onError: (err) => {
      toast.error(err.message || (isEn ? "Analysis failed" : "分析失败"));
      setStep("input");
    },
  });

  const handleAnalyze = () => {
    if (!person1Sign || !person2Sign) {
      toast.error(isEn ? "Please select both zodiac signs" : "请选择两个星座");
      return;
    }
    setStep("loading");
    analyzeMutation.mutate({
      person1Name: person1Name || (isEn ? "Person A" : "甲方"),
      person1Sign,
      person2Name: person2Name || (isEn ? "Person B" : "乙方"),
      person2Sign,
      language: language as "zh" | "en",
    });
  };

  const handleReset = () => {
    setStep("input");
    setPerson1Name("");
    setPerson2Name("");
    setPerson1Sign(null);
    setPerson2Sign(null);
    setActiveSelector(1);
    analyzeMutation.reset();
  };

  const sign1Data = useMemo(() => ZODIAC_SIGNS.find(s => s.id === person1Sign), [person1Sign]);
  const sign2Data = useMemo(() => ZODIAC_SIGNS.find(s => s.id === person2Sign), [person2Sign]);

  const ttsText = analyzeMutation.data?.deepAnalysis || "";

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="compatibility" path="/compatibility" />
      <StarryBackground />
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm mb-4"
            >
              <Heart className="w-4 h-4" />
              {isEn ? "Relationship Synastry" : "关系合盘分析"}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-[#d4a843] to-purple-400 bg-clip-text text-transparent mb-3"
            >
              {isEn ? "Compatibility Analysis" : "合盘分析"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-lg mx-auto"
            >
              {isEn
                ? "Discover the cosmic dynamics between two souls — explore love, passion, trust, and growth potential"
                : "探索两个灵魂之间的宇宙动态 — 揭示爱情、激情、信任与成长潜力"}
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Person inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Person 1 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 text-sm font-bold">A</div>
                      <Input
                        value={person1Name}
                        onChange={(e) => setPerson1Name(e.target.value)}
                        placeholder={isEn ? "Name (optional)" : "姓名（选填）"}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    {person1Sign && sign1Data ? (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${sign1Data.color} border ${sign1Data.borderColor} cursor-pointer hover:brightness-110 transition`}
                        onClick={() => { setPerson1Sign(null); setActiveSelector(1); }}
                      >
                        <span className="text-3xl">{sign1Data.symbol}</span>
                        <div>
                          <div className="font-medium text-white">{isEn ? sign1Data.nameEn : sign1Data.nameZh}</div>
                          <div className="text-xs text-gray-400">{isEn ? sign1Data.element : sign1Data.elementZh}</div>
                        </div>
                        <span className="ml-auto text-xs text-gray-500">{isEn ? "tap to change" : "点击更换"}</span>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setActiveSelector(1)}
                        className={`w-full p-4 rounded-xl border-2 border-dashed transition ${
                          activeSelector === 1 ? "border-pink-500/50 bg-pink-500/5" : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span className="text-gray-400">{isEn ? "Select zodiac sign ↓" : "选择星座 ↓"}</span>
                      </button>
                    )}
                  </div>

                  {/* Heart divider */}
                  <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                    {/* This is handled by the grid gap */}
                  </div>

                  {/* Person 2 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">B</div>
                      <Input
                        value={person2Name}
                        onChange={(e) => setPerson2Name(e.target.value)}
                        placeholder={isEn ? "Name (optional)" : "姓名（选填）"}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      />
                    </div>
                    {person2Sign && sign2Data ? (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${sign2Data.color} border ${sign2Data.borderColor} cursor-pointer hover:brightness-110 transition`}
                        onClick={() => { setPerson2Sign(null); setActiveSelector(2); }}
                      >
                        <span className="text-3xl">{sign2Data.symbol}</span>
                        <div>
                          <div className="font-medium text-white">{isEn ? sign2Data.nameEn : sign2Data.nameZh}</div>
                          <div className="text-xs text-gray-400">{isEn ? sign2Data.element : sign2Data.elementZh}</div>
                        </div>
                        <span className="ml-auto text-xs text-gray-500">{isEn ? "tap to change" : "点击更换"}</span>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setActiveSelector(2)}
                        className={`w-full p-4 rounded-xl border-2 border-dashed transition ${
                          activeSelector === 2 ? "border-purple-500/50 bg-purple-500/5" : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span className="text-gray-400">{isEn ? "Select zodiac sign ↓" : "选择星座 ↓"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick score preview */}
                {quickScore.data && person1Sign && person2Sign && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                      <span className="text-2xl">{sign1Data?.symbol}</span>
                      <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
                      <span className="text-2xl">{sign2Data?.symbol}</span>
                      <span className="text-lg font-bold text-[#d4a843] ml-2">{quickScore.data.overallScore}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {isEn ? "Quick compatibility score — full analysis reveals much more" : "快速兼容性评分 — 完整分析将揭示更多"}
                    </p>
                  </motion.div>
                )}

                {/* Zodiac grid selector */}
                <div>
                  <div className="text-center text-sm text-gray-400 mb-3">
                    {activeSelector === 1
                      ? (isEn ? "Select Person A's zodiac sign" : "选择甲方的星座")
                      : (isEn ? "Select Person B's zodiac sign" : "选择乙方的星座")}
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {ZODIAC_SIGNS.map((sign) => {
                      const isSelected = (activeSelector === 1 && person1Sign === sign.id) || (activeSelector === 2 && person2Sign === sign.id);
                      const isOtherSelected = (activeSelector === 1 && person2Sign === sign.id) || (activeSelector === 2 && person1Sign === sign.id);

                      return (
                        <motion.button
                          key={sign.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (activeSelector === 1) {
                              setPerson1Sign(sign.id);
                              if (!person2Sign) setActiveSelector(2);
                            } else {
                              setPerson2Sign(sign.id);
                            }
                          }}
                          className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                            isSelected
                              ? `bg-gradient-to-br ${sign.color} ${sign.borderColor} ring-2 ring-offset-1 ring-offset-[#0d0f1a] ring-[#d4a843]/50`
                              : isOtherSelected
                                ? "bg-white/[0.02] border-white/5 opacity-50"
                                : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="text-2xl">{sign.symbol}</span>
                          <span className="text-xs text-gray-400">{isEn ? sign.nameEn : sign.nameZh}</span>
                          {isOtherSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gray-600 flex items-center justify-center text-[8px] text-white">
                              {activeSelector === 1 ? "B" : "A"}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Analyze button */}
                <div className="text-center">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!person1Sign || !person2Sign}
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 via-[#d4a843] to-purple-500 hover:from-pink-600 hover:via-[#c9a33a] hover:to-purple-600 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg shadow-pink-500/20 disabled:opacity-40"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {isEn ? "Analyze Compatibility" : "开始合盘分析"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "loading" && (
              <LoadingRitual type="compatibility" isLoading={true} />
            )}

            {step === "result" && analyzeMutation.data && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Back / Reset button */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="border-white/10 text-gray-400 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {isEn ? "New Analysis" : "重新分析"}
                  </Button>
                  {!analyzeMutation.data.degradation && <TextToSpeech text={ttsText} />}
                </div>

                {analyzeMutation.data.degradation ? (
                  <>
                    <div className="glass-card rounded-2xl border-gradient p-6">
                      <h2 className="text-lg font-semibold text-[#d4a843]">
                        {isEn ? "Basic compatibility calculation" : "基础合盘计算"}
                      </h2>
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          [isEn ? "Overall" : "综合", analyzeMutation.data.overallScore],
                          [isEn ? "Elements" : "元素", analyzeMutation.data.elementCompat.score],
                          [isEn ? "Modality" : "模式", analyzeMutation.data.modalityCompat.score],
                          [isEn ? "Polarity" : "极性", analyzeMutation.data.polarityCompat.score],
                        ].map(([label, score]) => (
                          <div key={String(label)} className="rounded-xl bg-white/5 p-3 text-center">
                            <div className="text-xs text-muted-foreground">{label}</div>
                            <div className="mt-1 text-xl font-bold text-white">{score}/100</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <SoftPaywall
                      featureType="compatibility"
                      className="mt-4"
                      reason="daily-limit"
                    />
                  </>
                ) : (
                  <>
                    {/* Report */}
                    <CompatibilityReport
                      data={analyzeMutation.data}
                      person1Name={person1Name || (isEn ? "Person A" : "甲方")}
                      person2Name={person2Name || (isEn ? "Person B" : "乙方")}
                      isPaid={true}
                      onUnlock={() => toast.info(isEn ? "Premium feature coming soon" : "会员功能即将上线")}
                    />

                {/* Deeper Insights */}
                <DeeperInsightsCard featureType="compatibility" />
                {/* Soft paywall - blurred deep analysis preview */}
                <SoftPaywall featureType="compatibility" className="mt-4" />

                {/* Share */}
                <ShareResultCard
                  type="compatibility"
                  title={isEn ? "Compatibility Analysis" : "合盘分析"}
                  summary={`${person1Name || (isEn ? "Person A" : "甲方")} ${sign1Data?.symbol} × ${person2Name || (isEn ? "Person B" : "乙方")} ${sign2Data?.symbol} — ${analyzeMutation.data.scores.summary}`}
                  ogData={{
                    sign1: sign1Data?.symbol,
                    sign2: sign2Data?.symbol,
                    name1: person1Name || (isEn ? "Person A" : "甲方"),
                    name2: person2Name || (isEn ? "Person B" : "乙方"),
                    matchScore: (() => {
                      const s = analyzeMutation.data.scores;
                      const avg = Math.round((s.loveScore + s.passionScore + s.communicationScore + s.trustScore + s.growthScore + s.longTermScore) / 6);
                      return `${avg}%`;
                    })(),
                  }}
                />

                {/* Cross-sell */}
                <CrossSellCard currentFeature="compatibility" />

                    {/* Feedback */}
                    <FeedbackWidget sourceType="horoscope" sessionId={`compat_${Date.now()}`} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
