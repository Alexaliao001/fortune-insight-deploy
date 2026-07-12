import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Tag,
  Heart,
  Sparkles,
  Moon,
  AlertTriangle,
  Eye,
  RefreshCw,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";

const emotionsZh = ["恐惧", "焦虑", "快乐", "悲伤", "困惑", "愤怒", "平静", "兴奋", "孤独", "温暖"];
const emotionsEn = ["Fear", "Anxiety", "Joy", "Sadness", "Confusion", "Anger", "Calm", "Excitement", "Loneliness", "Warmth"];

const elementsZh = ["水", "飞翔", "追逐", "坠落", "迷路", "考试", "死亡", "动物", "亲人", "陌生人", "房屋", "车辆", "自然", "怪物", "光明"];
const elementsEn = ["Water", "Flying", "Chasing", "Falling", "Lost", "Exam", "Death", "Animals", "Family", "Strangers", "House", "Vehicle", "Nature", "Monster", "Light"];

const dreamTypesZh = [
  { value: "normal", label: "普通梦境", icon: Moon },
  { value: "nightmare", label: "噩梦", icon: AlertTriangle },
  { value: "lucid", label: "清醒梦", icon: Eye },
  { value: "recurring", label: "重复梦", icon: RefreshCw },
  { value: "prophetic", label: "预知梦", icon: Zap },
];

const dreamTypesEn = [
  { value: "normal", label: "Normal Dream", icon: Moon },
  { value: "nightmare", label: "Nightmare", icon: AlertTriangle },
  { value: "lucid", label: "Lucid Dream", icon: Eye },
  { value: "recurring", label: "Recurring Dream", icon: RefreshCw },
  { value: "prophetic", label: "Prophetic Dream", icon: Zap },
];

interface SearchFilters {
  keyword: string;
  emotions: string[];
  elements: string[];
  dreamType: string | null;
  tags: string[];
  startDate: Date | null;
  endDate: Date | null;
}

interface DreamSearchProps {
  onSearch: (filters: SearchFilters) => void;
  userTags?: { tag: string; count: number }[];
  isLoading?: boolean;
}

export default function DreamSearch({ onSearch, userTags = [], isLoading }: DreamSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: "",
    emotions: [],
    elements: [],
    dreamType: null,
    tags: [],
    startDate: null,
    endDate: null,
  });
  const { language } = useTranslation();
  const isZh = language === "zh";

  const commonEmotions = isZh ? emotionsZh : emotionsEn;
  const commonElements = isZh ? elementsZh : elementsEn;
  const dreamTypes = isZh ? dreamTypesZh : dreamTypesEn;

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      keyword: "",
      emotions: [],
      elements: [],
      dreamType: null,
      tags: [],
      startDate: null,
      endDate: null,
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const toggleEmotion = (emotion: string) => {
    setFilters(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const toggleElement = (element: string) => {
    setFilters(prev => ({
      ...prev,
      elements: prev.elements.includes(element)
        ? prev.elements.filter(e => e !== element)
        : [...prev.elements, element]
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const activeFilterCount = 
    (filters.keyword ? 1 : 0) +
    filters.emotions.length +
    filters.elements.length +
    (filters.dreamType ? 1 : 0) +
    filters.tags.length +
    (filters.startDate ? 1 : 0) +
    (filters.endDate ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={isZh ? "搜索梦境内容、标题..." : "Search dream content, title..."}
            value={filters.keyword}
            onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 bg-background/50"
          />
        </div>
        <Button
          variant="outline"
          className={`relative ${showFilters ? 'bg-primary/10 border-primary/50' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          {isZh ? "筛选" : "Filter"}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">{isZh ? "已选：" : "Active:"}</span>
          {filters.emotions.map(emotion => (
            <Badge key={emotion} variant="secondary" className="bg-rose-500/20 text-rose-400">
              {emotion}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleEmotion(emotion)} />
            </Badge>
          ))}
          {filters.elements.map(element => (
            <Badge key={element} variant="secondary" className="bg-amber-500/20 text-amber-400">
              {element}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleElement(element)} />
            </Badge>
          ))}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-violet-500/20 text-violet-400">
              {tag}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => toggleTag(tag)} />
            </Badge>
          ))}
          {filters.dreamType && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              {dreamTypes.find(t => t.value === filters.dreamType)?.label}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, dreamType: null }))} />
            </Badge>
          )}
          {filters.startDate && (
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
              {isZh ? "从" : "From"} {format(filters.startDate, "MM/dd")}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, startDate: null }))} />
            </Badge>
          )}
          {filters.endDate && (
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
              {isZh ? "至" : "To"} {format(filters.endDate, "MM/dd")}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, endDate: null }))} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
            {isZh ? "清除全部" : "Clear All"}
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="glass-card border-primary/20">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-blue-400" />
                    {isZh ? "梦境类型" : "Dream Type"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dreamTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <Badge
                          key={type.value}
                          variant={filters.dreamType === type.value ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            filters.dreamType === type.value
                              ? "bg-blue-500/80"
                              : "hover:bg-blue-500/20"
                          }`}
                          onClick={() => setFilters(prev => ({
                            ...prev,
                            dreamType: prev.dreamType === type.value ? null : type.value
                          }))}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {type.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    {isZh ? "梦中情绪" : "Dream Emotions"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {commonEmotions.map(emotion => (
                      <Badge
                        key={emotion}
                        variant={filters.emotions.includes(emotion) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          filters.emotions.includes(emotion)
                            ? "bg-rose-500/80"
                            : "hover:bg-rose-500/20"
                        }`}
                        onClick={() => toggleEmotion(emotion)}
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {isZh ? "关键元素" : "Key Elements"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {commonElements.map(element => (
                      <Badge
                        key={element}
                        variant={filters.elements.includes(element) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          filters.elements.includes(element)
                            ? "bg-amber-500/80"
                            : "hover:bg-amber-500/20"
                        }`}
                        onClick={() => toggleElement(element)}
                      >
                        {element}
                      </Badge>
                    ))}
                  </div>
                </div>

                {userTags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-violet-400" />
                      {isZh ? "我的标签" : "My Tags"}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {userTags.map(({ tag, count }) => (
                        <Badge
                          key={tag}
                          variant={filters.tags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            filters.tags.includes(tag)
                              ? "bg-violet-500/80"
                              : "hover:bg-violet-500/20"
                          }`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                          <span className="ml-1 text-xs opacity-60">({count})</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-emerald-400" />
                    {isZh ? "日期范围" : "Date Range"}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-[140px] justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {filters.startDate ? format(filters.startDate, "yyyy/MM/dd") : (isZh ? "开始日期" : "Start Date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.startDate || undefined}
                          onSelect={(date) => setFilters(prev => ({ ...prev, startDate: date || null }))}
                          locale={isZh ? zhCN : undefined}
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="text-muted-foreground self-center">{isZh ? "至" : "to"}</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-[140px] justify-start">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {filters.endDate ? format(filters.endDate, "yyyy/MM/dd") : (isZh ? "结束日期" : "End Date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.endDate || undefined}
                          onSelect={(date) => setFilters(prev => ({ ...prev, endDate: date || null }))}
                          locale={isZh ? zhCN : undefined}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <Button onClick={handleSearch} className="flex-1" disabled={isLoading}>
                    <Search className="w-4 h-4 mr-2" />
                    {isZh ? "搜索" : "Search"}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    {isZh ? "重置" : "Reset"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
