import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { compatibilityReports, userGrowth } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

// ============================================================
// Zodiac Compatibility Engine
// ============================================================

interface ZodiacMeta {
  id: string;
  name: string;
  nameChinese: string;
  symbol: string;
  element: string;
  elementChinese: string;
  modality: string;
  modalityChinese: string;
  rulingPlanet: string;
  rulingPlanetChinese: string;
  polarity: string;
  polarityChinese: string;
  loveStyle: string;
  loveStyleChinese: string;
  communicationStyle: string;
  communicationStyleChinese: string;
  conflictStyle: string;
  conflictStyleChinese: string;
  attachmentTendency: string;
  attachmentTendencyChinese: string;
  coreNeed: string;
  coreNeedChinese: string;
}

const ZODIAC_META: ZodiacMeta[] = [
  {
    id: "aries", name: "Aries", nameChinese: "白羊座", symbol: "♈",
    element: "Fire", elementChinese: "火", modality: "Cardinal", modalityChinese: "开创",
    rulingPlanet: "Mars", rulingPlanetChinese: "火星",
    polarity: "Masculine/Yang", polarityChinese: "阳性",
    loveStyle: "Passionate, direct, initiating, conquering", loveStyleChinese: "热情、直接、主动出击、征服型",
    communicationStyle: "Blunt, energetic, action-oriented", communicationStyleChinese: "直率、充满活力、行动导向",
    conflictStyle: "Confrontational, quick to anger but quick to forgive", conflictStyleChinese: "正面冲突、易怒但也易消气",
    attachmentTendency: "Anxious-avoidant, needs excitement", attachmentTendencyChinese: "焦虑-回避型，需要刺激感",
    coreNeed: "Freedom and admiration", coreNeedChinese: "自由与被崇拜",
  },
  {
    id: "taurus", name: "Taurus", nameChinese: "金牛座", symbol: "♉",
    element: "Earth", elementChinese: "土", modality: "Fixed", modalityChinese: "固定",
    rulingPlanet: "Venus", rulingPlanetChinese: "金星",
    polarity: "Feminine/Yin", polarityChinese: "阴性",
    loveStyle: "Sensual, devoted, slow-building, possessive", loveStyleChinese: "感官型、忠诚、慢热、占有欲强",
    communicationStyle: "Calm, deliberate, practical", communicationStyleChinese: "沉稳、深思熟虑、务实",
    conflictStyle: "Avoidant until pushed, then stubborn and immovable", conflictStyleChinese: "回避直到被逼急，然后固执不动摇",
    attachmentTendency: "Secure but possessive", attachmentTendencyChinese: "安全型但占有欲强",
    coreNeed: "Security and sensory comfort", coreNeedChinese: "安全感与感官舒适",
  },
  {
    id: "gemini", name: "Gemini", nameChinese: "双子座", symbol: "♊",
    element: "Air", elementChinese: "风", modality: "Mutable", modalityChinese: "变动",
    rulingPlanet: "Mercury", rulingPlanetChinese: "水星",
    polarity: "Masculine/Yang", polarityChinese: "阳性",
    loveStyle: "Playful, intellectual, flirtatious, variety-seeking", loveStyleChinese: "俏皮、智性、善于调情、追求多样性",
    communicationStyle: "Witty, fast-paced, curious, multi-topic", communicationStyleChinese: "机智、节奏快、好奇、多话题",
    conflictStyle: "Deflects with humor, intellectualizes emotions", conflictStyleChinese: "用幽默转移、将情感理智化",
    attachmentTendency: "Avoidant, fears being trapped", attachmentTendencyChinese: "回避型，害怕被束缚",
    coreNeed: "Mental stimulation and variety", coreNeedChinese: "精神刺激与多样性",
  },
  {
    id: "cancer", name: "Cancer", nameChinese: "巨蟹座", symbol: "♋",
    element: "Water", elementChinese: "水", modality: "Cardinal", modalityChinese: "开创",
    rulingPlanet: "Moon", rulingPlanetChinese: "月亮",
    polarity: "Feminine/Yin", polarityChinese: "阴性",
    loveStyle: "Nurturing, protective, emotionally deep, family-oriented", loveStyleChinese: "滋养型、保护欲强、情感深沉、家庭导向",
    communicationStyle: "Emotional, intuitive, indirect, empathetic", communicationStyleChinese: "情感化、直觉型、间接、有共情力",
    conflictStyle: "Retreats into shell, passive-aggressive, holds grudges", conflictStyleChinese: "退缩到壳中、被动攻击、记仇",
    attachmentTendency: "Anxious, needs constant reassurance", attachmentTendencyChinese: "焦虑型，需要持续的安全感确认",
    coreNeed: "Emotional security and belonging", coreNeedChinese: "情感安全感与归属感",
  },
  {
    id: "leo", name: "Leo", nameChinese: "狮子座", symbol: "♌",
    element: "Fire", elementChinese: "火", modality: "Fixed", modalityChinese: "固定",
    rulingPlanet: "Sun", rulingPlanetChinese: "太阳",
    polarity: "Masculine/Yang", polarityChinese: "阳性",
    loveStyle: "Generous, dramatic, loyal, attention-seeking", loveStyleChinese: "慷慨、戏剧化、忠诚、渴望关注",
    communicationStyle: "Warm, expressive, storytelling, commanding", communicationStyleChinese: "温暖、表达力强、善于讲故事、有号召力",
    conflictStyle: "Dramatic, needs to feel respected, ego-driven", conflictStyleChinese: "戏剧化、需要被尊重、自尊驱动",
    attachmentTendency: "Secure when admired, anxious when ignored", attachmentTendencyChinese: "被崇拜时安全，被忽视时焦虑",
    coreNeed: "Recognition and creative expression", coreNeedChinese: "被认可与创造性表达",
  },
  {
    id: "virgo", name: "Virgo", nameChinese: "处女座", symbol: "♍",
    element: "Earth", elementChinese: "土", modality: "Mutable", modalityChinese: "变动",
    rulingPlanet: "Mercury", rulingPlanetChinese: "水星",
    polarity: "Feminine/Yin", polarityChinese: "阴性",
    loveStyle: "Service-oriented, attentive to detail, practical care", loveStyleChinese: "服务型、注重细节、实际关怀",
    communicationStyle: "Precise, analytical, helpful, sometimes critical", communicationStyleChinese: "精确、分析型、乐于助人、有时挑剔",
    conflictStyle: "Criticizes details, worries excessively, internalizes", conflictStyleChinese: "挑剔细节、过度担忧、内化情绪",
    attachmentTendency: "Anxious, shows love through acts of service", attachmentTendencyChinese: "焦虑型，通过服务行为表达爱",
    coreNeed: "Order, usefulness, and being needed", coreNeedChinese: "秩序、有用感与被需要",
  },
  {
    id: "libra", name: "Libra", nameChinese: "天秤座", symbol: "♎",
    element: "Air", elementChinese: "风", modality: "Cardinal", modalityChinese: "开创",
    rulingPlanet: "Venus", rulingPlanetChinese: "金星",
    polarity: "Masculine/Yang", polarityChinese: "阳性",
    loveStyle: "Romantic, partnership-focused, harmonious, idealistic", loveStyleChinese: "浪漫、以伴侣关系为中心、和谐、理想主义",
    communicationStyle: "Diplomatic, charming, balanced, people-pleasing", communicationStyleChinese: "外交型、有魅力、平衡、讨好型",
    conflictStyle: "Avoids confrontation, seeks compromise, passive", conflictStyleChinese: "回避冲突、寻求妥协、被动",
    attachmentTendency: "Anxious, defines self through relationships", attachmentTendencyChinese: "焦虑型，通过关系定义自我",
    coreNeed: "Harmony and partnership", coreNeedChinese: "和谐与伴侣关系",
  },
  {
    id: "scorpio", name: "Scorpio", nameChinese: "天蝎座", symbol: "♏",
    element: "Water", elementChinese: "水", modality: "Fixed", modalityChinese: "固定",
    rulingPlanet: "Pluto/Mars", rulingPlanetChinese: "冥王星/火星",
    polarity: "Feminine/Yin", polarityChinese: "阴性",
    loveStyle: "Intense, all-or-nothing, transformative, possessive", loveStyleChinese: "强烈、全情投入、变革性、占有欲强",
    communicationStyle: "Probing, secretive, strategic, emotionally intense", communicationStyleChinese: "探究型、神秘、有策略、情感强烈",
    conflictStyle: "Strategic, vindictive, tests loyalty, power struggles", conflictStyleChinese: "策略型、报复性、考验忠诚、权力斗争",
    attachmentTendency: "Fearful-avoidant, craves deep intimacy but fears betrayal", attachmentTendencyChinese: "恐惧-回避型，渴望深度亲密但害怕背叛",
    coreNeed: "Deep emotional truth and trust", coreNeedChinese: "深层情感真相与信任",
  },
  {
    id: "sagittarius", name: "Sagittarius", nameChinese: "射手座", symbol: "♐",
    element: "Fire", elementChinese: "火", modality: "Mutable", modalityChinese: "变动",
    rulingPlanet: "Jupiter", rulingPlanetChinese: "木星",
    polarity: "Masculine/Yang", polarityChinese: "阳性",
    loveStyle: "Adventurous, freedom-loving, philosophical, commitment-wary", loveStyleChinese: "冒险型、热爱自由、哲学性、对承诺谨慎",
    communicationStyle: "Honest, enthusiastic, philosophical, blunt", communicationStyleChinese: "诚实、热情、哲学性、直言不讳",
    conflictStyle: "Escapes, uses humor, becomes preachy", conflictStyleChinese: "逃避、用幽默化解、变得说教",
    attachmentTendency: "Avoidant, needs space and adventure", attachmentTendencyChinese: "回避型，需要空间和冒险",
    coreNeed: "Freedom and meaning", coreNeedChinese: "自由与意义",
  },
  {
    id: "capricorn", name: "Capricorn", nameChinese: "摩羯座", symbol: "♑",
    element: "Earth", elementChinese: "土", modality: "Cardinal", modalityChinese: "开创",
    rulingPlanet: "Saturn", rulingPlanetChinese: "土星",
    polarity: "Feminine/Yin", polarityChinese: "阴性",
    loveStyle: "Traditional, ambitious, provider, slow to open up", loveStyleChinese: "传统型、有野心、供养者、慢热",
    communicationStyle: "Reserved, practical, goal-oriented, authoritative", communicationStyleChinese: "内敛、务实、目标导向、有权威感",
    conflictStyle: "Cold withdrawal, uses logic, emotionally distant", conflictStyleChinese: "冷淡退缩、用逻辑、情感疏离",
    attachmentTendency: "Avoidant, shows love through providing", attachmentTendencyChinese: "回避型，通过供养表达爱",
    coreNeed: "Achievement and respect", coreNeedChinese: "成就与尊重",
  },
  {
    id: "aquarius", name: "Aquarius", nameChinese: "水瓶座", symbol: "♒",
    element: "Air", elementChinese: "风", modality: "Fixed", modalityChinese: "固定",
    rulingPlanet: "Uranus/Saturn", rulingPlanetChinese: "天王星/土星",
    polarity: "Masculine/Yang", polarityChinese: "阳性",
    loveStyle: "Unconventional, friendship-based, intellectual, detached", loveStyleChinese: "非传统、以友谊为基础、智性、超然",
    communicationStyle: "Innovative, abstract, humanitarian, sometimes aloof", communicationStyleChinese: "创新、抽象、人道主义、有时冷漠",
    conflictStyle: "Intellectualizes, detaches emotionally, stubborn in beliefs", conflictStyleChinese: "理智化、情感抽离、信念固执",
    attachmentTendency: "Avoidant, values independence above all", attachmentTendencyChinese: "回避型，独立性高于一切",
    coreNeed: "Intellectual freedom and humanitarian purpose", coreNeedChinese: "思想自由与人道主义使命",
  },
  {
    id: "pisces", name: "Pisces", nameChinese: "双鱼座", symbol: "♓",
    element: "Water", elementChinese: "水", modality: "Mutable", modalityChinese: "变动",
    rulingPlanet: "Neptune/Jupiter", rulingPlanetChinese: "海王星/木星",
    polarity: "Feminine/Yin", polarityChinese: "阴性",
    loveStyle: "Dreamy, self-sacrificing, empathic, boundary-less", loveStyleChinese: "梦幻、自我牺牲、共情、无边界感",
    communicationStyle: "Intuitive, poetic, evasive, emotionally absorbing", communicationStyleChinese: "直觉型、诗意、回避性、情感吸收型",
    conflictStyle: "Avoids, plays victim, escapes into fantasy", conflictStyleChinese: "回避、扮演受害者、逃入幻想",
    attachmentTendency: "Anxious, merges with partner, loses self", attachmentTendencyChinese: "焦虑型，与伴侣融合、失去自我",
    coreNeed: "Spiritual connection and unconditional love", coreNeedChinese: "灵性连接与无条件的爱",
  },
];

