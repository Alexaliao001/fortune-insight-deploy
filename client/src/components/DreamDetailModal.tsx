import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CloudMoon,
  Calendar,
  Heart,
  Sparkles,
  Brain,
  ChevronDown,
  ChevronUp,
  Lock,
  Eye,
  Tag,
  Compass,
  Flame,
  Ghost,
  Moon,
  Shield,
  Lightbulb,
  Footprints,
  Flower2,
  Star,
  Waves,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { trpc } from "@/lib/trpc";

interface DreamDetailModalProps {
  dreamId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
  isPaid?: boolean;
}

const SECTION_CONFIGS = [
  { id: "dreamscape", icon: CloudMoon, color: "text-indigo-400", bg: "bg-indigo-500/15" },
  { id: "symbols", icon: Eye, color: "text-amber-400", bg: "bg-amber-500/15" },
  { id: "emotions", icon: Heart, color: "text-rose-400", bg: "bg-rose-500/15" },
  { id: "archetypes", icon: Ghost, color: "text-violet-400", bg: "bg-violet-500/15" },
  { id: "subconscious", icon: Waves, color: "text-cyan-400", bg: "bg-cyan-500/15" },
  { id: "spiritual", icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/15" },
  { id: "shadow", icon: Shield, color: "text-slate-400", bg: "bg-slate-500/15" },
  { id: "action", icon: Footprints, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  { id: "ritual", icon: Flower2, color: "text-pink-400", bg: "bg-pink-500/15" },
  { id: "affirmation", icon: Lightbulb, color: "text-orange-400", bg: "bg-orange-500/15" },
];

const SECTION_TITLES_ZH = [
  "梦境全景", "核心象征解码", "情绪地图", "荣格原型映射",
  "潜意识流", "灵性与直觉", "阴影工作", "行动建议",
  "仪式与冥想", "梦境肯定语"
];

const SECTION_TITLES_EN = [
  "Dream Landscape", "Core Symbol Decoding", "Emotional Map", "Jungian Archetype Mapping",
  "Subconscious Flow", "Spiritual & Intuitive", "Shadow Work", "Action Guidance",
  "Ritual & Meditation", "Dream Affirmation"
];

const FREE_SECTIONS = 3;

function parseDeepAnalysis(content: string, language: string): { title: string; content: string }[] {
  if (!content) return [];
  const sectionTitles = language === "zh" ? SECTION_TITLES_ZH : SECTION_TITLES_EN;
  const sections: { title: string; content: string }[] = [];

  // Try to split by ## headers
  const headerRegex = /^##\s+(?:\d+[\.\)、]\s*)?(.+)$/gm;
  const matches: { title: string; index: number }[] = [];
  let match;
  while ((match = headerRegex.exec(content)) !== null) {
    matches.push({ title: match[1].trim(), index: match.index });
  }

  if (matches.length >= 5) {
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + content.slice(matches[i].index).indexOf("\n") + 1;
      const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
      const sectionContent = content.slice(start, end).trim();
      sections.push({ title: matches[i].title, content: sectionContent });
    }
  } else {
    // Fallback: split by numbered patterns
    const parts = content.split(/\n(?=\d+[\.\)、])/);
    for (const part of parts) {
      const titleMatch = part.match(/^\d+[\.\)、]\s*(.+?)[\n:：]/);
      if (titleMatch) {
        const title = titleMatch[1].trim();
        const body = part.slice(part.indexOf("\n") + 1).trim();
        sections.push({ title, content: body });
      }
    }
  }

  // Map to section configs
  if (sections.length > 0) return sections;

  // Last fallback: return as single section
  return [{ title: sectionTitles[0], content }];
}

