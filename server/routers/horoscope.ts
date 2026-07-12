import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { getDb, getUsageStatus, consumeUsage } from "../db";
import { horoscopes, userGrowth } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";

// === Zodiac Knowledge Database ===
interface ZodiacSign {
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
  dateRange: string;
  traits: string[];
  traitsChinese: string[];
  strengths: string[];
  strengthsChinese: string[];
  weaknesses: string[];
  weaknessesChinese: string[];
  compatibleSigns: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  luckyColorsChinese: string[];
  bodyPart: string;
  bodyPartChinese: string;
  // Enhanced fields for deep analysis
  decans: string[];
  decansChinese: string[];
  tarotCard: string;
  tarotCardChinese: string;
  chakra: string;
  chakraChinese: string;
  crystal: string;
  crystalChinese: string;
  mythOrigin: string;
  mythOriginChinese: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries", name: "Aries", nameChinese: "白羊座", symbol: "♈",
    element: "Fire", elementChinese: "火", modality: "Cardinal", modalityChinese: "开创",
    rulingPlanet: "Mars", rulingPlanetChinese: "火星",
    dateRange: "Mar 21 - Apr 19",
    traits: ["Bold", "Ambitious", "Energetic", "Competitive", "Honest"],
    traitsChinese: ["勇敢", "有野心", "精力充沛", "好胜", "诚实"],
    strengths: ["Courageous", "Determined", "Confident", "Enthusiastic", "Optimistic"],
    strengthsChinese: ["勇敢", "坚定", "自信", "热情", "乐观"],
    weaknesses: ["Impatient", "Short-tempered", "Impulsive", "Aggressive"],
    weaknessesChinese: ["急躁", "脾气暴躁", "冲动", "好斗"],
    compatibleSigns: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
    luckyNumbers: [1, 8, 17], luckyColors: ["Red", "Orange"], luckyColorsChinese: ["红色", "橙色"],
    bodyPart: "Head", bodyPartChinese: "头部",
    decans: ["Mars (Mar 21-30)", "Sun (Mar 31-Apr 9)", "Jupiter (Apr 10-19)"],
    decansChinese: ["火星旬 (3/21-30)", "太阳旬 (3/31-4/9)", "木星旬 (4/10-19)"],
    tarotCard: "The Emperor", tarotCardChinese: "皇帝",
    chakra: "Solar Plexus", chakraChinese: "太阳神经丛脉轮",
    crystal: "Red Jasper, Carnelian", crystalChinese: "红碧玉、红玉髓",
    mythOrigin: "Golden Ram of Greek mythology", mythOriginChinese: "希腊神话中的金羊",
  },
  {
    id: "taurus", name: "Taurus", nameChinese: "金牛座", symbol: "♉",
    element: "Earth", elementChinese: "土", modality: "Fixed", modalityChinese: "固定",
    rulingPlanet: "Venus", rulingPlanetChinese: "金星",
    dateRange: "Apr 20 - May 20",
    traits: ["Reliable", "Patient", "Practical", "Devoted", "Responsible"],
    traitsChinese: ["可靠", "耐心", "务实", "忠诚", "负责"],
    strengths: ["Reliable", "Patient", "Practical", "Devoted", "Stable"],
    strengthsChinese: ["可靠", "耐心", "务实", "忠诚", "稳定"],
    weaknesses: ["Stubborn", "Possessive", "Uncompromising", "Materialistic"],
    weaknessesChinese: ["固执", "占有欲强", "不妥协", "物质主义"],
    compatibleSigns: ["Cancer", "Virgo", "Capricorn", "Pisces"],
    luckyNumbers: [2, 6, 9], luckyColors: ["Green", "Pink"], luckyColorsChinese: ["绿色", "粉色"],
    bodyPart: "Throat/Neck", bodyPartChinese: "喉咙/颈部",
    decans: ["Venus (Apr 20-29)", "Mercury (Apr 30-May 10)", "Saturn (May 11-20)"],
    decansChinese: ["金星旬 (4/20-29)", "水星旬 (4/30-5/10)", "土星旬 (5/11-20)"],
    tarotCard: "The Hierophant", tarotCardChinese: "教皇",
    chakra: "Throat", chakraChinese: "喉轮",
    crystal: "Rose Quartz, Emerald", crystalChinese: "粉晶、祖母绿",
    mythOrigin: "Zeus as the white bull", mythOriginChinese: "宙斯化身的白色公牛",
  },
  {
    id: "gemini", name: "Gemini", nameChinese: "双子座", symbol: "♊",
    element: "Air", elementChinese: "风", modality: "Mutable", modalityChinese: "变动",
    rulingPlanet: "Mercury", rulingPlanetChinese: "水星",
    dateRange: "May 21 - Jun 20",
    traits: ["Adaptable", "Curious", "Witty", "Communicative", "Versatile"],
    traitsChinese: ["适应力强", "好奇", "机智", "善于沟通", "多才多艺"],
    strengths: ["Gentle", "Affectionate", "Curious", "Adaptable", "Quick learner"],
    strengthsChinese: ["温和", "深情", "好奇", "适应力强", "学习快"],
    weaknesses: ["Nervous", "Inconsistent", "Indecisive", "Superficial"],
    weaknessesChinese: ["紧张", "不一致", "优柔寡断", "肤浅"],
    compatibleSigns: ["Aries", "Leo", "Libra", "Aquarius"],
    luckyNumbers: [5, 7, 14], luckyColors: ["Yellow", "Light Green"], luckyColorsChinese: ["黄色", "浅绿色"],
    bodyPart: "Arms/Hands", bodyPartChinese: "手臂/手",
    decans: ["Mercury (May 21-31)", "Venus (Jun 1-10)", "Uranus (Jun 11-20)"],
    decansChinese: ["水星旬 (5/21-31)", "金星旬 (6/1-10)", "天王星旬 (6/11-20)"],
    tarotCard: "The Lovers", tarotCardChinese: "恋人",
    chakra: "Throat", chakraChinese: "喉轮",
    crystal: "Agate, Citrine", crystalChinese: "玛瑙、黄水晶",
    mythOrigin: "Castor and Pollux, the Dioscuri", mythOriginChinese: "卡斯托尔与波吕丢刻斯双子",
  },
  {
    id: "cancer", name: "Cancer", nameChinese: "巨蟹座", symbol: "♋",
    element: "Water", elementChinese: "水", modality: "Cardinal", modalityChinese: "开创",
    rulingPlanet: "Moon", rulingPlanetChinese: "月亮",
    dateRange: "Jun 21 - Jul 22",
    traits: ["Nurturing", "Intuitive", "Protective", "Emotional", "Loyal"],
    traitsChinese: ["有爱心", "直觉强", "保护欲强", "情感丰富", "忠诚"],
    strengths: ["Tenacious", "Highly imaginative", "Loyal", "Emotional", "Sympathetic"],
    strengthsChinese: ["坚韧", "想象力丰富", "忠诚", "情感丰富", "有同理心"],
    weaknesses: ["Moody", "Pessimistic", "Suspicious", "Manipulative"],
    weaknessesChinese: ["情绪化", "悲观", "多疑", "控制欲强"],
    compatibleSigns: ["Taurus", "Virgo", "Scorpio", "Pisces"],
    luckyNumbers: [2, 3, 15], luckyColors: ["White", "Silver"], luckyColorsChinese: ["白色", "银色"],
    bodyPart: "Chest/Stomach", bodyPartChinese: "胸部/胃",
    decans: ["Moon (Jun 21-Jul 1)", "Pluto (Jul 2-12)", "Neptune (Jul 13-22)"],
    decansChinese: ["月亮旬 (6/21-7/1)", "冥王星旬 (7/2-12)", "海王星旬 (7/13-22)"],
    tarotCard: "The Chariot", tarotCardChinese: "战车",
    chakra: "Heart", chakraChinese: "心轮",
    crystal: "Moonstone, Pearl", crystalChinese: "月光石、珍珠",
    mythOrigin: "The Crab that fought Heracles", mythOriginChinese: "与赫拉克勒斯搏斗的巨蟹",
  },
  {
    id: "leo", name: "Leo", nameChinese: "狮子座", symbol: "♌",
    element: "Fire", elementChinese: "火", modality: "Fixed", modalityChinese: "固定",
    rulingPlanet: "Sun", rulingPlanetChinese: "太阳",
    dateRange: "Jul 23 - Aug 22",
    traits: ["Creative", "Passionate", "Generous", "Warm-hearted", "Cheerful"],
    traitsChinese: ["有创造力", "热情", "慷慨", "热心", "开朗"],
    strengths: ["Creative", "Passionate", "Generous", "Warm-hearted", "Humorous"],
    strengthsChinese: ["有创造力", "热情", "慷慨", "热心", "幽默"],
    weaknesses: ["Arrogant", "Stubborn", "Self-centered", "Lazy", "Inflexible"],
    weaknessesChinese: ["傲慢", "固执", "自我中心", "懒惰", "不灵活"],
    compatibleSigns: ["Aries", "Gemini", "Libra", "Sagittarius"],
    luckyNumbers: [1, 3, 10], luckyColors: ["Gold", "Orange"], luckyColorsChinese: ["金色", "橙色"],
    bodyPart: "Heart/Spine", bodyPartChinese: "心脏/脊柱",
    decans: ["Sun (Jul 23-Aug 1)", "Jupiter (Aug 2-12)", "Mars (Aug 13-22)"],
    decansChinese: ["太阳旬 (7/23-8/1)", "木星旬 (8/2-12)", "火星旬 (8/13-22)"],
    tarotCard: "Strength", tarotCardChinese: "力量",
    chakra: "Solar Plexus", chakraChinese: "太阳神经丛脉轮",
    crystal: "Tiger's Eye, Sunstone", crystalChinese: "虎眼石、日光石",
    mythOrigin: "The Nemean Lion", mythOriginChinese: "尼米亚雄狮",
  },
  {
    id: "virgo", name: "Virgo", nameChinese: "处女座", symbol: "♍",
    element: "Earth", elementChinese: "土", modality: "Mutable", modalityChinese: "变动",
    rulingPlanet: "Mercury", rulingPlanetChinese: "水星",
    dateRange: "Aug 23 - Sep 22",
    traits: ["Analytical", "Practical", "Diligent", "Modest", "Reliable"],
    traitsChinese: ["分析力强", "务实", "勤奋", "谦虚", "可靠"],
    strengths: ["Loyal", "Analytical", "Kind", "Hardworking", "Practical"],
    strengthsChinese: ["忠诚", "分析力强", "善良", "勤奋", "务实"],
    weaknesses: ["Shyness", "Worry", "Overly critical", "All work no play"],
    weaknessesChinese: ["害羞", "焦虑", "过度挑剔", "只工作不玩乐"],
    compatibleSigns: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
    luckyNumbers: [5, 14, 23], luckyColors: ["Grey", "Beige", "Pale Yellow"], luckyColorsChinese: ["灰色", "米色", "淡黄色"],
    bodyPart: "Digestive System", bodyPartChinese: "消化系统",
    decans: ["Mercury (Aug 23-Sep 1)", "Saturn (Sep 2-12)", "Venus (Sep 13-22)"],
    decansChinese: ["水星旬 (8/23-9/1)", "土星旬 (9/2-12)", "金星旬 (9/13-22)"],
    tarotCard: "The Hermit", tarotCardChinese: "隐者",
    chakra: "Throat", chakraChinese: "喉轮",
    crystal: "Amazonite, Peridot", crystalChinese: "天河石、橄榄石",
    mythOrigin: "Astraea, goddess of innocence", mythOriginChinese: "纯洁女神阿斯特赖亚",
  },
  {
    id: "libra", name: "Libra", nameChinese: "天秤座", symbol: "♎",
    element: "Air", elementChinese: "风", modality: "Cardinal", modalityChinese: "开创",
    rulingPlanet: "Venus", rulingPlanetChinese: "金星",
    dateRange: "Sep 23 - Oct 22",
    traits: ["Diplomatic", "Fair-minded", "Social", "Cooperative", "Gracious"],
    traitsChinese: ["善于外交", "公正", "社交", "合作", "优雅"],
    strengths: ["Cooperative", "Diplomatic", "Gracious", "Fair-minded", "Social"],
    strengthsChinese: ["合作", "善于外交", "优雅", "公正", "善于社交"],
    weaknesses: ["Indecisive", "Avoids confrontation", "Self-pity", "Grudge-holding"],
    weaknessesChinese: ["优柔寡断", "回避冲突", "自怜", "记仇"],
    compatibleSigns: ["Gemini", "Leo", "Sagittarius", "Aquarius"],
    luckyNumbers: [4, 6, 13], luckyColors: ["Pink", "Blue"], luckyColorsChinese: ["粉色", "蓝色"],
    bodyPart: "Kidneys/Lower Back", bodyPartChinese: "肾脏/下背部",
    decans: ["Venus (Sep 23-Oct 2)", "Uranus (Oct 3-13)", "Mercury (Oct 14-22)"],
    decansChinese: ["金星旬 (9/23-10/2)", "天王星旬 (10/3-13)", "水星旬 (10/14-22)"],
    tarotCard: "Justice", tarotCardChinese: "正义",
    chakra: "Heart", chakraChinese: "心轮",
    crystal: "Lapis Lazuli, Opal", crystalChinese: "青金石、蛋白石",
    mythOrigin: "Scales of Themis, goddess of justice", mythOriginChinese: "正义女神忒弥斯的天平",
  },
  {
    id: "scorpio", name: "Scorpio", nameChinese: "天蝎座", symbol: "♏",
    element: "Water", elementChinese: "水", modality: "Fixed", modalityChinese: "固定",
    rulingPlanet: "Pluto/Mars", rulingPlanetChinese: "冥王星/火星",
    dateRange: "Oct 23 - Nov 21",
    traits: ["Resourceful", "Brave", "Passionate", "Stubborn", "Strategic"],
    traitsChinese: ["足智多谋", "勇敢", "热情", "固执", "有策略"],
    strengths: ["Resourceful", "Powerful", "Brave", "Passionate", "Stubborn"],
    strengthsChinese: ["足智多谋", "强大", "勇敢", "热情", "坚定"],
    weaknesses: ["Distrusting", "Jealous", "Secretive", "Violent"],
    weaknessesChinese: ["不信任", "嫉妒", "神秘", "极端"],
    compatibleSigns: ["Cancer", "Virgo", "Capricorn", "Pisces"],
    luckyNumbers: [8, 11, 18], luckyColors: ["Scarlet", "Rust", "Black"], luckyColorsChinese: ["猩红色", "铁锈色", "黑色"],
    bodyPart: "Reproductive System", bodyPartChinese: "生殖系统",
    decans: ["Pluto (Oct 23-Nov 1)", "Neptune (Nov 2-12)", "Moon (Nov 13-21)"],
    decansChinese: ["冥王星旬 (10/23-11/1)", "海王星旬 (11/2-12)", "月亮旬 (11/13-21)"],
    tarotCard: "Death", tarotCardChinese: "死神",
    chakra: "Sacral", chakraChinese: "脐轮",
    crystal: "Obsidian, Malachite", crystalChinese: "黑曜石、孔雀石",
    mythOrigin: "Scorpion sent by Gaia to slay Orion", mythOriginChinese: "盖亚派出猎杀猎户座的蝎子",
  },
  {
    id: "sagittarius", name: "Sagittarius", nameChinese: "射手座", symbol: "♐",
    element: "Fire", elementChinese: "火", modality: "Mutable", modalityChinese: "变动",
    rulingPlanet: "Jupiter", rulingPlanetChinese: "木星",
    dateRange: "Nov 22 - Dec 21",
    traits: ["Generous", "Idealistic", "Humorous", "Adventurous", "Philosophical"],
    traitsChinese: ["慷慨", "理想主义", "幽默", "爱冒险", "哲学性"],
    strengths: ["Generous", "Idealistic", "Great sense of humor", "Adventurous"],
    strengthsChinese: ["慷慨", "理想主义", "幽默感强", "爱冒险"],
    weaknesses: ["Promises more than can deliver", "Impatient", "Tactless"],
    weaknessesChinese: ["承诺过多", "急躁", "直言不讳"],
    compatibleSigns: ["Aries", "Leo", "Libra", "Aquarius"],
    luckyNumbers: [3, 7, 9], luckyColors: ["Blue", "Purple"], luckyColorsChinese: ["蓝色", "紫色"],
    bodyPart: "Hips/Thighs", bodyPartChinese: "臀部/大腿",
    decans: ["Jupiter (Nov 22-Dec 1)", "Mars (Dec 2-12)", "Sun (Dec 13-21)"],
    decansChinese: ["木星旬 (11/22-12/1)", "火星旬 (12/2-12)", "太阳旬 (12/13-21)"],
    tarotCard: "Temperance", tarotCardChinese: "节制",
    chakra: "Sacral", chakraChinese: "脐轮",
    crystal: "Turquoise, Lapis Lazuli", crystalChinese: "绿松石、青金石",
    mythOrigin: "Chiron the centaur", mythOriginChinese: "半人马喀戎",
  },
  {
    id: "capricorn", name: "Capricorn", nameChinese: "摩羯座", symbol: "♑",
    element: "Earth", elementChinese: "土", modality: "Cardinal", modalityChinese: "开创",
    rulingPlanet: "Saturn", rulingPlanetChinese: "土星",
    dateRange: "Dec 22 - Jan 19",
    traits: ["Responsible", "Disciplined", "Self-control", "Ambitious", "Patient"],
    traitsChinese: ["负责", "自律", "自控", "有野心", "耐心"],
    strengths: ["Responsible", "Disciplined", "Self-control", "Good managers"],
    strengthsChinese: ["负责", "自律", "自控", "善于管理"],
    weaknesses: ["Know-it-all", "Unforgiving", "Condescending", "Pessimistic"],
    weaknessesChinese: ["自以为是", "不宽容", "居高临下", "悲观"],
    compatibleSigns: ["Taurus", "Cancer", "Virgo", "Pisces"],
    luckyNumbers: [4, 8, 13], luckyColors: ["Brown", "Black"], luckyColorsChinese: ["棕色", "黑色"],
    bodyPart: "Knees/Bones", bodyPartChinese: "膝盖/骨骼",
    decans: ["Saturn (Dec 22-31)", "Venus (Jan 1-10)", "Mercury (Jan 11-19)"],
    decansChinese: ["土星旬 (12/22-31)", "金星旬 (1/1-10)", "水星旬 (1/11-19)"],
    tarotCard: "The Devil", tarotCardChinese: "恶魔",
    chakra: "Root", chakraChinese: "根轮",
    crystal: "Garnet, Onyx", crystalChinese: "石榴石、缟玛瑙",
    mythOrigin: "Sea-goat Pricus", mythOriginChinese: "海山羊普里库斯",
  },
  {
    id: "aquarius", name: "Aquarius", nameChinese: "水瓶座", symbol: "♒",
    element: "Air", elementChinese: "风", modality: "Fixed", modalityChinese: "固定",
    rulingPlanet: "Uranus/Saturn", rulingPlanetChinese: "天王星/土星",
    dateRange: "Jan 20 - Feb 18",
    traits: ["Progressive", "Original", "Independent", "Humanitarian", "Intellectual"],
    traitsChinese: ["进步", "独创", "独立", "人道主义", "知性"],
    strengths: ["Progressive", "Original", "Independent", "Humanitarian"],
    strengthsChinese: ["进步", "独创", "独立", "人道主义"],
    weaknesses: ["Runs from emotional expression", "Temperamental", "Uncompromising", "Aloof"],
    weaknessesChinese: ["回避情感表达", "喜怒无常", "不妥协", "冷漠"],
    compatibleSigns: ["Aries", "Gemini", "Libra", "Sagittarius"],
    luckyNumbers: [4, 7, 11], luckyColors: ["Light Blue", "Silver"], luckyColorsChinese: ["浅蓝色", "银色"],
    bodyPart: "Ankles/Circulatory", bodyPartChinese: "脚踝/循环系统",
    decans: ["Uranus (Jan 20-29)", "Mercury (Jan 30-Feb 8)", "Venus (Feb 9-18)"],
    decansChinese: ["天王星旬 (1/20-29)", "水星旬 (1/30-2/8)", "金星旬 (2/9-18)"],
    tarotCard: "The Star", tarotCardChinese: "星星",
    chakra: "Third Eye", chakraChinese: "眉心轮",
    crystal: "Amethyst, Aquamarine", crystalChinese: "紫水晶、海蓝宝石",
    mythOrigin: "Ganymede, cupbearer of the gods", mythOriginChinese: "众神侍酒者伽倪墨得斯",
  },
  {
    id: "pisces", name: "Pisces", nameChinese: "双鱼座", symbol: "♓",
    element: "Water", elementChinese: "水", modality: "Mutable", modalityChinese: "变动",
    rulingPlanet: "Neptune/Jupiter", rulingPlanetChinese: "海王星/木星",
    dateRange: "Feb 19 - Mar 20",
    traits: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise"],
    traitsChinese: ["有同情心", "有艺术感", "直觉强", "温柔", "智慧"],
    strengths: ["Compassionate", "Artistic", "Intuitive", "Gentle", "Wise", "Musical"],
    strengthsChinese: ["有同情心", "有艺术感", "直觉强", "温柔", "智慧", "有音乐天赋"],
    weaknesses: ["Fearful", "Overly trusting", "Sad", "Desire to escape reality"],
    weaknessesChinese: ["恐惧", "过于信任", "忧伤", "逃避现实"],
    compatibleSigns: ["Taurus", "Cancer", "Scorpio", "Capricorn"],
    luckyNumbers: [3, 9, 12], luckyColors: ["Mauve", "Lilac", "Sea Green"], luckyColorsChinese: ["淡紫色", "丁香色", "海绿色"],
    bodyPart: "Feet/Immune System", bodyPartChinese: "脚/免疫系统",
    decans: ["Neptune (Feb 19-29)", "Moon (Mar 1-10)", "Pluto (Mar 11-20)"],
    decansChinese: ["海王星旬 (2/19-29)", "月亮旬 (3/1-10)", "冥王星旬 (3/11-20)"],
    tarotCard: "The Moon", tarotCardChinese: "月亮",
    chakra: "Crown", chakraChinese: "顶轮",
    crystal: "Aquamarine, Fluorite", crystalChinese: "海蓝宝石、萤石",
    mythOrigin: "Aphrodite and Eros as fish", mythOriginChinese: "化身为鱼的阿芙罗狄忒与厄洛斯",
  },
];

