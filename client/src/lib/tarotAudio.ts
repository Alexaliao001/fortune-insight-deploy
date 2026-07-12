/**
 * Tarot dual-channel audio policy (GROK_GOAL_TAROT T00).
 *
 * ambient — background/loop pad: DEFAULT OFF
 * sfx     — draw/reveal/shuffle short tones: DEFAULT ON
 *
 * Separate localStorage keys; never use a master mute that defaults sfx off.
 */

export const TAROT_AMBIENT_KEY = "fi.tarot.ambient";
export const TAROT_SFX_KEY = "fi.tarot.sfx";

/** Ambient default: muted/off */
export const DEFAULT_AMBIENT_ON = false;
/** SFX default: on (restrained gain at call site) */
export const DEFAULT_SFX_ON = true;

/**
 * Parse stored flag. Empty/missing → defaultOn.
 * Accepts 0/1, true/false, on/off (case-insensitive).
 */
export function parseAudioFlag(
  raw: string | null | undefined,
  defaultOn: boolean
): boolean {
  if (raw === null || raw === undefined) return defaultOn;
  const v = String(raw).trim().toLowerCase();
  if (v === "") return defaultOn;
  if (v === "0" || v === "false" || v === "off" || v === "no") return false;
  if (v === "1" || v === "true" || v === "on" || v === "yes") return true;
  return defaultOn;
}

export function flagToStorage(on: boolean): string {
  return on ? "1" : "0";
}

export type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export function readAmbientOn(storage: StorageLike): boolean {
  return parseAudioFlag(storage.getItem(TAROT_AMBIENT_KEY), DEFAULT_AMBIENT_ON);
}

export function readSfxOn(storage: StorageLike): boolean {
  return parseAudioFlag(storage.getItem(TAROT_SFX_KEY), DEFAULT_SFX_ON);
}

export function writeAmbientOn(storage: StorageLike, on: boolean): void {
  storage.setItem(TAROT_AMBIENT_KEY, flagToStorage(on));
}

export function writeSfxOn(storage: StorageLike, on: boolean): void {
  storage.setItem(TAROT_SFX_KEY, flagToStorage(on));
}

/** SFX path may play only when sfx channel is on */
export function shouldPlaySfx(sfxOn: boolean): boolean {
  return sfxOn === true;
}

/** Ambient path may play only when ambient channel is on (default false) */
export function shouldPlayAmbient(ambientOn: boolean): boolean {
  return ambientOn === true;
}

/** data-tarot-* hook values */
export function ambientDataAttr(ambientOn: boolean): "on" | "off" {
  return ambientOn ? "on" : "off";
}

export function sfxDataAttr(sfxOn: boolean): "on" | "off" {
  return sfxOn ? "on" : "off";
}