function getZodiacMeta(id: string): ZodiacMeta | undefined {
  return ZODIAC_META.find(s => s.id === id);
}

// ============================================================
// Element Compatibility Matrix
// ============================================================

type Element = "Fire" | "Earth" | "Air" | "Water";

const ELEMENT_COMPATIBILITY: Record<Element, Record<Element, { score: number; dynamic: string; dynamicChinese: string }>> = {
  Fire: {
    Fire: { score: 80, dynamic: "Passionate and exciting but can burn out without grounding", dynamicChinese: "激情四射但缺乏稳定可能燃尽" },
    Earth: { score: 55, dynamic: "Fire inspires, Earth stabilizes — needs patience", dynamicChinese: "火激励，土稳定——需要耐心" },
    Air: { score: 90, dynamic: "Air fans Fire's flames — intellectually and passionately stimulating", dynamicChinese: "风助火势——智性与激情的双重刺激" },
    Water: { score: 45, dynamic: "Steam or extinguished — intense but emotionally challenging", dynamicChinese: "蒸汽或熄灭——强烈但情感上充满挑战" },
  },
  Earth: {
    Fire: { score: 55, dynamic: "Grounding meets passion — complementary if respectful", dynamicChinese: "稳定遇上激情——互相尊重则互补" },
    Earth: { score: 85, dynamic: "Stable and reliable but may lack excitement", dynamicChinese: "稳定可靠但可能缺乏激情" },
    Air: { score: 50, dynamic: "Different wavelengths — Earth is practical, Air is theoretical", dynamicChinese: "不同频率——土务实，风理论" },
    Water: { score: 88, dynamic: "Nurturing and fertile — emotionally and materially supportive", dynamicChinese: "滋养与丰饶——情感和物质上互相支持" },
  },
  Air: {
    Fire: { score: 90, dynamic: "Exciting and dynamic — ideas meet action", dynamicChinese: "激动人心——思想遇上行动" },
    Earth: { score: 50, dynamic: "Head vs hands — can learn from each other", dynamicChinese: "头脑vs双手——可以互相学习" },
    Air: { score: 75, dynamic: "Intellectually stimulating but may lack emotional depth", dynamicChinese: "智性刺激但可能缺乏情感深度" },
    Water: { score: 55, dynamic: "Mist — beautiful but confusing, logic meets emotion", dynamicChinese: "薄雾——美丽但困惑，逻辑遇上情感" },
  },
  Water: {
    Fire: { score: 45, dynamic: "Intense chemistry but fundamental tension", dynamicChinese: "强烈化学反应但根本性张力" },
    Earth: { score: 88, dynamic: "Deep roots — emotionally rich and stable", dynamicChinese: "深根——情感丰富且稳定" },
    Air: { score: 55, dynamic: "Waves and wind — stimulating but turbulent", dynamicChinese: "波浪与风——刺激但动荡" },
    Water: { score: 82, dynamic: "Oceanic depth — profoundly empathic but may drown in emotion", dynamicChinese: "海洋般深邃——深度共情但可能溺于情感" },
  },
};

