/**
 * Canvas-drawn vector icons to replace emoji in OG images.
 * Emoji render as tofu squares in @napi-rs/canvas; these functions
 * draw equivalent icons using pure Canvas 2D API paths.
 */

// ─── Crystal Ball (replaces 🔮 for Tarot) ───
export function drawCrystalBall(ctx: any, cx: number, cy: number, size: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;

  // Outer glow
  const glow = ctx.createRadialGradient(cx, cy - r * 0.1, r * 0.2, cx, cy - r * 0.1, r * 1.2);
  glow.addColorStop(0, hexAlpha(color, 0.3));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.1, r * 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Ball body
  const ballGrad = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.35, r * 0.1, cx, cy - r * 0.1, r);
  ballGrad.addColorStop(0, hexAlpha(color, 0.6));
  ballGrad.addColorStop(0.5, hexAlpha(color, 0.25));
  ballGrad.addColorStop(1, hexAlpha(color, 0.1));
  ctx.fillStyle = ballGrad;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.1, r, 0, Math.PI * 2);
  ctx.fill();

  // Ball outline
  ctx.strokeStyle = hexAlpha(color, 0.5);
  ctx.lineWidth = size * 0.03;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.1, r, 0, Math.PI * 2);
  ctx.stroke();

  // Highlight reflection
  ctx.fillStyle = hexAlpha("#ffffff", 0.25);
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.25, cy - r * 0.4, r * 0.2, r * 0.12, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // Base/stand
  ctx.fillStyle = hexAlpha(color, 0.35);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.6, cy + r * 0.85);
  ctx.quadraticCurveTo(cx - r * 0.7, cy + r * 1.15, cx - r * 0.3, cy + r * 1.15);
  ctx.lineTo(cx + r * 0.3, cy + r * 1.15);
  ctx.quadraticCurveTo(cx + r * 0.7, cy + r * 1.15, cx + r * 0.6, cy + r * 0.85);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ─── Yin-Yang (replaces ☯️ for BaZi) ───
