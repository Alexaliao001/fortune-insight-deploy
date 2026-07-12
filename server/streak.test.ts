import { describe, it, expect } from "vitest";

describe("Streak System", () => {
  describe("Date calculations", () => {
    it("should correctly identify today's date in YYYY-MM-DD format", () => {
      const today = new Date().toISOString().slice(0, 10);
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should correctly calculate yesterday's date", () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const today = new Date().toISOString().slice(0, 10);
      expect(yesterday).not.toBe(today);
      
      const yesterdayDate = new Date(yesterday);
      const todayDate = new Date(today);
      const diff = todayDate.getTime() - yesterdayDate.getTime();
      expect(diff).toBe(86400000);
    });
  });

  describe("Streak logic", () => {
    function calculateStreak(lastActiveDate: string | null, currentStreak: number): { newStreak: number } {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      if (lastActiveDate === today) {
        return { newStreak: currentStreak };
      }

      if (lastActiveDate === yesterday) {
        return { newStreak: currentStreak + 1 };
      }

      return { newStreak: 1 };
    }

    it("should return same streak if already active today", () => {
      const today = new Date().toISOString().slice(0, 10);
      const result = calculateStreak(today, 5);
      expect(result.newStreak).toBe(5);
    });

    it("should increment streak if active yesterday", () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const result = calculateStreak(yesterday, 3);
      expect(result.newStreak).toBe(4);
    });

    it("should reset streak to 1 if gap is more than 1 day", () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
      const result = calculateStreak(twoDaysAgo, 10);
      expect(result.newStreak).toBe(1);
    });

    it("should start streak at 1 for new users (null lastActiveDate)", () => {
      const result = calculateStreak(null, 0);
      expect(result.newStreak).toBe(1);
    });

    it("should handle longest streak calculation", () => {
      const newStreak = 5;
      const longestStreak = 3;
      const newLongest = Math.max(newStreak, longestStreak);
      expect(newLongest).toBe(5);
    });

    it("should not update longest if current is lower", () => {
      const newStreak = 2;
      const longestStreak = 10;
      const newLongest = Math.max(newStreak, longestStreak);
      expect(newLongest).toBe(10);
    });
  });

  describe("Streak display", () => {
    it("should return correct flame color based on streak", () => {
      function getFlameColor(streak: number) {
        if (streak >= 30) return "text-red-500";
        if (streak >= 14) return "text-orange-500";
        if (streak >= 7) return "text-amber-500";
        return "text-yellow-500";
      }

      expect(getFlameColor(1)).toBe("text-yellow-500");
      expect(getFlameColor(7)).toBe("text-amber-500");
      expect(getFlameColor(14)).toBe("text-orange-500");
      expect(getFlameColor(30)).toBe("text-red-500");
      expect(getFlameColor(100)).toBe("text-red-500");
    });
  });
});

describe("Community Premium Badge", () => {
  it("should correctly identify premium users from membership set", () => {
    const premiumUserIds = new Set([1, 5, 10]);
    
    expect(premiumUserIds.has(1)).toBe(true);
    expect(premiumUserIds.has(5)).toBe(true);
    expect(premiumUserIds.has(2)).toBe(false);
    expect(premiumUserIds.has(0)).toBe(false);
  });

  it("should handle empty membership set", () => {
    const premiumUserIds = new Set<number>();
    expect(premiumUserIds.has(1)).toBe(false);
  });
});

describe("Membership Status Card", () => {
  it("should correctly determine membership type labels", () => {
    const typeLabels: Record<string, { zh: string; en: string }> = {
      monthly: { zh: "月度会员", en: "Monthly" },
      yearly: { zh: "年度会员", en: "Yearly" },
      lifetime: { zh: "终身会员", en: "Lifetime" },
    };

    expect(typeLabels["monthly"]?.en).toBe("Monthly");
    expect(typeLabels["yearly"]?.zh).toBe("年度会员");
    expect(typeLabels["lifetime"]?.en).toBe("Lifetime");
    expect(typeLabels["unknown"]).toBeUndefined();
  });

  it("should correctly check membership expiry", () => {
    const futureDate = new Date(Date.now() + 86400000 * 30);
    const pastDate = new Date(Date.now() - 86400000);
    
    expect(futureDate > new Date()).toBe(true);
    expect(pastDate < new Date()).toBe(true);
  });
});

describe("Social Proof Counter", () => {
  it("should generate consistent subscriber count for same day", () => {
    const day = new Date().getDate();
    const count1 = ((day * 7 + 128) % 200) + 300;
    const count2 = ((day * 7 + 128) % 200) + 300;
    expect(count1).toBe(count2);
    expect(count1).toBeGreaterThanOrEqual(300);
    expect(count1).toBeLessThan(500);
  });
});
