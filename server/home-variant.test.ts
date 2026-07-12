import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  DEFAULT_HOME_VARIANT,
  HOME_VARIANT_IDS,
  HOME_VARIANT_STORAGE_KEY,
  HOME_VARIANT_FLAGS,
  parseHomeVariant,
  readHomeVariant,
  writeHomeVariant,
  getHomeVariantFlags,
  resolveInitialHomeVariant,
} from "../client/src/lib/homeVariant";

describe("homeVariant contract (shipped client/src/lib/homeVariant.ts)", () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    const localStorageMock = {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = String(v);
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        store = {};
      },
      key: () => null,
      get length() {
        return Object.keys(store).length;
      },
    };
    vi.stubGlobal("localStorage", localStorageMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("DEFAULT_HOME_VARIANT is focus", () => {
    expect(DEFAULT_HOME_VARIANT).toBe("focus");
  });

  it("exposes exactly five named variants", () => {
    expect([...HOME_VARIANT_IDS]).toEqual([
      "classic",
      "focus",
      "ritual",
      "plans",
      "minimal",
    ]);
  });

  it("parseHomeVariant: missing/invalid → focus", () => {
    expect(parseHomeVariant(null)).toBe("focus");
    expect(parseHomeVariant(undefined)).toBe("focus");
    expect(parseHomeVariant("")).toBe("focus");
    expect(parseHomeVariant("nope")).toBe("focus");
    expect(parseHomeVariant(123)).toBe("focus");
    expect(parseHomeVariant("FOCUS")).toBe("focus");
  });

  it("parseHomeVariant: each of five legal ids", () => {
    for (const id of HOME_VARIANT_IDS) {
      expect(parseHomeVariant(id)).toBe(id);
    }
  });

  it("readHomeVariant: missing storage → focus", () => {
    expect(readHomeVariant()).toBe("focus");
    expect(store[HOME_VARIANT_STORAGE_KEY]).toBeUndefined();
  });

  it("storage key is exactly fortune.homeVariant", () => {
    expect(HOME_VARIANT_STORAGE_KEY).toBe("fortune.homeVariant");
  });

  it("write/read round-trip for all five legal ids", () => {
    for (const id of HOME_VARIANT_IDS) {
      const written = writeHomeVariant(id);
      expect(written).toBe(id);
      expect(store[HOME_VARIANT_STORAGE_KEY]).toBe(id);
      expect(readHomeVariant()).toBe(id);
    }
  });

  it("writeHomeVariant rejects illegal by falling back to focus", () => {
    // writeHomeVariant types require HomeVariantId; still re-parses
    const written = writeHomeVariant("bogus" as never);
    expect(written).toBe("focus");
    expect(store[HOME_VARIANT_STORAGE_KEY]).toBe("focus");
  });

  it("illegal stored value → focus", () => {
    store[HOME_VARIANT_STORAGE_KEY] = "evil-layout";
    expect(readHomeVariant()).toBe("focus");
  });

  it("flag table: plans secondary is membership; minimal hides community; focus shows compact alert", () => {
    expect(getHomeVariantFlags("plans").secondaryCta).toBe("membership");
    expect(getHomeVariantFlags("minimal").showCommunityBlock).toBe(false);
    expect(getHomeVariantFlags("minimal").showCosmicAlert).toBe(false);
    expect(getHomeVariantFlags("focus").showCosmicAlert).toBe(true);
    expect(getHomeVariantFlags("focus").alertTone).toBe("weak");
    expect(getHomeVariantFlags("ritual").alertTone).toBe("legacy");
    expect(getHomeVariantFlags("focus").heroPreviewDual).toBe(true);
  });

  it("classic matches pre-refresh structure flags (no result preview, legacy alert, full community decor)", () => {
    const c = getHomeVariantFlags("classic");
    expect(c.heroPreviewDual).toBe(false);
    expect(c.showResultPreview).toBe(false);
    expect(c.showCosmicAlert).toBe(true);
    expect(c.alertTone).toBe("legacy");
    expect(c.showCommunityBlock).toBe(true);
    expect(c.decorLevel).toBe("high");
    expect(c.showMembershipPrice).toBe(true);
  });

  it("resolveInitialHomeVariant honors ?variant= and persists", () => {
    const id = resolveInitialHomeVariant("?variant=minimal");
    expect(id).toBe("minimal");
    expect(store[HOME_VARIANT_STORAGE_KEY]).toBe("minimal");
    expect(readHomeVariant()).toBe("minimal");
  });

  it("resolveInitialHomeVariant without query uses storage/default", () => {
    expect(resolveInitialHomeVariant("")).toBe("focus");
    writeHomeVariant("ritual");
    expect(resolveInitialHomeVariant("")).toBe("ritual");
  });
});
