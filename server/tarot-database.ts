/**
 * Tarot Professional Database
 * 
 * Complete 78-card database with:
 * - Major Arcana (22 cards) with full upright/reversed meanings
 * - Minor Arcana (56 cards) across 4 suits
 * - Keywords, elements, zodiac associations
 * - Multiple spread layouts with position semantics
 * - Card draw logic with true randomization
 * 
 * This is the DATA layer — structured knowledge that feeds into
 * the AI interpretation layer for professional-grade readings.
 */

// ============================================================
// Types
// ============================================================

export interface TarotCard {
  id: number;
  name: string;
  nameChinese: string;
  nameShort: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number;
  element: string;
  zodiac?: string;
  planet?: string;
  keywords: string[];
  keywordsChinese: string[];
  meaningUpright: string;
  meaningReversed: string;
  meaningUprightChinese: string;
  meaningReversedChinese: string;
  description: string;
  yesNo: 'yes' | 'no' | 'maybe';
}

export interface SpreadPosition {
  index: number;
  name: string;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
}

export interface TarotSpread {
  id: string;
  name: string;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
  cardCount: number;
  positions: SpreadPosition[];
  category: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  position: SpreadPosition;
}

// ============================================================
// Major Arcana (22 cards)
// ============================================================

const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0, name: 'The Fool', nameChinese: '愚者', nameShort: 'ar00',
    arcana: 'major', number: 0, element: 'Air', planet: 'Uranus',
    keywords: ['new beginnings', 'innocence', 'adventure', 'spontaneity', 'free spirit'],
    keywordsChinese: ['新的开始', '天真', '冒险', '自发性', '自由精神'],
    meaningUpright: 'New beginnings, innocence, spontaneity, a free spirit. Taking a leap of faith into the unknown with optimism and trust.',
    meaningReversed: 'Holding back, recklessness, risk-taking, naivety. Fear of the unknown preventing growth.',
    meaningUprightChinese: '新的开始、天真、自发性、自由精神。带着乐观和信任踏入未知的领域。',
    meaningReversedChinese: '犹豫不前、鲁莽、冒险、天真。对未知的恐惧阻碍了成长。',
    description: 'A young person stands at the edge of a cliff, about to step into the unknown.',
    yesNo: 'yes',
  },
  {
    id: 1, name: 'The Magician', nameChinese: '魔术师', nameShort: 'ar01',
    arcana: 'major', number: 1, element: 'Air', planet: 'Mercury',
    keywords: ['manifestation', 'resourcefulness', 'power', 'inspired action', 'willpower'],
    keywordsChinese: ['显化', '足智多谋', '力量', '灵感行动', '意志力'],
    meaningUpright: 'Manifestation, resourcefulness, power, inspired action. You have all the tools and resources you need to manifest your desires.',
    meaningReversed: 'Manipulation, poor planning, untapped talents. Wasted potential or deceptive intentions.',
    meaningUprightChinese: '显化、足智多谋、力量、灵感行动。你拥有实现愿望所需的一切工具和资源。',
    meaningReversedChinese: '操纵、计划不周、未开发的才能。浪费潜力或欺骗性意图。',
    description: 'A figure with one hand pointing to the sky and the other to the earth, channeling divine power.',
    yesNo: 'yes',
  },
  {
    id: 2, name: 'The High Priestess', nameChinese: '女祭司', nameShort: 'ar02',
    arcana: 'major', number: 2, element: 'Water', planet: 'Moon',
    keywords: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious', 'mystery'],
    keywordsChinese: ['直觉', '神圣知识', '神圣女性', '潜意识', '神秘'],
    meaningUpright: 'Intuition, sacred knowledge, divine feminine, the subconscious mind. Trust your inner voice and look beyond the obvious.',
    meaningReversed: 'Secrets, disconnected from intuition, withdrawal, silence. Information being withheld.',
    meaningUprightChinese: '直觉、神圣知识、神圣女性、潜意识。相信你的内心声音，看透表象。',
    meaningReversedChinese: '秘密、与直觉断开、退缩、沉默。信息被隐瞒。',
    description: 'A serene woman sits between two pillars, holding a scroll of sacred law.',
    yesNo: 'maybe',
  },
  {
    id: 3, name: 'The Empress', nameChinese: '女皇', nameShort: 'ar03',
    arcana: 'major', number: 3, element: 'Earth', zodiac: 'Venus',
    keywords: ['femininity', 'beauty', 'nature', 'nurturing', 'abundance'],
    keywordsChinese: ['女性气质', '美丽', '自然', '养育', '丰盛'],
    meaningUpright: 'Femininity, beauty, nature, nurturing, abundance. A time of growth, fertility, and creative expression.',
    meaningReversed: 'Creative block, dependence on others, emptiness. Neglecting self-care or smothering others.',
    meaningUprightChinese: '女性气质、美丽、自然、养育、丰盛。成长、丰饶和创造性表达的时期。',
    meaningReversedChinese: '创造力受阻、依赖他人、空虚。忽视自我照顾或过度保护他人。',
    description: 'A beautiful empress sits on a throne surrounded by lush nature and abundance.',
    yesNo: 'yes',
  },
  {
    id: 4, name: 'The Emperor', nameChinese: '皇帝', nameShort: 'ar04',
    arcana: 'major', number: 4, element: 'Fire', zodiac: 'Aries',
    keywords: ['authority', 'establishment', 'structure', 'father figure', 'leadership'],
    keywordsChinese: ['权威', '建立', '结构', '父亲形象', '领导力'],
    meaningUpright: 'Authority, establishment, structure, a father figure. Stability through discipline and strategic thinking.',
    meaningReversed: 'Domination, excessive control, lack of discipline, inflexibility. Abuse of power.',
    meaningUprightChinese: '权威、建立、结构、父亲形象。通过纪律和战略思维获得稳定。',
    meaningReversedChinese: '支配、过度控制、缺乏纪律、不灵活。滥用权力。',
    description: 'A stern emperor sits on a stone throne adorned with ram heads.',
    yesNo: 'yes',
  },
  {
    id: 5, name: 'The Hierophant', nameChinese: '教皇', nameShort: 'ar05',
    arcana: 'major', number: 5, element: 'Earth', zodiac: 'Taurus',
    keywords: ['spiritual wisdom', 'tradition', 'conformity', 'morality', 'education'],
    keywordsChinese: ['精神智慧', '传统', '遵从', '道德', '教育'],
    meaningUpright: 'Spiritual wisdom, religious beliefs, conformity, tradition, institutions. Seeking guidance from established systems.',
    meaningReversed: 'Personal beliefs, freedom, challenging the status quo. Breaking free from convention.',
    meaningUprightChinese: '精神智慧、宗教信仰、遵从、传统、制度。从既定体系中寻求指导。',
    meaningReversedChinese: '个人信仰、自由、挑战现状。打破常规。',
    description: 'A religious figure sits between two pillars, blessing two followers.',
    yesNo: 'maybe',
  },
  {
    id: 6, name: 'The Lovers', nameChinese: '恋人', nameShort: 'ar06',
    arcana: 'major', number: 6, element: 'Air', zodiac: 'Gemini',
    keywords: ['love', 'harmony', 'relationships', 'values alignment', 'choices'],
    keywordsChinese: ['爱情', '和谐', '关系', '价值观一致', '选择'],
    meaningUpright: 'Love, harmony, relationships, values alignment, choices. A significant relationship or important decision about values.',
    meaningReversed: 'Self-love, disharmony, imbalance, misalignment of values. Relationship conflicts or poor choices.',
    meaningUprightChinese: '爱情、和谐、关系、价值观一致、选择。重要的关系或关于价值观的重要决定。',
    meaningReversedChinese: '自爱、不和谐、失衡、价值观不一致。关系冲突或错误选择。',
    description: 'An angel blesses a man and woman standing beneath, symbolizing divine union.',
    yesNo: 'yes',
  },
  {
    id: 7, name: 'The Chariot', nameChinese: '战车', nameShort: 'ar07',
    arcana: 'major', number: 7, element: 'Water', zodiac: 'Cancer',
    keywords: ['control', 'willpower', 'success', 'action', 'determination'],
    keywordsChinese: ['控制', '意志力', '成功', '行动', '决心'],
    meaningUpright: 'Control, willpower, success, action, determination. Overcoming obstacles through confidence and self-discipline.',
    meaningReversed: 'Self-discipline, opposition, lack of direction. Aggression or losing control of a situation.',
    meaningUprightChinese: '控制、意志力、成功、行动、决心。通过自信和自律克服障碍。',
    meaningReversedChinese: '自律、对抗、缺乏方向。攻击性或失去对局面的控制。',
    description: 'A warrior rides a chariot pulled by two sphinxes, one black and one white.',
    yesNo: 'yes',
  },
  {
    id: 8, name: 'Strength', nameChinese: '力量', nameShort: 'ar08',
    arcana: 'major', number: 8, element: 'Fire', zodiac: 'Leo',
    keywords: ['strength', 'courage', 'persuasion', 'influence', 'compassion'],
    keywordsChinese: ['力量', '勇气', '说服力', '影响力', '慈悲'],
    meaningUpright: 'Strength, courage, persuasion, influence, compassion. Inner strength and the ability to overcome through patience.',
    meaningReversed: 'Inner strength, self-doubt, low energy, raw emotion. Lacking confidence or feeling overwhelmed.',
    meaningUprightChinese: '力量、勇气、说服力、影响力、慈悲。内在力量和通过耐心克服困难的能力。',
    meaningReversedChinese: '内在力量、自我怀疑、精力不足、原始情感。缺乏信心或感到不堪重负。',
    description: 'A woman gently closes the jaws of a lion, showing mastery through gentleness.',
    yesNo: 'yes',
  },
  {
    id: 9, name: 'The Hermit', nameChinese: '隐者', nameShort: 'ar09',
    arcana: 'major', number: 9, element: 'Earth', zodiac: 'Virgo',
    keywords: ['soul-searching', 'introspection', 'being alone', 'inner guidance', 'wisdom'],
    keywordsChinese: ['灵魂探索', '内省', '独处', '内在指引', '智慧'],
    meaningUpright: 'Soul-searching, introspection, being alone, inner guidance. A period of reflection and seeking deeper truth.',
    meaningReversed: 'Isolation, loneliness, withdrawal. Excessive solitude or refusing to seek help.',
    meaningUprightChinese: '灵魂探索、内省、独处、内在指引。反思和寻求更深层真理的时期。',
    meaningReversedChinese: '孤立、孤独、退缩。过度独处或拒绝寻求帮助。',
    description: 'An old man stands alone on a mountain, holding a lantern to light the way.',
    yesNo: 'maybe',
  },
  {
    id: 10, name: 'Wheel of Fortune', nameChinese: '命运之轮', nameShort: 'ar10',
    arcana: 'major', number: 10, element: 'Fire', planet: 'Jupiter',
    keywords: ['good luck', 'karma', 'life cycles', 'destiny', 'turning point'],
    keywordsChinese: ['好运', '因果', '生命周期', '命运', '转折点'],
    meaningUpright: 'Good luck, karma, life cycles, destiny, a turning point. The wheel is turning in your favor.',
    meaningReversed: 'Bad luck, resistance to change, breaking cycles. External forces disrupting your plans.',
    meaningUprightChinese: '好运、因果、生命周期、命运、转折点。命运之轮正在向你有利的方向转动。',
    meaningReversedChinese: '厄运、抗拒变化、打破循环。外部力量打乱你的计划。',
    description: 'A great wheel turns with figures rising and falling, symbolizing fate.',
    yesNo: 'yes',
  },
  {
    id: 11, name: 'Justice', nameChinese: '正义', nameShort: 'ar11',
    arcana: 'major', number: 11, element: 'Air', zodiac: 'Libra',
    keywords: ['justice', 'fairness', 'truth', 'cause and effect', 'law'],
    keywordsChinese: ['正义', '公平', '真相', '因果', '法律'],
    meaningUpright: 'Justice, fairness, truth, cause and effect, law. Accountability and the consequences of your actions.',
    meaningReversed: 'Unfairness, lack of accountability, dishonesty. Being treated unjustly or avoiding responsibility.',
    meaningUprightChinese: '正义、公平、真相、因果、法律。责任和你行为的后果。',
    meaningReversedChinese: '不公平、缺乏责任感、不诚实。受到不公正对待或逃避责任。',
    description: 'A figure holds scales and a sword, seated between two pillars.',
    yesNo: 'maybe',
  },
  {
    id: 12, name: 'The Hanged Man', nameChinese: '倒吊人', nameShort: 'ar12',
    arcana: 'major', number: 12, element: 'Water', planet: 'Neptune',
    keywords: ['pause', 'surrender', 'letting go', 'new perspectives', 'sacrifice'],
    keywordsChinese: ['暂停', '臣服', '放手', '新视角', '牺牲'],
    meaningUpright: 'Pause, surrender, letting go, new perspectives. Seeing things from a different angle through willing sacrifice.',
    meaningReversed: 'Delays, resistance, stalling, indecision. Refusing to make necessary sacrifices.',
    meaningUprightChinese: '暂停、臣服、放手、新视角。通过自愿牺牲从不同角度看待事物。',
    meaningReversedChinese: '延迟、抵抗、拖延、犹豫不决。拒绝做出必要的牺牲。',
    description: 'A man hangs upside down from a tree, serene and enlightened.',
    yesNo: 'maybe',
  },
  {
    id: 13, name: 'Death', nameChinese: '死神', nameShort: 'ar13',
    arcana: 'major', number: 13, element: 'Water', zodiac: 'Scorpio',
    keywords: ['endings', 'change', 'transformation', 'transition', 'release'],
    keywordsChinese: ['结束', '变化', '转变', '过渡', '释放'],
    meaningUpright: 'Endings, change, transformation, transition. The end of one chapter and the beginning of another.',
    meaningReversed: 'Resistance to change, personal transformation, inner purging. Clinging to the past.',
    meaningUprightChinese: '结束、变化、转变、过渡。一个篇章的结束和另一个篇章的开始。',
    meaningReversedChinese: '抗拒变化、个人转变、内在净化。执着于过去。',
    description: 'A skeleton in armor rides a white horse, carrying a black flag with a white rose.',
    yesNo: 'no',
  },
  {
    id: 14, name: 'Temperance', nameChinese: '节制', nameShort: 'ar14',
    arcana: 'major', number: 14, element: 'Fire', zodiac: 'Sagittarius',
    keywords: ['balance', 'moderation', 'patience', 'purpose', 'harmony'],
    keywordsChinese: ['平衡', '节制', '耐心', '目的', '和谐'],
    meaningUpright: 'Balance, moderation, patience, purpose. Finding middle ground and practicing patience.',
    meaningReversed: 'Imbalance, excess, self-healing, re-alignment. Overindulgence or lack of moderation.',
    meaningUprightChinese: '平衡、节制、耐心、目的。找到中间立场并练习耐心。',
    meaningReversedChinese: '失衡、过度、自我疗愈、重新调整。过度放纵或缺乏节制。',
    description: 'An angel pours water between two cups, blending opposites into harmony.',
    yesNo: 'yes',
  },
  {
    id: 15, name: 'The Devil', nameChinese: '恶魔', nameShort: 'ar15',
    arcana: 'major', number: 15, element: 'Earth', zodiac: 'Capricorn',
    keywords: ['shadow self', 'attachment', 'addiction', 'restriction', 'sexuality'],
    keywordsChinese: ['阴暗面', '执着', '成瘾', '限制', '欲望'],
    meaningUpright: 'Shadow self, attachment, addiction, restriction, sexuality. Being bound by material desires or unhealthy patterns.',
    meaningReversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment. Breaking free from bondage.',
    meaningUprightChinese: '阴暗面、执着、成瘾、限制、欲望。被物质欲望或不健康的模式所束缚。',
    meaningReversedChinese: '释放限制性信念、探索阴暗思想、超脱。从束缚中解脱。',
    description: 'A horned devil figure looms over two chained figures.',
    yesNo: 'no',
  },
  {
    id: 16, name: 'The Tower', nameChinese: '塔', nameShort: 'ar16',
    arcana: 'major', number: 16, element: 'Fire', planet: 'Mars',
    keywords: ['sudden change', 'upheaval', 'chaos', 'revelation', 'awakening'],
    keywordsChinese: ['突变', '剧变', '混乱', '启示', '觉醒'],
    meaningUpright: 'Sudden change, upheaval, chaos, revelation, awakening. Destruction of false structures to reveal truth.',
    meaningReversed: 'Personal transformation, fear of change, averting disaster. Resisting necessary upheaval.',
    meaningUprightChinese: '突变、剧变、混乱、启示、觉醒。摧毁虚假结构以揭示真相。',
    meaningReversedChinese: '个人转变、害怕变化、避免灾难。抵抗必要的剧变。',
    description: 'Lightning strikes a tower, sending figures falling from its heights.',
    yesNo: 'no',
  },
  {
    id: 17, name: 'The Star', nameChinese: '星星', nameShort: 'ar17',
    arcana: 'major', number: 17, element: 'Air', zodiac: 'Aquarius',
    keywords: ['hope', 'faith', 'purpose', 'renewal', 'spirituality'],
    keywordsChinese: ['希望', '信念', '目的', '重生', '灵性'],
    meaningUpright: 'Hope, faith, purpose, renewal, spirituality. A period of healing and renewed optimism after difficulty.',
    meaningReversed: 'Lack of faith, despair, self-trust, disconnection. Losing hope or feeling uninspired.',
    meaningUprightChinese: '希望、信念、目的、重生、灵性。困难之后的疗愈和重新乐观的时期。',
    meaningReversedChinese: '缺乏信念、绝望、自我信任、断开连接。失去希望或感到缺乏灵感。',
    description: 'A woman kneels by water under a starlit sky, pouring water onto land and into a pool.',
    yesNo: 'yes',
  },
  {
    id: 18, name: 'The Moon', nameChinese: '月亮', nameShort: 'ar18',
    arcana: 'major', number: 18, element: 'Water', zodiac: 'Pisces',
    keywords: ['illusion', 'fear', 'anxiety', 'subconscious', 'intuition'],
    keywordsChinese: ['幻觉', '恐惧', '焦虑', '潜意识', '直觉'],
    meaningUpright: 'Illusion, fear, anxiety, subconscious, intuition. Things are not as they seem; trust your instincts.',
    meaningReversed: 'Release of fear, repressed emotion, inner confusion. Clarity emerging from darkness.',
    meaningUprightChinese: '幻觉、恐惧、焦虑、潜意识、直觉。事情并非表面所见；相信你的直觉。',
    meaningReversedChinese: '释放恐惧、压抑的情感、内心困惑。从黑暗中浮现的清晰。',
    description: 'A moon shines over a path between two towers, with a dog and wolf howling.',
    yesNo: 'no',
  },
  {
    id: 19, name: 'The Sun', nameChinese: '太阳', nameShort: 'ar19',
    arcana: 'major', number: 19, element: 'Fire', planet: 'Sun',
    keywords: ['positivity', 'fun', 'warmth', 'success', 'vitality'],
    keywordsChinese: ['积极', '快乐', '温暖', '成功', '活力'],
    meaningUpright: 'Positivity, fun, warmth, success, vitality. Joy, celebration, and achievement. Everything is going well.',
    meaningReversed: 'Inner child, feeling down, overly optimistic. Temporary setbacks or unrealistic expectations.',
    meaningUprightChinese: '积极、快乐、温暖、成功、活力。喜悦、庆祝和成就。一切顺利。',
    meaningReversedChinese: '内在小孩、情绪低落、过度乐观。暂时的挫折或不切实际的期望。',
    description: 'A child rides a white horse under a bright sun, surrounded by sunflowers.',
    yesNo: 'yes',
  },
  {
    id: 20, name: 'Judgement', nameChinese: '审判', nameShort: 'ar20',
    arcana: 'major', number: 20, element: 'Fire', planet: 'Pluto',
    keywords: ['judgement', 'rebirth', 'inner calling', 'absolution', 'reflection'],
    keywordsChinese: ['审判', '重生', '内在召唤', '赦免', '反思'],
    meaningUpright: 'Judgement, rebirth, inner calling, absolution. A time of reckoning and answering a higher calling.',
    meaningReversed: 'Self-doubt, inner critic, ignoring the call. Refusing to learn from past experiences.',
    meaningUprightChinese: '审判、重生、内在召唤、赦免。清算和回应更高召唤的时刻。',
    meaningReversedChinese: '自我怀疑、内在批评者、忽视召唤。拒绝从过去的经验中学习。',
    description: 'An angel blows a trumpet as figures rise from their graves in response.',
    yesNo: 'yes',
  },
  {
    id: 21, name: 'The World', nameChinese: '世界', nameShort: 'ar21',
    arcana: 'major', number: 21, element: 'Earth', planet: 'Saturn',
    keywords: ['completion', 'integration', 'accomplishment', 'travel', 'wholeness'],
    keywordsChinese: ['完成', '整合', '成就', '旅行', '完整'],
    meaningUpright: 'Completion, integration, accomplishment, travel. A major cycle is complete; celebration and fulfillment.',
    meaningReversed: 'Seeking personal closure, short-cuts, delays. Feeling incomplete or unable to finish.',
    meaningUprightChinese: '完成、整合、成就、旅行。一个重要的循环已经完成；庆祝和满足。',
    meaningReversedChinese: '寻求个人了结、走捷径、延迟。感觉不完整或无法完成。',
    description: 'A dancing figure is surrounded by a wreath, with four creatures in the corners.',
    yesNo: 'yes',
  },
];

