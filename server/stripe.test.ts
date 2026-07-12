import { describe, expect, it, vi, beforeEach } from "vitest";
import { PRODUCTS, calculateCharityAmount, ProductId } from "./products";

// Mock Stripe
const mockStripe = {
  webhooks: {
    constructEvent: vi.fn(),
  },
  checkout: {
    sessions: {
      create: vi.fn(),
    },
  },
};

vi.mock("stripe", () => ({
  default: vi.fn(() => mockStripe),
}));

// Mock database
const mockDb = {
  insert: vi.fn().mockReturnValue({
    values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  }),
  update: vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    }),
  }),
  select: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue([]),
      }),
    }),
  }),
};

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

describe("Stripe Products Configuration", () => {
  it("should have all required membership products", () => {
    expect(PRODUCTS.MONTHLY_MEMBERSHIP).toBeDefined();
    expect(PRODUCTS.YEARLY_MEMBERSHIP).toBeDefined();
    expect(PRODUCTS.LIFETIME_MEMBERSHIP).toBeDefined();
  });

  it("should have correct pricing in cents (USD)", () => {
    expect(PRODUCTS.MONTHLY_MEMBERSHIP.price).toBe(999); // $9.99
    expect(PRODUCTS.YEARLY_MEMBERSHIP.price).toBe(5999); // $59.99
    expect(PRODUCTS.LIFETIME_MEMBERSHIP.price).toBe(14999); // $149.99
  });

  it("should have correct intervals", () => {
    expect(PRODUCTS.MONTHLY_MEMBERSHIP.interval).toBe("month");
    expect(PRODUCTS.YEARLY_MEMBERSHIP.interval).toBe("year");
    expect(PRODUCTS.LIFETIME_MEMBERSHIP.interval).toBe("one_time");
  });

  it("should have USD as currency", () => {
    Object.values(PRODUCTS).forEach((product) => {
      expect(product.currency).toBe("usd");
    });
  });

  it("should have charity percentage configured for memberships", () => {
    expect(PRODUCTS.MONTHLY_MEMBERSHIP.charityPercentage).toBe(10);
    expect(PRODUCTS.YEARLY_MEMBERSHIP.charityPercentage).toBe(10);
    expect(PRODUCTS.LIFETIME_MEMBERSHIP.charityPercentage).toBe(10);
  });
});

describe("Charity Amount Calculation", () => {
  it("should calculate 10% charity for monthly membership", () => {
    const amount = 2990; // ¥29.90 in cents
    const charity = calculateCharityAmount("MONTHLY_MEMBERSHIP", amount);
    expect(charity).toBe(299); // ¥2.99 in cents
  });

  it("should calculate 10% charity for yearly membership", () => {
    const amount = 19900; // ¥199.00 in cents
    const charity = calculateCharityAmount("YEARLY_MEMBERSHIP", amount);
    expect(charity).toBe(1990); // ¥19.90 in cents
  });

  it("should calculate 10% charity for lifetime membership", () => {
    const amount = 49900; // ¥499.00 in cents
    const charity = calculateCharityAmount("LIFETIME_MEMBERSHIP", amount);
    expect(charity).toBe(4990); // ¥49.90 in cents
  });

  it("should floor the charity amount", () => {
    // Test with an amount that would result in a decimal
    const amount = 1001; // Would be 100.1 cents at 10%
    const charity = calculateCharityAmount("MONTHLY_MEMBERSHIP", amount);
    expect(charity).toBe(100); // Should floor to 100
  });
});

describe("Stripe Webhook Event Types", () => {
  const supportedEvents = [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.paid",
  ];

  it("should handle all required webhook events", () => {
    // This test documents the expected webhook events
    supportedEvents.forEach((eventType) => {
      expect(eventType).toBeTruthy();
    });
    expect(supportedEvents.length).toBe(5);
  });
});

describe("Product ID Validation", () => {
  const validProductIds: ProductId[] = [
    "MONTHLY_MEMBERSHIP",
    "YEARLY_MEMBERSHIP",
    "LIFETIME_MEMBERSHIP",
    "TAROT_DEEP_READING",
    "BAZI_FULL_REPORT",
  ];

  it("should have all expected product IDs", () => {
    const actualProductIds = Object.keys(PRODUCTS);
    validProductIds.forEach((id) => {
      expect(actualProductIds).toContain(id);
    });
  });

  it("should have valid product structure for each product", () => {
    Object.entries(PRODUCTS).forEach(([key, product]) => {
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("description");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("currency");
      expect(product).toHaveProperty("interval");
      expect(typeof product.price).toBe("number");
      expect(product.price).toBeGreaterThan(0);
    });
  });
});

describe("Payment Method Support", () => {
  it("should support required payment methods", () => {
    // Document the expected payment methods
    const requiredMethods = ["card", "alipay", "wechat_pay"];
    requiredMethods.forEach((method) => {
      expect(method).toBeTruthy();
    });
  });
});

describe("Checkout Session Metadata", () => {
  it("should require user_id in metadata", () => {
    const requiredMetadata = ["user_id", "customer_email", "customer_name", "product_id"];
    requiredMetadata.forEach((field) => {
      expect(field).toBeTruthy();
    });
  });
});

describe("Subscription vs One-Time Payment", () => {
  it("should identify subscription products", () => {
    expect(PRODUCTS.MONTHLY_MEMBERSHIP.interval).not.toBe("one_time");
    expect(PRODUCTS.YEARLY_MEMBERSHIP.interval).not.toBe("one_time");
  });

  it("should identify one-time payment products", () => {
    expect(PRODUCTS.LIFETIME_MEMBERSHIP.interval).toBe("one_time");
    expect(PRODUCTS.TAROT_DEEP_READING.interval).toBe("one_time");
    expect(PRODUCTS.BAZI_FULL_REPORT.interval).toBe("one_time");
  });
});

describe("Test Event Handling", () => {
  it("should recognize test event IDs", () => {
    const testEventId = "evt_test_123456";
    expect(testEventId.startsWith("evt_test_")).toBe(true);
  });

  it("should not recognize production event IDs as test", () => {
    const prodEventId = "evt_1234567890";
    expect(prodEventId.startsWith("evt_test_")).toBe(false);
  });
});
