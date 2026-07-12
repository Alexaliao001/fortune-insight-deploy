/**
 * F2-2: long-wait hints for BaZi/Dream loading (shipped helper).
 */
import { describe, it, expect } from "vitest";
import { longWaitHint } from "../client/src/lib/loadingWaitHint";

describe("longWaitHint (F2-2)", () => {
  it("mentions 30–90s for bazi after a few seconds", () => {
    const zh = longWaitHint("bazi", 10, true);
    expect(zh).toMatch(/30|90|分钟|秒/);
    const en = longWaitHint("bazi", 10, false);
    expect(en.toLowerCase()).toMatch(/30|90|keep/);
  });

  it("shows elapsed seconds on long waits", () => {
    const zh = longWaitHint("bazi", 45, true);
    expect(zh).toContain("45");
  });

  it("tarot uses shorter expectation early", () => {
    const en = longWaitHint("tarot", 5, false);
    expect(en.toLowerCase()).toMatch(/15s|generating|wait/);
  });
});
