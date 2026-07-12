import { Request, Response, NextFunction } from "express";

/**
 * Social crawler detection and dynamic OG meta tag injection middleware.
 * 
 * When a social media crawler (Facebook, Twitter, Telegram, WhatsApp, LinkedIn, etc.)
 * requests a page with share parameters, this middleware intercepts the request and
 * injects dynamic OG meta tags into the HTML before serving.
 * 
 * Share URL format: https://fortunesite.one/share?type=tarot&title=...&summary=...&lang=en&cards=...&overall=85
 * 
 * All personalized data params (cards, positions, spread, sign, overall, love, career,
 * wealth, luckyColor, luckyNumber, birth, gender, dreamTitle, emotions, elements,
 * dreamType, clarity, sign1, sign2, name1, name2, matchScore) are forwarded to the
 * OG image endpoint for personalized rendering.
 * 
 * For regular users, the /share route redirects to the homepage with UTM params preserved.
 */

const SOCIAL_CRAWLERS = [
  "facebookexternalhit",
  "Facebot",
  "Twitterbot",
  "TelegramBot",
  "WhatsApp",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "Pinterest",
  "Googlebot",
  "bingbot",
  "Applebot",
  "vkShare",
  "W3C_Validator",
  "redditbot",
  "Embedly",
  "Quora Link Preview",
  "outbrain",
  "rogerbot",
  "Screaming Frog",
];

function isSocialCrawler(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return SOCIAL_CRAWLERS.some((bot) => ua.includes(bot.toLowerCase()));
}

type OgType = "tarot" | "bazi" | "horoscope" | "dream" | "compatibility";

interface OgConfig {
  defaultTitle: { zh: string; en: string };
  defaultDescription: { zh: string; en: string };
}

const typeConfig: Record<OgType, OgConfig> = {
  tarot: {
    defaultTitle: { zh: "AI塔罗占卜结果", en: "AI Tarot Reading Result" },
    defaultDescription: {
      zh: "我刚做了AI塔罗占卜，结果很有启发！来试试你的免费塔罗占卜吧。",
      en: "I just got my AI tarot reading — it was incredibly insightful! Try your free reading now.",
    },
  },
  bazi: {
    defaultTitle: { zh: "AI八字精批结果", en: "AI BaZi Analysis Result" },
    defaultDescription: {
      zh: "我的AI八字分析结果出来了，非常准确！来看看你的命理分析。",
      en: "My AI BaZi destiny analysis was spot on! Discover your birth chart insights.",
    },
  },
  horoscope: {
    defaultTitle: { zh: "星座运势解读", en: "Horoscope Reading" },
    defaultDescription: {
      zh: "今日星座运势解读，看看星星为你带来什么启示。",
      en: "Today's horoscope reading — see what the stars have in store for you.",
    },
  },
  dream: {
    defaultTitle: { zh: "AI解梦分析", en: "AI Dream Interpretation" },
    defaultDescription: {
      zh: "AI帮我解读了梦境的深层含义，非常有趣！来分析你的梦吧。",
      en: "AI decoded the deeper meaning of my dream — fascinating! Analyze your dreams too.",
    },
  },
  compatibility: {
    defaultTitle: { zh: "星座合盘分析", en: "Compatibility Analysis" },
    defaultDescription: {
      zh: "刚做了星座合盘分析，看看我们的缘分指数！你也来试试。",
      en: "Just got our compatibility analysis — see our chemistry score! Try yours too.",
    },
  },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Personalized data param keys that should be forwarded to OG image endpoint
const PERSONALIZED_KEYS = [
  "cards", "positions", "spread",
  "sign", "overall", "love", "career", "wealth", "luckyColor", "luckyNumber",
  "birth", "gender",
  "dreamTitle", "emotions", "elements", "dreamType", "clarity",
  "sign1", "sign2", "name1", "name2", "matchScore",
];

/**
 * Middleware that handles /share route:
 * - For social crawlers: returns HTML with dynamic OG meta tags + personalized OG image
 * - For regular users: serves the SPA (React router handles redirect)
 */
export function ogMetaMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only intercept /share route
  if (!req.path.startsWith("/share")) {
    return next();
  }

  const userAgent = req.headers["user-agent"] || "";
  
  // For regular users, let the SPA handle it
  if (!isSocialCrawler(userAgent)) {
    return next();
  }

  // Extract share parameters
  const type = (req.query.type as OgType) || "tarot";
  const lang = (req.query.lang as "zh" | "en") || "en";
  const rawTitle = req.query.title as string;
  const rawSummary = req.query.summary as string;

  const config = typeConfig[type] || typeConfig.tarot;
  const title = rawTitle || config.defaultTitle[lang];
  const description = rawSummary || config.defaultDescription[lang];
  const siteName = lang === "zh" ? "洞察未来 · AI命理平台" : "Fortune Insight · AI Divination";

  // Build the OG image URL with personalized data params
  const origin = `${req.protocol}://${req.get("host")}`;
  const ogImageParams = new URLSearchParams();
  ogImageParams.set("type", type);
  ogImageParams.set("title", title.slice(0, 60));
  ogImageParams.set("summary", description.slice(0, 120));
  ogImageParams.set("lang", lang);

  // Forward all personalized data params to the OG image endpoint
  for (const key of PERSONALIZED_KEYS) {
    const val = req.query[key] as string;
    if (val) {
      ogImageParams.set(key, val.slice(0, 100));
    }
  }

  const ogImageUrl = `${origin}/api/og-image?${ogImageParams.toString()}`;
  const pageUrl = `${origin}${req.originalUrl}`;

  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description.slice(0, 300));
  const safeSiteName = escapeHtml(siteName);

  // Return a minimal HTML page with OG tags for crawlers
  const html = `<!DOCTYPE html>
<html lang="${lang === "zh" ? "zh-CN" : "en"}">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle} — ${safeSiteName}</title>
  <meta name="description" content="${safeDesc}" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:site_name" content="${safeSiteName}" />
  <meta property="og:locale" content="${lang === "zh" ? "zh_CN" : "en_US"}" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />
  
  <!-- Redirect regular browsers to the main site -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(origin)}/" />
</head>
<body>
  <h1>${safeTitle}</h1>
  <p>${safeDesc}</p>
  <p><a href="${escapeHtml(origin)}/">Visit Fortune Insight</a></p>
</body>
</html>`;

  res.set({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  });
  res.status(200).send(html);
}
