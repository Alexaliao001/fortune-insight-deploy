/**
 * Homepage appearance variant contract.
 * Five skins share one conversion IA; differences are layout/presentation only.
 *
 * Site-wide policy (see also docs in PROGRESS_HOME / push notes):
 * - Variants are homepage skins. Other product pages (Tarot/BaZi/…) keep ONE layout.
 * - Preference is stored so we can later soft-tint chrome via data-home-variant on <html>.
 * - classic ≈ pre-multi-variant homepage structure (minus fake live / 4.8).
 */

export const HOME_VARIANT_STORAGE_KEY = "fortune.homeVariant" as const;

export const HOME_VARIANT_IDS = [
  "classic",
  "focus",
  "ritual",
  "plans",
  "minimal",
] as const;

export type HomeVariantId = (typeof HOME_VARIANT_IDS)[number];

export const DEFAULT_HOME_VARIANT: HomeVariantId = "focus";

export type SecondaryCtaTarget = "login" | "membership";
export type HomeDensity = "comfortable" | "cozy" | "compact";
export type HomeDecorLevel = "low" | "mid" | "high";
/** classic uses pre-refactor alert styling; others use calm "theme" tone when alert is on */
export type HomeAlertTone = "legacy" | "weak";

/** Layout/presentation flags only — not competing conversion funnels. */
export interface HomeVariantFlags {
  heroPreviewDual: boolean;
  /** Independent result-preview mock (dual hero OR separate section). classic=false (old home had none). */
  showResultPreview: boolean;
  showCosmicAlert: boolean;
  alertTone: HomeAlertTone;
  secondaryCta: SecondaryCtaTarget;
  showCommunityBlock: boolean;
  /** Show ¥/$ price block in membership CTA (old classic + plans). */
  showMembershipPrice: boolean;
  density: HomeDensity;
  decorLevel: HomeDecorLevel;
}

export interface HomeVariantMeta {
  id: HomeVariantId;
  labelZh: string;
  labelEn: string;
  blurbZh: string;
  blurbEn: string;
  recommended?: boolean;
}

export const HOME_VARIANT_META: readonly HomeVariantMeta[] = [
  {
    id: "classic",
    labelZh: "经典",
    labelEn: "Classic",
    blurbZh: "改版前主页结构 · 已去掉假 live/评分",
    blurbEn: "Pre-refresh homepage structure · no fake social proof",
  },
  {
    id: "focus",
    labelZh: "专注",
    labelEn: "Focus",
    blurbZh: "干净首屏 · 双栏预览 · 推荐默认",
    blurbEn: "Clean hero · dual preview · recommended",
    recommended: true,
  },
  {
    id: "ritual",
    labelZh: "仪式",
    labelEn: "Ritual",
    blurbZh: "更强装饰与今日主题氛围",
    blurbEn: "Richer decor and daily theme mood",
  },
  {
    id: "plans",
    labelZh: "方案",
    labelEn: "Plans",
    blurbZh: "次按钮直达会员与试用说明",
    blurbEn: "Secondary CTA leads to membership plans",
  },
  {
    id: "minimal",
    labelZh: "极简",
    labelEn: "Minimal",
    blurbZh: "预览独立 · 无社区块 · 移动紧凑",
    blurbEn: "Separate preview · no community block · compact",
  },
] as const;

/**
 * Flag table.
 * classic = structural twin of the homepage before multi-variant (honest IA cleanup only).
 */
