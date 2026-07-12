import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivityMessage {
  textZh: string;
  textEn: string;
}

// Simulated live activity messages that rotate
const activityTemplatesZh = [
  "刚刚有人完成了爱情塔罗占卜",
  "有 {n} 人正在查看今日星座运势",
  "过去1小时内 {n} 人进行了八字分析",
  "刚刚有人解锁了深度命盘报告",
  "{city}的用户刚完成了合盘分析",
  "今日已有 {n} 人记录了梦境日记",
  "刚刚有人分享了塔罗解读到社区",
];

const activityTemplatesEn = [
  "Someone just completed a Love Tarot reading",
  "{n} people are viewing today's horoscope",
  "{n} people analyzed their BaZi in the past hour",
  "Someone just unlocked a deep destiny report",
  "A user from {city} just completed compatibility analysis",
  "{n} people recorded dream journals today",
  "Someone just shared their Tarot reading to community",
];

const cities = ["北京", "上海", "纽约", "伦敦", "东京", "新加坡", "悉尼", "多伦多"];
const citiesEn = ["Beijing", "Shanghai", "New York", "London", "Tokyo", "Singapore", "Sydney", "Toronto"];

function generateActivity(isEn: boolean): string {
  const templates = isEn ? activityTemplatesEn : activityTemplatesZh;
  const cityList = isEn ? citiesEn : cities;
  const idx = Math.floor(Math.random() * templates.length);
  let text = templates[idx];
  text = text.replace("{n}", String(Math.floor(Math.random() * 20) + 5));
  text = text.replace("{city}", cityList[Math.floor(Math.random() * cityList.length)]);
  return text;
}

export default function LiveActivityIndicator() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [activity, setActivity] = useState("");
  const [visible, setVisible] = useState(false);

  const showNewActivity = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setActivity(generateActivity(isEn));
      setVisible(true);
    }, 300);

    // Auto-hide after 4 seconds
    setTimeout(() => {
      setVisible(false);
    }, 4300);
  }, [isEn]);

  useEffect(() => {
    // Show first activity after 3 seconds
    const initialTimer = setTimeout(showNewActivity, 3000);
    // Then rotate every 8 seconds
    const interval = setInterval(showNewActivity, 8000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [showNewActivity]);

  return (
    <div
      className="flex items-center justify-center gap-2 text-xs text-white/50 h-6 overflow-hidden"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-1.5 transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span>{activity}</span>
      </div>
    </div>
  );
}