// Modality compatibility
const MODALITY_COMPATIBILITY: Record<string, Record<string, { score: number; dynamic: string; dynamicChinese: string }>> = {
  Cardinal: {
    Cardinal: { score: 65, dynamic: "Both want to lead — power struggles likely", dynamicChinese: "都想领导——权力斗争在所难免" },
    Fixed: { score: 75, dynamic: "Initiator meets sustainer — complementary if flexible", dynamicChinese: "发起者遇上坚守者——灵活则互补" },
    Mutable: { score: 80, dynamic: "Leader meets adapter — smooth dynamic", dynamicChinese: "领导者遇上适应者——顺畅的动态" },
  },
  Fixed: {
    Cardinal: { score: 75, dynamic: "Stability meets initiative — balanced partnership", dynamicChinese: "稳定遇上主动——平衡的伙伴关系" },
    Fixed: { score: 60, dynamic: "Immovable meets immovable — deep loyalty but stubborn standoffs", dynamicChinese: "不可动摇遇上不可动摇——深度忠诚但固执对峙" },
    Mutable: { score: 78, dynamic: "Anchor meets flow — grounding and adaptable", dynamicChinese: "锚遇上流水——扎根且灵活" },
  },
  Mutable: {
    Cardinal: { score: 80, dynamic: "Flexible support for the leader — harmonious", dynamicChinese: "灵活支持领导者——和谐" },
    Fixed: { score: 78, dynamic: "Adaptability meets determination — balanced", dynamicChinese: "适应力遇上决心——平衡" },
    Mutable: { score: 70, dynamic: "Both flexible but may lack direction", dynamicChinese: "都灵活但可能缺乏方向" },
  },
};