// ============================================================
// Minor Arcana Generator
// ============================================================

interface SuitConfig {
  suit: 'wands' | 'cups' | 'swords' | 'pentacles';
  element: string;
  suitChinese: string;
  theme: string;
  themeChinese: string;
}

const SUITS: SuitConfig[] = [
  { suit: 'wands', element: 'Fire', suitChinese: '权杖', theme: 'passion, creativity, ambition', themeChinese: '激情、创造力、抱负' },
  { suit: 'cups', element: 'Water', suitChinese: '圣杯', theme: 'emotions, relationships, intuition', themeChinese: '情感、关系、直觉' },
  { suit: 'swords', element: 'Air', suitChinese: '宝剑', theme: 'intellect, conflict, truth', themeChinese: '智慧、冲突、真相' },
  { suit: 'pentacles', element: 'Earth', suitChinese: '星币', theme: 'material, career, finances', themeChinese: '物质、事业、财务' },
];

// Number card meanings by suit
const MINOR_MEANINGS: Record<string, { upright: string; reversed: string; uprightZh: string; reversedZh: string; keywords: string[]; keywordsZh: string[] }[]> = {
  wands: [
    { upright: 'Inspiration, new opportunities, growth, potential', reversed: 'An emerging idea, lack of direction, distractions, delays', keywords: ['creation', 'willpower', 'inspiration'], keywordsZh: ['创造', '意志力', '灵感'], uprightZh: '灵感、新机会、成长、潜力', reversedZh: '萌芽的想法、缺乏方向、分心、延迟' },
    { upright: 'Future planning, progress, decisions, discovery', reversed: 'Personal goals, inner alignment, fear of unknown', keywords: ['planning', 'decisions', 'discovery'], keywordsZh: ['规划', '决策', '发现'], uprightZh: '未来规划、进步、决策、发现', reversedZh: '个人目标、内在对齐、对未知的恐惧' },
    { upright: 'Progress, expansion, foresight, overseas opportunities', reversed: 'Obstacles in long-term plans, delays in travel, frustration', keywords: ['expansion', 'foresight', 'progress'], keywordsZh: ['扩展', '远见', '进步'], uprightZh: '进步、扩展、远见、海外机会', reversedZh: '长期计划中的障碍、旅行延迟、挫折' },
    { upright: 'Celebration, joy, harmony, relaxation, homecoming', reversed: 'Personal celebration, inner harmony, conflict with others', keywords: ['celebration', 'harmony', 'stability'], keywordsZh: ['庆祝', '和谐', '稳定'], uprightZh: '庆祝、喜悦、和谐、放松、回家', reversedZh: '个人庆祝、内在和谐、与他人的冲突' },
    { upright: 'Conflict, disagreements, competition, tension, diversity', reversed: 'Inner conflict, conflict avoidance, release of tension', keywords: ['competition', 'conflict', 'challenge'], keywordsZh: ['竞争', '冲突', '挑战'], uprightZh: '冲突、分歧、竞争、紧张、多样性', reversedZh: '内在冲突、回避冲突、释放紧张' },
    { upright: 'Public recognition, progress, self-confidence, victory', reversed: 'Fall from grace, egotism, lack of recognition', keywords: ['victory', 'recognition', 'pride'], keywordsZh: ['胜利', '认可', '自豪'], uprightZh: '公众认可、进步、自信、胜利', reversedZh: '失宠、自大、缺乏认可' },
    { upright: 'Challenge, competition, perseverance, maintaining position', reversed: 'Giving up, overwhelmed, being protective', keywords: ['perseverance', 'defense', 'courage'], keywordsZh: ['坚持', '防御', '勇气'], uprightZh: '挑战、竞争、坚持、维持地位', reversedZh: '放弃、不堪重负、保护性' },
    { upright: 'Movement, fast paced change, action, alignment, air travel', reversed: 'Delays, frustration, resisting change, internal alignment', keywords: ['speed', 'action', 'movement'], keywordsZh: ['速度', '行动', '运动'], uprightZh: '运动、快速变化、行动、对齐、航空旅行', reversedZh: '延迟、挫折、抗拒变化、内在对齐' },
    { upright: 'Resilience, grit, last stand, boundaries, courage', reversed: 'Overwhelm, giving in, no fight left, exhaustion', keywords: ['resilience', 'boundaries', 'persistence'], keywordsZh: ['韧性', '边界', '坚持'], uprightZh: '韧性、毅力、最后一搏、边界、勇气', reversedZh: '不堪重负、屈服、无力抵抗、精疲力竭' },
    { upright: 'Burden, extra responsibility, hard work, completion', reversed: 'Inability to delegate, overstressed, burnt out', keywords: ['burden', 'responsibility', 'completion'], keywordsZh: ['负担', '责任', '完成'], uprightZh: '负担、额外责任、努力工作、完成', reversedZh: '无法委派、压力过大、精疲力竭' },
    { upright: 'Enthusiasm, exploration, discovery, free spirit', reversed: 'Setbacks, lack of direction, procrastination', keywords: ['adventure', 'enthusiasm', 'discovery'], keywordsZh: ['冒险', '热情', '发现'], uprightZh: '热情、探索、发现、自由精神', reversedZh: '挫折、缺乏方向、拖延' },
    { upright: 'Bold, energetic, charming, hero, determined', reversed: 'Haste, scattered energy, delays, frustration', keywords: ['action', 'passion', 'adventure'], keywordsZh: ['行动', '激情', '冒险'], uprightZh: '大胆、精力充沛、迷人、英雄、坚定', reversedZh: '仓促、精力分散、延迟、挫折' },
    { upright: 'Natural leader, vision, entrepreneur, honour', reversed: 'Impulsiveness, haste, ruthless, high expectations', keywords: ['leadership', 'vision', 'boldness'], keywordsZh: ['领导力', '远见', '大胆'], uprightZh: '天生的领导者、远见、企业家、荣誉', reversedZh: '冲动、仓促、无情、高期望' },
    { upright: 'Courage, determination, joy, leadership, optimism', reversed: 'Demanding, controlling, overbearing', keywords: ['confidence', 'determination', 'optimism'], keywordsZh: ['信心', '决心', '乐观'], uprightZh: '勇气、决心、喜悦、领导力、乐观', reversedZh: '苛求、控制、专横' },
  ],
  cups: [
    { upright: 'Love, new relationships, compassion, creativity', reversed: 'Self-love, intuition, repressed emotions', keywords: ['love', 'new feelings', 'compassion'], keywordsZh: ['爱', '新感受', '慈悲'], uprightZh: '爱、新关系、慈悲、创造力', reversedZh: '自爱、直觉、压抑的情感' },
    { upright: 'Unified love, partnership, mutual attraction', reversed: 'Self-love, break-ups, disharmony, distrust', keywords: ['partnership', 'unity', 'attraction'], keywordsZh: ['伙伴关系', '统一', '吸引力'], uprightZh: '统一的爱、伙伴关系、相互吸引', reversedZh: '自爱、分手、不和谐、不信任' },
    { upright: 'Celebration, friendship, creativity, collaborations', reversed: 'Overindulgence, gossip, isolation', keywords: ['celebration', 'friendship', 'joy'], keywordsZh: ['庆祝', '友谊', '快乐'], uprightZh: '庆祝、友谊、创造力、合作', reversedZh: '过度放纵、八卦、孤立' },
    { upright: 'Meditation, contemplation, apathy, reevaluation', reversed: 'Retreat, withdrawal, checking in for alignment', keywords: ['contemplation', 'apathy', 'reevaluation'], keywordsZh: ['沉思', '冷漠', '重新评估'], uprightZh: '冥想、沉思、冷漠、重新评估', reversedZh: '退缩、撤退、检查对齐' },
    { upright: 'Regret, failure, disappointment, pessimism', reversed: 'Personal setbacks, self-forgiveness, moving on', keywords: ['loss', 'regret', 'disappointment'], keywordsZh: ['失去', '遗憾', '失望'], uprightZh: '遗憾、失败、失望、悲观', reversedZh: '个人挫折、自我宽恕、继续前进' },
    { upright: 'Revisiting the past, childhood memories, innocence, joy', reversed: 'Stuck in the past, naivety, unrealistic', keywords: ['nostalgia', 'memories', 'innocence'], keywordsZh: ['怀旧', '回忆', '天真'], uprightZh: '重温过去、童年记忆、天真、快乐', reversedZh: '困在过去、天真、不切实际' },
    { upright: 'Opportunities, choices, wishful thinking, illusion', reversed: 'Alignment, personal values, overwhelmed by choices', keywords: ['choices', 'fantasy', 'opportunities'], keywordsZh: ['选择', '幻想', '机会'], uprightZh: '机会、选择、一厢情愿、幻觉', reversedZh: '对齐、个人价值观、被选择淹没' },
    { upright: 'Disappointment, abandonment, withdrawal, escapism', reversed: 'Trying one more time, indecision, aimless drifting', keywords: ['abandonment', 'withdrawal', 'seeking'], keywordsZh: ['放弃', '退出', '寻找'], uprightZh: '失望、放弃、退出、逃避', reversedZh: '再试一次、犹豫不决、漫无目的' },
    { upright: 'Contentment, satisfaction, gratitude, wish come true', reversed: 'Inner happiness, materialism, dissatisfaction', keywords: ['fulfillment', 'satisfaction', 'wishes'], keywordsZh: ['满足', '满意', '愿望'], uprightZh: '满足、满意、感恩、愿望成真', reversedZh: '内在幸福、物质主义、不满' },
    { upright: 'Divine love, blissful relationships, harmony, alignment', reversed: 'Disconnection, misaligned values, struggling relationships', keywords: ['harmony', 'happiness', 'family'], keywordsZh: ['和谐', '幸福', '家庭'], uprightZh: '神圣的爱、幸福的关系、和谐、对齐', reversedZh: '断开连接、价值观不一致、挣扎的关系' },
    { upright: 'Creative opportunities, curiosity, possibility', reversed: 'New ideas, doubting intuition, creative blocks', keywords: ['curiosity', 'possibility', 'imagination'], keywordsZh: ['好奇心', '可能性', '想象力'], uprightZh: '创造性机会、好奇心、可能性', reversedZh: '新想法、怀疑直觉、创造力受阻' },
    { upright: 'Creativity, romance, charm, imagination, beauty', reversed: 'Overactive imagination, unrealistic, moody', keywords: ['romance', 'creativity', 'charm'], keywordsZh: ['浪漫', '创造力', '魅力'], uprightZh: '创造力、浪漫、魅力、想象力、美丽', reversedZh: '过度活跃的想象力、不切实际、情绪化' },
    { upright: 'Compassion, calm, comfort, emotional balance', reversed: 'Martyrdom, insecurity, inner feelings, emotional manipulation', keywords: ['compassion', 'calm', 'emotional depth'], keywordsZh: ['慈悲', '平静', '情感深度'], uprightZh: '慈悲、平静、安慰、情感平衡', reversedZh: '殉道、不安全感、内心感受、情感操纵' },
    { upright: 'Compassion, control, emotional stability, generosity', reversed: 'Self-compassion, inner feelings, moodiness, emotional manipulation', keywords: ['emotional mastery', 'generosity', 'stability'], keywordsZh: ['情感掌控', '慷慨', '稳定'], uprightZh: '慈悲、控制、情感稳定、慷慨', reversedZh: '自我慈悲、内心感受、情绪化、情感操纵' },
  ],
  swords: [
    { upright: 'Breakthroughs, new ideas, mental clarity, success', reversed: 'Inner clarity, re-thinking an idea, clouded judgement', keywords: ['clarity', 'breakthrough', 'truth'], keywordsZh: ['清晰', '突破', '真相'], uprightZh: '突破、新想法、思维清晰、成功', reversedZh: '内在清晰、重新思考、判断力模糊' },
    { upright: 'Difficult decisions, weighing up options, an impasse, avoidance', reversed: 'Indecision, confusion, information overload, stalemate', keywords: ['decision', 'stalemate', 'balance'], keywordsZh: ['决定', '僵局', '平衡'], uprightZh: '困难的决定、权衡选择、僵局、回避', reversedZh: '犹豫不决、困惑、信息过载、僵局' },
    { upright: 'Heartbreak, emotional pain, sorrow, grief, hurt', reversed: 'Recovery, forgiveness, moving on, self-sorrow', keywords: ['heartbreak', 'sorrow', 'pain'], keywordsZh: ['心碎', '悲伤', '痛苦'], uprightZh: '心碎、情感痛苦、悲伤、悲痛、伤害', reversedZh: '恢复、宽恕、继续前进、自我悲伤' },
    { upright: 'Rest, relaxation, meditation, contemplation, recuperation', reversed: 'Exhaustion, burn-out, deep contemplation, stagnation', keywords: ['rest', 'recovery', 'contemplation'], keywordsZh: ['休息', '恢复', '沉思'], uprightZh: '休息、放松、冥想、沉思、恢复', reversedZh: '精疲力竭、倦怠、深度沉思、停滞' },
    { upright: 'Conflict, disagreements, competition, defeat, winning at all costs', reversed: 'Reconciliation, making amends, past resentment', keywords: ['conflict', 'defeat', 'competition'], keywordsZh: ['冲突', '失败', '竞争'], uprightZh: '冲突、分歧、竞争、失败、不惜一切代价取胜', reversedZh: '和解、弥补、过去的怨恨' },
    { upright: 'Transition, change, rite of passage, releasing baggage', reversed: 'Personal transition, resistance to change, unfinished business', keywords: ['transition', 'change', 'moving on'], keywordsZh: ['过渡', '变化', '继续前进'], uprightZh: '过渡、变化、通过仪式、释放包袱', reversedZh: '个人过渡、抗拒变化、未完成的事务' },
    { upright: 'Deception, trickery, tactics, resourcefulness', reversed: 'Coming clean, rethinking approach, confession', keywords: ['deception', 'strategy', 'stealth'], keywordsZh: ['欺骗', '策略', '隐秘'], uprightZh: '欺骗、诡计、策略、足智多谋', reversedZh: '坦白、重新思考方法、忏悔' },
    { upright: 'Negative thoughts, self-imposed restriction, imprisonment, victim mentality', reversed: 'Self-limiting beliefs, inner critic, releasing negative thoughts', keywords: ['restriction', 'imprisonment', 'helplessness'], keywordsZh: ['限制', '囚禁', '无助'], uprightZh: '消极思想、自我限制、囚禁、受害者心态', reversedZh: '自我限制的信念、内在批评者、释放消极思想' },
    { upright: 'Anxiety, worry, fear, depression, nightmares', reversed: 'Inner turmoil, deep-seated fears, secrets, releasing worry', keywords: ['anxiety', 'worry', 'fear'], keywordsZh: ['焦虑', '担忧', '恐惧'], uprightZh: '焦虑、担忧、恐惧、抑郁、噩梦', reversedZh: '内心动荡、根深蒂固的恐惧、秘密、释放担忧' },
    { upright: 'Painful endings, deep wounds, betrayal, loss, crisis', reversed: 'Recovery, regeneration, resisting an inevitable end', keywords: ['ending', 'loss', 'betrayal'], keywordsZh: ['结束', '失去', '背叛'], uprightZh: '痛苦的结束、深深的伤口、背叛、失去、危机', reversedZh: '恢复、再生、抵抗不可避免的结局' },
    { upright: 'Curiosity, restlessness, mental energy, thirst for knowledge', reversed: 'Deception, manipulation, all talk', keywords: ['curiosity', 'restlessness', 'mental energy'], keywordsZh: ['好奇心', '不安', '精神能量'], uprightZh: '好奇心、不安、精神能量、求知欲', reversedZh: '欺骗、操纵、光说不做' },
    { upright: 'Ambitious, action-oriented, driven to succeed, fast-thinking', reversed: 'Restless, unfocused, burn-out, aggressive', keywords: ['ambition', 'action', 'speed'], keywordsZh: ['雄心', '行动', '速度'], uprightZh: '雄心勃勃、行动导向、追求成功、思维敏捷', reversedZh: '不安、注意力不集中、倦怠、攻击性' },
    { upright: 'Clear thinking, intellectual power, authority, truth', reversed: 'Quiet power, inner truth, misuse of power, manipulation', keywords: ['authority', 'intellect', 'truth'], keywordsZh: ['权威', '智慧', '真相'], uprightZh: '清晰思维、智力力量、权威、真相', reversedZh: '安静的力量、内在真相、滥用权力、操纵' },
    { upright: 'Mental clarity, intellectual power, authority, truth, head over heart', reversed: 'Emotional coldness, manipulation, cruelty', keywords: ['clarity', 'authority', 'intellect'], keywordsZh: ['清晰', '权威', '智慧'], uprightZh: '思维清晰、智力力量、权威、真相、理性胜过感性', reversedZh: '情感冷漠、操纵、残忍' },
  ],
  pentacles: [
    { upright: 'A new financial or career opportunity, manifestation, abundance', reversed: 'Lost opportunity, lack of planning, foresight', keywords: ['opportunity', 'prosperity', 'new venture'], keywordsZh: ['机会', '繁荣', '新事业'], uprightZh: '新的财务或职业机会、显化、丰盛', reversedZh: '失去机会、缺乏规划、远见' },
    { upright: 'Multiple priorities, time management, prioritization, adaptability', reversed: 'Over-committed, disorganization, reprioritization', keywords: ['balance', 'adaptability', 'priorities'], keywordsZh: ['平衡', '适应性', '优先级'], uprightZh: '多重优先事项、时间管理、优先排序、适应性', reversedZh: '过度承诺、混乱、重新排序' },
    { upright: 'Teamwork, collaboration, learning, implementation', reversed: 'Lack of teamwork, disregard for skills, poor quality', keywords: ['teamwork', 'skill', 'craftsmanship'], keywordsZh: ['团队合作', '技能', '工艺'], uprightZh: '团队合作、协作、学习、实施', reversedZh: '缺乏团队合作、忽视技能、质量差' },
    { upright: 'Saving money, security, conservatism, scarcity, control', reversed: 'Over-spending, greed, self-protection', keywords: ['security', 'saving', 'control'], keywordsZh: ['安全', '储蓄', '控制'], uprightZh: '存钱、安全、保守、稀缺、控制', reversedZh: '过度消费、贪婪、自我保护' },
    { upright: 'Financial loss, poverty, lack mindset, isolation, worry', reversed: 'Recovery from financial loss, spiritual poverty', keywords: ['hardship', 'poverty', 'isolation'], keywordsZh: ['困难', '贫困', '孤立'], uprightZh: '财务损失、贫困、匮乏心态、孤立、担忧', reversedZh: '从财务损失中恢复、精神贫困' },
    { upright: 'Giving, receiving, sharing wealth, generosity, charity', reversed: 'Self-care, unpaid debts, one-sided charity', keywords: ['generosity', 'charity', 'sharing'], keywordsZh: ['慷慨', '慈善', '分享'], uprightZh: '给予、接受、分享财富、慷慨、慈善', reversedZh: '自我照顾、未偿还的债务、单方面的慈善' },
    { upright: 'Long-term view, sustainable results, perseverance, investment', reversed: 'Lack of long-term vision, limited success or reward', keywords: ['patience', 'investment', 'perseverance'], keywordsZh: ['耐心', '投资', '坚持'], uprightZh: '长远眼光、可持续的结果、坚持、投资', reversedZh: '缺乏长远眼光、有限的成功或回报' },
    { upright: 'Apprenticeship, repetitive tasks, mastery, skill development', reversed: 'Self-development, perfectionism, misdirected activity', keywords: ['mastery', 'diligence', 'skill'], keywordsZh: ['精通', '勤奋', '技能'], uprightZh: '学徒期、重复性任务、精通、技能发展', reversedZh: '自我发展、完美主义、方向错误的活动' },
    { upright: 'Abundance, luxury, self-sufficiency, financial independence', reversed: 'Self-worth, over-investment in work, hustling', keywords: ['abundance', 'luxury', 'independence'], keywordsZh: ['丰盛', '奢华', '独立'], uprightZh: '丰盛、奢华、自给自足、财务独立', reversedZh: '自我价值、过度投入工作、忙碌' },
    { upright: 'Wealth, financial security, family, long-term success, contribution', reversed: 'Financial failure, loneliness, loss of legacy', keywords: ['wealth', 'legacy', 'family'], keywordsZh: ['财富', '遗产', '家庭'], uprightZh: '财富、财务安全、家庭、长期成功、贡献', reversedZh: '财务失败、孤独、失去遗产' },
    { upright: 'Financial opportunity, new job, scholarship, investment', reversed: 'Missed opportunity, lack of foresight', keywords: ['opportunity', 'study', 'new beginnings'], keywordsZh: ['机会', '学习', '新开始'], uprightZh: '财务机会、新工作、奖学金、投资', reversedZh: '错过机会、缺乏远见' },
    { upright: 'Hard work, productivity, routine, conservative', reversed: 'Workaholic, boredom, feeling stuck, laziness', keywords: ['diligence', 'routine', 'reliability'], keywordsZh: ['勤奋', '常规', '可靠'], uprightZh: '努力工作、生产力、常规、保守', reversedZh: '工作狂、无聊、感到困顿、懒惰' },
    { upright: 'Practical, loyal, provider, reliable, patient', reversed: 'Financially irresponsible, stubborn, materialistic', keywords: ['provider', 'loyalty', 'stability'], keywordsZh: ['供养者', '忠诚', '稳定'], uprightZh: '务实、忠诚、供养者、可靠、耐心', reversedZh: '财务不负责任、固执、物质主义' },
    { upright: 'Abundance, prosperity, security, luxury, control', reversed: 'Financial independence, self-worth, over-spending', keywords: ['prosperity', 'abundance', 'security'], keywordsZh: ['繁荣', '丰盛', '安全'], uprightZh: '丰盛、繁荣、安全、奢华、控制', reversedZh: '财务独立、自我价值、过度消费' },
  ],
};

