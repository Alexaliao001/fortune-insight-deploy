import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Crown,
  MessageSquare,
  Users,
  Bell,
  Mail,
  Share2,
  Home,
  ArrowLeft,
  Settings,
} from "lucide-react";

const NAV: Array<{
  href: string;
  labelZh: string;
  labelEn: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}> = [
  { href: "/admin", labelZh: "总览", labelEn: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/membership", labelZh: "会员/试用", labelEn: "Members", icon: Crown },
  { href: "/admin/contacts", labelZh: "联系表单", labelEn: "Contacts", icon: MessageSquare },
  { href: "/admin/chat", labelZh: "客服", labelEn: "Chat", icon: Users },
  { href: "/admin/notifications", labelZh: "通知", labelEn: "Notify", icon: Bell },
  { href: "/admin/email-marketing", labelZh: "邮件", labelEn: "Email", icon: Mail },
  { href: "/admin/share-stats", labelZh: "分享", labelEn: "Shares", icon: Share2 },
];

export default function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [location] = useLocation();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-3">
          <Settings className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            {isZh ? "需要管理员权限" : "Admin access required"}
          </p>
          <Button asChild variant="outline">
            <Link href="/">{isZh ? "返回首页" : "Home"}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container max-w-6xl flex items-center gap-3 h-14">
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/">
              <Home className="w-4 h-4 mr-1" />
              {isZh ? "站点" : "Site"}
            </Link>
          </Button>
          <div className="h-5 w-px bg-border" />
          <span className="font-semibold text-sm tracking-wide text-[#d4a843]">
            {isZh ? "轻量后台" : "Admin"}
          </span>
          <span className="text-xs text-muted-foreground truncate hidden sm:inline">
            {user.email || user.name}
          </span>
          <div className="flex-1" />
          <Button asChild variant="ghost" size="sm">
            <Link href="/profile">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {isZh ? "个人中心" : "Profile"}
            </Link>
          </Button>
        </div>

        {/* Nav pills */}
        <div className="container max-w-6xl pb-2 overflow-x-auto">
          <nav className="flex gap-1 min-w-max">
            {NAV.map((item) => {
              const active = item.exact
                ? location === item.href
                : location === item.href || location.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    size="sm"
                    variant={active ? "default" : "ghost"}
                    className={
                      active
                        ? "bg-[#d4a843] text-[#1a1030] hover:bg-[#c49a38]"
                        : "text-muted-foreground"
                    }
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                    {isZh ? item.labelZh : item.labelEn}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl py-6 space-y-6">
        {(title || subtitle) && (
          <div>
            {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
