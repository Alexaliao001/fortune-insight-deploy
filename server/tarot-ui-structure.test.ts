/**
 * F0-7: Tarot drawing stage must ship ritual visual structure (gold altar language).
 * Structural check on the real page source — not a reimplementation.
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const tarotPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../client/src/pages/Tarot.tsx"
);

describe("F0-7 Tarot drawing ritual structure", () => {
  const src = fs.readFileSync(tarotPath, "utf8");

  it("uses gold ritual accent for drawing UI", () => {
    expect(src).toContain("#d4a843");
    expect(src).toMatch(/drawnCards\.length\s*\/\s*3|\/3/);
  });

  it("marks next empty slot for selection focus", () => {
    expect(src).toContain("isNext");
    expect(src).toMatch(/ring-\[#d4a843\]/);
  });

  it("keeps 3-card spread slots and deck pick UX", () => {
    expect(src).toContain('stage === "drawing"');
    expect(src).toContain("handleDrawCard");
    expect(src).toContain("handleStartReading");
    expect(src).toMatch(/Start Reading|开始解读/);
  });

  it("T01: shuffle phase hooks and skip control", () => {
    expect(src).toContain("data-tarot-phase");
    expect(src).toContain("drawingPhaseAttr");
    expect(src).toContain("skipShuffle");
    expect(src).toContain('data-tarot-action="skip-shuffle"');
    expect(src).toContain("SHUFFLE_DURATION_MS");
    expect(src).toContain("prefers-reduced-motion");
  });

  it("T02: fly-into-slot layoutId and slot data hooks", () => {
    expect(src).toContain("cardFlyLayoutId");
    expect(src).toContain("data-tarot-slot");
    expect(src).toContain("data-filled");
    expect(src).toContain("flyTransition");
    expect(src).toContain("nextSlotIndex");
  });

  it("T03: flip gold flash hook and particle budget", () => {
    expect(src).toContain("data-tarot-flip");
    expect(src).toContain("FLIP_FLASH_MS");
    expect(src).toContain("FLIP_PARTICLE_COUNT");
    expect(src).toContain("flipFlashSlot");
    expect(src).toContain("flipParticleOffset");
  });

  it("T04: tap vibrate on draw (safe no-throw helper)", () => {
    expect(src).toContain("tryTapVibrate");
    expect(src).toMatch(/tryTapVibrate\s*\(/);
  });

  it("T05: drawing altar atmosphere hook (drawing only)", () => {
    expect(src).toContain('data-tarot-altar="1"');
    expect(src).toContain('stage === "drawing"');
    const css = fs.readFileSync(
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../client/src/index.css"),
      "utf8"
    );
    expect(css).toContain('[data-tarot-altar="1"]');
    expect(css).toContain("tarotAltarBreathe");
    expect(css).toMatch(/prefers-reduced-motion/);
  });

  it("T06: await-reading CTA emphasis without disable", () => {
    expect(src).toContain("afterAllCardsDrawn");
    expect(src).toContain("awaitCtaPulse");
    expect(src).toContain("AWAIT_READING_EMPHASIS_MS");
    expect(src).toContain('data-tarot-action="start-reading"');
    expect(src).toContain("data-tarot-cta-pulse");
    // must not disable Start Reading when pulsing
    expect(src).not.toMatch(/start-reading[^>]{0,80}disabled/);
  });

  it("T07: keyword chips from deck DB helper", () => {
    expect(src).toContain("keywordsForCardName");
    expect(src).toContain("data-tarot-keywords");
  });

  it("T08: element border mapping hooks", () => {
    expect(src).toContain("elementForCardName");
    expect(src).toContain("elementBorderClass");
    expect(src).toContain("data-tarot-element");
  });

  it("T09–T21 batch hooks present", () => {
    expect(src).toContain("rollIsReversed");
    expect(src).toContain("data-tarot-orientation");
    expect(src).toContain("TarotCardFace");
    expect(src).toContain("data-tarot-pullquote");
    expect(src).toContain('data-tarot-action="again"');
    expect(src).toContain('data-tarot-action="retype"');
    expect(src).toContain("data-tarot-cross-sell");
    expect(src).toContain("data-tarot-spread");
    expect(src).toContain("data-tarot-template");
    expect(src).toContain("questionTemplates");
    expect(src).toContain("drawToneHz");
    expect(src).toContain("handleAgain");
  });
});
