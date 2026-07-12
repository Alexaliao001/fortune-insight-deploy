import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Share2, X, Sparkles, Moon, Sun, Eye, Copy, Check, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type ShareCardType = "tarot" | "bazi" | "horoscope" | "dream" | "compatibility";

/** Personalized data for OG image rendering */
interface OgPersonalizedData {
  // Tarot
  cards?: string;       // comma-separated card names
  positions?: string;   // comma-separated (upright/reversed)
  spread?: string;
  // Horoscope
  sign?: string;
  overall?: string;
  love?: string;
  career?: string;
  wealth?: string;
  luckyColor?: string;
  luckyNumber?: string;
  // BaZi
  birth?: string;
  gender?: string;
  // Dream
  dreamTitle?: string;
  emotions?: string;    // comma-separated
  elements?: string;    // comma-separated
  dreamType?: string;
  clarity?: string;
  // Compatibility
  sign1?: string;
  sign2?: string;
  name1?: string;
  name2?: string;
  matchScore?: string;
}

interface ShareResultCardProps {
  type: ShareCardType;
  title: string;
  subtitle?: string;
  summary: string;
  details?: string[];
  icon?: React.ReactNode;
  accentColor?: string;
  extraInfo?: Record<string, string>;
  /** Personalized data passed to OG image endpoint */
  ogData?: OgPersonalizedData;
}

const cardThemes: Record<ShareCardType, {
  gradient: string;
  accentGradient: string;
  borderColor: string;
  iconBg: string;
  pattern: string;
  symbolSvg: React.ReactNode;
  glowColor: string;
  starColor: string;
}> = {
  tarot: {
    gradient: "linear-gradient(145deg, #0c0520 0%, #1a0a3e 25%, #2d1569 50%, #1a0a3e 75%, #0c0520 100%)",
    accentGradient: "linear-gradient(135deg, #c8a45a, #f0d878, #c8a45a)",
    borderColor: "#c8a45a",
    iconBg: "rgba(200, 164, 90, 0.15)",
    pattern: "radial-gradient(ellipse at 20% 80%, rgba(200, 164, 90, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
    symbolSvg: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" /></svg>,
    glowColor: "rgba(200, 164, 90, 0.3)",
    starColor: "rgba(200, 164, 90, 0.6)",
  },
  bazi: {
    gradient: "linear-gradient(145deg, #0a0800 0%, #1a1005 25%, #2a1a0a 50%, #1a1005 75%, #0a0800 100%)",
    accentGradient: "linear-gradient(135deg, #d4a853, #f5d98a, #d4a853)",
    borderColor: "#d4a853",
    iconBg: "rgba(212, 168, 83, 0.15)",
    pattern: "radial-gradient(ellipse at 30% 70%, rgba(212, 168, 83, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(234, 88, 12, 0.08) 0%, transparent 50%)",
    symbolSvg: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8a8 8 0 018-8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4 1.79-4 4 1.79 4 4 4z" /><circle cx="12" cy="8" r="1.5" /><circle cx="12" cy="16" r="1.5" fill="rgba(255,255,255,0.3)" /></svg>,
    glowColor: "rgba(212, 168, 83, 0.3)",
    starColor: "rgba(212, 168, 83, 0.6)",
  },
  horoscope: {
    gradient: "linear-gradient(145deg, #050a18 0%, #0a1a38 25%, #0f2a58 50%, #0a1a38 75%, #050a18 100%)",
    accentGradient: "linear-gradient(135deg, #60a5fa, #93c5fd, #60a5fa)",
    borderColor: "#60a5fa",
    iconBg: "rgba(96, 165, 250, 0.15)",
    pattern: "radial-gradient(ellipse at 25% 75%, rgba(96, 165, 250, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 75% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)",
    symbolSvg: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" /></svg>,
    glowColor: "rgba(96, 165, 250, 0.3)",
    starColor: "rgba(96, 165, 250, 0.6)",
  },
  dream: {
    gradient: "linear-gradient(145deg, #020d0d 0%, #0a2a2a 25%, #0f4040 50%, #0a2a2a 75%, #020d0d 100%)",
    accentGradient: "linear-gradient(135deg, #2dd4bf, #5eead4, #2dd4bf)",
    borderColor: "#2dd4bf",
    iconBg: "rgba(45, 212, 191, 0.15)",
    pattern: "radial-gradient(ellipse at 20% 80%, rgba(45, 212, 191, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)",
    symbolSvg: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8C13.06 3.04 12.54 3 12 3z" /></svg>,
    glowColor: "rgba(45, 212, 191, 0.3)",
    starColor: "rgba(45, 212, 191, 0.6)",
  },
  compatibility: {
    gradient: "linear-gradient(145deg, #0d0515 0%, #1a0a30 25%, #2a1050 50%, #1a0a30 75%, #0d0515 100%)",
    accentGradient: "linear-gradient(135deg, #f472b6, #fb7185, #f472b6)",
    borderColor: "#f472b6",
    iconBg: "rgba(244, 114, 182, 0.15)",
    pattern: "radial-gradient(ellipse at 30% 70%, rgba(244, 114, 182, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(251, 113, 133, 0.08) 0%, transparent 50%)",
    symbolSvg: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
    glowColor: "rgba(244, 114, 182, 0.3)",
    starColor: "rgba(244, 114, 182, 0.6)",
  },
};

