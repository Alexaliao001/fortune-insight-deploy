import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { longWaitHint } from "@/lib/loadingWaitHint";

interface LoadingRitualProps {
  type: "tarot" | "bazi" | "dream" | "horoscope" | "compatibility";
  isLoading: boolean;
}

export { longWaitHint } from "@/lib/loadingWaitHint";

// Inline SVG symbol components (replace Unicode text chars for cross-platform consistency)
const SvgSymbols = {
  // Four-pointed star
  star4: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
    </svg>
  ),
  // Crescent moon
  crescent: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8C13.06 3.04 12.54 3 12 3z" />
    </svg>
  ),
  // Five-pointed star
  star5: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  ),
  // Yin-yang
  yinyang: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8a8 8 0 018-8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4 1.79-4 4 1.79 4 4 4a8 8 0 010 0z" />
      <circle cx="12" cy="8" r="1.5" />
      <circle cx="12" cy="16" r="1.5" fill="rgba(255,255,255,0.3)" />
    </svg>
  ),
  // Diamond
  diamond: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2L22 12L12 22L2 12z" />
    </svg>
  ),
  // Small sparkle (6-pointed)
  sparkle: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1l1.5 6.5L20 9l-6.5 1.5L12 17l-1.5-6.5L4 9l6.5-1.5zM12 17l1 4.5L14 17l4.5 1-4.5 1 1 4.5-1-4.5L9.5 19l4.5-1z" opacity="0.7" />
    </svg>
  ),
  // Triangle up
  triangle: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 4L22 20H2z" />
    </svg>
  ),
  // Waves
  waves: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity="0.5" />
    </svg>
  ),
  // Sun/circle
  sun: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  // Heart outline
  heart: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  // Infinity
  infinity: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
    </svg>
  ),
  // Circle
  circle: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
    </svg>
  ),
};

// Symbol sets per feature type (using SVG components instead of Unicode)
type SymbolKey = keyof typeof SvgSymbols;
const symbolSets: Record<string, SymbolKey[]> = {
  tarot: ["star4", "crescent", "sparkle", "star5", "diamond", "star4"],
  bazi: ["yinyang", "diamond", "triangle", "waves", "star5", "star4"],
  dream: ["crescent", "diamond", "sun", "waves", "star5", "star4"],
  horoscope: ["star5", "circle", "sparkle", "star4", "waves", "diamond"],
  compatibility: ["heart", "crescent", "diamond", "infinity", "waves", "star4"],
};

const ritualSteps = {
  tarot: {
    zh: [
      "正在连接宇宙能量场...",
      "塔罗牌正在感应您的问题...",
      "解读牌面的神秘符号...",
      "分析牌阵中的能量流动...",
      "整合过去、现在与未来的信息...",
      "生成您的专属解读报告...",
    ],
    en: [
      "Connecting to cosmic energy field...",
      "Cards are sensing your question...",
      "Decoding mystical card symbols...",
      "Analyzing energy flow in the spread...",
      "Integrating past, present & future insights...",
      "Generating your personalized reading...",
    ],
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    glowColor: "rgba(139, 92, 246, 0.3)",
    ringColor: "rgba(139, 92, 246, 0.4)",
  },
  bazi: {
    zh: [
      "正在推算天干地支...",
      "排列四柱八字命盘...",
      "分析五行生克关系...",
      "计算十神与大运流年...",
      "解读命局格局与用神...",
      "生成您的命理报告...",
    ],
    en: [
      "Calculating Heavenly Stems & Earthly Branches...",
      "Arranging Four Pillars of Destiny...",
      "Analyzing Five Elements interactions...",
      "Computing Ten Gods & Fortune Cycles...",
      "Interpreting destiny patterns & favorable elements...",
      "Generating your destiny report...",
    ],
    gradient: "from-amber-500 via-orange-500 to-red-500",
    glowColor: "rgba(245, 158, 11, 0.3)",
    ringColor: "rgba(245, 158, 11, 0.4)",
  },
  dream: {
    zh: [
      "正在进入潜意识空间...",
      "捕捉梦境中的关键意象...",
      "分析梦境符号与原型...",
      "连接荣格集体无意识数据库...",
      "解读梦境的深层含义...",
      "生成您的解梦报告...",
    ],
    en: [
      "Entering the subconscious realm...",
      "Capturing key dream imagery...",
      "Analyzing dream symbols & archetypes...",
      "Connecting to Jungian collective unconscious...",
      "Interpreting deeper dream meanings...",
      "Generating your dream analysis...",
    ],
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.3)",
    ringColor: "rgba(168, 85, 247, 0.4)",
  },
  horoscope: {
    zh: [
      "正在观测今日星象...",
      "分析行星相位与角度...",
      "计算星座能量场变化...",
      "解读宫位与行星互动...",
      "整合运势趋势与建议...",
      "生成您的运势报告...",
    ],
    en: [
      "Observing today's celestial positions...",
      "Analyzing planetary aspects & angles...",
      "Calculating zodiac energy field shifts...",
      "Interpreting house & planet interactions...",
      "Integrating fortune trends & guidance...",
      "Generating your horoscope report...",
    ],
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    glowColor: "rgba(6, 182, 212, 0.3)",
    ringColor: "rgba(6, 182, 212, 0.4)",
  },
  compatibility: {
    zh: [
      "正在分析双方星盘数据...",
      "计算行星相位互动关系...",
      "评估情感共鸣与化学反应...",
      "分析沟通模式与价值观匹配...",
      "解读长期关系发展潜力...",
      "生成您的合盘分析报告...",
    ],
    en: [
      "Analyzing both natal charts...",
      "Calculating planetary aspect interactions...",
      "Evaluating emotional resonance & chemistry...",
      "Analyzing communication & value alignment...",
      "Interpreting long-term relationship potential...",
      "Generating your compatibility report...",
    ],
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    glowColor: "rgba(244, 63, 94, 0.3)",
    ringColor: "rgba(244, 63, 94, 0.4)",
  },
};

