import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Flower2,
  Brain,
  Heart,
  Users,
  Briefcase,
  Coins,
  Activity,
  Sparkles,
  Star,
  Crown,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, Redirect } from "wouter";
import SEOHead from "@/components/SEOHead";

const dimensionsData = {
  zh: [
    { key: "selfAwareness", label: "自我认知", icon: Brain, color: "#60a5fa", description: "了解自己的性格、价值观和人生目标" },
    { key: "emotionalManagement", label: "情绪管理", icon: Heart, color: "#f472b6", description: "学会识别和调节自己的情绪状态" },
    { key: "intimateRelationships", label: "亲密关系", icon: Users, color: "#fb7185", description: "建立和维护健康的人际关系" },
    { key: "careerPotential", label: "事业潜能", icon: Briefcase, color: "#fbbf24", description: "发掘和发展职业天赋与能力" },
    { key: "wealthMindset", label: "财富思维", icon: Coins, color: "#34d399", description: "培养正确的金钱观和理财能力" },
    { key: "healthWellness", label: "健康养生", icon: Activity, color: "#22d3ee", description: "关注身心健康，保持良好状态" },
    { key: "spiritualGrowth", label: "心灵成长", icon: Sparkles, color: "#a78bfa", description: "探索内心世界，提升精神境界" },
    { key: "socialConnection", label: "社交连接", icon: Star, color: "#fb923c", description: "拓展社交圈，建立有价值的人脉" },
  ],
  en: [
    { key: "selfAwareness", label: "Self Awareness", icon: Brain, color: "#60a5fa", description: "Understand your personality, values, and life goals" },
    { key: "emotionalManagement", label: "Emotional Intelligence", icon: Heart, color: "#f472b6", description: "Learn to recognize and regulate your emotional states" },
    { key: "intimateRelationships", label: "Relationships", icon: Users, color: "#fb7185", description: "Build and maintain healthy interpersonal connections" },
    { key: "careerPotential", label: "Career Potential", icon: Briefcase, color: "#fbbf24", description: "Discover and develop your professional talents" },
    { key: "wealthMindset", label: "Wealth Mindset", icon: Coins, color: "#34d399", description: "Cultivate a healthy relationship with money" },
    { key: "healthWellness", label: "Health & Wellness", icon: Activity, color: "#22d3ee", description: "Focus on physical and mental well-being" },
    { key: "spiritualGrowth", label: "Spiritual Growth", icon: Sparkles, color: "#a78bfa", description: "Explore your inner world and elevate your spirit" },
    { key: "socialConnection", label: "Social Connection", icon: Star, color: "#fb923c", description: "Expand your network and build meaningful connections" },
  ],
};

