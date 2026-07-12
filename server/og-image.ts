import { Router, Request, Response } from "express";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { drawIcon, drawSmallHeart, drawSmallBriefcase, drawSmallCoin, drawSparkle, type IconType } from "./og-icons";

// Font configuration: project-local → system fallback → CDN download
const FONTS_DIR = path.join(import.meta.dirname || __dirname, "fonts");

interface FontDef {
  filename: string;
  familyName: string;
  systemPaths: string[];
  cdnUrl: string;
}

const fontDefs: FontDef[] = [
  {
    filename: "DejaVuSans.ttf",
    familyName: "DejaVuSans",
    systemPaths: [
      "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
      "/usr/share/fonts/TTF/DejaVuSans.ttf",
    ],
    cdnUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030286231/kFBFiwQTMGDsTFVM.ttf",
  },
  {
    filename: "DejaVuSans-Bold.ttf",
    familyName: "DejaVuSans-Bold",
    systemPaths: [
      "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
      "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    ],
    cdnUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030286231/MAenJYmuXGuvXSYu.ttf",
  },
  {
    filename: "NotoSansCJKsc-Regular.otf",
    familyName: "NotoSansCJKSC",
    systemPaths: [
      "/usr/share/fonts/opentype/noto/NotoSansCJKsc-Regular.otf",
      "/usr/share/fonts/noto-cjk/NotoSansCJKsc-Regular.otf",
    ],
    cdnUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030286231/KzZkWiFRVyOPUjKF.otf",
  },
  {
    filename: "NotoSansCJKsc-Bold.otf",
    familyName: "NotoSansCJKSC-Bold",
    systemPaths: [
      "/usr/share/fonts/opentype/noto/NotoSansCJKsc-Bold.otf",
      "/usr/share/fonts/noto-cjk/NotoSansCJKsc-Bold.otf",
    ],
    cdnUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030286231/tFaIhkaVmuuKHPjI.otf",
  },
];

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location!, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (e) => { file.close(); fs.unlinkSync(dest); reject(e); });
  });
}

async function ensureFonts(): Promise<void> {
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  for (const def of fontDefs) {
    const localPath = path.join(FONTS_DIR, def.filename);

    // 1. Try project-local font
    if (fs.existsSync(localPath)) {
      try {
        GlobalFonts.registerFromPath(localPath, def.familyName);
        console.log(`[OG Font] Registered from project: ${def.familyName}`);
        continue;
      } catch (e) {
        console.warn(`[OG Font] Failed to register local ${def.familyName}:`, e);
      }
    }

    // 2. Try system font paths
    let registered = false;
    for (const sp of def.systemPaths) {
      if (fs.existsSync(sp)) {
        try {
          GlobalFonts.registerFromPath(sp, def.familyName);
          console.log(`[OG Font] Registered from system: ${def.familyName} (${sp})`);
          // Copy to local for future use
          try { fs.copyFileSync(sp, localPath); } catch { /* ignore copy errors */ }
          registered = true;
          break;
        } catch { /* try next */ }
      }
    }
    if (registered) continue;

    // 3. Download from CDN
    try {
      console.log(`[OG Font] Downloading ${def.familyName} from CDN...`);
      await downloadFile(def.cdnUrl, localPath);
      GlobalFonts.registerFromPath(localPath, def.familyName);
      console.log(`[OG Font] Downloaded and registered: ${def.familyName}`);
    } catch (e) {
      console.error(`[OG Font] Failed to download ${def.familyName}:`, e);
    }
  }
}

// Initialize fonts (runs once at startup)
const fontsReady = ensureFonts();

type OgType = "tarot" | "bazi" | "horoscope" | "dream" | "compatibility" | "default";

interface ThemeConfig {
  bgGradient: [string, string, string];
  accent: string;
  accentLight: string;
  icon: IconType;
  label: { zh: string; en: string };
}

