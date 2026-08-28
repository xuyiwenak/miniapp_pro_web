import type { Locale } from './copy';

type HomeCopy = {
  announcement: string;
  nav: string[];
  login: string;
  enterStudio: string;
  menu: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  primaryAction: string;
  scroll: string;
  keywords: string[];
  philosophyLabel: string;
  philosophyTitle: string;
  philosophyBody: string;
  freedomLabel: string;
  freedomTitle: string;
  freedomBody: string;
  learnMore: string;
  journeyLabel: string;
  journeyTitle: string;
  journeySteps: string[];
  privateCue: string;
  therapyLabel: string;
  therapyTitle: string;
  therapyBody: string;
  disclaimer: string;
  galleryLabel: string;
  galleryTitle: string;
  galleryCaptions: string[];
  galleryNote: string;
  privacyLabel: string;
  privacyTitle: string;
  privacyBody: string;
  privacyPoints: string[];
  privacyQuote: string;
  closingLabel: string;
  closingTitle: string;
  closingBody: string;
  explore: string;
  support: string;
  language: string;
  privacyPolicy: string;
  terms: string;
  contact: string;
  tagline: string;
};

export const HOME_COPY: Record<Locale, HomeCopy> = {
  'zh-CN': {
    announcement: '用艺术照见内心，让创造成为日常。',
    nav: ['品牌理念', '艺术疗愈', '如何开始', '作品世界'],
    login: '登录',
    enterStudio: '进入空间',
    menu: '打开导航菜单',
    heroEyebrow: '原色有感 · ORIGINAL SENSE',
    heroTitle: '让创作，成为看见自己的方式',
    heroBody: '在色彩与表达中，慢慢听见内心的声音。',
    primaryAction: '开始艺术解读',
    scroll: '向下探索',
    keywords: ['感受', '表达', '看见', '理解', '成长'],
    philosophyLabel: 'OUR PHILOSOPHY / 品牌理念',
    philosophyTitle: '艺术不需要画得正确，它只需要真实地发生。',
    philosophyBody: '每一次落笔，都是一次与自己相遇。',
    freedomLabel: 'CREATIVE FREEDOM / 自由表达',
    freedomTitle: '每一种颜色，都有它想说的话。',
    freedomBody:
      '我们不评判作品是否漂亮，也不急着给出答案。' +
      '创作，是让情绪被看见、让感受有地方停留。',
    learnMore: '了解艺术疗愈',
    journeyLabel: 'HOW IT WORKS / 如何开始',
    journeyTitle: '从一幅画开始，慢慢读懂自己。',
    journeySteps: ['上传或拍摄作品', '获得温和的艺术解读', '保存并观察自己的变化'],
    privateCue: '你的作品仅对你可见',
    therapyLabel: 'ART & INNER WORLD / 艺术与内在世界',
    therapyTitle: '有些感受，比语言更早抵达。',
    therapyBody:
      '创作让情绪流动，也让难以言说的体验被看见。' +
      '我们提供的是自我表达与自我观察的空间。',
    disclaimer: '本服务不替代专业医疗、心理诊断或治疗。',
    galleryLabel: 'A WORLD OF FEELINGS / 作品世界',
    galleryTitle: '每一幅作品，都是一个正在发生的世界。',
    galleryCaptions: ['自由', '想象', '力量', '流动'],
    galleryNote: '不解释对错，只邀请看见。',
    privacyLabel: 'A PRIVATE SPACE / 安心表达',
    privacyTitle: '你的作品，属于你。',
    privacyBody:
      '作品、解读报告与个人记录受到保护。我们只在提供服务所需的范围内处理数据。',
    privacyPoints: ['仅本人可见', '安全保存记录', '随时管理自己的内容'],
    privacyQuote: '在安全的空间里，真实才有机会发生。',
    closingLabel: 'BEGIN WITH ONE IMAGE / 从一幅画开始',
    closingTitle: '准备好，开始认识自己了吗？',
    closingBody: '无需准备，也没有标准答案。',
    explore: '探索',
    support: '支持',
    language: '语言',
    privacyPolicy: '隐私政策',
    terms: '服务条款',
    contact: '联系我们',
    tagline: '让创作成为看见自己的方式。',
  },
  en: {
    announcement: 'See inward through art. Make creating part of everyday life.',
    nav: ['Philosophy', 'Art & Reflection', 'How It Works', 'Art Worlds'],
    login: 'Sign in',
    enterStudio: 'Enter studio',
    menu: 'Open navigation menu',
    heroEyebrow: 'ORIGINAL SENSE · 原色有感',
    heroTitle: 'Create freely. Discover deeply.',
    heroBody: 'Listen to your inner world through colour and expression.',
    primaryAction: 'Begin art reflection',
    scroll: 'Explore below',
    keywords: ['Feel', 'Express', 'See', 'Understand', 'Grow'],
    philosophyLabel: 'OUR PHILOSOPHY',
    philosophyTitle: 'Art does not need to be correct. It only needs to be true.',
    philosophyBody: 'Every mark is another meeting with yourself.',
    freedomLabel: 'CREATIVE FREEDOM',
    freedomTitle: 'Every colour has something to say.',
    freedomBody:
      'We do not judge whether a work is beautiful or rush to explain it. ' +
      'Making gives emotion a place to be seen and felt.',
    learnMore: 'Discover our approach',
    journeyLabel: 'HOW IT WORKS',
    journeyTitle: 'Begin with one image. Understand yourself over time.',
    journeySteps: ['Upload or photograph your work', 'Receive a gentle art reflection', 'Save and notice your changes'],
    privateCue: 'Your work is visible only to you',
    therapyLabel: 'ART & INNER WORLD',
    therapyTitle: 'Some feelings arrive before words.',
    therapyBody:
      'Creating lets emotion move and makes difficult experiences visible. ' +
      'We offer space for expression and self-observation.',
    disclaimer: 'This service is not a substitute for medical or psychological diagnosis or treatment.',
    galleryLabel: 'A WORLD OF FEELINGS',
    galleryTitle: 'Every artwork is a world in motion.',
    galleryCaptions: ['Freedom', 'Imagination', 'Strength', 'Flow'],
    galleryNote: 'No right or wrong. Only an invitation to see.',
    privacyLabel: 'A PRIVATE SPACE',
    privacyTitle: 'Your artwork belongs to you.',
    privacyBody:
      'Your artwork, reflections, and personal records are protected. ' +
      'We process data only as needed to provide the service.',
    privacyPoints: ['Visible only to you', 'Records stored securely', 'Manage your content anytime'],
    privacyQuote: 'Truth has room to emerge when the space feels safe.',
    closingLabel: 'BEGIN WITH ONE IMAGE',
    closingTitle: 'Ready to begin meeting yourself?',
    closingBody: 'No preparation. No standard answer.',
    explore: 'Explore',
    support: 'Support',
    language: 'Language',
    privacyPolicy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    tagline: 'Let creating become a way of seeing yourself.',
  },
};
