import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");

/** Shop pages that must exist in dist/public for Render edge (dist/index.js serves dist/public). */
const RENDER_SHOP_PAGES = [
  "shop/p/app-store-hdr-chinese.html",
  "shop/p/app-store-apple-log-chinese.html",
];

function shopFile(rel: string, tree: "client" | "dist"): string {
  return path.join(root, tree === "client" ? "client/public" : "dist/public", rel);
}

describe("shop static dist/public sync (Render prebuilt deploy)", () => {
  for (const rel of RENDER_SHOP_PAGES) {
    it(`${rel} exists in client/public and dist/public with identical content`, () => {
      const clientPath = shopFile(rel, "client");
      const distPath = shopFile(rel, "dist");
      expect(fs.existsSync(clientPath)).toBe(true);
      expect(fs.existsSync(distPath)).toBe(true);
      expect(fs.readFileSync(distPath, "utf8")).toBe(fs.readFileSync(clientPath, "utf8"));
    });
  }

  it("dist/public shop hubs reference HDR listing URL", () => {
    for (const hub of ["shop/index.html", "shop/sitemap.xml", "shop/feed.xml", "shop/llms.txt"]) {
      const distHub = shopFile(hub, "dist");
      expect(fs.existsSync(distHub)).toBe(true);
      expect(fs.readFileSync(distHub, "utf8")).toContain("app-store-hdr-chinese.html");
    }
  });
});