const themes: Record<OgType, ThemeConfig> = {
  tarot: {
    bgGradient: ["#0c0520", "#1a0a3e", "#0c0520"],
    accent: "#c8a45a",
    accentLight: "#f0d878",
    icon: "crystal-ball",
    label: { zh: "AI塔罗占卜", en: "AI Tarot Reading" },
  },
  bazi: {
    bgGradient: ["#0a0800", "#1a1005", "#0a0800"],
    accent: "#d4a853",
    accentLight: "#f5d98a",
    icon: "yin-yang",
    label: { zh: "AI八字精批", en: "AI BaZi Analysis" },
  },
  horoscope: {
    bgGradient: ["#050a18", "#0f2a58", "#050a18"],
    accent: "#60a5fa",
    accentLight: "#93c5fd",
    icon: "star",
    label: { zh: "星座运势", en: "Horoscope" },
  },
  dream: {
    bgGradient: ["#020d0d", "#0f4040", "#020d0d"],
    accent: "#2dd4bf",
    accentLight: "#5eead4",
    icon: "moon",
    label: { zh: "AI解梦", en: "Dream Interpretation" },
  },
  compatibility: {
    bgGradient: ["#0d0515", "#2a1050", "#0d0515"],
    accent: "#f472b6",
    accentLight: "#fb7185",
    icon: "hearts",
    label: { zh: "星座合盘", en: "Compatibility" },
  },
  default: {
    bgGradient: ["#080918", "#0f1428", "#080918"],
    accent: "#d4a843",
    accentLight: "#f0d878",
    icon: "sparkle",
    label: { zh: "洞察未来", en: "Fortune Insight" },
  },
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function wrapText(ctx: any, text: string, maxWidth: number, maxLines: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split(/\n/);
  for (const para of paragraphs) {
    if (lines.length >= maxLines) break;
    const chars = para.split("");
    let currentLine = "";
    for (const char of chars) {
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = char;
        if (lines.length >= maxLines) {
          lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1) + "...";
          break;
        }
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }
  }
  return lines;
}

function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Personalized data interfaces ───
interface PersonalizedData {
  // Tarot: card names, positions, spread
  cards?: string;       // comma-separated card names
  positions?: string;   // comma-separated positions (upright/reversed)
  spread?: string;      // spread name
  // Horoscope: scores
  sign?: string;        // zodiac sign name
  overall?: string;     // overall score
  love?: string;        // love score
  career?: string;      // career score
  wealth?: string;      // wealth score
  luckyColor?: string;
  luckyNumber?: string;
  // BaZi: birth info
  birth?: string;       // birth date
  gender?: string;
  // Dream: keywords, emotions
  dreamTitle?: string;
  emotions?: string;    // comma-separated
  elements?: string;    // comma-separated
  dreamType?: string;
  clarity?: string;
  // Compatibility: two signs, score
  sign1?: string;
  sign2?: string;
  name1?: string;
  name2?: string;
  matchScore?: string;
}

// ─── Draw decorative background elements ───
function drawBackground(ctx: any, W: number, H: number, theme: ThemeConfig) {
  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, theme.bgGradient[0]);
  bgGrad.addColorStop(0.5, theme.bgGradient[1]);
  bgGrad.addColorStop(1, theme.bgGradient[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle bokeh circles
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 15; i++) {
    const cx = (i * 137.5 + 50) % W;
    const cy = (i * 89.3 + 30) % H;
    const r = 20 + (i * 17) % 70;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, hexToRgba(theme.accent, 0.3));
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Left accent bar
  const barGrad = ctx.createLinearGradient(0, 0, 0, H);
  barGrad.addColorStop(0, hexToRgba(theme.accent, 0.8));
  barGrad.addColorStop(0.5, hexToRgba(theme.accentLight, 0.6));
  barGrad.addColorStop(1, hexToRgba(theme.accent, 0.3));
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, 5, H);

  // Top & bottom decorative lines
  ctx.fillStyle = hexToRgba(theme.accent, 0.15);
  ctx.fillRect(40, 38, W - 80, 1);
  ctx.fillRect(40, H - 38, W - 80, 1);
}

