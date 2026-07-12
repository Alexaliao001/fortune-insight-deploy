import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Pause, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface TextToSpeechProps {
  text: string;
  speed?: number;
  pitch?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  variant?: "default" | "ghost" | "outline";
  disabled?: boolean;
  lang?: "zh-CN" | "en-US";
}

const isSpeechSynthesisSupported = typeof window !== "undefined" && "speechSynthesis" in window;

export default function TextToSpeech({
  text,
  speed = 1.0,
  pitch = 1.0,
  className,
  size = "md",
  showLabel = false,
  variant = "ghost",
  disabled = false,
  lang = "zh-CN",
}: TextToSpeechProps) {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(0);

  const getVoice = useCallback((language: string): SpeechSynthesisVoice | null => {
    if (!isSpeechSynthesisSupported) return null;
    const voices = window.speechSynthesis.getVoices();
    if (language.startsWith("zh")) {
      const zhVoice = voices.find(v => 
        v.lang.includes("zh") || v.lang.includes("cmn") ||
        v.name.toLowerCase().includes("chinese") || v.name.includes("中文")
      );
      if (zhVoice) return zhVoice;
    }
    if (language.startsWith("en")) {
      const enVoice = voices.find(v => 
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("samantha"))
      );
      if (enVoice) return enVoice;
      const anyEnVoice = voices.find(v => v.lang.startsWith("en"));
      if (anyEnVoice) return anyEnVoice;
    }
    return voices[0] || null;
  }, []);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startSpeaking = useCallback(() => {
    if (!text || text.trim().length === 0) {
      toast.info(t.tts.noContent);
      return;
    }
    if (!isSpeechSynthesisSupported) {
      toast.error(t.tts.notSupported);
      return;
    }
    window.speechSynthesis.cancel();
    clearProgressInterval();
    setIsLoading(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    utterance.rate = Math.max(0.5, Math.min(2.0, speed));
    utterance.pitch = Math.max(0.5, Math.min(2.0, pitch));
    utterance.lang = lang;

    const setVoice = () => {
      const voice = getVoice(lang);
      if (voice) utterance.voice = voice;
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }

    const charCount = text.length;
    const wordsPerSecond = lang.startsWith("zh") ? 4 : 3;
    estimatedDurationRef.current = (charCount / wordsPerSecond) * 1000 / speed;

    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const progressPercent = Math.min((elapsed / estimatedDurationRef.current) * 100, 99);
        setProgress(progressPercent);
      }, 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      clearProgressInterval();
      setTimeout(() => setProgress(0), 500);
    };

    utterance.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") return;
      console.error("Speech synthesis error:", event.error);
      setIsLoading(false);
      setIsPlaying(false);
      clearProgressInterval();
      toast.error(t.tts.error);
    };

    utterance.onpause = () => {
      setIsPaused(true);
      clearProgressInterval();
    };

    utterance.onresume = () => {
      setIsPaused(false);
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const progressPercent = Math.min((elapsed / estimatedDurationRef.current) * 100, 99);
        setProgress(progressPercent);
      }, 100);
    };

    window.speechSynthesis.speak(utterance);
  }, [text, speed, pitch, lang, getVoice, clearProgressInterval, t]);

  const togglePause = useCallback(() => {
    if (!isSpeechSynthesisSupported) return;
    if (isPaused) { window.speechSynthesis.resume(); }
    else { window.speechSynthesis.pause(); }
  }, [isPaused]);

  const stopSpeaking = useCallback(() => {
    if (!isSpeechSynthesisSupported) return;
    window.speechSynthesis.cancel();
    clearProgressInterval();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  }, [clearProgressInterval]);

  const handleClick = useCallback(() => {
    if (isLoading) return;
    if (isPlaying) {
      if (isPaused) { togglePause(); }
      else { stopSpeaking(); }
    } else {
      startSpeaking();
    }
  }, [isLoading, isPlaying, isPaused, togglePause, stopSpeaking, startSpeaking]);

  useEffect(() => {
    return () => {
      if (isSpeechSynthesisSupported) window.speechSynthesis.cancel();
      clearProgressInterval();
    };
  }, [clearProgressInterval]);

  useEffect(() => {
    if (isPlaying) stopSpeaking();
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  const sizeClasses = { sm: "h-8 px-2 text-xs", md: "h-9 px-3 text-sm", lg: "h-10 px-4 text-base" };
  const iconSizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };

  if (!isSpeechSynthesisSupported) return null;

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      <Button
        type="button"
        variant={variant}
        onClick={handleClick}
        disabled={disabled || !text}
        className={cn(
          "relative transition-all duration-200",
          sizeClasses[size],
          isPlaying && !isPaused && "text-cyan-400 bg-cyan-500/10",
          isPaused && "text-yellow-400 bg-yellow-500/10"
        )}
        title={isLoading ? t.tts.preparing : isPlaying ? (isPaused ? t.tts.resume : t.tts.stop) : t.tts.read}
      >
        {isLoading ? (
          <Loader2 className={cn(iconSizes[size], "animate-spin")} />
        ) : isPlaying ? (
          isPaused ? <Play className={iconSizes[size]} /> : <VolumeX className={iconSizes[size]} />
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
        
        {showLabel && (
          <span className="ml-1.5">
            {isLoading ? t.tts.preparing : isPlaying ? (isPaused ? t.tts.resume : t.tts.stop) : t.tts.read}
          </span>
        )}

        {isPlaying && !isPaused && (
          <span
            className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        )}
      </Button>

      {isPlaying && !isPaused && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={togglePause}
          className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
          title={t.tts.pause}
        >
          <Pause className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export function InlineSpeakButton({
  text,
  className,
  lang = "zh-CN",
}: {
  text: string;
  className?: string;
  lang?: "zh-CN" | "en-US";
}) {
  return (
    <TextToSpeech text={text} className={className} size="sm" variant="ghost" lang={lang} />
  );
}

export function SpeakableText({
  children,
  text,
  className,
  showButton = true,
  lang = "zh-CN",
}: {
  children: React.ReactNode;
  text?: string;
  className?: string;
  showButton?: boolean;
  lang?: "zh-CN" | "en-US";
}) {
  const textContent = text || (typeof children === "string" ? children : "");
  return (
    <div className={cn("relative group", className)}>
      {children}
      {showButton && textContent && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <TextToSpeech
            text={textContent}
            size="sm"
            variant="ghost"
            className="bg-black/50 backdrop-blur-sm rounded-full"
            lang={lang}
          />
        </div>
      )}
    </div>
  );
}

export function AudioWaveAnimation({
  isPlaying,
  className,
}: {
  isPlaying: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-0.5 h-4", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            "w-0.5 rounded-full transition-all",
            isPlaying ? "bg-gradient-to-t from-cyan-400 to-purple-400 animate-pulse" : "bg-gray-500"
          )}
          style={{
            height: isPlaying ? `${8 + Math.sin(i * 0.8) * 6}px` : "4px",
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.5s",
          }}
        />
      ))}
    </div>
  );
}
