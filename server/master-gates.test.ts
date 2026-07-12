/**
 * Structure gates for GROK_GOAL_MASTER (trust, drama, convert, UX).
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SIGNUP_TRIAL_DAYS_DISPLAY } from "../client/src/lib/trialCopy";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function read(rel: string) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

describe("MASTER gates", () => {
  it("membership has no user-facing 4.8/5", () => {
    const m = read("client/src/pages/Membership.tsx");
    expect(m).not.toMatch(/4\.8\/5/);
  });

  it("CosmicAlert drama library keeps retrograde-class hooks and real hrefs", () => {
    const alert = read("client/src/components/CosmicAlert.tsx");
    expect(alert).toMatch(/水星逆行|Mercury Retrograde/);
    expect(alert).toMatch(/满月|Full Moon/);
    expect(alert).toMatch(/href:\s*"\/tarot\?type=career"/);
    expect(alert).toMatch(/href:\s*"\/horoscope"/);
    expect(alert).toMatch(/href:\s*"\/dream"/);
    // event pool size (count titleZh occurrences)
    const n = (alert.match(/titleZh:/g) || []).length;
    expect(n).toBeGreaterThanOrEqual(7);
  });

  it("SoftPaywall is dismissible and mentions trial days", () => {
    const s = read("client/src/components/SoftPaywall.tsx");
    expect(s).toMatch(/dismissed|setDismissed/);
    expect(s).toMatch(/trialCopy|trialHook|14/);
    expect(s).toMatch(/继续用免费额度|Keep free limits/);
  });

  it("trial SSOT display is 14", () => {
    expect(SIGNUP_TRIAL_DAYS_DISPLAY).toBe(14);
  });

  it("reading pages mount SoftPaywall + LoadingRitual", () => {
    for (const page of ["Tarot", "Bazi", "Dream", "Horoscope"]) {
      const src = read(`client/src/pages/${page}.tsx`);
      expect(src).toMatch(/SoftPaywall/);
      expect(src).toMatch(/LoadingRitual/);
    }
  });

  it("tarot result has upgrade moment after reading", () => {
    const t = read("client/src/pages/Tarot.tsx");
    expect(t).toMatch(/data-tarot-result-upgrade|了解试用|14/);
  });

  it("career deep link + homeVariant key remain", () => {
    expect(read("client/src/components/home/HomeSections.tsx")).toContain("/tarot?type=career");
    expect(read("client/src/lib/homeVariant.ts")).toContain("fortune.homeVariant");
  });

  it("security headers module ships XFO in production", () => {
    const s = read("server/_core/securityHeaders.ts");
    expect(s).toMatch(/X-Frame-Options/);
    expect(s).toMatch(/trpcPrefixGuard/);
    expect(read("server/_core/index.ts")).toMatch(/securityHeadersMiddleware/);
  });
});