// ─── Draw header (brand + type badge) ───
function drawHeader(ctx: any, W: number, theme: ThemeConfig, lang: "zh" | "en", fontFamily: string) {
  // Brand label
  ctx.font = `bold 15px ${fontFamily}`;
  ctx.fillStyle = hexToRgba(theme.accent, 0.6);
  ctx.textAlign = "left";
  const brandLabel = lang === "zh" ? "FORTUNE INSIGHT · 洞察未来" : "FORTUNE INSIGHT";
  ctx.fillText(brandLabel, 48, 68);

  // Type badge
  const typeLabel = theme.label[lang];
  ctx.font = `bold 16px ${fontFamily}`;
  const badgeWidth = ctx.measureText(typeLabel).width + 28;
  const badgeX = W - badgeWidth - 48;
  ctx.fillStyle = hexToRgba(theme.accent, 0.12);
  roundRect(ctx, badgeX, 50, badgeWidth, 30, 15);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accent, 0.25);
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX, 50, badgeWidth, 30, 15);
  ctx.stroke();
  ctx.fillStyle = theme.accent;
  ctx.textAlign = "center";
  ctx.fillText(typeLabel, badgeX + badgeWidth / 2, 71);
  ctx.textAlign = "left";
}

// ─── Draw footer (CTA + domain) ───
function drawFooter(ctx: any, W: number, H: number, theme: ThemeConfig, lang: "zh" | "en", fontFamily: string) {
  const ctaY = H - 62;
  ctx.font = `bold 18px ${fontFamily}`;
  const ctaText = lang === "zh"
    ? "★ 来 fortunesite.one 获取你的专属分析"
    : "★ Get your free reading at fortunesite.one";
  // Draw sparkle icon before CTA text
  drawSparkle(ctx, 55, ctaY - 1, 16, theme.accentLight, 0.9);
  const ctaWidth = ctx.measureText(ctaText).width + 36;
  ctx.fillStyle = hexToRgba(theme.accent, 0.1);
  roundRect(ctx, 40, ctaY - 18, ctaWidth, 34, 17);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accent, 0.2);
  ctx.lineWidth = 1;
  roundRect(ctx, 40, ctaY - 18, ctaWidth, 34, 17);
  ctx.stroke();
  ctx.fillStyle = theme.accentLight;
  ctx.fillText(ctaText, 58, ctaY + 4);

  // Domain
  ctx.font = `14px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.textAlign = "right";
  ctx.fillText("fortunesite.one", W - 48, H - 48);
  ctx.textAlign = "left";
}

// ─── Draw a score bar ───
function drawScoreBar(
  ctx: any, x: number, y: number, w: number, h: number,
  score: number, maxScore: number, color: string, label: string,
  fontFamily: string
) {
  // Label
  ctx.font = `bold 14px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.textAlign = "left";
  ctx.fillText(label, x, y - 6);

  // Score text
  ctx.textAlign = "right";
  ctx.fillStyle = color;
  ctx.fillText(`${score}`, x + w, y - 6);
  ctx.textAlign = "left";

  // Background bar
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  roundRect(ctx, x, y + 2, w, h, h / 2);
  ctx.fill();

  // Filled bar
  const fillW = Math.max((score / maxScore) * w, h);
  const barGrad = ctx.createLinearGradient(x, y, x + fillW, y);
  barGrad.addColorStop(0, hexToRgba(color, 0.9));
  barGrad.addColorStop(1, hexToRgba(color, 0.5));
  ctx.fillStyle = barGrad;
  roundRect(ctx, x, y + 2, fillW, h, h / 2);
  ctx.fill();
}

// ─── Draw a tag pill ───
function drawPill(ctx: any, x: number, y: number, text: string, color: string, fontFamily: string): number {
  ctx.font = `bold 13px ${fontFamily}`;
  const tw = ctx.measureText(text).width;
  const pw = tw + 20;
  const ph = 26;
  ctx.fillStyle = hexToRgba(color, 0.12);
  roundRect(ctx, x, y, pw, ph, 13);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(color, 0.3);
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, pw, ph, 13);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, x + pw / 2, y + 17);
  ctx.textAlign = "left";
  return pw + 8; // return width + gap
}