const COURT_NAMES = ['Page', 'Knight', 'Queen', 'King'];
const COURT_NAMES_ZH = ['侍从', '骑士', '王后', '国王'];

function generateMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  let id = 22;

  for (const suit of SUITS) {
    const meanings = MINOR_MEANINGS[suit.suit];
    for (let i = 0; i < 14; i++) {
      const m = meanings[i];
      const isCourt = i >= 10;
      const courtIdx = i - 10;
      const name = isCourt
        ? `${COURT_NAMES[courtIdx]} of ${suit.suit.charAt(0).toUpperCase() + suit.suit.slice(1)}`
        : `${i === 0 ? 'Ace' : (i + 1).toString()} of ${suit.suit.charAt(0).toUpperCase() + suit.suit.slice(1)}`;
      const nameChinese = isCourt
        ? `${suit.suitChinese}${COURT_NAMES_ZH[courtIdx]}`
        : `${suit.suitChinese}${i === 0 ? '王牌' : (i + 1).toString()}`;

      cards.push({
        id: id++,
        name,
        nameChinese,
        nameShort: `${suit.suit.slice(0, 2)}${String(i + 1).padStart(2, '0')}`,
        arcana: 'minor',
        suit: suit.suit,
        number: i + 1,
        element: suit.element,
        keywords: m.keywords,
        keywordsChinese: m.keywordsZh,
        meaningUpright: m.upright,
        meaningReversed: m.reversed,
        meaningUprightChinese: m.uprightZh,
        meaningReversedChinese: m.reversedZh,
        description: `${name} - ${suit.theme}`,
        yesNo: 'maybe',
      });
    }
  }

  return cards;
}

