/** Rider–Waite Major Arcana — rule-based meanings (no LLM). */

export const MAJORS = [
  {
    id: 0,
    name_en: "The Fool",
    name_zh: "愚者",
    keywords_en: ["beginnings", "faith", "spontaneity"],
    keywords_zh: ["开始", "信任", "随性"],
    upright_en: "A fresh path opens. Trust the first step more than the map.",
    upright_zh: "新路正在展开。比起地图，更要信任迈出的第一步。",
    reversed_en: "Hesitation or recklessness — pause before leaping.",
    reversed_zh: "犹豫或冲动——跃出前先停一秒。",
  },
  {
    id: 1,
    name_en: "The Magician",
    name_zh: "魔术师",
    keywords_en: ["focus", "skill", "will"],
    keywords_zh: ["专注", "技能", "意志"],
    upright_en: "You already have tools. Align intention with action.",
    upright_zh: "工具已在手。把意图与行动对齐。",
    reversed_en: "Scattered energy or half-truths — simplify and be honest.",
    reversed_zh: "能量分散或言不由衷——简化，并诚实。",
  },
  {
    id: 2,
    name_en: "The High Priestess",
    name_zh: "女祭司",
    keywords_en: ["intuition", "mystery", "stillness"],
    keywords_zh: ["直觉", "神秘", "静心"],
    upright_en: "Listen inward. Not every answer is public yet.",
    upright_zh: "向内听。不是每个答案都适合立刻公开。",
    reversed_en: "Noise drowning intuition — protect quiet time.",
    reversed_zh: "噪音盖过直觉——保护独处与安静。",
  },
  {
    id: 3,
    name_en: "The Empress",
    name_zh: "女皇",
    keywords_en: ["nurture", "abundance", "body"],
    keywords_zh: ["滋养", "丰盛", "身体"],
    upright_en: "Growth through care — people, projects, or yourself.",
    upright_zh: "用照顾促成生长——对人、对事、对自己。",
    reversed_en: "Overgiving or neglect of the body — restore balance.",
    reversed_zh: "过度付出或忽略身体——先找回平衡。",
  },
  {
    id: 4,
    name_en: "The Emperor",
    name_zh: "皇帝",
    keywords_en: ["structure", "boundary", "authority"],
    keywords_zh: ["结构", "边界", "权威"],
    upright_en: "Build order. Clear rules free energy for what matters.",
    upright_zh: "建立秩序。清晰规则把精力还给真正重要的事。",
    reversed_en: "Rigidity or control struggles — loosen the grip.",
    reversed_zh: "僵硬或控制欲——松一松握紧的手。",
  },
  {
    id: 5,
    name_en: "The Hierophant",
    name_zh: "教皇",
    keywords_en: ["tradition", "mentor", "shared values"],
    keywords_zh: ["传统", "导师", "共同价值"],
    upright_en: "Learn from a trusted system or teacher.",
    upright_zh: "向可信的体系或老师学习。",
    reversed_en: "Question dogma; find your own rite.",
    reversed_zh: "质疑教条；找到属于自己的仪式。",
  },
  {
    id: 6,
    name_en: "The Lovers",
    name_zh: "恋人",
    keywords_en: ["choice", "alignment", "bond"],
    keywords_zh: ["选择", "契合", "连结"],
    upright_en: "A values-aligned choice — heart and head can meet.",
    upright_zh: "价值对齐的选择——心与脑可以相遇。",
    reversed_en: "Misalignment or avoidance of a real choice.",
    reversed_zh: "价值错位，或回避真正的选择。",
  },
  {
    id: 7,
    name_en: "The Chariot",
    name_zh: "战车",
    keywords_en: ["drive", "direction", "discipline"],
    keywords_zh: ["动力", "方向", "纪律"],
    upright_en: "Hold the reins. Progress needs both speed and steering.",
    upright_zh: "握紧缰绳。前进需要速度，也需要方向。",
    reversed_en: "Scattered will — pick one lane.",
    reversed_zh: "意志分散——先选一条车道。",
  },
  {
    id: 8,
    name_en: "Strength",
    name_zh: "力量",
    keywords_en: ["courage", "soft power", "patience"],
    keywords_zh: ["勇气", "柔力", "耐心"],
    upright_en: "Gentle firmness tames what force cannot.",
    upright_zh: "柔而坚定，能驯服蛮力做不到的事。",
    reversed_en: "Self-doubt — remember past times you stayed kind under pressure.",
    reversed_zh: "自我怀疑——记得那些你曾在压力下仍保持温柔的时刻。",
  },
  {
    id: 9,
    name_en: "The Hermit",
    name_zh: "隐者",
    keywords_en: ["solitude", "insight", "pause"],
    keywords_zh: ["独处", "洞见", "暂停"],
    upright_en: "Step back to see clearly. Wisdom needs space.",
    upright_zh: "退一步才看得清。智慧需要空间。",
    reversed_en: "Isolation past usefulness — rejoin carefully.",
    reversed_zh: "独处过了头——谨慎地重新连结。",
  },
  {
    id: 10,
    name_en: "Wheel of Fortune",
    name_zh: "命运之轮",
    keywords_en: ["cycle", "turn", "timing"],
    keywords_zh: ["周期", "转折", "时机"],
    upright_en: "A turn in the cycle — ride change without clinging.",
    upright_zh: "周期在转——拥抱变化，不执着旧局。",
    reversed_en: "Resistance to change delays the next chapter.",
    reversed_zh: "抗拒变化，会推迟下一章。",
  },
  {
    id: 11,
    name_en: "Justice",
    name_zh: "正义",
    keywords_en: ["truth", "fairness", "consequence"],
    keywords_zh: ["真相", "公平", "因果"],
    upright_en: "Weigh honestly. Fair outcomes follow clear facts.",
    upright_zh: "诚实权衡。清晰事实带来公正结果。",
    reversed_en: "Bias or unfinished accounts — face them.",
    reversed_zh: "偏见或未了结的账——正视它们。",
  },
  {
    id: 12,
    name_en: "The Hanged Man",
    name_zh: "倒吊人",
    keywords_en: ["surrender", "new angle", "wait"],
    keywords_zh: ["放下", "新视角", "等待"],
    upright_en: "Pause is productive. See the scene upside down.",
    upright_zh: "暂停也是一种前进。把场景倒过来看。",
    reversed_en: "Stalling that is no longer sacrifice — choose a side.",
    reversed_zh: "停滞已不是牺牲——该做选择了。",
  },
  {
    id: 13,
    name_en: "Death",
    name_zh: "死神",
    keywords_en: ["ending", "release", "renewal"],
    keywords_zh: ["结束", "释放", "更新"],
    upright_en: "Something completes so something else can live.",
    upright_zh: "有些结束，是为了让别的开始活过来。",
    reversed_en: "Clinging to a finished form blocks renewal.",
    reversed_zh: "紧抓已结束的形态，会挡住更新。",
  },
  {
    id: 14,
    name_en: "Temperance",
    name_zh: "节制",
    keywords_en: ["blend", "moderation", "healing"],
    keywords_zh: ["调和", "适度", "疗愈"],
    upright_en: "Mix opposites slowly. Healing is a pour, not a flood.",
    upright_zh: "慢慢调和对立。疗愈是倾注，不是洪水。",
    reversed_en: "Excess or impatience — restore the middle path.",
    reversed_zh: "过度或不耐——回到中道。",
  },
  {
    id: 15,
    name_en: "The Devil",
    name_zh: "恶魔",
    keywords_en: ["attachment", "shadow", "temptation"],
    keywords_zh: ["执着", "阴影", "诱惑"],
    upright_en: "Name the chain. Awareness loosens what denial tightens.",
    upright_zh: "先说出那条链子。觉察能松开否认勒紧的东西。",
    reversed_en: "Breaking free begins — keep walking out.",
    reversed_zh: "挣脱已经开始——继续往外走。",
  },
  {
    id: 16,
    name_en: "The Tower",
    name_zh: "高塔",
    keywords_en: ["shock", "truth", "rebuild"],
    keywords_zh: ["震动", "真相", "重建"],
    upright_en: "False structure falls. What remains can be real.",
    upright_zh: "虚假结构倒塌。留下的才可能是真的。",
    reversed_en: "Delayed collapse or fear of change — brace, then rebuild.",
    reversed_zh: "延迟的崩塌或对变化的恐惧——先稳住，再重建。",
  },
  {
    id: 17,
    name_en: "The Star",
    name_zh: "星星",
    keywords_en: ["hope", "clarity", "renewal"],
    keywords_zh: ["希望", "清明", "更新"],
    upright_en: "After the storm, quiet hope. Follow the small light.",
    upright_zh: "风暴后是安静的希望。跟着那点小光走。",
    reversed_en: "Dimmed faith — rest, then look up again.",
    reversed_zh: "信心变淡——先休息，再抬头。",
  },
  {
    id: 18,
    name_en: "The Moon",
    name_zh: "月亮",
    keywords_en: ["uncertainty", "dream", "emotion"],
    keywords_zh: ["不确定", "梦境", "情绪"],
    upright_en: "Foggy path. Trust feelings as data, not as verdicts.",
    upright_zh: "路径有雾。把情绪当数据，不要当判决。",
    reversed_en: "Illusions thinning — reality is kinder than the fear story.",
    reversed_zh: "幻觉在散——现实往往比恐惧故事更温和。",
  },
  {
    id: 19,
    name_en: "The Sun",
    name_zh: "太阳",
    keywords_en: ["vitality", "joy", "visibility"],
    keywords_zh: ["活力", "喜悦", "被看见"],
    upright_en: "Warm clarity. Share success without shrinking.",
    upright_zh: "温暖而清晰。分享成功，不必缩小自己。",
    reversed_en: "Temporary cloud over joy — the light is still yours.",
    reversed_zh: "喜悦暂时被云遮住——光仍属于你。",
  },
  {
    id: 20,
    name_en: "Judgement",
    name_zh: "审判",
    keywords_en: ["calling", "review", "rise"],
    keywords_zh: ["召唤", "复盘", "升起"],
    upright_en: "A wake-up call. Integrate the past and step up.",
    upright_zh: "一声唤醒。整合过去，再站起来。",
    reversed_en: "Self-judgment loop — forgive enough to move.",
    reversed_zh: "自我审判循环——原谅到能继续走。",
  },
  {
    id: 21,
    name_en: "The World",
    name_zh: "世界",
    keywords_en: ["completion", "wholeness", "threshold"],
    keywords_zh: ["完成", "圆满", "门槛"],
    upright_en: "A cycle completes. Celebrate, then choose the next world.",
    upright_zh: "一个周期完成。庆祝，再选下一个世界。",
    reversed_en: "Almost there — close the last open loop.",
    reversed_zh: "就差一步——先合上最后一个开环。",
  },
];

