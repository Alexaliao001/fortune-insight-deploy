import { Bell, Check, CheckCheck, Trash2, Crown, FileText, Users, Megaphone, Gift, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

const TYPE_ICON_MAP: Record<string, React.ElementType> = {
  system: Settings,
  report: FileText,
  membership: Crown,
  community: Users,
  admin: Megaphone,
  promotion: Gift,
};

const TYPE_COLOR_MAP: Record<string, string> = {
  system: "text-blue-400 bg-blue-400/10",
  report: "text-emerald-400 bg-emerald-400/10",
  membership: "text-[#d4a843] bg-[rgba(212,168,67,0.1)]",
  community: "text-purple-400 bg-purple-400/10",
  admin: "text-orange-400 bg-orange-400/10",
  promotion: "text-pink-400 bg-pink-400/10",
};

const TYPE_LABEL: Record<string, { zh: string; en: string }> = {
  system: { zh: "系统", en: "System" },
  report: { zh: "报告", en: "Report" },
  membership: { zh: "会员", en: "Membership" },
  community: { zh: "社区", en: "Community" },
  admin: { zh: "公告", en: "Announcement" },
  promotion: { zh: "优惠", en: "Promotion" },
};

function timeAgo(date: Date | string, isZh: boolean): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diff < 60) return isZh ? "刚刚" : "Just now";
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return isZh ? `${m}分钟前` : `${m}m ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return isZh ? `${h}小时前` : `${h}h ago`;
  }
  if (diff < 604800) {
    const d2 = Math.floor(diff / 86400);
    return isZh ? `${d2}天前` : `${d2}d ago`;
  }
  return d.toLocaleDateString();
}

export default function Notifications() {
  const { language } = useTranslation();
  const isZh = language === "zh";
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.notification.list.useInfiniteQuery(
      { limit: 20 },
      {
        enabled: isAuthenticated,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const utils = trpc.useUtils();
  const markRead = trpc.notification.markRead.useMutation({
    onSuccess: () => {
      utils.notification.unreadCount.invalidate();
      utils.notification.list.invalidate();
    },
  });
  const markAllRead = trpc.notification.markAllRead.useMutation({
    onSuccess: () => {
      utils.notification.unreadCount.invalidate();
      utils.notification.list.invalidate();
    },
  });
  const deleteNotif = trpc.notification.delete.useMutation({
    onSuccess: () => {
      utils.notification.unreadCount.invalidate();
      utils.notification.list.invalidate();
    },
  });

  const { data: unreadData } = trpc.notification.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container max-w-2xl text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-bold mb-2">
            {isZh ? "请先登录" : "Please log in first"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isZh ? "登录后即可查看您的通知" : "Log in to view your notifications"}
          </p>
          <Button asChild className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a]">
            <a href={getLoginUrl()}>{isZh ? "登录" : "Log In"}</a>
          </Button>
        </div>
      </div>
    );
  }

  const allNotifications = data?.pages.flatMap((page) => page.items) ?? [];
  const unreadCount = unreadData?.count ?? 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">
                {isZh ? "通知中心" : "Notifications"}
              </h1>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {unreadCount} {isZh ? "条未读" : "unread"}
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="border-[rgba(212,168,67,0.3)] text-[#d4a843] hover:bg-[rgba(212,168,67,0.1)]"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              <CheckCheck className="w-4 h-4 mr-1.5" />
              {isZh ? "全部已读" : "Mark all read"}
            </Button>
          )}
        </div>

        {/* Notification List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : allNotifications.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
            <h2 className="text-lg font-semibold mb-2">
              {isZh ? "暂无通知" : "No notifications"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isZh
                ? "当有新的报告、会员更新或社区互动时，您将在这里收到通知"
                : "You'll receive notifications here for new reports, membership updates, and community interactions"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {allNotifications.map((notif) => {
              const IconComponent = TYPE_ICON_MAP[notif.type] || Bell;
              const colorClass = TYPE_COLOR_MAP[notif.type] || "text-muted-foreground bg-muted";
              const label = TYPE_LABEL[notif.type];

              return (
                <div
                  key={notif.id}
                  className={`group glass-card rounded-xl p-4 transition-all ${
                    !notif.isRead
                      ? "border-l-2 border-l-[#d4a843] bg-[rgba(212,168,67,0.03)]"
                      : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {notif.link ? (
                            <Link
                              href={notif.link}
                              className="block"
                              onClick={() => {
                                if (!notif.isRead) markRead.mutate({ id: notif.id });
                              }}
                            >
                              <p className={`text-sm font-semibold ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                {notif.title}
                              </p>
                            </Link>
                          ) : (
                            <p className={`text-sm font-semibold ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                              {notif.title}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colorClass}`}>
                              {isZh ? label?.zh : label?.en}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60">
                              {timeAgo(notif.createdAt, isZh)}
                            </span>
                            {notif.isBroadcast && (
                              <span className="text-[10px] text-muted-foreground/40">
                                {isZh ? "广播" : "Broadcast"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notif.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-[#d4a843]"
                              onClick={() => markRead.mutate({ id: notif.id })}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {!notif.isBroadcast && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-red-400"
                              onClick={() => deleteNotif.mutate({ id: notif.id })}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Load More */}
            {hasNextPage && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[rgba(212,168,67,0.3)] text-[#d4a843]"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? (isZh ? "加载中..." : "Loading...")
                    : (isZh ? "加载更多" : "Load more")}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
