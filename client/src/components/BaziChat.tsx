import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, MessageCircle, Sparkles, User, Lightbulb } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import TextToSpeech from "@/components/TextToSpeech";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface BaziChatProps {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;
  gender?: "male" | "female";
  previousReport: string;
  className?: string;
}

const quickQuestionsZh = [
  "今年的事业运势如何？",
  "我适合什么类型的工作？",
  "感情方面需要注意什么？",
  "如何发挥我的天赋优势？",
  "今年有什么需要特别注意的？",
  "我的财运怎么样？",
];

const quickQuestionsEn = [
  "How is my career outlook this year?",
  "What type of work suits me best?",
  "Any advice for my love life?",
  "How can I leverage my strengths?",
  "What should I watch out for this year?",
  "How is my financial fortune?",
];

export default function BaziChat({
  birthYear,
  birthMonth,
  birthDay,
  birthHour,
  gender,
  previousReport,
  className = "",
}: BaziChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useTranslation();
  const isZh = language === "zh";

  const quickQuestions = isZh ? quickQuestionsZh : quickQuestionsEn;

  const chatMutation = trpc.bazi.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    },
    onError: () => {
      toast.error(isZh ? "发送失败，请重试" : "Failed to send. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageToSend = text || inputValue.trim();
    if (!messageToSend || chatMutation.isPending) return;

    const newUserMessage: ChatMessage = { role: "user", content: messageToSend };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    chatMutation.mutate({
      message: messageToSend,
      birthYear,
      birthMonth,
      birthDay,
      birthHour,
      gender,
      previousReport,
      chatHistory: messages,
      language: language as "zh" | "en",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className={`glass-card border-violet-500/30 overflow-hidden ${className}`}>
      <CardHeader 
        className="cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-400" />
            <span>{isZh ? "继续咨询" : "Ask Follow-up"}</span>
            {messages.length > 0 && (
              <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                {messages.length} {isZh ? "条对话" : messages.length === 1 ? "message" : "messages"}
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isZh
            ? "对报告有疑问？想了解更多细节？点击展开继续追问"
            : "Have questions about your report? Click to expand and ask anything"}
        </p>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">
              <div className="border border-border/50 rounded-lg overflow-hidden bg-black/20">
                <ScrollArea className="h-[300px] p-4" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Sparkles className="w-12 h-12 text-violet-400/50 mb-4" />
                      <p className="text-muted-foreground mb-4">
                        {isZh
                          ? "您可以针对八字报告提出任何问题"
                          : "Ask any question about your BaZi report"}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center max-w-md">
                        {quickQuestions.slice(0, 4).map((q, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="text-xs border-violet-500/30 hover:bg-violet-500/10"
                            onClick={() => handleSend(q)}
                            disabled={chatMutation.isPending}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${
                            msg.role === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              msg.role === "user"
                                ? "bg-cyan-500/20"
                                : "bg-violet-500/20"
                            }`}
                          >
                            {msg.role === "user" ? (
                              <User className="w-4 h-4 text-cyan-400" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-violet-400" />
                            )}
                          </div>
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.role === "user"
                                ? "bg-cyan-500/20 text-cyan-50"
                                : "bg-violet-500/10 text-foreground"
                            }`}
                          >
                            {msg.role === "assistant" ? (
                              <div className="prose prose-sm prose-invert max-w-none">
                                <MarkdownRenderer>{msg.content}</MarkdownRenderer>
                                <div className="mt-2 flex justify-end">
                                  <TextToSpeech
                                    text={msg.content}
                                    size="sm"
                                    className="text-violet-400 hover:text-violet-300"
                                  />
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm">{msg.content}</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {chatMutation.isPending && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-violet-400" />
                          </div>
                          <div className="bg-violet-500/10 rounded-lg px-4 py-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {isZh ? "正在思考..." : "Thinking..."}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                <div className="border-t border-border/50 p-3 bg-black/10">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isZh
                          ? "例如：我的财运什么时候会好转？我适合什么职业？"
                          : "e.g. When will my finances improve? What career suits me?"}
                        className="w-full pr-10 bg-white/5 border-white/10"
                        disabled={chatMutation.isPending}
                        maxLength={500}
                      />
                      <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <VoiceInput
                          onTranscript={(text) => setInputValue(prev => prev + text)}
                          disabled={chatMutation.isPending}
                          className="h-8 w-8 text-muted-foreground hover:text-cyan-400"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim() || chatMutation.isPending}
                      className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                    >
                      {chatMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {messages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {quickQuestions.slice(0, 3).map((q, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleSend(q)}
                          disabled={chatMutation.isPending}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-3">
                <Lightbulb className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5" />
                {isZh
                  ? "您可以询问关于事业、感情、财运等任何命理相关问题"
                  : "Ask about career, love, wealth, or any destiny-related questions"}
              </p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
