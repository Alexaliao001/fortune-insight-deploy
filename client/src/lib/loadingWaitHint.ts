export type LoadingRitualType =
  | "tarot"
  | "bazi"
  | "dream"
  | "horoscope"
  | "compatibility";

/**
 * Expected wait bands for LLM jobs (F2-2 / PRODUCT_UX U01).
 * Type-specific stage copy for bazi vs dream vs faster products.
 */
export function longWaitHint(
  type: LoadingRitualType,
  elapsedSec: number,
  isZh: boolean
): string {
  const n = Math.floor(elapsedSec);

  if (type === "bazi") {
    if (elapsedSec < 3) {
      return isZh
        ? "正在推算天干地支与四柱…"
        : "Calculating stems, branches, and four pillars…";
    }
    if (elapsedSec < 12) {
      return isZh
        ? "正在细排命盘 · 八字精批通常需要 30–90 秒，请保持页面打开"
        : "Refining the chart · BaZi often takes 30–90s — keep this page open";
    }
    if (elapsedSec < 45) {
      return isZh
        ? `已等待 ${n} 秒 · 正在分析五行与格局，请勿关闭`
        : `${n}s elapsed · analyzing elements & patterns — please wait`;
    }
    if (elapsedSec < 90) {
      return isZh
        ? `已等待 ${n} 秒 · 仍在生成深度报告，马上好`
        : `${n}s · still writing your deep report — almost there`;
    }
    return isZh
      ? `已等待 ${n} 秒 · 复杂盘局会更久，请稍候`
      : `${n}s · complex charts take longer — hang tight`;
  }

  if (type === "dream") {
    if (elapsedSec < 3) {
      return isZh
        ? "正在进入潜意识空间…"
        : "Entering the subconscious space…";
    }
    if (elapsedSec < 12) {
      return isZh
        ? "正在解读梦象 · 解梦通常需要 30–90 秒，请保持页面打开"
        : "Decoding dream images · often 30–90s — keep this page open";
    }
    if (elapsedSec < 45) {
      return isZh
        ? `已等待 ${n} 秒 · 仍在梳理象征与情绪`
        : `${n}s elapsed · still mapping symbols & feelings`;
    }
    if (elapsedSec < 90) {
      return isZh
        ? `已等待 ${n} 秒 · 深度解析进行中，马上好`
        : `${n}s · deep analysis in progress — almost there`;
    }
    return isZh
      ? `已等待 ${n} 秒 · 长梦境会更久，请稍候`
      : `${n}s · longer dreams take more time — hang tight`;
  }

  // tarot / horoscope / compatibility — shorter band
  if (elapsedSec < 3) {
    return isZh
      ? "AI 正在为您生成个性化分析…"
      : "AI is generating your personalized analysis…";
  }
  if (elapsedSec < 20) {
    return isZh ? "通常十几秒内完成，请稍候…" : "Usually finishes within ~15s…";
  }
  return isZh
    ? `已等待 ${n} 秒 · 即将完成`
    : `${n}s elapsed · nearly done`;
}

/** Stage labels for structure tests / optional UI progress dots. */
export function loadingStageLabels(
  type: LoadingRitualType,
  isZh: boolean
): string[] {
  if (type === "bazi") {
    return isZh
      ? ["推算干支", "排列四柱", "五行生克", "十神大运", "格局用神", "生成报告"]
      : ["Stems", "Pillars", "Elements", "Ten Gods", "Patterns", "Report"];
  }
  if (type === "dream") {
    return isZh
      ? ["进入潜意识", "捕捉意象", "符号原型", "情绪地图", "深层含义", "生成报告"]
      : ["Subconscious", "Imagery", "Symbols", "Emotions", "Meaning", "Report"];
  }
  if (type === "horoscope") {
    return isZh
      ? ["观测星象", "行星相位", "能量场", "宫位互动", "趋势整合", "生成报告"]
      : ["Sky", "Aspects", "Energy", "Houses", "Trends", "Report"];
  }
  if (type === "compatibility") {
    return isZh
      ? ["双方星盘", "相位互动", "情感共鸣", "沟通匹配", "长期潜力", "生成报告"]
      : ["Charts", "Aspects", "Chemistry", "Values", "Long-term", "Report"];
  }
  return isZh
    ? ["连接能量", "感应问题", "解读符号", "能量流动", "整合信息", "生成报告"]
    : ["Connect", "Sense", "Decode", "Flow", "Integrate", "Report"];
}