export function drawYinYang(ctx: any, cx: number, cy: number, size: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;

  // Outer glow
  const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.3);
  glow.addColorStop(0, hexAlpha(color, 0.15));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // White half (right)
  ctx.fillStyle = hexAlpha("#ffffff", 0.85);
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
  ctx.fill();

  // Dark half (left)
  ctx.fillStyle = hexAlpha(color, 0.7);
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2);
  ctx.fill();

  // S-curve: white small arc on top
  ctx.fillStyle = hexAlpha("#ffffff", 0.85);
  ctx.beginPath();
  ctx.arc(cx, cy - r / 2, r / 2, Math.PI / 2, -Math.PI / 2);
  ctx.fill();

  // S-curve: dark small arc on bottom
  ctx.fillStyle = hexAlpha(color, 0.7);
  ctx.beginPath();
  ctx.arc(cx, cy + r / 2, r / 2, -Math.PI / 2, Math.PI / 2);
  ctx.fill();

  // Small dots
  ctx.fillStyle = hexAlpha(color, 0.8);
  ctx.beginPath();
  ctx.arc(cx, cy - r / 2, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hexAlpha("#ffffff", 0.9);
  ctx.beginPath();
  ctx.arc(cx, cy + r / 2, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring
  ctx.strokeStyle = hexAlpha(color, 0.4);
  ctx.lineWidth = size * 0.025;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// ─── Star (replaces ⭐ for Horoscope) ───
export function drawStar(ctx: any, cx: number, cy: number, size: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;

  // Glow
  const glow = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.4);
  glow.addColorStop(0, hexAlpha(color, 0.25));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Star shape (5-pointed)
  const spikes = 5;
  const outerR = r;
  const innerR = r * 0.4;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Star gradient fill
  const starGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  starGrad.addColorStop(0, hexAlpha(color, 0.9));
  starGrad.addColorStop(1, hexAlpha(color, 0.5));
  ctx.fillStyle = starGrad;
  ctx.fill();

  // Subtle outline
  ctx.strokeStyle = hexAlpha(color, 0.3);
  ctx.lineWidth = size * 0.02;
  ctx.stroke();

  ctx.restore();
}

// ─── Crescent Moon (replaces 🌙 for Dream) ───
export function drawMoon(ctx: any, cx: number, cy: number, size: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;

  // Glow
  const glow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.3);
  glow.addColorStop(0, hexAlpha(color, 0.2));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Crescent: draw full circle then subtract inner circle
  ctx.fillStyle = hexAlpha(color, 0.8);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Cut-out circle (shifted right and up)
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.beginPath();
  ctx.arc(cx + r * 0.45, cy - r * 0.15, r * 0.75, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  // Small stars around moon
  const starPositions = [
    { x: cx + r * 0.8, y: cy - r * 0.7, s: size * 0.06 },
    { x: cx + r * 1.0, y: cy - r * 0.2, s: size * 0.04 },
    { x: cx + r * 0.6, y: cy + r * 0.6, s: size * 0.05 },
  ];
  for (const sp of starPositions) {
    drawSmallStar(ctx, sp.x, sp.y, sp.s, color, 0.6);
  }

  ctx.restore();
}

// ─── Hearts (replaces 💕 for Compatibility) ───
export function drawHearts(ctx: any, cx: number, cy: number, size: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;

  // Main heart
  drawHeart(ctx, cx, cy, size * 0.8, color, 0.8);

  // Smaller heart offset
  drawHeart(ctx, cx + size * 0.3, cy - size * 0.2, size * 0.5, color, 0.5);

  ctx.restore();
}

// ─── Single Heart shape ───
export function drawHeart(ctx: any, cx: number, cy: number, size: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const s = size / 2;

  // Heart path using bezier curves
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.7);
  ctx.bezierCurveTo(cx - s * 1.2, cy - s * 0.1, cx - s * 0.7, cy - s * 0.9, cx, cy - s * 0.35);
  ctx.bezierCurveTo(cx + s * 0.7, cy - s * 0.9, cx + s * 1.2, cy - s * 0.1, cx, cy + s * 0.7);
  ctx.closePath();

  const heartGrad = ctx.createLinearGradient(cx - s, cy - s, cx + s, cy + s);
  heartGrad.addColorStop(0, hexAlpha(color, 0.9));
  heartGrad.addColorStop(1, hexAlpha(color, 0.5));
  ctx.fillStyle = heartGrad;
  ctx.fill();

  ctx.restore();
}

// ─── Sparkle / 4-pointed star (replaces ✨) ───
export function drawSparkle(ctx: any, cx: number, cy: number, size: number, color: string, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = size / 2;

  // Glow
  const glow = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 1.2);
  glow.addColorStop(0, hexAlpha(color, 0.3));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
  ctx.fill();

  // 4-pointed star
  const armLen = r;
  const armWidth = r * 0.15;
  ctx.fillStyle = hexAlpha(color, 0.9);
  ctx.beginPath();
  ctx.moveTo(cx, cy - armLen);
  ctx.quadraticCurveTo(cx + armWidth, cy - armWidth, cx + armLen, cy);
  ctx.quadraticCurveTo(cx + armWidth, cy + armWidth, cx, cy + armLen);
  ctx.quadraticCurveTo(cx - armWidth, cy + armWidth, cx - armLen, cy);
  ctx.quadraticCurveTo(cx - armWidth, cy - armWidth, cx, cy - armLen);
  ctx.closePath();
  ctx.fill();

  // Small diagonal sparkle
  const d = r * 0.55;
  const dw = r * 0.1;
  ctx.fillStyle = hexAlpha(color, 0.6);
  ctx.beginPath();
  ctx.moveTo(cx, cy - d);
  ctx.quadraticCurveTo(cx + dw, cy - dw, cx + d, cy);
  ctx.quadraticCurveTo(cx + dw, cy + dw, cx, cy + d);
  ctx.quadraticCurveTo(cx - dw, cy + dw, cx - d, cy);
  ctx.quadraticCurveTo(cx - dw, cy - dw, cx, cy - d);
  ctx.closePath();
  // Rotate 45 degrees
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.translate(-cx, -cy);
  ctx.beginPath();
  ctx.moveTo(cx, cy - d);
  ctx.quadraticCurveTo(cx + dw, cy - dw, cx + d, cy);
  ctx.quadraticCurveTo(cx + dw, cy + dw, cx, cy + d);
  ctx.quadraticCurveTo(cx - dw, cy + dw, cx - d, cy);
  ctx.quadraticCurveTo(cx - dw, cy - dw, cx, cy - d);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// ─── Small inline icons for score labels ───

