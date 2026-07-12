/**
 * Structure checks for PRODUCT_UX goal: scan markers, shared loader, share wiring.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel: string) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

describe("product UX structure (BaZi / Dream / Horoscope)", () => {
  it("pages use shared LoadingRitual (not a third loader)", () => {
    for (const page of ["Bazi", "Dream", "Horoscope"]) {
      const src = read(`client/src/pages/${page}.tsx`);
      expect(src).toMatch(/LoadingRitual/);
      expect(src).not.toMatch(/ThirdPartyLoader|CustomOnlyLoader/);
    }
  });

  it("pages wire ShareResultCard", () => {
    for (const page of ["Bazi", "Dream", "Horoscope"]) {
      expect(read(`client/src/pages/${page}.tsx`)).toMatch(/ShareResultCard/);
    }
  });

  it("BaZiReport exposes scan markers and pull-quote usage path", () => {
    const report = read("client/src/components/BaZiReport.tsx");
    expect(report).toMatch(/data-report-scan/);
    expect(report).toMatch(/extractPullQuote|reportScan/);
  });

  it("DreamReport exposes scan markers and pull-quote", () => {
    const report = read("client/src/components/DreamReport.tsx");
    expect(report).toMatch(/data-report-scan/);
    expect(report).toMatch(/extractPullQuote|reportScan/);
  });

  it("HoroscopeReport has above-fold takeaway + deep collapse control", () => {
    const report = read("client/src/components/HoroscopeReport.tsx");
    expect(report).toMatch(/data-horoscope-takeaway|data-report-scan/);
    expect(report).toMatch(/deepCollapsed|showDeep|expandedSections|data-deep-analysis/);
  });

  it("no five homeVariant layout forks on product pages", () => {
    for (const page of ["Bazi", "Dream", "Horoscope"]) {
      const src = read(`client/src/pages/${page}.tsx`);
      expect(src).not.toMatch(/homeVariant|HOME_VARIANT_FLAGS|getHomeVariantFlags/);
    }
  });

  it("career deep link still on home composition path", () => {
    const home = read("client/src/pages/Home.tsx");
    const sections = read("client/src/components/home/HomeSections.tsx");
    expect(home).toMatch(/HomeCareer/);
    expect(sections).toContain("/tarot?type=career");
  });

  it("Dream has example-fill without requiring only empty state", () => {
    const dream = read("client/src/pages/Dream.tsx");
    expect(dream).toMatch(/example|示例|fillExample|applyExample/i);
  });
});
