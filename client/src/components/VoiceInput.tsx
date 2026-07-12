import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  disabled?: boolean;
  className?: string;
  language?: string;
  continuous?: boolean;
  /** 使用按住说话模式（微信风格） */
  holdToTalk?: boolean;
  /** 显示波形动画 */
  showWaveform?: boolean;
  /** 按钮大小 */
  size?: "sm" | "md" | "lg";
}

// 声明 Web Speech API 类型
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// 波形动画组件
function WaveformAnimation({ 
  isActive, 
  audioLevel = 0.5,
  className 
}: { 
  isActive: boolean; 
  audioLevel?: number;
  className?: string;
}) {
  const bars = 5;
  
  return (
    <div className={cn("flex items-center justify-center gap-0.5", className)}>
      {Array.from({ length: bars }).map((_, i) => {
        // 根据音量调整高度，中间的条最高
        const centerDistance = Math.abs(i - Math.floor(bars / 2));
        const baseHeight = 1 - centerDistance * 0.15;
        const height = isActive ? baseHeight * (0.3 + audioLevel * 0.7) : 0.2;
        
        return (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full transition-all duration-75",
              isActive ? "bg-gradient-to-t from-cyan-400 to-purple-400" : "bg-gray-400"
            )}
            style={{
              height: `${Math.max(4, height * 24)}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        );
      })}
    </div>
  );
}

// 录音状态浮层
function RecordingOverlay({
  isVisible,
  isRecording,
  isCancelling,
  audioLevel,
  interimText,
  onCancel,
  isZh,
}: {
  isVisible: boolean;
  isRecording: boolean;
  isCancelling: boolean;
  audioLevel: number;
  interimText: string;
  onCancel: () => void;
  isZh: boolean;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={cn(
        "relative flex flex-col items-center gap-6 p-8 rounded-3xl transition-all duration-300",
        isCancelling 
          ? "bg-red-900/80 scale-95" 
          : "bg-gradient-to-br from-slate-900/90 to-purple-900/90"
      )}>
        {/* 波形动画圆环 */}
        <div className={cn(
          "relative w-32 h-32 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-cyan-500/20 to-purple-500/20",
          "border-2",
          isCancelling ? "border-red-500" : "border-cyan-400/50"
        )}>
          {/* 外圈脉冲动画 */}
          {isRecording && !isCancelling && (
            <>
              <div 
                className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping"
                style={{ animationDuration: '1.5s' }}
              />
              <div 
                className="absolute inset-[-8px] rounded-full border border-purple-400/20 animate-ping"
                style={{ animationDuration: '2s' }}
              />
            </>
          )}
          
          {/* 中心波形 */}
          <div className="flex items-end justify-center gap-1 h-16">
            {Array.from({ length: 7 }).map((_, i) => {
              const centerDistance = Math.abs(i - 3);
              const baseHeight = 1 - centerDistance * 0.12;
              const randomFactor = isRecording ? Math.random() * 0.3 : 0;
              const height = isRecording 
                ? baseHeight * (0.4 + audioLevel * 0.6 + randomFactor)
                : 0.15;
              
              return (
                <div
                  key={i}
                  className={cn(
                    "w-2 rounded-full transition-all",
                    isCancelling 
                      ? "bg-red-400" 
                      : "bg-gradient-to-t from-cyan-400 to-purple-400"
                  )}
                  style={{
                    height: `${Math.max(8, height * 48)}px`,
                    transitionDuration: '50ms',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* 状态文字 */}
        <div className="text-center">
          {isCancelling ? (
            <p className="text-red-400 text-lg font-medium">{isZh ? "松开取消" : "Release to cancel"}</p>
          ) : (
            <>
              <p className="text-cyan-300 text-lg font-medium mb-2">
                {isRecording ? (isZh ? "正在聆听..." : "Listening...") : (isZh ? "处理中..." : "Processing...")}
              </p>
              {interimText && (
                <p className="text-white/80 text-sm max-w-xs truncate">
                  {interimText}
                </p>
              )}
            </>
          )}
        </div>

        {/* 取消按钮 */}
        <button
          onClick={onCancel}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all",
            "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
          )}
        >
          <X className="w-4 h-4" />
          <span>{isZh ? "上滑取消" : "Swipe up to cancel"}</span>
        </button>
      </div>
    </div>
  );
}

export default function VoiceInput({
  onTranscript,
  onInterimTranscript,
  disabled = false,
  className,
  language = "zh-CN",
  continuous = false,
  holdToTalk = false,
  showWaveform = true,
  size = "md",
}: VoiceInputProps) {
  const { language: appLang } = useTranslation();
  const isZh = appLang === "zh";
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0.5);
  const [interimText, setInterimText] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isManualStop = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number>(0);

  // 音频上传 mutation
  const uploadAudioMutation = trpc.voice.uploadAudio.useMutation();

  // 语音转录 mutation
  const transcribeMutation = trpc.voice.transcribe.useMutation({
    onSuccess: (data) => {
      if (data.text) {
        onTranscript(data.text);
        toast.success(isZh ? "语音识别完成" : "Voice recognition complete");
      }
    },
    onError: (error) => {
      toast.error(isZh ? `语音识别失败: ${error.message}` : `Voice recognition failed: ${error.message}`);
    },
  });

  // 检查浏览器是否支持语音识别
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    // 同时检查 MediaRecorder 支持
    const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
    if (!SpeechRecognition && !hasMediaRecorder) {
      setIsSupported(false);
    }
  }, []);

  // 分析音频电平
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // 计算平均音量
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalizedLevel = Math.min(1, average / 128);
    setAudioLevel(normalizedLevel);
    
    if (isListening) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [isListening]);

  // 初始化语音识别（Web Speech API）
  const initRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setInterimText(interimTranscript);
        if (onInterimTranscript) {
          onInterimTranscript(interimTranscript);
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript);
        setInterimText("");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // 对于 aborted 和 audio-capture 错误，不记录错误日志（这些是正常的用户操作）
      if (event.error !== "aborted" && event.error !== "audio-capture") {
        console.error("Speech recognition error:", event.error);
      }
      
      setIsListening(false);
      setShowOverlay(false);
      
      switch (event.error) {
        case "not-allowed":
          toast.error(isZh ? "请允许麦克风权限以使用语音输入" : "Please allow microphone access for voice input");
          break;
        case "no-speech":
          // 只有在非手动停止时才显示提示
          if (!isManualStop.current) {
            toast.info(isZh ? "未检测到语音，请重试" : "No speech detected, please try again");
          }
          break;
        case "network":
          toast.error(isZh ? "网络错误，请检查网络连接" : "Network error, please check your connection");
          break;
        case "aborted":
        case "audio-capture":
          // 用户主动停止或音频捕获结束，不显示错误
          break;
        default:
          // 只有在非手动停止时才显示错误
          if (!isManualStop.current) {
            toast.error(isZh ? "语音识别出错，请重试" : "Voice recognition error, please try again");
          }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setShowOverlay(false);
      // 如果是连续模式且不是手动停止，自动重启
      if (continuous && !isManualStop.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // 忽略重启错误
        }
      }
    };

    return recognition;
  }, [language, continuous, onTranscript, onInterimTranscript]);

  // 开始录音（使用 MediaRecorder 获取更高质量音频）
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        } 
      });

      // 设置音频分析器
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // 开始分析音频电平
      analyzeAudio();

      // 设置 MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // 每100ms收集一次数据
      setIsListening(true);
      if (holdToTalk) {
        setShowOverlay(true);
      }

      // 同时启动 Web Speech API 获取实时转录
      if (!recognitionRef.current) {
        recognitionRef.current = initRecognition();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // 忽略错误
        }
      }

    } catch (error) {
      console.error("Failed to start recording:", error);
      toast.error(isZh ? "无法访问麦克风，请检查权限设置" : "Cannot access microphone, please check permissions");
    }
  }, [analyzeAudio, holdToTalk, initRecognition]);

  // 停止录音并处理
  const stopRecording = useCallback(async (cancelled = false) => {
    // 停止动画
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // 停止 Web Speech API
    if (recognitionRef.current) {
      isManualStop.current = true;
      recognitionRef.current.stop();
    }

    // 停止 MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // 停止所有音轨
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    // 关闭音频上下文
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsListening(false);
    setShowOverlay(false);
    setIsCancelling(false);
    setInterimText("");

    if (cancelled) {
      toast.info(isZh ? "已取消语音输入" : "Voice input cancelled");
      audioChunksRef.current = [];
      return;
    }

    // 如果有录音数据，使用服务器端 Whisper API 进行高精度转录
    if (audioChunksRef.current.length > 0) {
      setIsProcessing(true);
      
      try {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
        });
        
        // 检查文件大小
        const sizeMB = audioBlob.size / (1024 * 1024);
        if (sizeMB > 16) {
          toast.error(isZh ? "录音时间过长，请控制在2分钟以内" : "Recording too long, please keep it under 2 minutes");
          setIsProcessing(false);
          return;
        }

        // 将Blob转换为base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          // 移除data:audio/webm;base64,前缀
          const base64Audio = base64Data.split(',')[1];
          
          try {
            // 上传到服务器
            const uploadResult = await uploadAudioMutation.mutateAsync({
              audioData: base64Audio,
              mimeType: mediaRecorderRef.current?.mimeType || 'audio/webm',
            });

            // 调用服务器端转录
            transcribeMutation.mutate({
              audioUrl: uploadResult.url,
              language: language === "zh-CN" ? "zh" : language,
            });
          } catch (uploadError) {
            console.error("Failed to upload audio:", uploadError);
            toast.error(isZh ? "上传音频失败，请重试" : "Failed to upload audio, please try again");
          }
        };
        
        reader.onerror = () => {
          toast.error(isZh ? "读取音频数据失败" : "Failed to read audio data");
        };

      } catch (error) {
        console.error("Failed to process recording:", error);
        toast.error(isZh ? "处理录音失败，请重试" : "Failed to process recording, please try again");
      } finally {
        setIsProcessing(false);
        audioChunksRef.current = [];
      }
    }
  }, [language, transcribeMutation, uploadAudioMutation]);

  // 点击模式：开始/停止语音识别
  const toggleListening = useCallback(() => {
    if (!isSupported) {
      toast.error(isZh ? "您的浏览器不支持语音输入功能" : "Your browser does not support voice input");
      return;
    }

    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isListening, isSupported, startRecording, stopRecording]);

  // 按住说话模式的事件处理
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!holdToTalk || disabled || !isSupported) return;
    
    e.preventDefault();
    touchStartYRef.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startRecording();
  }, [holdToTalk, disabled, isSupported, startRecording]);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!holdToTalk || !isListening) return;
    
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = touchStartYRef.current - currentY;
    
    // 上滑超过50px触发取消状态
    setIsCancelling(deltaY > 50);
  }, [holdToTalk, isListening]);

  const handleTouchEnd = useCallback(() => {
    if (!holdToTalk || !isListening) return;
    
    stopRecording(isCancelling);
  }, [holdToTalk, isListening, isCancelling, stopRecording]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        isManualStop.current = true;
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isSupported) {
    return null; // 不支持时不显示按钮
  }

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={holdToTalk ? undefined : toggleListening}
        onMouseDown={holdToTalk ? handleTouchStart : undefined}
        onMouseMove={holdToTalk ? handleTouchMove : undefined}
        onMouseUp={holdToTalk ? handleTouchEnd : undefined}
        onMouseLeave={holdToTalk && isListening ? handleTouchEnd : undefined}
        onTouchStart={holdToTalk ? handleTouchStart : undefined}
        onTouchMove={holdToTalk ? handleTouchMove : undefined}
        onTouchEnd={holdToTalk ? handleTouchEnd : undefined}
        disabled={disabled || isProcessing}
        className={cn(
          "relative transition-all duration-200 select-none",
          sizeClasses[size],
          isListening && "text-cyan-400 bg-cyan-500/20",
          isProcessing && "text-purple-400",
          className
        )}
        title={
          holdToTalk 
            ? "按住说话" 
            : isListening 
              ? "点击停止语音输入" 
              : "点击开始语音输入"
        }
      >
        {isProcessing ? (
          <Loader2 className={cn(iconSizes[size], "animate-spin")} />
        ) : isListening ? (
          <>
            {showWaveform ? (
              <WaveformAnimation 
                isActive={isListening} 
                audioLevel={audioLevel}
                className={iconSizes[size]}
              />
            ) : (
              <MicOff className={iconSizes[size]} />
            )}
            {/* 录音动画指示器 */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </>
        ) : (
          <Mic className={iconSizes[size]} />
        )}
      </Button>

      {/* 按住说话模式的全屏浮层 */}
      {holdToTalk && (
        <RecordingOverlay
          isVisible={showOverlay}
          isRecording={isListening}
          isCancelling={isCancelling}
          audioLevel={audioLevel}
          interimText={interimText}
          onCancel={() => stopRecording(true)}
          isZh={isZh}
        />
      )}
    </>
  );
}

// 语音输入状态提示组件
export function VoiceInputStatus({ isListening }: { isListening: boolean }) {
  if (!isListening) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-cyan-400 animate-pulse">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              height: `${8 + Math.random() * 8}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <span>正在聆听...</span>
    </div>
  );
}

// 内联语音输入按钮（用于输入框内）
export function InlineVoiceButton({
  onTranscript,
  disabled = false,
  className,
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <VoiceInput
      onTranscript={onTranscript}
      disabled={disabled}
      className={cn("hover:bg-white/10", className)}
      size="sm"
      showWaveform={true}
    />
  );
}
