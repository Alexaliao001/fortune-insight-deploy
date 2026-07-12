import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "wouter";
import {
  Mail, Send, Clock, CheckCircle, XCircle, ArrowLeft,
  Eye, MailCheck, Ban, RefreshCw, ChevronDown, ChevronUp,
  Inbox, AlertTriangle
} from "lucide-react";

export default function AdminEmailMarketing() {
  const { user } = useAuth();
  const { language } = useTranslation();

  const isZh = language === "zh";

  const [statusFilter, setStatusFilter] = useState<"pending" | "sent" | "failed" | "cancelled" | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: stats, refetch: refetchStats } = trpc.email.getStats.useQuery();
  const { data: queueData, refetch: refetchQueue } = trpc.email.getQueue.useQuery({
    status: statusFilter,
    limit: 50,
    offset: 0,
  });
  const { data: readyEmails, refetch: refetchReady } = trpc.email.getReadyToSend.useQuery();

  const markSent = trpc.email.markSent.useMutation({
    onSuccess: () => {
      toast.success(isZh ? "已标记为已发送" : "Marked as sent");
      refetchQueue();
      refetchStats();
      refetchReady();
    },
  });

  const cancelEmail = trpc.email.cancelEmail.useMutation({
    onSuccess: () => {
      toast.success(isZh ? "已取消" : "Cancelled");
      refetchQueue();
      refetchStats();
      refetchReady();
    },
  });

  const batchMarkSent = trpc.email.batchMarkSent.useMutation({
    onSuccess: (data) => {
      toast.success(isZh ? `已批量标记 ${data.count} 封为已发送` : `Batch marked ${data.count} as sent`);
      refetchQueue();
      refetchStats();
      refetchReady();
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{isZh ? "需要管理员权限" : "Admin access required"}</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    sent: "bg-green-500/20 text-green-400",
    failed: "bg-red-500/20 text-red-400",
    cancelled: "bg-gray-500/20 text-gray-400",
  };

  const templateLabels: Record<string, string> = {
    welcome: isZh ? "欢迎邮件" : "Welcome",
    conversion: isZh ? "转化邮件" : "Conversion",
    reengagement: isZh ? "召回邮件" : "Re-engagement",
    referral_reward: isZh ? "推荐奖励" : "Referral Reward",
    custom: isZh ? "自定义" : "Custom",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/notifications">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <Mail className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">{isZh ? "邮件营销管理" : "Email Marketing"}</h1>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-yellow-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{stats?.pending || 0}</p>
                <p className="text-xs text-muted-foreground">{isZh ? "待发送" : "Pending"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{stats?.sent || 0}</p>
                <p className="text-xs text-muted-foreground">{isZh ? "已发送" : "Sent"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-red-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{stats?.failed || 0}</p>
                <p className="text-xs text-muted-foreground">{isZh ? "失败" : "Failed"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ready to Send Section */}
        {readyEmails && readyEmails.length > 0 && (
          <Card className="bg-card/50 border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" />
                  {isZh ? `${readyEmails.length} 封邮件已到发送时间` : `${readyEmails.length} emails ready to send`}
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => batchMarkSent.mutate({ ids: readyEmails.map(e => e.id) })}
                  disabled={batchMarkSent.isPending}
                >
                  <MailCheck className="h-3.5 w-3.5 mr-1" />
                  {isZh ? "全部标记已发送" : "Mark All Sent"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-3">
                {isZh
                  ? "提示：复制邮件内容后通过 Gmail 发送，然后点击「标记已发送」"
                  : "Tip: Copy email content, send via Gmail, then click 'Mark Sent'"}
              </p>
              <div className="space-y-2">
                {readyEmails.slice(0, 5).map(email => (
                  <div key={email.id} className="flex items-center justify-between p-2 rounded bg-background/50 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge className={`text-[10px] ${statusColors.pending}`}>{templateLabels[email.templateType]}</Badge>
                      <span className="text-foreground/80 truncate">{email.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-green-400"
                        onClick={() => markSent.mutate({ id: email.id })}
                      >
                        <MailCheck className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: undefined, label: isZh ? "全部" : "All" },
            { value: "pending" as const, label: isZh ? "待发送" : "Pending" },
            { value: "sent" as const, label: isZh ? "已发送" : "Sent" },
            { value: "failed" as const, label: isZh ? "失败" : "Failed" },
            { value: "cancelled" as const, label: isZh ? "已取消" : "Cancelled" },
          ].map(tab => (
            <Button
              key={tab.label}
              variant={statusFilter === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => { refetchQueue(); refetchStats(); refetchReady(); }}>
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> {isZh ? "刷新" : "Refresh"}
          </Button>
        </div>

        {/* Email Queue List */}
        <Card className="bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              {isZh ? "邮件队列" : "Email Queue"}
              {queueData?.total ? <Badge variant="secondary" className="text-xs">{queueData.total}</Badge> : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!queueData?.emails?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>{isZh ? "暂无邮件" : "No emails in queue"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {queueData.emails.map(email => (
                  <div key={email.id} className="border border-border/50 rounded-lg overflow-hidden">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-background/50 transition-colors"
                      onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Badge className={`text-[10px] shrink-0 ${statusColors[email.status]}`}>
                          {email.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {templateLabels[email.templateType]}
                        </Badge>
                        <span className="text-sm text-foreground/80 truncate">{email.email}</span>
                        <span className="text-xs text-muted-foreground hidden md:inline">
                          {email.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {new Date(email.scheduledAt).toLocaleDateString()}
                        </span>
                        {expandedId === email.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    {expandedId === email.id && (
                      <div className="border-t border-border/50 p-3 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">{isZh ? "收件人：" : "To: "}</span>
                            <span className="text-foreground">{email.email}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isZh ? "用户名：" : "Name: "}</span>
                            <span className="text-foreground">{email.userName || "-"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isZh ? "计划发送：" : "Scheduled: "}</span>
                            <span className="text-foreground">{new Date(email.scheduledAt).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{isZh ? "创建时间：" : "Created: "}</span>
                            <span className="text-foreground">{new Date(email.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{isZh ? "主题：" : "Subject: "}</p>
                          <p className="text-sm font-medium">{email.subject}</p>
                        </div>

                        {/* Email Preview */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{isZh ? "邮件预览：" : "Email Preview: "}</p>
                          <div className="border border-border/50 rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                            <iframe
                              srcDoc={email.htmlContent}
                              className="w-full h-[350px] border-0"
                              sandbox="allow-same-origin"
                              title="Email preview"
                            />
                          </div>
                        </div>

                        {/* Copy & Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(email.htmlContent);
                              toast.success(isZh ? "HTML 已复制" : "HTML copied");
                            }}
                          >
                            {isZh ? "复制 HTML" : "Copy HTML"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(`To: ${email.email}\nSubject: ${email.subject}`);
                              toast.success(isZh ? "收件信息已复制" : "Recipient info copied");
                            }}
                          >
                            {isZh ? "复制收件信息" : "Copy Recipient"}
                          </Button>
                          {email.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markSent.mutate({ id: email.id });
                                }}
                              >
                                <MailCheck className="h-3.5 w-3.5 mr-1" />
                                {isZh ? "标记已发送" : "Mark Sent"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelEmail.mutate({ id: email.id });
                                }}
                              >
                                <Ban className="h-3.5 w-3.5 mr-1" />
                                {isZh ? "取消" : "Cancel"}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-card/50 border-primary/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{isZh ? "邮件发送流程" : "Email Sending Workflow"}</p>
                <p>{isZh
                  ? "1. 新用户注册时，系统自动生成欢迎邮件和3天后的转化邮件"
                  : "1. When new users register, the system auto-generates welcome and 3-day conversion emails"}</p>
                <p>{isZh
                  ? "2. 到达发送时间后，邮件会出现在「待发送」区域"
                  : "2. When scheduled time arrives, emails appear in the 'Ready to Send' section"}</p>
                <p>{isZh
                  ? "3. 点击「复制 HTML」和「复制收件信息」，通过 Gmail 发送"
                  : "3. Click 'Copy HTML' and 'Copy Recipient', then send via Gmail"}</p>
                <p>{isZh
                  ? "4. 发送后点击「标记已发送」更新状态"
                  : "4. After sending, click 'Mark Sent' to update status"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
