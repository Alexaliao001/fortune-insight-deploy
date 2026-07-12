/**
 * T01: shuffle phase policy — pure helpers from shipped tarotRitual module.
 */
import { describe, it, expect } from "vitest";
import {
  SHUFFLE_DURATION_MS,
  initialDrawingPhase,
  isShufflePhase,
  isReadyToPick,
  drawingPhaseAttr,
  afterShuffleComplete,
  nextSlotIndex,
  cardFlyLayoutId,
  flyTransition,
  slotFilledAttr,
  FLY_SPRING,
  FLY_REDUCED,
  FLIP_FLASH_MS,
  FLIP_PARTICLE_COUNT,
  flipFlashAttr,
  flipParticleOffset,
  tryTapVibrate,
  TAP_VIBRATE_MS,
  afterAllCardsDrawn,
  isAwaitReading,
  AWAIT_READING_EMPHASIS_MS,
  rollIsReversed,
  drawToneHz,
  questionTemplates,
  isValidSpreadSize,
} from "../client/src/lib/tarotRitual";

describe("tarotRitual T01 shuffle phase", () => {
  it("shuffle duration within 0.8–1.5s", () => {
    expect(SHUFFLE_DURATION_MS).toBeGreaterThanOrEqual(800);
    expect(SHUFFLE_DURATION_MS).toBeLessThanOrEqual(1500);
  });

  it("reduced-motion starts ready (skip animation)", () => {
    expect(initialDrawingPhase(true)).toBe("ready");
    expect(isReadyToPick(initialDrawingPhase(true))).toBe(true);
    expect(isShufflePhase(initialDrawingPhase(true))).toBe(false);
  });

  it("normal motion starts shuffle", () => {
    expect(initialDrawingPhase(false)).toBe("shuffle");
    expect(isShufflePhase("shuffle")).toBe(true);
    expect(isReadyToPick("shuffle")).toBe(false);
  });

  it("after complete or skip → ready", () => {
    expect(afterShuffleComplete()).toBe("ready");
    expect(drawingPhaseAttr("shuffle")).toBe("shuffle");
    expect(drawingPhaseAttr("ready")).toBe("ready");
  });
});

describe("tarotRitual T02 fly into slot", () => {
  it("nextSlotIndex maps drawn count to 0..2", () => {
    expect(nextSlotIndex(0)).toBe(0);
    expect(nextSlotIndex(1)).toBe(1);
    expect(nextSlotIndex(2)).toBe(2);
    expect(nextSlotIndex(3)).toBe(2);
  });

  it("layoutId is stable per card", () => {
    expect(cardFlyLayoutId(7)).toBe("tarot-fly-7");
    expect(cardFlyLayoutId(0)).toBe("tarot-fly-0");
  });

  it("fly transition uses spring or reduced short fade", () => {
    expect(flyTransition(false)).toEqual(FLY_SPRING);
    expect(flyTransition(true)).toEqual(FLY_REDUCED);
    expect(slotFilledAttr(true)).toBe("true");
    expect(slotFilledAttr(false)).toBe("false");
  });
});

describe("tarotRitual T03 flip gold flash", () => {
  it("flash duration ≤400ms and particle count ≤12", () => {
    expect(FLIP_FLASH_MS).toBeLessThanOrEqual(400);
    expect(FLIP_FLASH_MS).toBeGreaterThan(0);
    expect(FLIP_PARTICLE_COUNT).toBeLessThanOrEqual(12);
    expect(FLIP_PARTICLE_COUNT).toBeGreaterThan(0);
  });

  it("flipFlashAttr and particle offsets", () => {
    expect(flipFlashAttr(true)).toBe("flash");
    expect(flipFlashAttr(false)).toBeUndefined();
    const p0 = flipParticleOffset(0, 8, 36);
    expect(typeof p0.x).toBe("number");
    expect(typeof p0.y).toBe("number");
    expect(Math.hypot(p0.x, p0.y)).toBeCloseTo(36, 5);
  });
});

describe("tarotRitual T04 tap vibrate", () => {
  it("short pulse duration", () => {
    expect(TAP_VIBRATE_MS).toBeGreaterThan(0);
    expect(TAP_VIBRATE_MS).toBeLessThanOrEqual(50);
  });

  it("no API → false, no throw", () => {
    expect(tryTapVibrate(undefined)).toBe(false);
    expect(tryTapVibrate(null)).toBe(false);
  });

  it("calls vibrate with ms when available", () => {
    const calls: Array<number | number[]> = [];
    const vibrate = (p: number | number[]) => {
      calls.push(p);
      return true;
    };
    expect(tryTapVibrate(vibrate, 12)).toBe(true);
    expect(calls).toEqual([12]);
  });

  it("swallows vibrate exceptions", () => {
    const vibrate = () => {
      throw new Error("denied");
    };
    expect(tryTapVibrate(vibrate)).toBe(false);
  });
});

describe("tarotRitual T06 await-reading emphasis", () => {
  it("afterAllCardsDrawn → await-reading; pick still allowed", () => {
    expect(afterAllCardsDrawn()).toBe("await-reading");
    expect(isAwaitReading("await-reading")).toBe(true);
    expect(isReadyToPick("await-reading")).toBe(true);
    expect(AWAIT_READING_EMPHASIS_MS).toBe(2000);
  });
});

describe("tarotRitual T09/T16/T17/T21 helpers", () => {
  it("rollIsReversed respects RNG", () => {
    expect(rollIsReversed(() => 0.1)).toBe(true);
    expect(rollIsReversed(() => 0.5)).toBe(false);
  });

  it("drawToneHz increases by slot", () => {
    expect(drawToneHz(0)).toBeLessThan(drawToneHz(1));
    expect(drawToneHz(1)).toBeLessThan(drawToneHz(2));
    expect(drawToneHz(99)).toBe(drawToneHz(2));
  });

  it("questionTemplates returns 3 per type", () => {
    expect(questionTemplates("career", "zh")).toHaveLength(3);
    expect(questionTemplates("love", "en")).toHaveLength(3);
    expect(isValidSpreadSize(1)).toBe(true);
    expect(isValidSpreadSize(3)).toBe(true);
    expect(isValidSpreadSize(2)).toBe(false);
  });
});
