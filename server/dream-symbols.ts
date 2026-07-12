/**
 * Dream Symbol Database
 * 
 * Based on Jungian archetypes, Freudian symbolism, and cross-cultural
 * dream interpretation traditions. Provides structured symbol data
 * that feeds into the AI interpretation layer.
 */

export interface DreamSymbol {
  id: string;
  name: string;
  nameChinese: string;
  category: string;
  categoryChinese: string;
  jungianArchetype?: string;
  element?: string;
  meaningPositive: string;
  meaningNegative: string;
  meaningPositiveChinese: string;
  meaningNegativeChinese: string;
  psychologicalInsight: string;
  psychologicalInsightChinese: string;
  relatedEmotions: string[];
  relatedEmotionsChinese: string[];
}

export interface DreamTheme {
  id: string;
  name: string;
  nameChinese: string;
  description: string;
  descriptionChinese: string;
  commonSymbols: string[];
  psychologicalMeaning: string;
  psychologicalMeaningChinese: string;
}

// ============================================================
// Core Dream Symbols (50+ symbols covering major categories)
// ============================================================

const DREAM_SYMBOLS: DreamSymbol[] = [
  // === NATURE & ELEMENTS ===
  {
    id: 'water', name: 'Water', nameChinese: '水',
    category: 'Nature', categoryChinese: '自然',
    jungianArchetype: 'The Unconscious', element: 'Water',
    meaningPositive: 'Emotional depth, purification, renewal, flow of life, spiritual cleansing',
    meaningNegative: 'Overwhelming emotions, feeling out of control, fear of the unknown depths',
    meaningPositiveChinese: '情感深度、净化、更新、生命之流、精神洁净',
    meaningNegativeChinese: '情绪失控、感到无法掌控、对未知深处的恐惧',
    psychologicalInsight: 'Water represents the unconscious mind. Its state (calm, turbulent, clear, murky) mirrors your emotional landscape.',
    psychologicalInsightChinese: '水代表潜意识。它的状态（平静、湍急、清澈、浑浊）映射着你的情感状态。',
    relatedEmotions: ['peace', 'anxiety', 'renewal', 'fear'],
    relatedEmotionsChinese: ['平静', '焦虑', '更新', '恐惧'],
  },
  {
    id: 'fire', name: 'Fire', nameChinese: '火',
    category: 'Nature', categoryChinese: '自然',
    jungianArchetype: 'Transformation', element: 'Fire',
    meaningPositive: 'Passion, transformation, enlightenment, creative energy, purification',
    meaningNegative: 'Anger, destruction, loss of control, burnout, consuming desires',
    meaningPositiveChinese: '激情、转变、启迪、创造力、净化',
    meaningNegativeChinese: '愤怒、毁灭、失控、倦怠、吞噬性的欲望',
    psychologicalInsight: 'Fire symbolizes transformation and passion. It can represent both creative drive and destructive anger.',
    psychologicalInsightChinese: '火象征着转变和激情。它既可以代表创造性的驱动力，也可以代表毁灭性的愤怒。',
    relatedEmotions: ['passion', 'anger', 'excitement', 'fear'],
    relatedEmotionsChinese: ['激情', '愤怒', '兴奋', '恐惧'],
  },
  {
    id: 'mountain', name: 'Mountain', nameChinese: '山',
    category: 'Nature', categoryChinese: '自然',
    jungianArchetype: 'The Self', element: 'Earth',
    meaningPositive: 'Achievement, spiritual ascent, overcoming obstacles, higher perspective',
    meaningNegative: 'Insurmountable obstacles, isolation, feeling overwhelmed by challenges',
    meaningPositiveChinese: '成就、精神升华、克服障碍、更高的视角',
    meaningNegativeChinese: '不可逾越的障碍、孤立、被挑战压倒',
    psychologicalInsight: 'Mountains represent life goals and spiritual aspirations. Climbing suggests personal growth; being blocked suggests inner resistance.',
    psychologicalInsightChinese: '山代表人生目标和精神追求。攀登暗示个人成长；被阻挡暗示内心的抗拒。',
    relatedEmotions: ['determination', 'awe', 'frustration', 'achievement'],
    relatedEmotionsChinese: ['决心', '敬畏', '挫折', '成就'],
  },
  {
    id: 'forest', name: 'Forest', nameChinese: '森林',
    category: 'Nature', categoryChinese: '自然',
    jungianArchetype: 'The Unconscious', element: 'Wood',
    meaningPositive: 'Growth, natural wisdom, exploration of the self, fertility, abundance',
    meaningNegative: 'Being lost, confusion, hidden dangers, fear of the unknown',
    meaningPositiveChinese: '成长、自然智慧、自我探索、丰饶、富足',
    meaningNegativeChinese: '迷失、困惑、隐藏的危险、对未知的恐惧',
    psychologicalInsight: 'Forests represent the deeper layers of the psyche. Getting lost in a forest suggests confusion about life direction.',
    psychologicalInsightChinese: '森林代表心灵的深层。在森林中迷路暗示对人生方向的困惑。',
    relatedEmotions: ['wonder', 'fear', 'peace', 'confusion'],
    relatedEmotionsChinese: ['惊奇', '恐惧', '平静', '困惑'],
  },
  {
    id: 'sky', name: 'Sky', nameChinese: '天空',
    category: 'Nature', categoryChinese: '自然',
    element: 'Air',
    meaningPositive: 'Freedom, infinite possibilities, spiritual connection, clarity of thought',
    meaningNegative: 'Feeling ungrounded, unrealistic expectations, emptiness',
    meaningPositiveChinese: '自由、无限可能、精神连接、思维清晰',
    meaningNegativeChinese: '缺乏根基、不切实际的期望、空虚',
    psychologicalInsight: 'The sky represents consciousness and aspiration. A clear sky suggests mental clarity; a stormy sky reflects inner turmoil.',
    psychologicalInsightChinese: '天空代表意识和抱负。晴朗的天空暗示心灵清明；暴风雨的天空反映内心的动荡。',
    relatedEmotions: ['freedom', 'hope', 'loneliness', 'inspiration'],
    relatedEmotionsChinese: ['自由', '希望', '孤独', '灵感'],
  },

  // === ANIMALS ===
  {
    id: 'snake', name: 'Snake', nameChinese: '蛇',
    category: 'Animals', categoryChinese: '动物',
    jungianArchetype: 'Shadow/Transformation',
    meaningPositive: 'Transformation, healing, wisdom, kundalini energy, rebirth',
    meaningNegative: 'Hidden threats, betrayal, temptation, fear of change',
    meaningPositiveChinese: '转变、疗愈、智慧、昆达里尼能量、重生',
    meaningNegativeChinese: '隐藏的威胁、背叛、诱惑、对变化的恐惧',
    psychologicalInsight: 'Snakes are one of the most powerful dream symbols, representing the primal life force and transformation. They often appear during major life transitions.',
    psychologicalInsightChinese: '蛇是最有力的梦境符号之一，代表原始生命力和转变。它们常在重大人生转折期出现。',
    relatedEmotions: ['fear', 'fascination', 'anxiety', 'power'],
    relatedEmotionsChinese: ['恐惧', '着迷', '焦虑', '力量'],
  },
  {
    id: 'bird', name: 'Bird', nameChinese: '鸟',
    category: 'Animals', categoryChinese: '动物',
    jungianArchetype: 'Spirit/Freedom',
    meaningPositive: 'Freedom, spiritual ascent, perspective, messages from the unconscious',
    meaningNegative: 'Escapism, feeling caged, unreachable goals',
    meaningPositiveChinese: '自由、精神升华、视角、来自潜意识的信息',
    meaningNegativeChinese: '逃避现实、感到被困、遥不可及的目标',
    psychologicalInsight: 'Birds represent thoughts and spiritual aspirations. Flying birds suggest liberation; caged birds suggest feeling trapped.',
    psychologicalInsightChinese: '鸟代表思想和精神追求。飞翔的鸟暗示解放；笼中鸟暗示感到被困。',
    relatedEmotions: ['freedom', 'joy', 'longing', 'hope'],
    relatedEmotionsChinese: ['自由', '喜悦', '渴望', '希望'],
  },
  {
    id: 'dog', name: 'Dog', nameChinese: '狗',
    category: 'Animals', categoryChinese: '动物',
    meaningPositive: 'Loyalty, friendship, protection, unconditional love, trust',
    meaningNegative: 'Aggression, feeling threatened, betrayal by a trusted person',
    meaningPositiveChinese: '忠诚、友谊、保护、无条件的爱、信任',
    meaningNegativeChinese: '攻击性、感到威胁、被信任的人背叛',
    psychologicalInsight: 'Dogs represent loyalty and instinct. A friendly dog suggests trustworthy relationships; an aggressive dog may indicate trust issues.',
    psychologicalInsightChinese: '狗代表忠诚和本能。友好的狗暗示值得信赖的关系；攻击性的狗可能暗示信任问题。',
    relatedEmotions: ['trust', 'love', 'fear', 'companionship'],
    relatedEmotionsChinese: ['信任', '爱', '恐惧', '陪伴'],
  },
  {
    id: 'cat', name: 'Cat', nameChinese: '猫',
    category: 'Animals', categoryChinese: '动物',
    jungianArchetype: 'Anima/Feminine',
    meaningPositive: 'Independence, intuition, feminine power, mystery, sensuality',
    meaningNegative: 'Deception, hidden enemies, misfortune, untrustworthiness',
    meaningPositiveChinese: '独立、直觉、女性力量、神秘、感性',
    meaningNegativeChinese: '欺骗、隐藏的敌人、不幸、不可信赖',
    psychologicalInsight: 'Cats represent the feminine aspect of the psyche and intuition. They often appear when you need to trust your instincts more.',
    psychologicalInsightChinese: '猫代表心灵的女性面和直觉。它们常在你需要更信任自己直觉时出现。',
    relatedEmotions: ['curiosity', 'independence', 'mystery', 'comfort'],
    relatedEmotionsChinese: ['好奇', '独立', '神秘', '舒适'],
  },
  {
    id: 'fish', name: 'Fish', nameChinese: '鱼',
    category: 'Animals', categoryChinese: '动物',
    element: 'Water',
    meaningPositive: 'Abundance, fertility, spiritual nourishment, insights from the unconscious',
    meaningNegative: 'Slippery situations, emotional coldness, feeling out of your element',
    meaningPositiveChinese: '丰饶、生育、精神滋养、来自潜意识的洞察',
    meaningNegativeChinese: '棘手的情况、情感冷漠、感到格格不入',
    psychologicalInsight: 'Fish represent content from the unconscious mind rising to the surface. Catching a fish suggests gaining insight.',
    psychologicalInsightChinese: '鱼代表潜意识内容浮出水面。捕到鱼暗示获得洞察。',
    relatedEmotions: ['abundance', 'peace', 'surprise', 'nourishment'],
    relatedEmotionsChinese: ['丰饶', '平静', '惊喜', '滋养'],
  },
  {
    id: 'dragon', name: 'Dragon', nameChinese: '龙',
    category: 'Animals', categoryChinese: '动物',
    jungianArchetype: 'The Self/Power',
    meaningPositive: 'Power, wisdom, good fortune, spiritual strength, imperial authority',
    meaningNegative: 'Overwhelming power, fear of authority, inner demons',
    meaningPositiveChinese: '力量、智慧、好运、精神力量、帝王权威',
    meaningNegativeChinese: '压倒性的力量、对权威的恐惧、内心的魔鬼',
    psychologicalInsight: 'In Chinese culture, dragons are supreme symbols of power and good fortune. Dreaming of dragons often indicates a period of great potential.',
    psychologicalInsightChinese: '在中国文化中，龙是力量和好运的至高象征。梦见龙通常预示着巨大潜力的时期。',
    relatedEmotions: ['awe', 'power', 'fear', 'reverence'],
    relatedEmotionsChinese: ['敬畏', '力量', '恐惧', '崇敬'],
  },

  // === ACTIONS & SCENARIOS ===
  {
    id: 'flying', name: 'Flying', nameChinese: '飞翔',
    category: 'Actions', categoryChinese: '动作',
    jungianArchetype: 'Transcendence',
    meaningPositive: 'Freedom, transcendence, rising above problems, spiritual elevation',
    meaningNegative: 'Escapism, fear of falling, losing touch with reality',
    meaningPositiveChinese: '自由、超越、超越问题、精神升华',
    meaningNegativeChinese: '逃避现实、害怕坠落、脱离现实',
    psychologicalInsight: 'Flying dreams are among the most common and exhilarating. They typically reflect a desire for freedom or a sense of empowerment in waking life.',
    psychologicalInsightChinese: '飞翔梦是最常见且令人兴奋的梦之一。它们通常反映对自由的渴望或现实生活中的赋权感。',
    relatedEmotions: ['freedom', 'joy', 'fear', 'exhilaration'],
    relatedEmotionsChinese: ['自由', '喜悦', '恐惧', '兴奋'],
  },
  {
    id: 'falling', name: 'Falling', nameChinese: '坠落',
    category: 'Actions', categoryChinese: '动作',
    meaningPositive: 'Letting go, surrender, trust in the process, release of control',
    meaningNegative: 'Loss of control, anxiety, failure, insecurity, lack of support',
    meaningPositiveChinese: '放手、臣服、信任过程、释放控制',
    meaningNegativeChinese: '失控、焦虑、失败、不安全感、缺乏支持',
    psychologicalInsight: 'Falling dreams often occur during times of stress or when you feel unsupported. They reflect anxiety about losing control in some area of life.',
    psychologicalInsightChinese: '坠落梦常在压力大或感到缺乏支持时出现。它们反映对生活某个领域失控的焦虑。',
    relatedEmotions: ['anxiety', 'fear', 'helplessness', 'vulnerability'],
    relatedEmotionsChinese: ['焦虑', '恐惧', '无助', '脆弱'],
  },
  {
    id: 'chasing', name: 'Being Chased', nameChinese: '被追赶',
    category: 'Actions', categoryChinese: '动作',
    jungianArchetype: 'Shadow',
    meaningPositive: 'Motivation to confront issues, energy for change, awareness of avoidance',
    meaningNegative: 'Avoidance, running from problems, anxiety, unresolved fears',
    meaningPositiveChinese: '面对问题的动力、改变的能量、对逃避的觉察',
    meaningNegativeChinese: '逃避、逃避问题、焦虑、未解决的恐惧',
    psychologicalInsight: 'Being chased is the most common nightmare theme. The pursuer often represents an aspect of yourself or a situation you are avoiding.',
    psychologicalInsightChinese: '被追赶是最常见的噩梦主题。追赶者通常代表你自身的某个方面或你正在逃避的情况。',
    relatedEmotions: ['fear', 'anxiety', 'panic', 'urgency'],
    relatedEmotionsChinese: ['恐惧', '焦虑', '恐慌', '紧迫'],
  },
  {
    id: 'teeth_falling', name: 'Teeth Falling Out', nameChinese: '掉牙',
    category: 'Actions', categoryChinese: '动作',
    meaningPositive: 'Personal growth, transition, shedding old identity, renewal',
    meaningNegative: 'Anxiety about appearance, fear of aging, loss of power, embarrassment',
    meaningPositiveChinese: '个人成长、过渡、蜕去旧身份、更新',
    meaningNegativeChinese: '对外表的焦虑、对衰老的恐惧、失去力量、尴尬',
    psychologicalInsight: 'Teeth dreams are extremely common and often relate to anxiety about self-image, communication, or a sense of powerlessness.',
    psychologicalInsightChinese: '掉牙梦极为常见，通常与对自我形象、沟通能力或无力感的焦虑有关。',
    relatedEmotions: ['anxiety', 'embarrassment', 'vulnerability', 'aging'],
    relatedEmotionsChinese: ['焦虑', '尴尬', '脆弱', '衰老'],
  },
  {
    id: 'exam', name: 'Taking an Exam', nameChinese: '考试',
    category: 'Actions', categoryChinese: '动作',
    meaningPositive: 'Self-evaluation, readiness for challenges, desire for achievement',
    meaningNegative: 'Fear of failure, feeling unprepared, performance anxiety, self-doubt',
    meaningPositiveChinese: '自我评估、迎接挑战的准备、对成就的渴望',
    meaningNegativeChinese: '害怕失败、感到准备不足、表现焦虑、自我怀疑',
    psychologicalInsight: 'Exam dreams often occur when you feel judged or tested in waking life. They reflect concerns about measuring up to expectations.',
    psychologicalInsightChinese: '考试梦常在你感到被评判或考验时出现。它们反映对是否达到期望的担忧。',
    relatedEmotions: ['anxiety', 'stress', 'inadequacy', 'pressure'],
    relatedEmotionsChinese: ['焦虑', '压力', '不足感', '压迫'],
  },
  {
    id: 'naked', name: 'Being Naked in Public', nameChinese: '当众裸体',
    category: 'Actions', categoryChinese: '动作',
    jungianArchetype: 'Persona',
    meaningPositive: 'Authenticity, vulnerability as strength, shedding pretenses',
    meaningNegative: 'Vulnerability, shame, fear of exposure, feeling unprepared',
    meaningPositiveChinese: '真实、脆弱即力量、放下伪装',
    meaningNegativeChinese: '脆弱、羞耻、害怕被揭露、感到准备不足',
    psychologicalInsight: 'Nakedness dreams reflect concerns about how others perceive you. They often appear when you feel exposed or fear being judged.',
    psychologicalInsightChinese: '裸体梦反映对他人如何看待你的担忧。它们常在你感到暴露或害怕被评判时出现。',
    relatedEmotions: ['shame', 'vulnerability', 'anxiety', 'exposure'],
    relatedEmotionsChinese: ['羞耻', '脆弱', '焦虑', '暴露'],
  },
  {
    id: 'death', name: 'Death', nameChinese: '死亡',
    category: 'Actions', categoryChinese: '动作',
    jungianArchetype: 'Transformation',
    meaningPositive: 'Major transformation, ending of old patterns, rebirth, new chapter',
    meaningNegative: 'Fear of loss, anxiety about mortality, grief, resistance to change',
    meaningPositiveChinese: '重大转变、旧模式的终结、重生、新篇章',
    meaningNegativeChinese: '害怕失去、对死亡的焦虑、悲伤、抗拒变化',
    psychologicalInsight: 'Death in dreams rarely predicts actual death. It almost always symbolizes the end of something — a relationship, job, phase, or old identity.',
    psychologicalInsightChinese: '梦中的死亡很少预示实际的死亡。它几乎总是象征某事的结束——一段关系、工作、阶段或旧身份。',
    relatedEmotions: ['fear', 'grief', 'acceptance', 'transformation'],
    relatedEmotionsChinese: ['恐惧', '悲伤', '接受', '转变'],
  },

  // === PLACES & STRUCTURES ===
  {
    id: 'house', name: 'House', nameChinese: '房子',
    category: 'Places', categoryChinese: '场所',
    jungianArchetype: 'The Self',
    meaningPositive: 'The self, inner world, security, personal identity, foundation',
    meaningNegative: 'Feeling trapped, neglected aspects of self, instability',
    meaningPositiveChinese: '自我、内心世界、安全感、个人身份、根基',
    meaningNegativeChinese: '感到被困、被忽视的自我方面、不稳定',
    psychologicalInsight: 'Houses represent the self. Different rooms represent different aspects of your psyche. The condition of the house reflects your self-perception.',
    psychologicalInsightChinese: '房子代表自我。不同的房间代表心灵的不同方面。房子的状况反映你的自我认知。',
    relatedEmotions: ['security', 'comfort', 'anxiety', 'nostalgia'],
    relatedEmotionsChinese: ['安全', '舒适', '焦虑', '怀旧'],
  },
  {
    id: 'road', name: 'Road/Path', nameChinese: '道路',
    category: 'Places', categoryChinese: '场所',
    meaningPositive: 'Life journey, direction, progress, choices, personal path',
    meaningNegative: 'Feeling lost, wrong direction, obstacles, uncertainty about the future',
    meaningPositiveChinese: '人生旅程、方向、进步、选择、个人道路',
    meaningNegativeChinese: '感到迷失、错误方向、障碍、对未来的不确定',
    psychologicalInsight: 'Roads represent your life path. A clear road suggests confidence in direction; a blocked or forked road suggests decision-making challenges.',
    psychologicalInsightChinese: '道路代表你的人生道路。清晰的路暗示对方向的信心；被阻或分叉的路暗示决策挑战。',
    relatedEmotions: ['direction', 'uncertainty', 'adventure', 'confusion'],
    relatedEmotionsChinese: ['方向', '不确定', '冒险', '困惑'],
  },
  {
    id: 'bridge', name: 'Bridge', nameChinese: '桥',
    category: 'Places', categoryChinese: '场所',
    meaningPositive: 'Transition, connection, overcoming obstacles, new opportunities',
    meaningNegative: 'Fear of change, unstable transition, risk, point of no return',
    meaningPositiveChinese: '过渡、连接、克服障碍、新机会',
    meaningNegativeChinese: '害怕改变、不稳定的过渡、风险、不归路',
    psychologicalInsight: 'Bridges represent transitions between life phases. Crossing a bridge suggests you are moving through a significant change.',
    psychologicalInsightChinese: '桥代表人生阶段之间的过渡。过桥暗示你正在经历重大变化。',
    relatedEmotions: ['hope', 'fear', 'determination', 'uncertainty'],
    relatedEmotionsChinese: ['希望', '恐惧', '决心', '不确定'],
  },
  {
    id: 'ocean', name: 'Ocean', nameChinese: '海洋',
    category: 'Places', categoryChinese: '场所',
    jungianArchetype: 'Collective Unconscious', element: 'Water',
    meaningPositive: 'Vast potential, emotional depth, collective wisdom, spiritual vastness',
    meaningNegative: 'Feeling overwhelmed, fear of the unknown, emotional turbulence',
    meaningPositiveChinese: '巨大潜力、情感深度、集体智慧、精神广阔',
    meaningNegativeChinese: '感到不堪重负、对未知的恐惧、情感动荡',
    psychologicalInsight: 'The ocean represents the collective unconscious and the totality of emotional experience. Its state reflects your relationship with your deepest feelings.',
    psychologicalInsightChinese: '海洋代表集体无意识和情感体验的总和。它的状态反映你与最深层感受的关系。',
    relatedEmotions: ['awe', 'fear', 'peace', 'overwhelm'],
    relatedEmotionsChinese: ['敬畏', '恐惧', '平静', '不堪重负'],
  },

  // === PEOPLE & FIGURES ===
  {
    id: 'baby', name: 'Baby', nameChinese: '婴儿',
    category: 'People', categoryChinese: '人物',
    jungianArchetype: 'Divine Child',
    meaningPositive: 'New beginnings, innocence, potential, creativity, vulnerability',
    meaningNegative: 'Helplessness, dependency, neglected inner child, unmet needs',
    meaningPositiveChinese: '新的开始、天真、潜力、创造力、脆弱',
    meaningNegativeChinese: '无助、依赖、被忽视的内在小孩、未满足的需求',
    psychologicalInsight: 'Babies represent new projects, ideas, or aspects of yourself that are developing. They can also represent your inner child.',
    psychologicalInsightChinese: '婴儿代表正在发展的新项目、想法或自我方面。它们也可以代表你的内在小孩。',
    relatedEmotions: ['tenderness', 'anxiety', 'hope', 'vulnerability'],
    relatedEmotionsChinese: ['温柔', '焦虑', '希望', '脆弱'],
  },
  {
    id: 'stranger', name: 'Stranger', nameChinese: '陌生人',
    category: 'People', categoryChinese: '人物',
    jungianArchetype: 'Shadow/Anima/Animus',
    meaningPositive: 'Unknown aspects of self, new possibilities, hidden potential',
    meaningNegative: 'Fear of the unknown, unacknowledged parts of personality',
    meaningPositiveChinese: '未知的自我方面、新的可能性、隐藏的潜力',
    meaningNegativeChinese: '对未知的恐惧、未被承认的人格部分',
    psychologicalInsight: 'Strangers in dreams often represent aspects of yourself that you have not yet recognized or integrated into your conscious identity.',
    psychologicalInsightChinese: '梦中的陌生人通常代表你尚未认识或整合到意识身份中的自我方面。',
    relatedEmotions: ['curiosity', 'fear', 'intrigue', 'discomfort'],
    relatedEmotionsChinese: ['好奇', '恐惧', '好奇心', '不适'],
  },
  {
    id: 'parent', name: 'Parent', nameChinese: '父母',
    category: 'People', categoryChinese: '人物',
    jungianArchetype: 'Great Mother/Father',
    meaningPositive: 'Guidance, protection, wisdom, nurturing, authority',
    meaningNegative: 'Control, unresolved family issues, dependency, judgment',
    meaningPositiveChinese: '指导、保护、智慧、养育、权威',
    meaningNegativeChinese: '控制、未解决的家庭问题、依赖、评判',
    psychologicalInsight: 'Parents in dreams represent authority figures and internalized parental voices. They often appear when you are dealing with authority or independence issues.',
    psychologicalInsightChinese: '梦中的父母代表权威人物和内化的父母声音。它们常在你处理权威或独立问题时出现。',
    relatedEmotions: ['love', 'resentment', 'security', 'rebellion'],
    relatedEmotionsChinese: ['爱', '怨恨', '安全', '叛逆'],
  },

  // === OBJECTS ===
  {
    id: 'mirror', name: 'Mirror', nameChinese: '镜子',
    category: 'Objects', categoryChinese: '物品',
    jungianArchetype: 'The Self',
    meaningPositive: 'Self-reflection, truth, self-awareness, clarity',
    meaningNegative: 'Vanity, distorted self-image, fear of seeing the truth',
    meaningPositiveChinese: '自我反思、真相、自我意识、清晰',
    meaningNegativeChinese: '虚荣、扭曲的自我形象、害怕看到真相',
    psychologicalInsight: 'Mirrors represent self-examination. What you see in the mirror reflects how you perceive yourself at a deep level.',
    psychologicalInsightChinese: '镜子代表自我审视。你在镜中看到的反映了你在深层如何看待自己。',
    relatedEmotions: ['curiosity', 'fear', 'acceptance', 'shock'],
    relatedEmotionsChinese: ['好奇', '恐惧', '接受', '震惊'],
  },
  {
    id: 'key', name: 'Key', nameChinese: '钥匙',
    category: 'Objects', categoryChinese: '物品',
    meaningPositive: 'Solutions, access, knowledge, opportunity, unlocking potential',
    meaningNegative: 'Locked out, missing something important, secrets',
    meaningPositiveChinese: '解决方案、通道、知识、机会、释放潜力',
    meaningNegativeChinese: '被锁在外面、遗失重要事物、秘密',
    psychologicalInsight: 'Keys represent access to knowledge or solutions. Finding a key suggests you are close to solving a problem or gaining new understanding.',
    psychologicalInsightChinese: '钥匙代表获取知识或解决方案的途径。找到钥匙暗示你即将解决问题或获得新的理解。',
    relatedEmotions: ['hope', 'frustration', 'discovery', 'relief'],
    relatedEmotionsChinese: ['希望', '挫折', '发现', '释然'],
  },
  {
    id: 'money', name: 'Money', nameChinese: '金钱',
    category: 'Objects', categoryChinese: '物品',
    meaningPositive: 'Self-worth, abundance, power, success, energy exchange',
    meaningNegative: 'Greed, anxiety about finances, feeling undervalued, loss',
    meaningPositiveChinese: '自我价值、丰饶、力量、成功、能量交换',
    meaningNegativeChinese: '贪婪、对财务的焦虑、感到被低估、损失',
    psychologicalInsight: 'Money in dreams often represents self-worth and personal value rather than literal finances. Losing money may reflect feeling undervalued.',
    psychologicalInsightChinese: '梦中的金钱通常代表自我价值和个人价值，而非字面上的财务。丢钱可能反映感到被低估。',
    relatedEmotions: ['security', 'anxiety', 'greed', 'satisfaction'],
    relatedEmotionsChinese: ['安全', '焦虑', '贪婪', '满足'],
  },
  {
    id: 'clock', name: 'Clock/Time', nameChinese: '时钟/时间',
    category: 'Objects', categoryChinese: '物品',
    meaningPositive: 'Awareness of time, punctuality, life rhythm, timely action',
    meaningNegative: 'Running out of time, pressure, mortality, missed opportunities',
    meaningPositiveChinese: '时间意识、准时、生活节奏、及时行动',
    meaningNegativeChinese: '时间不够、压力、死亡、错过的机会',
    psychologicalInsight: 'Clocks represent your relationship with time and mortality. A stopped clock may suggest feeling stuck; a racing clock reflects time pressure.',
    psychologicalInsightChinese: '时钟代表你与时间和死亡的关系。停止的时钟可能暗示感到停滞；飞速转动的时钟反映时间压力。',
    relatedEmotions: ['urgency', 'anxiety', 'nostalgia', 'pressure'],
    relatedEmotionsChinese: ['紧迫', '焦虑', '怀旧', '压力'],
  },
];