const typeIcons: Record<ShareCardType, React.ReactNode> = {
  tarot: <Sparkles className="w-5 h-5" />,
  bazi: <Sun className="w-5 h-5" />,
  horoscope: <Moon className="w-5 h-5" />,
  dream: <Eye className="w-5 h-5" />,
  compatibility: <Heart className="w-5 h-5" />,
};

// Social share platform SVG icons (inline to avoid dependencies)
function WhatsAppIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function XTwitterIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WeChatIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.18 2.768c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
    </svg>
  );
}

function WeiboIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.583.631.275.825.985.442 1.574zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.642 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.581-.178-.402-.642.389-1.012.429-1.887.008-2.512-.788-1.177-2.944-1.116-5.417-.031 0 0-.776.34-.578-.276.381-1.206.324-2.215-.27-2.798-1.348-1.323-4.935.045-8.013 3.058C1.376 10.485 0 12.578 0 14.378c0 3.443 4.414 5.539 8.724 5.539 5.637 0 9.389-3.274 9.389-5.867 0-1.568-1.322-2.457-2.034-2.701zm3.108-6.533a4.89 4.89 0 0 0-4.138-1.702.756.756 0 0 0 .053 1.51 3.373 3.373 0 0 1 2.86 1.18 3.38 3.38 0 0 1 .679 3.039.755.755 0 0 0 1.46.385 4.9 4.9 0 0 0-.914-4.412zm-1.46 1.674a2.46 2.46 0 0 0-2.085-.856.756.756 0 0 0 .1 1.507c.378-.025.75.106 1.023.418.272.312.368.72.283 1.1a.756.756 0 0 0 1.46.384 2.465 2.465 0 0 0-.781-2.553z" />
    </svg>
  );
}

// CSS keyframes for share card
const shareStyleId = "share-card-styles";
function ensureShareStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(shareStyleId)) return;
  const style = document.createElement("style");
  style.id = shareStyleId;
  style.textContent = `
    @keyframes sc-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes sc-fade-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes sc-scale-in { from { opacity: 0; transform: scale(0.85) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes sc-scale-out { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.85) translateY(30px); } }
    @keyframes sc-twinkle { 0%, 100% { opacity: 0.1; transform: scale(0.8); } 50% { opacity: 0.5; transform: scale(1.2); } }
    @keyframes sc-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    @keyframes sc-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  `;
  document.head.appendChild(style);
}

