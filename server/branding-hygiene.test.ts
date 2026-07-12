/**
 * F0-3: public client shell must not advertise host-platform login or analytics.
 * Reads real shipped source files (and built index when present).
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const FORBIDDEN = [
  /manus-analytics\.com/i,
  /manus-runtime/i,
  /vite-plugin-manus/i,
  /Manus OAuth/i,
  /旧版\s*Manus/i,
  /Continue with Manus/i,
  /app-auth/i, // Manus OAuth portal path fragment
];

function read(rel: string): string {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function assertClean(label: string, text: string) {
  for (const re of FORBIDDEN) {
    expect(text, `${label} must not match ${re}`).not.toMatch(re);
  }
}

describe("F0-3 branding hygiene (login + HTML shell)", () => {
  it("Login page has native email/password only (no Manus login CTA)", () => {
    const login = read("client/src/pages/Login.tsx");
    assertClean("Login.tsx", login);
    expect(login).toMatch(/auth\.login/);
    expect(login).toMatch(/auth\.register/);
    expect(login).not.toMatch(/getManusLoginUrl/);
    expect(login).not.toMatch(/hasManusOAuth/);
  });

  it("getLoginUrl points to /login not external OAuth portal", () => {
    const c = read("client/src/const.ts");
    assertClean("const.ts", c);
    expect(c).toMatch(/\/login/);
    expect(c).not.toMatch(/OAUTH_PORTAL/);
    expect(c).not.toMatch(/app-auth/);
  });

  it("index.html shell has no platform analytics / runtime inject", () => {
    const html = read("client/index.html");
    assertClean("client/index.html", html);
    // literal word "manus" must not appear in public HTML (view-source)
    expect(html.toLowerCase()).not.toContain("manus");
  });

  it("vite config does not enable platform runtime plugin", () => {
    const vite = read("vite.config.ts");
    expect(vite).not.toMatch(/vitePluginManusRuntime/);
    expect(vite).not.toMatch(/from ["']vite-plugin-manus-runtime["']/);
  });

  it("package.json does not depend on platform runtime plugin", () => {
    const pkg = JSON.parse(read("package.json"));
    const all = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    expect(all["vite-plugin-manus-runtime"]).toBeUndefined();
  });

  it("built dist/public/index.html is clean when build output exists", () => {
    const built = path.join(root, "dist/public/index.html");
    if (!fs.existsSync(built)) {
      // build may not have run yet in pure unit CI; source checks above still gate
      expect(fs.existsSync(path.join(root, "client/index.html"))).toBe(true);
      return;
    }
    const html = fs.readFileSync(built, "utf8");
    assertClean("dist/public/index.html", html);
    expect(html.toLowerCase()).not.toContain("manus");
  });
});
