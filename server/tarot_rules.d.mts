export type TarotPreviewResult = {
  ok: true;
  spread: "single";
  card: {
    id: number;
    name_en: string;
    name_zh: string;
    upright: boolean;
    orientation: string;
    keywords: string[];
    meaning: string;
  };
  summary: string;
  disclaimer: string;
  source: "rules";
  meta: {
    version: "sx3-1.0";
    language: "zh" | "en";
    question: string | null;
    rate_remaining?: number;
    service?: string;
  };
};

export declare function drawSingleCard(options?: {
  question?: string;
  language?: string;
}): TarotPreviewResult;