// ============================================================
// Common Dream Themes
// ============================================================

const DREAM_THEMES: DreamTheme[] = [
  {
    id: 'anxiety', name: 'Anxiety Dreams', nameChinese: '焦虑梦',
    description: 'Dreams reflecting worry, stress, or unresolved tension from waking life.',
    descriptionChinese: '反映现实生活中的担忧、压力或未解决的紧张的梦。',
    commonSymbols: ['falling', 'chasing', 'exam', 'teeth_falling', 'naked'],
    psychologicalMeaning: 'Anxiety dreams serve as a pressure valve for accumulated stress. They highlight areas of life where you feel unprepared or out of control.',
    psychologicalMeaningChinese: '焦虑梦是累积压力的减压阀。它们突出了你感到准备不足或失控的生活领域。',
  },
  {
    id: 'transformation', name: 'Transformation Dreams', nameChinese: '转变梦',
    description: 'Dreams about major life changes, endings, and new beginnings.',
    descriptionChinese: '关于重大人生变化、结束和新开始的梦。',
    commonSymbols: ['death', 'snake', 'fire', 'bridge', 'baby'],
    psychologicalMeaning: 'Transformation dreams appear during periods of significant personal growth. They signal that your psyche is processing deep changes.',
    psychologicalMeaningChinese: '转变梦出现在重大个人成长时期。它们表明你的心灵正在处理深层变化。',
  },
  {
    id: 'freedom', name: 'Freedom & Aspiration Dreams', nameChinese: '自由与抱负梦',
    description: 'Dreams about flying, exploration, and breaking free from limitations.',
    descriptionChinese: '关于飞翔、探索和突破限制的梦。',
    commonSymbols: ['flying', 'bird', 'sky', 'mountain', 'road'],
    psychologicalMeaning: 'Freedom dreams reflect your desire for liberation from constraints. They often appear when you feel restricted in waking life.',
    psychologicalMeaningChinese: '自由梦反映你对摆脱束缚的渴望。它们常在你感到被限制时出现。',
  },
  {
    id: 'relationship', name: 'Relationship Dreams', nameChinese: '关系梦',
    description: 'Dreams involving family, partners, friends, or strangers that reflect interpersonal dynamics.',
    descriptionChinese: '涉及家人、伴侣、朋友或陌生人的梦，反映人际关系动态。',
    commonSymbols: ['parent', 'stranger', 'baby', 'dog', 'house'],
    psychologicalMeaning: 'Relationship dreams process your feelings about connections with others. Characters often represent aspects of yourself projected onto others.',
    psychologicalMeaningChinese: '关系梦处理你对与他人连接的感受。角色通常代表你投射到他人身上的自我方面。',
  },
  {
    id: 'self_discovery', name: 'Self-Discovery Dreams', nameChinese: '自我发现梦',
    description: 'Dreams about exploring unknown places, finding hidden rooms, or discovering new abilities.',
    descriptionChinese: '关于探索未知地方、发现隐藏房间或发现新能力的梦。',
    commonSymbols: ['house', 'forest', 'mirror', 'key', 'ocean'],
    psychologicalMeaning: 'Self-discovery dreams indicate your psyche is ready to explore new aspects of identity. They often precede periods of personal insight.',
    psychologicalMeaningChinese: '自我发现梦表明你的心灵准备好探索身份的新方面。它们常在个人洞察期之前出现。',
  },
];

