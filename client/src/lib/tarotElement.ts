/**
 * T08: element → border color for flipped cards.
 * Source of truth for element string: tarot-database TarotCard.element.
 */

import { getCardByName } from "../../../server/tarot-database";

export type TarotElement = "fire" | "water" | "air" | "earth" | "unknown";

/** Border/glow per classical element (readable on dark altar) */
export const ELEMENT_BORDER_CLASS: Record<Exclude<TarotElement, "unknown">, string> = {
  fire: "border-orange-400/70 shadow-[0_0_16px_rgba(251,146,60,0.25)]",
  water: "border-sky-400/70 shadow-[0_0_16px_rgba(56,189,248,0.22)]",
  air: "border-violet-300/70 shadow-[0_0_16px_rgba(196,181,253,0.22)]",
  earth: "border-emerald-400/70 shadow-[0_0_16px_rgba(52,211,153,0.22)]",
};

export function normalizeElement(raw: string | undefined | null): TarotElement {
  if (!raw) return "unknown";
  const e = raw.trim().toLowerCase();
  if (e === "fire" || e === "water" || e === "air" || e === "earth") return e;
  return "unknown";
}

export function elementForCardName(name: string): TarotElement {
  const card = getCardByName(name);
  return normalizeElement(card?.element);
}

export function elementBorderClass(el: TarotElement): string {
  if (el === "unknown") return "border-[#d4a843]/50";
  return ELEMENT_BORDER_CLASS[el];
}

export function elementDataAttr(el: TarotElement): TarotElement {
  return el;
}