// ─── Draw a card (tarot card style) ───
function drawTarotCard(
  ctx: any, x: number, y: number, w: number, h: number,
  name: string, isReversed: boolean, color: string, fontFamily: string
) {
  // Card background
  ctx.fillStyle = hexToRgba(color, 0.08);
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(color, 0.4);
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 8);
  ctx.stroke();

  // Inner border
  ctx.strokeStyle = hexToRgba(color, 0.15);
  ctx.lineWidth = 0.5;
  roundRect(ctx, x + 4, y + 4, w - 8, h - 8, 5);
  ctx.stroke();

  // Card name
  ctx.font = `bold 13px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  const lines = wrapText(ctx, name, w - 16, 2);
  let ty = y + h / 2 - (lines.length - 1) * 8;
  for (const line of lines) {
    ctx.fillText(line, x + w / 2, ty);
    ty += 18;
  }

  // Reversed indicator
  if (isReversed) {
    ctx.font = `bold 10px ${fontFamily}`;
    ctx.fillStyle = hexToRgba("#ff6b6b", 0.9);
    ctx.fillText("↓ R", x + w / 2, y + h - 8);
  } else {
    ctx.font = `bold 10px ${fontFamily}`;
    ctx.fillStyle = hexToRgba(color, 0.6);
    ctx.fillText("↑", x + w / 2, y + h - 8);
  }
  ctx.textAlign = "left";
}

// ═══════════════════════════════════════════
// TYPE-SPECIFIC RENDERERS
// ═══════════════════════════════════════════

function renderTarot(
  ctx: any, W: number, H: number, theme: ThemeConfig,
  title: string, summary: string, data: PersonalizedData,
  lang: "zh" | "en", fontFamily: string
) {
  // Title
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  const titleLines = wrapText(ctx, title, W - 120, 1);
  ctx.fillText(titleLines[0] || title, 48, 120);

  // Accent underline
  const underGrad = ctx.createLinearGradient(48, 132, 300, 132);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 132, 250, 2);

  // Spread name pill
  if (data.spread) {
    drawPill(ctx, 48, 146, data.spread, theme.accent, fontFamily);
  }

  // Tarot cards row
  const cards = (data.cards || "").split(",").map(s => s.trim()).filter(Boolean);
  const positions = (data.positions || "").split(",").map(s => s.trim());
  
  if (cards.length > 0) {
    const cardW = Math.min(110, (W - 120) / Math.min(cards.length, 8) - 10);
    const cardH = 140;
    const startX = 48;
    const cardY = 185;
    const maxCards = Math.min(cards.length, 7);

    for (let i = 0; i < maxCards; i++) {
      const isReversed = (positions[i] || "").toLowerCase().includes("reverse") || 
                         (positions[i] || "").toLowerCase().includes("逆");
      drawTarotCard(ctx, startX + i * (cardW + 8), cardY, cardW, cardH, cards[i], isReversed, theme.accent, fontFamily);
    }
    if (cards.length > maxCards) {
      ctx.font = `bold 14px ${fontFamily}`;
      ctx.fillStyle = hexToRgba(theme.accent, 0.6);
      ctx.fillText(`+${cards.length - maxCards}`, startX + maxCards * (cardW + 8) + 4, cardY + cardH / 2);
    }
  }

  // Summary (below cards or at right side)
  const summaryY = cards.length > 0 ? 350 : 180;
  ctx.font = `18px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  const summaryLines = wrapText(ctx, summary, W - 120, 4);
  let sy = summaryY;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 28;
  }

  // Large decorative icon
  drawIcon(ctx, "crystal-ball", W - 130, H - 130, 180, theme.accent, 0.1);
}

