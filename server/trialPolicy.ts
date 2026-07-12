/**
 * Signup trial product policy (F1-4).
 *
 * Default: 14 free unlimited days after first registration.
 * Override with env SIGNUP_TRIAL_DAYS (integer).
 *   - unset / invalid → 14
 *   - 0 → do not auto-grant trial (FREE_LIMITS only)
 *   - 1..365 → grant that many days once per account
 */

export const DEFAULT_SIGNUP_TRIAL_DAYS = 14;

/**
 * Resolve trial length from env (or an explicit raw string for tests).
 * Clamped to 0..365. Invalid/empty → default 14.
 */
export function resolveSignupTrialDays(
  raw: string | undefined = process.env.SIGNUP_TRIAL_DAYS
): number {
  if (raw === undefined || raw.trim() === "") {
    return DEFAULT_SIGNUP_TRIAL_DAYS;
  }
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) {
    return DEFAULT_SIGNUP_TRIAL_DAYS;
  }
  return Math.min(365, Math.floor(n));
}