function getZodiacSign(id: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find(s => s.id === id);
}

// Enhanced zodiac profile for deep analysis prompt
function formatZodiacForDeepPrompt(sign: ZodiacSign, language: string): string {
  const isEn = language === "en";
  if (isEn) {
    return `=== Zodiac Profile: ${sign.name} (${sign.symbol}) ===
Element: ${sign.element} | Modality: ${sign.modality} | Ruling Planet: ${sign.rulingPlanet}
Date Range: ${sign.dateRange}
Decans: ${sign.decans.join(" → ")}
Tarot Correspondence: ${sign.tarotCard}
Chakra: ${sign.chakra} | Crystals: ${sign.crystal}
Mythological Origin: ${sign.mythOrigin}
Core Traits: ${sign.traits.join(", ")}
Strengths: ${sign.strengths.join(", ")}
Weaknesses: ${sign.weaknesses.join(", ")}
Compatible Signs: ${sign.compatibleSigns.join(", ")}
Lucky Numbers: ${sign.luckyNumbers.join(", ")}
Lucky Colors: ${sign.luckyColors.join(", ")}
Body Association: ${sign.bodyPart}`;
  }
  return `=== 星座档案：${sign.nameChinese}（${sign.symbol}）===
元素：${sign.elementChinese} | 模式：${sign.modalityChinese} | 守护星：${sign.rulingPlanetChinese}
日期范围：${sign.dateRange}
三旬守护：${sign.decansChinese.join(" → ")}
塔罗对应：${sign.tarotCardChinese}
脉轮：${sign.chakraChinese} | 守护水晶：${sign.crystalChinese}
神话起源：${sign.mythOriginChinese}
核心特质：${sign.traitsChinese.join("、")}
优势：${sign.strengthsChinese.join("、")}
弱点：${sign.weaknessesChinese.join("、")}
相合星座：${sign.compatibleSigns.join("、")}
幸运数字：${sign.luckyNumbers.join("、")}
幸运颜色：${sign.luckyColorsChinese.join("、")}
身体关联：${sign.bodyPartChinese}`;
}