export const HOME_VARIANT_FLAGS: Record<HomeVariantId, HomeVariantFlags> = {
  classic: {
    heroPreviewDual: false,
    showResultPreview: false,
    showCosmicAlert: true,
    alertTone: "legacy",
    secondaryCta: "login",
    showCommunityBlock: true,
    showMembershipPrice: true,
    density: "comfortable",
    decorLevel: "high",
  },
  focus: {
    heroPreviewDual: true,
    showResultPreview: true,
    // compact drama still from full event library (not deleted)
    showCosmicAlert: true,
    alertTone: "weak",
    secondaryCta: "login",
    showCommunityBlock: true,
    showMembershipPrice: false,
    density: "cozy",
    decorLevel: "low",
  },
  ritual: {
    heroPreviewDual: true,
    showResultPreview: true,
    showCosmicAlert: true,
    alertTone: "legacy",
    secondaryCta: "login",
    showCommunityBlock: true,
    showMembershipPrice: false,
    density: "comfortable",
    decorLevel: "high",
  },
  plans: {
    heroPreviewDual: true,
    showResultPreview: true,
    showCosmicAlert: true,
    alertTone: "weak",
    secondaryCta: "membership",
    showCommunityBlock: true,
    showMembershipPrice: true,
    density: "cozy",
    decorLevel: "mid",
  },
  minimal: {
    heroPreviewDual: false,
    showResultPreview: true,
    showCosmicAlert: false,
    alertTone: "weak",
    secondaryCta: "login",
    showCommunityBlock: false,
    showMembershipPrice: false,
    density: "compact",
    decorLevel: "low",
  },
};

export function parseHomeVariant(raw: unknown): HomeVariantId {
  if (typeof raw !== "string") return DEFAULT_HOME_VARIANT;
  const v = raw.trim().toLowerCase();
  return (HOME_VARIANT_IDS as readonly string[]).includes(v)
    ? (v as HomeVariantId)
    : DEFAULT_HOME_VARIANT;
}

export function getHomeVariantFlags(id: HomeVariantId): HomeVariantFlags {
  return HOME_VARIANT_FLAGS[parseHomeVariant(id)];
}

export function getHomeVariantMeta(id: HomeVariantId): HomeVariantMeta {
  const found = HOME_VARIANT_META.find((m) => m.id === id);
  return found ?? HOME_VARIANT_META.find((m) => m.id === DEFAULT_HOME_VARIANT)!;
}

function safeStorage(): Storage | null {
  try {
    if (typeof globalThis === "undefined") return null;
    const ls = (globalThis as { localStorage?: Storage }).localStorage;
    if (!ls) return null;
    return ls;
  } catch {
    return null;
  }
}

/** Read preference; missing/invalid → focus. SSR-safe (defaults). */
export function readHomeVariant(): HomeVariantId {
  const ls = safeStorage();
  if (!ls) return DEFAULT_HOME_VARIANT;
  try {
    return parseHomeVariant(ls.getItem(HOME_VARIANT_STORAGE_KEY));
  } catch {
    return DEFAULT_HOME_VARIANT;
  }
}

/** Persist only legal ids (always re-parsed). */
export function writeHomeVariant(id: HomeVariantId): HomeVariantId {
  const next = parseHomeVariant(id);
  const ls = safeStorage();
  if (ls) {
    try {
      ls.setItem(HOME_VARIANT_STORAGE_KEY, next);
    } catch {
      // quota / private mode — ignore
    }
  }
  applyHomeVariantToDocument(next);
  return next;
}

/**
 * Soft site chrome hook: other pages may read data-home-variant later.
 * Does NOT re-layout Tarot/BaZi/etc. — only a stable attribute for optional CSS.
 */
export function applyHomeVariantToDocument(id: HomeVariantId): void {
  try {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.homeVariant = parseHomeVariant(id);
  } catch {
    // ignore
  }
}

/**
 * Resolve initial variant: optional URL ?variant= (debug) wins once and is written;
 * else localStorage; else default focus.
 */
export function resolveInitialHomeVariant(
  search: string | undefined | null = typeof window !== "undefined" ? window.location.search : ""
): HomeVariantId {
  try {
    const q = new URLSearchParams(search || "");
    const fromQuery = q.get("variant");
    if (fromQuery != null && fromQuery !== "") {
      const parsed = parseHomeVariant(fromQuery);
      writeHomeVariant(parsed);
      return parsed;
    }
  } catch {
    // ignore bad search
  }
  const stored = readHomeVariant();
  applyHomeVariantToDocument(stored);
  return stored;
}
