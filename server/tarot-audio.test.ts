/**
 * T00: dual-channel audio prefs — ambient default off, sfx default on.
 * Imports shipped client module (no re-implementation).
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  TAROT_AMBIENT_KEY,
  TAROT_SFX_KEY,
  DEFAULT_AMBIENT_ON,
  DEFAULT_SFX_ON,
  parseAudioFlag,
  flagToStorage,
  readAmbientOn,
  readSfxOn,
  writeAmbientOn,
  writeSfxOn,
  shouldPlaySfx,
  shouldPlayAmbient,
  ambientDataAttr,
  sfxDataAttr,
} from "../client/src/lib/tarotAudio";

function memoryStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    _map: map,
  };
}

describe("tarotAudio T00 dual-channel policy", () => {
  it("defaults: ambient off, sfx on", () => {
    expect(DEFAULT_AMBIENT_ON).toBe(false);
    expect(DEFAULT_SFX_ON).toBe(true);
  });

  it("empty storage → ambient off, sfx on (does not kill sfx)", () => {
    const s = memoryStorage();
    expect(readAmbientOn(s)).toBe(false);
    expect(readSfxOn(s)).toBe(true);
    expect(shouldPlayAmbient(readAmbientOn(s))).toBe(false);
    expect(shouldPlaySfx(readSfxOn(s))).toBe(true);
  });

  it("parseAudioFlag respects defaults and 0/1/on/off", () => {
    expect(parseAudioFlag(null, false)).toBe(false);
    expect(parseAudioFlag(undefined, true)).toBe(true);
    expect(parseAudioFlag("", true)).toBe(true);
    expect(parseAudioFlag("0", true)).toBe(false);
    expect(parseAudioFlag("1", false)).toBe(true);
    expect(parseAudioFlag("off", true)).toBe(false);
    expect(parseAudioFlag("ON", false)).toBe(true);
  });

  it("toggling sfx off blocks sfx path; ambient default still independent", () => {
    const s = memoryStorage();
    writeSfxOn(s, false);
    expect(s.getItem(TAROT_SFX_KEY)).toBe("0");
    expect(readSfxOn(s)).toBe(false);
    expect(shouldPlaySfx(readSfxOn(s))).toBe(false);
    // ambient still default off — turning sfx off must not imply ambient on
    expect(readAmbientOn(s)).toBe(false);
  });

  it("enabling ambient does not force sfx off", () => {
    const s = memoryStorage();
    writeAmbientOn(s, true);
    expect(s.getItem(TAROT_AMBIENT_KEY)).toBe("1");
    expect(readAmbientOn(s)).toBe(true);
    expect(shouldPlayAmbient(true)).toBe(true);
    expect(readSfxOn(s)).toBe(true);
    expect(shouldPlaySfx(true)).toBe(true);
  });

  it("flagToStorage and data attrs", () => {
    expect(flagToStorage(true)).toBe("1");
    expect(flagToStorage(false)).toBe("0");
    expect(ambientDataAttr(false)).toBe("off");
    expect(ambientDataAttr(true)).toBe("on");
    expect(sfxDataAttr(true)).toBe("on");
    expect(sfxDataAttr(false)).toBe("off");
  });

  it("keys are namespaced fi.tarot.*", () => {
    expect(TAROT_AMBIENT_KEY).toBe("fi.tarot.ambient");
    expect(TAROT_SFX_KEY).toBe("fi.tarot.sfx");
  });
});