// ============================================================
// Exports
// ============================================================

export const ALL_SYMBOLS = DREAM_SYMBOLS;
export const ALL_THEMES = DREAM_THEMES;

export function findSymbolById(id: string): DreamSymbol | undefined {
  return DREAM_SYMBOLS.find(s => s.id === id);
}

export function findSymbolsByText(text: string, language: 'en' | 'zh' = 'en'): DreamSymbol[] {
  const lowerText = text.toLowerCase();
  return DREAM_SYMBOLS.filter(s => {
    const name = language === 'zh' ? s.nameChinese : s.name.toLowerCase();
    const category = language === 'zh' ? s.categoryChinese : s.category.toLowerCase();
    return lowerText.includes(name.toLowerCase()) || lowerText.includes(category.toLowerCase());
  });
}

export function identifyTheme(symbolIds: string[]): DreamTheme | undefined {
  let bestMatch: DreamTheme | undefined;
  let bestScore = 0;
  
  for (const theme of DREAM_THEMES) {
    const overlap = theme.commonSymbols.filter(s => symbolIds.includes(s)).length;
    const score = overlap / theme.commonSymbols.length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = theme;
    }
  }
  
  return bestScore > 0.2 ? bestMatch : undefined;
}

export function formatSymbolsForPrompt(
  symbols: DreamSymbol[],
  dreamContent: string,
  theme: DreamTheme | undefined,
  language: 'en' | 'zh' = 'en'
): string {
  const isZh = language === 'zh';
  const sections: string[] = [];

  sections.push(isZh ? '【梦境符号分析】' : '[Dream Symbol Analysis]');
  sections.push('');

  if (theme) {
    sections.push(isZh ? `梦境主题：${theme.nameChinese}` : `Dream Theme: ${theme.name}`);
    sections.push(isZh ? `主题含义：${theme.psychologicalMeaningChinese}` : `Theme Meaning: ${theme.psychologicalMeaning}`);
    sections.push('');
  }

  for (const symbol of symbols) {
    const name = isZh ? symbol.nameChinese : symbol.name;
    const positive = isZh ? symbol.meaningPositiveChinese : symbol.meaningPositive;
    const negative = isZh ? symbol.meaningNegativeChinese : symbol.meaningNegative;
    const insight = isZh ? symbol.psychologicalInsightChinese : symbol.psychologicalInsight;
    const archetype = symbol.jungianArchetype ? ` (${isZh ? '荣格原型' : 'Archetype'}: ${symbol.jungianArchetype})` : '';

    sections.push(`--- ${name}${archetype} ---`);
    sections.push(`${isZh ? '积极含义' : 'Positive'}: ${positive}`);
    sections.push(`${isZh ? '消极含义' : 'Negative'}: ${negative}`);
    sections.push(`${isZh ? '心理洞察' : 'Psychological Insight'}: ${insight}`);
    sections.push('');
  }

  sections.push(isZh ? `原始梦境：${dreamContent}` : `Original Dream: ${dreamContent}`);

  return sections.join('\n');
}
