/**
 * BaZi Professional Calculation Engine
 * 
 * Wraps the @aharris02/bazi-calculator-by-alvamind library
 * and provides structured output for the Fortune Insight platform.
 * 
 * This is the ALGORITHM layer — deterministic calculations based on
 * Chinese metaphysics, NOT AI generation. AI is used only for the
 * interpretation layer on top of these results.
 */

// @ts-ignore - no types available for this package
import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind';
import { toDate } from 'date-fns-tz';

// ============================================================
// Types
// ============================================================

export interface BaziPillar {
  chinese: string;          // e.g. "庚午"
  heavenlyStem: string;     // e.g. "庚"
  earthlyBranch: string;    // e.g. "午"
  stemElement: string;      // e.g. "METAL"
  branchElement: string;    // e.g. "FIRE"
  animal: string;           // e.g. "Horse"
  stemYinYang: string;      // "Yin" | "Yang"
  hiddenStems: HiddenStem[];
  lifeCycle: string;        // e.g. "Bath", "Crown", "Tomb"
  naYin: string;            // 纳音 e.g. "Road earth"
}

export interface HiddenStem {
  character: string;        // e.g. "丁"
  element: string;          // e.g. "FIRE"
  yinYang: string;
  tenGod?: {
    name: string;           // e.g. "Qi Sha"
    chinese: string;        // e.g. "七殺"
    relationship: string;   // e.g. "Control"
  };
}

export interface FiveElementsDistribution {
  METAL: number;
  WOOD: number;
  WATER: number;
  FIRE: number;
  EARTH: number;
}

export interface DayMasterInfo {
  character: string;        // e.g. "庚"
  element: string;          // e.g. "METAL"
  yinYang: string;          // "Yin" | "Yang"
  strength: string;         // "Strong" | "Weak"
  favorableElements: string[];
  unfavorableElements: string[];
}

export interface LuckPillar {
  number: number;
  chinese: string;          // e.g. "壬午"
  stemCharacter: string;
  branchCharacter: string;
  stemElement: string;
  branchElement: string;
  animal: string;
  ageStart: number;
  yearStart: number;
  yearEnd: number;
  hiddenStems: HiddenStem[];
}

export interface SpecialStar {
  name: string;
  chinese: string;
  branches: string[];       // Which branches contain this star
}

export interface BranchInteraction {
  type: string;             // e.g. "Branch6Combo", "BranchClash"
  description: string;
  participants: string[];   // e.g. ["Year(午)", "Hour(未)"]
  transformation?: string;  // Element it transforms to
  isFavorable?: boolean;
}

export interface BaziChart {
  // Core Four Pillars
  yearPillar: BaziPillar;
  monthPillar: BaziPillar;
  dayPillar: BaziPillar;
  hourPillar: BaziPillar;
  
  // Day Master Analysis
  dayMaster: DayMasterInfo;
  
  // Five Elements
  fiveElements: FiveElementsDistribution;
  dominantElement: string;
  weakestElement: string;
  
  // Special Stars
  nobleman: SpecialStar;
  intelligence: SpecialStar;
  skyHorse: SpecialStar;
  peachBlossom: SpecialStar;
  
  // Luck Pillars (大运)
  luckPillars: LuckPillar[];
  luckPillarDirection: 'Forward' | 'Backward';
  luckPillarStartAge: number;
  
  // Branch Interactions
  interactions: BranchInteraction[];
  
  // Life Gua & Eight Mansions
  lifeGua: number;
  eightMansions: any;
  
  // Display string
  chartString: string;      // e.g. "庚午年 辛巳月 庚辰日 癸未時"
  
  // Birth info echo
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  gender: string;
  timezone: string;
}

// ============================================================
// Five Elements Chinese Names
// ============================================================

const ELEMENT_CHINESE: Record<string, string> = {
  METAL: '金',
  WOOD: '木',
  WATER: '水',
  FIRE: '火',
  EARTH: '土',
};

