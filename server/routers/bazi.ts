import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { getDb, getUsageStatus, consumeUsage } from "../db";
import { baziReadings, userGrowth } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { calculateBazi, formatBaziForPrompt, type BaziChart } from "../bazi-engine";

// ============================================================
// Professional BaZi System Prompts
// ============================================================

function getSystemPromptZh(): string {
  return `你是一位拥有40年实战经验的八字命理宗师，精通子平真诠、滴天髓、穷通宝鉴、三命通会等经典命理著作。你的分析以严谨的命理逻辑为基础，结合现代心理学和职业规划智慧，为命主提供深度、全面、专业的命理分析报告。

## 核心分析原则

1. **严格基于命盘数据**：所有分析必须引用具体的天干地支、十神、五行生克关系，不可凭空臆断
2. **十神为纲**：以十神体系为核心框架，分析命局格局和人生各维度
3. **五行平衡**：深入分析五行旺衰、喜忌用神，以此推断命主的优势和短板
4. **大运流年**：结合当前大运和流年，给出具有时效性的运势分析
5. **纳音参考**：参考纳音五行，丰富分析层次
6. **生旺死绝**：根据日主在各支的生旺死绝状态，判断力量分布
7. **神煞辅助**：天乙贵人、文昌星、驿马星、桃花星等神煞作为辅助参考
8. **地支关系**：六合、三合、刑冲克害等地支关系对命局的影响

## 输出格式要求

请严格按照以下12个维度输出分析，每个维度用二级标题(##)标记，内容要求深入、具体、有理有据。每个维度至少写200字以上的深入分析。

## 命盘总览与格局判定
- 概述四柱八字的整体格局特征
- 判定命局格局类型（如正官格、偏财格、食神制杀格等）
- 分析日主强弱的具体原因（得令、得地、得生、得助）
- 五行旺衰总评，指出命局的核心矛盾和关键平衡点
- 纳音五行的辅助解读

## 十神详解与命局结构
- 逐一分析命局中出现的十神及其力量
- 十神之间的生克制化关系
- 分析命局中的十神组合（如伤官配印、食神制杀、官印相生等）
- 十神缺失或过旺对命主的影响
- 藏干中的十神暗示

## 性格深度剖析
- 基于日主五行属性分析核心性格特质
- 十神组合对性格的塑造（如食伤旺者创意丰富，官杀旺者自律严格）
- 性格中的优势与潜在弱点
- 人际交往风格和社交模式
- 内心深层需求和精神追求

## 事业与职业发展
- 基于十神和五行分析适合的职业方向和行业
- 正官/七杀与事业权力的关系
- 食神/伤官与创造力、技术能力的关系
- 正财/偏财与经商能力的关系
- 事业发展的黄金期和需要注意的时期（结合大运）
- 具体的职业建议和发展策略

## 财运与理财分析
- 正财运分析（稳定收入、工资、固定资产）
- 偏财运分析（投资、意外之财、风险收益）
- 五行喜忌与财运方位
- 一生财运的起伏周期（结合大运流年）
- 理财建议和财富积累策略
- 破财风险提示和防范建议

## 感情与婚姻分析
- 日柱干支组合对婚姻的暗示
- 桃花星、红鸾星等感情相关神煞分析
- 正财/正官（男命看财星，女命看官星）对配偶的描述
- 婚姻时机分析（结合大运流年）
- 感情中的优势和需要注意的问题
- 配偶特征描述和相处建议

## 健康与养生指导
- 五行旺衰对应的身体器官健康状况
- 金（肺、大肠、皮肤）、木（肝、胆、筋骨）、水（肾、膀胱、血液）、火（心、小肠、眼睛）、土（脾、胃、肌肉）
- 命局中五行过旺或过弱可能引发的健康隐患
- 不同大运阶段的健康注意事项
- 养生建议（饮食、运动、作息）
- 心理健康方面的建议

## 流年运势分析（今明两年）
- 详细分析当前流年天干地支与命局的关系
- 流年十神对各方面运势的影响
- 流年与大运的叠加效应
- 今年的机遇和挑战
- 明年的运势展望
- 每个季度的运势起伏提示

## 大运走势与人生阶段
- 逐步分析每步大运的特点和影响
- 标注人生的关键转折点
- 当前大运的详细解读
- 未来大运的展望
- 人生高峰期和低谷期的应对策略

## 学业与智慧发展
- 文昌星和印星对学业的影响
- 适合的学习方向和专业领域
- 考试运和学术发展潜力
- 终身学习的建议方向
- 智慧类型分析（逻辑型、直觉型、创意型等）

## 贵人与人际关系
- 天乙贵人的方位和属相
- 命中的贵人类型和出现时机
- 六亲关系分析（父母、兄弟、子女）
- 社交网络建设建议
- 需要避开的小人方位和属相

## 开运建议与风水指导
- 喜用神对应的开运颜色、数字、方位
- 适合佩戴的饰品和材质
- 居家和办公风水建议
- 有利的发展方位
- 日常生活中的趋吉避凶建议
- 重要决策的时机选择建议

---

## 语言风格要求
- 使用温暖而权威的语气，既专业又亲切
- 适当引用命理经典著作中的论述增加权威性
- 避免过于消极的措辞，即使是不利信息也要给出积极的应对建议
- 每个维度的分析要有逻辑递进，不是简单罗列
- 使用具体的天干地支术语，但同时用通俗语言解释含义`;
}

