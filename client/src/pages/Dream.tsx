import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";
import { 
  Moon,
  CloudMoon,
  Sparkles,
  Brain,
  Heart,
  Loader2,
  X,
  Plus,
  Eye,
  RefreshCw,
  AlertTriangle,
  Star,
  Download,
  Zap,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import DreamReport from "@/components/DreamReport";
import FeedbackWidget from "@/components/FeedbackWidget";
import VoiceInput from "@/components/VoiceInput";
import TextToSpeech from "@/components/TextToSpeech";
import { UsageBadge } from "@/components/UsageBadge";
import { UsageLimitModal } from "@/components/UsageLimitModal";
import { ShareResultCard } from "@/components/ShareResultCard";
import SEOHead from "@/components/SEOHead";
import CrossSellCard from "@/components/CrossSellCard";
import DeeperInsightsCard from "@/components/DeeperInsightsCard";
import SoftPaywall from "@/components/SoftPaywall";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import PaywallCTA from "@/components/PaywallCTA";
import LoadingRitual from "@/components/LoadingRitual";
import { incrementUsageCount } from "@/components/InAppNotifications";
import { canGuestUse, consumeGuestUsage } from "@/lib/guestUsage";
import { shareSummaryFromReading } from "@/lib/reportScan";

const DREAM_EXAMPLES = {
  zh: {
    title: "被追赶的梦",
    content:
      "我梦见自己在一条陌生的街道上奔跑，背后有模糊的黑影在追。我怎么跑也跑不快，想喊却发不出声音。突然转弯进了一栋老房子，门一关黑影就消失了。醒来时心跳很快，但感觉说不清的轻松。",
  },
  en: {
    title: "Being chased",
    content:
      "I dreamed I was running down an unfamiliar street with a blurry shadow chasing me. My legs felt heavy and I couldn't scream. I turned into an old house, closed the door, and the shadow vanished. I woke with a racing heart but also a strange sense of relief.",
  },
};

export default function Dream() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useTranslation();
  const [step, setStep] = useState<"input" | "analyzing" | "result">("input");
  const [showUsageModal, setShowUsageModal] = useState(false);
  const premiumStatus = usePremiumStatus("dream");
  
  // 常见梦境情绪 - 根据语言
  const commonEmotions = language === "zh" 
    ? ["恐惧", "焦虑", "快乐", "悲伤", "困惑", "愤怒", "平静", "兴奋", "孤独", "温暖"]
    : ["Fear", "Anxiety", "Joy", "Sadness", "Confusion", "Anger", "Peace", "Excitement", "Loneliness", "Warmth"];

  // 常见梦境元素 - 根据语言
  const commonElements = language === "zh"
    ? ["水", "飞翔", "追逐", "坠落", "迷路", "考试", "死亡", "动物", "亲人", "陌生人", "房屋", "车辆", "自然", "怪物", "光明"]
    : ["Water", "Flying", "Chasing", "Falling", "Lost", "Exam", "Death", "Animals", "Family", "Strangers", "House", "Vehicle", "Nature", "Monster", "Light"];

  // 梦境类型 - 根据语言
  const dreamTypes = [
    { value: "normal", label: language === "zh" ? "普通梦境" : "Normal Dream", icon: Moon, color: "text-blue-400" },
    { value: "nightmare", label: language === "zh" ? "噩梦" : "Nightmare", icon: AlertTriangle, color: "text-red-400" },
    { value: "lucid", label: language === "zh" ? "清醒梦" : "Lucid Dream", icon: Eye, color: "text-emerald-400" },
    { value: "recurring", label: language === "zh" ? "重复梦" : "Recurring Dream", icon: RefreshCw, color: "text-amber-400" },
    { value: "prophetic", label: language === "zh" ? "预知梦" : "Prophetic Dream", icon: Zap, color: "text-violet-400" },
  ];

  // 梦境类型标签
  const dreamTypeLabels: Record<string, string> = language === "zh" 
    ? { normal: "普通梦境", nightmare: "噩梦", lucid: "清醒梦", recurring: "重复梦", prophetic: "预知梦" }
    : { normal: "Normal Dream", nightmare: "Nightmare", lucid: "Lucid Dream", recurring: "Recurring Dream", prophetic: "Prophetic Dream" };

  // 表单状态
  const [title, setTitle] = useState("");
  const [dreamContent, setDreamContent] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [dreamType, setDreamType] = useState<string>("normal");
  const [clarity, setClarity] = useState<number>(3);
  const [dreamDate, setDreamDate] = useState("");
  const [customEmotion, setCustomEmotion] = useState("");
  const [customElement, setCustomElement] = useState("");
  
  // 结果状态
  const [interpretation, setInterpretation] = useState("");
  const [llmDegraded, setLlmDegraded] = useState(false);
  const [symbolAnalysis, setSymbolAnalysis] = useState<any[]>([]);
  const [dreamTheme, setDreamTheme] = useState<any>(null);
  const [dreamProfile, setDreamProfile] = useState<any>(null);
  const [lastDreamId, setLastDreamId] = useState<number | null>(null);
  const [sessionId] = useState(() => `dream_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  // PDF导出状态
  const [isExporting, setIsExporting] = useState(false);

  // 导出PDF的函数
  const handleExportPDF = async () => {
    if (!interpretation) {
      toast.error(language === "zh" ? "没有可导出的内容" : "No content to export");
      return;
    }

    setIsExporting(true);
    try {
      const dreamData = {
        title: title || (language === "zh" ? "未命名梦境" : "Untitled Dream"),
        dreamContent,
        emotions: selectedEmotions,
        keyElements: selectedElements,
        dreamType,
        clarity,
        interpretation,
        createdAt: new Date().toISOString(),
      };

      const html = generateDreamReportHTML(dreamData);
      
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = language === "zh"
        ? `梦境解读_${title || '未命名'}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.html`
        : `Dream_${title || 'Untitled'}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(language === "zh" ? "梦境报告已导出！" : "Dream report exported!");
    } catch (error) {
      toast.error(language === "zh" ? "导出失败，请重试" : "Export failed, please try again");
    } finally {
      setIsExporting(false);
    }
  };

  // 生成梦境报告HTML
  function generateDreamReportHTML(dream: {
    title: string;
    dreamContent: string;
    emotions: string[];
    keyElements: string[];
    dreamType: string;
    clarity: number;
    interpretation: string;
    createdAt: string;
  }): string {
    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return language === "zh" 
        ? `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
        : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const cleanMarkdown = (text: string) => {
      return text
        .replace(/#{1,6}\s/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\n{3,}/g, "\n\n");
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${dream.title} - ${language === "zh" ? "梦境解读报告" : "Dream Interpretation Report"}</title>
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
      margin-bottom: 40px;
      padding: 40px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
      border-radius: 20px;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .logo { font-size: 48px; margin-bottom: 15px; }
    .site-name {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    .report-title { font-size: 20px; color: #94a3b8; margin-bottom: 15px; }
    .report-meta { font-size: 13px; color: #64748b; }
    .dream-card {
      margin-bottom: 30px;
      padding: 25px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 16px;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    .dream-title { color: #a78bfa; font-size: 22px; margin: 0 0 15px 0; }
    .meta-info { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; font-size: 13px; color: #94a3b8; }
    .content-box { background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px; }
    .section-title { color: #60a5fa; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
    .content-text { color: #e2e8f0; line-height: 1.8; margin: 0; white-space: pre-wrap; }
    .tags-container { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px; }
    .tag-group { flex: 1; min-width: 200px; }
    .tag-label { font-size: 13px; margin: 0 0 8px 0; }
    .tag-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .tag-emotion { background: rgba(244, 114, 182, 0.2); color: #f472b6; }
    .tag-element { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
    .interpretation-box { background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #8b5cf6; }
    .interpretation-title { color: #a78bfa; font-size: 16px; margin: 0 0 15px 0; }
    .interpretation-content { color: #e2e8f0; line-height: 1.9; white-space: pre-wrap; font-size: 14px; }
    .footer { text-align: center; margin-top: 50px; padding: 30px; border-top: 1px solid rgba(139, 92, 246, 0.2); color: #64748b; font-size: 12px; }
    .disclaimer { margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; font-size: 11px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">☽ ☆</div>
      <div class="site-name">${language === "zh" ? "洞察未来" : "Fortune Insight"}</div>
      <div class="report-title">${language === "zh" ? "梦境解读报告" : "Dream Interpretation Report"}</div>
      <div class="report-meta">${language === "zh" ? "生成时间" : "Generated"}：${formatDate(dream.createdAt)}</div>
    </div>
    <div class="dream-card">
      <h2 class="dream-title">☽ ${dream.title}</h2>
      <div class="meta-info">
        <span>◈ ${formatDate(dream.createdAt)}</span>
        <span>◇ ${dreamTypeLabels[dream.dreamType] || dreamTypeLabels.normal}</span>
        <span>★ ${language === "zh" ? "清晰度" : "Clarity"} ${dream.clarity}/5</span>
      </div>
      <div class="content-box">
        <h3 class="section-title">${language === "zh" ? "梦境内容" : "Dream Content"}</h3>
        <p class="content-text">${dream.dreamContent}</p>
      </div>
      ${dream.emotions.length > 0 || dream.keyElements.length > 0 ? `
      <div class="tags-container">
        ${dream.emotions.length > 0 ? `
        <div class="tag-group">
          <h4 class="tag-label" style="color: #f472b6;">♡ ${language === "zh" ? "梦中情绪" : "Dream Emotions"}</h4>
          <div class="tag-list">${dream.emotions.map(e => `<span class="tag tag-emotion">${e}</span>`).join('')}</div>
        </div>` : ''}
        ${dream.keyElements.length > 0 ? `
        <div class="tag-group">
          <h4 class="tag-label" style="color: #fbbf24;">☆ ${language === "zh" ? "关键元素" : "Key Elements"}</h4>
          <div class="tag-list">${dream.keyElements.map(e => `<span class="tag tag-element">${e}</span>`).join('')}</div>
        </div>` : ''}
      </div>` : ''}
      <div class="interpretation-box">
        <h3 class="interpretation-title">◈ ${language === "zh" ? "AI智能解读" : "AI Interpretation"}</h3>
        <div class="interpretation-content">${cleanMarkdown(dream.interpretation)}</div>
      </div>
    </div>
    <div class="footer">
      <div style="font-size: 24px; margin-bottom: 10px;">☽</div>
      <div>${language === "zh" ? "洞察未来 - AI驱动的心灵成长平台" : "Fortune Insight - AI-Powered Spiritual Growth Platform"}</div>
      <div class="disclaimer">
        ※ ${language === "zh" 
          ? "梦境解读仅供参考，旨在帮助您进行自我探索和心理成长。真正的智慧来自您对自己内心的觉察与理解。"
          : "Dream interpretation is for reference only, aimed at helping you explore yourself and grow psychologically. True wisdom comes from your awareness and understanding of your inner self."}
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  const saveReportMutation = trpc.reports.save.useMutation();

  // AI解梦mutation
  const interpretMutation = trpc.dream.interpret.useMutation({
    onSuccess: (data) => {
      const degraded = Boolean(data.degradation);
      setLlmDegraded(degraded);
      setInterpretation(data.interpretation);
      setSymbolAnalysis(data.symbolAnalysis || []);
      setDreamTheme(data.theme || null);
      setDreamProfile(data.dreamProfile || null);
      setStep("result");
      if (degraded) {
        toast.info(data.degradation?.message);
        return;
      }
      if (!isAuthenticated) {
        consumeGuestUsage("dream");
      }
      incrementUsageCount();
      toast.success(language === "zh" ? "梦境解析完成！" : "Dream interpretation complete!");
      // Auto-save report
      if (isAuthenticated) {
        saveReportMutation.mutate({
          reportType: "dream",
          title: title || (language === "zh" ? "梦境解析" : "Dream Analysis") + " - " + new Date().toLocaleDateString(),
          inputSummary: dreamContent.slice(0, 100),
          reportData: { symbolAnalysis: data.symbolAnalysis, theme: data.theme, emotions: selectedEmotions, elements: selectedElements },
          aiInterpretation: data.interpretation,
          isPaid: premiumStatus.showFullReport,
        });
      }
    },
    onError: (error) => {
      console.error('[Dream] onError called:', error.message);
      if (error.message?.includes("FREE_LIMIT_REACHED")) {
        setShowUsageModal(true);
      } else {
        toast.error(error.message || (language === "zh" ? "解析失败，请重试" : "Interpretation failed, please try again"));
      }
      setStep("input");
    },
  });

  const handleSubmit = () => {
    if (dreamContent.length < 10) {
      toast.error(language === "zh" ? "请详细描述您的梦境（至少10个字）" : "Please describe your dream in detail (at least 10 characters)");
      return;
    }

    // Guest usage check
    if (!isAuthenticated) {
      const guestCheck = canGuestUse("dream");
      if (!guestCheck.canUse) {
        setShowUsageModal(true);
        return;
      }
    }

    setLlmDegraded(false);
    setStep("analyzing");
    interpretMutation.mutate({
      title: title || undefined,
      dreamContent,
      emotions: selectedEmotions.length > 0 ? selectedEmotions : undefined,
      keyElements: selectedElements.length > 0 ? selectedElements : undefined,
      dreamType: dreamType as "normal" | "nightmare" | "lucid" | "recurring" | "prophetic",
      clarity,
      dreamDate: dreamDate || undefined,
      language: language as "zh" | "en",
    });
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleElement = (element: string) => {
    setSelectedElements(prev => 
      prev.includes(element) 
        ? prev.filter(e => e !== element)
        : [...prev, element]
    );
  };

  const addCustomEmotion = () => {
    if (customEmotion && !selectedEmotions.includes(customEmotion)) {
      setSelectedEmotions(prev => [...prev, customEmotion]);
      setCustomEmotion("");
    }
  };

  const addCustomElement = () => {
    if (customElement && !selectedElements.includes(customElement)) {
      setSelectedElements(prev => [...prev, customElement]);
      setCustomElement("");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDreamContent("");
    setSelectedEmotions([]);
    setSelectedElements([]);
    setDreamType("normal");
    setClarity(3);
    setDreamDate("");
    setInterpretation("");
    setLlmDegraded(false);
    setStep("input");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="dream" path="/dream" />
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
              <CloudMoon className="w-4 h-4 text-indigo-300" />
              <span className="text-sm text-indigo-300/80 tracking-wider uppercase">{t.dream.title}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-5">
              {language === "zh" ? (
                <>探索<span className="gradient-text text-glow-gold">梦境</span>的奥秘</>
              ) : (
                <>Explore the <span className="text-glow text-primary">Mysteries</span> of Dreams</>
              )}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.dream.description}
            </p>
            <div className="mt-4">
              <UsageBadge featureType="dream" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* 输入阶段 */}
            {step === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* 梦境描述 */}
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <Moon className="w-5 h-5 text-indigo-400" />
                      {language === "zh" ? "描述您的梦境" : "Describe Your Dream"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">{language === "zh" ? "梦境标题（可选）" : "Dream Title (optional)"}</Label>
                      <Input
                        id="title"
                        placeholder={language === "zh" ? "例如：奇幻森林之旅、飞翔的梦..." : "e.g., Fantasy Forest Journey, Flying Dream..."}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1.5 bg-background/50"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dreamContent">{t.dream.form.content} *</Label>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <VoiceInput
                            onTranscript={(text: string) => setDreamContent(prev => prev + text)}
                            className="h-7 w-7 text-muted-foreground hover:text-cyan-400"
                          />
                          <span>{language === "zh" ? "语音输入" : "Voice Input"}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5 mb-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs border-violet-500/30 text-violet-300"
                          data-dream-example
                          onClick={() => {
                            const ex = language === "zh" ? DREAM_EXAMPLES.zh : DREAM_EXAMPLES.en;
                            setTitle(ex.title);
                            setDreamContent(ex.content);
                            // fill only — do not auto-submit
                          }}
                        >
                          <Lightbulb className="w-3.5 h-3.5 mr-1" />
                          {language === "zh" ? "填入示例梦境" : "Fill example dream"}
                        </Button>
                      </div>
                      <Textarea
                        id="dreamContent"
                        placeholder={t.dream.form.contentPlaceholder}
                        value={dreamContent}
                        onChange={(e) => setDreamContent(e.target.value)}
                        className="mt-1.5 min-h-[150px] bg-background/50"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {dreamContent.length}/10 {language === "zh" ? "字（至少10字）" : "chars (min 10)"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dreamDate">{language === "zh" ? "梦境日期（可选）" : "Dream Date (optional)"}</Label>
                        <Input
                          id="dreamDate"
                          type="date"
                          value={dreamDate}
                          onChange={(e) => setDreamDate(e.target.value)}
                          className="mt-1.5 bg-background/50"
                        />
                      </div>
                      <div>
                        <Label>{language === "zh" ? "梦境类型" : "Dream Type"}</Label>
                        <Select value={dreamType} onValueChange={setDreamType}>
                          <SelectTrigger className="mt-1.5 bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dreamTypes.map((type) => {
                              const Icon = type.icon;
                              return (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className={`w-4 h-4 ${type.color}`} />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 梦境情绪 */}
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <Heart className="w-5 h-5 text-rose-400" />
                      {t.dream.form.emotion} ({language === "zh" ? "可选" : "optional"})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {commonEmotions.map((emotion) => (
                        <Badge
                          key={emotion}
                          variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedEmotions.includes(emotion) 
                              ? "bg-rose-500/80 hover:bg-rose-500" 
                              : "hover:bg-rose-500/20"
                          }`}
                          onClick={() => toggleEmotion(emotion)}
                        >
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder={language === "zh" ? "添加其他情绪..." : "Add other emotions..."}
                        value={customEmotion}
                        onChange={(e) => setCustomEmotion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomEmotion()}
                        className="bg-background/50"
                      />
                      <Button variant="outline" size="icon" onClick={addCustomEmotion}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {selectedEmotions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedEmotions.map((emotion) => (
                          <Badge key={emotion} className="bg-rose-500/80">
                            {emotion}
                            <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleEmotion(emotion)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 关键元素 */}
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      {t.dream.form.elements} ({language === "zh" ? "可选" : "optional"})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {commonElements.map((element) => (
                        <Badge
                          key={element}
                          variant={selectedElements.includes(element) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedElements.includes(element) 
                              ? "bg-amber-500/80 hover:bg-amber-500" 
                              : "hover:bg-amber-500/20"
                          }`}
                          onClick={() => toggleElement(element)}
                        >
                          {element}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t.dream.form.elementsPlaceholder}
                        value={customElement}
                        onChange={(e) => setCustomElement(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomElement()}
                        className="bg-background/50"
                      />
                      <Button variant="outline" size="icon" onClick={addCustomElement}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {selectedElements.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedElements.map((element) => (
                          <Badge key={element} className="bg-amber-500/80">
                            {element}
                            <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleElement(element)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 清晰度 */}
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      <Eye className="w-5 h-5 text-cyan-400" />
                      {language === "zh" ? "梦境清晰度" : "Dream Clarity"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{language === "zh" ? "模糊" : "Vague"}</span>
                      <div className="flex gap-2 flex-1 justify-center">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => setClarity(level)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              clarity >= level 
                                ? "bg-cyan-500 text-white" 
                                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                            }`}
                          >
                            <Star className={`w-5 h-5 ${clarity >= level ? "fill-current" : ""}`} />
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{language === "zh" ? "清晰" : "Clear"}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* 提交按钮 */}
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
                  onClick={handleSubmit}
                  disabled={dreamContent.length < 10}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  {t.dream.form.submit}
                </Button>
              </motion.div>
            )}

            {/* 分析阶段 */}
            {step === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <LoadingRitual type="dream" isLoading={true} />
              </motion.div>
            )}

            {/* 结果阶段 */}
            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Structured Dream Report */}
                <DreamReport
                  interpretation={interpretation}
                  symbolAnalysis={symbolAnalysis}
                  theme={dreamTheme}
                  dreamContent={dreamContent}
                  emotions={selectedEmotions}
                  keyElements={selectedElements}
                  isPaid={llmDegraded || premiumStatus.showFullReport}
                  onUnlock={() => setShowUsageModal(true)}
                  dreamProfile={dreamProfile}
                />

                {/* Premium upsell banner */}
                {interpretation && !llmDegraded && !premiumStatus.showFullReport && (
                  <PaywallCTA featureType="dream" variant="banner" />
                )}
                {/* Deeper Insights comparison card */}
                {interpretation && !llmDegraded && !premiumStatus.showFullReport && (
                  <DeeperInsightsCard featureType="dream" className="mt-6" />
                )}
                {/* Soft paywall - blurred deep analysis preview */}
                {interpretation && (llmDegraded || !premiumStatus.showFullReport) && (
                  <SoftPaywall
                    featureType="dream"
                    reason={llmDegraded ? "daily-limit" : "upgrade"}
                  />
                )}

                {/* TTS */}
                {!llmDegraded && (
                  <div className="flex justify-center">
                    <TextToSpeech
                      text={interpretation}
                      size="md"
                      showLabel
                      className="text-violet-400 hover:text-violet-300"
                    />
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 min-w-[140px]"
                    onClick={resetForm}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {language === "zh" ? "解析新梦境" : "New Dream"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 min-w-[140px] border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={handleExportPDF}
                    disabled={isExporting || llmDegraded}
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {t.dream.export}
                  </Button>
                  {!llmDegraded && (
                    isAuthenticated ? (
                      <Button
                        className="flex-1 min-w-[140px] bg-gradient-to-r from-indigo-500 to-violet-500"
                        onClick={() => toast.success(language === "zh" ? "梦境已保存到您的记录中" : "Dream saved to your records")}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        {language === "zh" ? "已保存到记录" : "Saved"}
                      </Button>
                    ) : interpretation ? (
                      <Button
                        onClick={() => window.location.href = getLoginUrl()}
                        className="flex-1 min-w-[140px] gap-2 bg-cosmic-gold hover:bg-cosmic-gold/90 text-black font-semibold"
                      >
                        <Sparkles className="w-4 h-4" />
                        {language === "zh" ? "免费注册 · 保存解梦" : "Sign Up Free · Save"}
                      </Button>
                    ) : null
                  )}
                  {interpretation && !llmDegraded && (
                    <ShareResultCard
                      type="dream"
                      title={language === "zh" ? "AI解梦结果" : "Dream Interpretation"}
                      subtitle={title || (language === "zh" ? "梦境解析" : "Dream Analysis")}
                      summary={shareSummaryFromReading(interpretation, 280)}
                      details={[
                        ...(selectedEmotions.length > 0 ? [`${language === "zh" ? "情绪" : "Emotions"}: ${selectedEmotions.join(", ")}`] : []),
                        ...(selectedElements.length > 0 ? [`${language === "zh" ? "元素" : "Elements"}: ${selectedElements.join(", ")}`] : []),
                      ]}
                      extraInfo={{
                        [language === "zh" ? "梦境类型" : "Type"]: dreamTypeLabels[dreamType] || dreamType,
                        [language === "zh" ? "清晰度" : "Clarity"]: `${clarity}/5`,
                      }}
                      ogData={{
                        dreamTitle: title || undefined,
                        emotions: selectedEmotions.length > 0 ? selectedEmotions.join(",") : undefined,
                        elements: selectedElements.length > 0 ? selectedElements.join(",") : undefined,
                        dreamType: dreamTypeLabels[dreamType] || dreamType,
                        clarity: `${clarity}/5`,
                      }}
                    />
                  )}
                </div>

                {/* 提示 */}
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      <Lightbulb className="inline w-4 h-4 mr-1 text-amber-400" /> {language === "zh" 
                        ? "梦境是潜意识与我们对话的方式。解读仅供参考，真正的智慧来自您对自己内心的觉察与理解。"
                        : "Dreams are how our subconscious communicates with us. Interpretations are for reference only - true wisdom comes from your own inner awareness and understanding."}
                    </p>
                  </CardContent>
                </Card>

                {/* Cross-sell: recommend other features */}
                {!llmDegraded && (
                  <CrossSellCard currentFeature="dream" className="mt-4" />
                )}

                {/* 用户反馈模块 */}
                {!llmDegraded && (
                  <FeedbackWidget
                    sourceType="dream"
                    sourceId={lastDreamId || undefined}
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
        featureType="dream"
        featureName="AI解梦"
        featureNameEn="Dream Interpreter"
      />
    </div>
  );
}