// Enhanced planetary context with more astronomical data
function getEnhancedPlanetaryContext(date: Date, language: string): string {
  const isEn = language === "en";
  const month = date.getMonth();
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  // Current zodiac season
  const zodiacSeasons = [
    "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
  ];
  const zodiacSeasonsChinese = [
    "摩羯座", "水瓶座", "双鱼座", "白羊座", "金牛座", "双子座",
    "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座"
  ];
  const currentSeason = isEn ? zodiacSeasons[month] : zodiacSeasonsChinese[month];

  // Moon phase calculation
  const lunarCycle = 29.53;
  const knownNewMoon = new Date(2024, 0, 11).getTime();
  const daysSinceNewMoon = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const moonAge = ((daysSinceNewMoon % lunarCycle) + lunarCycle) % lunarCycle;
  let moonPhase: string;
  let moonEnergy: string;
  if (moonAge < 3.69) { moonPhase = isEn ? "New Moon" : "新月"; moonEnergy = isEn ? "New beginnings, setting intentions" : "新的开始，设定意图"; }
  else if (moonAge < 7.38) { moonPhase = isEn ? "Waxing Crescent" : "蛾眉月"; moonEnergy = isEn ? "Building momentum, taking action" : "积蓄势能，采取行动"; }
  else if (moonAge < 11.07) { moonPhase = isEn ? "First Quarter" : "上弦月"; moonEnergy = isEn ? "Challenges and decisions, commitment" : "挑战与决策，承诺"; }
  else if (moonAge < 14.76) { moonPhase = isEn ? "Waxing Gibbous" : "盈凸月"; moonEnergy = isEn ? "Refinement, adjustment, patience" : "精炼、调整、耐心"; }
  else if (moonAge < 18.45) { moonPhase = isEn ? "Full Moon" : "满月"; moonEnergy = isEn ? "Culmination, revelation, emotional peak" : "高潮、启示、情感顶峰"; }
  else if (moonAge < 22.14) { moonPhase = isEn ? "Waning Gibbous" : "亏凸月"; moonEnergy = isEn ? "Gratitude, sharing wisdom, integration" : "感恩、分享智慧、整合"; }
  else if (moonAge < 25.83) { moonPhase = isEn ? "Last Quarter" : "下弦月"; moonEnergy = isEn ? "Release, forgiveness, letting go" : "释放、宽恕、放下"; }
  else { moonPhase = isEn ? "Waning Crescent" : "残月"; moonEnergy = isEn ? "Rest, surrender, spiritual reflection" : "休息、臣服、灵性反思"; }

  // Day ruler
  const dayRulers = isEn
    ? ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    : ["太阳", "月亮", "火星", "水星", "木星", "金星", "土星"];
  const dayNames = isEn
    ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    : ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  // Approximate planetary positions (simplified ephemeris)
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const sunDegree = (dayOfYear / 365.25) * 360;
  const mercurySpeed = 4.09; // degrees per day approx
  const venusSpeed = 1.6;
  const marsSpeed = 0.524;
  const jupiterSpeed = 0.083;
  const saturnSpeed = 0.034;

  // Simplified retrograde detection (Mercury retrogrades ~3x/year)
  const mercuryRetro = (dayOfYear % 116) > 93; // rough approximation
  const venusRetro = (dayOfYear % 584) > 543;

  // Seasonal energy
  const seasonalEnergy = isEn
    ? ["Winter Solstice energy", "Deep winter introspection", "Spring awakening", "Spring equinox balance",
       "Growth and expansion", "Summer building", "Summer solstice peak", "Harvest preparation",
       "Autumn equinox balance", "Harvest and gratitude", "Deepening and release", "Winter preparation"][month]
    : ["冬至能量", "深冬内省", "春天觉醒", "春分平衡",
       "成长与扩展", "夏季积蓄", "夏至顶峰", "丰收准备",
       "秋分平衡", "收获与感恩", "深化与释放", "冬季准备"][month];

  if (isEn) {
    return `=== Current Cosmic Context ===
Date: ${date.toISOString().split("T")[0]} (${dayNames[dayOfWeek]})
Sun Position: ${currentSeason} season (${Math.round(sunDegree)}° ecliptic)
Moon Phase: ${moonPhase} — ${moonEnergy}
Day Ruler: ${dayRulers[dayOfWeek]}
Seasonal Energy: ${seasonalEnergy}
Mercury: ${mercuryRetro ? "RETROGRADE — communication/travel disruptions, review past decisions" : "Direct — clear communication, good for new plans"}
Venus: ${venusRetro ? "RETROGRADE — relationship reassessment, financial review" : "Direct — harmonious relationships, creative flow"}
Planetary Day Energy: ${dayRulers[dayOfWeek]} governs today, influencing ${
      ["vitality/identity", "emotions/intuition", "drive/conflict", "communication/intellect",
       "expansion/luck", "love/beauty", "discipline/structure"][dayOfWeek]
    }`;
  }
  return `=== 当前宇宙背景 ===
日期：${date.toISOString().split("T")[0]}（${dayNames[dayOfWeek]}）
太阳位置：${currentSeason}季节（黄道${Math.round(sunDegree)}°）
月相：${moonPhase} — ${moonEnergy}
日主星：${dayRulers[dayOfWeek]}
季节能量：${seasonalEnergy}
水星：${mercuryRetro ? "逆行中 — 沟通/出行易受干扰，适合回顾过去决定" : "顺行 — 沟通顺畅，适合新计划"}
金星：${venusRetro ? "逆行中 — 关系重新评估，财务审视" : "顺行 — 关系和谐，创造力流动"}
行星日能量：${dayRulers[dayOfWeek]}主宰今日，影响${
    ["活力/身份认同", "情绪/直觉", "驱动力/冲突", "沟通/智识",
     "扩展/幸运", "爱与美/和谐", "纪律/结构"][dayOfWeek]
  }`;
}

