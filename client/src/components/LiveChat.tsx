import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import VoiceInput from "./VoiceInput";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Star,
  User,
  Bot,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useTranslation } from "@/contexts/LanguageContext";

interface Message {
  id: number;
  sessionId: string;
  senderType: "user" | "admin" | "system";
  senderId: number | null;
  senderName: string | null;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  fileUrl: string | null;
  isRead: boolean | null;
  createdAt: Date;
}

export default function LiveChat() {
  const { user } = useAuth();
  const { language } = useTranslation();
  const isZh = language === "zh";
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 从localStorage恢复会话
  useEffect(() => {
    const savedSessionId = localStorage.getItem("chatSessionId");
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  // 创建会话
  const createSessionMutation = trpc.chat.createSession.useMutation({
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      localStorage.setItem("chatSessionId", data.sessionId);
    },
    onError: (error) => {
      toast.error(isZh ? "创建会话失败" : "Failed to create session", { description: error.message });
    },
  });

  // 发送消息
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      refetchMessages();
    },
    onError: (error) => {
      toast.error(isZh ? "发送失败" : "Failed to send", { description: error.message });
    },
  });

  // 关闭会话
  const closeSessionMutation = trpc.chat.closeSession.useMutation({
    onSuccess: () => {
      toast.success(isZh ? "会话已结束" : "Session ended");
      setShowRating(false);
      setSessionId(null);
      localStorage.removeItem("chatSessionId");
    },
  });

  // 获取消息
  const { data: messages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId, refetchInterval: 3000 }
  );

  // 获取会话状态
  const { data: session } = trpc.chat.getSession.useQuery(
    { sessionId: sessionId || "" },
    { enabled: !!sessionId, refetchInterval: 5000 }
  );

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 开始聊天
  const handleStartChat = () => {
    createSessionMutation.mutate({
      userName: user?.name || undefined,
      userEmail: user?.email || undefined,
    });
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!message.trim() || !sessionId) return;
    sendMessageMutation.mutate({
      sessionId,
      content: message.trim(),
    });
  };

  // 结束会话
  const handleEndSession = () => {
    if (!sessionId) return;
    setShowRating(true);
  };

  // 提交评价
  const handleSubmitRating = () => {
    if (!sessionId) return;
    closeSessionMutation.mutate({
      sessionId,
      rating: rating > 0 ? rating : undefined,
      feedback: feedback || undefined,
    });
  };

  // 渲染消息
  const renderMessage = (msg: Message) => {
    const isUser = msg.senderType === "user";
    const isSystem = msg.senderType === "system";

    if (isSystem) {
      return (
        <div key={msg.id} className="flex justify-center my-2">
          <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            {msg.content}
          </span>
        </div>
      );
    }

    return (
      <div
        key={msg.id}
        className={`flex gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isUser ? "bg-primary" : "bg-emerald-500"
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-primary-foreground" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        <div className={`max-w-[75%] ${isUser ? "text-right" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground">
              {msg.senderName}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(msg.createdAt), "HH:mm", { locale: isZh ? zhCN : undefined })}
            </span>
          </div>
          <div
            className={`px-3 py-2 rounded-lg ${
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {msg.content}
          </div>
        </div>
      </div>
    );
  };

  // 聊天按钮
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>
    );
  }

  // 最小化状态
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-72 shadow-xl">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">{isZh ? "在线客服" : "Live Support"}</span>
              {session?.status === "active" && (
                <Badge variant="secondary" className="text-xs">{isZh ? "客服已接入" : "Connected"}</Badge>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 sm:w-96 shadow-xl">
        {/* Header */}
        <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-medium">{isZh ? "在线客服" : "Live Support"}</span>
            {session?.status === "waiting" && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {isZh ? "等待中" : "Waiting"}
              </Badge>
            )}
            {session?.status === "active" && (
              <Badge className="text-xs bg-emerald-500">{isZh ? "客服已接入" : "Connected"}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* 未开始会话 */}
          {!sessionId && (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium mb-2">{isZh ? "需要帮助吗？" : "Need help?"}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isZh ? "我们的客服团队随时为您服务" : "Our support team is here to help"}
              </p>
              <Button
                onClick={handleStartChat}
                disabled={createSessionMutation.isPending}
                className="w-full"
              >
                {createSessionMutation.isPending ? (isZh ? "连接中..." : "Connecting...") : (isZh ? "开始对话" : "Start Chat")}
              </Button>
            </div>
          )}

          {/* 评价弹窗 */}
          {showRating && (
            <div className="p-6">
              <h3 className="font-medium mb-4 text-center">{isZh ? "请为本次服务评分" : "Rate this session"}</h3>
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Input
                placeholder={isZh ? "例如：客服很专业，解答很耐心..." : "e.g. Very professional and patient..."}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowRating(false);
                    closeSessionMutation.mutate({ sessionId: sessionId! });
                  }}
                >
                  {isZh ? "跳过" : "Skip"}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmitRating}
                  disabled={closeSessionMutation.isPending}
                >
                  {isZh ? "提交" : "Submit"}
                </Button>
              </div>
            </div>
          )}

          {/* 聊天界面 */}
          {sessionId && !showRating && (
            <>
              {/* 消息列表 */}
              <div className="h-80 overflow-y-auto p-4">
                {messages?.map(renderMessage)}
                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              {session?.status !== "closed" ? (
                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder={isZh ? "请输入您的问题或咨询..." : "Type your question..."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="pr-10"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <VoiceInput
                          onTranscript={(text) => setMessage((prev) => prev + text)}
                          size="sm"
                        />
                      </div>
                    </div>
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!message.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={handleEndSession}
                    >
                      {isZh ? "结束会话" : "End Session"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">{isZh ? "会话已结束" : "Session ended"}</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setSessionId(null);
                      localStorage.removeItem("chatSessionId");
                    }}
                  >
                    {isZh ? "开始新对话" : "Start New Chat"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