function renderHoroscope(
  ctx: any, W: number, H: number, theme: ThemeConfig,
  title: string, summary: string, data: PersonalizedData,
  lang: "zh" | "en", fontFamily: string
) {
  const isZh = lang === "zh";

  // Title with sign name
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 48, 120);

  // Accent underline
  const underGrad = ctx.createLinearGradient(48, 132, 350, 132);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 132, 300, 2);

  // Overall score - big circle
  const overall = parseInt(data.overall || "0", 10);
  if (overall > 0) {
    const cx = W - 160;
    const cy = 180;
    const radius = 70;

    // Outer ring background
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Score arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (overall / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineCap = "butt";

    // Score number
    ctx.font = `bold 42px ${fontFamily}`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(String(overall), cx, cy + 12);
    ctx.font = `13px ${fontFamily}`;
    ctx.fillStyle = hexToRgba(theme.accent, 0.8);
    ctx.fillText(isZh ? "综合运势" : "Overall", cx, cy + 32);
    ctx.textAlign = "left";
  }

  // Score bars
  const barX = 48;
  const barW = W - 340;
  const barH = 10;
  let barY = 160;

  const scores = [
    { label: isZh ? "♥ 爱情" : "♥ Love", score: parseInt(data.love || "0", 10), color: "#f472b6", iconFn: drawSmallHeart },
    { label: isZh ? "■ 事业" : "■ Career", score: parseInt(data.career || "0", 10), color: "#60a5fa", iconFn: drawSmallBriefcase },
    { label: isZh ? "● 财运" : "● Wealth", score: parseInt(data.wealth || "0", 10), color: "#fbbf24", iconFn: drawSmallCoin },
  ];

  for (const s of scores) {
    if (s.score > 0) {
      // Draw inline icon before label
      s.iconFn(ctx, barX + 7, barY - 10, 14, s.color);
      const labelWithIcon = "   " + s.label.replace(/^[\u2665\u25a0\u25cf] /, "");
      drawScoreBar(ctx, barX, barY, barW, barH, s.score, 100, s.color, labelWithIcon, fontFamily);
      barY += 42;
    }
  }

  // Lucky info pills
  let pillX = 48;
  const pillY = barY + 15;
  if (data.luckyColor) {
    pillX += drawPill(ctx, pillX, pillY, `${isZh ? "幸运色" : "Lucky"}: ${data.luckyColor}`, theme.accent, fontFamily);
  }
  if (data.luckyNumber) {
    pillX += drawPill(ctx, pillX, pillY, `${isZh ? "幸运数" : "Lucky #"}: ${data.luckyNumber}`, theme.accentLight, fontFamily);
  }

  // Summary
  const summaryStartY = pillY + 50;
  ctx.font = `17px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const summaryLines = wrapText(ctx, summary, W - 120, 3);
  let sy = summaryStartY;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 26;
  }

  // Large decorative icon
  drawIcon(ctx, "star", W - 120, H - 120, 160, theme.accent, 0.08);
}

function renderBazi(
  ctx: any, W: number, H: number, theme: ThemeConfig,
  title: string, summary: string, data: PersonalizedData,
  lang: "zh" | "en", fontFamily: string
) {
  const isZh = lang === "zh";

  // Title
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 48, 120);

  // Accent underline
  const underGrad = ctx.createLinearGradient(48, 132, 300, 132);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 132, 250, 2);

  // Birth info & gender pills
  let pillX = 48;
  const pillY = 150;
  if (data.birth) {
    pillX += drawPill(ctx, pillX, pillY, `${isZh ? "出生" : "Birth"}: ${data.birth}`, theme.accent, fontFamily);
  }
  if (data.gender) {
    pillX += drawPill(ctx, pillX, pillY, data.gender, theme.accentLight, fontFamily);
  }

  // Five Elements visualization (decorative boxes)
  const fiveElements = isZh
    ? [
        { name: "金", color: "#fbbf24", eng: "Metal" },
        { name: "木", color: "#22c55e", eng: "Wood" },
        { name: "水", color: "#3b82f6", eng: "Water" },
        { name: "火", color: "#ef4444", eng: "Fire" },
        { name: "土", color: "#a16207", eng: "Earth" },
      ]
    : [
        { name: "Metal", color: "#fbbf24", eng: "Metal" },
        { name: "Wood", color: "#22c55e", eng: "Wood" },
        { name: "Water", color: "#3b82f6", eng: "Water" },
        { name: "Fire", color: "#ef4444", eng: "Fire" },
        { name: "Earth", color: "#a16207", eng: "Earth" },
      ];

  const elemStartX = 48;
  const elemY = 200;
  const elemW = 90;
  const elemH = 90;
  const elemGap = 12;

  // Section label
  ctx.font = `bold 15px ${fontFamily}`;
  ctx.fillStyle = hexToRgba(theme.accent, 0.7);
  ctx.fillText(isZh ? "五行分布" : "Five Elements", elemStartX, elemY - 8);

  for (let i = 0; i < fiveElements.length; i++) {
    const el = fiveElements[i];
    const ex = elemStartX + i * (elemW + elemGap);

    // Element box
    ctx.fillStyle = hexToRgba(el.color, 0.1);
    roundRect(ctx, ex, elemY + 6, elemW, elemH, 10);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(el.color, 0.35);
    ctx.lineWidth = 1.5;
    roundRect(ctx, ex, elemY + 6, elemW, elemH, 10);
    ctx.stroke();

    // Element character
    ctx.font = isZh ? `bold 32px ${fontFamily}` : `bold 18px ${fontFamily}`;
    ctx.fillStyle = el.color;
    ctx.textAlign = "center";
    ctx.fillText(el.name, ex + elemW / 2, elemY + (isZh ? 50 : 45));

    // English subtitle for Chinese
    if (isZh) {
      ctx.font = `11px ${fontFamily}`;
      ctx.fillStyle = hexToRgba(el.color, 0.6);
      ctx.fillText(el.eng, ex + elemW / 2, elemY + 72);
    }
    ctx.textAlign = "left";
  }

  // Summary
  ctx.font = `17px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const summaryLines = wrapText(ctx, summary, W - 120, 4);
  let sy = elemY + elemH + 40;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 26;
  }

  // Large decorative icon
  drawIcon(ctx, "yin-yang", W - 130, H - 120, 170, theme.accent, 0.1);
}