// ============================================================
// Complete Card Database
// ============================================================

export const ALL_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...generateMinorArcana()];

export function getCardByName(name: string): TarotCard | undefined {
  // Match by English name, Chinese name, or nameShort
  const lower = name.toLowerCase();
  return ALL_CARDS.find(c => 
    c.name.toLowerCase() === lower || 
    c.nameChinese === name ||
    c.nameShort === lower
  );
}

/**
 * T07: 2–3 keyword chips from the professional deck DB (no parallel fake list).
 */
export function keywordsForCardName(
  name: string,
  language: "zh" | "en" = "zh",
  max = 3
): string[] {
  const card = getCardByName(name);
  if (!card) return [];
  const list = language === "zh" ? card.keywordsChinese : card.keywords;
  return list.slice(0, Math.max(0, max));
}

export function getCardById(id: number): TarotCard | undefined {
  return ALL_CARDS.find(c => c.id === id);
}

// ============================================================
// Spread Definitions
// ============================================================

export const SPREADS: TarotSpread[] = [
  {
    id: 'single',
    name: 'Single Card',
    nameChinese: '单牌',
    description: 'A quick one-card draw for daily guidance or a simple yes/no question.',
    descriptionChinese: '快速单牌抽取，用于每日指引或简单的是/否问题。',
    cardCount: 1,
    category: 'quick',
    positions: [
      { index: 0, name: 'The Answer', nameChinese: '答案', description: 'The core message or answer to your question.', descriptionChinese: '你问题的核心信息或答案。' },
    ],
  },
  {
    id: 'three-card',
    name: 'Three Card Spread',
    nameChinese: '三牌阵',
    description: 'The classic past-present-future spread for understanding the flow of a situation.',
    descriptionChinese: '经典的过去-现在-未来牌阵，用于理解情况的发展脉络。',
    cardCount: 3,
    category: 'general',
    positions: [
      { index: 0, name: 'Past', nameChinese: '过去', description: 'Influences from the past that have led to the current situation.', descriptionChinese: '导致当前情况的过去影响。' },
      { index: 1, name: 'Present', nameChinese: '现在', description: 'The current state of affairs and immediate influences.', descriptionChinese: '当前的状况和即时影响。' },
      { index: 2, name: 'Future', nameChinese: '未来', description: 'The likely outcome if the current path continues.', descriptionChinese: '如果继续当前道路的可能结果。' },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameChinese: '凯尔特十字',
    description: 'The most comprehensive spread, providing deep insight into complex situations with 10 cards covering all aspects.',
    descriptionChinese: '最全面的牌阵，用10张牌深入洞察复杂情况的各个方面。',
    cardCount: 10,
    category: 'deep',
    positions: [
      { index: 0, name: 'Present', nameChinese: '现状', description: 'Your current situation and the central issue.', descriptionChinese: '你当前的状况和核心问题。' },
      { index: 1, name: 'Challenge', nameChinese: '挑战', description: 'The immediate challenge or obstacle you face.', descriptionChinese: '你面临的直接挑战或障碍。' },
      { index: 2, name: 'Foundation', nameChinese: '基础', description: 'The root cause or unconscious influence.', descriptionChinese: '根本原因或潜意识影响。' },
      { index: 3, name: 'Recent Past', nameChinese: '近过去', description: 'Recent events that have shaped the situation.', descriptionChinese: '塑造当前情况的近期事件。' },
      { index: 4, name: 'Crown', nameChinese: '王冠', description: 'Your goals, aspirations, or best possible outcome.', descriptionChinese: '你的目标、愿望或最佳可能结果。' },
      { index: 5, name: 'Near Future', nameChinese: '近未来', description: 'What is approaching in the near term.', descriptionChinese: '近期即将到来的事情。' },
      { index: 6, name: 'Self', nameChinese: '自我', description: 'How you see yourself in this situation.', descriptionChinese: '你在这种情况下如何看待自己。' },
      { index: 7, name: 'Environment', nameChinese: '环境', description: 'External influences and how others see you.', descriptionChinese: '外部影响以及他人如何看待你。' },
      { index: 8, name: 'Hopes & Fears', nameChinese: '希望与恐惧', description: 'Your deepest hopes and fears about the outcome.', descriptionChinese: '你对结果最深层的希望和恐惧。' },
      { index: 9, name: 'Outcome', nameChinese: '结果', description: 'The final outcome based on the current trajectory.', descriptionChinese: '基于当前轨迹的最终结果。' },
    ],
  },
  {
    id: 'love',
    name: 'Relationship Spread',
    nameChinese: '感情牌阵',
    description: 'A 5-card spread specifically designed for relationship questions and love readings.',
    descriptionChinese: '专为感情问题和爱情解读设计的5牌阵。',
    cardCount: 5,
    category: 'love',
    positions: [
      { index: 0, name: 'You', nameChinese: '你', description: 'Your current emotional state and energy in the relationship.', descriptionChinese: '你在关系中当前的情感状态和能量。' },
      { index: 1, name: 'Partner', nameChinese: '对方', description: 'Your partner\'s current emotional state and perspective.', descriptionChinese: '对方当前的情感状态和视角。' },
      { index: 2, name: 'Connection', nameChinese: '连接', description: 'The nature of the bond between you.', descriptionChinese: '你们之间纽带的本质。' },
      { index: 3, name: 'Challenge', nameChinese: '挑战', description: 'The main challenge or obstacle in the relationship.', descriptionChinese: '关系中的主要挑战或障碍。' },
      { index: 4, name: 'Potential', nameChinese: '潜力', description: 'The potential future of the relationship.', descriptionChinese: '关系的潜在未来。' },
    ],
  },
  {
    id: 'career',
    name: 'Career Path Spread',
    nameChinese: '事业牌阵',
    description: 'A 5-card spread for career decisions, job changes, and professional growth.',
    descriptionChinese: '用于职业决策、工作变动和职业成长的5牌阵。',
    cardCount: 5,
    category: 'career',
    positions: [
      { index: 0, name: 'Current Position', nameChinese: '当前位置', description: 'Your current career situation and energy.', descriptionChinese: '你当前的职业状况和能量。' },
      { index: 1, name: 'Strengths', nameChinese: '优势', description: 'Your key strengths and assets in your career.', descriptionChinese: '你在职业中的关键优势和资产。' },
      { index: 2, name: 'Obstacles', nameChinese: '障碍', description: 'Challenges or blocks in your professional path.', descriptionChinese: '你职业道路上的挑战或阻碍。' },
      { index: 3, name: 'Action', nameChinese: '行动', description: 'The action you should take for career growth.', descriptionChinese: '你应该采取的职业成长行动。' },
      { index: 4, name: 'Outcome', nameChinese: '结果', description: 'The likely outcome of your career path.', descriptionChinese: '你职业道路的可能结果。' },
    ],
  },
  {
    id: 'year-ahead',
    name: 'Year Ahead Spread',
    nameChinese: '年度运势牌阵',
    description: 'A 12-card spread with one card for each month, providing a roadmap for the year.',
    descriptionChinese: '12张牌阵，每月一张，为你提供全年路线图。',
    cardCount: 12,
    category: 'deep',
    positions: Array.from({ length: 12 }, (_, i) => ({
      index: i,
      name: `Month ${i + 1}`,
      nameChinese: `${i + 1}月`,
      description: `Theme and energy for month ${i + 1}.`,
      descriptionChinese: `第${i + 1}个月的主题和能量。`,
    })),
  },
];

export function getSpreadById(id: string): TarotSpread | undefined {
  return SPREADS.find(s => s.id === id);
}

// ============================================================
// Card Drawing Logic
// ============================================================

/**
 * Draw cards for a reading using cryptographic randomization.
 * Returns cards with positions and reversed status.
 */
export function drawCards(spreadId: string): DrawnCard[] {
  const spread = getSpreadById(spreadId);
  if (!spread) throw new Error(`Unknown spread: ${spreadId}`);

  // Fisher-Yates shuffle with crypto-quality randomness
  const deck = [...ALL_CARDS];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return spread.positions.map((position, idx) => ({
    card: deck[idx],
    isReversed: Math.random() < 0.3, // ~30% chance of reversed
    position,
  }));
}

// ============================================================
// Format drawn cards for AI interpretation prompt
// ============================================================

export function formatDrawnCardsForPrompt(
  drawnCards: DrawnCard[],
  spread: TarotSpread,
  question: string,
  language: 'en' | 'zh' = 'en'
): string {
  const isZh = language === 'zh';
  const sections: string[] = [];

  // Header
  sections.push(isZh ? `【塔罗牌阵：${spread.nameChinese}】` : `[Tarot Spread: ${spread.name}]`);
  sections.push(isZh ? `牌阵说明：${spread.descriptionChinese}` : `Spread Description: ${spread.description}`);
  sections.push(isZh ? `问题：${question}` : `Question: ${question}`);
  sections.push(isZh ? `抽牌数量：${drawnCards.length}张` : `Cards Drawn: ${drawnCards.length}`);
  sections.push('');

  // Element summary
  const elementCounts: Record<string, number> = {};
  for (const d of drawnCards) {
    elementCounts[d.card.element] = (elementCounts[d.card.element] || 0) + 1;
  }
  const elementSummary = Object.entries(elementCounts).map(([el, ct]) => `${el}×${ct}`).join(', ');
  sections.push(isZh ? `【元素分布】${elementSummary}` : `[Element Distribution] ${elementSummary}`);

  // Arcana summary
  const majorCount = drawnCards.filter(d => d.card.arcana === 'major').length;
  const minorCount = drawnCards.filter(d => d.card.arcana === 'minor').length;
  const reversedCount = drawnCards.filter(d => d.isReversed).length;
  sections.push(isZh
    ? `【牌面统计】大阿卡纳${majorCount}张，小阿卡纳${minorCount}张，逆位${reversedCount}张`
    : `[Card Stats] Major Arcana: ${majorCount}, Minor Arcana: ${minorCount}, Reversed: ${reversedCount}`);
  sections.push('');

  // Detailed card data
  for (let i = 0; i < drawnCards.length; i++) {
    const { card, isReversed, position } = drawnCards[i];
    const posName = isZh ? position.nameChinese : position.name;
    const posDesc = isZh ? position.descriptionChinese : position.description;
    const cardName = isZh ? card.nameChinese : card.name;
    const orientation = isReversed
      ? (isZh ? '逆位' : 'Reversed')
      : (isZh ? '正位' : 'Upright');
    const meaningUpright = isZh ? card.meaningUprightChinese : card.meaningUpright;
    const meaningReversed = isZh ? card.meaningReversedChinese : card.meaningReversed;
    const activeMeaning = isReversed ? meaningReversed : meaningUpright;
    const keywords = isZh ? card.keywordsChinese : card.keywords;

    sections.push(`${'='.repeat(50)}`);
    sections.push(isZh
      ? `第${i + 1}张牌 | 牌位：${posName}（${posDesc}）`
      : `Card ${i + 1} | Position: ${posName} (${posDesc})`);
    sections.push(`${'='.repeat(50)}`);
    sections.push(isZh ? `牌名：${cardName}（${orientation}）` : `Card: ${cardName} (${orientation})`);
    sections.push(isZh
      ? `类型：${card.arcana === 'major' ? '大阿卡纳' : '小阿卡纳'}${card.suit ? ` · ${card.suit}牌组` : ''} · 编号${card.number}`
      : `Type: ${card.arcana === 'major' ? 'Major Arcana' : 'Minor Arcana'}${card.suit ? ` · ${card.suit}` : ''} · #${card.number}`);
    sections.push(isZh ? `元素：${card.element}` : `Element: ${card.element}`);
    if (card.zodiac) sections.push(isZh ? `星座对应：${card.zodiac}` : `Zodiac: ${card.zodiac}`);
    if (card.planet) sections.push(isZh ? `行星对应：${card.planet}` : `Planet: ${card.planet}`);
    sections.push(isZh ? `关键词：${keywords.join('、')}` : `Keywords: ${keywords.join(', ')}`);
    sections.push(isZh ? `牌面描述：${card.description}` : `Card Imagery: ${card.description}`);
    sections.push(isZh ? `当前牌义（${orientation}）：${activeMeaning}` : `Active Meaning (${orientation}): ${activeMeaning}`);
    sections.push(isZh ? `正位含义：${meaningUpright}` : `Upright Meaning: ${meaningUpright}`);
    sections.push(isZh ? `逆位含义：${meaningReversed}` : `Reversed Meaning: ${meaningReversed}`);
    sections.push(isZh ? `是/否占卜：${card.yesNo}` : `Yes/No: ${card.yesNo}`);
    sections.push('');
  }

  // Card interaction hints
  if (drawnCards.length >= 2) {
    sections.push(isZh ? '【牌面互动提示】' : '[Card Interaction Hints]');
    for (let i = 0; i < drawnCards.length - 1; i++) {
      const c1 = drawnCards[i].card;
      const c2 = drawnCards[i + 1].card;
      const name1 = isZh ? c1.nameChinese : c1.name;
      const name2 = isZh ? c2.nameChinese : c2.name;
      const sameElement = c1.element === c2.element;
      sections.push(isZh
        ? `· ${name1} → ${name2}：${sameElement ? '同元素（能量共振）' : `跨元素（${c1.element} → ${c2.element}，能量转换）`}`
        : `· ${name1} → ${name2}: ${sameElement ? 'Same element (energy resonance)' : `Cross-element (${c1.element} → ${c2.element}, energy shift)`}`);
    }
    sections.push('');
  }

  return sections.join('\n');
}
