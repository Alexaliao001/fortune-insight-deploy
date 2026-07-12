import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, BarChart3, TrendingUp, Globe } from "lucide-react";
import { useLocation } from "wouter";

const PLATFORM_LABELS: Record<string, { label: string; color: string }> = {
  whatsapp: { label: "WhatsApp", color: "#25D366" },
  telegram: { label: "Telegram", color: "#26A5E4" },
  twitter: { label: "X / Twitter", color: "#1DA1F2" },
  wechat: { label: "WeChat", color: "#07C160" },
  weibo: { label: "Weibo", color: "#E6162D" },
  native: { label: "Native Share", color: "#8B5CF6" },
  download: { label: "Download", color: "#F59E0B" },
  copy: { label: "Copy Link", color: "#6B7280" },
};

const TYPE_COLORS: Record<string, string> = {
  tarot: "#7c3aed",
  bazi: "#d97706",
  horoscope: "#06b6d4",
  dream: "#6366f1",
  compatibility: "#ec4899",
};

const TYPE_LABELS: Record<string, { label: string }> = {
  tarot: { label: "Tarot" },
  bazi: { label: "BaZi" },
  horoscope: { label: "Horoscope" },
  dream: { label: "Dream" },
  compatibility: { label: "Compatibility" },
};

export default function AdminShareStats() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const [days, setDays] = useState(30);
  const isEn = language === "en";

  const { data, isLoading } = trpc.shareTracking.stats.useQuery({ days });

  // Calculate max for bar chart scaling
  const maxPlatformCount = useMemo(() => {
    if (!data?.byPlatform?.length) return 1;
    return Math.max(...data.byPlatform.map((p) => Number(p.count)), 1);
  }, [data]);

  const maxTypeCount = useMemo(() => {
    if (!data?.byType?.length) return 1;
    return Math.max(...data.byType.map((t) => Number(t.count)), 1);
  }, [data]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-muted-foreground">{isEn ? "Admin access required" : "需要管理员权限"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-5xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Share2 className="w-6 h-6 text-primary" />
              {isEn ? "Share Analytics" : "分享数据分析"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isEn
                ? `Tracking share events over the last ${days} days`
                : `追踪最近 ${days} 天的分享事件`}
            </p>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex gap-2">
          {[7, 14, 30, 90, 365].map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d}d
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 bg-muted rounded w-16 mb-2" />
                  <div className="h-4 bg-muted rounded w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{data?.total ?? 0}</p>
                      <p className="text-sm text-muted-foreground">
                        {isEn ? "Total Shares" : "总分享次数"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Globe className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{data?.byPlatform?.length ?? 0}</p>
                      <p className="text-sm text-muted-foreground">
                        {isEn ? "Platforms Used" : "使用平台数"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">
                        {data?.byDay?.length
                          ? (Number(data.total) / data.byDay.length).toFixed(1)
                          : "0"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isEn ? "Avg / Day" : "日均分享"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* By Platform */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isEn ? "Shares by Platform" : "按平台统计"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.byPlatform?.length ? (
                  data.byPlatform.map((item) => {
                    const info = PLATFORM_LABELS[item.platform] || {
                      label: item.platform,
                      color: "#6B7280",
                    };
                    const pct = (Number(item.count) / maxPlatformCount) * 100;
                    return (
                      <div key={item.platform} className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: info.color }} />
                        <span className="w-24 text-sm font-medium truncate">{info.label}</span>
                        <div className="flex-1 h-7 bg-muted rounded-full overflow-hidden relative">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(pct, 3)}%`,
                              backgroundColor: info.color,
                              opacity: 0.8,
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-foreground">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    {isEn ? "No share data yet" : "暂无分享数据"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* By Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isEn ? "Shares by Feature" : "按功能统计"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.byType?.length ? (
                  data.byType.map((item) => {
                    const info = TYPE_LABELS[item.type] || {
                      label: item.type,
                    };
                    const typeColor = TYPE_COLORS[item.type] || "#6B7280";
                    const pct = (Number(item.count) / maxTypeCount) * 100;
                    return (
                      <div key={item.type} className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: typeColor }} />
                        <span className="w-24 text-sm font-medium truncate">{info.label}</span>
                        <div className="flex-1 h-7 bg-muted rounded-full overflow-hidden relative">
                          <div
                            className="h-full rounded-full bg-primary/70 transition-all duration-500"
                            style={{ width: `${Math.max(pct, 3)}%` }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-foreground">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    {isEn ? "No share data yet" : "暂无分享数据"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Daily trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isEn ? "Daily Trend" : "每日趋势"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data?.byDay?.length ? (
                  <div className="flex items-end gap-1 h-40">
                    {data.byDay.map((day) => {
                      const maxDay = Math.max(
                        ...data.byDay!.map((d) => Number(d.count)),
                        1
                      );
                      const height = (Number(day.count) / maxDay) * 100;
                      return (
                        <div
                          key={day.date}
                          className="flex-1 group relative"
                          title={`${day.date}: ${day.count}`}
                        >
                          <div
                            className="w-full bg-primary/60 rounded-t transition-all duration-300 hover:bg-primary/80 min-h-[2px]"
                            style={{ height: `${Math.max(height, 2)}%` }}
                          />
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {day.date}: {day.count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    {isEn ? "No daily data yet" : "暂无每日数据"}
                  </p>
                )}
                {data?.byDay?.length ? (
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>{data.byDay[0]?.date}</span>
                    <span>{data.byDay[data.byDay.length - 1]?.date}</span>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