function renderDream(
  ctx: any, W: number, H: number, theme: ThemeConfig,
  title: string, summary: string, data: PersonalizedData,
  lang: "zh" | "en", fontFamily: string
) {
  const isZh = lang === "zh";

  // Title
  ctx.font = `bold 36px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  const displayTitle = data.dreamTitle || title;
  const titleLines = wrapText(ctx, displayTitle, W - 120, 1);
  ctx.fillText(titleLines[0] || displayTitle, 48, 120);

  // Accent underline
  const underGrad = ctx.createLinearGradient(48, 132, 300, 132);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 132, 250, 2);

  // Dream type & clarity pills
  let pillX = 48;
  const pillY = 148;
  if (data.dreamType) {
    pillX += drawPill(ctx, pillX, pillY, data.dreamType, theme.accent, fontFamily);
  }
  if (data.clarity) {
    const clarityLabel = isZh ? `清晰度 ${data.clarity}` : `Clarity ${data.clarity}`;
    pillX += drawPill(ctx, pillX, pillY, clarityLabel, theme.accentLight, fontFamily);
  }

  // Emotions row
  const emotions = (data.emotions || "").split(",").map(s => s.trim()).filter(Boolean);
  if (emotions.length > 0) {
    let emX = 48;
    const emY = pillY + 42;
    ctx.font = `bold 13px ${fontFamily}`;
    ctx.fillStyle = hexToRgba(theme.accent, 0.6);
    ctx.fillText(isZh ? "情绪" : "Emotions", emX, emY - 2);
    emX = 48;
    const emPillY = emY + 8;
    for (const em of emotions.slice(0, 5)) {
      emX += drawPill(ctx, emX, emPillY, em, "#a78bfa", fontFamily);
    }
  }

  // Elements row
  const elements = (data.elements || "").split(",").map(s => s.trim()).filter(Boolean);
  if (elements.length > 0) {
    const elY = emotions.length > 0 ? pillY + 90 : pillY + 42;
    let elX = 48;
    ctx.font = `bold 13px ${fontFamily}`;
    ctx.fillStyle = hexToRgba(theme.accent, 0.6);
    ctx.fillText(isZh ? "梦境元素" : "Elements", elX, elY - 2);
    elX = 48;
    const elPillY = elY + 8;
    for (const el of elements.slice(0, 5)) {
      elX += drawPill(ctx, elX, elPillY, el, theme.accent, fontFamily);
    }
  }

  // Summary
  const summaryStartY = emotions.length > 0 && elements.length > 0 ? 310 :
                         emotions.length > 0 || elements.length > 0 ? 270 : 200;
  ctx.font = `17px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const summaryLines = wrapText(ctx, summary, W - 120, 5);
  let sy = summaryStartY;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 26;
  }

  // Large decorative icon
  drawIcon(ctx, "moon", W - 130, H - 120, 170, theme.accent, 0.1);
}

