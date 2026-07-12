import { describe, it, expect } from "vitest";
import {
  extractPullQuote,
  shareSummaryFromReading,
} from "../client/src/lib/reportScan";
import {
  longWaitHint,
  loadingStageLabels,
} from "../client/src/lib/loadingWaitHint";
// Tarot re-export must stay wired to the same shipped helper
import { extractPullQuote as tarotExtract } from "../client/src/lib/tarotReportFormat";

describe("reportScan extractPullQuote (shipped)", () => {
  it("returns first Chinese sentence", () => {
    const q = extractPullQuote(
      "这个命盘呈现出一种由内而外的能量转化与挑战。后面还有很多细节不要出现。"
    );
    expect(q).toContain("能量转化");
    expect(q).not.toContain("后面还有");
  });

  it("strips markdown and respects maxLen", () => {
    const q = extractPullQuote(
      "## 总览\n**重要**：你需要先安静下来，再做决定。继续往下读很多很多字。",
      40
    );
    expect(q).not.toContain("##");
    expect(q).not.toContain("**");
    expect(q.length).toBeLessThanOrEqual(41);
  });

  it("empty input → empty string", () => {
    expect(extractPullQuote("")).toBe("");
    expect(extractPullQuote("   ")).toBe("");
  });

  it("tarotReportFormat re-exports same function behavior", () => {
    const sample = "今日适合沟通。不要冲动决策。";
    expect(tarotExtract(sample)).toBe(extractPullQuote(sample));
  });
});

describe("shareSummaryFromReading", () => {
  it("prefers pull-quote and is non-empty for multi-paragraph text", () => {
    const text = `## 总览\n\n你正在经历一轮清晰的自我整理。\n\n### 建议\n多休息。`;
    const s = shareSummaryFromReading(text, 200);
    expect(s.length).toBeGreaterThan(5);
    expect(s).not.toContain("##");
  });
});

describe("longWaitHint stages (U01)", () => {
  it("bazi/dream/horoscope have type-specific zh/en copy", () => {
    for (const type of ["bazi", "dream", "horoscope"] as const) {
      const earlyZh = longWaitHint(type, 1, true);
      const earlyEn = longWaitHint(type, 1, false);
      const midZh = longWaitHint(type, 20, true);
      const midEn = longWaitHint(type, 20, false);
      expect(earlyZh.length).toBeGreaterThan(4);
      expect(earlyEn.length).toBeGreaterThan(4);
      expect(midZh.length).toBeGreaterThan(4);
      expect(midEn.length).toBeGreaterThan(4);
    }
  });

  it("bazi long wait mentions keep page open band", () => {
    const h = longWaitHint("bazi", 8, true);
    expect(h).toMatch(/秒|打开|细排|命盘/);
  });

  it("loadingStageLabels covers bazi dream horoscope", () => {
    expect(loadingStageLabels("bazi", true).length).toBeGreaterThanOrEqual(4);
    expect(loadingStageLabels("dream", false).length).toBeGreaterThanOrEqual(4);
    expect(loadingStageLabels("horoscope", true).length).toBeGreaterThanOrEqual(4);
  });
});
