import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import VoiceInput from "@/components/VoiceInput";
import { 
  MessageSquare, 
  Send,
  User,
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

const statusConfig = {
  waiting: { label: "等待中", color: "bg-yellow-500/20 text-yellow-500", icon: Clock },
  active: { label: "进行中", color: "bg-blue-500/20 text-blue-500", icon: MessageSquare },
  closed: { label: "已关闭", color: "bg-gray-500/20 text-gray-500", icon: CheckCircle },
};

export default function AdminChat() {
  const { user } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "waiting" | "active" | "closed">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取所有会话
  const { data: sessions, refetch: refetchSessions } = trpc.chat.adminGetSessions.useQuery(
    { status: statusFilter },
    { refetchInterval: 5000 }
  );

  // 获取选中会话的消息
  const { data: messages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { sessionId: selectedSessionId || "" },
    { enabled: !!selectedSessionId, refetchInterval: 2000 }
  );

  // 获取选中会话信息
  const { data: selectedSession } = trpc.chat.getSession.useQuery(
    { sessionId: selectedSessionId || "" },
    { enabled: !!selectedSessionId }
  );

  // 发送消息
  const sendMessageMutation = trpc.chat.adminSendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      refetchMessages();
      refetchSessions();
    },
    onError: (error) => {
      toast.error("发送失败", { description: error.message });
    },
  });

  // 关闭会话
  const closeSessionMutation = trpc.chat.adminCloseSession.useMutation({
    onSuccess: () => {
      toast.success("会话已关闭");
      refetchSessions();
      refetchMessages();
    },
  });

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 权限检查
  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">无权限访问</h2>
              <p className="text-muted-foreground">此页面仅限管理员访问</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // 发送消息
  const handleSendMessage = () => {
    if (!message.trim() || !selectedSessionId) return;
    sendMessageMutation.mutate({
      sessionId: selectedSessionId,
      content: message.trim(),
    });
  };

  // 统计数据
  const stats = {
    total: sessions?.length || 0,
    waiting: sessions?.filter(s => s.status === "waiting").length || 0,
    active: sessions?.filter(s => s.status === "active").length || 0,
  };

  return (
    <DashboardLayout>
      <SEOHead title="Admin - Chat Management" path="/admin/chat" noindex />
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">在线客服</h1>
          <p className="text-muted-foreground">实时与用户沟通</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">总会话</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.waiting}</p>
                  <p className="text-xs text-muted-foreground">等待接入</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-xs text-muted-foreground">进行中</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
          {/* 会话列表 */}
          <Card className="col-span-1 flex flex-col">
            <CardHeader className="py-3">
              <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all">全部</TabsTrigger>
                  <TabsTrigger value="waiting">等待</TabsTrigger>
                  <TabsTrigger value="active">进行</TabsTrigger>
                  <TabsTrigger value="closed">关闭</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-2">
              {sessions?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  暂无会话
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions?.map((session) => {
                    const StatusIcon = statusConfig[session.status as keyof typeof statusConfig]?.icon || AlertCircle;
                    return (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.sessionId)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedSessionId === session.sessionId
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium truncate">
                            {session.userName || "游客"}
                          </span>
                          <Badge className={statusConfig[session.status as keyof typeof statusConfig]?.color || ""}>
                            {statusConfig[session.status as keyof typeof statusConfig]?.label || session.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.topic || "一般咨询"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(session.createdAt), "MM-dd HH:mm", { locale: zhCN })}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 聊天区域 */}
          <Card className="col-span-2 flex flex-col">
            {!selectedSessionId ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>选择一个会话开始聊天</p>
                </div>
              </div>
            ) : (
              <>
                {/* 会话信息 */}
                <CardHeader className="py-3 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {selectedSession?.userName || "游客"}
                      </CardTitle>
                      <CardDescription>
                        {selectedSession?.userEmail || "未提供邮箱"} · {selectedSession?.topic || "一般咨询"}
                      </CardDescription>
                    </div>
                    {selectedSession?.status !== "closed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => closeSessionMutation.mutate({ sessionId: selectedSessionId })}
                        disabled={closeSessionMutation.isPending}
                      >
                        结束会话
                      </Button>
                    )}
                  </div>
                </CardHeader>

                {/* 消息列表 */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  {messages?.map((msg) => {
                    const isAdmin = msg.senderType === "admin";
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
                        className={`flex gap-2 mb-3 ${isAdmin ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isAdmin ? "bg-emerald-500" : "bg-primary"
                          }`}
                        >
                          {isAdmin ? (
                            <Bot className="w-4 h-4 text-white" />
                          ) : (
                            <User className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                        <div className={`max-w-[75%] ${isAdmin ? "text-right" : ""}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">
                              {msg.senderName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(msg.createdAt), "HH:mm", { locale: zhCN })}
                            </span>
                          </div>
                          <div
                            className={`px-3 py-2 rounded-lg ${
                              isAdmin
                                ? "bg-emerald-500 text-white"
                                : "bg-muted"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* 输入区域 */}
                {selectedSession?.status !== "closed" && (
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          placeholder="输入回复..."
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
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sendMessageMutation.isPending}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        发送
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
