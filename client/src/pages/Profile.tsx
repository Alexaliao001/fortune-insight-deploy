import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DreamSearch from "@/components/DreamSearch";
import TagEditor from "@/components/TagEditor";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useTranslation } from "@/contexts/LanguageContext";
import { 
  User,
  Moon,
  Star,
  Compass,
  Flower2,
  Crown,
  History,
  Settings,
  Heart,
  Calendar,
  ChevronRight,
  CloudMoon,
  Download,
  Loader2,
  Tag,
  BookOpen,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Eye,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, Redirect } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import SEOHead from "@/components/SEOHead";
import ReportDetailModal from "@/components/ReportDetailModal";
import MembershipStatusCard from "@/components/MembershipStatusCard";
import DreamDetailModal from "@/components/DreamDetailModal";
import DreamStatsOverview from "@/components/DreamStatsOverview";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const { t, language } = useTranslation();
  const [isExportingDreams, setIsExportingDreams] = useState(false);
  const [selectedDreamId, setSelectedDreamId] = useState<number | null>(null);
  const [dreamDetailOpen, setDreamDetailOpen] = useState(false);
  const dreamPremium = usePremiumStatus("dream");
  const [isExportingBazi, setIsExportingBazi] = useState(false);
  const [searchFilters, setSearchFilters] = useState<{
    keyword?: string;
    emotions?: string[];
    elements?: string[];
    dreamType?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
  }>({});
  const [isSearching, setIsSearching] = useState(false);

  // 梦境类型标签
  const dreamTypeLabels: Record<string, string> = language === "zh" 
    ? { normal: "普通梦境", nightmare: "噩梦", lucid: "清醒梦", recurring: "重复梦", prophetic: "预知梦" }
    : { normal: "Normal Dream", nightmare: "Nightmare", lucid: "Lucid Dream", recurring: "Recurring Dream", prophetic: "Prophetic Dream" };

  const questionTypeLabels: Record<string, string> = language === "zh"
    ? { love: "爱情姻缘", career: "事业发展", wealth: "财运理财", health: "健康养生", general: "综合运势" }
    : { love: "Love & Relationships", career: "Career & Work", wealth: "Wealth & Finance", health: "Health & Wellness", general: "General Fortune" };

  const { data: tarotHistory } = trpc.tarot.getHistory.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: baziHistory } = trpc.bazi.getHistory.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: growthData } = trpc.growth.getProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: dreamHistory, refetch: refetchDreams } = trpc.dream.getHistory.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // 搜索梦境
  const { data: searchResults, isLoading: isSearchLoading } = trpc.dream.search.useQuery(
    {
      keyword: searchFilters.keyword,
      emotions: searchFilters.emotions,
      elements: searchFilters.elements,
      dreamType: searchFilters.dreamType as any,
      tags: searchFilters.tags,
      startDate: searchFilters.startDate,
      endDate: searchFilters.endDate,
    },
    {
      enabled: isAuthenticated && isSearching,
    }
  );

  // 获取用户所有标签
  const { data: userTags } = trpc.dream.getAllTags.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // 获取梦境统计数据
  const { data: dreamStats } = trpc.dream.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // 更新标签
  const updateTagsMutation = trpc.dream.updateTags.useMutation({
    onSuccess: () => {
      refetchDreams();
    },
  });

  // 搜索处理
  const handleSearch = (filters: any) => {
    const hasFilters = filters.keyword || 
      (filters.emotions && filters.emotions.length > 0) ||
      (filters.elements && filters.elements.length > 0) ||
      filters.dreamType ||
      (filters.tags && filters.tags.length > 0) ||
      filters.startDate ||
      filters.endDate;

    if (hasFilters) {
      setSearchFilters({
        keyword: filters.keyword || undefined,
        emotions: filters.emotions?.length > 0 ? filters.emotions : undefined,
        elements: filters.elements?.length > 0 ? filters.elements : undefined,
        dreamType: filters.dreamType || undefined,
        tags: filters.tags?.length > 0 ? filters.tags : undefined,
        startDate: filters.startDate?.toISOString() || undefined,
        endDate: filters.endDate?.toISOString() || undefined,
      });
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSearchFilters({});
    }
  };

  // 使用搜索结果或原始列表
  const displayDreams = isSearching ? searchResults : dreamHistory;

  // 批量导出梦境日记
  const exportDreamsMutation = trpc.dream.exportBatch.useMutation({
    onSuccess: (data) => {
      const blob = new Blob([data.html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExportingDreams(false);
    },
    onError: () => {
      setIsExportingDreams(false);
    },
  });

  const handleExportAllDreams = () => {
    setIsExportingDreams(true);
    exportDreamsMutation.mutate({});
  };

  // 批量导出八字记录
  const exportBaziMutation = trpc.bazi.exportBatch.useMutation({
    onSuccess: (data) => {
      const blob = new Blob([data.html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExportingBazi(false);
      toast.success(language === "zh" 
        ? `成功导出 ${data.count} 条八字分析记录` 
        : `Successfully exported ${data.count} BaZi analysis records`);
    },
    onError: (error) => {
      setIsExportingBazi(false);
      toast.error(error.message || (language === "zh" ? "导出失败" : "Export failed"));
    },
  });

  const handleExportAllBazi = () => {
    setIsExportingBazi(true);
    exportBaziMutation.mutate({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEOHead titleKey="profile" path="/profile" />
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    if (language === "zh") {
      return d.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StarryBackground />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-5xl">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-2xl font-bold mb-1">{user?.name || (language === "zh" ? "用户" : "User")}</h1>
                    <p className="text-muted-foreground mb-4">{user?.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Moon className="w-4 h-4 text-violet-400" />
                        <span>{t.nav.tarot} {tarotHistory?.length || 0} {language === "zh" ? "次" : "times"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span>{t.nav.bazi} {baziHistory?.length || 0} {language === "zh" ? "次" : "times"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Flower2 className="w-4 h-4 text-rose-400" />
                        <span>{t.userCenter.overview.growthScore} {growthData?.totalPoints || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="bg-cosmic-gold hover:bg-cosmic-gold/90 text-black">
                      <Link href="/membership">
                        <Crown className="w-4 h-4 mr-2" />
                        {language === "zh" ? "升级会员" : "Upgrade"}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/growth">
                        <Flower2 className="w-4 h-4 mr-2" />
                        {language === "zh" ? "查看成长" : "View Growth"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Membership Status */}
          <MembershipStatusCard />

          {user?.role === "admin" && (
            <Card className="glass-card border-[#d4a843]/30 mb-6">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-[#d4a843]/15 flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-[#d4a843]" />
                  </div>
                  <div>
                    <div className="font-medium text-[#d4a843]">
                      {language === "zh" ? "运营后台" : "Admin console"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === "zh"
                        ? "用户 / 试用 / 客服 / 通知 · 轻量管理"
                        : "Users / trials / chat / notify"}
                    </div>
                  </div>
                </div>
                <Button asChild className="bg-[#d4a843] hover:bg-[#c49a38] text-[#1a1030]">
                  <Link href="/admin">
                    {language === "zh" ? "进入后台" : "Open console"}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="tarot" className="space-y-6">
            <TabsList className="glass w-full justify-start">
              <TabsTrigger value="tarot" className="gap-2">
                <Moon className="w-4 h-4" />
                {t.userCenter.tabs.tarotHistory}
              </TabsTrigger>
              <TabsTrigger value="bazi" className="gap-2">
                <Star className="w-4 h-4" />
                {t.userCenter.tabs.baziHistory}
              </TabsTrigger>
              <TabsTrigger value="dream" className="gap-2">
                <CloudMoon className="w-4 h-4" />
                {t.userCenter.tabs.dreamHistory}
              </TabsTrigger>
              <TabsTrigger value="growth" className="gap-2">
                <Flower2 className="w-4 h-4" />
                {t.userCenter.tabs.growth}
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <BookOpen className="w-4 h-4" />
                {language === "zh" ? "我的报告" : "My Reports"}
              </TabsTrigger>
              <TabsTrigger value="charity" className="gap-2">
                <Heart className="w-4 h-4" />
                {language === "zh" ? "公益贡献" : "Charity"}
              </TabsTrigger>
            </TabsList>

            {/* Tarot History */}
            <TabsContent value="tarot">
              <div className="space-y-4">
                {tarotHistory && tarotHistory.length > 0 ? (
                  tarotHistory.map((reading, index) => (
                    <motion.div
                      key={reading.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                <Moon className="w-6 h-6 text-violet-400" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {questionTypeLabels[reading.questionType] || reading.questionType}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(reading.createdAt)}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                          {reading.question && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                              {reading.question}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                      <Moon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t.userCenter.noRecords}</h3>
                      <p className="text-muted-foreground mb-4">
                        {language === "zh" ? "开始您的第一次塔罗占卜吧" : "Start your first tarot reading"}
                      </p>
                      <Button asChild>
                        <Link href="/tarot">{t.tarot.startReading}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Bazi History */}
            <TabsContent value="bazi">
              <div className="space-y-4">
                {/* 导出按钮 */}
                {baziHistory && baziHistory.length > 0 && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={handleExportAllBazi}
                      disabled={isExportingBazi}
                      className="gap-2"
                    >
                      {isExportingBazi ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {language === "zh" ? "导出全部" : "Export All"}
                    </Button>
                  </div>
                )}
                
                {baziHistory && baziHistory.length > 0 ? (
                  baziHistory.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                <Star className="w-6 h-6 text-amber-400" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {analysis.birthYear}{language === "zh" ? "年" : "-"}{analysis.birthMonth}{language === "zh" ? "月" : "-"}{analysis.birthDay}{language === "zh" ? "日" : ""}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(analysis.createdAt)}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t.userCenter.noRecords}</h3>
                      <p className="text-muted-foreground mb-4">
                        {language === "zh" ? "开始您的第一次八字分析吧" : "Start your first BaZi analysis"}
                      </p>
                      <Button asChild>
                        <Link href="/bazi">{t.bazi.form.submit}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Dream History */}
            <TabsContent value="dream">
              <div className="space-y-4">
                {/* 梦境统计概览 */}
                {dreamStats && dreamStats.totalDreams > 0 && (
                  <DreamStatsOverview stats={dreamStats} language={language} />
                )}

                {/* 搜索和导出 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <DreamSearch
                    onSearch={handleSearch}
                    userTags={userTags || []}
                    isLoading={isSearchLoading}
                  />
                  {dreamHistory && dreamHistory.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleExportAllDreams}
                      disabled={isExportingDreams}
                      className="gap-2 shrink-0"
                    >
                      {isExportingDreams ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {t.dream.export}
                    </Button>
                  )}
                </div>

                {/* 标签云 */}
                {userTags && userTags.length > 0 && (
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium">{t.dream.tags}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userTags.map(item => (
                          <Badge 
                            key={item.tag} 
                            variant="secondary"
                            className="cursor-pointer hover:bg-violet-500/30"
                            onClick={() => handleSearch({ tags: [item.tag] })}
                          >
                            {item.tag} ({item.count})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 梦境列表 */}
                {displayDreams && displayDreams.length > 0 ? (
                  displayDreams.map((dream, index) => (
                    <motion.div
                      key={dream.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="glass-card hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedDreamId(dream.id);
                          setDreamDetailOpen(true);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                <CloudMoon className="w-6 h-6 text-indigo-400" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {dream.title || (language === "zh" ? "未命名梦境" : "Untitled Dream")}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(dream.createdAt)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {dream.deepAnalysis && (
                                <Badge className="bg-violet-500/20 text-violet-400 text-xs">
                                  {language === "zh" ? "10维度" : "10D"}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {dreamTypeLabels[dream.dreamType || 'normal'] || dreamTypeLabels.normal}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {dream.dreamContent}
                          </p>
                          {/* Emotion badges */}
                          {((dream as any).emotions as string[] | null)?.length ? (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {((dream as any).emotions as string[]).slice(0, 3).map((e: string) => (
                                <Badge key={e} variant="secondary" className="text-xs bg-rose-500/15 text-rose-400">
                                  <Heart className="w-2.5 h-2.5 mr-0.5" />
                                  {e}
                                </Badge>
                              ))}
                            </div>
                          ) : null}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {((dream.tags as string[] | null) || []).map(tag => (
                                <Badge 
                                  key={tag} 
                                  variant="secondary" 
                                  className="text-xs bg-violet-500/20 text-violet-400"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {(!dream.tags || (dream.tags as string[]).length === 0) && (
                                <span className="text-xs text-muted-foreground">
                                  {language === "zh" ? "暂无标签" : "No tags"}
                                </span>
                              )}
                            </div>
                            <TagEditor
                              dreamId={dream.id}
                              currentTags={(dream.tags as string[] | null) || []}
                              onSave={async (tags) => {
                                await updateTagsMutation.mutateAsync({ dreamId: dream.id, tags });
                              }}
                              trigger={
                                <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 h-7">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {language === "zh" ? "编辑标签" : "Edit Tags"}
                                </Button>
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : isSearching ? (
                  <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                      <CloudMoon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        {language === "zh" ? "未找到匹配的梦境" : "No matching dreams found"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {language === "zh" ? "试试调整筛选条件或搜索关键词" : "Try adjusting your filters or search terms"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-card">
                    <CardContent className="p-12 text-center">
                      <CloudMoon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">{t.userCenter.noRecords}</h3>
                      <p className="text-muted-foreground mb-4">
                        {language === "zh" ? "记录您的梦境，让AI为您解读梦的含义" : "Record your dreams and let AI interpret their meaning"}
                      </p>
                      <Button asChild>
                        <Link href="/dream">{t.dream.form.submit}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Growth Data */}
            <TabsContent value="growth">
              {growthData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-base">
                        {language === "zh" ? "成长概览" : "Growth Overview"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>{language === "zh" ? "当前等级" : "Current Level"}</span>
                          <span className="text-2xl font-bold text-primary">Lv.{growthData.level}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>{language === "zh" ? "总积分" : "Total Points"}</span>
                          <span className="text-2xl font-bold text-cosmic-gold">{growthData.totalPoints}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-base">
                        {language === "zh" ? "成长维度" : "Growth Dimensions"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>{language === "zh" ? "自我认知" : "Self Awareness"}</span>
                          <span className="text-primary">{growthData.selfAwareness}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === "zh" ? "情绪管理" : "Emotional Management"}</span>
                          <span className="text-primary">{growthData.emotionalManagement}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === "zh" ? "亲密关系" : "Relationships"}</span>
                          <span className="text-primary">{growthData.intimateRelationships}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{language === "zh" ? "事业潜能" : "Career Potential"}</span>
                          <span className="text-primary">{growthData.careerPotential}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="glass-card">
                  <CardContent className="p-12 text-center">
                    <Flower2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === "zh" ? "开始您的成长之旅" : "Start Your Growth Journey"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {language === "zh" ? "完成测算和学习，点亮您的生命之花" : "Complete readings and learning to light up your life flower"}
                    </p>
                    <Button asChild>
                      <Link href="/growth">{t.common.viewAll}</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Saved Reports */}
            <TabsContent value="saved">
              <SavedReportsTab language={language} />
            </TabsContent>

            {/* Charity Contributions */}
            <TabsContent value="charity">
              <CharityTab language={language} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Dream Detail Modal */}
      <DreamDetailModal
        dreamId={selectedDreamId}
        open={dreamDetailOpen}
        onOpenChange={setDreamDetailOpen}
        language={language}
        isPaid={dreamPremium.showFullReport}
      />
    </div>
  );
}

// 我的报告Tab组件
function SavedReportsTab({ language }: { language: string }) {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.reports.list.useQuery({
    reportType: filter as any,
    limit: 10,
    offset: page * 10,
  }, { enabled: true });

  const toggleFav = trpc.reports.toggleFavorite.useMutation({
    onSuccess: () => utils.reports.list.invalidate(),
  });

  const deleteReport = trpc.reports.delete.useMutation({
    onSuccess: () => {
      utils.reports.list.invalidate();
      toast.success(language === "zh" ? "报告已删除" : "Report deleted");
    },
  });

  const typeIcons: Record<string, React.ReactNode> = {
    tarot: <Moon className="w-5 h-5 text-cosmic-purple" />,
    bazi: <Star className="w-5 h-5 text-cosmic-gold" />,
    horoscope: <Compass className="w-5 h-5 text-cosmic-blue" />,
    dream: <CloudMoon className="w-5 h-5 text-cosmic-teal" />,
  };

  const typeLabels: Record<string, string> = language === "zh"
    ? { tarot: "塔罗占卜", bazi: "八字精批", horoscope: "星座运势", dream: "AI解梦" }
    : { tarot: "Tarot", bazi: "BaZi", horoscope: "Horoscope", dream: "Dream" };

  const filterOptions = [
    { value: undefined, label: language === "zh" ? "全部" : "All" },
    { value: "tarot", label: language === "zh" ? "塔罗" : "Tarot" },
    { value: "bazi", label: language === "zh" ? "八字" : "BaZi" },
    { value: "horoscope", label: language === "zh" ? "星座" : "Horoscope" },
    { value: "dream", label: language === "zh" ? "解梦" : "Dream" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((opt) => (
          <Button
            key={opt.label}
            variant={filter === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => { setFilter(opt.value); setPage(0); }}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Report count */}
      <div className="text-sm text-muted-foreground">
        {language === "zh" ? `共 ${data?.total ?? 0} 份报告` : `${data?.total ?? 0} reports total`}
      </div>

      {/* Report list */}
      {data?.reports && data.reports.length > 0 ? (
        <div className="space-y-3">
          {data.reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="glass-card hover:border-primary/30 transition-all cursor-pointer" onClick={() => setSelectedReport(report)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      {typeIcons[report.reportType]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{report.title}</h4>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {typeLabels[report.reportType]}
                        </Badge>
                        {report.isPaid && (
                          <Badge className="shrink-0 text-xs bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/30">
                            {language === "zh" ? "付费" : "Premium"}
                          </Badge>
                        )}
                      </div>
                      {report.inputSummary && (
                        <p className="text-sm text-muted-foreground truncate mb-1">{report.inputSummary}</p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString(language === "zh" ? 'zh-CN' : 'en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary/60 hover:text-primary"
                        onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}
                        title={language === "zh" ? "查看报告" : "View Report"}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => { e.stopPropagation(); toggleFav.mutate({ id: report.id }); }}
                      >
                        {report.isFavorite
                          ? <BookmarkCheck className="w-4 h-4 text-cosmic-gold" />
                          : <Bookmark className="w-4 h-4 text-muted-foreground" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive/60 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(language === "zh" ? "确定删除这份报告吗？" : "Delete this report?")) {
                            deleteReport.mutate({ id: report.id });
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === "zh" ? "暂无保存的报告" : "No saved reports yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === "zh"
                ? "完成测算后，报告会自动保存在这里"
                : "Reports will be automatically saved here after each reading"}
            </p>
            <Button asChild>
              <Link href="/">{language === "zh" ? "开始测算" : "Start Reading"}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {data && data.total > 10 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            {language === "zh" ? "上一页" : "Previous"}
          </Button>
          <span className="flex items-center text-sm text-muted-foreground px-3">
            {page + 1} / {Math.ceil(data.total / 10)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={(page + 1) * 10 >= data.total}
            onClick={() => setPage(p => p + 1)}
          >
            {language === "zh" ? "下一页" : "Next"}
          </Button>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          reportId={selectedReport.id}
          initialData={selectedReport}
          onClose={() => setSelectedReport(null)}
          onToggleFavorite={(id) => {
            toggleFav.mutate({ id });
            setSelectedReport((prev: any) => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
          }}
        />
      )}
    </div>
  );
}

// 公益贡献Tab组件
function CharityTab({ language }: { language: string }) {
  const { data: donations, isLoading } = trpc.payment.getCharityDonations.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const totalDonation = donations?.reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0) || 0;

  return (
    <div className="space-y-6">
      {/* 捐赠概览 */}
      <Card className="glass-card border-cosmic-rose/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cosmic-rose/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-cosmic-rose" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {language === "zh" ? "您的公益贡献总额" : "Your Total Charity Contribution"}
              </div>
              <div className="text-3xl font-bold text-cosmic-rose">
                ${totalDonation.toFixed(2)}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {language === "zh" 
              ? "感谢您的爱心！每一笔捐赠都将用于帮助需要帮助的人。"
              : "Thank you for your kindness! Every donation helps those in need."}
          </p>
        </CardContent>
      </Card>

      {/* 捐赠记录列表 */}
      {donations && donations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-medium">{language === "zh" ? "捐赠记录" : "Donation History"}</h3>
          {donations.map((donation, index) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-cosmic-rose/20 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-cosmic-rose" />
                      </div>
                      <div>
                        <div className="font-medium">{donation.projectName}</div>
                        <div className="text-sm text-muted-foreground">
                          {donation.status === 'donated' 
                            ? (language === "zh" ? '已捐赠' : 'Donated')
                            : donation.status === 'pending' 
                              ? (language === "zh" ? '处理中' : 'Pending')
                              : (language === "zh" ? '失败' : 'Failed')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cosmic-rose">${donation.amount}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(donation.createdAt).toLocaleDateString(language === "zh" ? 'zh-CN' : 'en-US')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === "zh" ? "暂无公益捐赠记录" : "No charity donations yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === "zh" 
                ? "开通会员后，您的会员费将有10%用于公益捐赠"
                : "10% of your membership fee goes to charity when you subscribe"}
            </p>
            <Button asChild>
              <Link href="/membership">{language === "zh" ? "开通会员" : "Subscribe"}</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