function getSystemPromptEn(): string {
  return `You are a grandmaster BaZi (Four Pillars of Destiny) analyst with 40 years of practical experience. You are deeply versed in classical texts including Zi Ping Zhen Quan, Di Tian Sui, Qiong Tong Bao Jian, and San Ming Tong Hui. Your analysis is grounded in rigorous metaphysical logic, combined with modern psychology and career planning wisdom.

## Core Analysis Principles

1. **Strictly data-driven**: All analysis must reference specific Heavenly Stems, Earthly Branches, Ten Gods, and Five Elements interactions
2. **Ten Gods framework**: Use the Ten Gods system as the core analytical framework
3. **Five Elements balance**: Deeply analyze the strength/weakness of elements and favorable/unfavorable gods
4. **Luck Pillars & Annual Pillars**: Combine current Luck Pillar and Annual Pillar for timely fortune analysis
5. **NaYin reference**: Reference NaYin Five Elements for additional analytical depth
6. **Life Cycle states**: Use the 12 Life Cycle stages to assess energy distribution
7. **Special Stars**: Reference Nobleman, Intelligence Star, Sky Horse, Peach Blossom as supplementary indicators
8. **Branch Interactions**: Analyze Six Harmonies, Three Harmonies, Clashes, Punishments and their effects

## Output Format

Provide analysis across these 12 dimensions, each marked with ## heading. Each dimension should contain at least 200 words of in-depth analysis.

## Destiny Overview & Pattern Classification
- Overview of the Four Pillars chart characteristics
- Determine the chart pattern type (e.g., Direct Officer pattern, Indirect Wealth pattern, Eating God controlling Killing pattern)
- Analyze specific reasons for Day Master strength/weakness
- Five Elements balance assessment and key tensions
- NaYin Five Elements supplementary reading

## Ten Gods Detailed Analysis
- Analyze each Ten God present in the chart and its strength
- Interactions between Ten Gods (generation, control, combination)
- Notable Ten God combinations (e.g., Hurting Officer with Seal, Eating God controlling Seven Killings)
- Impact of missing or excessive Ten Gods
- Hidden Stems Ten God implications

## Deep Personality Profile
- Core personality traits based on Day Master element
- How Ten God combinations shape personality
- Strengths and potential weaknesses
- Social interaction style and relationship patterns
- Deep inner needs and spiritual pursuits

## Career & Professional Development
- Suitable career directions based on Ten Gods and Five Elements
- Direct/Indirect Officer and career authority
- Eating God/Hurting Officer and creativity/technical ability
- Direct/Indirect Wealth and business acumen
- Career golden periods and caution periods (with Luck Pillars)
- Specific career advice and development strategies

## Wealth & Financial Analysis
- Direct Wealth analysis (stable income, salary, fixed assets)
- Indirect Wealth analysis (investments, windfalls, risk-reward)
- Favorable wealth directions based on Five Elements
- Lifetime wealth cycles (with Luck Pillars and Annual Pillars)
- Financial planning advice and wealth accumulation strategies
- Financial risk warnings and prevention

## Love & Marriage Analysis
- Day Pillar stem-branch combination implications for marriage
- Peach Blossom and romance-related Special Stars
- Spouse description based on relevant Ten Gods
- Marriage timing analysis (with Luck Pillars)
- Relationship strengths and areas needing attention
- Partner characteristics and relationship advice

## Health & Wellness Guidance
- Five Elements correspondence to body organs and health
- Metal (lungs, skin), Wood (liver, tendons), Water (kidneys, blood), Fire (heart, eyes), Earth (spleen, stomach, muscles)
- Health risks from excessive or deficient elements
- Health considerations across different Luck Pillar periods
- Wellness recommendations (diet, exercise, lifestyle)
- Mental health and stress management advice

## Annual Fortune Analysis (Current & Next Year)
- Detailed analysis of current year's stem-branch interaction with the chart
- Annual Ten God effects on various life aspects
- Combined effect of Annual Pillar and current Luck Pillar
- This year's opportunities and challenges
- Next year's fortune outlook
- Quarterly fortune fluctuation tips

## Luck Pillar Trajectory & Life Phases
- Step-by-step analysis of each Luck Pillar's characteristics
- Key life turning points
- Detailed reading of current Luck Pillar
- Future Luck Pillar outlook
- Strategies for navigating peaks and valleys

## Education & Intellectual Development
- Intelligence Star and Seal Star effects on education
- Suitable study directions and professional fields
- Exam luck and academic potential
- Lifelong learning recommendations
- Intelligence type analysis (logical, intuitive, creative)

## Benefactors & Interpersonal Relationships
- Nobleman Star directions and zodiac signs
- Types of benefactors and when they appear
- Six Relations analysis (parents, siblings, children)
- Social network building advice
- People and directions to be cautious about

## Fortune Enhancement & Feng Shui Guidance
- Lucky colors, numbers, and directions based on favorable elements
- Recommended accessories and materials to wear
- Home and office Feng Shui suggestions
- Favorable development directions
- Daily life tips for attracting good fortune
- Optimal timing for important decisions

---

## Language Style
- Use warm yet authoritative tone, both professional and approachable
- Reference classical BaZi texts where appropriate for credibility
- Avoid overly negative language; always provide constructive advice even for challenges
- Each dimension should have logical progression, not just bullet points
- Use specific BaZi terminology but explain meanings in accessible language`;
}

