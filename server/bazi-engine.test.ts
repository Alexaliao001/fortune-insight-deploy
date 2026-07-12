import { describe, expect, it } from "vitest";
import { calculateBazi, formatBaziForPrompt } from "./bazi-engine";

describe("bazi-engine", () => {
  describe("calculateBazi", () => {
    it("calculates a valid chart for a known date", () => {
      const chart = calculateBazi(1990, 6, 15, 10, 30, "male");
      
      expect(chart).toBeDefined();
      expect(chart.yearPillar).toBeDefined();
      expect(chart.monthPillar).toBeDefined();
      expect(chart.dayPillar).toBeDefined();
      expect(chart.hourPillar).toBeDefined();
      expect(chart.dayMaster).toBeDefined();
      expect(chart.fiveElements).toBeDefined();
      expect(chart.luckPillars).toBeDefined();
      expect(chart.luckPillars.length).toBeGreaterThan(0);
      
      // Verify pillar structure
      expect(chart.yearPillar.chinese).toBeTruthy();
      expect(chart.yearPillar.heavenlyStem).toBeTruthy();
      expect(chart.yearPillar.earthlyBranch).toBeTruthy();
      expect(chart.yearPillar.stemElement).toBeTruthy();
      expect(chart.yearPillar.branchElement).toBeTruthy();
      expect(chart.yearPillar.animal).toBeTruthy();
      
      // Verify day master
      expect(chart.dayMaster.character).toBeTruthy();
      expect(chart.dayMaster.element).toBeTruthy();
      expect(["Yin", "Yang"]).toContain(chart.dayMaster.yinYang);
      
      // Verify five elements
      const total = Object.values(chart.fiveElements).reduce((a, b) => a + b, 0);
      expect(total).toBeGreaterThan(0);
      
      // Verify birth info echo
      expect(chart.birthYear).toBe(1990);
      expect(chart.birthMonth).toBe(6);
      expect(chart.birthDay).toBe(15);
      expect(chart.gender).toBe("male");
    });

    it("calculates chart for female gender", () => {
      const chart = calculateBazi(1985, 3, 20, 8, 0, "female");
      expect(chart).toBeDefined();
      expect(chart.gender).toBe("female");
      expect(chart.luckPillars.length).toBeGreaterThan(0);
    });

    it("handles edge case: midnight birth", () => {
      const chart = calculateBazi(2000, 1, 1, 0, 0, "male");
      expect(chart).toBeDefined();
      expect(chart.hourPillar).toBeDefined();
    });

    it("handles edge case: late night birth", () => {
      const chart = calculateBazi(1995, 12, 31, 23, 59, "female");
      expect(chart).toBeDefined();
      expect(chart.hourPillar).toBeDefined();
    });
  });

  describe("formatBaziForPrompt", () => {
    it("formats chart in Chinese with all enhanced sections", () => {
      const chart = calculateBazi(1990, 6, 15, 10, 30, "male");
      const formatted = formatBaziForPrompt(chart, "zh");
      
      // Should contain all enhanced sections
      expect(formatted).toContain("四柱八字命盘");
      expect(formatted).toContain("日主分析");
      expect(formatted).toContain("五行分布");
      expect(formatted).toContain("十神汇总");
      expect(formatted).toContain("纳音五行");
      expect(formatted).toContain("日主生旺死绝");
      expect(formatted).toContain("神煞");
      expect(formatted).toContain("大运");
      expect(formatted).toContain("地支关系");
      expect(formatted).toContain("流年信息");
      
      // Should contain gender and birth info
      expect(formatted).toContain("性别");
      expect(formatted).toContain("男");
      expect(formatted).toContain("1990");
    });

    it("formats chart in English with all enhanced sections", () => {
      const chart = calculateBazi(1990, 6, 15, 10, 30, "male");
      const formatted = formatBaziForPrompt(chart, "en");
      
      expect(formatted).toContain("Four Pillars BaZi Chart");
      expect(formatted).toContain("Day Master Analysis");
      expect(formatted).toContain("Five Elements Distribution");
      expect(formatted).toContain("Ten Gods Summary");
      expect(formatted).toContain("NaYin Five Elements");
      expect(formatted).toContain("Day Master Life Cycle");
      expect(formatted).toContain("Special Stars");
      expect(formatted).toContain("Luck Pillars");
      expect(formatted).toContain("Current Year Info");
      expect(formatted).toContain("Gender");
      expect(formatted).toContain("Male");
    });

    it("includes current year pillar information", () => {
      const chart = calculateBazi(1990, 6, 15, 10, 30, "male");
      const formatted = formatBaziForPrompt(chart, "zh");
      
      const currentYear = new Date().getFullYear();
      expect(formatted).toContain(`${currentYear}年`);
      expect(formatted).toContain(`${currentYear + 1}年`);
    });

    it("includes current luck pillar for a person of known age", () => {
      const chart = calculateBazi(1990, 6, 15, 10, 30, "male");
      const formatted = formatBaziForPrompt(chart, "zh");
      
      // Person born in 1990 should have a current luck pillar
      expect(formatted).toContain("当前大运");
    });

    it("includes NaYin for all four pillars", () => {
      const chart = calculateBazi(1990, 6, 15, 10, 30, "male");
      const formatted = formatBaziForPrompt(chart, "zh");
      
      expect(formatted).toContain("年柱纳音");
      expect(formatted).toContain("月柱纳音");
      expect(formatted).toContain("日柱纳音");
      expect(formatted).toContain("时柱纳音");
    });
  });
});