export default function DreamDetailModal({
  dreamId,
  open,
  onOpenChange,
  language,
  isPaid = false,
}: DreamDetailModalProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const isZh = language === "zh";

  const { data: dream, isLoading } = trpc.dream.getById.useQuery(
    { id: dreamId! },
    { enabled: !!dreamId && open }
  );

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Cast dream to typed record to avoid 'unknown' issues with json columns from drizzle
  const d = dream as any;
  const deepSections = d?.deepAnalysis ? parseDeepAnalysis(d.deepAnalysis as string, language) : [];

  const dreamTypeLabels: Record<string, string> = isZh
    ? { normal: "普通梦境", nightmare: "噩梦", lucid: "清醒梦", recurring: "重复梦", prophetic: "预知梦" }
    : { normal: "Normal", nightmare: "Nightmare", lucid: "Lucid", recurring: "Recurring", prophetic: "Prophetic" };

  const emotionColorMap: Record<string, string> = {
    "恐惧": "bg-red-500/20 text-red-400", "Fear": "bg-red-500/20 text-red-400",
    "焦虑": "bg-orange-500/20 text-orange-400", "Anxiety": "bg-orange-500/20 text-orange-400",
    "快乐": "bg-yellow-500/20 text-yellow-400", "Joy": "bg-yellow-500/20 text-yellow-400",
    "悲伤": "bg-blue-500/20 text-blue-400", "Sadness": "bg-blue-500/20 text-blue-400",
    "困惑": "bg-purple-500/20 text-purple-400", "Confusion": "bg-purple-500/20 text-purple-400",
    "愤怒": "bg-red-600/20 text-red-500", "Anger": "bg-red-600/20 text-red-500",
    "平静": "bg-cyan-500/20 text-cyan-400", "Calm": "bg-cyan-500/20 text-cyan-400",
    "兴奋": "bg-pink-500/20 text-pink-400", "Excitement": "bg-pink-500/20 text-pink-400",
    "孤独": "bg-gray-500/20 text-gray-400", "Loneliness": "bg-gray-500/20 text-gray-400",
    "温暖": "bg-amber-500/20 text-amber-400", "Warmth": "bg-amber-500/20 text-amber-400",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 glass-card border-primary/20 overflow-hidden">
        <ScrollArea className="max-h-[85vh]">
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <CloudMoon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-lg">{d?.title || (isZh ? "梦境详情" : "Dream Details")}</div>
                  {d && (
                    <div className="text-sm text-muted-foreground font-normal flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.createdAt).toLocaleDateString(isZh ? "zh-CN" : "en-US", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </div>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : d ? (
              <div className="space-y-4">
                {/* Dream Meta */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                    <Moon className="w-3 h-3 mr-1" />
                    {dreamTypeLabels[d.dreamType || "normal"]}
                  </Badge>
                  {((d.emotions as string[] | null) || []).map((e: string) => (
                    <Badge key={e} className={emotionColorMap[e] || "bg-muted text-muted-foreground"}>
                      <Heart className="w-3 h-3 mr-1" />
                      {e}
                    </Badge>
                  ))}
                  {((d.keyElements as string[] | null) || []).map((el: string) => (
                    <Badge key={el} variant="secondary" className="bg-amber-500/15 text-amber-400">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {el}
                    </Badge>
                  ))}
                </div>

                {/* Dream Content */}
                <Card className="glass-card border-indigo-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CloudMoon className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-medium">{isZh ? "梦境内容" : "Dream Content"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{String(d.dreamContent)}</p>
                  </CardContent>
                </Card>

                {/* Tags */}
                {Array.isArray(d.tags) && d.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <Tag className="w-3 h-3 text-violet-400 mr-1" />
                    {(d.tags as string[]).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-violet-500/20 text-violet-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Basic Interpretation (always shown) */}
                {d.interpretation && !d.deepAnalysis && (
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-medium">{isZh ? "AI 解读" : "AI Interpretation"}</span>
                      </div>
                      <div className="text-sm text-muted-foreground prose prose-invert prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: String(d.interpretation).replace(/\n/g, '<br/>') }} />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Deep Analysis 10 Dimensions */}
                {deepSections.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-medium">
                        {isZh ? `深度梦境分析报告 · ${deepSections.length} 维度` : `Deep Dream Analysis · ${deepSections.length} Dimensions`}
                      </span>
                      {d.deepAnalysis && (
                        <Badge className="bg-violet-500/20 text-violet-400 text-xs">
                          {isZh ? "10维度" : "10D"}
                        </Badge>
                      )}
                    </div>

                    {deepSections.map((section, index) => {
                      const config = SECTION_CONFIGS[index] || SECTION_CONFIGS[0];
                      const Icon = config.icon;
                      const isLocked = !isPaid && index >= FREE_SECTIONS;
                      const isExpanded = expandedSections.has(index);

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Card
                            className={`glass-card cursor-pointer transition-all hover:border-primary/30 ${
                              isLocked ? "opacity-60" : ""
                            }`}
                            onClick={() => !isLocked && toggleSection(index)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${config.color}`} />
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">{section.title}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {isZh ? `第${index + 1}维度` : `Dim ${index + 1}`}
                                    </span>
                                  </div>
                                </div>
                                {isLocked ? (
                                  <Lock className="w-4 h-4 text-muted-foreground" />
                                ) : isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>

                              <AnimatePresence>
                                {isExpanded && !isLocked && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-3 pt-3 border-t border-border/30 text-sm text-muted-foreground prose prose-invert prose-sm max-w-none">
                                      <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }} />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}

                    {!isPaid && deepSections.length > FREE_SECTIONS && (
                      <Card className="glass-card border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-violet-500/5">
                        <CardContent className="p-4 text-center">
                          <Lock className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {isZh
                              ? `解锁剩余 ${deepSections.length - FREE_SECTIONS} 个深度维度分析`
                              : `Unlock remaining ${deepSections.length - FREE_SECTIONS} deep dimensions`}
                          </p>
                          <Button size="sm" className="mt-2 bg-gradient-to-r from-amber-500 to-violet-500" asChild>
                            <a href="/pricing">{isZh ? "升级会员" : "Upgrade"}</a>
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Symbol Analysis */}
                {d.symbolAnalysis && (
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Compass className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium">{isZh ? "符号分析" : "Symbol Analysis"}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(Array.isArray(d.symbolAnalysis) ? (d.symbolAnalysis as any[]) : []).map((item: any, i: number) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/10">
                            <Sparkles className="w-3 h-3 text-amber-400 mt-1 shrink-0" />
                            <div>
                              <span className="text-xs font-medium">{item.symbol || item.name}</span>
                              <p className="text-xs text-muted-foreground">{item.meaning || item.interpretation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {isZh ? "未找到梦境记录" : "Dream record not found"}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
