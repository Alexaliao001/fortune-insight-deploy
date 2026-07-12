import { useState } from "react";
import {
  Bell, Send, Trash2, Users, User, Megaphone, Crown,
  Gift, Settings, FileText, Search, ArrowLeft, Plus, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPE_OPTIONS = [
  { value: "admin", label: { zh: "公告", en: "Announcement" }, icon: Megaphone },
  { value: "system", label: { zh: "系统通知", en: "System" }, icon: Settings },
  { value: "promotion", label: { zh: "优惠活动", en: "Promotion" }, icon: Gift },
  { value: "membership", label: { zh: "会员通知", en: "Membership" }, icon: Crown },
] as const;

const TYPE_COLOR_MAP: Record<string, string> = {
  system: "text-blue-400 bg-blue-400/10",
  report: "text-emerald-400 bg-emerald-400/10",
  membership: "text-[#d4a843] bg-[rgba(212,168,67,0.1)]",
  community: "text-purple-400 bg-purple-400/10",
  admin: "text-orange-400 bg-orange-400/10",
  promotion: "text-pink-400 bg-pink-400/10",
};

const TYPE_ICON_MAP: Record<string, React.ElementType> = {
  system: Settings,
  report: FileText,
  membership: Crown,
  community: Users,
  admin: Megaphone,
  promotion: Gift,
};

export default function AdminNotifications() {
  const { language } = useTranslation();
  const isZh = language === "zh";
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<string>("admin");
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formLink, setFormLink] = useState("");
  const [targetMode, setTargetMode] = useState<"broadcast" | "user">("broadcast");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  // Check admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen pt-24 pb-16 text-center">
        <p className="text-muted-foreground">Admin access required</p>
      </div>
    );
  }

  // Queries
  const { data: notifData, isLoading } = trpc.notification.adminList.useQuery({ limit: 50 });
  const { data: userList } = trpc.notification.adminUserList.useQuery(
    { search: searchQuery, limit: 10 },
    { enabled: targetMode === "user" && searchQuery.length > 0 }
  );

  const utils = trpc.useUtils();
  const sendNotif = trpc.notification.adminSend.useMutation({
    onSuccess: () => {
      toast.success(isZh ? "通知已发送" : "Notification sent");
      utils.notification.adminList.invalidate();
      resetForm();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const deleteNotif = trpc.notification.adminDelete.useMutation({
    onSuccess: () => {
      toast.success(isZh ? "已删除" : "Deleted");
      utils.notification.adminList.invalidate();
    },
  });

  function resetForm() {
    setShowForm(false);
    setFormTitle("");
    setFormMessage("");
    setFormLink("");
    setTargetMode("broadcast");
    setSelectedUserId(null);
    setSelectedUserName("");
    setSearchQuery("");
  }

  function handleSend() {
    if (!formTitle.trim() || !formMessage.trim()) {
      toast.error(isZh ? "请填写标题和内容" : "Please fill in title and message");
      return;
    }
    sendNotif.mutate({
      type: formType as "system" | "admin" | "promotion" | "membership",
      title: formTitle.trim(),
      message: formMessage.trim(),
      link: formLink.trim() || undefined,
      targetUserId: targetMode === "user" ? (selectedUserId ?? undefined) : undefined,
    });
  }

  const allNotifs = notifData?.items ?? [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{isZh ? "通知管理" : "Notification Manager"}</h1>
              <p className="text-xs text-muted-foreground">
                {isZh ? `共 ${notifData?.total ?? 0} 条通知` : `${notifData?.total ?? 0} notifications total`}
              </p>
            </div>
          </div>
          <Button
            className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a]"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X className="w-4 h-4 mr-1.5" /> : <Plus className="w-4 h-4 mr-1.5" />}
            {showForm ? (isZh ? "取消" : "Cancel") : (isZh ? "发送通知" : "Send Notification")}
          </Button>
        </div>

        {/* Send Form */}
        {showForm && (
          <div className="glass-card rounded-xl p-6 mb-6 border border-[rgba(212,168,67,0.2)]">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-[#d4a843]" />
              {isZh ? "发送新通知" : "Send New Notification"}
            </h2>

            <div className="space-y-4">
              {/* Target */}
              <div className="flex gap-2">
                <Button
                  variant={targetMode === "broadcast" ? "default" : "outline"}
                  size="sm"
                  className={targetMode === "broadcast" ? "bg-[#d4a843] text-[#0d0f1a]" : "border-[rgba(212,168,67,0.3)]"}
                  onClick={() => { setTargetMode("broadcast"); setSelectedUserId(null); setSelectedUserName(""); }}
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  {isZh ? "全体广播" : "Broadcast All"}
                </Button>
                <Button
                  variant={targetMode === "user" ? "default" : "outline"}
                  size="sm"
                  className={targetMode === "user" ? "bg-[#d4a843] text-[#0d0f1a]" : "border-[rgba(212,168,67,0.3)]"}
                  onClick={() => setTargetMode("user")}
                >
                  <User className="w-4 h-4 mr-1.5" />
                  {isZh ? "指定用户" : "Specific User"}
                </Button>
              </div>

              {/* User Search */}
              {targetMode === "user" && (
                <div>
                  {selectedUserId ? (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[rgba(212,168,67,0.05)] border border-[rgba(212,168,67,0.15)]">
                      <User className="w-4 h-4 text-[#d4a843]" />
                      <span className="text-sm">{selectedUserName}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto"
                        onClick={() => { setSelectedUserId(null); setSelectedUserName(""); }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder={isZh ? "搜索用户名或邮箱..." : "Search by name or email..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                      {userList && userList.length > 0 && searchQuery && (
                        <div className="absolute top-full mt-1 left-0 right-0 glass-card border border-[rgba(212,168,67,0.15)] rounded-lg overflow-hidden z-10">
                          {userList.map((u) => (
                            <button
                              key={u.id}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[rgba(212,168,67,0.05)] text-left"
                              onClick={() => {
                                setSelectedUserId(u.id);
                                setSelectedUserName(`${u.name || "User"} (${u.email})`);
                                setSearchQuery("");
                              }}
                            >
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>{u.name || "User"}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{u.email}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Type */}
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <opt.icon className="w-4 h-4" />
                        {isZh ? opt.label.zh : opt.label.en}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Title */}
              <Input
                placeholder={isZh ? "通知标题" : "Notification title"}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                maxLength={200}
              />

              {/* Message */}
              <textarea
                className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                placeholder={isZh ? "通知内容..." : "Notification message..."}
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                maxLength={2000}
              />

              {/* Link (optional) */}
              <Input
                placeholder={isZh ? "链接（可选，如 /membership）" : "Link (optional, e.g. /membership)"}
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                maxLength={500}
              />

              {/* Send Button */}
              <Button
                className="w-full bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a]"
                onClick={handleSend}
                disabled={sendNotif.isPending || !formTitle.trim() || !formMessage.trim() || (targetMode === "user" && !selectedUserId)}
              >
                <Send className="w-4 h-4 mr-2" />
                {sendNotif.isPending
                  ? (isZh ? "发送中..." : "Sending...")
                  : targetMode === "broadcast"
                    ? (isZh ? "广播给所有用户" : "Broadcast to all users")
                    : (isZh ? "发送给指定用户" : "Send to selected user")}
              </Button>
            </div>
          </div>
        )}

        {/* Notification History */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{isZh ? "通知历史" : "Notification History"}</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : allNotifs.length === 0 ? (
            <div className="glass-card rounded-xl p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
              <p className="text-muted-foreground">
                {isZh ? "暂无通知记录" : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {allNotifs.map((notif) => {
                const IconComponent = TYPE_ICON_MAP[notif.type] || Bell;
                const colorClass = TYPE_COLOR_MAP[notif.type] || "text-muted-foreground bg-muted";

                return (
                  <div key={notif.id} className="group glass-card rounded-xl p-4">
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold">{notif.title}</p>
                            <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground/60">
                              <span className={`px-1.5 py-0.5 rounded-full ${colorClass}`}>
                                {notif.type}
                              </span>
                              {notif.isBroadcast ? (
                                <span className="flex items-center gap-0.5">
                                  <Users className="w-3 h-3" /> Broadcast
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5">
                                  <User className="w-3 h-3" /> User #{notif.userId}
                                </span>
                              )}
                              {notif.link && (
                                <span className="text-[#d4a843]">→ {notif.link}</span>
                              )}
                              <span>{new Date(notif.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400"
                            onClick={() => deleteNotif.mutate({ id: notif.id })}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
