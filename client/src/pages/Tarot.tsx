import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";
import { 
  Moon, 
  Heart, 
  Briefcase, 
  Coins, 
  Sparkles,
  RotateCcw,
  Crown,
  Loader2,
  Hand,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearch } from "wouter";
import { getLoginUrl } from "@/const";
import { extractPullQuote } from "@/lib/tarotReportFormat";
import TarotReport from "@/components/TarotReport";
import FeedbackWidget from "@/components/FeedbackWidget";
import VoiceInput from "@/components/VoiceInput";
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
import {
  ambientDataAttr,
  DEFAULT_AMBIENT_ON,
  readSfxOn,
  sfxDataAttr,
  shouldPlaySfx,
  writeSfxOn,
} from "@/lib/tarotAudio";
import {
  type DrawingPhase,
  SHUFFLE_DURATION_MS,
  afterAllCardsDrawn,
  afterShuffleComplete,
  AWAIT_READING_EMPHASIS_MS,
  cardFlyLayoutId,
  drawingPhaseAttr,
  FLIP_FLASH_MS,
  FLIP_PARTICLE_COUNT,
  flipFlashAttr,
  flipParticleOffset,
  flyTransition,
  initialDrawingPhase,
  isAwaitReading,
  isReadyToPick,
  isShufflePhase,
  nextSlotIndex,
  slotFilledAttr,
  tryTapVibrate,
  rollIsReversed,
  type SpreadSize,
  isValidSpreadSize,
  drawToneHz,
  questionTemplates,
} from "@/lib/tarotRitual";
import { keywordsForCardName } from "@/lib/tarotKeywords";
import { TarotCardFace } from "@/components/TarotCardFace";
import { toast } from "sonner";
import {
  elementBorderClass,
  elementDataAttr,
  elementForCardName,
} from "@/lib/tarotElement";

// 塔罗牌数据 - 中英文
const tarotCardsZh = [
  { id: 0, name: "愚者", meaning: "新的开始、冒险、纯真" },
  { id: 1, name: "魔术师", meaning: "创造力、技能、意志力" },
  { id: 2, name: "女祭司", meaning: "直觉、神秘、内在智慧" },
  { id: 3, name: "女皇", meaning: "丰饶、母性、自然" },
  { id: 4, name: "皇帝", meaning: "权威、结构、父性" },
  { id: 5, name: "教皇", meaning: "传统、信仰、指导" },
  { id: 6, name: "恋人", meaning: "爱情、和谐、选择" },
  { id: 7, name: "战车", meaning: "决心、胜利、控制" },
  { id: 8, name: "力量", meaning: "勇气、耐心、内在力量" },
  { id: 9, name: "隐者", meaning: "内省、寻求、指引" },
  { id: 10, name: "命运之轮", meaning: "命运、转折、机遇" },
  { id: 11, name: "正义", meaning: "公正、真相、因果" },
  { id: 12, name: "倒吊人", meaning: "牺牲、新视角、等待" },
  { id: 13, name: "死神", meaning: "结束、转变、新生" },
  { id: 14, name: "节制", meaning: "平衡、耐心、调和" },
  { id: 15, name: "恶魔", meaning: "束缚、欲望、物质" },
  { id: 16, name: "塔", meaning: "突变、觉醒、解放" },
  { id: 17, name: "星星", meaning: "希望、灵感、宁静" },
  { id: 18, name: "月亮", meaning: "幻觉、直觉、潜意识" },
  { id: 19, name: "太阳", meaning: "成功、活力、快乐" },
  { id: 20, name: "审判", meaning: "觉醒、重生、召唤" },
  { id: 21, name: "世界", meaning: "完成、整合、成就" },
];

const tarotCardsEn = [
  { id: 0, name: "The Fool", meaning: "New beginnings, adventure, innocence" },
  { id: 1, name: "The Magician", meaning: "Creativity, skill, willpower" },
  { id: 2, name: "High Priestess", meaning: "Intuition, mystery, inner wisdom" },
  { id: 3, name: "The Empress", meaning: "Abundance, motherhood, nature" },
  { id: 4, name: "The Emperor", meaning: "Authority, structure, fatherhood" },
  { id: 5, name: "Hierophant", meaning: "Tradition, faith, guidance" },
  { id: 6, name: "The Lovers", meaning: "Love, harmony, choices" },
  { id: 7, name: "The Chariot", meaning: "Determination, victory, control" },
  { id: 8, name: "Strength", meaning: "Courage, patience, inner strength" },
  { id: 9, name: "The Hermit", meaning: "Introspection, seeking, guidance" },
  { id: 10, name: "Wheel of Fortune", meaning: "Fate, turning point, opportunity" },
  { id: 11, name: "Justice", meaning: "Fairness, truth, karma" },
  { id: 12, name: "Hanged Man", meaning: "Sacrifice, new perspective, waiting" },
  { id: 13, name: "Death", meaning: "Endings, transformation, rebirth" },
  { id: 14, name: "Temperance", meaning: "Balance, patience, harmony" },
  { id: 15, name: "The Devil", meaning: "Bondage, desire, materialism" },
  { id: 16, name: "The Tower", meaning: "Sudden change, awakening, liberation" },
  { id: 17, name: "The Star", meaning: "Hope, inspiration, serenity" },
  { id: 18, name: "The Moon", meaning: "Illusion, intuition, subconscious" },
  { id: 19, name: "The Sun", meaning: "Success, vitality, joy" },
  { id: 20, name: "Judgement", meaning: "Awakening, rebirth, calling" },
  { id: 21, name: "The World", meaning: "Completion, integration, achievement" },
];

