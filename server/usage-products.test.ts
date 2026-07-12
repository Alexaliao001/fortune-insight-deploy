import { describe, expect, it } from "vitest";
import { PRODUCTS, ProductId, FREE_LIMITS, getSinglePurchaseProducts, getMembershipProducts, calculateCharityAmount } from "./products";

describe("Products", () => {
  it("should have all required product keys", () => {
    const requiredKeys = [
      "MONTHLY_MEMBERSHIP",
      "YEARLY_MEMBERSHIP",
      "LIFETIME_MEMBERSHIP",
      "TAROT_SINGLE",
      "TAROT_PACK_3",
      "BAZI_SINGLE",
      "DREAM_SINGLE",
      "DREAM_PACK_5",
    ];

    for (const key of requiredKeys) {
      expect(PRODUCTS).toHaveProperty(key);
    }
  });

  it("should have valid price for all products (positive integer in cents)", () => {
    for (const [key, product] of Object.entries(PRODUCTS)) {
      expect(product.price).toBeGreaterThan(0);
      expect(Number.isInteger(product.price)).toBe(true);
    }
  });

  it("should have valid currency for all products", () => {
    for (const [key, product] of Object.entries(PRODUCTS)) {
      expect(product.currency).toBe("usd");
    }
  });

  it("should have valid interval for all products", () => {
    const validIntervals = ["month", "year", "one_time"];
    for (const [key, product] of Object.entries(PRODUCTS)) {
      expect(validIntervals).toContain(product.interval);
    }
  });

  it("single purchase products should have featureType and credits", () => {
    const singleProducts = getSinglePurchaseProducts();
    expect(singleProducts.length).toBeGreaterThan(0);

    for (const product of singleProducts) {
      expect(product).toHaveProperty("featureType");
      expect(product).toHaveProperty("credits");
      expect(product.credits).toBeGreaterThan(0);
      expect(["tarot", "bazi", "dream", "compatibility"]).toContain(product.featureType);
    }
  });

  it("membership products should not have featureType", () => {
    const membershipProducts = getMembershipProducts();
    expect(membershipProducts.length).toBe(3); // monthly, yearly, lifetime

    for (const product of membershipProducts) {
      expect(product).not.toHaveProperty("featureType");
    }
  });

  it("pack products should offer better per-unit pricing than singles", () => {
    // Tarot: single $1.99 (1 use) vs pack $4.99 (3 uses)
    const tarotSingle = PRODUCTS.TAROT_SINGLE;
    const tarotPack = PRODUCTS.TAROT_PACK_3;
    const singlePerUnit = tarotSingle.price / 1;
    const packPerUnit = tarotPack.price / 3;
    expect(packPerUnit).toBeLessThan(singlePerUnit);

    // Dream: single $1.99 (1 use) vs pack $7.99 (5 uses)
    const dreamSingle = PRODUCTS.DREAM_SINGLE;
    const dreamPack = PRODUCTS.DREAM_PACK_5;
    const dreamSinglePerUnit = dreamSingle.price / 1;
    const dreamPackPerUnit = dreamPack.price / 5;
    expect(dreamPackPerUnit).toBeLessThan(dreamSinglePerUnit);
  });
});

describe("FREE_LIMITS", () => {
  it("should define free limits for tarot, bazi, and dream", () => {
    expect(FREE_LIMITS).toHaveProperty("tarot");
    expect(FREE_LIMITS).toHaveProperty("bazi");
    expect(FREE_LIMITS).toHaveProperty("dream");
  });

  it("should have positive free limits", () => {
    expect(FREE_LIMITS.tarot.count).toBeGreaterThan(0);
    expect(FREE_LIMITS.bazi.count).toBeGreaterThan(0);
    expect(FREE_LIMITS.dream.count).toBeGreaterThan(0);
  });

  it("tarot should have daily period, bazi and dream should have monthly period", () => {
    expect(FREE_LIMITS.tarot.period).toBe("daily");
    expect(FREE_LIMITS.bazi.period).toBe("monthly");
    expect(FREE_LIMITS.dream.period).toBe("monthly");
  });

  it("horoscope should be unlimited", () => {
    expect(FREE_LIMITS.horoscope.count).toBe(-1);
  });
});

describe("calculateCharityAmount", () => {
  it("should calculate 10% charity for membership products", () => {
    const amount = 999; // $9.99 in cents
    const charity = calculateCharityAmount("MONTHLY_MEMBERSHIP" as ProductId, amount);
    expect(charity).toBe(Math.floor(amount * 0.1));
  });

  it("should calculate charity for single purchase products", () => {
    const amount = 199; // $1.99 in cents
    const charity = calculateCharityAmount("TAROT_SINGLE" as ProductId, amount);
    expect(charity).toBeGreaterThanOrEqual(0);
  });
});
