/**
 * F0-6: daily horoscope cache keys must isolate language.
 */
import { describe, expect, it } from "vitest";
import { dailyHoroscopeCacheKey } from "./routers/horoscope";

describe("dailyHoroscopeCacheKey (F0-6)", () => {
  it("scopes by sign + language", () => {
    expect(dailyHoroscopeCacheKey("leo", "zh")).toBe("leo::zh");
    expect(dailyHoroscopeCacheKey("leo", "en")).toBe("leo::en");
  });

  it("normalizes sign case", () => {
    expect(dailyHoroscopeCacheKey("Leo", "en")).toBe("leo::en");
    expect(dailyHoroscopeCacheKey("SCORPIO", "zh")).toBe("scorpio::zh");
  });

  it("zh and en never collide for same sign", () => {
    const zh = dailyHoroscopeCacheKey("aries", "zh");
    const en = dailyHoroscopeCacheKey("aries", "en");
    expect(zh).not.toBe(en);
  });
});