type Stage = "select" | "question" | "drawing" | "result";

const VALID_TAROT_TYPES = new Set(["love", "career", "wealth", "general", "health"]);

export default function Tarot() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useTranslation();
  const search = useSearch();
  const typeFromUrl = useMemo(() => {
    const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    const type = (q.get("type") || "").toLowerCase();
    return VALID_TAROT_TYPES.has(type) ? type : null;
  }, [search]);

  const [stage, setStage] = useState<Stage>("select");
  const [selectedType, setSelectedType] = useState<string>(typeFromUrl || "love");
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<typeof tarotCardsZh>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [cardReversals, setCardReversals] = useState<boolean[]>([]);
  const [spreadSize, setSpreadSize] = useState<SpreadSize>(3);
  const [reading, setReading] = useState("");
  const [structuredCards, setStructuredCards] = useState<any[]>([]);
  const [spreadData, setSpreadData] = useState<any>(null);
  const [sessionId] = useState(() => `tarot_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const premiumStatus = usePremiumStatus("tarot");

  // T00: single sound control = sfx only (default on).
  // Ambient background stays permanently default-off (no UI; no loop player yet).
  const [sfxOn, setSfxOn] = useState(true);
  useEffect(() => {
    try {
      setSfxOn(readSfxOn(window.localStorage));
    } catch {
      // private mode / unavailable storage → keep defaults
    }
  }, []);

  const toggleSfx = useCallback(() => {
    setSfxOn((prev) => {
      const next = !prev;
      try {
        writeSfxOn(window.localStorage, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  // Deep-link /tarot?type=career → preselect career (F1-1)
  useEffect(() => {
    if (typeFromUrl) {
      setSelectedType(typeFromUrl);
    }
  }, [typeFromUrl]);

  // 根据语言选择塔罗牌数据
  const tarotCards = language === "zh" ? tarotCardsZh : tarotCardsEn;

  // 问题类型 — career elevated for job/career path (F1-1)
  const questionTypes = [
    { id: "career", label: t.tarot.questionTypes.career, icon: Briefcase, color: "text-amber-400", bgColor: "bg-amber-500/20", featured: true },
    { id: "love", label: t.tarot.questionTypes.love, icon: Heart, color: "text-rose-400", bgColor: "bg-rose-500/20", featured: false },
    { id: "wealth", label: t.tarot.questionTypes.wealth, icon: Coins, color: "text-emerald-400", bgColor: "bg-emerald-500/20", featured: false },
    { id: "general", label: t.tarot.questionTypes.general, icon: Sparkles, color: "text-cyan-400", bgColor: "bg-cyan-500/20", featured: false },
  ];

  // 位置标签
  const positionLabels = [t.tarot.cardPositions.past, t.tarot.cardPositions.present, t.tarot.cardPositions.future];

  // Soft UI tones via Web Audio — gated by sfx channel (T00)
  const playTone = useCallback((freq: number, durationMs: number, gain = 0.08) => {
    if (!shouldPlaySfx(sfxOn)) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      g.gain.value = gain;
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.stop(ctx.currentTime + durationMs / 1000);
      osc.onended = () => ctx.close().catch(() => {});
    } catch {
      // ignore autoplay / unsupported
    }
  }, [sfxOn]);

  const playDrawSound = useCallback(() => {
    playTone(420, 120, 0.06);
  }, [playTone]);

  const playRevealSound = useCallback(() => {
    playTone(660, 160, 0.07);
  }, [playTone]);

  // 洗牌后的牌堆 - only reshuffle when entering drawing stage, not on every stage change
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const shuffledDeck = useMemo(() => {
    return [...tarotCards].sort(() => Math.random() - 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleSeed, tarotCards]);

  const saveReportMutation = trpc.reports.save.useMutation();

  const tarotMutation = trpc.tarot.getReading.useMutation({
    onSuccess: (data) => {
      setReading(data.reading);
      if (data.cards) setStructuredCards(data.cards);
      if (data.spread) setSpreadData(data.spread);
      incrementUsageCount();
      // Auto-save report
      if (isAuthenticated) {
        saveReportMutation.mutate(
          {
            reportType: "tarot",
            title: `${selectedType ? questionTypes.find(t => t.id === selectedType)?.label || "Tarot" : "Tarot"} - ${new Date().toLocaleDateString()}`,
            inputSummary: question || undefined,
            reportData: { cards: data.cards, spread: data.spread, drawnCards },
            aiInterpretation: data.reading,
            isPaid: premiumStatus.showFullReport,
          },
          {
            onSuccess: () =>
              toast.success(language === "zh" ? "报告已保存" : "Reading saved"),
            onError: () =>
              toast.error(language === "zh" ? "保存失败" : "Save failed"),
          }
        );
      }
    },
    onError: (error) => {
      if (error.message?.includes("FREE_LIMIT_REACHED")) {
        setShowUsageModal(true);
        setStage("drawing");
        setDrawnCards([]);
        setFlippedCards([]);
      }
      // For other errors, stay on result stage so the error message is visible
      console.error("[Tarot] Reading error:", error.message);
    },
  });

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);
    setStage("question");
  };

  // T01: shuffle entrance phase before cards are pickable
  const [drawingPhase, setDrawingPhase] = useState<DrawingPhase>("ready");
  // T02: reduce-motion → short fade instead of spring fly
  const [reduceMotion, setReduceMotion] = useState(false);
  // T03: brief gold flash on the slot that just flipped
  const [flipFlashSlot, setFlipFlashSlot] = useState<number | null>(null);
  // T06: emphasize Start Reading CTA for ~2s after 3 cards (never disabled)
  const [awaitCtaPulse, setAwaitCtaPulse] = useState(false);

  const skipShuffle = useCallback(() => {
    setDrawingPhase(afterShuffleComplete());
  }, []);

  useEffect(() => {
    if (stage !== "drawing" || !isShufflePhase(drawingPhase)) return;
    const t = window.setTimeout(() => {
      setDrawingPhase(afterShuffleComplete());
    }, SHUFFLE_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [stage, drawingPhase]);

  // T06: when 3 cards present, enter await-reading and pulse CTA (button stays clickable)
  useEffect(() => {
    if (stage !== "drawing" || drawnCards.length !== spreadSize) return;
    setDrawingPhase(afterAllCardsDrawn());
    setAwaitCtaPulse(true);
    const t = window.setTimeout(() => setAwaitCtaPulse(false), AWAIT_READING_EMPHASIS_MS);
    return () => window.clearTimeout(t);
  }, [stage, drawnCards.length, spreadSize]);

  const handleStartDrawing = () => {
    // Check guest usage before entering drawing stage
    if (!isAuthenticated) {
      const guestCheck = canGuestUse("tarot");
      if (!guestCheck.canUse) {
        setShowUsageModal(true);
        return;
      }
    }
    setShuffleSeed(prev => prev + 1); // reshuffle deck
    setDrawnCards([]);
    setFlippedCards([]);
    // T01/T02: reduced-motion → ready immediately + soft fly
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = false;
    }
    setReduceMotion(reduced);
    setDrawingPhase(initialDrawingPhase(reduced));
    setStage("drawing");
    // T20: brief shuffle rustle (sfx channel)
    if (!reduced) {
      playTone(280, 90, 0.04);
      window.setTimeout(() => playTone(320, 80, 0.035), 100);
      window.setTimeout(() => playTone(260, 100, 0.03), 200);
    }
  };

  // 用户点击抽取一张牌
  const handleDrawCard = (cardIndex: number) => {
    if (drawnCards.length >= spreadSize) return;
    if (!isReadyToPick(drawingPhase)) return;

    // Guest usage check on first card draw
    if (drawnCards.length === 0 && !isAuthenticated) {
      const guestCheck = canGuestUse("tarot");
      if (!guestCheck.canUse) {
        setShowUsageModal(true);
        return;
      }
      consumeGuestUsage("tarot");
    }
    
    // T04: short haptic on pick (no-op if unsupported; never throws)
    tryTapVibrate();
    // T21 progressive sfx pitch by draw index
    playTone(drawToneHz(drawnCards.length), 120, 0.06);
    
    const card = shuffledDeck[cardIndex];
    const slotIndex = nextSlotIndex(drawnCards.length);
    const isRev = rollIsReversed();
    const newDrawnCards = [...drawnCards, card];
    setDrawnCards(newDrawnCards);
    setCardReversals((prev) => [...prev, isRev]);
    
    setTimeout(() => {
      playRevealSound();
      setFlippedCards((prev) => [...prev, slotIndex]);
      // T03: gold flash ≤400ms on this slot only
      setFlipFlashSlot(slotIndex);
      window.setTimeout(() => {
        setFlipFlashSlot((cur) => (cur === slotIndex ? null : cur));
      }, FLIP_FLASH_MS);
    }, 300);

    // No auto-trigger - user will click "Start Reading" button
  };

  // Explicit function to start the reading after cards are drawn
  const handleStartReading = () => {
    setStage("result");
    const spreadId = spreadSize === 1 ? "single" : undefined;
    tarotMutation.mutate({
      questionType: selectedType as "love" | "career" | "wealth" | "general",
      question,
      spreadId,
      drawnCards: drawnCards.map((c, i) => ({
        cardId: c.id,
        isReversed: cardReversals[i] ?? false,
        positionIndex: i,
      })),
      cards: drawnCards.map((c) => c.name),
      language: language as "zh" | "en",
    });
  };

  const handleAgain = () => {
    setShuffleSeed((prev) => prev + 1);
    setDrawnCards([]);
    setFlippedCards([]);
    setCardReversals([]);
    setFlipFlashSlot(null);
    setAwaitCtaPulse(false);
    setReading("");
    setStructuredCards([]);
    setSpreadData(null);
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch { /* */ }
    setReduceMotion(reduced);
    setDrawingPhase(initialDrawingPhase(reduced));
    setStage("drawing");
    // T20: brief shuffle rustle (sfx channel)
    if (!reduced) {
      playTone(280, 90, 0.04);
      window.setTimeout(() => playTone(320, 80, 0.035), 100);
      window.setTimeout(() => playTone(260, 100, 0.03), 200);
    }
  };

  const handleRetype = () => {
    handleReset();
  };

  const handleReset = () => {
    setShuffleSeed(prev => prev + 1); // reshuffle deck
    setStage("select");
    setSelectedType("love");
    setQuestion("");
    setDrawnCards([]);
    setFlippedCards([]);
    setCardReversals([]);
    setFlipFlashSlot(null);
    setAwaitCtaPulse(false);
    setReading("");
    setStructuredCards([]);
    setSpreadData(null);
    setSpreadSize(3);
  };

  const drawnCardIds = drawnCards.map(c => c.id);

  // 问题占位符
  const getQuestionPlaceholder = () => {
    if (language === "zh") {
      return selectedType === 'love' ? '例如：我和TA的感情会有什么发展？' 
        : selectedType === 'career' ? '例如：我的工作会有什么新机遇？' 
        : selectedType === 'wealth' ? '例如：我的投资方向该如何选择？' 
        : '例如：我近期的运势如何？';
    }
    return selectedType === 'love' ? 'e.g., What will happen in my relationship?' 
      : selectedType === 'career' ? 'e.g., What new opportunities await in my career?' 
      : selectedType === 'wealth' ? 'e.g., How should I approach my investments?' 
      : 'e.g., What does my fortune look like?';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="tarot" path="/tarot" />
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
              <Moon className="w-4 h-4 text-indigo-300" />
              <span className="text-sm text-indigo-300/80 tracking-wider uppercase">{t.tarot.title}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-5">
              {language === "zh" ? (
                <>探索内心的<span className="gradient-text text-glow-gold">指引</span></>
              ) : (
                <>Explore Your Inner <span className="gradient-text text-glow-gold">Guidance</span></>
              )}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto font-light">
              {t.tarot.description}
            </p>
            <div className="mt-4">
              <UsageBadge featureType="tarot" />
            </div>
          </div>

          {/* Stage 1: Select Question Type */}
            {stage === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-center text-sm text-muted-foreground">
                  {language === "zh"
                    ? "求职或职场选择？优先点「事业」"
                    : "Job or career choices? Start with Career"}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {questionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`relative glass-card rounded-2xl hover:glow-violet cursor-pointer transition-all duration-500 group p-6 text-center border-gradient ${
                        selectedType === type.id
                          ? "ring-2 ring-[#d4a843]/50 bg-[rgba(212,168,67,0.05)]"
                          : ""
                      } ${
                        type.featured
                          ? "border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                          : ""
                      }`}
                      onClick={() => handleSelectType(type.id)}
                    >
                        {type.featured && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 whitespace-nowrap">
                            {language === "zh" ? "事业 · 推荐" : "Career pick"}
                          </span>
                        )}
                        <div className={`w-16 h-16 rounded-2xl ${type.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className={`w-8 h-8 ${type.color}`} />
                        </div>
                        <h3 className="font-semibold">{type.label}</h3>
                    </div>
                  );
                })}
                </div>
              </motion.div>
            )}

            {/* Stage 2: Input Question */}
            {stage === "question" && (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display">
                      {questionTypes.find(t => t.id === selectedType)?.icon && (
                        <span className={questionTypes.find(t => t.id === selectedType)?.color}>
                          {(() => {
                            const Icon = questionTypes.find(t => t.id === selectedType)?.icon;
                            return Icon ? <Icon className="w-5 h-5" /> : null;
                          })()}
                        </span>
                      )}
                      {questionTypes.find(t => t.id === selectedType)?.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 快速抽牌按钮 */}
                    <div className="text-center">
                      <Button
                        onClick={handleStartDrawing}
                        size="lg"
                        className="w-full max-w-xs bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 py-6 glow-violet"
                      >
                        <Hand className="w-5 h-5 mr-2" />
                        {t.tarot.startReading}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-3">
                        {language === "zh" ? "点击后从牌堆中选取三张牌" : "Click to select three cards from the deck"}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {language === "zh" 
                          ? `${((new Date().getMinutes() % 8) + 3)}人正在占卜中` 
                          : `${((new Date().getMinutes() % 8) + 3)} people reading now`}
                      </p>
                    </div>

                    {/* 问题输入（可选） */}
                    <div className="space-y-3">
                      
                      {/* T16 spread size + T17 templates */}
                      <div className="flex flex-wrap justify-center gap-2 mb-3">
                        <button
                          type="button"
                          data-tarot-spread="1"
                          onClick={() => setSpreadSize(1)}
                          className={`text-xs px-3 py-1 rounded-full border ${spreadSize === 1 ? "border-[#d4a843] text-[#d4a843] bg-[#d4a843]/10" : "border-white/10 text-muted-foreground"}`}
                        >
                          {language === "zh" ? "单张今日" : "Single card"}
                        </button>
                        <button
                          type="button"
                          data-tarot-spread="3"
                          onClick={() => setSpreadSize(3)}
                          className={`text-xs px-3 py-1 rounded-full border ${spreadSize === 3 ? "border-[#d4a843] text-[#d4a843] bg-[#d4a843]/10" : "border-white/10 text-muted-foreground"}`}
                        >
                          {language === "zh" ? "三牌阵" : "3-card"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center mb-3">
                        {questionTemplates(selectedType, language === "zh" ? "zh" : "en").map((tpl) => (
                          <button
                            key={tpl}
                            type="button"
                            data-tarot-template="1"
                            onClick={() => setQuestion(tpl)}
                            className="text-[11px] px-2.5 py-1 rounded-full border border-[#d4a843]/25 text-muted-foreground hover:text-[#d4a843] hover:border-[#d4a843]/50 max-w-[14rem] truncate"
                          >
                            {tpl}
                          </button>
                        ))}
                      </div>
<label className="text-sm text-muted-foreground block">
                        {language === "zh" ? "想问具体问题？（可选）" : "Have a specific question? (optional)"}
                      </label>
                      <div className="relative">
                        <Textarea
                          placeholder={getQuestionPlaceholder()}
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          className="min-h-[80px] bg-input/50 pr-12"
                        />
                        <div className="absolute right-2 bottom-2">
                          <VoiceInput
                            onTranscript={(text: string) => setQuestion(prev => prev + text)}
                            className="text-muted-foreground hover:text-cyan-400"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        onClick={() => setStage("select")}
                        className="text-muted-foreground"
                      >
                        {language === "zh" ? "返回选择类型" : "Back to selection"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Stage 3: Drawing - ritual selection table */}
            {stage === "drawing" && (
              <motion.div
                key="drawing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8 tarot-altar"
                data-tarot-phase={drawingPhaseAttr(drawingPhase)}
                data-tarot-altar="1"
              >
                {/* T01: shuffle entrance — skippable; not pickable until ready */}
                {isShufflePhase(drawingPhase) && (
                  <div className="space-y-6 text-center py-6">
                    <p className="text-lg font-display text-[#d4a843]/90">
                      {language === "zh" ? "正在洗牌…" : "Shuffling the deck…"}
                    </p>
                    <div className="relative mx-auto h-40 w-full max-w-xs flex items-center justify-center">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute w-14 h-20 md:w-16 md:h-24 rounded-lg bg-gradient-to-br from-[#24183f] via-[#1a1030] to-[#0c0818] border border-[#d4a843]/40 shadow-lg"
                          style={{ zIndex: i }}
                          animate={{
                            x: [0, (i - 2.5) * 10, (i - 2.5) * -8, 0],
                            y: [0, i % 2 === 0 ? -12 : 10, i % 2 === 0 ? 8 : -10, 0],
                            rotate: [0, (i - 2.5) * 6, (i - 2.5) * -5, 0],
                          }}
                          transition={{
                            duration: 0.55,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.04,
                          }}
                        >
                          <div className="absolute inset-[3px] rounded-md border border-[#d4a843]/15 flex items-center justify-center">
                            <Moon className="w-5 h-5 text-[#d4a843]/7" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={skipShuffle}
                      className="text-muted-foreground text-xs"
                      data-tarot-action="skip-shuffle"
                    >
                      {language === "zh" ? "跳过" : "Skip"}
                    </Button>
                  </div>
                )}

                {/* Progress + altar slots — only when ready to pick (or after cards drawn) */}
                {isReadyToPick(drawingPhase) && (
                <div className="text-center space-y-5">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4a843]/25 bg-[#d4a843]/5">
                    {Array.from({ length: spreadSize }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full transition-all ${
                          drawnCards.length > i
                            ? "bg-[#d4a843] shadow-[0_0_8px_rgba(212,168,67,0.7)]"
                            : "bg-white/15"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-[#d4a843]/90 tracking-wide ml-1">
                      {drawnCards.length}/{spreadSize}
                    </span>
                  </div>
                  <p className="text-lg md:text-xl font-display font-medium">
                    {drawnCards.length < spreadSize ? (
                      language === "zh" ? (
                        <>请选择第 <span className="text-[#d4a843] font-bold">{drawnCards.length + 1}</span> 张牌</>
                      ) : (
                        <>Select card <span className="text-[#d4a843] font-bold">{drawnCards.length + 1}</span></>
                      )
                    ) : (
                      <span className="text-[#d4a843]">
                        {language === "zh" ? "抽牌完成 · 静待启示" : "Spread complete · await insight"}
                      </span>
                    )}
                  </p>
                  <div className="flex justify-center gap-4 md:gap-8 mb-4">
                    {Array.from({ length: spreadSize }).map((_, slotIndex) => {
                      const card = drawnCards[slotIndex];
                      const isFlipped = flippedCards.includes(slotIndex);
                      const isReversed = cardReversals[slotIndex] ?? false;
                      const isNext =
                        !card &&
                        nextSlotIndex(drawnCards.length) === slotIndex;
                      const filled = slotFilledAttr(!!card);
                      const el = card ? elementForCardName(card.name) : "unknown";
                      const elBorder = card
                        ? elementBorderClass(el)
                        : "border-[#d4a843]/20";

                      return (
                        <div
                          key={slotIndex}
                          className="text-center"
                          data-tarot-slot={slotIndex}
                          data-filled={filled}
                          data-tarot-element={card ? elementDataAttr(el) : undefined}
                        >
                          {card ? (
                            /* T02: layoutId flies from deck pick (only this card) */
                            <motion.div
                              layoutId={cardFlyLayoutId(card.id)}
                              className="relative w-24 h-36 md:w-32 md:h-48"
                              transition={flyTransition(reduceMotion)}
                              style={{ transformStyle: "preserve-3d" }}
                            >
                              <motion.div
                                className="absolute inset-0"
                                initial={false}
                                animate={{
                                  rotateY: isFlipped ? 0 : 180,
                                }}
                                transition={
                                  reduceMotion
                                    ? { duration: 0.2 }
                                    : { duration: 0.7, type: "spring", stiffness: 120 }
                                }
                                style={{ transformStyle: "preserve-3d" }}
                              >
                                <div
                                  className={`absolute inset-0 rounded-xl border-2 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1030] via-[#2a1850] to-[#0d0820] ${elBorder}`}
                                  style={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                  }}
                                >
                                  <div className="absolute inset-1 rounded-lg border border-white/10 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(212,168,67,0.12),transparent_55%)]">
                                    <Moon className="w-9 h-9 text-[#d4a843]/80" />
                                  </div>
                                </div>
                                <div
                                  className={`absolute inset-0 rounded-xl bg-gradient-to-b from-[#1e1635] to-[#120c22] border-2 flex flex-col items-center justify-center p-3 ${elBorder}`}
                                  style={{
                                    backfaceVisibility: "hidden",
                                    transform: isReversed && isFlipped ? "rotate(180deg)" : undefined,
                                  }}
                                  data-tarot-orientation={isReversed ? "reversed" : "upright"}
                                >
                                  {isReversed && isFlipped && (
                                    <span className="absolute top-1 text-[8px] px-1 py-0.5 rounded bg-rose-500/25 text-rose-200 border border-rose-400/40 z-10" style={{ transform: "rotate(180deg)" }}>
                                      {language === "zh" ? "逆位" : "Rev"}
                                    </span>
                                  )}
                                  <div className="w-8 h-8 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/30 flex items-center justify-center mb-2">
                                    <Sparkles className="w-4 h-4 text-[#d4a843]" />
                                  </div>
                                  <div className="text-sm md:text-base font-display font-bold text-[#f0e6c8]">
                                    {card.name}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground/90 text-center mt-1.5 line-clamp-2 leading-relaxed">
                                    {card.meaning}
                                  </div>
                                  {/* T07: 2–3 keyword chips from tarot-database */}
                                  {isFlipped && (
                                    <div
                                      className="mt-2 flex flex-wrap justify-center gap-1 max-w-full px-0.5"
                                      data-tarot-keywords="1"
                                    >
                                      {keywordsForCardName(
                                        card.name,
                                        language === "zh" ? "zh" : "en",
                                        3
                                      ).map((kw) => (
                                        <span
                                          key={kw}
                                          className="text-[9px] leading-tight px-1.5 py-0.5 rounded-full border border-[#d4a843]/35 bg-[#d4a843]/10 text-[#f0e6c8]/90"
                                        >
                                          {kw}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                              {/* T03: gold flip flash — ≤400ms, ≤8 particles, no full-screen */}
                              {flipFlashSlot === slotIndex && (
                                <motion.div
                                  className="pointer-events-none absolute inset-0 z-20 rounded-xl overflow-visible"
                                  data-tarot-flip={flipFlashAttr(true)}
                                  initial={{
                                    opacity: 1,
                                    boxShadow:
                                      "0 0 0 0 rgba(212,168,67,0.85), 0 0 24px 4px rgba(212,168,67,0.55)",
                                  }}
                                  animate={{
                                    opacity: 0,
                                    boxShadow:
                                      "0 0 28px 12px rgba(212,168,67,0), 0 0 0 0 rgba(212,168,67,0)",
                                  }}
                                  transition={{
                                    duration: reduceMotion ? 0.15 : FLIP_FLASH_MS / 1000,
                                    ease: "easeOut",
                                  }}
                                >
                                  <div className="absolute inset-0 rounded-xl ring-2 ring-[#d4a843]/80" />
                                  {!reduceMotion &&
                                    Array.from({ length: FLIP_PARTICLE_COUNT }).map((_, i) => {
                                      const { x, y } = flipParticleOffset(i);
                                      return (
                                        <motion.span
                                          key={i}
                                          className="absolute left-1/2 top-1/2 h-1 w-1 -ml-0.5 -mt-0.5 rounded-full bg-[#f0e6c8] shadow-[0_0_6px_#d4a843]"
                                          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                          animate={{ opacity: 0, x, y, scale: 0.4 }}
                                          transition={{
                                            duration: FLIP_FLASH_MS / 1000,
                                            ease: "easeOut",
                                          }}
                                        />
                                      );
                                    })}
                                </motion.div>
                              )}
                            </motion.div>
                          ) : (
                            <div
                              className={`relative w-24 h-36 md:w-32 md:h-48 rounded-xl border border-dashed border-[#d4a843]/20 bg-[rgba(26,16,48,0.45)] flex items-center justify-center ${
                                isNext
                                  ? "ring-2 ring-[#d4a843]/40 shadow-[0_0_24px_rgba(212,168,67,0.15)]"
                                  : ""
                              }`}
                            >
                              <span className="text-[#d4a843]/35 text-xs tracking-widest uppercase">
                                {positionLabels[slotIndex]}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-[#d4a843]/70 mt-2.5 tracking-wide">
                            {positionLabels[slotIndex]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* Deck fan — only after shuffle ready */}
                {isReadyToPick(drawingPhase) && drawnCards.length < spreadSize && (
                  <div className="space-y-4 rounded-2xl border border-[#d4a843]/10 bg-black/20 px-3 py-6 md:px-6">
                    <p className="text-center text-sm text-muted-foreground">
                      <Hand className="w-4 h-4 inline mr-1 text-[#d4a843]/70" />
                      {language === "zh" ? "凭直觉点选一张牌背" : "Choose a card by intuition"}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-2.5 max-w-3xl mx-auto">
                      {shuffledDeck.map((card, index) => {
                        const isDrawn = drawnCardIds.includes(card.id);
                        // T02: only undrawn cards keep layoutId so the pick flies to the slot
                        if (isDrawn) {
                          return (
                            <div
                              key={card.id}
                              className="relative w-11 h-[4.25rem] md:w-14 md:h-20 rounded-lg opacity-20 border border-[#d4a843]/10 bg-black/20"
                              aria-hidden
                            />
                          );
                        }
                        return (
                          <motion.button
                            key={card.id}
                            type="button"
                            layoutId={cardFlyLayoutId(card.id)}
                            onClick={() => handleDrawCard(index)}
                            disabled={!isReadyToPick(drawingPhase)}
                            aria-label={language === "zh" ? "抽牌" : "Draw card"}
                            className="relative w-11 h-[4.25rem] md:w-14 md:h-20 rounded-lg cursor-pointer hover:shadow-[0_0_18px_rgba(212,168,67,0.35)]"
                            whileHover={{ scale: 1.12, y: -10 }}
                            whileTap={{ scale: 0.96 }}
                            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={flyTransition(reduceMotion)}
                          >
                            <TarotCardFace variant="back" />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Start reading — after 3 cards */}
                {isReadyToPick(drawingPhase) && drawnCards.length === spreadSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center gap-3"
                  >
                    {isAwaitReading(drawingPhase) && (
                      <p className="text-sm text-[#d4a843]/80 font-display tracking-wide">
                        {language === "zh"
                          ? "抽牌完成 · 静待启示"
                          : "Spread complete · await insight"}
                      </p>
                    )}
                    <Button
                      size="lg"
                      onClick={handleStartReading}
                      data-tarot-action="start-reading"
                      data-tarot-cta-pulse={awaitCtaPulse ? "1" : "0"}
                      className={`bg-gradient-to-r from-[#d4a843] to-[#b8922e] hover:from-[#e0b84f] hover:to-[#c49a38] text-[#1a1030] font-semibold px-10 py-6 text-lg rounded-xl transition-all ${
                        awaitCtaPulse
                          ? "scale-105 ring-2 ring-[#f0e6c8]/70 shadow-[0_0_36px_rgba(212,168,67,0.55)]"
                          : "shadow-[0_8px_28px_rgba(212,168,67,0.35)]"
                      }`}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      {language === "zh" ? "开始解读" : "Start Reading"}
                    </Button>
                  </motion.div>
                )}

                {/* 返回按钮 */}
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="text-muted-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {language === "zh" ? "重新开始" : "Start Over"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Stage 4: Result */}
            {stage === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Structured Report or Loading */}
                <div data-tarot-result-section="main">
                {reading && !tarotMutation.isPending && (
                  <blockquote
                    data-tarot-pullquote="1"
                    className="text-center text-xl md:text-2xl font-display text-[#f0e6c8] leading-snug px-4 py-5 rounded-2xl border border-[#d4a843]/30 bg-[#d4a843]/5 shadow-[0_0_24px_rgba(212,168,67,0.12)]"
                  >
                    {extractPullQuote(reading, 140)}
                  </blockquote>
                )}
                {tarotMutation.isPending ? (
                  <LoadingRitual type="tarot" isLoading={true} />
                ) : structuredCards.length > 0 && spreadData ? (
                  <TarotReport
                    cards={structuredCards}
                    spread={spreadData}
                    reading={reading}
                    isPaid={premiumStatus.showFullReport}
                    onUnlock={() => setShowUsageModal(true)}
                    questionType={selectedType}
                    question={question}
                  />
                ) : tarotMutation.isError ? (
                  <div className="text-center py-8 text-destructive">
                    {language === "zh" ? "解读生成失败，请重试" : "Failed to generate reading, please try again"}
                  </div>
                ) : null}

                {/* Premium upsell banner */}
                {reading && !premiumStatus.showFullReport && (
                  <PaywallCTA featureType="tarot" variant="banner" />
                )}
                {/* Deeper Insights comparison card */}
                {reading && !premiumStatus.showFullReport && (
                  <DeeperInsightsCard featureType="tarot" className="mt-6" />
                )}
                {/* Soft paywall - blurred deep analysis preview */}
                {reading && !premiumStatus.showFullReport && (
                  <SoftPaywall featureType="tarot" />
                )}
                {reading && (
                  <div
                    className="mt-4 rounded-xl border border-[#d4a843]/25 bg-[rgba(212,168,67,0.08)] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    data-tarot-result-upgrade
                  >
                    <p className="text-sm text-muted-foreground">
                      {language === "zh"
                        ? "这次读完了？注册领 14 天无限，或继续用免费额度。"
                        : "Done with this reading? Claim 14 free unlimited days, or stay on free limits."}
                    </p>
                    <div className="flex gap-2 shrink-0">
                      <Button asChild size="sm" className="bg-[#d4a843] text-[#0d0f1a] hover:bg-[#c09030]">
                        <a href="/membership">{language === "zh" ? "了解试用/会员" : "Trial / plans"}</a>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="border-white/15">
                        <a href="/login">{language === "zh" ? "注册" : "Sign up"}</a>
                      </Button>
                    </div>
                  </div>
                )}
                </div>

                {/* TTS for reading */}
                {reading && (
                  <div className="flex justify-center">
                    <TextToSpeech
                      text={extractPullQuote(reading, 200) || reading}
                      size="md"
                      showLabel
                      className="text-cyan-400 hover:text-cyan-300"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center" data-tarot-result-section="actions">
                  <Button
                    onClick={handleAgain}
                    data-tarot-action="again"
                    className="gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold shadow-lg"
                    size="lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {language === "zh" ? "再抽一次" : "Draw again"}
                  </Button>
                  <Button
                    onClick={handleRetype}
                    data-tarot-action="retype"
                    variant="outline"
                    className="gap-2 border-[#d4a843]/40 text-[#d4a843]"
                    size="lg"
                  >
                    {language === "zh" ? "换题型" : "Change topic"}
                  </Button>
                  {reading && (
                    <ShareResultCard
                      type="tarot"
                      title={
                        language === "zh"
                          ? selectedType === "career"
                            ? "事业塔罗 · 洞察"
                            : "塔罗占卜结果"
                          : selectedType === "career"
                            ? "Career Tarot Insight"
                            : "Tarot Reading"
                      }
                      subtitle={question || undefined}
                      // Prefer scannable pull-quote for share cards (F1-2)
                      summary={
                        extractPullQuote(reading, 160) ||
                        reading.replace(/[#*_`>\-]/g, "").slice(0, 300)
                      }
                      details={structuredCards.map(c => language === "zh" ? c.nameChinese : c.name)}
                      extraInfo={{
                        [language === "zh" ? "牌阵" : "Spread"]: spreadData ? (language === "zh" ? spreadData.nameChinese : spreadData.name) : "",
                        [language === "zh" ? "类型" : "Type"]: selectedType
                          ? (language === "zh"
                            ? ({ love: "爱情", career: "事业", wealth: "财运", general: "综合" } as Record<string, string>)[selectedType] || selectedType
                            : selectedType)
                          : "",
                      }}
                      ogData={{
                        cards: structuredCards.map(c => language === "zh" ? c.nameChinese : c.name).join(","),
                        positions: structuredCards.map(c => c.isReversed ? "reversed" : "upright").join(","),
                        spread: spreadData ? (language === "zh" ? spreadData.nameChinese : spreadData.name) : undefined,
                      }}
                    />
                  )}
                  {!isAuthenticated && reading && (
                    <div className="w-full max-w-md mx-auto mt-2">
                      <div className="rounded-2xl border border-cosmic-gold/30 bg-gradient-to-br from-cosmic-gold/10 to-transparent p-5 text-center space-y-3">
                        <Sparkles className="w-6 h-6 text-cosmic-gold mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          {language === "zh"
                            ? "注册免费账号，保存你的占卜报告，随时回顾"
                            : "Sign up free to save your reading and revisit anytime"}
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
                {reading && (
                  <details className="mt-8 group" data-tarot-cross-sell="1">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-[#d4a843] list-none flex items-center justify-center gap-2 py-2">
                      {language === "zh" ? "探索更多功能" : "Explore more features"}
                    </summary>
                    <CrossSellCard currentFeature="tarot" className="mt-3" />
                  </details>
                )}

                {/* 用户反馈模块 */}
                {reading && (
                  <FeedbackWidget
                    sourceType="tarot"
                    sessionId={sessionId}
                    className="mt-4"
                  />
                )}
              </motion.div>
            )}

        </div>
      </main>

      {/* T00: low-key sound control — footer zone, left */}
      <div className="border-t border-white/[0.04] bg-black/20">
        <div className="container max-w-4xl py-2 flex items-center justify-start">
          <button
            type="button"
            onClick={toggleSfx}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors ${
              sfxOn
                ? "text-[#d4a843]/70 hover:text-[#d4a843]"
                : "text-muted-foreground/50 hover:text-muted-foreground"
            }`}
            data-tarot-ambient={ambientDataAttr(DEFAULT_AMBIENT_ON)}
            data-tarot-sfx={sfxDataAttr(sfxOn)}
            aria-pressed={sfxOn}
            aria-label={
              language === "zh"
                ? sfxOn
                  ? "声音：开"
                  : "声音：关"
                : sfxOn
                  ? "Sound: on"
                  : "Sound: off"
            }
            title={
              language === "zh"
                ? sfxOn
                  ? "关闭抽牌/翻牌音效"
                  : "开启抽牌/翻牌音效"
                : sfxOn
                  ? "Mute draw/reveal sounds"
                  : "Enable draw/reveal sounds"
            }
          >
            {sfxOn ? (
              <Volume2 className="w-3.5 h-3.5 opacity-80" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 opacity-80" />
            )}
            <span className="opacity-80">{language === "zh" ? "声音" : "Sound"}</span>
          </button>
        </div>
      </div>

      <Footer />

      <UsageLimitModal
        open={showUsageModal}
        onOpenChange={setShowUsageModal}
        featureType="tarot"
        featureName="塔罗占卜"
        featureNameEn="Tarot Reading"
      />
    </div>
  );
}
