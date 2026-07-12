import AdminShell from "@/components/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import {
  Users,
  Crown,
  Sparkles,
  MessageSquare,
  Headphones,
  KeyRound,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ElementType;
  tone?: "default" | "gold" | "green" | "blue";
}) {
  const tones = {
    default: "text-foreground bg-muted/40",
    gold: "text-[#d4a843] bg-[#d4a843]/10",
    green: "text-emerald-400 bg-emerald-500/10",
    blue: "text-sky-400 bg-sky-500/10",
  };
  return (
    <Card>
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`p-2 rounded-lg ${tones[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold tabular-nums leading-none">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
          {hint && <div className="text-[11px] text-muted-foreground/80 mt-0.5">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const { data, isLoading, refetch, isFetching } = trpc.admin.overview.useQuery(undefined, {
    refetchInterval: 60_000,
  });

  const memberLabel = (m: string | null) => {
    if (!m) return isZh ? "免费" : "Free";
    if (m === "trial") return isZh ? "试用中" : "Trial";
    if (m === "lifetime") return isZh ? "终身" : "Lifetime";
    if (m === "yearly") return isZh ? "年度" : "Yearly";
    if (m === "monthly") return isZh ? "月度" : "Monthly";
    return m;
  };

  return (
    <AdminShell
      title={isZh ? "运营总览" : "Ops Overview"}
      subtitle={
        isZh
          ? "轻量后台 · 看数据、管会员、回消息"
          : "Lightweight console · stats, members, inbox"
      }
    >
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
          {isZh ? "刷新" : "Refresh"}
        </Button>
      </div>

      {isLoading || !data ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 h-20" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              tone="blue"
              label={isZh ? "总用户" : "Total users"}
              value={data.users.total}
              hint={
                isZh
                  ? `近7天 +${data.users.last7d} · 24h +${data.users.last24h}`
                  : `7d +${data.users.last7d} · 24h +${data.users.last24h}`
              }
            />
            <StatCard
              icon={Sparkles}
              tone="green"
              label={isZh ? "试用中" : "Active trials"}
              value={data.membership.activeTrial}
              hint={
                isZh
                  ? `付费会员 ${data.membership.activePaid} · 已过期 ${data.membership.expired}`
                  : `Paid ${data.membership.activePaid} · Expired ${data.membership.expired}`
              }
            />
            <StatCard
              icon={Crown}
              tone="gold"
              label={isZh ? "测算总量" : "Total readings"}
              value={data.readings.tarot + data.readings.bazi + data.readings.dream}
              hint={
                isZh
                  ? `塔罗 ${data.readings.tarot} · 八字 ${data.readings.bazi} · 解梦 ${data.readings.dream}`
                  : `Tarot ${data.readings.tarot} · BaZi ${data.readings.bazi} · Dream ${data.readings.dream}`
              }
            />
            <StatCard
              icon={MessageSquare}
              label={isZh ? "近7天测算" : "Readings (7d)"}
              value={data.readings.last7d}
              hint={
                isZh
                  ? `待处理联系 ${data.ops.openContacts} · 排队客服 ${data.ops.waitingChats}`
                  : `Contacts ${data.ops.openContacts} · Waiting chat ${data.ops.waitingChats}`
              }
            />
          </div>

          {/* Quick actions */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/admin/membership",
                title: isZh ? "会员与试用" : "Members & trials",
                desc: isZh
                  ? "赠送会员、兑换码、撤销权限"
                  : "Gift membership, codes, revoke",
                icon: Crown,
              },
              {
                href: "/admin/contacts",
                title: isZh ? "联系表单" : "Contact forms",
                desc: isZh
                  ? `${data.ops.openContacts} 条记录`
                  : `${data.ops.openContacts} submissions`,
                icon: MessageSquare,
              },
              {
                href: "/admin/chat",
                title: isZh ? "在线客服" : "Live chat",
                desc: isZh
                  ? `${data.ops.waitingChats} 人排队`
                  : `${data.ops.waitingChats} waiting`,
                icon: Headphones,
              },
              {
                href: "/admin/notifications",
                title: isZh ? "通知广播" : "Notifications",
                desc: isZh ? "给用户发站内信" : "Broadcast in-app messages",
                icon: MessageSquare,
              },
              {
                href: "/admin/share-stats",
                title: isZh ? "分享数据" : "Share analytics",
                desc: isZh ? "看传播渠道" : "Channel performance",
                icon: KeyRound,
              },
              {
                href: "/admin/email-marketing",
                title: isZh ? "邮件营销" : "Email marketing",
                desc: isZh ? "欢迎信 / 转化信队列" : "Welcome & conversion queue",
                icon: KeyRound,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="hover:border-[#d4a843]/40 transition-colors cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-4 h-4 text-[#d4a843]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {item.desc}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Recent users */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {isZh ? "最近注册用户" : "Recent signups"}
              </CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/membership">
                  {isZh ? "管理权限" : "Manage access"}
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {!data.recentUsers.length ? (
                <p className="text-sm text-muted-foreground p-4">
                  {isZh ? "还没有用户" : "No users yet"}
                </p>
              ) : (
                <div className="divide-y divide-border/60">
                  {data.recentUsers.map((u) => (
                    <div
                      key={u.id}
                      className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {u.name || (isZh ? "未命名" : "Unnamed")}
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            · #{u.id}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {u.email || "—"} · {u.loginMethod || "—"}
                        </div>
                      </div>
                      <div className="text-xs">
                        <span
                          className={
                            u.membershipLabel === "trial"
                              ? "text-emerald-400"
                              : u.membershipLabel
                                ? "text-[#d4a843]"
                                : "text-muted-foreground"
                          }
                        >
                          {memberLabel(u.membershipLabel)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {new Date(u.createdAt).toLocaleString(
                          isZh ? "zh-CN" : "en-US",
                          { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AdminShell>
  );
}