const ELEMENT_ENGLISH: Record<string, string> = {
  METAL: 'Metal',
  WOOD: 'Wood',
  WATER: 'Water',
  FIRE: 'Fire',
  EARTH: 'Earth',
};

const ANIMAL_CHINESE: Record<string, string> = {
  Rat: '鼠', Ox: '牛', Tiger: '虎', Rabbit: '兔',
  Dragon: '龙', Snake: '蛇', Horse: '马', Goat: '羊',
  Monkey: '猴', Rooster: '鸡', Dog: '狗', Pig: '猪',
};

// ============================================================
// Ten Gods & Life Cycle Chinese Names
// ============================================================

const LIFE_CYCLE_CHINESE: Record<string, string> = {
  'Birth': '长生',
  'Bath': '沐浴',
  'Crown': '冠带',
  'Official': '临官',
  'Emperor': '帝旺',
  'Decline': '衰',
  'Sick': '病',
  'Death': '死',
  'Tomb': '墓',
  'Extinct': '绝',
  'Embryo': '胎',
  'Nurture': '养',
};

// ============================================================
// Current Year Pillar Calculation
// ============================================================

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_ELEMENTS: Record<string, string> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
};
const BRANCH_ELEMENTS: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

function getYearPillar(year: number): { stem: string; branch: string; stemElement: string; branchElement: string } {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  const stem = HEAVENLY_STEMS[stemIndex >= 0 ? stemIndex : stemIndex + 10];
  const branch = EARTHLY_BRANCHES[branchIndex >= 0 ? branchIndex : branchIndex + 12];
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENTS[stem] || '',
    branchElement: BRANCH_ELEMENTS[branch] || '',
  };
}

// Calculate Ten God relationship between two stems
function getTenGodRelation(dayStem: string, targetStem: string): string {
  const dayEl = STEM_ELEMENTS[dayStem];
  const targetEl = STEM_ELEMENTS[targetStem];
  if (!dayEl || !targetEl) return '';
  
  const dayIdx = HEAVENLY_STEMS.indexOf(dayStem);
  const targetIdx = HEAVENLY_STEMS.indexOf(targetStem);
  const samePolarity = (dayIdx % 2) === (targetIdx % 2);
  
  const generates: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const controls: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  
  if (dayEl === targetEl) return samePolarity ? '比肩' : '劫财';
  if (generates[dayEl] === targetEl) return samePolarity ? '食神' : '伤官';
  if (generates[targetEl] === dayEl) return samePolarity ? '偏印' : '正印';
  if (controls[dayEl] === targetEl) return samePolarity ? '偏财' : '正财';
  if (controls[targetEl] === dayEl) return samePolarity ? '七杀' : '正官';
  return '';
}

// ============================================================
// Helper: Extract pillar data
// ============================================================

function extractPillar(main: any, detailed: any): BaziPillar {
  const hiddenStems: HiddenStem[] = (detailed?.hiddenStems || []).map((hs: any) => ({
    character: hs.character,
    element: hs.elementType,
    yinYang: hs.yinYang,
    tenGod: hs.tenGod ? {
      name: hs.tenGod.name,
      chinese: hs.tenGod.chinese,
      relationship: hs.tenGod.relationship,
    } : undefined,
  }));

  return {
    chinese: main.chinese,
    heavenlyStem: main.chinese?.[0] || '',
    earthlyBranch: main.chinese?.[1] || '',
    stemElement: main.element,
    branchElement: main.branch?.element || '',
    animal: main.animal,
    stemYinYang: detailed?.yinYang || '',
    hiddenStems,
    lifeCycle: detailed?.lifeCycle || '',
    naYin: detailed?.ganZhi?.name || '',
  };
}

