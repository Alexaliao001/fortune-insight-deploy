/**
 * T07: keywords from shipped tarot-database (not a reimplemented map).
 */
import { describe, it, expect } from "vitest";
import { keywordsForCardName, getCardByName } from "./tarot-database";

describe("keywordsForCardName (T07)", () => {
  it("returns 2–3 Chinese keywords for 愚者 from DB", () => {
    const card = getCardByName("愚者");
    expect(card).toBeTruthy();
    expect(card!.keywordsChinese.length).toBeGreaterThanOrEqual(3);
    const chips = keywordsForCardName("愚者", "zh", 3);
    expect(chips).toHaveLength(3);
    expect(chips).toEqual(card!.keywordsChinese.slice(0, 3));
  });

  it("returns English keywords for The Fool", () => {
    const chips = keywordsForCardName("The Fool", "en", 3);
    expect(chips).toHaveLength(3);
    expect(chips[0]).toBe("new beginnings");
  });

  it("unknown card → empty (no fake invent)", () => {
    expect(keywordsForCardName("NotARealCard", "en")).toEqual([]);
  });

  it("respects max", () => {
    expect(keywordsForCardName("愚者", "zh", 2)).toHaveLength(2);
  });
});
