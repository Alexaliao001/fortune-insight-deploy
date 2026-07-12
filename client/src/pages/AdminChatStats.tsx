import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  MessageSquare, 
  Clock,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
} from "lucide-react";

export default function AdminChatStats() {
  const { user } = useAuth();
  
  // 获取统计数据
  const { data: stats, isLoading } = trpc.chat.adminGetStats.useQuery(undefined, {
    refetchInterval: 30000, // 每30秒刷新一次
  });

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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  // 计算满意度百分比
  const totalRated = stats?.ratingDistribution 
    ? Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0)
    : 0;
  const satisfiedCount = stats?.ratingDistribution 
    ? (stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)
    : 0;
  const satisfactionRate = totalRated > 0 ? Math.round((satisfiedCount / totalRated) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">客服数据统计</h1>
          <p className="text-muted-foreground">实时监控客服服务质量</p>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.totalSessions || 0}</p>
                  <p className="text-sm text-muted-foreground">总会话数</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.avgResponseTime || 0}<span className="text-lg">分钟</span></p>
                  <p className="text-sm text-muted-foreground">平均响应时间</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats?.avgRating || 0}<span className="text-lg">/5</span></p>
                  <p className="text-sm text-muted-foreground">平均评分</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{satisfactionRate}<span className="text-lg">%</span></p>
                  <p className="text-sm text-muted-foreground">满意度</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 会话状态分布 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                会话状态分布
              </CardTitle>
              <CardDescription>当前各状态会话数量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>等待中</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stats?.waitingSessions || 0}</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full transition-all"
                        style={{ 
                          width: `${stats?.totalSessions ? (stats.waitingSessions / stats.totalSessions) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>进行中</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stats?.activeSessions || 0}</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ 
                          width: `${stats?.totalSessions ? (stats.activeSessions / stats.totalSessions) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span>已关闭</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stats?.closedSessions || 0}</span>
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gray-500 rounded-full transition-all"
                        style={{ 
                          width: `${stats?.totalSessions ? (stats.closedSessions / stats.totalSessions) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                评分分布
              </CardTitle>
              <CardDescription>用户评价分布情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats?.ratingDistribution?.[rating as 1|2|3|4|5] || 0;
                  const percentage = totalRated > 0 ? (count / totalRated) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="font-medium">{rating}</span>
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}次
                      </span>
                    </div>
                  );
                })}
              </div>
              {totalRated === 0 && (
                <p className="text-center text-muted-foreground mt-4">暂无评价数据</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 时间维度统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                时间维度统计
              </CardTitle>
              <CardDescription>会话时间分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-3xl font-bold text-primary">{stats?.todaySessions || 0}</p>
                  <p className="text-sm text-muted-foreground">今日会话</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-3xl font-bold text-primary">{stats?.weekSessions || 0}</p>
                  <p className="text-sm text-muted-foreground">本周会话</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                服务质量指标
              </CardTitle>
              <CardDescription>关键服务指标</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">首次响应时间</span>
                  <Badge variant={stats?.avgResponseTime && stats.avgResponseTime <= 5 ? "default" : "secondary"}>
                    {stats?.avgResponseTime || 0} 分钟
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">用户满意度</span>
                  <Badge variant={satisfactionRate >= 80 ? "default" : "secondary"}>
                    {satisfactionRate}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">会话解决率</span>
                  <Badge variant="default">
                    {stats?.totalSessions ? Math.round((stats.closedSessions / stats.totalSessions) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
