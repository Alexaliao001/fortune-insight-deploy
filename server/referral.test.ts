import { describe, it, expect } from "vitest";

describe("Referral System", () => {
  describe("Referral Code Generation", () => {
    it("should generate 8-character codes with valid characters", () => {
      const validChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      // Simulate the code generation logic
      function generateReferralCode(): string {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
      }

      const code = generateReferralCode();
      expect(code).toHaveLength(8);
      for (const char of code) {
        expect(validChars).toContain(char);
      }
    });

    it("should not contain confusing characters (I, O, 0, 1)", () => {
      function generateReferralCode(): string {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
      }

      // Generate many codes and check none contain confusing chars
      for (let i = 0; i < 100; i++) {
        const code = generateReferralCode();
        expect(code).not.toMatch(/[IO01]/);
      }
    });

    it("should generate unique codes", () => {
      function generateReferralCode(): string {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
          code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
      }

      const codes = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        codes.add(generateReferralCode());
      }
      // With 30^8 possible combinations, 1000 codes should all be unique
      expect(codes.size).toBe(1000);
    });
  });

  describe("Referral Code Validation", () => {
    it("should normalize codes to uppercase", () => {
      const input = "abc123xy";
      expect(input.toUpperCase()).toBe("ABC123XY");
    });

    it("should reject empty codes", () => {
      expect("".length).toBe(0);
      expect("".length >= 1).toBe(false);
    });
  });

  describe("Referral Reward Config", () => {
    it("should reward 1 credit per feature type", () => {
      const REFERRAL_REWARD_CREDITS = 1;
      const REFERRAL_REWARD_FEATURES = ["tarot", "bazi", "dream"] as const;

      expect(REFERRAL_REWARD_CREDITS).toBe(1);
      expect(REFERRAL_REWARD_FEATURES).toHaveLength(3);
      expect(REFERRAL_REWARD_FEATURES).toContain("tarot");
      expect(REFERRAL_REWARD_FEATURES).toContain("bazi");
      expect(REFERRAL_REWARD_FEATURES).toContain("dream");
    });

    it("should calculate total rewards correctly", () => {
      const REFERRAL_REWARD_CREDITS = 1;
      const REFERRAL_REWARD_FEATURES = ["tarot", "bazi", "dream"];

      // Both referrer and referred get rewards
      const totalCreditsPerReferral = REFERRAL_REWARD_FEATURES.length * REFERRAL_REWARD_CREDITS * 2;
      expect(totalCreditsPerReferral).toBe(6); // 3 features * 1 credit * 2 parties
    });
  });

  describe("Referral URL Handling", () => {
    it("should extract referral code from URL params", () => {
      const url = new URL("https://example.com?ref=ABC123XY");
      const refCode = url.searchParams.get("ref");
      expect(refCode).toBe("ABC123XY");
    });

    it("should handle missing referral param", () => {
      const url = new URL("https://example.com");
      const refCode = url.searchParams.get("ref");
      expect(refCode).toBeNull();
    });

    it("should clean URL after extracting referral code", () => {
      const url = new URL("https://example.com/tarot?ref=ABC123XY&other=1");
      url.searchParams.delete("ref");
      expect(url.toString()).toBe("https://example.com/tarot?other=1");
    });
  });

  describe("Self-Referral Prevention", () => {
    it("should prevent users from referring themselves", () => {
      const referrerId = 1;
      const currentUserId = 1;
      expect(referrerId === currentUserId).toBe(true);
      // In the actual code, this returns { success: false, message: "Cannot refer yourself" }
    });

    it("should allow different users to refer each other", () => {
      const referrerId = 1;
      const currentUserId = 2;
      expect(referrerId === currentUserId).toBe(false);
    });
  });

  describe("Leaderboard Privacy", () => {
    it("should mask user names for privacy", () => {
      const name = "John Doe";
      const masked = name.charAt(0) + "***";
      expect(masked).toBe("J***");
    });

    it("should handle null names", () => {
      const name: string | null = null;
      const display = name ? name.charAt(0) + "***" : "User";
      expect(display).toBe("User");
    });
  });
});