// ============================================================
// Main Calculation Function
// ============================================================

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  gender: 'male' | 'female',
  timezone: string = 'Asia/Shanghai'
): BaziChart {
  // Build date string and create timezone-aware Date
  const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  const birthDate = toDate(dateString, { timeZone: timezone });

  // Instantiate the calculator
  const calculator = new BaziCalculator(birthDate, gender, timezone, true);
  const analysis = calculator.getCompleteAnalysis();

  if (!analysis) {
    throw new Error('BaZi calculation failed — invalid date or parameters');
  }

  const { mainPillars, basicAnalysis, detailedPillars, luckPillars, interactions } = analysis;

  // Extract Four Pillars
  const yearPillar = extractPillar(mainPillars.year, detailedPillars?.year);
  const monthPillar = extractPillar(mainPillars.month, detailedPillars?.month);
  const dayPillar = extractPillar(mainPillars.day, detailedPillars?.day);
  const hourPillar = extractPillar(mainPillars.time, (detailedPillars as any)?.time || (detailedPillars as any)?.hour);

  // Five Elements Distribution
  const fiveFactors = (basicAnalysis?.fiveFactors || {}) as any;
  const fiveElements: FiveElementsDistribution = {
    METAL: fiveFactors.METAL || 0,
    WOOD: fiveFactors.WOOD || 0,
    WATER: fiveFactors.WATER || 0,
    FIRE: fiveFactors.FIRE || 0,
    EARTH: fiveFactors.EARTH || 0,
  };

  // Find dominant and weakest
  const elementEntries = Object.entries(fiveElements) as [string, number][];
  elementEntries.sort((a, b) => b[1] - a[1]);
  const dominantElement = elementEntries[0][0];
  const weakestElement = elementEntries[elementEntries.length - 1][0];

  // Day Master
  const dm = basicAnalysis?.dayMaster || {} as any;
  const strengthData = basicAnalysis?.dayMasterStrength as any;
  const favorableData = basicAnalysis?.favorableElements as any;
  const dayMaster: DayMasterInfo = {
    character: dm.stem || dayPillar.heavenlyStem,
    element: dm.element || dayPillar.stemElement,
    yinYang: dm.nature || dayPillar.stemYinYang,
    strength: typeof strengthData === 'string' ? strengthData : (strengthData?.strength || 'Unknown'),
    favorableElements: Array.isArray(favorableData) ? favorableData : (favorableData?.primary || []),
    unfavorableElements: Array.isArray(favorableData) ? [] : (favorableData?.unfavorable || []),
  };

  // Special Stars
  const extractStar = (starData: any, name: string, chinese: string): SpecialStar => ({
    name,
    chinese,
    branches: Array.isArray(starData) ? starData.map((s: any) => typeof s === 'string' ? s : (s.character || String(s))) : [],
  });

  const nobleman = extractStar(basicAnalysis?.nobleman, 'Nobleman', '天乙贵人');
  const intelligence = extractStar(basicAnalysis?.intelligence, 'Intelligence', '文昌星');
  const skyHorse = extractStar(basicAnalysis?.skyHorse, 'Sky Horse', '驿马星');
  const peachBlossom = extractStar(basicAnalysis?.peachBlossom, 'Peach Blossom', '桃花星');

  // Luck Pillars
  const luckPillarList: LuckPillar[] = (luckPillars?.pillars || []).map((lp: any) => ({
    number: lp.number,
    chinese: `${lp.heavenlyStem?.character || ''}${lp.earthlyBranch?.character || ''}`,
    stemCharacter: lp.heavenlyStem?.character || '',
    branchCharacter: lp.earthlyBranch?.character || '',
    stemElement: lp.heavenlyStem?.elementType || '',
    branchElement: lp.earthlyBranch?.elementType || '',
    animal: lp.earthlyBranch?.animal || '',
    ageStart: lp.ageStart,
    yearStart: lp.yearStart,
    yearEnd: lp.yearEnd,
    hiddenStems: (lp.earthlyBranch?.hiddenStems || []).map((hs: any) => ({
      character: hs.character,
      element: hs.elementType,
      yinYang: hs.yinYang,
      tenGod: hs.tenGod ? {
        name: hs.tenGod.name,
        chinese: hs.tenGod.chinese,
        relationship: hs.tenGod.relationship,
      } : undefined,
    })),
  }));

  // Branch Interactions
  const branchInteractions: BranchInteraction[] = (interactions || []).map((i: any) => ({
    type: i.type,
    description: i.description,
    participants: (i.participants || []).map((p: any) => `${p.pillar}(${p.elementChar})`),
    transformation: i.potentialTransformation,
    isFavorable: i.involvesFavorableElement,
  }));

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster,
    fiveElements,
    dominantElement,
    weakestElement,
    nobleman,
    intelligence,
    skyHorse,
    peachBlossom,
    luckPillars: luckPillarList,
    luckPillarDirection: luckPillars?.incrementRule === 1 ? 'Forward' : 'Backward',
    luckPillarStartAge: luckPillars?.startAgeYears || 0,
    interactions: branchInteractions,
    lifeGua: basicAnalysis?.lifeGua || 0,
    eightMansions: basicAnalysis?.eightMansions || null,
    chartString: calculator.toString(),
    birthYear: year,
    birthMonth: month,
    birthDay: day,
    birthHour: hour,
    birthMinute: minute,
    gender,
    timezone,
  };
}

