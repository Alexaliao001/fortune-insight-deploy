import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";
import { 
  Star, 
  Calendar,
  Clock,
  User,
  Loader2,
  RotateCcw,
  Crown,
  Sparkles,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import BaZiReport from "@/components/BaZiReport";
import FeedbackWidget from "@/components/FeedbackWidget";
import BaziChat from "@/components/BaziChat";
import TextToSpeech from "@/components/TextToSpeech";
import { UsageBadge } from "@/components/UsageBadge";
import { UsageLimitModal } from "@/components/UsageLimitModal";
import { ShareResultCard } from "@/components/ShareResultCard";
import SEOHead from "@/components/SEOHead";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import PaywallCTA from "@/components/PaywallCTA";
import LoadingRitual from "@/components/LoadingRitual";
import CrossSellCard from "@/components/CrossSellCard";
import DeeperInsightsCard from "@/components/DeeperInsightsCard";
import SoftPaywall from "@/components/SoftPaywall";
import { incrementUsageCount } from "@/components/InAppNotifications";
import { canGuestUse, consumeGuestUsage } from "@/lib/guestUsage";
import { shareSummaryFromReading } from "@/lib/reportScan";
import { toast } from "sonner";

type Stage = "input" | "loading" | "result";

export default function Bazi() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useTranslation();
  const [stage, setStage] = useState<Stage>("input");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "unknown" | "">("");
  const [reading, setReading] = useState("");
  const [llmDegraded, setLlmDegraded] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [sessionId] = useState(() => `bazi_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const premiumStatus = usePremiumStatus("bazi");

  // 生成并下载PDF报告
  const generatePDF = () => {
    if (!reading) return;
    setIsExporting(true);
    
    const birthInfo = language === "zh" 
      ? `${birthYear}年${birthMonth}月${birthDay}日${birthHour && birthHour !== "unknown" ? ` ${birthHour}时` : ''}`
      : `${birthMonth}/${birthDay}/${birthYear}${birthHour && birthHour !== "unknown" ? ` at ${birthHour}:00` : ''}`;
    const genderText = gender === "male" 
      ? (language === "zh" ? "男" : "Male") 
      : gender === "female" 
        ? (language === "zh" ? "女" : "Female") 
        : (language === "zh" ? "未知" : "Not specified");
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${language === "zh" ? "八字命理分析报告 - 洞察未来" : "BaZi Destiny Analysis Report - Fortune Insight"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .header {
      text-align: center;
      margin-bottom: 50px;
      padding: 40px;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
      border-radius: 20px;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    .logo { font-size: 48px; margin-bottom: 15px; }
    .site-name {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    .report-title { font-size: 20px; color: #94a3b8; margin-bottom: 15px; }
    .report-meta { font-size: 13px; color: #64748b; }
    .content {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 16px;
      border: 1px solid rgba(251, 191, 36, 0.3);
      padding: 30px;
      margin-bottom: 30px;
    }
    .birth-info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 25px;
      font-size: 14px;
      color: #94a3b8;
    }
    .reading-content {
      color: #e2e8f0;
      line-height: 1.9;
      white-space: pre-wrap;
      font-size: 15px;
    }
    .reading-content h2 { color: #fbbf24; margin: 25px 0 15px 0; font-size: 18px; }
    .reading-content h3 { color: #a78bfa; margin: 20px 0 10px 0; font-size: 16px; }
    .footer {
      text-align: center;
      margin-top: 50px;
      padding: 30px;
      border-top: 1px solid rgba(251, 191, 36, 0.2);
      color: #64748b;
      font-size: 12px;
    }
    .disclaimer {
      margin-top: 15px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      font-size: 11px;
      line-height: 1.6;
    }
    @media print {
      body { background: white; color: #1a1a2e; padding: 20px; }
      .content { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
      .header { background: #fffbeb !important; border: 1px solid #fde68a !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">☆ ☯</div>
      <div class="site-name">${language === "zh" ? "洞察未来" : "Fortune Insight"}</div>
      <div class="report-title">${language === "zh" ? "八字命理分析报告" : "BaZi Destiny Analysis Report"}</div>
      <div class="report-meta">${language === "zh" ? "生成时间" : "Generated"}：${new Date().toLocaleDateString(language === "zh" ? 'zh-CN' : 'en-US')}</div>
    </div>
    <div class="content">
      <div class="birth-info">
        <span>◈ ${language === "zh" ? "出生" : "Birth"}：${birthInfo}</span>
        <span>◇ ${language === "zh" ? "性别" : "Gender"}：${genderText}</span>
      </div>
      <div class="reading-content">${reading.replace(/\n/g, '<br>')}</div>
    </div>
    <div class="footer">
      <div style="font-size: 24px; margin-bottom: 10px;">☯</div>
      <div>${language === "zh" ? "洞察未来 - AI驱动的心灵成长平台" : "Fortune Insight - AI-Powered Spiritual Growth Platform"}</div>
      <div class="disclaimer">
        ※ ${language === "zh" 
          ? "八字分析仅供参考，旨在帮助您进行自我认知和人生规划。命运掌握在自己手中，积极的心态和努力才是成功的关键。"
          : "BaZi analysis is for reference only, aimed at helping you with self-awareness and life planning. Your destiny is in your own hands - a positive attitude and hard work are the keys to success."}
      </div>
    </div>
  </div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = language === "zh" 
      ? `八字分析报告_${new Date().toISOString().split('T')[0]}.html`
      : `BaZi_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const saveReportMutation = trpc.reports.save.useMutation();

  const baziMutation = trpc.bazi.getReading.useMutation({
    onSuccess: (data) => {
      const degraded = Boolean(data.degradation);
      setLlmDegraded(degraded);
      setReading(data.reading);
      if (data.chart) setChartData(data.chart);
      setStage("result");
      if (degraded) {
        toast.info(data.degradation?.message);
        return;
      }
      if (!isAuthenticated) {
        consumeGuestUsage("bazi");
      }
      incrementUsageCount();
      // Auto-save report
      if (isAuthenticated) {
        saveReportMutation.mutate({
          reportType: "bazi",
          title: `${language === "zh" ? "八字精批" : "BaZi Analysis"} - ${birthYear}/${birthMonth}/${birthDay}`,
          inputSummary: `${birthYear}-${birthMonth}-${birthDay} ${birthHour ? birthHour + ":00" : ""} ${gender === "male" ? "男" : gender === "female" ? "女" : ""}`.trim(),
          reportData: { chart: data.chart },
          aiInterpretation: data.reading,
          isPaid: premiumStatus.showFullReport,
        });
      }
    },
    onError: (error) => {
      if (error.message?.includes("FREE_LIMIT_REACHED")) {
        setShowUsageModal(true);
      } else {
        toast.error(
          error.message ||
            (language === "zh" ? "分析失败，请重试（出生信息已保留）" : "Analysis failed — your birth info is kept")
        );
      }
      // Preserve form fields; only leave loading stage
      setStage("input");
    },
  });

  const handleSubmit = () => {
    if (!birthYear || !birthMonth || !birthDay) {
      toast.error(
        language === "zh"
          ? "请填写出生年、月、日"
          : "Please enter birth year, month, and day"
      );
      return;
    }
    
    // Guest usage check
    if (!isAuthenticated) {
      const guestCheck = canGuestUse("bazi");
      if (!guestCheck.canUse) {
        setShowUsageModal(true);
        return;
      }
    }
    
    setLlmDegraded(false);
    setStage("loading");
    baziMutation.mutate({
      birthYear: parseInt(birthYear),
      birthMonth: parseInt(birthMonth),
      birthDay: parseInt(birthDay),
      birthHour: birthHour && birthHour !== "unknown" ? parseInt(birthHour) : undefined,
      gender: gender && gender !== "unknown" ? gender as "male" | "female" : undefined,
      language: language as "zh" | "en",
    });
  };

  const handleReset = () => {
    setStage("input");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setBirthHour("");
    setGender("");
    setReading("");
    setLlmDegraded(false);
    setChartData(null);
  };

  // 生成年份选项
  const years = Array.from({ length: 100 }, (_, i) => 2026 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="bazi" path="/bazi" />
      <StarryBackground />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-gradient mb-6"
            >
              <Star className="w-4 h-4 text-amber-300" />
              <span className="text-sm text-amber-300/80 tracking-wider uppercase">{t.bazi.title}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-5">
              {language === "zh" ? (
                <>发现您的<span className="gradient-text text-glow-gold">天赋潜能</span></>
              ) : (
                <>Discover Your <span className="gradient-text text-glow-gold">Hidden Talents</span></>
              )}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto font-light">
              {t.bazi.description}
            </p>
            <div className="mt-4">
              <UsageBadge featureType="bazi" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Stage 1: Input Form */}
            {stage === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      {language === "zh" ? "出生信息" : "Birth Information"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Birth Date */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>{t.bazi.form.birthYear} *</Label>
                        <Select value={birthYear} onValueChange={setBirthYear}>
                          <SelectTrigger className="bg-input/80 border-border/60">
                            <SelectValue placeholder={language === "zh" ? "选择年份" : "Select year"} />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}{language === "zh" ? "年" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t.bazi.form.birthMonth} *</Label>
                        <Select value={birthMonth} onValueChange={setBirthMonth}>
                          <SelectTrigger className="bg-input/80 border-border/60">
                            <SelectValue placeholder={language === "zh" ? "选择月份" : "Select month"} />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month.toString()}>
                                {language === "zh" ? `${month}月` : new Date(2000, month - 1).toLocaleString('en', { month: 'short' })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t.bazi.form.birthDay} *</Label>
                        <Select value={birthDay} onValueChange={setBirthDay}>
                          <SelectTrigger className="bg-input/80 border-border/60">
                            <SelectValue placeholder={language === "zh" ? "选择日期" : "Select day"} />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day}{language === "zh" ? "日" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Birth Time & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {t.bazi.form.birthHour} ({language === "zh" ? "可选" : "optional"})
                        </Label>
                        <Select value={birthHour} onValueChange={setBirthHour}>
                          <SelectTrigger className="bg-input/80 border-border/60">
                            <SelectValue placeholder={language === "zh" ? "选择时辰" : "Select hour"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unknown">{t.bazi.form.unknown}</SelectItem>
                            {hours.map((hour) => (
                              <SelectItem key={hour} value={hour.toString()}>
                                {hour.toString().padStart(2, '0')}:00
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {t.bazi.form.gender} ({language === "zh" ? "可选" : "optional"})
                        </Label>
                        <Select value={gender} onValueChange={(v) => setGender(v as "male" | "female" | "unknown")}>
                          <SelectTrigger className="bg-input/80 border-border/60">
                            <SelectValue placeholder={language === "zh" ? "选择性别" : "Select gender"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unknown">{t.bazi.form.unknown}</SelectItem>
                            <SelectItem value="female">{t.bazi.form.female}</SelectItem>
                            <SelectItem value="male">{t.bazi.form.male}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={!birthYear || !birthMonth || !birthDay}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                        size="lg"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t.bazi.form.submit}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      {language === "zh" 
                        ? "* 为必填项。时辰信息可以让分析更加准确"
                        : "* Required fields. Birth hour helps improve accuracy"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Stage 2: Loading — long-wait ritual (F2-2) */}
            {stage === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-amber-500/20 bg-black/20 px-2 py-4"
                aria-busy="true"
                data-bazi-loading
              >
                <p className="text-center text-xs text-amber-400/80 mb-2 tracking-wide">
                  {language === "zh"
                    ? "八字精批通常需要约 1 分钟，请勿关闭页面"
                    : "Full BaZi reports often take ~1 minute — keep this tab open"}
                </p>
                <LoadingRitual type="bazi" isLoading={true} />
              </motion.div>
            )}

            {/* Stage 3: Result */}
            {stage === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Birth Info Summary */}
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>
                          {language === "zh" 
                            ? `${birthYear}年${birthMonth}月${birthDay}日`
                            : `${birthMonth}/${birthDay}/${birthYear}`}
                        </span>
                      </div>
                      {birthHour && birthHour !== "unknown" && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>{birthHour}:00</span>
                        </div>
                      )}
                      {gender && gender !== "unknown" && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-amber-400" />
                          <span>{gender === "female" ? t.bazi.form.female : t.bazi.form.male}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Structured BaZi Report */}
                {chartData ? (
                  <BaZiReport
                    chart={chartData}
                    reading={reading}
                    isPaid={llmDegraded || premiumStatus.showFullReport}
                    onUnlock={() => setShowUsageModal(true)}
                  />
                ) : reading ? (
                  <Card className="glass-card border-gradient rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-display">
                        <Star className="w-5 h-5 text-[#d4a843]" />
                        {t.bazi.result}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{reading}</p>
                    </CardContent>
                  </Card>
                ) : null}

                {/* Premium upsell banner */}
                {reading && !llmDegraded && !premiumStatus.showFullReport && (
                  <PaywallCTA featureType="bazi" variant="banner" />
                )}
                {/* Deeper Insights comparison card */}
                {reading && !llmDegraded && !premiumStatus.showFullReport && (
                  <DeeperInsightsCard featureType="bazi" className="mt-6" />
                )}
                {/* Soft paywall - blurred deep analysis preview */}
                {reading && (llmDegraded || !premiumStatus.showFullReport) && (
                  <SoftPaywall
                    featureType="bazi"
                    reason={llmDegraded ? "daily-limit" : "upgrade"}
                  />
                )}

                {/* TTS */}
                {reading && !llmDegraded && (
                  <div className="flex justify-center">
                    <TextToSpeech
                      text={reading}
                      size="md"
                      showLabel
                      className="text-amber-400 hover:text-amber-300"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {language === "zh" ? "重新分析" : "New Analysis"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={generatePDF}
                    disabled={isExporting || llmDegraded}
                    className="gap-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {t.bazi.export}
                  </Button>
                  {reading && !llmDegraded && (
                    <ShareResultCard
                      type="bazi"
                      title={language === "zh" ? "八字精批结果" : "BaZi Analysis"}
                      subtitle={`${birthYear}-${birthMonth}-${birthDay}`}
                      summary={shareSummaryFromReading(reading, 280)}
                      details={[
                        language === "zh" ? "命理分析" : "Destiny Analysis",
                        language === "zh" ? "五行分布" : "Five Elements",
                        language === "zh" ? "运势预测" : "Fortune Forecast",
                      ]}
                      extraInfo={{
                        [language === "zh" ? "性别" : "Gender"]: gender === "male" ? (language === "zh" ? "男" : "Male") : gender === "female" ? (language === "zh" ? "女" : "Female") : (language === "zh" ? "未知" : "Unknown"),
                        [language === "zh" ? "出生" : "Birth"]: `${birthYear}.${birthMonth}.${birthDay}`,
                      }}
                      ogData={{
                        birth: `${birthYear}.${birthMonth}.${birthDay}`,
                        gender: gender === "male" ? (language === "zh" ? "男" : "Male") : gender === "female" ? (language === "zh" ? "女" : "Female") : undefined,
                      }}
                    />
                  )}
                  {!isAuthenticated && reading && !llmDegraded && (
                    <div className="w-full max-w-md mx-auto mt-2">
                      <div className="rounded-2xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-gold/10 to-transparent p-5 text-center space-y-3">
                        <Sparkles className="w-6 h-6 text-cosmic-gold mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          {language === "zh"
                            ? "注册免费账号，保存你的命理报告，随时回顾"
                            : "Sign up free to save your BaZi report and revisit anytime"}
                        </p>
                        <Button
                          onClick={() => window.location.href = getLoginUrl()}
                          className="gap-2 bg-cosmic-gold hover:bg-cosmic-gold/90 text-black font-semibold"
                        >
                          <Crown className="w-4 h-4" />
                          {language === "zh" ? "免费注册 · 保存报告" : "Sign Up Free · Save Report"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cross-sell: recommend other features */}
                {reading && !llmDegraded && (
                  <CrossSellCard currentFeature="bazi" className="mt-8" />
                )}

                {/* 继续咨询对话模块 */}
                {reading && !llmDegraded && (
                  <BaziChat
                    birthYear={parseInt(birthYear)}
                    birthMonth={parseInt(birthMonth)}
                    birthDay={parseInt(birthDay)}
                    birthHour={birthHour && birthHour !== "unknown" ? parseInt(birthHour) : undefined}
                    gender={gender === "male" || gender === "female" ? gender : undefined}
                    previousReport={reading}
                    className="mt-8"
                  />
                )}

                {/* 用户反馈模块 */}
                {reading && (
                  <FeedbackWidget
                    sourceType="bazi"
                    sessionId={sessionId}
                    className="mt-4"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      <UsageLimitModal
        open={showUsageModal}
        onOpenChange={setShowUsageModal}
        featureType="bazi"
        featureName="八字精批"
        featureNameEn="BaZi Analysis"
      />
    </div>
  );
}
