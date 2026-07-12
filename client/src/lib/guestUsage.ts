/**
 * Guest Usage Tracking
 * 
 * Tracks usage counts for non-logged-in users via localStorage.
 * This is the client-side enforcement layer. The server also enforces
 * limits for logged-in users via the database.
 * 
 * Strategy:
 * - Each feature has a daily or monthly limit matching FREE_LIMITS
 * - Guest users get the same free limits as registered users
 * - After exhausting free uses, guests must register + subscribe
 * - This prevents the #1 revenue leak: unlimited guest usage
 */

const GUEST_USAGE_PREFIX = "fi_guest_usage_";

interface UsageRecord {
  count: number;
  periodKey: string; // "2026-02-11" for daily, "2026-02" for monthly
}

type FeatureType = "tarot" | "bazi" | "dream" | "horoscope";

// Must match server/products.ts FREE_LIMITS
const GUEST_LIMITS: Record<FeatureType, { count: number; period: "daily" | "monthly" }> = {
  tarot: { count: 1, period: "daily" },
  bazi: { count: 1, period: "monthly" },
  dream: { count: 1, period: "monthly" },
  horoscope: { count: -1, period: "daily" }, // unlimited
};

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // "2026-02-11"
}

function getMonthKey(): string {
  return new Date().toISOString().slice(0, 7); // "2026-02"
}

function getStorageKey(feature: FeatureType): string {
  return `${GUEST_USAGE_PREFIX}${feature}`;
}

function getRecord(feature: FeatureType): UsageRecord {
  try {
    const raw = localStorage.getItem(getStorageKey(feature));
    if (!raw) return { count: 0, periodKey: "" };
    return JSON.parse(raw);
  } catch {
    return { count: 0, periodKey: "" };
  }
}

function getCurrentPeriodKey(feature: FeatureType): string {
  const limit = GUEST_LIMITS[feature];
  return limit.period === "daily" ? getTodayKey() : getMonthKey();
}

/**
 * Check if a guest can use a feature
 */
export function canGuestUse(feature: FeatureType): { canUse: boolean; remaining: number } {
  const limit = GUEST_LIMITS[feature];
  
  // Unlimited features
  if (limit.count === -1) {
    return { canUse: true, remaining: -1 };
  }

  const record = getRecord(feature);
  const currentPeriod = getCurrentPeriodKey(feature);

  // New period = reset count
  if (record.periodKey !== currentPeriod) {
    return { canUse: true, remaining: limit.count };
  }

  const remaining = Math.max(0, limit.count - record.count);
  return { canUse: remaining > 0, remaining };
}

/**
 * Consume one guest usage for a feature
 * Returns true if successfully consumed, false if limit reached
 */
export function consumeGuestUsage(feature: FeatureType): boolean {
  const limit = GUEST_LIMITS[feature];
  
  // Unlimited features
  if (limit.count === -1) return true;

  const currentPeriod = getCurrentPeriodKey(feature);
  const record = getRecord(feature);

  // New period = reset
  if (record.periodKey !== currentPeriod) {
    localStorage.setItem(getStorageKey(feature), JSON.stringify({
      count: 1,
      periodKey: currentPeriod,
    }));
    return true;
  }

  // Check limit
  if (record.count >= limit.count) {
    return false;
  }

  // Increment
  localStorage.setItem(getStorageKey(feature), JSON.stringify({
    count: record.count + 1,
    periodKey: currentPeriod,
  }));
  return true;
}

/**
 * Get guest usage status for display
 */
export function getGuestUsageStatus(feature: FeatureType): {
  freeRemaining: number;
  limitLabel: string;
} {
  const limit = GUEST_LIMITS[feature];
  
  if (limit.count === -1) {
    return { freeRemaining: -1, limitLabel: "Unlimited" };
  }

  const { remaining } = canGuestUse(feature);
  const periodLabel = limit.period === "daily" ? "today" : "this month";
  
  return {
    freeRemaining: remaining,
    limitLabel: `${remaining}/${limit.count} free ${periodLabel}`,
  };
}