export function ShareResultCard({
  type,
  title,
  subtitle,
  summary,
  details,
  icon,
  accentColor,
  extraInfo,
  ogData,
}: ShareResultCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => { ensureShareStyles(); }, []);

  const theme = cardThemes[type];
  const isEn = language === "en";
  const isChinese = language === "zh";

  const t = {
    zh: {
      share: "分享结果",
      download: "保存图片",
      copy: "复制图片",
      copied: "已复制！",
      shareToSocial: "分享",
      generating: "生成中...",
      close: "关闭",
      poweredBy: "Fortune Insight · AI命理平台",
      tryFree: "fortunesite.one",
      insightQuote: "洞察命运，启迪人生",
      shareTo: "分享到",
    },
    en: {
      share: "Share Result",
      download: "Save Image",
      copy: "Copy Image",
      copied: "Copied!",
      shareToSocial: "Share",
      generating: "Generating...",
      close: "Close",
      poweredBy: "Fortune Insight · AI Divination",
      tryFree: "fortunesite.one",
      insightQuote: "Illuminate your path, empower your journey",
      shareTo: "Share to",
    },
  }[language];

  const truncatedSummary = summary.length > 180 ? summary.slice(0, 180) + "..." : summary;
  const today = new Date().toLocaleDateString(isEn ? "en-US" : "zh-CN", {
    year: "numeric", month: "short", day: "numeric",
  });

  // Build share URL with OG meta support, UTM tracking, and personalized OG data
  const buildShareUrl = useCallback((platform: string) => {
    const base = new URL("https://fortunesite.one/share");
    base.searchParams.set("type", type);
    base.searchParams.set("title", title.slice(0, 60));
    base.searchParams.set("summary", truncatedSummary.slice(0, 120));
    base.searchParams.set("lang", language);
    // Personalized OG data params
    if (ogData) {
      for (const [key, val] of Object.entries(ogData)) {
        if (val) base.searchParams.set(key, String(val).slice(0, 100));
      }
    }
    // UTM parameters
    base.searchParams.set("utm_source", platform);
    base.searchParams.set("utm_medium", "social");
    base.searchParams.set("utm_campaign", `share_${type}`);
    return base.toString();
  }, [type, title, truncatedSummary, language, ogData]);

  const shareText = isEn
    ? `Just got my ${title.toLowerCase()} from Fortune Insight - Try yours free!`
    : `刚做完${title}，结果太准了！免费体验`;

  // Share tracking mutation
  const trackShare = trpc.shareTracking.track.useMutation();
  const recordShare = useCallback((platform: string) => {
    try {
      trackShare.mutate({ platform, type, lang: language });
    } catch { /* non-blocking */ }
  }, [trackShare, type, language]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, []);

  const generatePng = useCallback(async () => {
    if (!cardRef.current) return null;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: "#0a0a1a",
      });
      return dataUrl;
    } catch (err) {
      console.error("Failed to generate image:", err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleDownload = useCallback(async () => {
    const dataUrl = await generatePng();
    if (!dataUrl) {
      toast.error(isEn ? "Failed to generate image" : "生成图片失败");
      return;
    }
    const link = document.createElement("a");
    link.download = `fortune-insight-${type}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    toast.success(isEn ? "Image saved!" : "图片已保存！");
  }, [generatePng, type, isEn]);

  const handleCopy = useCallback(async () => {
    const dataUrl = await generatePng();
    if (!dataUrl) {
      toast.error(isEn ? "Failed to generate image" : "生成图片失败");
      return;
    }
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      toast.success(isEn ? "Image copied to clipboard!" : "图片已复制到剪贴板！");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      handleDownload();
    }
  }, [generatePng, isEn, handleDownload]);

  const handleNativeShare = useCallback(async () => {
    const dataUrl = await generatePng();
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `fortune-insight-${type}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        recordShare("native");
        await navigator.share({
          title: isEn ? `My ${title} — Fortune Insight` : `我的${title} — 洞察未来`,
          text: shareText,
          url: buildShareUrl("native"),
          files: [file],
        });
      } else {
        handleCopy();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        handleDownload();
      }
    }
  }, [generatePng, type, title, isEn, shareText, handleCopy, handleDownload]);

  // Social platform share handlers
  const handleShareWhatsApp = useCallback(() => {
    const shareUrl = buildShareUrl("whatsapp");
    recordShare("whatsapp");
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareText, buildShareUrl, recordShare]);

  const handleShareTelegram = useCallback(() => {
    const shareUrl = buildShareUrl("telegram");
    recordShare("telegram");
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareText, buildShareUrl, recordShare]);

  const handleShareTwitter = useCallback(() => {
    const shareUrl = buildShareUrl("twitter");
    recordShare("twitter");
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareText, buildShareUrl, recordShare]);

  const handleShareWeChat = useCallback(() => {
    const shareUrl = buildShareUrl("wechat");
    recordShare("wechat");
    navigator.clipboard.writeText(shareText + "\n" + shareUrl).then(() => {
      toast.success("链接已复制，请打开微信粘贴分享");
    }).catch(() => {
      toast.info("请手动复制链接分享到微信");
    });
  }, [shareText, buildShareUrl, recordShare]);

  const handleShareWeibo = useCallback(() => {
    const shareUrl = buildShareUrl("weibo");
    recordShare("weibo");
    const url = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareText, buildShareUrl, recordShare]);

  // Social share buttons config based on language
  const socialButtons = isChinese
    ? [
        { name: "微信", icon: WeChatIcon, handler: handleShareWeChat, color: "#07C160" },
        { name: "微博", icon: WeiboIcon, handler: handleShareWeibo, color: "#E6162D" },
        { name: "X", icon: XTwitterIcon, handler: handleShareTwitter, color: "#ffffff" },
      ]
    : [
        { name: "WhatsApp", icon: WhatsAppIcon, handler: handleShareWhatsApp, color: "#25D366" },
        { name: "Telegram", icon: TelegramIcon, handler: handleShareTelegram, color: "#26A5E4" },
        { name: "X", icon: XTwitterIcon, handler: handleShareTwitter, color: "#ffffff" },
      ];

  // Decorative star positions for the card
  const decorativeStars = [
    { top: "8%", right: "12%", size: 3, delay: 0 },
    { top: "15%", right: "30%", size: 2, delay: 0.5 },
    { top: "25%", left: "8%", size: 2.5, delay: 1 },
    { bottom: "35%", right: "15%", size: 2, delay: 1.5 },
    { bottom: "25%", left: "12%", size: 1.5, delay: 2 },
    { top: "45%", right: "8%", size: 2, delay: 0.8 },
  ];

  return (
    <>
      {/* Trigger Button - premium gold style with shimmer */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 border-[#d4a843]/30 text-[#d4a843] hover:bg-[#d4a843]/10 hover:border-[#d4a843]/50 transition-all duration-300 relative overflow-hidden group"
      >
        <Share2 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
        {t.share}
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.08), transparent)",
            backgroundSize: "200% 100%",
            animation: "sc-shimmer 2s linear infinite",
          }}
        />
      </Button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
          style={{ animation: isClosing ? "sc-fade-out 0.25s ease-in forwards" : "sc-fade-in 0.3s ease-out forwards" }}
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto"
            style={{ animation: isClosing ? "sc-scale-out 0.25s ease-in forwards" : "sc-scale-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - adjusted for mobile */}
            <button
              onClick={handleClose}
              className="absolute top-1 right-1 sm:-top-3 sm:-right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* ===== The Shareable Card ===== */}
            <div
              ref={cardRef}
              style={{
                background: theme.gradient,
                border: `1px solid ${theme.borderColor}25`,
              }}
              className="w-full rounded-2xl overflow-hidden shadow-2xl"
            >
              <div
                style={{ backgroundImage: theme.pattern }}
                className="relative p-5 sm:p-7"
              >
                {/* Twinkling decorative stars */}
                {decorativeStars.map((star, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      top: (star as Record<string, unknown>).top as string | undefined,
                      right: (star as Record<string, unknown>).right as string | undefined,
                      left: (star as Record<string, unknown>).left as string | undefined,
                      bottom: (star as Record<string, unknown>).bottom as string | undefined,
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      background: theme.starColor,
                      animation: `sc-twinkle 3s ease-in-out ${star.delay}s infinite`,
                    }}
                  />
                ))}

                {/* Large decorative symbol (SVG) */}
                <div className="absolute top-3 right-5 opacity-15" style={{ width: 28, height: 28 }}>{theme.symbolSvg}</div>
                <div className="absolute bottom-16 left-4 opacity-[0.08]" style={{ width: 16, height: 16 }}>{theme.symbolSvg}</div>

                {/* Glow effect behind icon */}
                <div
                  className="absolute top-6 left-6 w-16 h-16 rounded-full blur-2xl"
                  style={{ background: theme.glowColor }}
                />

                {/* Header */}
                <div className="relative flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div
                    style={{
                      background: theme.iconBg,
                      border: `1px solid ${theme.borderColor}30`,
                      boxShadow: `0 0 20px ${theme.glowColor}`,
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
                  >
                    <span style={{ color: accentColor || theme.borderColor }}>
                      {icon || typeIcons[type]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="text-lg sm:text-xl font-bold tracking-wide truncate"
                      style={{
                        backgroundImage: theme.accentGradient,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {subtitle && (
                        <p className="text-xs text-white/50 truncate max-w-[140px] sm:max-w-[180px]">{subtitle}</p>
                      )}
                      <span className="text-[10px] text-white/30 shrink-0">{today}</span>
                    </div>
                  </div>
                </div>

                {/* Extra Info Tags */}
                {extraInfo && Object.keys(extraInfo).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                    {Object.entries(extraInfo).filter(([, v]) => v).map(([key, value]) => (
                      <span
                        key={key}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium"
                        style={{
                          background: `${theme.borderColor}12`,
                          color: "rgba(255,255,255,0.75)",
                          border: `1px solid ${theme.borderColor}20`,
                        }}
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}

                {/* Ornamental Divider */}
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.borderColor}40, transparent)` }} />
                  <Sparkles className="w-3.5 h-3.5" style={{ color: `${theme.borderColor}60` }} />
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.borderColor}40, transparent)` }} />
                </div>

                {/* Summary Content */}
                <div
                  className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-xl"
                  style={{
                    background: `${theme.borderColor}08`,
                    borderLeft: `3px solid ${theme.borderColor}30`,
                  }}
                >
                  <p className="text-xs sm:text-sm leading-relaxed text-white/75 italic">
                    &ldquo;{truncatedSummary}&rdquo;
                  </p>
                </div>

                {/* Detail Tags */}
                {details && details.length > 0 && (
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                    {details.slice(0, 4).map((detail, i) => (
                      <div
                        key={i}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-center"
                        style={{
                          background: `${theme.borderColor}10`,
                          border: `1px solid ${theme.borderColor}15`,
                        }}
                      >
                        <span className="text-[10px] sm:text-xs text-white/60 font-medium line-clamp-1">{detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA banner */}
                <div
                  className="mb-4 sm:mb-5 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-center"
                  style={{
                    background: `linear-gradient(135deg, ${theme.borderColor}15, ${theme.borderColor}08)`,
                    border: `1px solid ${theme.borderColor}20`,
                  }}
                >
                  <p className="text-[10px] sm:text-[11px] text-white/60">
                    {isEn
                      ? "★ Get your personalized reading free at fortunesite.one"
                      : "★ 来 fortunesite.one 获取你的专属命理分析"}
                  </p>
                </div>

                {/* Footer / Brand */}
                <div
                  className="pt-3 sm:pt-4 flex items-center justify-between"
                  style={{ borderTop: `1px solid ${theme.borderColor}15` }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0"
                      style={{
                        background: `${theme.borderColor}25`,
                        color: theme.borderColor,
                        border: `1px solid ${theme.borderColor}30`,
                        animation: "sc-float 3s ease-in-out infinite",
                      }}
                    >
                      F
                    </div>
                    <div>
                      <span className="text-[9px] sm:text-[10px] text-white/50 tracking-widest block leading-tight">
                        FORTUNE INSIGHT
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-white/25 block leading-tight">
                        {t.insightQuote}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-white/25 font-mono">
                    {t.tryFree}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons - responsive layout */}
            <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-3 sm:mt-4 justify-center">
              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                size="sm"
                className="gap-1.5 sm:gap-2 bg-gradient-to-r from-[#d4a843] to-[#c09030] hover:from-[#c09030] hover:to-[#b08020] text-black font-semibold shadow-lg shadow-[#d4a843]/20 text-xs sm:text-sm"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {isGenerating ? t.generating : t.download}
              </Button>
              <Button
                onClick={handleCopy}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="gap-1.5 sm:gap-2 border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                {copied ? t.copied : t.copy}
              </Button>
              <Button
                onClick={handleNativeShare}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="gap-1.5 sm:gap-2 border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {isGenerating ? t.generating : t.shareToSocial}
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="mt-3 sm:mt-4">
              <p className="text-center text-[10px] sm:text-xs text-white/40 mb-2">{t.shareTo}</p>
              <div className="flex justify-center gap-3 sm:gap-4">
                {socialButtons.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={platform.handler}
                    className="flex flex-col items-center gap-1 group"
                    title={platform.name}
                  >
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-active:scale-95"
                      style={{
                        background: `${platform.color}15`,
                        border: `1px solid ${platform.color}30`,
                      }}
                    >
                      <platform.icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" style={{ color: platform.color, width: "18px", height: "18px" }} />
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-white/40 group-hover:text-white/60 transition-colors">
                      {platform.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
