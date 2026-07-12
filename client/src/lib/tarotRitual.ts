/**
 * Tarot drawing ritual helpers (GROK_GOAL_TAROT W1).
 * Pure functions — unit-tested without DOM.
 */

export type DrawingPhase = "shuffle" | "ready" | "await-reading";

/** Shuffle entrance duration (0.8–1.5s budget) */
export const SHUFFLE_DURATION_MS = 1200;

/** T06: CTA visual emphasis after all 3 cards (does not disable button) */
export const AWAIT_READING_EMPHASIS_MS = 2000;

/**
 * Initial phase when entering drawing.
 * reduced-motion → skip straight to ready.
 */
export function initialDrawingPhase(reducedMotion: boolean): DrawingPhase {
  return reducedMotion ? "ready" : "shuffle";
}

export function isShufflePhase(phase: DrawingPhase): boolean {
  return phase === "shuffle";
}

/** Can pick from deck or view altar (not during shuffle) */
export function isReadyToPick(phase: DrawingPhase): boolean {
  return phase === "ready" || phase === "await-reading";
}

export function isAwaitReading(phase: DrawingPhase): boolean {
  return phase === "await-reading";
}

/** data-tarot-phase attribute value */
export function drawingPhaseAttr(phase: DrawingPhase): DrawingPhase {
  return phase;
}

/**
 * After shuffle timer or user skip → ready.
 */
export function afterShuffleComplete(): DrawingPhase {
  return "ready";
}

/** After 3 cards drawn → await-reading (CTA emphasis window) */
export function afterAllCardsDrawn(): DrawingPhase {
  return "await-reading";
}

/** T02: next empty slot index after n cards already drawn (0..2) */
export function nextSlotIndex(drawnCount: number): number {
  if (drawnCount < 0) return 0;
  if (drawnCount > 2) return 2;
  return drawnCount;
}

/** Shared layoutId for deck → slot flight (only the selected card) */
export function cardFlyLayoutId(cardId: number | string): string {
  return `tarot-fly-${cardId}`;
}

export const FLY_SPRING = { type: "spring" as const, stiffness: 280, damping: 26 };
export const FLY_REDUCED = { duration: 0.15 };

/**
 * Motion transition for fly-into-slot.
 * reduced-motion → short fade, no big spring travel.
 */
export function flyTransition(reducedMotion: boolean) {
  return reducedMotion ? FLY_REDUCED : FLY_SPRING;
}

/** data-filled attr for slots */
export function slotFilledAttr(hasCard: boolean): "true" | "false" {
  return hasCard ? "true" : "false";
}

/** T03: gold flip flash duration (≤400ms) */
export const FLIP_FLASH_MS = 380;

/** Max decorative particles for flip flash (goal: ≤12) */
export const FLIP_PARTICLE_COUNT = 8;

export function flipFlashAttr(active: boolean): "flash" | undefined {
  return active ? "flash" : undefined;
}

/** Particle offsets around center for flip spark (unit circle) */
export function flipParticleOffset(
  index: number,
  total: number = FLIP_PARTICLE_COUNT,
  radius = 36
): { x: number; y: number } {
  const a = (index / Math.max(total, 1)) * Math.PI * 2;
  return { x: Math.cos(a) * radius, y: Math.sin(a) * radius };
}

/** T04: short tap haptic (ms) */
export const TAP_VIBRATE_MS = 12;

export type VibrateFn = (pattern: number | number[]) => boolean;

/**
 * Fire a short vibration if the environment supports it.
 * Never throws — missing API / denied → false.
 */
export function tryTapVibrate(
  vibrate: VibrateFn | undefined | null = typeof navigator !== "undefined"
    ? (
        navigator as Navigator & { vibrate?: VibrateFn }
      ).vibrate?.bind(navigator)
    : undefined,
  ms: number = TAP_VIBRATE_MS
): boolean {
  if (typeof vibrate !== "function") return false;
  try {
    const ok = vibrate(ms);
    // Some browsers return undefined on success
    return ok === true || ok === undefined;
  } catch {
    return false;
  }
}

/** T09: ~30% reverse rate matching legacy API path */
export function rollIsReversed(rand: () => number = Math.random): boolean {
  return rand() < 0.3;
}

export type SpreadSize = 1 | 3;

export function isValidSpreadSize(n: number): n is SpreadSize {
  return n === 1 || n === 3;
}

/** T21: progressive pitch for 1st/2nd/3rd draw (Hz) */
export function drawToneHz(drawIndex: number): number {
  const base = 400;
  const step = 80;
  const i = Math.max(0, Math.min(2, Math.floor(drawIndex)));
  return base + i * step;
}

/** T17: question templates per type (zh/en) */
export function questionTemplates(
  typeId: string,
  language: "zh" | "en"
): string[] {
  const zh: Record<string, string[]> = {
    love: ["我和TA的关系会如何发展？", "这段感情里我该注意什么？", "我近期的桃花运如何？"],
    career: ["我的事业下一步机会在哪里？", "跳槽还是留下更合适？", "如何突破当前工作瓶颈？"],
    wealth: ["我近期的财运走势如何？", "投资上该更进取还是稳健？", "金钱上我该放下什么执念？"],
    general: ["我近期的整体运势如何？", "当下最该专注的一件事是？", "宇宙想给我什么提醒？"],
    health: ["我该如何更好照顾身心？", "压力来自哪里、如何疏解？", "近期作息上要注意什么？"],
  };
  const en: Record<string, string[]> = {
    love: ["How will my relationship evolve?", "What should I watch in this bond?", "What does romance hold for me soon?"],
    career: ["Where is my next career opportunity?", "Stay or move on—what fits better?", "How do I break through at work?"],
    wealth: ["What is my near-term money energy?", "Should I be bold or cautious with money?", "What money mindset should I release?"],
    general: ["What does my overall path look like now?", "What deserves my focus most?", "What message do I need today?"],
    health: ["How can I care for body and mind better?", "Where is stress coming from?", "What habit should I adjust soon?"],
  };
  const map = language === "zh" ? zh : en;
  return (map[typeId] || map.general).slice(0, 3);
}