/** Daily horoscope DB cache key: language-scoped so zh/en never share a row (F0-6). */
export function dailyHoroscopeCacheKey(sign: string, language: string): string {
  return `${sign.toLowerCase()}::${language}`;
}

export const horoscopeRouter = router({
  // Get zodiac sign data
  getSignData: publicProcedure
    .input(z.object({ signId: z.string() }))
    .query(({ input }) => {
      const sign = getZodiacSign(input.signId);
      if (!sign) return null;
      return sign;
    }),

  // Get all signs
  getAllSigns: publicProcedure.query(() => {
    return ZODIAC_SIGNS.map(s => ({
      id: s.id,
      name: s.name,
      nameChinese: s.nameChinese,
      symbol: s.symbol,
      element: s.element,
      elementChinese: s.elementChinese,
      dateRange: s.dateRange,
    }));
  }),

  // Multi-dimension deep daily horoscope
  getDaily: publicProcedure
    .input(z.object({
      sign: z.string(),
      language: z.enum(["zh", "en"]).optional().default("zh"),
    }))
    .query(async ({ input, ctx }) => {
      const { sign, language } = input;
      const isEn = language === "en";

      // Check usage
      if (ctx.user?.id) {
        const usage = await getUsageStatus(ctx.user.id, "horoscope");
        if (!usage.canUse) {
          throw new Error("FREE_LIMIT_REACHED");
        }
        await consumeUsage(ctx.user.id, "horoscope");
      }

      // Check cache first (key includes language — zh/en must not share a row)
      const db = await getDb();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cacheSignKey = dailyHoroscopeCacheKey(sign, language);

      if (db) {
        const [cached] = await db
          .select()
          .from(horoscopes)
          .where(and(
            eq(horoscopes.zodiacSign, cacheSignKey),
            eq(horoscopes.periodType, "daily"),
            eq(horoscopes.periodDate, today)
          ))
          .limit(1);

        if (cached && cached.deepAnalysis) {
          return {
            content: cached.content,
            deepAnalysis: cached.deepAnalysis,
            overall: cached.overallScore,
            love: { score: cached.loveScore, advice: "" },
            career: { score: cached.careerScore, advice: "" },
            wealth: { score: cached.wealthScore, advice: "" },
            health: "",
            encouragement: "",
            luckyColor: cached.luckyColor,
            luckyNumber: cached.luckyNumber,
            advice: cached.advice,
            signData: undefined as ReturnType<typeof getZodiacSign> | undefined,
          };
        }
      }

      // === Build structured prompt with enhanced zodiac data ===
      const zodiacSign = getZodiacSign(sign);
      if (!zodiacSign) throw new Error("Invalid zodiac sign");

      const zodiacProfile = formatZodiacForDeepPrompt(zodiacSign, language);
      const planetaryContext = getEnhancedPlanetaryContext(new Date(), language);

      const systemPrompt = isEn
        ? `You are a master astrologer with 30 years of experience combining Western tropical astrology, Hellenistic techniques, and modern psychological astrology. You create deeply insightful, multi-dimensional daily horoscopes that go far beyond generic fortune-telling.

IMPORTANT RULES:
- Base your reading on the zodiac sign's actual astrological properties, decan rulers, and current planetary transits
- Consider the moon phase, day ruler, seasonal energy, and any retrograde influences
- Each section should be substantive (4-8 sentences minimum), not superficial summaries
- Provide specific, actionable advice grounded in astrological symbolism — not generic platitudes
- Reference the sign's mythological origin, tarot correspondence, and elemental nature where relevant
- Use warm but authoritative language befitting a seasoned astrologer
- Scores should vary meaningfully based on actual planetary influences (not all 70-85)

FORMAT your response with these 10 sections:

## 🌌 Cosmic Energy Overview
Synthesize today's overall energetic signature for this sign in 4-6 sentences. Describe how the current planetary transits, moon phase, and seasonal energy specifically affect this sign. Mention the day ruler's influence and any notable astrological aspects.

## 🪐 Planetary Transit Analysis
For each major planet affecting this sign today, provide specific transit interpretations in 4-6 sentences. How is the Sun's current position interacting with this sign's natal energy? What does Mercury's status (direct/retrograde) mean for communication? How does Venus influence relationships and finances today?

## 💕 Love & Emotional Landscape
Provide a detailed emotional and romantic forecast in 4-6 sentences. How does today's moon phase affect this sign's emotional world? What relationship dynamics are highlighted? Include advice for both singles and those in relationships. Reference the sign's Venus placement and emotional patterns.

## 💼 Career & Ambition Compass
Analyze career and professional energy in 4-6 sentences. How do today's transits affect work performance, leadership, and professional relationships? What opportunities or challenges should this sign watch for? Connect to the sign's Mars energy and natural career strengths.

## 💰 Wealth & Financial Currents
Discuss financial energy and money matters in 4-6 sentences. Is today favorable for investments, negotiations, or financial planning? How does Jupiter's influence affect abundance? What spending patterns should this sign be aware of?

## 🏥 Health & Vitality Guidance
Provide health and wellness insights in 4-6 sentences. Based on the sign's body association and today's planetary energy, what physical areas need attention? Suggest specific wellness practices, exercise types, or dietary considerations. Include mental health and stress management tips.

## 🧘 Spiritual & Inner Growth
Explore spiritual development opportunities in 4-6 sentences. What meditation, mindfulness, or spiritual practices align with today's energy? How can this sign deepen self-awareness? Reference the sign's chakra association and crystal recommendations.

## 🔮 Hidden Challenges & Shadow Work
Reveal potential pitfalls and unconscious patterns in 3-5 sentences. What shadow aspects of this sign might be triggered today? What self-sabotaging patterns should they watch for? How can they transform challenges into growth?

## ⏰ Timing & Key Moments
Identify optimal timing windows in 3-5 sentences. What hours or periods today are most auspicious for important activities? When should this sign rest or avoid major decisions? Include lucky elements (color, number, direction).

## ✨ Affirmation & Cosmic Message
Craft 2-3 personalized affirmations drawn from today's astrological energy. End with an inspiring cosmic message that honors this sign's unique journey and current growth phase.

After the 10 sections, also provide these scores and data in a JSON block:
\`\`\`json
{"overallScore": <1-100>, "loveScore": <1-100>, "careerScore": <1-100>, "wealthScore": <1-100>, "healthScore": <1-100>, "luckyColor": "<color>", "luckyNumber": <1-99>, "advice": "<one-line key advice>", "encouragement": "<one-line encouragement>"}
\`\`\``
        : `你是一位拥有30年经验的占星大师，融合西方热带占星术、古典希腊占星技法和现代心理占星学。你创作深入、多维度的每日星座运势，远超普通的运势预测。

重要规则：
- 基于星座的实际占星属性、旬守护星和当前行星过境进行解读
- 考虑月相、日主星、季节能量和任何逆行影响
- 每个维度提供深入分析（4-8句话以上），而非浅层总结
- 提供具体、可操作的建议——而非泛泛之谈
- 适当引用星座的神话起源、塔罗对应和元素本质
- 使用温暖但专业的语言，体现资深占星师的权威感
- 评分应基于实际行星影响有意义地变化（不要全是70-85）

格式要求（必须包含以下10个维度）：

## 🌌 宇宙能量概览
用4-6句话综合今日对该星座的整体能量特征。描述当前行星过境、月相和季节能量如何具体影响该星座。提及日主星的影响和任何值得注意的星象相位。

## 🪐 行星轨迹解析
用4-6句话解读影响该星座的主要行星过境。太阳当前位置如何与该星座的本命能量互动？水星的状态（顺行/逆行）对沟通意味着什么？金星如何影响今日的关系和财务？

## 💕 爱情与情感波动
用4-6句话提供详细的情感和恋爱预测。今日月相如何影响该星座的情感世界？哪些关系动态被凸显？为单身和恋爱中的人分别提供建议。引用该星座的金星位置和情感模式。

## 💼 事业与野心罗盘
用4-6句话分析事业和职业能量。今日过境如何影响工作表现、领导力和职业关系？该星座应注意哪些机会或挑战？联系该星座的火星能量和天然职业优势。

## 💰 财富与金融暗流
用4-6句话讨论财务能量和金钱事务。今日是否适合投资、谈判或财务规划？木星的影响如何影响丰盛？该星座应注意哪些消费模式？

## 🏥 健康与活力指引
用4-6句话提供健康和养生洞见。基于该星座的身体关联和今日行星能量，哪些身体区域需要关注？建议具体的养生方法、运动类型或饮食考虑。包括心理健康和压力管理建议。

## 🧘 灵性与内在成长
用4-6句话探索灵性发展机会。哪些冥想、正念或灵性修炼与今日能量匹配？该星座如何深化自我觉察？引用该星座的脉轮关联和水晶推荐。

## 🔮 潜在挑战与阴影工作
用3-5句话揭示潜在陷阱和无意识模式。该星座的哪些阴影面可能在今日被触发？应警惕哪些自我破坏模式？如何将挑战转化为成长？

## ⏰ 时机与关键时刻
用3-5句话识别最佳时机窗口。今日哪些时段最适合重要活动？何时应休息或避免重大决策？包括幸运元素（颜色、数字、方位）。

## ✨ 肯定语与宇宙寄语
基于今日星象能量制作2-3条个性化肯定语。以鼓舞人心的宇宙寄语收尾，尊重该星座独特的旅程和当前成长阶段。

在10个维度之后，还需提供以下评分和数据的JSON块：
\`\`\`json
{"overallScore": <1-100>, "loveScore": <1-100>, "careerScore": <1-100>, "wealthScore": <1-100>, "healthScore": <1-100>, "luckyColor": "<颜色>", "luckyNumber": <1-99>, "advice": "<一句话核心建议>", "encouragement": "<一句话鼓励>"}
\`\`\``;

      const userPrompt = isEn
        ? `Generate today's multi-dimensional deep horoscope for ${zodiacSign.name}.

${zodiacProfile}

${planetaryContext}

Please provide a professional, in-depth astrological analysis with all 10 dimensions followed by the JSON scores block.`
        : `生成${zodiacSign.nameChinese}今日多维度深度运势。

${zodiacProfile}

${planetaryContext}

请提供专业、深入的占星分析，包含全部10个维度，最后附上JSON评分块。`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      const rawContentRaw = response.choices[0]?.message?.content || "";
      const rawContent = typeof rawContentRaw === "string" ? rawContentRaw : "";

      // Extract JSON scores from the end of the response
      let scores = {
        overallScore: 75,
        loveScore: 70,
        careerScore: 80,
        wealthScore: 65,
        healthScore: 75,
        luckyColor: isEn ? "Blue" : "蓝色",
        luckyNumber: 7,
        advice: isEn ? "Trust the cosmic flow today." : "今日信任宇宙的流动。",
        encouragement: isEn ? "Every step forward is progress." : "每一步前行都是进步。",
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

      // Extract the deep analysis content (everything before the JSON block)
      const deepAnalysis = rawContent.replace(/```json[\s\S]*?```/g, "").trim();

      // Cache in database (language-scoped key)
      if (db) {
        await db.insert(horoscopes).values({
          zodiacSign: cacheSignKey,
          periodType: "daily",
          periodDate: today,
          overallScore: scores.overallScore,
          loveScore: scores.loveScore,
          careerScore: scores.careerScore,
          wealthScore: scores.wealthScore,
          healthScore: scores.healthScore,
          content: scores.advice,
          deepAnalysis: deepAnalysis,
          advice: scores.advice,
          luckyColor: scores.luckyColor,
          luckyNumber: scores.luckyNumber,
        });

        // Update growth
        if (ctx.user?.id) {
          const [existingGrowth] = await db
            .select()
            .from(userGrowth)
            .where(eq(userGrowth.userId, ctx.user.id))
            .limit(1);

          if (existingGrowth) {
            await db.update(userGrowth)
              .set({
                spiritualGrowth: sql`${userGrowth.spiritualGrowth} + 1`,
                totalPoints: sql`${userGrowth.totalPoints} + 2`,
              })
              .where(eq(userGrowth.userId, ctx.user.id));
          }
        }
      }

      return {
        content: scores.advice,
        deepAnalysis: deepAnalysis,
        overall: scores.overallScore,
        love: { score: scores.loveScore, advice: "" },
        career: { score: scores.careerScore, advice: "" },
        wealth: { score: scores.wealthScore, advice: "" },
        health: "",
        encouragement: scores.encouragement,
        luckyColor: scores.luckyColor,
        luckyNumber: scores.luckyNumber,
        advice: scores.advice,
        signData: {
          name: zodiacSign.name,
          nameChinese: zodiacSign.nameChinese,
          symbol: zodiacSign.symbol,
          element: zodiacSign.element,
          elementChinese: zodiacSign.elementChinese,
          rulingPlanet: zodiacSign.rulingPlanet,
          rulingPlanetChinese: zodiacSign.rulingPlanetChinese,
        },
      };
    }),
});