function renderCompatibility(
  ctx: any, W: number, H: number, theme: ThemeConfig,
  title: string, summary: string, data: PersonalizedData,
  lang: "zh" | "en", fontFamily: string
) {
  const isZh = lang === "zh";

  // Title
  ctx.font = `bold 34px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(title, 48, 115);

  // Accent underline
  const underGrad = ctx.createLinearGradient(48, 128, 350, 128);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, 128, 300, 2);

  // Two signs visualization
  const sign1 = data.sign1 || (data.name1 || "?");
  const sign2 = data.sign2 || (data.name2 || "?");
  const name1 = data.name1 || (isZh ? "甲方" : "Person A");
  const name2 = data.name2 || (isZh ? "乙方" : "Person B");

  // Left circle
  const circleY = 220;
  const circleR = 55;
  const leftCx = 160;
  const rightCx = W - 160;

  // Left person circle
  ctx.fillStyle = hexToRgba(theme.accent, 0.1);
  ctx.beginPath();
  ctx.arc(leftCx, circleY, circleR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accent, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(leftCx, circleY, circleR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = `bold 28px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(sign1, leftCx, circleY + 8);
  ctx.font = `bold 14px ${fontFamily}`;
  ctx.fillStyle = hexToRgba(theme.accent, 0.8);
  ctx.fillText(name1.slice(0, 8), leftCx, circleY + 32);

  // Right person circle
  ctx.fillStyle = hexToRgba(theme.accentLight, 0.1);
  ctx.beginPath();
  ctx.arc(rightCx, circleY, circleR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(theme.accentLight, 0.4);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(rightCx, circleY, circleR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = `bold 28px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(sign2, rightCx, circleY + 8);
  ctx.font = `bold 14px ${fontFamily}`;
  ctx.fillStyle = hexToRgba(theme.accentLight, 0.8);
  ctx.fillText(name2.slice(0, 8), rightCx, circleY + 32);

  // Connection line with heart
  const midX = (leftCx + rightCx) / 2;
  ctx.strokeStyle = hexToRgba(theme.accent, 0.25);
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(leftCx + circleR + 10, circleY);
  ctx.lineTo(rightCx - circleR - 10, circleY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Heart in center (drawn icon)
  drawIcon(ctx, "hearts", midX, circleY, 40, theme.accent, 0.9);

  // Match score
  const matchScore = data.matchScore || "";
  if (matchScore) {
    ctx.font = `bold 20px ${fontFamily}`;
    ctx.fillStyle = theme.accentLight;
    ctx.fillText(matchScore, midX, circleY + 42);
  }

  ctx.textAlign = "left";

  // Summary
  ctx.font = `17px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  const summaryLines = wrapText(ctx, summary, W - 120, 4);
  let sy = circleY + circleR + 40;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, sy);
    sy += 26;
  }

  // Large decorative icon
  drawIcon(ctx, "hearts", W - 120, H - 120, 160, theme.accent, 0.08);
}

