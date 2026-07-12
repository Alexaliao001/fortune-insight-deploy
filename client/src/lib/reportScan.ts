/**
 * Shared report scan helpers for Tarot / BaZi / Dream / Horoscope.
 * Pure functions — unit-testable without React.
 */

/** First shareable sentence for pull-quote strips and ShareResultCard summaries. */
export function extractPullQuote(text: string, maxLen = 120): string {
  if (!text?.trim()) return "";
  const cleaned = text
    .replace(/^#{1,4}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  const units = cleaned.split(/(?<=[。！？.!?])/).map((s) => s.trim()).filter(Boolean);
  let quote = (units[0] || cleaned).trim();
  if (quote.length > maxLen) {
    quote = quote.slice(0, maxLen - 1).replace(/\s+\S*$/, "") + "…";
  }
  return quote;
}

/** Non-empty summary for share cards: pull-quote first, else truncated plain text. */
export function shareSummaryFromReading(text: string, maxLen = 200): string {
  const q = extractPullQuote(text, maxLen);
  if (q) return q;
  const plain = (text || "").replace(/[#*_`>\-]/g, "").replace(/\s+/g, " ").trim();
  if (!plain) return "";
  return plain.length > maxLen ? plain.slice(0, maxLen - 1) + "…" : plain;
}