// ============================================================
// Format BaZi chart for AI interpretation prompt
// ============================================================

export function formatBaziForPrompt(chart: BaziChart, language: 'en' | 'zh' = 'en'): string {
  const isZh = language === 'zh';
  
  const elementName = (e: string) => isZh ? (ELEMENT_CHINESE[e] || e) : (ELEMENT_ENGLISH[e] || e);
  const animalName = (a: string) => isZh ? (ANIMAL_CHINESE[a] || a) : a;
  const lifeCycleName = (lc: string) => isZh ? (LIFE_CYCLE_CHINESE[lc] || lc) : lc;

  const formatPillar = (label: string, p: BaziPillar) => {
    const tenGods = p.hiddenStems
      .filter(hs => hs.tenGod)
      .map(hs => `${hs.character}(${isZh ? hs.tenGod!.chinese : hs.tenGod!.name})`)
      .join(', ');
    return `${label}: ${p.chinese} | ${isZh ? '天干' : 'Stem'}: ${p.heavenlyStem}(${elementName(p.stemElement)}) | ${isZh ? '地支' : 'Branch'}: ${p.earthlyBranch}(${elementName(p.branchElement)}, ${animalName(p.animal)}) | ${isZh ? '藏干' : 'Hidden'}: ${tenGods || 'N/A'} | ${isZh ? '纳音' : 'NaYin'}: ${p.naYin} | ${isZh ? '生旺死绝' : 'Life Cycle'}: ${lifeCycleName(p.lifeCycle)}`;
  };

  const sections: string[] = [];

  // Header
  sections.push(isZh ? '【四柱八字命盘】' : '[Four Pillars BaZi Chart]');
  sections.push(chart.chartString);
  sections.push(`${isZh ? '性别' : 'Gender'}: ${chart.gender === 'male' ? (isZh ? '男' : 'Male') : (isZh ? '女' : 'Female')}`);
  sections.push(`${isZh ? '出生' : 'Birth'}: ${chart.birthYear}-${chart.birthMonth}-${chart.birthDay} ${chart.birthHour}:${String(chart.birthMinute).padStart(2, '0')}`);
  sections.push('');

  // Four Pillars
  sections.push(formatPillar(isZh ? '年柱' : 'Year Pillar', chart.yearPillar));
  sections.push(formatPillar(isZh ? '月柱' : 'Month Pillar', chart.monthPillar));
  sections.push(formatPillar(isZh ? '日柱' : 'Day Pillar', chart.dayPillar));
  sections.push(formatPillar(isZh ? '时柱' : 'Hour Pillar', chart.hourPillar));
  sections.push('');

  // Day Master
  sections.push(isZh ? '【日主分析】' : '[Day Master Analysis]');
  sections.push(`${isZh ? '日主' : 'Day Master'}: ${chart.dayMaster.character} (${elementName(chart.dayMaster.element)}, ${chart.dayMaster.yinYang})`);
  sections.push(`${isZh ? '日主强弱' : 'Strength'}: ${chart.dayMaster.strength}`);
  sections.push(`${isZh ? '喜用神' : 'Favorable Elements'}: ${chart.dayMaster.favorableElements.map(elementName).join(', ') || 'N/A'}`);
  if (chart.dayMaster.unfavorableElements.length > 0) {
    sections.push(`${isZh ? '忌神' : 'Unfavorable Elements'}: ${chart.dayMaster.unfavorableElements.map(elementName).join(', ')}`);
  }
  sections.push('');

  // Five Elements
  sections.push(isZh ? '【五行分布】' : '[Five Elements Distribution]');
  const fe = chart.fiveElements;
  sections.push(`${elementName('METAL')}: ${fe.METAL} | ${elementName('WOOD')}: ${fe.WOOD} | ${elementName('WATER')}: ${fe.WATER} | ${elementName('FIRE')}: ${fe.FIRE} | ${elementName('EARTH')}: ${fe.EARTH}`);
  sections.push(`${isZh ? '最旺' : 'Dominant'}: ${elementName(chart.dominantElement)} | ${isZh ? '最弱' : 'Weakest'}: ${elementName(chart.weakestElement)}`);
  sections.push('');

  // Ten Gods Summary
  sections.push(isZh ? '【十神汇总】' : '[Ten Gods Summary]');
  const tenGodCount: Record<string, number> = {};
  [chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar].forEach(p => {
    p.hiddenStems.forEach(hs => {
      if (hs.tenGod) {
        const key = isZh ? hs.tenGod.chinese : hs.tenGod.name;
        tenGodCount[key] = (tenGodCount[key] || 0) + 1;
      }
    });
  });
  const tenGodSummary = Object.entries(tenGodCount).map(([name, count]) => `${name}x${count}`).join(', ');
  sections.push(tenGodSummary || 'N/A');
  sections.push('');

  // NaYin Summary
  sections.push(isZh ? '【纳音五行】' : '[NaYin Five Elements]');
  sections.push(`${isZh ? '年柱纳音' : 'Year NaYin'}: ${chart.yearPillar.naYin}`);
  sections.push(`${isZh ? '月柱纳音' : 'Month NaYin'}: ${chart.monthPillar.naYin}`);
  sections.push(`${isZh ? '日柱纳音' : 'Day NaYin'}: ${chart.dayPillar.naYin}`);
  sections.push(`${isZh ? '时柱纳音' : 'Hour NaYin'}: ${chart.hourPillar.naYin}`);
  sections.push('');

  // Life Cycle Summary
  sections.push(isZh ? '【日主生旺死绝】' : '[Day Master Life Cycle in Each Branch]');
  sections.push(`${isZh ? '年支' : 'Year'}: ${lifeCycleName(chart.yearPillar.lifeCycle)} | ${isZh ? '月支' : 'Month'}: ${lifeCycleName(chart.monthPillar.lifeCycle)} | ${isZh ? '日支' : 'Day'}: ${lifeCycleName(chart.dayPillar.lifeCycle)} | ${isZh ? '时支' : 'Hour'}: ${lifeCycleName(chart.hourPillar.lifeCycle)}`);
  sections.push('');

  // Special Stars
  sections.push(isZh ? '【神煞】' : '[Special Stars]');
  sections.push(`${chart.nobleman.chinese}: ${chart.nobleman.branches.join(', ') || 'N/A'}`);
  sections.push(`${chart.intelligence.chinese}: ${chart.intelligence.branches.join(', ') || 'N/A'}`);
  sections.push(`${chart.skyHorse.chinese}: ${chart.skyHorse.branches.join(', ') || 'N/A'}`);
  sections.push(`${chart.peachBlossom.chinese}: ${chart.peachBlossom.branches.join(', ') || 'N/A'}`);
  sections.push('');

  // Luck Pillars
  sections.push(isZh ? `【大运】(${chart.luckPillarDirection === 'Forward' ? '顺行' : '逆行'}, ${chart.luckPillarStartAge}岁起运)` : `[Luck Pillars] (${chart.luckPillarDirection}, starting age ${chart.luckPillarStartAge})`);
  chart.luckPillars.slice(0, 10).forEach(lp => {
    sections.push(`  ${lp.ageStart}-${lp.ageStart + 9}${isZh ? '岁' : 'y'}: ${lp.chinese} (${elementName(lp.stemElement)}/${elementName(lp.branchElement)}, ${animalName(lp.animal)})`);
  });
  sections.push('');

  // Branch Interactions
  if (chart.interactions.length > 0) {
    sections.push(isZh ? '【地支关系】' : '[Branch Interactions]');
    chart.interactions.forEach(i => {
      const favorable = i.isFavorable !== undefined ? (i.isFavorable ? ' (吉)' : ' (凶)') : '';
      sections.push(`  ${i.type}: ${i.participants.join(' - ')}${i.transformation ? ` -> ${elementName(i.transformation)}` : ''}${favorable}`);
    });
    sections.push('');
  }

  // Current Year Analysis
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const currentYearPillar = getYearPillar(currentYear);
  const nextYearPillar = getYearPillar(nextYear);
  const dayStem = chart.dayPillar.heavenlyStem;
  
  sections.push(isZh ? '【流年信息】' : '[Current Year Info]');
  const curRelation = getTenGodRelation(dayStem, currentYearPillar.stem);
  const nextRelation = getTenGodRelation(dayStem, nextYearPillar.stem);
  
  if (isZh) {
    sections.push(`${currentYear}年: ${currentYearPillar.stem}${currentYearPillar.branch}年 (${currentYearPillar.stemElement}/${currentYearPillar.branchElement}) | 流年天干与日主关系: ${curRelation || '未知'}`);
    sections.push(`${nextYear}年: ${nextYearPillar.stem}${nextYearPillar.branch}年 (${nextYearPillar.stemElement}/${nextYearPillar.branchElement}) | 流年天干与日主关系: ${nextRelation || '未知'}`);
  } else {
    sections.push(`${currentYear}: ${currentYearPillar.stem}${currentYearPillar.branch} Year (${currentYearPillar.stemElement}/${currentYearPillar.branchElement}) | Year Stem vs Day Master: ${curRelation || 'Unknown'}`);
    sections.push(`${nextYear}: ${nextYearPillar.stem}${nextYearPillar.branch} Year (${nextYearPillar.stemElement}/${nextYearPillar.branchElement}) | Year Stem vs Day Master: ${nextRelation || 'Unknown'}`);
  }
  
  // Find current luck pillar
  const currentAge = currentYear - chart.birthYear;
  const currentLuckPillar = chart.luckPillars.find(lp => currentAge >= lp.ageStart && currentAge < lp.ageStart + 10);
  if (currentLuckPillar) {
    if (isZh) {
      sections.push(`当前大运: ${currentLuckPillar.chinese} (${currentLuckPillar.ageStart}-${currentLuckPillar.ageStart + 9}岁, ${elementName(currentLuckPillar.stemElement)}/${elementName(currentLuckPillar.branchElement)})`);
    } else {
      sections.push(`Current Luck Pillar: ${currentLuckPillar.chinese} (Age ${currentLuckPillar.ageStart}-${currentLuckPillar.ageStart + 9}, ${elementName(currentLuckPillar.stemElement)}/${elementName(currentLuckPillar.branchElement)})`);
    }
  }

  return sections.join('\n');
}