function renderDefault(
  ctx: any, W: number, H: number, theme: ThemeConfig,
  title: string, summary: string,
  lang: "zh" | "en", fontFamily: string
) {
  // Title
  ctx.font = `bold 40px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  const titleLines = wrapText(ctx, title, W - 140, 2);
  let y = 140;
  for (const line of titleLines) {
    ctx.fillText(line, 48, y);
    y += 52;
  }

  // Accent underline
  const underGrad = ctx.createLinearGradient(48, y + 4, 350, y + 4);
  underGrad.addColorStop(0, theme.accent);
  underGrad.addColorStop(1, "transparent");
  ctx.fillStyle = underGrad;
  ctx.fillRect(48, y + 4, 300, 3);

  // Summary
  ctx.font = `20px ${fontFamily}`;
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  const summaryLines = wrapText(ctx, summary, W - 140, 5);
  y += 40;
  for (const line of summaryLines) {
    ctx.fillText(line, 48, y);
    y += 32;
  }

  // Large decorative icon
  drawIcon(ctx, theme.icon, W - 130, H - 120, 170, theme.accent, 0.12);
}

// ═══════════════════════════════════════════
// MAIN GENERATOR
// ═══════════════════════════════════════════

function generateOgImage(
  type: OgType,
  title: string,
  summary: string,
  lang: "zh" | "en" = "en",
  data: PersonalizedData = {}
): Buffer {
  const W = 1200;
  const H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  const theme = themes[type] || themes.default;
  // Use explicitly registered font family names for consistent rendering
  const fontFamily = lang === "zh"
    ? "NotoSansCJKSC, NotoSansCJKSC-Bold, 'Noto Sans CJK SC', sans-serif"
    : "DejaVuSans, DejaVuSans-Bold, 'DejaVu Sans', sans-serif";

  // Common layers
  drawBackground(ctx, W, H, theme);
  drawHeader(ctx, W, theme, lang, fontFamily);

  // Type-specific rendering
  const hasPersonalData = Object.values(data).some(v => v && v.length > 0);

  switch (type) {
    case "tarot":
      renderTarot(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    case "horoscope":
      renderHoroscope(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    case "bazi":
      renderBazi(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    case "dream":
      renderDream(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    case "compatibility":
      renderCompatibility(ctx, W, H, theme, title, summary, data, lang, fontFamily);
      break;
    default:
      renderDefault(ctx, W, H, theme, title, summary, lang, fontFamily);
      break;
  }

  drawFooter(ctx, W, H, theme, lang, fontFamily);

  return canvas.toBuffer("image/png");
}

// ─── Cache ───
const imageCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const MAX_CACHE = 200;
const CACHE_TTL = 3600_000; // 1 hour

function getCachedImage(key: string): Buffer | null {
  const entry = imageCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    imageCache.delete(key);
    return null;
  }
  return entry.buffer;
}

function setCachedImage(key: string, buffer: Buffer) {
  if (imageCache.size >= MAX_CACHE) {
    const oldest = imageCache.keys().next().value;
    if (oldest) imageCache.delete(oldest);
  }
  imageCache.set(key, { buffer, timestamp: Date.now() });
}

export const ogImageRouter = Router();

/**
 * GET /api/og-image?type=tarot&title=...&summary=...&lang=en
 * 
 * Personalized params (all optional):
 *   cards=The Fool,The Tower,The Star
 *   positions=upright,reversed,upright
 *   spread=Celtic Cross
 *   sign=Aries
 *   overall=85&love=90&career=78&wealth=82
 *   luckyColor=Blue&luckyNumber=7
 *   birth=1990.5.15&gender=Male
 *   dreamTitle=Flying Over Mountains
 *   emotions=Joy,Wonder&elements=Sky,Mountain
 *   dreamType=Lucid&clarity=4/5
 *   sign1=♈&sign2=♎&name1=Alice&name2=Bob&matchScore=92%
 */
ogImageRouter.get("/", async (req: Request, res: Response) => {
  try {
    // Ensure fonts are loaded before rendering
    await fontsReady;
    const type = (req.query.type as OgType) || "default";
    const title = (req.query.title as string) || "Fortune Insight";
    const summary = (req.query.summary as string) || "Discover your true self with AI-powered divination";
    const lang = (req.query.lang as "zh" | "en") || "en";

    // Extract personalized data
    const data: PersonalizedData = {
      cards: req.query.cards as string,
      positions: req.query.positions as string,
      spread: req.query.spread as string,
      sign: req.query.sign as string,
      overall: req.query.overall as string,
      love: req.query.love as string,
      career: req.query.career as string,
      wealth: req.query.wealth as string,
      luckyColor: req.query.luckyColor as string,
      luckyNumber: req.query.luckyNumber as string,
      birth: req.query.birth as string,
      gender: req.query.gender as string,
      dreamTitle: req.query.dreamTitle as string,
      emotions: req.query.emotions as string,
      elements: req.query.elements as string,
      dreamType: req.query.dreamType as string,
      clarity: req.query.clarity as string,
      sign1: req.query.sign1 as string,
      sign2: req.query.sign2 as string,
      name1: req.query.name1 as string,
      name2: req.query.name2 as string,
      matchScore: req.query.matchScore as string,
    };

    // Cache key includes personalized data
    const dataKey = Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${(v as string).slice(0, 30)}`)
      .join("&");
    const cacheKey = `${type}:${lang}:${title.slice(0, 50)}:${summary.slice(0, 60)}:${dataKey.slice(0, 200)}`;

    let buffer = getCachedImage(cacheKey);
    if (!buffer) {
      buffer = generateOgImage(type, title, summary, lang, data);
      setCachedImage(cacheKey, buffer);
    }

    res.set({
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Content-Length": String(buffer.length),
    });
    res.end(buffer);
  } catch (err) {
    console.error("[OG Image] Generation failed:", err);
    res.status(500).json({ error: "Failed to generate OG image" });
  }
});