// CSS keyframes injected once
const styleId = "loading-ritual-styles";
function ensureStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(styleId)) return;
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @keyframes lr-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes lr-pulse-glow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.3); opacity: 0.6; } }
    @keyframes lr-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes lr-spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
    @keyframes lr-breathe { 0%, 100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.2); opacity: 0.4; } }
    @keyframes lr-symbol-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes lr-text-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes lr-dot-active { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.4); } }
    @keyframes lr-particle {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      40% { opacity: 0.8; }
      100% { opacity: 0; }
    }
    @keyframes lr-progress-shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    @keyframes lr-symbol-enter {
      from { opacity: 0; transform: scale(0.5) rotate(-30deg); }
      to { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes lr-reassurance-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes lr-ring-dash {
      0% { stroke-dashoffset: 283; }
      100% { stroke-dashoffset: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .lr-no-motion { animation: none !important; }
    }
  `;
  document.head.appendChild(style);
}

export default function LoadingRitual({ type, isLoading }: LoadingRitualProps) {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [symbolKey, setSymbolKey] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const steps = ritualSteps[type];
  const messages = language === "zh" ? steps.zh : steps.en;
  const totalSteps = messages.length;
  const symbols = symbolSets[type] || symbolSets.tarot;
  const isZh = language === "zh";

  // Inject CSS keyframes
  useEffect(() => { ensureStyles(); }, []);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setProgress(0);
      setVisible(false);
      setSymbolKey(0);
      setElapsedSec(0);
      return;
    }

    setVisible(true);
    startTimeRef.current = Date.now();

    // BaZi/Dream: slower step cadence for ~60–90s jobs (F2-2)
    const stepMs = type === "bazi" || type === "dream" ? 4500 : 2000;
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < totalSteps - 1) {
          setSymbolKey((k) => k + 1);
          return prev + 1;
        }
        return prev;
      });
    }, stepMs);

    // Smooth progress: slower asymptote for long jobs
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setElapsedSec(Math.floor(elapsed));
        // log curve; bazi stretched so bar doesn't freeze at 95% too early
        const scale = type === "bazi" || type === "dream" ? 22 : 30;
        const target = Math.min(95, scale * Math.log(elapsed + 1));
        return prev + (target - prev) * 0.1;
      });
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading, totalSteps, type]);

  if (!isLoading || !visible) return null;

  const progressPercent = Math.round(progress);
  const waitHint = longWaitHint(type, elapsedSec, isZh);

  // Particle positions (8 particles in a circle)
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 8;
    const x = Math.cos(angle) * 55;
    const y = Math.sin(angle) * 55;
    return { x, y, delay: i * 0.3 };
  });

  // Current symbol SVG
  const currentSymbol = SvgSymbols[symbols[currentStep] || "star4"];

  return (
    <div
      className="flex flex-col items-center justify-center py-12 md:py-16 space-y-6 md:space-y-8"
      style={{ animation: "lr-fade-in 0.5s ease-out forwards" }}
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-loading-ritual={type}
    >
      {/* Mystical orb with enhanced glow */}
      <div className="relative w-28 h-28 md:w-32 md:h-32">
        {/* Outer pulsing glow */}
        <div
          className="absolute -inset-4 rounded-full lr-no-motion"
          style={{
            background: `radial-gradient(circle, ${steps.glowColor}, transparent 70%)`,
            animation: "lr-pulse-glow 3s ease-in-out infinite",
          }}
        />

        {/* SVG progress ring */}
        <svg
          className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)]"
          viewBox="0 0 100 100"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background ring */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(212,168,67,0.1)"
            strokeWidth="2"
          />
          {/* Progress ring */}
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={steps.ringColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * progress) / 100}
            style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
          />
        </svg>

        {/* Outer ring - spinning */}
        <div
          className="absolute inset-0 rounded-full border-2 border-[rgba(212,168,67,0.3)] lr-no-motion"
          style={{ animation: "lr-spin 8s linear infinite" }}
        />
        {/* Middle ring - reverse spin */}
        <div
          className="absolute inset-3 rounded-full border border-[rgba(212,168,67,0.2)] lr-no-motion"
          style={{ animation: "lr-spin-reverse 12s linear infinite" }}
        />
        {/* Inner gradient glow */}
        <div
          className={`absolute inset-6 rounded-full bg-gradient-to-br ${steps.gradient} opacity-30 lr-no-motion`}
          style={{ animation: "lr-breathe 2s ease-in-out infinite" }}
        />
        {/* Center symbol (SVG) */}
        <div
          className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl text-[rgba(212,168,67,0.9)] lr-no-motion"
          style={{ animation: "lr-symbol-pulse 1.5s ease-in-out infinite" }}
        >
          <span
            key={symbolKey}
            className="lr-no-motion"
            style={{ animation: "lr-symbol-enter 0.4s ease-out forwards" }}
          >
            {currentSymbol}
          </span>
        </div>

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[rgba(212,168,67,0.5)] lr-no-motion"
            style={{
              left: "50%",
              top: "50%",
              animation: `lr-particle 2.5s ease-in-out ${p.delay}s infinite`,
              transform: `translate(-50%, -50%)`,
              // Use CSS custom properties for particle direction
              ["--lr-px" as string]: `${p.x}px`,
              ["--lr-py" as string]: `${p.y}px`,
            }}
          />
        ))}
      </div>

      {/* Step message with percentage */}
      <div className="text-center space-y-2 max-w-sm px-4">
        <p
          key={`msg-${currentStep}`}
          className="text-foreground/90 font-medium text-sm md:text-base lr-no-motion"
          style={{ animation: "lr-text-in 0.4s ease-out forwards" }}
        >
          {messages[currentStep]}
        </p>
        <p className="text-muted-foreground text-xs">
          {language === "zh" ? `分析进度 ${progressPercent}%` : `Analysis progress ${progressPercent}%`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 md:w-80">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${steps.gradient} relative overflow-hidden`}
            style={{
              width: `${progress}%`,
              transition: "width 0.3s ease-out",
            }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 w-full h-full lr-no-motion"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "lr-progress-shimmer 1.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex gap-1.5 md:gap-2">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-500 ${
              i <= currentStep
                ? "bg-[#d4a843]"
                : "bg-[rgba(212,168,67,0.15)]"
            } lr-no-motion`}
            style={i === currentStep ? { animation: "lr-dot-active 1s ease-in-out infinite" } : undefined}
          />
        ))}
      </div>

      {/* Time-aware reassurance (F2-2) — BaZi/Dream show 30–90s expectation */}
      <div className="text-center max-w-sm px-4 space-y-1">
        <p
          key={`hint-${Math.floor(elapsedSec / 15)}`}
          className="text-muted-foreground/80 text-xs leading-relaxed lr-no-motion"
          style={{ animation: "lr-reassurance-in 0.4s ease-out both" }}
        >
          {waitHint}
        </p>
        {elapsedSec >= 3 && (
          <p className="text-[11px] text-[#d4a843]/70 tabular-nums">
            {isZh ? `已用时 ${elapsedSec}s` : `Elapsed ${elapsedSec}s`}
          </p>
        )}
      </div>
    </div>
  );
}