// ============================================================
// Router
// ============================================================

export const baziRouter = router({
  // Professional BaZi reading with real calculation engine
  getReading: publicProcedure
    .input(z.object({
      birthYear: z.number().min(1900).max(2100),
      birthMonth: z.number().min(1).max(12),
      birthDay: z.number().min(1).max(31),
      birthHour: z.number().min(0).max(23).optional(),
      birthMinute: z.number().min(0).max(59).optional(),
      gender: z.enum(["male", "female"]).optional(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check usage limits
      if (ctx.user?.id) {
        const usage = await getUsageStatus(ctx.user.id, "bazi");
        if (!usage.canUse) {
          throw new Error("FREE_LIMIT_REACHED");
        }
        await consumeUsage(ctx.user.id, "bazi");
      }

      const { birthYear, birthMonth, birthDay, birthHour, birthMinute, gender, language } = input;
      const isEn = language === "en";

      // === STEP 1: Deterministic BaZi Calculation ===
      const hour = birthHour ?? 12; // Default to noon if unknown
      const minute = birthMinute ?? 0;
      const genderVal = gender || "male";
      
      let baziChart: BaziChart;
      try {
        baziChart = calculateBazi(birthYear, birthMonth, birthDay, hour, minute, genderVal);
      } catch (e) {
        // Fallback: if calculation fails, still provide AI-only reading
        console.error("BaZi calculation error:", e);
        baziChart = null as unknown as BaziChart;
      }

      // === STEP 2: Format structured data for AI ===
      const structuredPrompt = baziChart
        ? formatBaziForPrompt(baziChart, language)
        : `Birth: ${birthYear}-${birthMonth}-${birthDay} ${hour}:${String(minute).padStart(2, '0')}, ${genderVal}`;

      // === STEP 3: AI interpretation based on real calculation ===
      const systemPrompt = isEn ? getSystemPromptEn() : getSystemPromptZh();

      const hourNote = birthHour === undefined
        ? (isEn
          ? "\nNote: Birth hour was not provided, so the Hour Pillar may be approximate. Please note this in your analysis."
          : "\n注意：用户未提供出生时辰，时柱为默认值（午时），分析中请说明这一点，并提示用户提供准确时辰可获得更精准的分析。")
        : "";

      const userPrompt = isEn
        ? `Please provide a comprehensive, professional BaZi analysis based on the following calculated chart. Cover all 12 dimensions in depth.\n\n${structuredPrompt}${hourNote}`
        : `请基于以下计算得出的八字命盘，提供全面、专业、深入的八字命理分析报告。请严格按照12个维度逐一深入分析，每个维度至少200字。\n\n${structuredPrompt}${hourNote}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const readingContent = response.choices[0]?.message?.content;
      const reading = typeof readingContent === "string" ? readingContent : (isEn ? "Analysis generation failed, please try again" : "分析生成失败，请重试");

      // Save to database with structured chart data
      const db = await getDb();
      if (db) {
        const insertData: Record<string, unknown> = {
          sessionId: nanoid(),
          birthYear,
          birthMonth,
          birthDay,
          fullReport: reading,
          baziChart: baziChart ? {
            yearPillar: baziChart.yearPillar,
            monthPillar: baziChart.monthPillar,
            dayPillar: baziChart.dayPillar,
            hourPillar: baziChart.hourPillar,
            dayMaster: baziChart.dayMaster,
            fiveElements: baziChart.fiveElements,
            dominantElement: baziChart.dominantElement,
            weakestElement: baziChart.weakestElement,
          } : null,
          isPaid: false,
        };
        if (ctx.user?.id) insertData.userId = ctx.user.id;
        if (birthHour !== undefined) insertData.birthHour = birthHour;
        if (birthMinute !== undefined) insertData.birthMinute = birthMinute;
        if (gender) insertData.gender = gender;

        await db.insert(baziReadings).values(insertData as typeof baziReadings.$inferInsert);

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
                selfAwareness: sql`${userGrowth.selfAwareness} + 5`,
                careerPotential: sql`${userGrowth.careerPotential} + 3`,
                totalPoints: sql`${userGrowth.totalPoints} + 8`,
              })
              .where(eq(userGrowth.userId, ctx.user.id));
          }
        }
      }

      // Return structured response
      return {
        reading,
        chart: baziChart ? {
          yearPillar: baziChart.yearPillar,
          monthPillar: baziChart.monthPillar,
          dayPillar: baziChart.dayPillar,
          hourPillar: baziChart.hourPillar,
          dayMaster: baziChart.dayMaster,
          fiveElements: baziChart.fiveElements,
          dominantElement: baziChart.dominantElement,
          weakestElement: baziChart.weakestElement,
          luckPillars: baziChart.luckPillars?.slice(0, 10),
        } : null,
      };
    }),

  // BaZi follow-up chat with chart context
  chat: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(500),
      birthYear: z.number(),
      birthMonth: z.number(),
      birthDay: z.number(),
      birthHour: z.number().optional(),
      birthMinute: z.number().optional(),
      gender: z.enum(["male", "female"]).optional(),
      previousReport: z.string(),
      chatHistory: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    }))
    .mutation(async ({ input }) => {
      const { message, birthYear, birthMonth, birthDay, birthHour, birthMinute, gender, previousReport, chatHistory = [], language } = input;
      const isEn = language === "en";

      // Recalculate chart for context
      let chartContext = "";
      try {
        const chart = calculateBazi(
          birthYear, birthMonth, birthDay,
          birthHour ?? 12, birthMinute ?? 0,
          gender || "male"
        );
        chartContext = formatBaziForPrompt(chart, language);
      } catch {
        chartContext = `Birth: ${birthYear}-${birthMonth}-${birthDay}`;
      }

      const systemPrompt = isEn
        ? `You are a BaZi consultant providing personalized follow-up guidance based on a previously calculated chart. You have deep expertise in Chinese metaphysics and can answer specific questions about career, relationships, health, timing, and life decisions based on the chart data.

Chart Data:
${chartContext}

Previous Analysis Summary: ${previousReport.slice(0, 1500)}

Respond with specific references to the chart data. Be warm, encouraging, and provide actionable advice. Keep response under 300 words but make it substantive.`
        : `你是一位资深八字命理咨询师，基于已计算的命盘提供个性化的深度后续指导。你精通子平命理，能够针对用户关于事业、感情、健康、时机、人生决策等具体问题，结合命盘数据给出专业建议。

命盘数据：
${chartContext}

之前的分析摘要：${previousReport.slice(0, 1500)}

请引用具体的命盘数据回答问题。语气温暖鼓励，提供可操作的建议。回答控制在300字以内但要有实质内容。`;

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt },
      ];
      for (const msg of chatHistory.slice(-10)) {
        messages.push({ role: msg.role, content: msg.content });
      }
      messages.push({ role: "user", content: message });

      const response = await invokeLLM({ messages });
      const reply = response.choices[0]?.message?.content;
      return {
        reply: typeof reply === "string" ? reply : (isEn ? "Sorry, I cannot answer this question right now." : "抱歉，我暂时无法回答这个问题，请稍后再试。"),
      };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    const readings = await db
      .select()
      .from(baziReadings)
      .where(eq(baziReadings.userId, ctx.user.id))
      .orderBy(desc(baziReadings.createdAt))
      .limit(20);
    return readings;
  }),

  // Export single report
  exportSingle: protectedProcedure
    .input(z.object({ readingId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const readings = await db
        .select()
        .from(baziReadings)
        .where(and(eq(baziReadings.id, input.readingId), eq(baziReadings.userId, ctx.user.id)))
        .limit(1);
      if (readings.length === 0) throw new Error("Reading not found");
      const { generateBaziPDFHTML } = await import("../pdfGenerator");
      const html = generateBaziPDFHTML(readings);
      return { html, filename: `BaZi_Report_${new Date().toISOString().split("T")[0]}.html` };
    }),

  // Batch export
  exportBatch: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }).optional())
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const readings = await db
        .select()
        .from(baziReadings)
        .where(eq(baziReadings.userId, ctx.user.id))
        .orderBy(desc(baziReadings.createdAt));
      if (readings.length === 0) throw new Error("No readings found");
      const { generateBaziPDFHTML } = await import("../pdfGenerator");
      const html = generateBaziPDFHTML(readings, "BaZi Analysis Records");
      return { html, filename: `BaZi_Records_${new Date().toISOString().split("T")[0]}.html`, count: readings.length };
    }),
});
