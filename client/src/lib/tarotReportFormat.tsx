import type { ReactNode } from "react";

/** Re-export shared scan helper (canonical: reportScan.ts). */
export { extractPullQuote, shareSummaryFromReading } from "./reportScan";

/** Inline **bold** → gold emphasis spans */
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className="font-semibold text-[#f0e6c8]">
          {m[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/**
 * Format section content into scannable blocks (F0-8):
 * sub-headers, bullets, bold emphasis — not a raw markdown wall.
 */
export function formatSectionContent(content: string): ReactNode {
  const lines = content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd());

  const nodes: ReactNode[] = [];
  let bulletBuf: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (!bulletBuf.length) return;
    nodes.push(
      <ul key={`ul-${key++}`} className="list-none space-y-1.5 pl-0 my-1">
        {bulletBuf.map((b, i) => (
          <li key={i} className="flex gap-2 text-gray-300">
            <span className="text-[#d4a843]/80 shrink-0 mt-0.5">✦</span>
            <span className="min-w-0">{renderInline(b)}</span>
          </li>
        ))}
      </ul>
    );
    bulletBuf = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushBullets();
      continue;
    }
    if (/^#{1,4}\s+/.test(line)) {
      flushBullets();
      const title = line.replace(/^#{1,4}\s+/, "").replace(/\*\*/g, "");
      nodes.push(
        <h4
          key={`h-${key++}`}
          className="font-display text-[13px] font-semibold text-[#d4a843] tracking-wide mt-3 mb-1"
        >
          {title}
        </h4>
      );
      continue;
    }
    if (/^[-*•]\s+/.test(line)) {
      bulletBuf.push(line.replace(/^[-*•]\s+/, ""));
      continue;
    }
    flushBullets();
    nodes.push(
      <p key={`p-${key++}`} className="text-gray-300 leading-[1.75]">
        {renderInline(line)}
      </p>
    );
  }
  flushBullets();

  if (nodes.length === 0) {
    return (
      <p className="text-gray-300 leading-[1.75] whitespace-pre-line">
        {content.replace(/\*\*/g, "").trim()}
      </p>
    );
  }
  return <>{nodes}</>;
}
