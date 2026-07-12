import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import HoroscopeReport from "@/components/HoroscopeReport";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";
import { 
  Compass, 
  Sparkles,
  Loader2,
  RefreshCw,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackWidget from "@/components/FeedbackWidget";
import TextToSpeech from "@/components/TextToSpeech";
import LoadingRitual from "@/components/LoadingRitual";
import { ShareResultCard } from "@/components/ShareResultCard";
import SEOHead from "@/components/SEOHead";
import CrossSellCard from "@/components/CrossSellCard";
import DeeperInsightsCard from "@/components/DeeperInsightsCard";
import SoftPaywall from "@/components/SoftPaywall";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import PaywallCTA from "@/components/PaywallCTA";

export default function Horoscope() {
  const { t, language } = useTranslation();
  
  // 星座数据 - 根据语言
  const zodiacData = [
    { id: 0, name: t.horoscope.signs.aries, nameKey: "aries", symbol: "♈", dates: t.horoscope.dateRange.aries, element: language === "zh" ? "火象" : "Fire", color: "from-red-500/20 to-orange-500/20" },
    { id: 1, name: t.horoscope.signs.taurus, nameKey: "taurus", symbol: "♉", dates: t.horoscope.dateRange.taurus, element: language === "zh" ? "土象" : "Earth", color: "from-green-500/20 to-emerald-500/20" },
    { id: 2, name: t.horoscope.signs.gemini, nameKey: "gemini", symbol: "♊", dates: t.horoscope.dateRange.gemini, element: language === "zh" ? "风象" : "Air", color: "from-yellow-500/20 to-amber-500/20" },
    { id: 3, name: t.horoscope.signs.cancer, nameKey: "cancer", symbol: "♋", dates: t.horoscope.dateRange.cancer, element: language === "zh" ? "水象" : "Water", color: "from-blue-500/20 to-cyan-500/20" },
    { id: 4, name: t.horoscope.signs.leo, nameKey: "leo", symbol: "♌", dates: t.horoscope.dateRange.leo, element: language === "zh" ? "火象" : "Fire", color: "from-orange-500/20 to-red-500/20" },
    { id: 5, name: t.horoscope.signs.virgo, nameKey: "virgo", symbol: "♍", dates: t.horoscope.dateRange.virgo, element: language === "zh" ? "土象" : "Earth", color: "from-emerald-500/20 to-teal-500/20" },
    { id: 6, name: t.horoscope.signs.libra, nameKey: "libra", symbol: "♎", dates: t.horoscope.dateRange.libra, element: language === "zh" ? "风象" : "Air", color: "from-pink-500/20 to-rose-500/20" },
    { id: 7, name: t.horoscope.signs.scorpio, nameKey: "scorpio", symbol: "♏", dates: t.horoscope.dateRange.scorpio, element: language === "zh" ? "水象" : "Water", color: "from-purple-500/20 to-violet-500/20" },
    { id: 8, name: t.horoscope.signs.sagittarius, nameKey: "sagittarius", symbol: "♐", dates: t.horoscope.dateRange.sagittarius, element: language === "zh" ? "火象" : "Fire", color: "from-indigo-500/20 to-blue-500/20" },
    { id: 9, name: t.horoscope.signs.capricorn, nameKey: "capricorn", symbol: "♑", dates: t.horoscope.dateRange.capricorn, element: language === "zh" ? "土象" : "Earth", color: "from-gray-500/20 to-slate-500/20" },
    { id: 10, name: t.horoscope.signs.aquarius, nameKey: "aquarius", symbol: "♒", dates: t.horoscope.dateRange.aquarius, element: language === "zh" ? "风象" : "Air", color: "from-cyan-500/20 to-sky-500/20" },
    { id: 11, name: t.horoscope.signs.pisces, nameKey: "pisces", symbol: "♓", dates: t.horoscope.dateRange.pisces, element: language === "zh" ? "水象" : "Water", color: "from-violet-500/20 to-purple-500/20" },
  ];

  const [selectedSign, setSelectedSign] = useState<typeof zodiacData[0] | null>(null);
  const [sessionId] = useState(() => `horoscope_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const { isAuthenticated } = useAuth();
  const premiumStatus = usePremiumStatus("horoscope");
  const [showUsageModal, setShowUsageModal] = useState(false);
  const saveReportMutation = trpc.reports.save.useMutation();
  const savedSignRef = useRef<string | null>(null);

  const { data: horoscope, isLoading, error, refetch } = trpc.horoscope.getDaily.useQuery(
    { sign: selectedSign?.nameKey || "", language: language as "zh" | "en" },
    { enabled: !!selectedSign, retry: 1 }
  );

  // Auto-save horoscope report when data is loaded
  useEffect(() => {
    if (horoscope && selectedSign && isAuthenticated && savedSignRef.current !== selectedSign.nameKey) {
      savedSignRef.current = selectedSign.nameKey;
      const ttsText = `${horoscope.content || ""} ${horoscope.love.advice} ${horoscope.career.advice} ${horoscope.wealth.advice} ${horoscope.encouragement || ""}`;
      saveReportMutation.mutate({
        reportType: "horoscope",
        title: `${selectedSign.name} ${language === "zh" ? "今日运势" : "Daily Horoscope"} - ${new Date().toLocaleDateString()}`,
        inputSummary: `${selectedSign.name} (${selectedSign.symbol}) ${selectedSign.dates}`,
        reportData: {
          horoscopeData: horoscope,
          signName: selectedSign.name,
          signSymbol: selectedSign.symbol,
          signKey: selectedSign.nameKey,
        },
        aiInterpretation: ttsText.trim(),
        isPaid: premiumStatus.showFullReport,
      });
    }
  }, [horoscope, selectedSign, isAuthenticated]);

  const handleSelectSign = (sign: typeof zodiacData[0]) => {
    setSelectedSign(sign);
  };

  const handleBack = () => {
    setSelectedSign(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="horoscope" path="/horoscope" />
      <StarryBackground />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-gradient mb-6"
            >
              <Compass className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-cyan-300/80 tracking-wider uppercase">{t.horoscope.title}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-5">
              {language === "zh" ? (
                <>今日<span className="gradient-text text-glow-gold">星象指引</span></>
              ) : (
                <><span className="gradient-text text-glow-gold">Daily</span> Celestial Guidance</>
              )}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto font-light">
              {t.horoscope.description}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* Zodiac Selection */}
            {!selectedSign && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4"
              >
                {zodiacData.map((sign, index) => (
                  <div
                    key={sign.id}
                    className="animate-in fade-in zoom-in-95 fill-mode-both"
                    style={{ animationDelay: `${index * 50}ms`, animationDuration: '400ms' }}
                  >
                    <div
                      className="glass-card rounded-2xl hover:glow-gold cursor-pointer transition-all duration-500 group overflow-hidden p-4 text-center relative border-gradient"
                      onClick={() => handleSelectSign(sign)}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${sign.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <div className="relative z-10">
                          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-500">
                            {sign.symbol}
                          </div>
                          <div className="font-semibold text-sm">{sign.name}</div>
                          <div className="text-xs text-muted-foreground">{sign.dates}</div>
                        </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Horoscope Result */}
            {selectedSign && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Sign Header */}
                <div className="glass-card rounded-2xl overflow-hidden border-gradient relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${selectedSign.color}`} />
                  <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{selectedSign.symbol}</div>
                        <div>
                          <h2 className="text-2xl font-display font-bold">{selectedSign.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {selectedSign.dates} · {selectedSign.element}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {horoscope && (
                          <ShareResultCard
                            type="horoscope"
                            title={`${selectedSign.name} ${language === "zh" ? "今日运势" : "Daily Horoscope"}`}
                            subtitle={`${selectedSign.dates} · ${selectedSign.element}`}
                            summary={
                              (horoscope.encouragement && String(horoscope.encouragement).trim()) ||
                              `${language === "zh" ? "综合运势" : "Overall"} ${horoscope.overall}/100 · ${language === "zh" ? "爱情" : "Love"} ${horoscope.love.score} · ${language === "zh" ? "事业" : "Career"} ${horoscope.career.score}`
                            }
                            details={[
                              `${language === "zh" ? "爱情" : "Love"} ${horoscope.love.score}/100`,
                              `${language === "zh" ? "事业" : "Career"} ${horoscope.career.score}/100`,
                              `${language === "zh" ? "财运" : "Wealth"} ${horoscope.wealth.score}/100`,
                            ]}
                            extraInfo={{
                              [language === "zh" ? "幸运色" : "Lucky Color"]: horoscope.luckyColor ?? "",
                              [language === "zh" ? "幸运数字" : "Lucky Number"]: String(horoscope.luckyNumber ?? ""),
                            }}
                            ogData={{
                              sign: selectedSign.name,
                              overall: String(horoscope.overall),
                              love: String(horoscope.love.score),
                              career: String(horoscope.career.score),
                              wealth: String(horoscope.wealth.score),
                              luckyColor: horoscope.luckyColor ?? undefined,
                              luckyNumber: horoscope.luckyNumber != null ? String(horoscope.luckyNumber) : undefined,
                            }}
                          />
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => refetch()}
                          disabled={isLoading}
                        >
                          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button variant="outline" onClick={handleBack}>
                          {language === "zh" ? "返回选择" : "Back"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <LoadingRitual type="horoscope" isLoading={true} />
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="text-red-400 text-lg">
                      {language === "zh" ? "星象解读暂时不可用，请稍后重试" : "Horoscope unavailable, please try again"}
                    </div>
                    <Button variant="outline" onClick={() => refetch()}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {language === "zh" ? "重试" : "Retry"}
                    </Button>
                  </div>
                ) : horoscope ? (
                  <>
                    <HoroscopeReport
                      data={horoscope}
                      signName={selectedSign.name}
                      signSymbol={selectedSign.symbol}
                      isPaid={premiumStatus.showFullReport}
                      onUnlock={() => setShowUsageModal(true)}
                    />

                    {/* TTS */}
                    <div className="flex justify-center mt-4">
                      <TextToSpeech
                        text={`${selectedSign?.name} ${language === "zh" ? "今日运势" : "today's fortune"}. ${language === "zh" ? "综合运势" : "Overall"} ${horoscope.overall}. ${language === "zh" ? "爱情" : "Love"} ${horoscope.love.score}, ${horoscope.love.advice}. ${language === "zh" ? "事业" : "Career"} ${horoscope.career.score}, ${horoscope.career.advice}. ${language === "zh" ? "财运" : "Wealth"} ${horoscope.wealth.score}, ${horoscope.wealth.advice}. ${horoscope.encouragement}`}
                        size="md"
                        showLabel
                        lang={language === "zh" ? "zh-CN" : "en-US"}
                        className="text-cyan-400 hover:text-cyan-300"
                      />
                    </div>

                    {/* Guest sign-up CTA */}
                    {!isAuthenticated && (
                      <div className="max-w-md mx-auto mt-4" data-horoscope-trial-hook>
                        <div className="rounded-2xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-gold/10 to-transparent p-5 text-center space-y-3">
                          <Sparkles className="w-6 h-6 text-cosmic-gold mx-auto" />
                          <p className="text-sm text-muted-foreground">
                            {language === "zh"
                              ? "注册即送 14 天无限体验 · 每日回来看运势（到期回到免费额度）"
                              : "Sign up for a 14-day unlimited trial · return daily for your horoscope (then free limits apply)"}
                          </p>
                          <Button
                            onClick={() => window.location.href = getLoginUrl()}
                            className="gap-2 bg-cosmic-gold hover:bg-cosmic-gold/90 text-black font-semibold"
                          >
                            <Crown className="w-4 h-4" />
                            {language === "zh" ? "注册领 14 天试用" : "Sign up · 14-day trial"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Premium upsell banner */}
                    {!premiumStatus.showFullReport && (
                      <PaywallCTA featureType="horoscope" variant="banner" />
                    )}
                    {/* Deeper Insights comparison card */}
                    {!premiumStatus.showFullReport && (
                      <DeeperInsightsCard featureType="horoscope" className="mt-4" />
                    )}
                    {/* Soft paywall - blurred deep analysis preview */}
                    {!premiumStatus.showFullReport && (
                      <SoftPaywall featureType="horoscope" className="mt-4" />
                    )}

                    {/* Cross-sell: recommend other features */}
                    <CrossSellCard currentFeature="horoscope" className="mt-4" />

                    {/* 用户反馈模块 */}
                    <FeedbackWidget
                      sourceType="horoscope"
                      sessionId={sessionId}
                      className="mt-4"
                    />
                  </>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
