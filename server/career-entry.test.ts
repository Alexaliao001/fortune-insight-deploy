/**
 * F1-1: career / job path must be one-tap visible from Home and Tarot.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("F1-1 career entry visibility", () => {
  it("Home has featured career CTA linking to tarot?type=career", () => {
    // Career CTA lives in shared HomeSections (composed by pages/Home.tsx)
    const homePage = fs.readFileSync(path.join(root, "client/src/pages/Home.tsx"), "utf8");
    expect(homePage).toMatch(/HomeCareer/);
    expect(homePage).toMatch(/from ["']@\/components\/home\/HomeSections["']/);

    const sections = fs.readFileSync(
      path.join(root, "client/src/components/home/HomeSections.tsx"),
      "utf8"
    );
    expect(sections).toContain('/tarot?type=career');
    expect(sections).toMatch(/Briefcase/);
    expect(sections).toMatch(/求职|Career/);
    expect(sections).toMatch(/function HomeCareer|export function HomeCareer/);
  });

  it("Tarot elevates career type and reads ?type= deep link", () => {
    const tarot = fs.readFileSync(path.join(root, "client/src/pages/Tarot.tsx"), "utf8");
    expect(tarot).toContain("typeFromUrl");
    expect(tarot).toContain("useSearch");
    expect(tarot).toMatch(/id:\s*"career"/);
    // career appears before love in questionTypes order
    const careerIdx = tarot.indexOf('id: "career"');
    const loveIdx = tarot.indexOf('id: "love"');
    expect(careerIdx).toBeGreaterThan(-1);
    expect(loveIdx).toBeGreaterThan(-1);
    expect(careerIdx).toBeLessThan(loveIdx);
    expect(tarot).toMatch(/featured:\s*true/);
  });

  it("Tarot share uses pull-quote summary (F1-2)", () => {
    const tarot = fs.readFileSync(path.join(root, "client/src/pages/Tarot.tsx"), "utf8");
    expect(tarot).toContain("extractPullQuote");
    expect(tarot).toContain("ShareResultCard");
    expect(tarot).toMatch(/Career Tarot|事业塔罗/);
  });
});

describe("F1-2 pull-quote copy UI", () => {
  it("TarotReport exposes copy insight control", () => {
    const report = fs.readFileSync(
      path.join(root, "client/src/components/TarotReport.tsx"),
      "utf8"
    );
    expect(report).toMatch(/Copy for share|复制金句/);
    expect(report).toContain("clipboard.writeText");
  });
});

