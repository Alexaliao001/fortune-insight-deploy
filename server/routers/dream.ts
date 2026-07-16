import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { getDb, getUsageStatus, consumeUsage } from "../db";
import { dreamRecords, userGrowth } from "../../drizzle/schema";
import { eq, desc, and, sql, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { findSymbolsByText, formatSymbolsForPrompt, identifyTheme, type DreamSymbol, type DreamTheme } from "../dream-symbols";

// ============================================================
// Enhanced Dream Analysis Engine - Element & Archetype Mapping
// ============================================================

interface DreamElementProfile {
  dominantElement: string;
  elementDistribution: Record<string, number>;
  archetypePresence: string[];
  emotionalTone: string;
  narrativePattern: string;
}

function analyzeDreamProfile(
  symbols: DreamSymbol[],
  emotions: string[],
  dreamType: string,
  dreamContent: string,
  language: string
): DreamElementProfile {
  const isEn = language === "en";

  // Element distribution from symbols
  const elementCounts: Record<string, number> = { Water: 0, Fire: 0, Earth: 0, Air: 0, Spirit: 0 };
  for (const s of symbols) {
    if (s.element && elementCounts[s.element] !== undefined) {
      elementCounts[s.element]++;
    }
  }
  // Infer from dream content keywords
  const contentLower = dreamContent.toLowerCase();
  const waterWords = ["水", "海", "河", "雨", "泪", "游泳", "洪水", "ocean", "river", "rain", "tears", "swim", "flood", "lake", "wave"];
  const fireWords = ["火", "燃烧", "光", "太阳", "热", "fire", "burn", "light", "sun", "heat", "flame", "candle"];
  const earthWords = ["山", "土", "石", "树", "花", "森林", "mountain", "earth", "stone", "tree", "flower", "forest", "garden"];
  const airWords = ["风", "飞", "天空", "云", "鸟", "wind", "fly", "sky", "cloud", "bird", "breath", "air"];
  const spiritWords = ["神", "灵", "梦", "星", "月", "光芒", "spirit", "soul", "dream", "star", "moon", "glow", "divine"];

  for (const w of waterWords) if (contentLower.includes(w)) elementCounts.Water++;
  for (const w of fireWords) if (contentLower.includes(w)) elementCounts.Fire++;
  for (const w of earthWords) if (contentLower.includes(w)) elementCounts.Earth++;
  for (const w of airWords) if (contentLower.includes(w)) elementCounts.Air++;
  for (const w of spiritWords) if (contentLower.includes(w)) elementCounts.Spirit++;

  const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Spirit";

  // Archetype presence
  const archetypes: string[] = [];
  const archetypeKeywords: Record<string, string[]> = {
    "The Shadow": ["阴影", "黑暗", "怪物", "追逐", "恐惧", "shadow", "dark", "monster", "chase", "fear", "enemy"],
    "The Anima/Animus": ["异性", "爱人", "神秘人", "吸引", "lover", "mysterious", "attraction", "opposite", "romance"],
    "The Self": ["光", "圆", "完整", "中心", "和谐", "light", "circle", "whole", "center", "harmony", "mandala"],
    "The Hero": ["战斗", "冒险", "克服", "勇气", "fight", "adventure", "overcome", "courage", "quest", "victory"],
    "The Great Mother": ["母亲", "保护", "滋养", "家", "mother", "protect", "nurture", "home", "comfort", "womb"],
    "The Wise Old Man": ["老人", "智者", "指引", "老师", "elder", "wise", "guide", "teacher", "mentor", "sage"],
    "The Trickster": ["小丑", "欺骗", "变化", "混乱", "trickster", "deceive", "change", "chaos", "joke", "fool"],
    "The Child": ["孩子", "纯真", "新生", "玩耍", "child", "innocent", "newborn", "play", "baby", "youth"],
  };
  for (const [archetype, keywords] of Object.entries(archetypeKeywords)) {
    if (keywords.some(k => contentLower.includes(k))) {
      archetypes.push(archetype);
    }
  }
  // Also add from symbol data
  for (const s of symbols) {
    if (s.jungianArchetype && !archetypes.includes(s.jungianArchetype)) {
      archetypes.push(s.jungianArchetype);
    }
  }

  // Emotional tone
  const negativeEmotions = ["恐惧", "焦虑", "悲伤", "愤怒", "孤独", "fear", "anxiety", "sadness", "anger", "loneliness", "nightmare"];
  const positiveEmotions = ["快乐", "平静", "兴奋", "温暖", "joy", "peace", "excitement", "warmth", "happiness"];
  const negCount = emotions.filter(e => negativeEmotions.some(n => e.toLowerCase().includes(n))).length;
  const posCount = emotions.filter(e => positiveEmotions.some(p => e.toLowerCase().includes(p))).length;
  const emotionalTone = negCount > posCount ? (isEn ? "Shadow/Processing" : "阴影/处理") :
    posCount > negCount ? (isEn ? "Integration/Growth" : "整合/成长") :
    (isEn ? "Transition/Exploration" : "过渡/探索");

  // Narrative pattern
  const narrativePatterns: Record<string, string[]> = {
    "Hero's Journey": ["冒险", "挑战", "克服", "胜利", "adventure", "challenge", "overcome", "victory"],
    "Descent & Return": ["坠落", "地下", "深处", "回归", "falling", "underground", "depths", "return"],
    "Chase & Escape": ["追逐", "逃跑", "躲藏", "chase", "escape", "hide", "run", "flee"],
    "Transformation": ["变化", "变身", "蜕变", "新生", "change", "transform", "metamorphosis", "rebirth"],
    "Loss & Search": ["迷路", "寻找", "丢失", "lost", "search", "missing", "find", "seek"],
    "Death & Rebirth": ["死亡", "重生", "结束", "开始", "death", "rebirth", "ending", "beginning"],
  };
  let narrativePattern = isEn ? "Symbolic Exploration" : "象征性探索";
  for (const [pattern, keywords] of Object.entries(narrativePatterns)) {
    if (keywords.some(k => contentLower.includes(k))) {
      narrativePattern = pattern;
      break;
    }
  }

  return {
    dominantElement,
    elementDistribution: elementCounts,
    archetypePresence: archetypes.length > 0 ? archetypes : [isEn ? "The Self" : "The Self"],
    emotionalTone,
    narrativePattern,
  };
}

function formatDreamProfileForPrompt(
  profile: DreamElementProfile,
  symbols: DreamSymbol[],
  theme: DreamTheme | undefined,
  language: string
): string {
  const isEn = language === "en";
  const lines: string[] = [];

  lines.push(isEn ? "=== DREAM ANALYSIS ENGINE DATA ===" : "=== 梦境分析引擎数据 ===");
  lines.push("");

  // Element distribution
  lines.push(isEn ? `[Dominant Element]: ${profile.dominantElement}` : `【主导元素】：${profile.dominantElement}`);
  const elDist = Object.entries(profile.elementDistribution)
    .filter(([_, v]) => v > 0)
    .map(([k, v]) => `${k}(${v})`)
    .join(", ");
  lines.push(isEn ? `[Element Distribution]: ${elDist || "Balanced"}` : `【元素分布】：${elDist || "均衡"}`);
  lines.push("");

  // Archetypes
  lines.push(isEn
    ? `[Active Archetypes]: ${profile.archetypePresence.join(", ")}`
    : `【活跃原型】：${profile.archetypePresence.join("、")}`);
  lines.push(isEn
    ? `[Emotional Tone]: ${profile.emotionalTone}`
    : `【情绪基调】：${profile.emotionalTone}`);
  lines.push(isEn
    ? `[Narrative Pattern]: ${profile.narrativePattern}`
    : `【叙事模式】：${profile.narrativePattern}`);
  lines.push("");

  // Theme
  if (theme) {
    lines.push(isEn
      ? `[Dream Theme]: ${theme.name} — ${theme.psychologicalMeaning}`
      : `【梦境主题】：${theme.nameChinese} — ${theme.psychologicalMeaningChinese}`);
    lines.push("");
  }

  // Symbol summary
  if (symbols.length > 0) {
    lines.push(isEn ? "[Identified Symbols]:" : "【识别符号】：");
    for (const s of symbols) {
      const name = isEn ? s.name : s.nameChinese;
      const archetype = s.jungianArchetype ? ` (${s.jungianArchetype})` : "";
      const positive = isEn ? s.meaningPositive : s.meaningPositiveChinese;
      const negative = isEn ? s.meaningNegative : s.meaningNegativeChinese;
      const insight = isEn ? s.psychologicalInsight : s.psychologicalInsightChinese;
      lines.push(`  • ${name}${archetype}`);
      lines.push(`    ${isEn ? "Positive" : "积极"}: ${positive}`);
      lines.push(`    ${isEn ? "Negative" : "消极"}: ${negative}`);
      lines.push(`    ${isEn ? "Insight" : "洞察"}: ${insight}`);
    }
  }

  return lines.join("\n");
}

// ============================================================
// 10-Dimension Deep Analysis Prompt Builder
// ============================================================

function buildDeepAnalysisPrompt(language: string): string {
  if (language === "en") {
    return `You are a world-class dream analyst trained in Jungian analytical psychology, Freudian dream theory, Gestalt dreamwork, transpersonal psychology, and cross-cultural dream symbolism. You combine deep psychological knowledge with practical wisdom and spiritual sensitivity.

IMPORTANT RULES:
- Use the structured dream analysis engine data provided below as the foundation
- Reference specific Jungian archetypes (Shadow, Anima/Animus, Self, Hero, etc.) when relevant
- Consider both personal unconscious and collective unconscious meanings
- Connect dream symbols to the dreamer's potential emotional state and life situation
- Provide psychologically grounded insights, not superstitious fortune-telling
- Be warm, empathetic, non-judgmental, and deeply insightful
- Each dimension must be substantial (3-5 paragraphs minimum)

FORMAT your response with EXACTLY these 10 section headers (use the exact format "## N. Title"):

## 1. Dream Landscape Overview
Provide an overview of the dream's overall energy field, atmosphere, and significance. Describe the dream's emotional texture, visual palette, and the quality of consciousness present. Identify the dream's position in the dreamer's psychological journey. Include a "dream vitality score" (1-10) reflecting the dream's transformative potential.

## 2. Symbol Archaeology
Deep-dive into each major symbol identified in the dream. For each symbol, explore: its universal/archetypal meaning, its personal/contextual meaning within this specific dream, cross-cultural symbolic traditions (Eastern & Western), and how the symbol connects to the dreamer's inner landscape. Reference the symbol database analysis.

## 3. Emotional Cartography
Map the emotional landscape of the dream in detail. Identify primary and secondary emotions, emotional transitions throughout the dream narrative, suppressed or hidden emotions beneath the surface, and how these dream emotions mirror waking life emotional patterns. Include analysis of emotional intensity and flow.

## 4. Jungian Archetype Analysis
Identify and deeply analyze all Jungian archetypes present in the dream. For each archetype: explain its role in the dream narrative, its message to the conscious mind, its relationship to the dreamer's individuation process, and specific Shadow work or integration opportunities it reveals.

## 5. Subconscious Mapping
Explore what the dream reveals about the dreamer's subconscious mind. Analyze: repressed desires or fears surfacing through dream imagery, unresolved conflicts being processed, childhood patterns or early experiences being revisited, and the relationship between dream content and current life challenges.

## 6. Narrative Structure & Dream Logic
Analyze the dream's storytelling structure: the beginning (setting/context), development (conflict/tension), climax (peak moment), and resolution (or lack thereof). Identify the dream's internal logic, recurring motifs, and what the narrative arc reveals about the dreamer's psychological processing.

## 7. Body-Mind Connection
Explore the somatic and physiological dimensions of the dream. Analyze: physical sensations described or implied, the body's role in dream symbolism, stress/tension patterns reflected in dream imagery, and recommendations for body-based practices (yoga, breathwork, movement) that address dream themes.

## 8. Practical Action Guide
Provide specific, actionable guidance based on the dream's messages. Include: 3-5 concrete steps the dreamer can take in waking life, journaling prompts for deeper exploration, creative expression exercises (art, writing, movement) to process dream themes, and relationship or communication insights.

## 9. Meditation & Ritual Suggestions
Offer tailored spiritual practices: a specific meditation technique suited to the dream's themes, a simple ritual or ceremony for integration, crystal/color/element recommendations aligned with the dream's energy, and a bedtime practice to continue the dream dialogue.

## 10. Affirmation & Cosmic Message
Conclude with: a personalized affirmation drawn from the dream's wisdom, the dream's "cosmic message" — what the universe/psyche is trying to communicate, a blessing or encouragement for the dreamer's journey, and a poetic closing that honors the dream's gift.`;
  }

  return `你是一位世界级的梦境分析师，精通荣格分析心理学、弗洛伊德梦境理论、格式塔梦境工作、超个人心理学和跨文化梦境象征学。你将深厚的心理学知识与实用智慧和灵性敏感度相结合。

重要规则：
- 以下方提供的梦境分析引擎数据为解读基础
- 适时引用荣格原型（阴影、阿尼玛/阿尼姆斯、自性、英雄等）
- 同时考虑个人无意识和集体无意识层面的含义
- 将梦境符号与做梦者可能的情感状态和生活情境联系起来
- 提供有心理学根据的洞察，而非迷信式的占卜
- 语气温暖、共情、不带评判，且深具洞察力
- 每个维度必须充实（至少3-5段）

请严格按照以下10个维度标题格式输出（使用"## N. 标题"格式）：

## 1. 梦境全景概览
提供梦境整体能量场、氛围和意义的概览。描述梦境的情感质地、视觉色调和意识品质。定位梦境在做梦者心理旅程中的位置。包含一个"梦境活力指数"（1-10分），反映梦境的转化潜力。

## 2. 符号考古学
深入探索梦中每个主要符号。对每个符号探讨：其普遍/原型意义、在此特定梦境中的个人/情境意义、东西方跨文化象征传统，以及符号如何连接做梦者的内在景观。引用符号数据库分析。

## 3. 情绪地图学
详细绘制梦境的情绪地图。识别主要和次要情绪、梦境叙事中的情绪转变、表面之下被压抑或隐藏的情绪，以及这些梦境情绪如何映射清醒生活中的情绪模式。包含情绪强度和流动分析。

## 4. 荣格原型深度解析
识别并深入分析梦中出现的所有荣格原型。对每个原型：解释其在梦境叙事中的角色、对意识心灵的信息、与做梦者个体化进程的关系，以及它揭示的具体阴影工作或整合机会。

## 5. 潜意识地图
探索梦境揭示的做梦者潜意识内容。分析：通过梦境意象浮现的被压抑欲望或恐惧、正在处理的未解决冲突、被重新审视的童年模式或早期经历，以及梦境内容与当前生活挑战的关系。

## 6. 叙事结构与梦境逻辑
分析梦境的叙事结构：开端（背景/情境）、发展（冲突/张力）、高潮（巅峰时刻）和结局（或缺失）。识别梦境的内在逻辑、反复出现的母题，以及叙事弧线揭示的做梦者心理处理过程。

## 7. 身心连接
探索梦境的身体和生理维度。分析：描述或暗示的身体感觉、身体在梦境象征中的角色、梦境意象反映的压力/紧张模式，以及针对梦境主题的身体练习建议（瑜伽、呼吸法、运动）。

## 8. 实践行动指南
基于梦境信息提供具体、可操作的指导。包括：做梦者在清醒生活中可以采取的3-5个具体步骤、深入探索的日记提示、处理梦境主题的创意表达练习（艺术、写作、运动），以及关系或沟通洞察。

## 9. 冥想与仪式建议
提供量身定制的灵性实践：适合梦境主题的特定冥想技巧、用于整合的简单仪式或典礼、与梦境能量对齐的水晶/颜色/元素建议，以及继续梦境对话的睡前练习。

## 10. 肯定语与宇宙寄语
以此结束：从梦境智慧中提炼的个性化肯定语、梦境的"宇宙信息"——宇宙/心灵试图传达的内容、对做梦者旅程的祝福或鼓励，以及一段致敬梦境礼物的诗意结语。`;
}

export const dreamRouter = router({
  interpret: publicProcedure
    .input(z.object({
      title: z.string().optional(),
      dreamContent: z.string().min(10, "Dream description must be at least 10 characters"),
      emotions: z.array(z.string()).optional(),
      keyElements: z.array(z.string()).optional(),
      dreamType: z.enum(["normal", "nightmare", "lucid", "recurring", "prophetic"]).optional(),
      clarity: z.number().min(1).max(5).optional(),
      dreamDate: z.string().optional(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check usage limits
      if (ctx.user?.id) {
        const usage = await getUsageStatus(ctx.user.id, "dream");
        if (!usage.canUse) {
          throw new Error("FREE_LIMIT_REACHED");
        }
      }

      const { title, dreamContent, emotions, keyElements, dreamType, clarity, dreamDate, language } = input;
      const isEn = language === "en";

      // === STEP 1: Structured Symbol Analysis ===
      const foundSymbols = findSymbolsByText(dreamContent, language);
      const symbolIds = foundSymbols.map(s => s.id);
      const dreamTheme = identifyTheme(symbolIds);

      // === STEP 2: Enhanced Dream Profile Analysis ===
      const dreamProfile = analyzeDreamProfile(
        foundSymbols,
        emotions || [],
        dreamType || "normal",
        dreamContent,
        language
      );

      // === STEP 3: Build enhanced context for LLM ===
      const profileContext = formatDreamProfileForPrompt(dreamProfile, foundSymbols, dreamTheme, language);

      const emotionsText = emotions?.length
        ? (isEn ? `Emotions in dream: ${emotions.join(", ")}` : `梦中情绪：${emotions.join("、")}`)
        : "";
      const elementsText = keyElements?.length
        ? (isEn ? `Key elements: ${keyElements.join(", ")}` : `关键元素：${keyElements.join("、")}`)
        : "";
      const typeLabels: Record<string, string> = isEn ? {
        normal: "Normal Dream", nightmare: "Nightmare", lucid: "Lucid Dream",
        recurring: "Recurring Dream", prophetic: "Prophetic Dream",
      } : {
        normal: "普通梦境", nightmare: "噩梦", lucid: "清醒梦",
        recurring: "重复梦", prophetic: "预知梦",
      };
      const typeText = dreamType ? (isEn ? `Dream type: ${typeLabels[dreamType]}` : `梦境类型：${typeLabels[dreamType]}`) : "";
      const clarityText = clarity ? (isEn ? `Dream clarity: ${clarity}/5` : `梦境清晰度：${clarity}/5`) : "";

      // === STEP 4: 10-Dimension Deep Analysis ===
      const systemPrompt = buildDeepAnalysisPrompt(language);

      const userPrompt = isEn
        ? `Dream Content: ${dreamContent}
${emotionsText} ${elementsText} ${typeText} ${clarityText}

${profileContext}

Please provide a comprehensive 10-dimension deep dream analysis based on both the dream content and the analysis engine data above. Each dimension must be thorough and insightful.`
        : `梦境内容：${dreamContent}
${emotionsText} ${elementsText} ${typeText} ${clarityText}

${profileContext}

请基于梦境内容和上述分析引擎数据，提供全面的10维度深度梦境分析。每个维度必须充实且有洞察力。`;

      const response = await invokeLLM({
        language,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const rawContent: string = typeof response.choices[0]?.message?.content === "string"
        ? response.choices[0].message.content
        : (isEn ? "Dream interpretation failed, please try again" : "解梦失败，请重试");

      if (ctx.user?.id && !response.degradation) {
        await consumeUsage(ctx.user.id, "dream");
      }

      // Prepare symbol analysis for storage
      const symbolAnalysisData = foundSymbols.map((s: DreamSymbol) => ({
        symbol: s.name,
        symbolChinese: s.nameChinese,
        category: s.category,
        meaning: s.meaningPositive,
        meaningChinese: s.meaningPositiveChinese,
        jungianArchetype: s.jungianArchetype,
        psychologicalInsight: s.psychologicalInsight,
      }));

      // Save to database with structured data
      const db = await getDb();
      if (db && !response.degradation) {
        const insertData: Record<string, unknown> = {
          sessionId: nanoid(),
          title: title || null,
          dreamContent,
          emotions: emotions || null,
          keyElements: keyElements || null,
          dreamType: dreamType || "normal",
          clarity: clarity || null,
          interpretation: rawContent,
          deepAnalysis: rawContent,
          symbolAnalysis: symbolAnalysisData,
          isPaid: false,
        };
        if (ctx.user?.id) insertData.userId = ctx.user.id;
        if (dreamDate) insertData.dreamDate = new Date(dreamDate);

        await db.insert(dreamRecords).values(insertData as typeof dreamRecords.$inferInsert);

        // Update growth points
        if (ctx.user?.id) {
          const [existingGrowth] = await db
            .select()
            .from(userGrowth)
            .where(eq(userGrowth.userId, ctx.user.id))
            .limit(1);

          if (existingGrowth) {
            await db.update(userGrowth)
              .set({
                selfAwareness: sql`${userGrowth.selfAwareness} + 3`,
                spiritualGrowth: sql`${userGrowth.spiritualGrowth} + 2`,
                totalPoints: sql`${userGrowth.totalPoints} + 5`,
              })
              .where(eq(userGrowth.userId, ctx.user.id));
          } else {
            await db.insert(userGrowth).values({
              userId: ctx.user.id,
              selfAwareness: 3,
              spiritualGrowth: 2,
              totalPoints: 5,
            });
          }
        }
      }

      return {
        interpretation: rawContent,
        deepAnalysis: rawContent,
        source: response.degradation ? "daily_limit" as const : "ai" as const,
        degradation: response.degradation ?? null,
        symbolAnalysis: symbolAnalysisData,
        theme: dreamTheme ? {
          name: dreamTheme.name,
          nameChinese: dreamTheme.nameChinese,
          description: dreamTheme.description,
          descriptionChinese: dreamTheme.descriptionChinese,
        } : null,
        dreamProfile: {
          dominantElement: dreamProfile.dominantElement,
          elementDistribution: dreamProfile.elementDistribution,
          archetypePresence: dreamProfile.archetypePresence,
          emotionalTone: dreamProfile.emotionalTone,
          narrativePattern: dreamProfile.narrativePattern,
        },
      };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const dreams = await db
      .select()
      .from(dreamRecords)
      .where(eq(dreamRecords.userId, ctx.user.id))
      .orderBy(desc(dreamRecords.createdAt))
      .limit(50);
    return dreams;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;
      const [dream] = await db
        .select()
        .from(dreamRecords)
        .where(and(eq(dreamRecords.id, input.id), eq(dreamRecords.userId, ctx.user.id)))
        .limit(1);
      return dream || null;
    }),

  exportSingle: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const [dream] = await db
        .select()
        .from(dreamRecords)
        .where(and(eq(dreamRecords.id, input.id), eq(dreamRecords.userId, ctx.user.id)))
        .limit(1);
      if (!dream) throw new Error("Dream record not found");
      const { generateDreamPDFHTML } = await import("../pdfGenerator");
      const html = generateDreamPDFHTML([dream]);
      return { html, filename: `Dream_${dream.title || dream.id}_${Date.now()}.html` };
    }),

  exportBatch: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().min(1).max(100).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const dreams = await db
        .select()
        .from(dreamRecords)
        .where(eq(dreamRecords.userId, ctx.user.id))
        .orderBy(desc(dreamRecords.createdAt))
        .limit(input.limit || 50);
      if (dreams.length === 0) throw new Error("No dream records found");
      const { generateDreamPDFHTML } = await import("../pdfGenerator");
      const html = generateDreamPDFHTML(dreams, "Dream Journal");
      return { html, filename: `Dream_Journal_${new Date().toISOString().split("T")[0]}.html`, count: dreams.length };
    }),

  search: protectedProcedure
    .input(z.object({
      keyword: z.string().optional(),
      emotions: z.array(z.string()).optional(),
      elements: z.array(z.string()).optional(),
      dreamType: z.enum(["normal", "nightmare", "lucid", "recurring", "prophetic"]).optional(),
      tags: z.array(z.string()).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];
      const allDreams = await db
        .select()
        .from(dreamRecords)
        .where(eq(dreamRecords.userId, ctx.user.id))
        .orderBy(desc(dreamRecords.createdAt))
        .limit(200);

      let filtered = allDreams;
      if (input.keyword) {
        const kw = input.keyword.toLowerCase();
        filtered = filtered.filter(d =>
          d.dreamContent.toLowerCase().includes(kw) ||
          (d.title && d.title.toLowerCase().includes(kw)) ||
          (d.interpretation && d.interpretation.toLowerCase().includes(kw))
        );
      }
      if (input.dreamType) {
        filtered = filtered.filter(d => d.dreamType === input.dreamType);
      }
      if (input.emotions?.length) {
        filtered = filtered.filter(d => {
          const de = d.emotions as string[] | null;
          return de && input.emotions!.some(e => de.includes(e));
        });
      }
      if (input.elements?.length) {
        filtered = filtered.filter(d => {
          const dk = d.keyElements as string[] | null;
          return dk && input.elements!.some(e => dk.includes(e));
        });
      }
      return filtered.slice(0, input.limit);
    }),

  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const records = await db
      .select({ tags: dreamRecords.tags })
      .from(dreamRecords)
      .where(eq(dreamRecords.userId, ctx.user.id));

    const tagCounts: Record<string, number> = {};
    for (const record of records) {
      const tags = record.tags as string[] | null;
      if (tags) {
        for (const tag of tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }
      }
    }

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const records = await db
      .select()
      .from(dreamRecords)
      .where(eq(dreamRecords.userId, ctx.user.id));

    const emotionDistribution: Record<string, number> = {};
    const elementDistribution: Record<string, number> = {};
    const typeDistribution: Record<string, number> = {};

    for (const record of records) {
      const emotions = record.emotions as string[] | null;
      if (emotions) {
        for (const e of emotions) {
          emotionDistribution[e] = (emotionDistribution[e] || 0) + 1;
        }
      }
      const elements = record.keyElements as string[] | null;
      if (elements) {
        for (const el of elements) {
          elementDistribution[el] = (elementDistribution[el] || 0) + 1;
        }
      }
      if (record.dreamType) {
        typeDistribution[record.dreamType] = (typeDistribution[record.dreamType] || 0) + 1;
      }
    }

    // Timeline: dreams per week for last 12 weeks
    const now = new Date();
    const weeklyTimeline: { week: string; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const count = records.filter(r => {
        const d = new Date(r.createdAt);
        return d >= weekStart && d < weekEnd;
      }).length;
      const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      weeklyTimeline.push({ week: label, count });
    }

    // Count dreams with deep analysis
    const deepAnalysisCount = records.filter(r => r.deepAnalysis && r.deepAnalysis.length > 100).length;

    // Most common tags
    const tagDistribution: Record<string, number> = {};
    for (const record of records) {
      const tags = record.tags as string[] | null;
      if (tags) {
        for (const tag of tags) {
          tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
        }
      }
    }

    return {
      totalDreams: records.length,
      deepAnalysisCount,
      emotionDistribution,
      elementDistribution,
      typeDistribution,
      tagDistribution,
      weeklyTimeline,
    };
  }),

  updateTags: protectedProcedure
    .input(z.object({
      dreamId: z.number(),
      tags: z.array(z.string()),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db
        .update(dreamRecords)
        .set({ tags: input.tags })
        .where(
          and(
            eq(dreamRecords.id, input.dreamId),
            eq(dreamRecords.userId, ctx.user.id)
          )
        );
      return { success: true };
    }),
});
