import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CloudMoon,
  Brain,
  Heart,
  Sparkles,
  TrendingUp,
  BarChart3,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Ghost,
} from "lucide-react";
import { motion } from "framer-motion";

interface DreamStats {
  totalDreams: number;
  deepAnalysisCount: number;
  emotionDistribution: Record<string, number>;
  elementDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  tagDistribution: Record<string, number>;
  weeklyTimeline: { week: string; count: number }[];
}

interface DreamStatsOverviewProps {
  stats: DreamStats;
  language: string;
}

const emotionColors: Record<string, string> = {
  "恐惧": "bg-red-500", "Fear": "bg-red-500",
  "焦虑": "bg-orange-500", "Anxiety": "bg-orange-500",
  "快乐": "bg-yellow-400", "Joy": "bg-yellow-400",
  "悲伤": "bg-blue-500", "Sadness": "bg-blue-500",
  "困惑": "bg-purple-500", "Confusion": "bg-purple-500",
  "愤怒": "bg-red-600", "Anger": "bg-red-600",
  "平静": "bg-cyan-400", "Calm": "bg-cyan-400",
  "兴奋": "bg-pink-500", "Excitement": "bg-pink-500",
  "孤独": "bg-gray-500", "Loneliness": "bg-gray-500",
  "温暖": "bg-amber-400", "Warmth": "bg-amber-400",
};

const elementIcons: Record<string, typeof Flame> = {
  "水": Droplets, "Water": Droplets,
  "飞翔": Wind, "Flying": Wind,
  "追逐": Ghost, "Chasing": Ghost,
  "坠落": Mountain, "Falling": Mountain,
  "火": Flame, "Fire": Flame,
};

export default function DreamStatsOverview({ stats, language }: DreamStatsOverviewProps) {
  const isZh = language === "zh";
  const maxTimelineCount = Math.max(...stats.weeklyTimeline.map(w => w.count), 1);

  // Top 5 emotions
  const topEmotions = Object.entries(stats.emotionDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const totalEmotions = topEmotions.reduce((s, [, c]) => s + c, 0) || 1;

  // Top 5 elements
  const topElements = Object.entries(stats.elementDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Dream type distribution
  const typeLabels: Record<string, string> = isZh
    ? { normal: "普通", nightmare: "噩梦", lucid: "清醒梦", recurring: "重复梦", prophetic: "预知梦" }
    : { normal: "Normal", nightmare: "Nightmare", lucid: "Lucid", recurring: "Recurring", prophetic: "Prophetic" };

  const typeColors: Record<string, string> = {
    normal: "bg-blue-500",
    nightmare: "bg-red-500",
    lucid: "bg-emerald-500",
    recurring: "bg-amber-500",
    prophetic: "bg-violet-500",
  };

  const totalTypes = Object.values(stats.typeDistribution).reduce((s, c) => s + c, 0) || 1;

  return (
    <div className="space-y-4">
      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="glass-card border-indigo-500/20">
            <CardContent className="p-4 text-center">
              <CloudMoon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-300">{stats.totalDreams}</div>
              <div className="text-xs text-muted-foreground">{isZh ? "梦境总数" : "Total Dreams"}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="glass-card border-violet-500/20">
            <CardContent className="p-4 text-center">
              <Brain className="w-6 h-6 text-violet-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-violet-300">{stats.deepAnalysisCount}</div>
              <div className="text-xs text-muted-foreground">{isZh ? "深度分析" : "Deep Analysis"}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-rose-500/20">
            <CardContent className="p-4 text-center">
              <Heart className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-rose-300">{topEmotions.length > 0 ? topEmotions[0][0] : "—"}</div>
              <div className="text-xs text-muted-foreground">{isZh ? "主导情绪" : "Dominant Emotion"}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass-card border-amber-500/20">
            <CardContent className="p-4 text-center">
              <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-300">{topElements.length > 0 ? topElements[0][0] : "—"}</div>
              <div className="text-xs text-muted-foreground">{isZh ? "常见元素" : "Top Element"}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Timeline + Emotion + Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Weekly Timeline */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium">{isZh ? "梦境频率" : "Dream Frequency"}</span>
              </div>
              <div className="flex items-end gap-1 h-20">
                {stats.weeklyTimeline.map((week, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      className="w-full bg-gradient-to-t from-indigo-500/60 to-violet-500/60 rounded-t-sm min-h-[2px]"
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((week.count / maxTimelineCount) * 100, 3)}%` }}
                      transition={{ delay: 0.3 + i * 0.03, duration: 0.4 }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">{stats.weeklyTimeline[0]?.week}</span>
                <span className="text-[10px] text-muted-foreground">{stats.weeklyTimeline[stats.weeklyTimeline.length - 1]?.week}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass-card h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-medium">{isZh ? "情绪分布" : "Emotion Map"}</span>
              </div>
              <div className="space-y-2">
                {topEmotions.map(([emotion, count]) => (
                  <div key={emotion} className="flex items-center gap-2">
                    <span className="text-xs w-12 truncate">{emotion}</span>
                    <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${emotionColors[emotion] || "bg-gray-400"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / totalEmotions) * 100}%` }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                ))}
                {topEmotions.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    {isZh ? "暂无数据" : "No data yet"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dream Type Distribution */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">{isZh ? "梦境类型" : "Dream Types"}</span>
              </div>
              <div className="space-y-2">
                {Object.entries(stats.typeDistribution)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      <span className="text-xs w-14 truncate">{typeLabels[type] || type}</span>
                      <div className="flex-1 h-3 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${typeColors[type] || "bg-gray-400"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / totalTypes) * 100}%` }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                    </div>
                  ))}
                {Object.keys(stats.typeDistribution).length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    {isZh ? "暂无数据" : "No data yet"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Elements */}
      {topElements.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex flex-wrap gap-2">
            {topElements.map(([element, count]) => {
              const Icon = elementIcons[element] || Sparkles;
              return (
                <Badge key={element} variant="secondary" className="bg-amber-500/15 text-amber-300 gap-1">
                  <Icon className="w-3 h-3" />
                  {element} ({count})
                </Badge>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
