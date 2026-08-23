import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { spawn, type ChildProcessWithoutNullStreams } from "child_process";

const EDGE_ENTRY = path.resolve("dist/index.js");
const BRIEF_INDEX = path.resolve("dist/public/shop/brief/index.html");

describe("Render edge dist/index.js shop pretty URLs", () => {
  it("maps /shop/brief pretty paths in SHOP_PRETTY", () => {
    const src = fs.readFileSync(EDGE_ENTRY, "utf8");
    expect(src).toContain('"/shop/brief": "/shop/brief/index.html"');
    expect(src).toContain('"/shop/brief/": "/shop/brief/index.html"');
  });

  it("serves GET/HEAD /shop/brief and /shop/brief/ with brief index.html", async () => {
    expect(fs.existsSync(BRIEF_INDEX)).toBe(true);

    const port = 9876;
    const child: ChildProcessWithoutNullStreams = spawn(
      process.execPath,
      [EDGE_ENTRY],
      {
        env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" },
        stdio: "pipe",
      }
    );

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("edge server start timeout")), 5000);
      child.stdout.on("data", (chunk) => {
        if (String(chunk).includes(String(port))) {
          clearTimeout(timer);
          resolve();
        }
      });
      child.on("error", reject);
    });

    try {
      for (const route of ["/shop/brief", "/shop/brief/"]) {
        const getBody = await fetch(`http://127.0.0.1:${port}${route}`);
        expect(getBody.status).toBe(200);
        expect(getBody.headers.get("content-type")).toContain("text/html");
        const html = await getBody.text();
        expect(html).toContain("English issues");

        const head = await fetch(`http://127.0.0.1:${port}${route}`, {
          method: "HEAD",
        });
        expect(head.status).toBe(200);
        expect(head.headers.get("content-type")).toContain("text/html");
      }
    } finally {
      child.kill("SIGTERM");
      await new Promise<void>((resolve) => {
        child.on("exit", () => resolve());
        setTimeout(resolve, 1000);
      });
    }
  });
});
