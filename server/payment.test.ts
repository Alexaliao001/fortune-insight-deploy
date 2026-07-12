import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { PRODUCTS } from "./products";

// Mock the stripe module
vi.mock("./stripe", () => ({
  createCheckoutSession: vi.fn().mockResolvedValue("https://checkout.stripe.com/test-session"),
}));

// Mock the database (must include all exports used by payment / membership routes)
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  }),
  grantSignupTrialIfNeeded: vi.fn().mockResolvedValue({ granted: false }),
  hasActiveMembership: vi.fn().mockResolvedValue(false),
  getUsageStatus: vi.fn().mockResolvedValue({
    canUse: true,
    freeRemaining: 1,
    paidCredits: 0,
    isMember: false,
  }),
  consumeUsage: vi.fn().mockResolvedValue({ consumed: true, source: "free" }),
  saveReport: vi.fn(),
  getUserReports: vi.fn().mockResolvedValue([]),
  getReportById: vi.fn(),
  toggleReportFavorite: vi.fn(),
  deleteReport: vi.fn(),
}));

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      passwordHash: null,
      loginMethod: "email",
      role: "user",
      avatarUrl: null,
      zodiacSign: null,
      birthDate: null,
      birthTime: null,
      birthPlace: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      welcomeEmailSent: false,
      referralCode: null,
      referredBy: null,
    },
    req: {
      protocol: "https",
      headers: {
        origin: "https://test.example.com",
      },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("payment.getProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all available products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.payment.getProducts();

    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
    
    // Check that each product has required fields
    products.forEach(product => {
      expect(product).toHaveProperty("productKey");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("priceDisplay");
    });
  });

  it("should include membership products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.payment.getProducts();
    const productKeys = products.map(p => p.productKey);

    expect(productKeys).toContain("MONTHLY_MEMBERSHIP");
    expect(productKeys).toContain("YEARLY_MEMBERSHIP");
    expect(productKeys).toContain("LIFETIME_MEMBERSHIP");
  });
});

describe("payment.createCheckout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create checkout session for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.payment.createCheckout({
      productId: "MONTHLY_MEMBERSHIP",
    });

    expect(result).toBeDefined();
    expect(result.checkoutUrl).toBe("https://checkout.stripe.com/test-session");
  });

  it("should accept different product types", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const productIds = [
      "MONTHLY_MEMBERSHIP",
      "YEARLY_MEMBERSHIP",
      "LIFETIME_MEMBERSHIP",
      "TAROT_DEEP_READING",
      "BAZI_FULL_REPORT",
    ] as const;

    for (const productId of productIds) {
      const result = await caller.payment.createCheckout({ productId });
      expect(result.checkoutUrl).toBeDefined();
    }
  });
});

describe("payment.getMembership", () => {
  it("should return null when user has no active membership", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const membership = await caller.payment.getMembership();

    expect(membership).toBeNull();
  });
});

describe("payment.getOrders", () => {
  it("should return empty array when user has no orders", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const orders = await caller.payment.getOrders();

    expect(orders).toEqual([]);
  });
});

describe("payment.getCharityDonations", () => {
  it("should return empty array when user has no donations", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const donations = await caller.payment.getCharityDonations();

    expect(donations).toEqual([]);
  });
});

describe("PRODUCTS configuration", () => {
  it("should have valid product configurations", () => {
    expect(PRODUCTS.MONTHLY_MEMBERSHIP).toBeDefined();
    expect(PRODUCTS.MONTHLY_MEMBERSHIP.price).toBe(999);
    expect(PRODUCTS.MONTHLY_MEMBERSHIP.currency).toBe("usd");
    expect(PRODUCTS.MONTHLY_MEMBERSHIP.interval).toBe("month");

    expect(PRODUCTS.YEARLY_MEMBERSHIP).toBeDefined();
    expect(PRODUCTS.YEARLY_MEMBERSHIP.price).toBe(5999);
    expect(PRODUCTS.YEARLY_MEMBERSHIP.interval).toBe("year");

    expect(PRODUCTS.LIFETIME_MEMBERSHIP).toBeDefined();
    expect(PRODUCTS.LIFETIME_MEMBERSHIP.price).toBe(14999);
    expect(PRODUCTS.LIFETIME_MEMBERSHIP.interval).toBe("one_time");
  });

  it("should have charity percentage configured", () => {
    expect(PRODUCTS.MONTHLY_MEMBERSHIP.charityPercentage).toBe(10);
    expect(PRODUCTS.YEARLY_MEMBERSHIP.charityPercentage).toBe(10);
    expect(PRODUCTS.LIFETIME_MEMBERSHIP.charityPercentage).toBe(10);
  });
});