export default function Growth() {
  const { isAuthenticated, loading } = useAuth();
  const { language } = useLanguage();
  const isZh = language === "zh";
  const dimensions = dimensionsData[isZh ? "zh" : "en"];

  const { data: growthData, isLoading } = trpc.growth.getProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEOHead titleKey="growth" path="/growth" />
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getPercentage = (value: number) => Math.min(100, value);

  const generatePetalPath = (index: number, value: number, total: number) => {
    const angle = (index * 360) / total - 90;
    const radians = (angle * Math.PI) / 180;
    const maxRadius = 120;
    const radius = (value / 100) * maxRadius;
    
    const x = 150 + radius * Math.cos(radians);
    const y = 150 + radius * Math.sin(radians);
    
    return { x, y, angle };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StarryBackground />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
            >
              <Flower2 className="w-4 h-4 text-rose-400" />
              <span className="text-sm text-muted-foreground">
                {isZh ? "生命之花" : "Flower of Life"}
              </span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {isZh ? (
                <>您的<span className="gradient-text">成长轨迹</span></>
              ) : (
                <>Your <span className="gradient-text">Growth Journey</span></>
              )}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {isZh 
                ? "每一次探索都是成长，点亮您生命之花的每一个维度" 
                : "Every exploration is growth — illuminate every dimension of your Flower of Life"}
            </p>
          </div>

          {!isAuthenticated ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <Flower2 className="w-16 h-16 text-rose-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">
                  {isZh ? "开启您的成长之旅" : "Begin Your Growth Journey"}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {isZh 
                    ? "登录后即可查看您的生命之花，追踪每一次测算带来的成长" 
                    : "Sign in to view your Flower of Life and track your growth from every reading"}
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <a href={getLoginUrl()}>{isZh ? "立即登录" : "Sign In"}</a>
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : growthData ? (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">Lv.{growthData.level}</div>
                    <div className="text-sm text-muted-foreground">{isZh ? "当前等级" : "Current Level"}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-cosmic-gold mb-1">{growthData.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">{isZh ? "总积分" : "Total Points"}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-cosmic-rose mb-1">
                      {dimensions.filter(d => (growthData as unknown as Record<string, number>)[d.key] > 0).length}
                    </div>
                    <div className="text-sm text-muted-foreground">{isZh ? "已点亮维度" : "Dimensions Lit"}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">
                      {Array.isArray(growthData.badges) ? growthData.badges.length : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">{isZh ? "成就徽章" : "Badges"}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Life Flower Visualization */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flower2 className="w-5 h-5 text-rose-400" />
                    {isZh ? "生命之花" : "Flower of Life"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* SVG Flower */}
                    <div className="relative">
                      <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
                        {[20, 40, 60, 80, 100].map((percent) => (
                          <circle
                            key={percent}
                            cx="150"
                            cy="150"
                            r={(percent / 100) * 120}
                            fill="none"
                            stroke="currentColor"
                            strokeOpacity="0.1"
                            strokeWidth="1"
                          />
                        ))}
                        
                        {dimensions.map((_, index) => {
                          const angle = (index * 360) / dimensions.length - 90;
                          const radians = (angle * Math.PI) / 180;
                          const x2 = 150 + 120 * Math.cos(radians);
                          const y2 = 150 + 120 * Math.sin(radians);
                          return (
                            <line
                              key={index}
                              x1="150"
                              y1="150"
                              x2={x2}
                              y2={y2}
                              stroke="currentColor"
                              strokeOpacity="0.1"
                              strokeWidth="1"
                            />
                          );
                        })}

                        <motion.polygon
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                          points={dimensions.map((d, i) => {
                            const value = getPercentage((growthData as unknown as Record<string, number>)[d.key] || 0);
                            const { x, y } = generatePetalPath(i, value, dimensions.length);
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="url(#flowerGradient)"
                          fillOpacity="0.3"
                          stroke="url(#flowerGradient)"
                          strokeWidth="2"
                        />

                        <defs>
                          <linearGradient id="flowerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="50%" stopColor="#f472b6" />
                            <stop offset="100%" stopColor="#a78bfa" />
                          </linearGradient>
                        </defs>

                        {dimensions.map((d, index) => {
                          const value = getPercentage((growthData as unknown as Record<string, number>)[d.key] || 0);
                          const { x, y } = generatePetalPath(index, value, dimensions.length);
                          return (
                            <motion.circle
                              key={d.key}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              cx={x}
                              cy={y}
                              r="6"
                              fill={d.color}
                              className="drop-shadow-lg"
                            />
                          );
                        })}

                        <circle cx="150" cy="150" r="20" fill="url(#flowerGradient)" fillOpacity="0.5" />
                        <circle cx="150" cy="150" r="8" fill="white" fillOpacity="0.8" />
                      </svg>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      {dimensions.map((d) => {
                        const Icon = d.icon;
                        const value = (growthData as unknown as Record<string, number>)[d.key] || 0;
                        return (
                          <div key={d.key} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${d.color}20` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: d.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{d.label}</div>
                              <div className="text-xs text-muted-foreground">{value} {isZh ? "点" : "pts"}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dimension Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dimensions.map((d, index) => {
                  const Icon = d.icon;
                  const value = (growthData as unknown as Record<string, number>)[d.key] || 0;
                  const percentage = getPercentage(value);
                  return (
                    <motion.div
                      key={d.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card h-full">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                              style={{ backgroundColor: `${d.color}20` }}
                            >
                              <Icon className="w-6 h-6" style={{ color: d.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold">{d.label}</h3>
                                <span className="text-sm font-medium" style={{ color: d.color }}>
                                  {value} {isZh ? "点" : "pts"}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{d.description}</p>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: d.color }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <Card className="glass-card border-primary/30">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {isZh ? "继续您的成长之旅" : "Continue Your Growth Journey"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isZh ? "每次测算都能获得成长积分" : "Earn growth points with every reading"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button asChild variant="outline">
                        <Link href="/tarot">{isZh ? "塔罗占卜" : "Tarot"}</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/bazi">{isZh ? "八字分析" : "BaZi"}</Link>
                      </Button>
                      <Button asChild className="bg-cosmic-gold hover:bg-cosmic-gold/90 text-black">
                        <Link href="/membership">
                          <Crown className="w-4 h-4 mr-2" />
                          {isZh ? "升级会员" : "Upgrade"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
