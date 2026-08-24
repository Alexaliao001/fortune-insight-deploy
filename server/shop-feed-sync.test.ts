import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const clientBriefFeed = path.join(root, "client/public/shop/brief/feed.xml");
const distBriefFeed = path.join(root, "dist/public/shop/brief/feed.xml");

describe("shop brief feed.xml (client/public vs dist/public)", () => {
  it("dist/public copy matches client/public for Render prebuilt deploy", () => {
    expect(fs.existsSync(clientBriefFeed)).toBe(true);
    expect(fs.existsSync(distBriefFeed)).toBe(true);
    expect(fs.readFileSync(distBriefFeed, "utf8")).toBe(
      fs.readFileSync(clientBriefFeed, "utf8")
    );
  });

  it("served brief feed includes WebSub atom self and hub discovery links", () => {
    const xml = fs.readFileSync(distBriefFeed, "utf8");
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(xml).toContain(
      '<atom:link rel="self" href="https://fortune-insight.onrender.com/shop/brief/feed.xml" />'
    );
    expect(xml).toContain(
      '<atom:link rel="hub" href="https://pubsubhubbub.appspot.com/" />'
    );
  });
});
