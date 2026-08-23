import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { isShopPath, resolveShopFile, resolveShopRelative } from "./shopStatic";

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
    expect(resolveShopRelative("/shop/brief")).toBe("/shop/brief/index.html");
  });

  it("resolves /shop/brief pretty URLs to brief index.html", () => {
    expect(resolveShopFile("/shop/brief/")).toBeTruthy();
    expect(resolveShopFile("/shop/brief")).toBeTruthy();
    const file = resolveShopFile("/shop/brief/");
    if (file) {
      expect(file).toMatch(/brief[/\\]index\.html$/);
    }
  });

  it("shop index file exists in repo", () => {
    const file = resolveShopFile("/shop/");
    expect(file).toBeTruthy();
    if (file) {
      const html = fs.readFileSync(file, "utf8");
      expect(html).toContain("Storefront Brief");
    }
  });
});
