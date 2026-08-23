import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { isShopPath, resolveShopRelative } from "./shopStatic";

// expose resolveShopFile for tests
function resolveShopFileForTest(urlPath: string): string | null {
  const rel = resolveShopRelative(urlPath);
  const roots = [
    path.resolve(import.meta.dirname, "..", "dist", "public"),
    path.resolve(import.meta.dirname, "..", "client", "public"),
  ];
  for (const root of roots) {
    const file = path.normalize(path.join(root, rel.replace(/^\//, "")));
    if (!file.startsWith(root)) continue;
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

describe("shopStatic", () => {
  it("isShopPath matches /shop routes", () => {
    expect(isShopPath("/shop")).toBe(true);
    expect(isShopPath("/shop/")).toBe(true);
    expect(isShopPath("/shop/s/foo.html")).toBe(true);
    expect(isShopPath("/tarot")).toBe(false);
    expect(isShopPath("/shopping")).toBe(false);
  });

  it("resolveShopRelative maps pretty URLs", () => {
    expect(resolveShopRelative("/shop")).toBe("/shop/index.html");
    expect(resolveShopRelative("/shop/listing-rewrite")).toBe(
      "/shop/listing-rewrite.html"
    );
    expect(resolveShopRelative("/shop/brief/")).toBe("/shop/brief/index.html");
  });

  it("shop index file exists in repo", () => {
    const file = resolveShopFileForTest("/shop/");
    expect(file).toBeTruthy();
    if (file) {
      const html = fs.readFileSync(file, "utf8");
      expect(html).toContain("店头简报");
    }
  });
});
