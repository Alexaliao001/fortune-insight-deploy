import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Crown, FileText, Users, Megaphone, Gift, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "@/contexts/LanguageContext";
import { Link } from "wouter";

const ICON_MAP: Record<string, React.ElementType> = {
  crown: Crown,
  file: FileText,
  users: Users,
  megaphone: Megaphone,
  gift: Gift,
  settings: Settings,
};

const TYPE_ICON_MAP: Record<string, React.ElementType> = {
  system: Settings,
  report: FileText,
  membership: Crown,
  community: Users,
  admin: Megaphone,
  promotion: Gift,
};

const TYPE_COLOR_MAP: Record<string, string> = {
  system: "text-blue-400",
  report: "text-emerald-400",
  membership: "text-[#d4a843]",
  community: "text-purple-400",
  admin: "text-orange-400",
  promotion: "text-pink-400",
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

export default function NotificationBell() {
  const { language } = useTranslation();
  const isZh = language === "zh";
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = trpc.notification.unreadCount.useQuery(undefined, {
    refetchInterval: 30000, // Poll every 30s
  });

  const { data: notifData, isLoading } = trpc.notification.list.useQuery(
    { limit: 10 },
    { enabled: open }
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

  const unreadCount = unreadData?.count ?? 0;
  const notifications = notifData?.items ?? [];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-lg text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 glass-card border border-[rgba(212,168,67,0.15)] rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(212,168,67,0.1)]">
            <h3 className="text-sm font-semibold">
              {isZh ? "通知" : "Notifications"}
              {unreadCount > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({unreadCount} {isZh ? "未读" : "unread"})
                </span>
              )}
            </h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-[#d4a843] hover:text-[#d4a843] hover:bg-[rgba(212,168,67,0.1)]"
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                >
                  <CheckCheck className="w-3.5 h-3.5 mr-1" />
                  {isZh ? "全部已读" : "Read all"}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => setOpen(false)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                {isZh ? "加载中..." : "Loading..."}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  {isZh ? "暂无通知" : "No notifications yet"}
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const IconComponent = (notif.icon && ICON_MAP[notif.icon]) || TYPE_ICON_MAP[notif.type] || Bell;
                const colorClass = TYPE_COLOR_MAP[notif.type] || "text-muted-foreground";

                return (
                  <div
                    key={notif.id}
                    className={`group flex gap-3 px-4 py-3 border-b border-[rgba(212,168,67,0.05)] transition-colors hover:bg-[rgba(212,168,67,0.03)] ${
                      !notif.isRead ? "bg-[rgba(212,168,67,0.05)]" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 mt-0.5 ${colorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {notif.link ? (
                        <Link
                          href={notif.link}
                          className="block"
                          onClick={() => {
                            if (!notif.isRead) markRead.mutate({ id: notif.id });
                            setOpen(false);
                          }}
                        >
                          <p className={`text-sm font-medium truncate ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                        </Link>
                      ) : (
                        <>
                          <p className={`text-sm font-medium truncate ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                        </>
                      )}
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {timeAgo(notif.createdAt, isZh)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.isRead && (
                        <button
                          className="p-1 rounded hover:bg-[rgba(212,168,67,0.1)] text-muted-foreground hover:text-[#d4a843]"
                          title={isZh ? "标记已读" : "Mark as read"}
                          onClick={() => markRead.mutate({ id: notif.id })}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!notif.isBroadcast && (
                        <button
                          className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                          title={isZh ? "删除" : "Delete"}
                          onClick={() => deleteNotif.mutate({ id: notif.id })}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-[rgba(212,168,67,0.1)] text-center">
              <Link
                href="/notifications"
                className="text-xs text-[#d4a843] hover:underline"
                onClick={() => setOpen(false)}
              >
                {isZh ? "查看全部通知" : "View all notifications"}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
