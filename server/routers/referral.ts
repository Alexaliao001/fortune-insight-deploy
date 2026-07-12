import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { users, referrals, referralRewards, purchaseCredits } from "../../drizzle/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { createNotification } from "./notification";

// Generate a unique 8-char referral code
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,O,0,1 to avoid confusion
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Reward config
const REFERRAL_REWARD_CREDITS = 1; // bonus credits per referral
const REFERRAL_REWARD_FEATURES = ["tarot", "bazi", "dream"] as const;

export const referralRouter = router({
  // Get or create the current user's referral code
  getMyReferral: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { code: "", totalReferrals: 0, completedReferrals: 0, totalRewards: 0 };

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    let referralCode = user?.referralCode;

    // Generate code if not exists
    if (!referralCode) {
      referralCode = generateReferralCode();
      // Check uniqueness
      let attempts = 0;
      while (attempts < 5) {
        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.referralCode, referralCode))
          .limit(1);
        if (!existing) break;
        referralCode = generateReferralCode();
        attempts++;
      }
      await db
        .update(users)
        .set({ referralCode })
        .where(eq(users.id, ctx.user.id));
    }

    // Get referral stats
    const [totalResult] = await db
      .select({ count: count() })
      .from(referrals)
      .where(eq(referrals.referrerId, ctx.user.id));

    const [completedResult] = await db
      .select({ count: count() })
      .from(referrals)
      .where(
        and(
          eq(referrals.referrerId, ctx.user.id),
          eq(referrals.status, "rewarded")
        )
      );

    const [rewardsResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${referralRewards.creditsAmount}), 0)` })
      .from(referralRewards)
      .where(eq(referralRewards.userId, ctx.user.id));

    return {
      code: referralCode,
      totalReferrals: totalResult?.count ?? 0,
      completedReferrals: completedResult?.count ?? 0,
      totalRewards: rewardsResult?.total ?? 0,
    };
  }),

  // Get referral history
  getReferralHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const results = await db
      .select({
        id: referrals.id,
        referredId: referrals.referredId,
        status: referrals.status,
        referrerRewarded: referrals.referrerRewarded,
        createdAt: referrals.createdAt,
        completedAt: referrals.completedAt,
        referredName: users.name,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.referredId, users.id))
      .where(eq(referrals.referrerId, ctx.user.id))
      .orderBy(desc(referrals.createdAt))
      .limit(50);

    return results.map((r) => ({
      ...r,
      referredName: r.referredName ? r.referredName.charAt(0) + "***" : "User",
    }));
  }),

  // Get my rewards
  getMyRewards: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select()
      .from(referralRewards)
      .where(eq(referralRewards.userId, ctx.user.id))
      .orderBy(desc(referralRewards.createdAt))
      .limit(50);
  }),

  // Validate a referral code (public - used before/during signup)
  validateCode: publicProcedure
    .input(z.object({ code: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { valid: false, referrerName: null };

      const [user] = await db
        .select({ id: users.id, name: users.name })
        .from(users)
        .where(eq(users.referralCode, input.code.toUpperCase()))
        .limit(1);

      return {
        valid: !!user,
        referrerName: user?.name ? user.name.charAt(0) + "***" : null,
      };
    }),

  // Process referral after signup (called from server when new user registers)
  processReferral: protectedProcedure
    .input(z.object({ referralCode: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { success: false, message: "Database unavailable" };

      const code = input.referralCode.toUpperCase();

      // Find referrer
      const [referrer] = await db
        .select()
        .from(users)
        .where(eq(users.referralCode, code))
        .limit(1);

      if (!referrer) return { success: false, message: "Invalid referral code" };
      if (referrer.id === ctx.user.id) return { success: false, message: "Cannot refer yourself" };

      // Check if already referred
      const [existing] = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referredId, ctx.user.id))
        .limit(1);

      if (existing) return { success: false, message: "Already referred" };

      // Create referral record
      const [result] = await db.insert(referrals).values({
        referrerId: referrer.id,
        referredId: ctx.user.id,
        referralCode: code,
        status: "completed",
        completedAt: new Date(),
      });

      const referralId = result.insertId;

      // Update user's referredBy
      await db
        .update(users)
        .set({ referredBy: referrer.id })
        .where(eq(users.id, ctx.user.id));

      // Grant rewards to both parties
      const rewardPromises: Promise<unknown>[] = [];

      // Reward referrer: bonus credits for each feature
      for (const feature of REFERRAL_REWARD_FEATURES) {
        rewardPromises.push(
          db.insert(referralRewards).values({
            userId: referrer.id,
            referralId: Number(referralId),
            rewardType: "bonus_credits",
            featureType: feature,
            creditsAmount: REFERRAL_REWARD_CREDITS,
            claimed: true,
          })
        );
        // Add actual purchase credits
        rewardPromises.push(
          db.insert(purchaseCredits).values({
            userId: referrer.id,
            featureType: feature,
            credits: REFERRAL_REWARD_CREDITS,
            usedCredits: 0,
            status: "active",
          })
        );
      }

      // Reward referred user: bonus credits for each feature
      for (const feature of REFERRAL_REWARD_FEATURES) {
        rewardPromises.push(
          db.insert(referralRewards).values({
            userId: ctx.user.id,
            referralId: Number(referralId),
            rewardType: "bonus_credits",
            featureType: feature,
            creditsAmount: REFERRAL_REWARD_CREDITS,
            claimed: true,
          })
        );
        rewardPromises.push(
          db.insert(purchaseCredits).values({
            userId: ctx.user.id,
            featureType: feature,
            credits: REFERRAL_REWARD_CREDITS,
            usedCredits: 0,
            status: "active",
          })
        );
      }

      await Promise.all(rewardPromises);

      // Update referral status
      await db
        .update(referrals)
        .set({
          status: "rewarded",
          referrerRewarded: true,
          referredRewarded: true,
        })
        .where(eq(referrals.id, Number(referralId)));

      // Notify referrer
      createNotification({
        userId: referrer.id,
        type: "system",
        title: "🎉 Referral Reward!",
        message: `Your friend joined using your referral code! You earned ${REFERRAL_REWARD_CREDITS} bonus credit for Tarot, BaZi, and Dream readings.`,
        link: "/referral",
        icon: "Gift",
      }).catch(() => {});

      // Notify referred user
      createNotification({
        userId: ctx.user.id,
        type: "system",
        title: "🎁 Welcome Bonus!",
        message: `You joined with a referral code! You earned ${REFERRAL_REWARD_CREDITS} bonus credit for Tarot, BaZi, and Dream readings.`,
        link: "/referral",
        icon: "Gift",
      }).catch(() => {});

      return { success: true, message: "Referral rewards granted!" };
    }),

  // Get leaderboard (top referrers)
  getLeaderboard: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const results = await db
      .select({
        userId: referrals.referrerId,
        count: count(),
        name: users.name,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.referrerId, users.id))
      .where(eq(referrals.status, "rewarded"))
      .groupBy(referrals.referrerId, users.name)
      .orderBy(desc(count()))
      .limit(10);

    return results.map((r, i) => ({
      rank: i + 1,
      name: r.name ? r.name.charAt(0) + "***" : "User",
      referralCount: r.count,
    }));
  }),
});