// Polarity compatibility
function getPolarityScore(p1: string, p2: string): { score: number; dynamic: string; dynamicChinese: string } {
  if (p1 === p2) {
    return { score: 70, dynamic: "Same polarity — understanding but may lack spark", dynamicChinese: "相同极性——理解但可能缺乏火花" };
  }
  return { score: 85, dynamic: "Complementary polarities — magnetic attraction, yin-yang balance", dynamicChinese: "互补极性——磁性吸引，阴阳平衡" };
}

// Calculate overall compatibility
function calculateCompatibility(sign1: ZodiacMeta, sign2: ZodiacMeta) {
  const elementCompat = ELEMENT_COMPATIBILITY[sign1.element as Element][sign2.element as Element];
  const modalityCompat = MODALITY_COMPATIBILITY[sign1.modality][sign2.modality];
  const polarityCompat = getPolarityScore(sign1.polarity, sign2.polarity);

  // Weighted composite score
  const overallScore = Math.round(
    elementCompat.score * 0.40 +
    modalityCompat.score * 0.30 +
    polarityCompat.score * 0.30
  );

  return {
    overallScore,
    elementCompat,
    modalityCompat,
    polarityCompat,
  };
}

// Format compatibility data for LLM prompt
function formatCompatibilityForPrompt(
  sign1: ZodiacMeta,
  sign2: ZodiacMeta,
  compat: ReturnType<typeof calculateCompatibility>,
  language: string
): string {
  const isEn = language === "en";

  if (isEn) {
    return `=== Compatibility Analysis Data ===

--- Person A: ${sign1.name} (${sign1.symbol}) ---
Element: ${sign1.element} | Modality: ${sign1.modality} | Ruling Planet: ${sign1.rulingPlanet}
Polarity: ${sign1.polarity}
Love Style: ${sign1.loveStyle}
Communication Style: ${sign1.communicationStyle}
Conflict Style: ${sign1.conflictStyle}
Attachment Tendency: ${sign1.attachmentTendency}
Core Need: ${sign1.coreNeed}

--- Person B: ${sign2.name} (${sign2.symbol}) ---
Element: ${sign2.element} | Modality: ${sign2.modality} | Ruling Planet: ${sign2.rulingPlanet}
Polarity: ${sign2.polarity}
Love Style: ${sign2.loveStyle}
Communication Style: ${sign2.communicationStyle}
Conflict Style: ${sign2.conflictStyle}
Attachment Tendency: ${sign2.attachmentTendency}
Core Need: ${sign2.coreNeed}

--- Astrological Compatibility Metrics ---
Element Interaction (${sign1.element} × ${sign2.element}): Score ${compat.elementCompat.score}/100 — ${compat.elementCompat.dynamic}
Modality Interaction (${sign1.modality} × ${sign2.modality}): Score ${compat.modalityCompat.score}/100 — ${compat.modalityCompat.dynamic}
Polarity Interaction: Score ${compat.polarityCompat.score}/100 — ${compat.polarityCompat.dynamic}
Composite Score: ${compat.overallScore}/100`;
  }

  return `=== 兼容性分析数据 ===

--- 甲方：${sign1.nameChinese}（${sign1.symbol}）---
元素：${sign1.elementChinese} | 模式：${sign1.modalityChinese} | 守护星：${sign1.rulingPlanetChinese}
极性：${sign1.polarityChinese}
爱情风格：${sign1.loveStyleChinese}
沟通风格：${sign1.communicationStyleChinese}
冲突风格：${sign1.conflictStyleChinese}
依恋倾向：${sign1.attachmentTendencyChinese}
核心需求：${sign1.coreNeedChinese}

--- 乙方：${sign2.nameChinese}（${sign2.symbol}）---
元素：${sign2.elementChinese} | 模式：${sign2.modalityChinese} | 守护星：${sign2.rulingPlanetChinese}
极性：${sign2.polarityChinese}
爱情风格：${sign2.loveStyleChinese}
沟通风格：${sign2.communicationStyleChinese}
冲突风格：${sign2.conflictStyleChinese}
依恋倾向：${sign2.attachmentTendencyChinese}
核心需求：${sign2.coreNeedChinese}

--- 占星兼容性指标 ---
元素互动（${sign1.elementChinese} × ${sign2.elementChinese}）：${compat.elementCompat.score}/100 — ${compat.elementCompat.dynamicChinese}
模式互动（${sign1.modalityChinese} × ${sign2.modalityChinese}）：${compat.modalityCompat.score}/100 — ${compat.modalityCompat.dynamicChinese}
极性互动：${compat.polarityCompat.score}/100 — ${compat.polarityCompat.dynamicChinese}
综合评分：${compat.overallScore}/100`;
}