export const DISCLAIMER_EN =
  "Educational and entertainment only — not medical, legal, financial, or professional advice.";
export const DISCLAIMER_ZH =
  "仅供娱乐与自我反思，不构成医疗、法律、财务或专业建议。";

/**
 * @param {{ question?: string, language?: string }} opts
 */
export function drawSingleCard(opts = {}) {
  const lang = opts.language === "en" ? "en" : "zh";
  const q = String(opts.question || "").trim();
  // Deterministic-ish seed from question + UTC date for same-day stability
  const day = new Date().toISOString().slice(0, 10);
  let seed = hash(`${day}|${q}|preview`);
  const idx = seed % MAJORS.length;
  seed = (seed * 1103515245 + 12345) >>> 0;
  const upright = seed % 2 === 0;
  const base = MAJORS[idx];
  const meaning =
    lang === "en"
      ? upright
        ? base.upright_en
        : base.reversed_en
      : upright
        ? base.upright_zh
        : base.reversed_zh;
  const keywords = lang === "en" ? base.keywords_en : base.keywords_zh;
  const name = lang === "en" ? base.name_en : base.name_zh;
  const orientation =
    lang === "en" ? (upright ? "upright" : "reversed") : upright ? "正位" : "逆位";
  const summary =
    lang === "en"
      ? `${name} (${orientation}): ${meaning}`
      : `${name}（${orientation}）：${meaning}`;

  return {
    ok: true,
    spread: "single",
    card: {
      id: base.id,
      name_en: base.name_en,
      name_zh: base.name_zh,
      upright,
      orientation,
      keywords,
      meaning,
    },
    summary,
    disclaimer: lang === "en" ? DISCLAIMER_EN : DISCLAIMER_ZH,
    source: "rules",
    meta: {
      version: "sx3-1.0",
      language: lang,
      question: q ? q.slice(0, 200) : null,
    },
  };
}

function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
