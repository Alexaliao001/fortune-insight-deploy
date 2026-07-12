import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_SIGNUP_TRIAL_DAYS,
  resolveSignupTrialDays,
} from "./trialPolicy";

const ENV_KEY = "SIGNUP_TRIAL_DAYS";
const prevEnv = process.env[ENV_KEY];

afterEach(() => {
  if (prevEnv === undefined) {
    delete process.env[ENV_KEY];
  } else {
    process.env[ENV_KEY] = prevEnv;
  }
});

describe("resolveSignupTrialDays (F1-4)", () => {
  it("defaults to 14 when empty string", () => {
    expect(DEFAULT_SIGNUP_TRIAL_DAYS).toBe(14);
    expect(resolveSignupTrialDays("")).toBe(14);
    expect(resolveSignupTrialDays("   ")).toBe(14);
  });

  it("reads process.env when called with no args", () => {
    delete process.env[ENV_KEY];
    expect(resolveSignupTrialDays()).toBe(14);

    process.env[ENV_KEY] = "90";
    expect(resolveSignupTrialDays()).toBe(90);

    process.env[ENV_KEY] = "0";
    expect(resolveSignupTrialDays()).toBe(0);
  });

  it("parses valid positive integers", () => {
    expect(resolveSignupTrialDays("14")).toBe(14);
    expect(resolveSignupTrialDays("1")).toBe(1);
    expect(resolveSignupTrialDays("90")).toBe(90);
    expect(resolveSignupTrialDays("365")).toBe(365);
  });

  it("allows 0 to disable auto trial", () => {
    expect(resolveSignupTrialDays("0")).toBe(0);
  });

  it("clamps above 365", () => {
    expect(resolveSignupTrialDays("999")).toBe(365);
    expect(resolveSignupTrialDays("366")).toBe(365);
  });

  it("falls back on invalid / negative", () => {
    expect(resolveSignupTrialDays("abc")).toBe(14);
    expect(resolveSignupTrialDays("-7")).toBe(14);
    expect(resolveSignupTrialDays("14.9")).toBe(14); // parseInt truncates
  });
});
