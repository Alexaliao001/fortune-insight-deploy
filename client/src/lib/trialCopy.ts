/**
 * Client SSOT for signup trial length messaging (mirrors server default 14).
 * Do not invent a different number in UI copy — import this.
 */
export const SIGNUP_TRIAL_DAYS_DISPLAY = 14;

export function trialDaysLabel(isZh: boolean): string {
  return isZh ? `${SIGNUP_TRIAL_DAYS_DISPLAY} 天` : `${SIGNUP_TRIAL_DAYS_DISPLAY}-day`;
}

export function trialHookShort(isZh: boolean): string {
  return isZh
    ? `注册领 ${SIGNUP_TRIAL_DAYS_DISPLAY} 天无限体验`
    : `Sign up · ${SIGNUP_TRIAL_DAYS_DISPLAY}-day unlimited trial`;
}

export function trialHookLong(isZh: boolean): string {
  return isZh
    ? `注册即送 ${SIGNUP_TRIAL_DAYS_DISPLAY} 天无限 · 到期回到免费额度，随时可升级`
    : `${SIGNUP_TRIAL_DAYS_DISPLAY} free unlimited days after sign-up · then free limits · upgrade anytime`;
}
