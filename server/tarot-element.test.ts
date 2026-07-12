/**
 * T08: element mapping from shipped tarot-database via client helper.
 */
import { describe, it, expect } from "vitest";
import {
  normalizeElement,
  elementForCardName,
  elementBorderClass,
  elementDataAttr,
  ELEMENT_BORDER_CLASS,
} from "../client/src/lib/tarotElement";
import { getCardByName } from "./tarot-database";

describe("tarotElement T08", () => {
  it("normalizeElement maps Fire/Water/Air/Earth", () => {
    expect(normalizeElement("Fire")).toBe("fire");
    expect(normalizeElement("water")).toBe("water");
    expect(normalizeElement("AIR")).toBe("air");
    expect(normalizeElement("Earth")).toBe("earth");
    expect(normalizeElement("")).toBe("unknown");
  });

  it("elementForCardName uses DB element (愚者 = Air)", () => {
    const db = getCardByName("愚者");
    expect(db?.element).toBe("Air");
    expect(elementForCardName("愚者")).toBe("air");
    expect(elementForCardName("The Fool")).toBe("air");
  });

  it("distinct border classes per element", () => {
    const classes = [
      elementBorderClass("fire"),
      elementBorderClass("water"),
      elementBorderClass("air"),
      elementBorderClass("earth"),
    ];
    expect(new Set(classes).size).toBe(4);
    expect(elementBorderClass("fire")).toBe(ELEMENT_BORDER_CLASS.fire);
    expect(elementDataAttr("fire")).toBe("fire");
  });

  it("unknown card → unknown element + gold fallback border", () => {
    expect(elementForCardName("NotACard")).toBe("unknown");
    expect(elementBorderClass("unknown")).toContain("#d4a843");
  });
});
