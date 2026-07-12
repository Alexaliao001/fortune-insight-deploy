import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { getDb, getUsageStatus, consumeUsage } from "../db";
import { tarotReadings } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  ALL_CARDS,
  SPREADS,
  drawCards,
  formatDrawnCardsForPrompt,
  getSpreadById,
  getCardByName,
  type DrawnCard,
  type TarotCard,
} from "../tarot-database";

// Map question types to recommended spreads
const QUESTION_SPREAD_MAP: Record<string, string> = {
  love: "love",
  career: "career",
  wealth: "three-card",
  health: "three-card",
  general: "three-card",
};

export const tarotRouter = router({
  // Get available spreads
  getSpreads: publicProcedure.query(() => {
    return SPREADS.map(s => ({
      id: s.id,
      name: s.name,
      nameChinese: s.nameChinese,
      description: s.description,
      descriptionChinese: s.descriptionChinese,
      cardCount: s.cardCount,
      category: s.category,
      positions: s.positions,
    }));
  }),

  // Get all cards (for frontend card selection UI)
  getCards: publicProcedure.query(() => {
    return ALL_CARDS.map(c => ({
      id: c.id,
      name: c.name,
      nameChinese: c.nameChinese,
      nameShort: c.nameShort,
      arcana: c.arcana,
      suit: c.suit,
      number: c.number,
      element: c.element,
      keywords: c.keywords,
      keywordsChinese: c.keywordsChinese,
    }));
  }),

  // Server-side card draw (cryptographic randomness)
  drawCards: publicProcedure
    .input(z.object({
      spreadId: z.string(),
    }))
    .mutation(({ input }) => {
      const drawn = drawCards(input.spreadId);
      return drawn.map(d => ({
        cardId: d.card.id,
        cardName: d.card.name,
        cardNameChinese: d.card.nameChinese,
        nameShort: d.card.nameShort,
        isReversed: d.isReversed,
        positionIndex: d.position.index,
        positionName: d.position.name,
        positionNameChinese: d.position.nameChinese,
        positionDescription: d.position.description,
        positionDescriptionChinese: d.position.descriptionChinese,
        // Card details for display
        arcana: d.card.arcana,
        suit: d.card.suit,
        element: d.card.element,
        keywords: d.card.keywords,
        keywordsChinese: d.card.keywordsChinese,
        meaningUpright: d.card.meaningUpright,
        meaningReversed: d.card.meaningReversed,
        meaningUprightChinese: d.card.meaningUprightChinese,
        meaningReversedChinese: d.card.meaningReversedChinese,
        yesNo: d.card.yesNo,
      }));
    }),

  // Professional reading with algorithm + AI hybrid
  getReading: publicProcedure
    .input(z.object({
      questionType: z.enum(["love", "career", "wealth", "health", "general"]),
      question: z.string().optional(),
      spreadId: z.string().optional(),
      // Accept either server-drawn cards or manual card selection
      drawnCards: z.array(z.object({
        cardId: z.number(),
        isReversed: z.boolean(),
        positionIndex: z.number(),
      })).optional(),
      // Legacy support: card names from old frontend
      cards: z.array(z.string()).optional(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check usage limits
      if (ctx.user?.id) {
        const usage = await getUsageStatus(ctx.user.id, "tarot");
        if (!usage.canUse) {
          throw new Error("FREE_LIMIT_REACHED");
        }
        await consumeUsage(ctx.user.id, "tarot");
      }

      const { questionType, question, language } = input;
      const isEn = language === "en";
      const spreadId = input.spreadId || QUESTION_SPREAD_MAP[questionType] || "three-card";
      const spread = getSpreadById(spreadId);
      if (!spread) throw new Error("Invalid spread");

      // Resolve drawn cards
      let resolvedDrawn: DrawnCard[];

      if (input.drawnCards && input.drawnCards.length > 0) {
        // New system: use server-drawn card data
        resolvedDrawn = input.drawnCards.map(dc => {
          const card = ALL_CARDS.find(c => c.id === dc.cardId);
          if (!card) throw new Error(`Card not found: ${dc.cardId}`);
          const position = spread.positions[dc.positionIndex];
          if (!position) throw new Error(`Position not found: ${dc.positionIndex}`);
          return { card, isReversed: dc.isReversed, position };
        });
      } else if (input.cards && input.cards.length > 0) {
        // Legacy support: card names from old frontend
        resolvedDrawn = input.cards.map((name, idx) => {
          const card = getCardByName(name) || ALL_CARDS[idx % ALL_CARDS.length];
          const position = spread.positions[idx % spread.positions.length];
          return { card, isReversed: Math.random() < 0.3, position };
        });
      } else {
        // Server-side draw
        resolvedDrawn = drawCards(spreadId);
      }

      // Build structured prompt with real card data
      const questionText = question || (isEn ? "General Fortune" : "整体运势");
      const structuredPrompt = formatDrawnCardsForPrompt(
        resolvedDrawn, spread, questionText, language
      );

      const typeLabels: Record<string, string> = isEn ? {
        love: "Love & Relationships",
        career: "Career & Growth",
        wealth: "Wealth & Finance",
        health: "Health & Wellness",
        general: "General Fortune",
      } : {
        love: "爱情姻缘",
        career: "事业发展",
        wealth: "财运理财",
        health: "健康养生",
        general: "综合运势",
      };

      const systemPrompt = isEn
        ? `You are a master tarot reader with 30 years of experience in the Rider-Waite-Smith tradition. You combine deep knowledge of tarot symbolism, Jungian archetypes, Kabbalistic Tree of Life correspondences, and practical life wisdom.

IMPORTANT RULES:
- Base your interpretation STRICTLY on the actual cards drawn, their positions, and whether they are upright or reversed
- Reference specific card imagery and symbolism from the Rider-Waite deck (e.g., "The flowing water in the Star card suggests...")
- Analyze card interactions: elemental dignities, numerological patterns, and narrative arcs across positions
- Reversed cards indicate blocked energy, shadow aspects, internalized lessons, or the card's energy manifesting in subtle/unconscious ways
- Provide specific, actionable advice grounded in the card symbolism — not generic platitudes
- Use warm but authoritative language befitting a seasoned reader
- Each section should be substantive (4-8 sentences minimum), not superficial summaries

FORMAT your response with these 10 sections:

## 🌟 Overall Energy Field
Synthesize the entire spread's energetic signature in 4-6 sentences. Describe the dominant elemental energy, the balance between Major and Minor Arcana, and the overall narrative arc from first card to last. Mention any striking patterns (all same element, all reversed, numerical sequences, etc.).

## 🎨 Card-by-Card Deep Dive
For EACH card, provide a detailed interpretation:
### [Position Name]: [Card Name] ([Upright/Reversed])
**Visual Symbolism**: Describe 2-3 specific visual elements from the Rider-Waite imagery and what they symbolize in this context.
**Core Message**: 3-4 sentences interpreting this card in this specific position, connecting the card's traditional meaning to the querent's situation.
**Shadow Aspect**: What this card warns about or what hidden challenge it reveals.

## 🧠 Psychological Mirror
Analyze the reading through a Jungian lens in 4-6 sentences. What archetypes are at play? What does this spread reveal about the querent's unconscious patterns, projections, or individuation journey? Connect the cards to shadow work, anima/animus dynamics, or the hero's journey.

## 🔗 Card Interactions & Narrative
Analyze how the cards interact with each other in 4-6 sentences. Discuss elemental dignities (supporting/opposing elements), the story told by the sequence, and any tensions or harmonies between card pairs. How does the energy flow or transform from one position to the next?

## ✨ Symbolic Deep Dive
Explore the deeper symbolic layers in 4-6 sentences. Reference Kabbalistic correspondences, numerological significance, astrological connections (zodiac signs, planetary rulers), and mythological parallels. What universal themes emerge from this particular combination?

## 💫 Energy & Timing
Discuss the energetic quality and timing implications in 3-5 sentences. Based on the elemental balance and card nature, when might the querent expect shifts? Is the energy building, peaking, or waning? What season or timeframe do the cards suggest?

## 🔮 Synthesis & Core Truth
Weave all cards into a unified narrative in 5-8 sentences. What is the ONE core truth this spread is communicating? How do the individual messages converge into a single, powerful insight? This should feel like the "aha moment" of the reading.

## 💡 Practical Action Steps
Provide 4-5 specific, concrete actions the querent can take based on this reading. Each action should be directly tied to a specific card's guidance. Include both immediate steps and longer-term practices.

## 🌿 Ritual & Meditation Guidance
Suggest a specific ritual, meditation, or mindfulness practice inspired by the dominant card energy. Include crystal, color, or element recommendations that align with the reading's energy. 3-4 sentences.

## 📝 Affirmation & Closing
Craft 2-3 personalized affirmations drawn directly from the card symbolism. End with a brief, empowering closing message that honors the querent's journey.`
        : `你是一位拥有30年经验的塔罗大师，精通韦特塔罗体系、卡巴拉生命之树对应、荣格原型理论和实用人生智慧。

重要规则：
- 严格基于实际抽到的牌、牌位和正逆位进行解读
- 引用韦特牌中具体的牌面意象和象征（如“星星牌中裸女将水分别倒入池塘和大地，象征意识与潜意识的流动...”）
- 分析牌面互动：元素尊严、数字学规律、位置间的叙事弧线
- 逆位牌表示能量受阻、阴影面、内化的课题，或牌义以微妙/无意识的方式显现
- 每个维度提供深入分析（4-8句话以上），而非浅层总结
- 提供具体、可操作的建议——而非泛泛之谈
- 使用温暖但专业的语言，体现资深塔罗师的权威感

格式要求（必须包含以下10个维度）：

## 🌟 总体能量场
用4-6句话综合整个牌阵的能量特征。描述主导元素能量、大小阿卡纳的平衡、从第一张牌到最后一张牌的整体叙事弧线。指出任何显著规律（全同元素、全逆位、数字序列等）。

## 🎨 逐牌深度解读
每张牌提供详细解读：
### 【牌位名称】：【牌名】（正位/逆位）
**视觉象征**：描述2-3个韦特牌面中的具体视觉元素，解释它们在此情境下的象征意义。
**核心信息**：3-4句话解读此牌在此位置的含义，将牌的传统含义与问卓者的具体情境联系起来。
**阴影提示**：此牌警示什么，或揭示了什么隐藏的挑战。

## 🧠 心理原型映射
用荣格心理学视角分析牌阵（4-6句话）。哪些原型在起作用？这个牌阵揭示了问卓者哪些无意识模式、投射或个体化旅程？将牌面与阴影工作、阿尼玛/阿尼姆斯动力、英雄之旅联系起来。

## 🔗 牌面互动与叙事
用4-6句话分析牌与牌之间的互动。讨论元素尊严（支持/对立元素）、序列讲述的故事、牌对之间的张力或和谐。能量如何从一个位置流动或转化到下一个位置？

## ✨ 深层象征探索
用4-6句话探索更深层的象征。引用卡巴拉对应、数字学意义、星象学联系（星座、行星守护）和神话学平行。这个特定组合涌现出什么普世主题？

## 💫 能量与时机
用3-5句话讨论能量质量和时机含义。基于元素平衡和牌面性质，问卓者何时可能期待转变？能量是在积蓄、达到顶峰还是在消退？牌面暗示什么季节或时间框架？

## 🔮 综合归纳与核心真相
用5-8句话将所有牌编织成统一叙事。这个牌阵传达的核心真相是什么？各张牌的信息如何汇聚成一个强大的洞见？这应该是解读的“顿悟时刻”。

## 💡 实践行动指南
提供4-5条具体、可操作的行动建议。每条建议应直接与某张牌的指引相关联。包括即时可做的步骤和长期修炼方向。

## 🌿 仪式与冥想建议
基于主导牌面能量，建议一个具体的仪式、冥想或正念练习。包括与牌阵能量匹配的水晶、颜色或元素推荐。3-4句话。

## 📝 肯定语与结语
基于牌面象征制作2-3条个性化肯定语。以简短、充满力量的结语收尾，尊重问卓者的旅程。`;

      const userPrompt = isEn
        ? `Reading Category: ${typeLabels[questionType]}
User's Question: ${questionText}

${structuredPrompt}

Please provide a professional, in-depth tarot interpretation based on the above cards and positions.`
        : `解读类别：${typeLabels[questionType]}
用户问题：${questionText}

${structuredPrompt}

请基于以上牌面和牌位，提供专业、深入的塔罗解读。`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const tarotContent = response.choices[0]?.message?.content;
      const reading = typeof tarotContent === "string" ? tarotContent : (isEn ? "Reading generation failed, please try again" : "解读生成失败，请重试");

      // Prepare structured card data for storage
      const cardData = resolvedDrawn.map(d => ({
        cardId: d.card.id,
        name: d.card.name,
        nameChinese: d.card.nameChinese,
        isReversed: d.isReversed,
        position: d.position.name,
        positionChinese: d.position.nameChinese,
        meaningUsed: d.isReversed ? d.card.meaningReversed : d.card.meaningUpright,
        meaningUsedChinese: d.isReversed ? d.card.meaningReversedChinese : d.card.meaningUprightChinese,
        arcana: d.card.arcana,
        suit: d.card.suit,
        element: d.card.element,
        keywords: d.card.keywords,
        keywordsChinese: d.card.keywordsChinese,
      }));

      // Save to database
      const db = await getDb();
      if (db) {
        const insertData: Record<string, unknown> = {
          sessionId: nanoid(),
          questionType,
          question: question || null,
          cards: cardData,
          basicReading: reading,
          isPaid: false,
        };
        if (ctx.user?.id) insertData.userId = ctx.user.id;
        await db.insert(tarotReadings).values(insertData as typeof tarotReadings.$inferInsert);
      }

      return {
        reading,
        cards: cardData,
        spread: {
          id: spread.id,
          name: spread.name,
          nameChinese: spread.nameChinese,
        },
      };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const readings = await db
      .select()
      .from(tarotReadings)
      .where(eq(tarotReadings.userId, ctx.user.id))
      .orderBy(desc(tarotReadings.createdAt))
      .limit(20);
    return readings;
  }),
});