// Small heart icon (replaces ❤️ in score labels)
export function drawSmallHeart(ctx: any, x: number, y: number, size: number, color: string) {
  ctx.save();
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.5);
  ctx.bezierCurveTo(x - s * 1.0, y - s * 0.2, x - s * 0.5, y - s * 0.8, x, y - s * 0.2);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 0.8, x + s * 1.0, y - s * 0.2, x, y + s * 0.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

// Small briefcase icon (replaces 💼 in score labels)
export function drawSmallBriefcase(ctx: any, x: number, y: number, size: number, color: string) {
  ctx.save();
  const s = size;
  // Body
  ctx.fillStyle = color;
  roundRectPath(ctx, x - s * 0.45, y - s * 0.2, s * 0.9, s * 0.6, s * 0.08);
  ctx.fill();
  // Handle
  ctx.strokeStyle = color;
  ctx.lineWidth = s * 0.08;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.2, y - s * 0.2);
  ctx.lineTo(x - s * 0.2, y - s * 0.38);
  ctx.quadraticCurveTo(x - s * 0.2, y - s * 0.48, x - s * 0.1, y - s * 0.48);
  ctx.lineTo(x + s * 0.1, y - s * 0.48);
  ctx.quadraticCurveTo(x + s * 0.2, y - s * 0.48, x + s * 0.2, y - s * 0.38);
  ctx.lineTo(x + s * 0.2, y - s * 0.2);
  ctx.stroke();
  // Center line
  ctx.fillStyle = hexAlpha(color, 0.5);
  ctx.fillRect(x - s * 0.02, y - s * 0.15, s * 0.04, s * 0.45);
  ctx.restore();
}

// Small coin icon (replaces 💰 in score labels)
export function drawSmallCoin(ctx: any, x: number, y: number, size: number, color: string) {
  ctx.save();
  const r = size * 0.4;
  // Circle
  ctx.fillStyle = hexAlpha(color, 0.8);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = hexAlpha(color, 0.5);
  ctx.lineWidth = size * 0.06;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  // Dollar sign
  ctx.fillStyle = hexAlpha("#000000", 0.5);
  ctx.font = `bold ${size * 0.4}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("$", x, y + 1);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.restore();
}

// ─── Helper: small decorative star ───
function drawSmallStar(ctx: any, cx: number, cy: number, size: number, color: string, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  // 4-pointed tiny star
  const r = size;
  const w = size * 0.25;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx + w, cy - w, cx + r, cy);
  ctx.quadraticCurveTo(cx + w, cy + w, cx, cy + r);
  ctx.quadraticCurveTo(cx - w, cy + w, cx - r, cy);
  ctx.quadraticCurveTo(cx - w, cy - w, cx, cy - r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ─── Helper: roundRect path (without beginPath) ───
function roundRectPath(ctx: any, x: number, y: number, w: number, h: number, r: number) {
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

// ─── Helper: hex color with alpha ───
function hexAlpha(hex: string, alpha: number): string {
  // Handle rgba input
  if (hex.startsWith("rgba")) return hex;
  if (hex.startsWith("rgb")) {
    const match = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Icon type mapping ───
export type IconType = "crystal-ball" | "yin-yang" | "star" | "moon" | "hearts" | "sparkle";

export function drawIcon(ctx: any, type: IconType, cx: number, cy: number, size: number, color: string, alpha = 1) {
  switch (type) {
    case "crystal-ball": drawCrystalBall(ctx, cx, cy, size, color, alpha); break;
    case "yin-yang": drawYinYang(ctx, cx, cy, size, color, alpha); break;
    case "star": drawStar(ctx, cx, cy, size, color, alpha); break;
    case "moon": drawMoon(ctx, cx, cy, size, color, alpha); break;
    case "hearts": drawHearts(ctx, cx, cy, size, color, alpha); break;
    case "sparkle": drawSparkle(ctx, cx, cy, size, color, alpha); break;
  }
}
