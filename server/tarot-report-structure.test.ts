/**
 * F0-8: TarotReport format helpers (real shipped module).
 */
import { describe, it, expect } from "vitest";
import { extractPullQuote } from "../client/src/lib/tarotReportFormat";

describe("extractPullQuote (F0-8)", () => {
  it("returns first Chinese sentence", () => {
    const q = extractPullQuote(
      "这个牌阵呈现出一种由内而外的能量转化与挑战。后面还有很多细节不要出现。"
    );
    expect(q).toContain("能量转化");
    expect(q).not.toContain("后面还有");
  });

  it("strips markdown noise", () => {
    const q = extractPullQuote(
      "## 总体能量\n**重要提示**：你需要先安静下来，再做决定。继续往下读。"
    );
    expect(q).not.toContain("##");
    expect(q).not.toContain("**");
    expect(q.length).toBeGreaterThan(10);
  });

  it("returns empty for blank", () => {
    expect(extractPullQuote("")).toBe("");
  });
});