// ============================================================
// Compatibility Router
// ============================================================

export const compatibilityRouter = router({
  // Get all zodiac signs for selection
  getSigns: publicProcedure.query(() => {
    return ZODIAC_META.map(s => ({
      id: s.id,
      name: s.name,
      nameChinese: s.nameChinese,
      symbol: s.symbol,
      element: s.element,
      elementChinese: s.elementChinese,
    }));
  }),

  // Quick compatibility score (no LLM, instant)
  getQuickScore: publicProcedure
    .input(z.object({
      sign1: z.string(),
      sign2: z.string(),
    }))
    .query(({ input }) => {
      const meta1 = getZodiacMeta(input.sign1);
      const meta2 = getZodiacMeta(input.sign2);
      if (!meta1 || !meta2) throw new Error("Invalid zodiac sign");

      const compat = calculateCompatibility(meta1, meta2);
      return {
        overallScore: compat.overallScore,
        elementScore: compat.elementCompat.score,
        modalityScore: compat.modalityCompat.score,
        polarityScore: compat.polarityCompat.score,
        sign1: { name: meta1.name, nameChinese: meta1.nameChinese, symbol: meta1.symbol, element: meta1.element, elementChinese: meta1.elementChinese },
        sign2: { name: meta2.name, nameChinese: meta2.nameChinese, symbol: meta2.symbol, element: meta2.element, elementChinese: meta2.elementChinese },
      };
    }),

  // Full deep compatibility analysis (LLM)
  analyze: publicProcedure
    .input(z.object({
      person1Name: z.string().optional().default(""),
      person1Sign: z.string(),
      person2Name: z.string().optional().default(""),
      person2Sign: z.string(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    }))
    .mutation(async ({ input, ctx }) => {
      const { person1Name, person1Sign, person2Name, person2Sign, language } = input;
      const isEn = language === "en";

      const meta1 = getZodiacMeta(person1Sign);
      const meta2 = getZodiacMeta(person2Sign);
      if (!meta1 || !meta2) throw new Error("Invalid zodiac sign");

      const compat = calculateCompatibility(meta1, meta2);
      const compatData = formatCompatibilityForPrompt(meta1, meta2, compat, language);

      const name1 = person1Name || (isEn ? "Person A" : "甲方");
      const name2 = person2Name || (isEn ? "Person B" : "乙方");

      const systemPrompt = isEn
        ? `You are a master relationship astrologer with 30 years of experience in synastry (relationship chart analysis), combining Western astrology, Jungian psychology, and attachment theory. You create deeply insightful, multi-dimensional compatibility reports that reveal the hidden dynamics between two people.

IMPORTANT RULES:
- Base your analysis on the actual astrological properties: element interaction, modality dynamics, planetary rulers, and polarity
- Incorporate psychological frameworks: attachment styles, love languages, communication patterns, and shadow dynamics
- Each section should be substantive (5-8 sentences minimum), providing genuine insight — not generic platitudes
- Be honest about challenges while offering constructive growth paths
- Reference specific astrological symbolism (planetary rulers, element interactions) throughout
- Use warm, wise, and compassionate language befitting a seasoned relationship counselor
- Scores should reflect genuine astrological compatibility, not artificially inflated numbers

FORMAT your response with these 10 sections:

## 💫 Cosmic Connection Overview
Synthesize the overall energetic signature of this pairing in 5-8 sentences. Describe the fundamental nature of their connection — is it magnetic, challenging, harmonious, or transformative? Reference the element and modality interaction. Set the tone for the entire reading.

## 🔥 Passion & Physical Chemistry
Analyze the physical and passionate dimension in 5-8 sentences. How do their Mars energies interact? What is the sexual and physical chemistry like? Is the attraction instant or slow-building? What keeps the spark alive or threatens to extinguish it?

## 💕 Emotional Resonance & Love Language
Explore emotional compatibility in 5-8 sentences. How do their Moon energies (emotional needs) align? Do they speak the same love language? How does each person's attachment style interact with the other's? What emotional patterns emerge?

## 🗣️ Communication & Intellectual Bond
Analyze how they communicate and connect mentally in 5-8 sentences. How do their Mercury energies interact? Can they have deep conversations? How do they handle disagreements verbally? Is there intellectual stimulation or frustration?

## 🤝 Trust & Loyalty Dynamics
Examine the trust foundation in 5-8 sentences. How do their Saturn and Pluto energies affect commitment? What are each person's loyalty patterns? Where might jealousy, possessiveness, or trust issues arise? How can they build unshakeable trust?

## 🌱 Growth & Evolution Together
Explore how they catalyze each other's growth in 5-8 sentences. What lessons does each person bring to the other? How do their Jupiter energies expand each other's horizons? What personal transformations does this relationship trigger?

## ⚡ Conflict Patterns & Resolution
Analyze how they fight and resolve conflict in 5-8 sentences. Based on their conflict styles, what recurring arguments are likely? What triggers each person? What resolution strategies work best for this specific pairing?

## 🏠 Long-Term & Domestic Harmony
Assess long-term compatibility in 5-8 sentences. How do their values around home, family, finances, and lifestyle align? What does daily life look like together? Are their life goals compatible? What compromises are needed?

## 🌙 Shadow Work & Hidden Challenges
Reveal the unconscious dynamics in 5-8 sentences. What shadow aspects does each person project onto the other? What unresolved wounds might this relationship trigger? How can they do shadow work together to deepen their bond?

## ✨ Cosmic Blessing & Guidance
Provide 2-3 relationship affirmations specific to this pairing. End with a wise cosmic message about the highest potential of this union and practical advice for nurturing it.

After the 10 sections, provide scores in a JSON block:
\`\`\`json
{"loveScore": <1-100>, "passionScore": <1-100>, "communicationScore": <1-100>, "trustScore": <1-100>, "growthScore": <1-100>, "longTermScore": <1-100>, "summary": "<one-line relationship summary>"}
\`\`\``
        : `你是一位拥有30年经验的关系占星大师，精通合盘分析（synastry），融合西方占星术、荣格心理学和依恋理论。你创作深入、多维度的兼容性报告，揭示两个人之间隐藏的动态关系。

重要规则：
- 基于实际占星属性进行分析：元素互动、模式动态、行星守护和极性
- 融入心理学框架：依恋风格、爱的语言、沟通模式和阴影动态
- 每个维度提供深入分析（5-8句话以上），给出真正的洞见——而非泛泛之谈
- 对挑战诚实，同时提供建设性的成长路径
- 全文引用具体的占星象征（行星守护、元素互动）
- 使用温暖、智慧、富有同理心的语言，体现资深关系咨询师的风范
- 评分应反映真实的占星兼容性，不要人为拔高

格式要求（必须包含以下10个维度）：

## 💫 宇宙连接概览
用5-8句话综合这对组合的整体能量特征。描述他们连接的根本性质——是磁性吸引、充满挑战、和谐共振还是变革性的？引用元素和模式互动。为整个解读定下基调。

## 🔥 激情与身体化学反应
用5-8句话分析身体和激情维度。他们的火星能量如何互动？性和身体化学反应如何？吸引力是瞬间的还是慢慢建立的？什么能保持火花或威胁熄灭它？

## 💕 情感共鸣与爱的语言
用5-8句话探索情感兼容性。他们的月亮能量（情感需求）如何对齐？他们说同一种爱的语言吗？每个人的依恋风格如何与对方互动？会出现什么情感模式？

## 🗣️ 沟通与智性纽带
用5-8句话分析他们如何沟通和精神连接。他们的水星能量如何互动？能否进行深度对话？如何口头处理分歧？是智性刺激还是挫败？

## 🤝 信任与忠诚动态
用5-8句话审视信任基础。他们的土星和冥王星能量如何影响承诺？每个人的忠诚模式是什么？嫉妒、占有欲或信任问题可能在哪里出现？如何建立牢不可破的信任？

## 🌱 共同成长与进化
用5-8句话探索他们如何催化彼此的成长。每个人给对方带来什么功课？他们的木星能量如何拓展彼此的视野？这段关系触发了什么个人转变？

## ⚡ 冲突模式与化解之道
用5-8句话分析他们如何争吵和解决冲突。基于他们的冲突风格，可能出现哪些反复的争论？什么触发每个人？什么化解策略最适合这对特定组合？

## 🏠 长期相处与家庭和谐
用5-8句话评估长期兼容性。他们在家庭、家人、财务和生活方式方面的价值观如何对齐？日常生活在一起是什么样的？人生目标是否兼容？需要什么妥协？

## 🌙 阴影工作与隐藏挑战
用5-8句话揭示无意识动态。每个人将什么阴影面投射到对方身上？这段关系可能触发什么未愈合的伤口？如何一起做阴影工作来深化他们的纽带？

## ✨ 宇宙祝福与指引
提供2-3条针对这对组合的关系肯定语。以智慧的宇宙寄语收尾，关于这段结合的最高潜能和培育它的实用建议。

在10个维度之后，提供以下评分的JSON块：
\`\`\`json
{"loveScore": <1-100>, "passionScore": <1-100>, "communicationScore": <1-100>, "trustScore": <1-100>, "growthScore": <1-100>, "longTermScore": <1-100>, "summary": "<一句话关系总结>"}
\`\`\``;

      const userPrompt = isEn
        ? `Generate a deep compatibility analysis between ${name1} (${meta1.name}) and ${name2} (${meta2.name}).

${compatData}

Please provide a professional, in-depth synastry analysis with all 10 dimensions followed by the JSON scores block.`
        : `生成${name1}（${meta1.nameChinese}）和${name2}（${meta2.nameChinese}）的深度兼容性分析。

${compatData}

请提供专业、深入的合盘分析，包含全部10个维度，最后附上JSON评分块。`;

      const response = await invokeLLM({
        language,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const rawContentRaw = response.choices[0]?.message?.content || "";
      const rawContent = typeof rawContentRaw === "string" ? rawContentRaw : "";

      if (response.degradation) {
        return {
          id: undefined,
          overallScore: compat.overallScore,
          scores: {
            loveScore: 0,
            passionScore: 0,
            communicationScore: 0,
            trustScore: 0,
            growthScore: 0,
            longTermScore: 0,
            summary: response.degradation.message,
          },
          deepAnalysis: response.degradation.message,
          source: "daily_limit" as const,
          degradation: response.degradation,
          elementCompat: {
            score: compat.elementCompat.score,
            dynamic: isEn ? compat.elementCompat.dynamic : compat.elementCompat.dynamicChinese,
          },
          modalityCompat: {
            score: compat.modalityCompat.score,
            dynamic: isEn ? compat.modalityCompat.dynamic : compat.modalityCompat.dynamicChinese,
          },
          polarityCompat: {
            score: compat.polarityCompat.score,
            dynamic: isEn ? compat.polarityCompat.dynamic : compat.polarityCompat.dynamicChinese,
          },
          sign1: { name: meta1.name, nameChinese: meta1.nameChinese, symbol: meta1.symbol, element: meta1.element, elementChinese: meta1.elementChinese },
          sign2: { name: meta2.name, nameChinese: meta2.nameChinese, symbol: meta2.symbol, element: meta2.element, elementChinese: meta2.elementChinese },
        };
      }

      // Extract JSON scores
      let scores = {
        loveScore: compat.overallScore,
        passionScore: 70,
        communicationScore: 70,
        trustScore: 70,
        growthScore: 75,
        longTermScore: 70,
        summary: isEn ? "A unique cosmic pairing with growth potential." : "独特的宇宙配对，具有成长潜力。",
      };

      try {
        const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          scores = { ...scores, ...parsed };
        }
      } catch {
        // Use defaults
      }

      const deepAnalysis = rawContent.replace(/```json[\s\S]*?```/g, "").trim();

      // Save to database
      const db = await getDb();
      let reportId: number | undefined;

      if (db) {
        const [inserted] = await db.insert(compatibilityReports).values({
          userId: ctx.user?.id || null,
          sessionId: nanoid(),
          person1Name: name1,
          person1Sign: person1Sign,
          person2Name: name2,
          person2Sign: person2Sign,
          overallScore: compat.overallScore,
          scores: scores,
          basicReading: scores.summary,
          deepAnalysis: deepAnalysis,
          isPaid: false,
        });
        reportId = inserted.insertId;

        // Update growth if logged in
        if (ctx.user?.id) {
          const [existingGrowth] = await db
            .select()
            .from(userGrowth)
            .where(eq(userGrowth.userId, ctx.user.id))
            .limit(1);

          if (existingGrowth) {
            await db.update(userGrowth)
              .set({
                intimateRelationships: sql`${userGrowth.intimateRelationships} + 3`,
                totalPoints: sql`${userGrowth.totalPoints} + 5`,
              })
              .where(eq(userGrowth.userId, ctx.user.id));
          }
        }
      }

      return {
        id: reportId,
        overallScore: compat.overallScore,
        scores,
        deepAnalysis,
        source: "ai" as const,
        degradation: null,
        elementCompat: {
          score: compat.elementCompat.score,
          dynamic: isEn ? compat.elementCompat.dynamic : compat.elementCompat.dynamicChinese,
        },
        modalityCompat: {
          score: compat.modalityCompat.score,
          dynamic: isEn ? compat.modalityCompat.dynamic : compat.modalityCompat.dynamicChinese,
        },
        polarityCompat: {
          score: compat.polarityCompat.score,
          dynamic: isEn ? compat.polarityCompat.dynamic : compat.polarityCompat.dynamicChinese,
        },
        sign1: { name: meta1.name, nameChinese: meta1.nameChinese, symbol: meta1.symbol, element: meta1.element, elementChinese: meta1.elementChinese },
        sign2: { name: meta2.name, nameChinese: meta2.nameChinese, symbol: meta2.symbol, element: meta2.element, elementChinese: meta2.elementChinese },
      };
    }),

  // Get user's past compatibility reports
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const reports = await db
      .select({
        id: compatibilityReports.id,
        person1Name: compatibilityReports.person1Name,
        person1Sign: compatibilityReports.person1Sign,
        person2Name: compatibilityReports.person2Name,
        person2Sign: compatibilityReports.person2Sign,
        overallScore: compatibilityReports.overallScore,
        createdAt: compatibilityReports.createdAt,
      })
      .from(compatibilityReports)
      .where(eq(compatibilityReports.userId, ctx.user.id))
      .orderBy(desc(compatibilityReports.createdAt))
      .limit(20);

    return reports;
  }),
});
