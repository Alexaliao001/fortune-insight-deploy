import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  Quote,
  Shield,
  Users,
  Crown,
  LockKeyhole,
  Briefcase,
  Sparkles,
} from "lucide-react";
import {
  TarotIcon,
  BaZiIcon,
  HoroscopeIcon,
  DreamIcon,
  ChatIcon,
  ExpertIcon,
  InteractionIcon,
  GrowthIcon,
  TestimonialHeartIcon,
  TestimonialMoonIcon,
  TestimonialSparkleIcon,
  LightningIcon,
  ShieldIcon,
  CharityHeartIcon,
} from "@/components/icons/FeatureIcons";
import { Link } from "wouter";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import CosmicAlert from "@/components/CosmicAlert";
import PersonalizedHeroCTA from "@/components/PersonalizedHeroCTA";
import { trpc } from "@/lib/trpc";
import type { HomeVariantFlags, HomeVariantId } from "@/lib/homeVariant";
import { useTranslation } from "@/contexts/LanguageContext";

export interface HomeSectionProps {
  variant: HomeVariantId;
  flags: HomeVariantFlags;
  language: string;
}

function sectionPad(density: HomeVariantFlags["density"]) {
  if (density === "compact") return "py-10 md:py-14";
  if (density === "cozy") return "py-14 md:py-16";
  return "py-16 md:py-20";
}

function DynamicStats({ language }: { language: string }) {
  const { data: stats } = trpc.stats.getHomepageStats.useQuery(undefined, {
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const totalReadings = stats?.totalReadings || 0;
  const totalUsers = stats?.totalUsers || 0;
  const hasReadings = totalReadings > 0;
  const hasUsers = totalUsers > 0;

  return (
    <div className="mt-6 md:mt-12 grid grid-cols-3 gap-3 md:gap-8 max-w-lg mx-auto md:mx-0">
      <div className="text-center md:text-left">
        <div className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-[#d4a843]">
          {hasReadings ? (
            <>
              <AnimatedCounter end={totalReadings} duration={2000} />+
            </>
          ) : (
            <span className="text-base md:text-2xl">{language === "zh" ? "融合" : "East+West"}</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
          {hasReadings
            ? language === "zh"
              ? "AI报告已生成"
              : "Readings Generated"
            : language === "zh"
              ? "东西方传统"
              : "Traditions"}
        </div>
      </div>
      <div className="text-center md:text-left">
        <div className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-[#3aabb0]">
          {hasUsers ? (
            <>
              <AnimatedCounter end={totalUsers} duration={2000} />+
            </>
          ) : (
            <span className="text-base md:text-2xl">{language === "zh" ? "可体验" : "Try first"}</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
          {hasUsers
            ? language === "zh"
              ? "活跃用户"
              : "Active Users"
            : language === "zh"
              ? "先试再决定"
              : "No paywall first"}
        </div>
      </div>
      <div className="text-center md:text-left">
        <div className="text-xl sm:text-2xl md:text-4xl font-display font-bold text-[#c06080]">
          14
        </div>
        <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
          {language === "zh" ? "天注册试用" : "Day free trial"}
        </div>
      </div>
    </div>
  );
}

export function HomePreviewCard({ language, compact }: { language: string; compact?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-[rgba(212,168,67,0.22)] bg-white/[0.03] text-left ${
        compact ? "p-3" : "p-4 md:p-5"
      }`}
      data-home-preview
    >
      <div className="text-[10px] tracking-[0.2em] uppercase text-[#d4a843] mb-3">
        {language === "zh" ? "你会得到什么" : "What you'll get"}
      </div>
      <div className="flex gap-3 items-stretch">
        <div className="flex gap-1.5 shrink-0">
          {["♥", "✦", "☾"].map((s) => (
            <div
              key={s}
              className="w-9 h-14 rounded-md border border-[rgba(212,168,67,0.3)] bg-gradient-to-b from-[#2a1f4a] to-[#1a1030] flex items-center justify-center text-sm text-[#d4a843]"
            >
              {s}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0 text-xs text-muted-foreground">
          <div className="text-sm font-medium text-foreground mb-1">
            {language === "zh" ? "圣杯三 · 正位" : "Three of Cups · Upright"}
          </div>
          <div className="text-[#d4a843] mb-1">
            {language === "zh" ? "连接 · 庆祝 · 支持" : "Connection · Joy · Support"}
          </div>
          <p className="leading-relaxed line-clamp-3">
            {language === "zh"
              ? "关系中出现转机的信号；建议主动沟通一次真实感受…"
              : "A signal of turning points in relationships; consider one honest conversation…"}
          </p>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/60 mt-3">
        {language === "zh" ? "示例结构 · 非你的个性化结果" : "Sample layout · not your personal reading"}
      </p>
      <Link
        href="/tarot"
        className="inline-flex items-center gap-1 mt-3 text-sm text-[#d4a843] font-medium hover:underline"
      >
        {language === "zh" ? "用这个格式抽我的牌" : "Get my reading in this format"}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export function HomeHero({ flags, language }: HomeSectionProps) {
  const siteTitle = language === "zh" ? "洞察未来" : "Fortune Insight";
  const siteSubtitle = language === "zh" ? "遇见更好的自己" : "Discover Your True Self";
  const valueLine =
    language === "zh"
      ? "AI 塔罗 · 八字 · 星座 · 解梦 — 心理学视角，理性而不迷信"
      : "AI Tarot, BaZi, Horoscope & Dreams — psychology-first, not scare-mongering";
  const micro =
    language === "zh"
      ? "游客可先体验核心功能 · 注册解锁 14 天无限"
      : "Try core features as a guest · sign up for 14 days unlimited";

  const decorOrbs = flags.decorLevel !== "low";
  const dual = flags.heroPreviewDual;

  return (
    <section
      className={`relative overflow-hidden ${
        flags.density === "compact" ? "pt-14 pb-6 md:pt-24 md:pb-12" : "pt-16 pb-8 md:pt-32 md:pb-20"
      }`}
      data-home-hero
    >
      {decorOrbs && (
        <>
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[rgba(212,168,67,0.06)] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[rgba(120,72,176,0.06)] rounded-full blur-[100px] pointer-events-none" />
          {flags.decorLevel === "high" && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[rgba(58,171,176,0.04)] rounded-full blur-[120px] pointer-events-none" />
          )}
        </>
      )}

      <div className="container relative z-10">
        {flags.showCosmicAlert && (
          <div className="max-w-3xl mx-auto mb-4" data-home-cosmic-alert>
            {/* legacy/full = max drama; weak = compact same event library */}
            <CosmicAlert intensity={flags.alertTone === "legacy" ? "full" : "compact"} />
          </div>
        )}

        <motion.div
          className={
            dual
              ? "grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto"
              : "max-w-4xl mx-auto text-center"
          }
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={dual ? "text-center md:text-left" : ""}>
            <h1 className="mb-3 md:mb-5 leading-tight">
              <span className="block text-3xl md:text-6xl lg:text-7xl font-display font-bold gradient-text text-glow-gold tracking-wide">
                {siteTitle}
              </span>
              <span className="block text-xl md:text-4xl lg:text-5xl font-serif font-light text-foreground/90 mt-1 md:mt-2 tracking-wide">
                {siteSubtitle}
              </span>
            </h1>

            {flags.decorLevel === "high" && (
              <div className="mystic-divider max-w-md mx-auto md:mx-0 my-3 md:my-6 hidden md:flex">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-60">
                  <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6Z" fill="#d4a843" />
                </svg>
              </div>
            )}

            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto md:mx-0 mb-4 md:mb-6 leading-relaxed font-light">
              {valueLine}
            </p>

            <PersonalizedHeroCTA
              secondaryTarget={flags.secondaryCta}
              align={dual ? "start" : "center"}
            />

            <p className="text-xs text-muted-foreground mt-3 md:mt-4" data-home-trial-micro>
              {micro}
            </p>

            <DynamicStats language={language} />
          </div>

          {dual && flags.showResultPreview && (
            <div className="mt-6 md:mt-0">
              <HomePreviewCard language={language} />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function HomeTrust({ language, flags }: HomeSectionProps) {
  return (
    <section
      className={`${flags.density === "compact" ? "py-5" : "py-7"} relative border-y border-white/5`}
      data-home-trust
    >
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-80">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {language === "zh" ? "信赖保障" : "Trusted & Secure"}
          </span>
          <div className="flex items-center gap-2 text-muted-foreground">
            <LockKeyhole className="w-4 h-4" />
            <span className="text-xs font-medium">
              {language === "zh" ? "Stripe 安全支付" : "Stripe Secure Payments"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium">
              {language === "zh" ? "数据加密传输" : "Encrypted in transit"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="w-4 h-4" />
            <span className="text-xs font-medium">
              {language === "zh" ? "会员费 10% 公益" : "10% of membership → charity"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePreviewSection({ language, flags }: HomeSectionProps) {
  // classic: no result preview (matches pre-refresh home). dual hero already embeds preview.
  if (!flags.showResultPreview || flags.heroPreviewDual) return null;
  return (
    <section className={`${sectionPad(flags.density)} relative`} data-home-preview-section>
      <div className="container max-w-3xl">
        <div className="text-center mb-6">
          <span className="text-xs tracking-[0.3em] uppercase text-[rgba(212,168,67,0.6)] font-medium">
            {language === "zh" ? "预览" : "Preview"}
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold mt-2">
            {language === "zh" ? "你会得到什么" : "What you'll get"}
          </h2>
        </div>
        <HomePreviewCard language={language} />
      </div>
    </section>
  );
}

export function HomeCareer({ language, flags }: HomeSectionProps) {
  return (
    <section className={`${flags.density === "compact" ? "py-6" : "py-8"} relative`} data-home-career>
      <div className="container max-w-4xl">
        {!flags.showCosmicAlert && flags.decorLevel !== "low" && (
          <p className="text-[11px] text-[rgba(212,168,67,0.7)] mb-3 tracking-wide">
            {language === "zh" ? "今日适合 · 事业牌阵" : "Today's fit · Career spread"}
          </p>
        )}
        <Link href="/tarot?type=career">
          <div className="group rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#1a1030]/80 to-transparent px-5 py-5 md:px-7 md:py-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-amber-400/50 hover:shadow-[0_0_28px_rgba(245,158,11,0.12)] transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-medium">
                  {language === "zh" ? "求职 · 事业" : "Career · Work"}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                  {language === "zh" ? "推荐路径" : "Featured path"}
                </span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-semibold text-[#f0e6c8]">
                {language === "zh"
                  ? "工作卡关了？用塔罗看清下一步"
                  : "Stuck at work? See your next move with Career Tarot"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "zh"
                  ? "跳槽、面试、职场选择 —— 一键进入事业牌阵"
                  : "Job search, interviews, career choices — one tap to start"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-400 text-sm font-medium shrink-0">
              {language === "zh" ? "开始" : "Start"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

export function HomeServices({ language, flags }: HomeSectionProps) {
  const { t } = useTranslation();
  const services = [
    {
      SvgIcon: TarotIcon,
      title: t.home.features.tarot.title,
      description: t.home.features.tarot.description,
      href: "/tarot",
      gradient: "from-indigo-500/30 via-violet-500/20 to-purple-600/30",
      borderGlow: "hover:glow-violet",
      iconBg: "bg-indigo-500/20",
      free: true,
    },
    {
      SvgIcon: HoroscopeIcon,
      title: t.home.features.horoscope.title,
      description: t.home.features.horoscope.description,
      href: "/horoscope",
      gradient: "from-cyan-500/30 via-blue-500/20 to-teal-600/30",
      borderGlow: "hover:glow-cyan",
      iconBg: "bg-cyan-500/20",
      free: true,
    },
    {
      SvgIcon: DreamIcon,
      title: t.home.features.dream.title,
      description: t.home.features.dream.description,
      href: "/dream",
      gradient: "from-purple-500/30 via-fuchsia-500/20 to-pink-600/30",
      borderGlow: "hover:glow-rose",
      iconBg: "bg-purple-500/20",
      free: true,
    },
    {
      SvgIcon: BaZiIcon,
      title: t.home.features.bazi.title,
      description: t.home.features.bazi.description,
      href: "/bazi",
      gradient: "from-amber-500/30 via-orange-500/20 to-red-600/30",
      borderGlow: "hover:glow-gold",
      iconBg: "bg-amber-500/20",
      free: false,
    },
  ];

  return (
    <section className={`${sectionPad(flags.density)} relative`} data-home-services>
      <div className="container">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs tracking-[0.3em] uppercase text-[rgba(212,168,67,0.6)] font-medium">
            {language === "zh" ? "探索" : "Explore"}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-4">
            {language === "zh" ? (
              <>
                选择你的<span className="gradient-text">入口</span>
              </>
            ) : (
              <>
                Pick your <span className="gradient-text">path</span>
              </>
            )}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light">
            {language === "zh"
              ? "从最想问的问题开始，一次只走一条路"
              : "Start with one question — one path at a time"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const SvgIcon = service.SvgIcon;
            return (
              <Link key={service.title} href={service.href}>
                <div
                  className={`group relative h-full rounded-2xl glass-card ${service.borderGlow} cursor-pointer overflow-hidden p-6`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <SvgIcon size={32} />
                    </div>
                    <span
                      className={`absolute top-0 right-0 px-3 py-1 text-xs rounded-full border ${
                        service.free
                          ? "bg-[rgba(212,168,67,0.15)] text-[#d4a843] border-[rgba(212,168,67,0.2)]"
                          : "bg-[rgba(167,139,250,0.12)] text-violet-300 border-violet-400/25"
                      }`}
                    >
                      {service.free
                        ? language === "zh"
                          ? "可体验"
                          : "Try free"
                        : language === "zh"
                          ? "需额度"
                          : "Account / quota"}
                    </span>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#d4a843] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          <Link href="/compatibility">
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-[#d4a843]/15 to-purple-600/20 group-hover:from-pink-600/30 group-hover:via-[#d4a843]/25 group-hover:to-purple-600/30 transition-all duration-700" />
              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-pink-400/30 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 p-8 md:p-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/25 to-rose-600/25 flex items-center justify-center shrink-0">
                  <Heart className="w-8 h-8 text-pink-400" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 rounded-full border border-pink-400/20">
                      {language === "zh" ? "热门" : "Popular"}
                    </span>
                    <span className="px-3 py-1 text-xs bg-[rgba(212,168,67,0.15)] text-[#d4a843] rounded-full border border-[rgba(212,168,67,0.2)]">
                      {language === "zh" ? "可体验" : "Try free"}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-2">
                    {t.home.features.compatibility.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed max-w-lg">
                    {t.home.features.compatibility.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/20">
                  <span className="text-sm font-semibold text-pink-300 whitespace-nowrap">
                    {t.home.features.compatibility.cta}
                  </span>
                  <ArrowRight className="w-4 h-4 text-pink-400" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeFeatures({ language, flags }: HomeSectionProps) {
  const features = [
    {
      SvgIcon: LightningIcon,
      title: language === "zh" ? "AI 深度解读" : "AI-Powered Depth",
      description:
        language === "zh"
          ? "大模型生成结构化报告，可分享、可回看"
          : "Structured reports you can share and revisit",
    },
    {
      SvgIcon: ShieldIcon,
      title: language === "zh" ? "理性视角" : "Grounded Approach",
      description:
        language === "zh"
          ? "结合积极心理学，避免恐吓式迷信话术"
          : "Positive psychology — no fear-based superstition",
    },
    {
      SvgIcon: CharityHeartIcon,
      title: language === "zh" ? "公益承诺" : "Charity Commitment",
      description:
        language === "zh"
          ? "会员收入的10%将捐赠给公益项目"
          : "10% of membership revenue goes to charity",
    },
  ];

  return (
    <section className={`${sectionPad(flags.density)} relative`} data-home-features>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => {
            const SvgIcon = feature.SvgIcon;
            return (
              <div
                key={feature.title}
                className="text-center p-6 md:p-8 rounded-2xl glass-card border-gradient"
              >
                <div className="w-14 h-14 rounded-2xl bg-[rgba(212,168,67,0.12)] flex items-center justify-center mx-auto mb-4">
                  <SvgIcon size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeTestimonials({ language, flags }: HomeSectionProps) {
  const testimonials =
    language === "zh"
      ? [
          {
            content:
              "和男朋友吵架后试了爱情塔罗，AI的分析帮我看清了问题的根源。现在我们沟通好多了。",
            author: "小雨",
            role: "用户",
            avatarIcon: "heart",
          },
          {
            content: "八字分析很细致，不是模糊套话，给了很多关于感情相处的实际建议。",
            author: "晓琳",
            role: "用户",
            avatarIcon: "moon",
          },
          {
            content: "每天看星座运势已经成了习惯。最喜欢它用心理学的角度帮你理解自己。",
            author: "思思",
            role: "用户",
            avatarIcon: "sparkle",
          },
        ]
      : [
          {
            content:
              "I tried Love Tarot after a confusing date. The AI reading was surprisingly insightful.",
            author: "E.M.",
            role: "Tarot user",
            avatarIcon: "heart",
          },
          {
            content:
              "BaZi analysis gave me a new perspective — way more detailed than generic apps.",
            author: "S.K.",
            role: "BaZi user",
            avatarIcon: "moon",
          },
          {
            content:
              "Love the daily horoscope. Dream interpretation from a psychology angle is cool.",
            author: "J.L.",
            role: "Daily user",
            avatarIcon: "sparkle",
          },
        ];

  return (
    <section className={`${sectionPad(flags.density)} relative`} data-home-testimonials>
      <div className="container">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs tracking-[0.3em] uppercase text-[rgba(212,168,67,0.6)] font-medium">
            {language === "zh" ? "用户反馈" : "What Users Say"}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-3 mb-2">
            {language === "zh" ? (
              <>
                真实<span className="gradient-text">使用感受</span>
              </>
            ) : (
              <>
                Real <span className="gradient-text">Experiences</span>
              </>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-2">
            {language === "zh"
              ? "示例用户反馈 · 体验因人而异"
              : "Illustrative feedback · results vary"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="h-full glass-card rounded-2xl p-6 border-gradient">
              <Quote className="w-8 h-8 text-[rgba(212,168,67,0.25)] mb-4" />
              <p className="text-foreground/90 leading-relaxed mb-6 font-light italic text-sm">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[rgba(212,168,67,0.1)]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  {testimonial.avatarIcon === "heart" && <TestimonialHeartIcon size={40} />}
                  {testimonial.avatarIcon === "moon" && <TestimonialMoonIcon size={40} />}
                  {testimonial.avatarIcon === "sparkle" && <TestimonialSparkleIcon size={40} />}
                </div>
                <div>
                  <div className="font-medium text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeMembership({ language, flags, variant }: HomeSectionProps) {
  const plansHeavy = flags.secondaryCta === "membership";
  const classic = variant === "classic";
  const primaryHref = plansHeavy ? "/membership" : "/login";
  const secondaryHref = plansHeavy ? "/tarot" : classic ? "/charity" : "/membership";
  const showPrice = flags.showMembershipPrice;

  return (
    <section className={`${sectionPad(flags.density)} relative`} data-home-membership>
      <div className="container">
        <div
          className={`relative rounded-3xl overflow-hidden ${
            plansHeavy || classic ? "animated-border" : ""
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(212,168,67,0.08)] via-[rgba(120,72,176,0.08)] to-[rgba(192,96,128,0.08)]" />
          <div className="absolute inset-0 glass" />

          <div className={`relative z-10 ${plansHeavy || classic ? "p-8 md:p-16" : "p-7 md:p-12"} text-center`}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[rgba(212,168,67,0.12)] text-[#d4a843] mb-6 border border-[rgba(212,168,67,0.2)]">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wider">
                {classic
                  ? language === "zh"
                    ? "星光守护者会员"
                    : "Starlight Guardian"
                  : language === "zh"
                    ? "试用优先"
                    : "Try first"}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
              {classic ? (
                language === "zh" ? (
                  <>
                    开启您的<span className="text-glow-gold gradient-text"> 专属 </span>成长之旅
                  </>
                ) : (
                  <>
                    Start Your <span className="text-glow-gold gradient-text"> Exclusive </span> Journey
                  </>
                )
              ) : language === "zh" ? (
                <>
                  先免费 <span className="gradient-text text-glow-gold">14 天</span>，再决定是否留下
                </>
              ) : (
                <>
                  <span className="gradient-text text-glow-gold">14 free days</span> — then decide
                </>
              )}
            </h2>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-5 font-light leading-relaxed text-sm md:text-base">
              {classic
                ? language === "zh"
                  ? "解锁无限次塔罗、八字、解梦，获得深度AI个性化分析报告。10%会员费捐赠公益。注册另享 14 天试用。"
                  : "Unlock unlimited Tarot, BaZi, and Dream readings with deep AI reports. 10% goes to charity. New accounts also get a 14-day trial."
                : language === "zh"
                  ? "注册即送 14 天无限塔罗、八字与解梦。到期回到免费额度，升级随时可。"
                  : "Sign up for 14 days unlimited Tarot, BaZi & Dreams. After trial, free limits return — upgrade anytime."}
            </p>

            {showPrice && (
              <div className="mb-6">
                <div className="text-2xl md:text-3xl font-bold text-[#d4a843]">
                  {language === "zh" ? "¥16.6/月起" : "From $5.00/mo"}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === "zh"
                    ? "年度会员 ¥199/年 · 每月仅¥16.6 · 比月付省一半"
                    : "Yearly plan $59.99/yr · Just $5.00/mo · Save 50% vs monthly"}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a] text-base px-8 font-semibold glow-gold"
              >
                <Link href={classic ? "/membership" : primaryHref}>
                  <Crown className="w-5 h-5 mr-2" />
                  {classic
                    ? language === "zh"
                      ? "立即加入"
                      : "Join Now"
                    : plansHeavy
                      ? language === "zh"
                        ? "打开会员方案"
                        : "See membership plans"
                      : language === "zh"
                        ? "注册领试用"
                        : "Claim free trial"}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[rgba(212,168,67,0.3)] text-[#d4a843] hover:bg-[rgba(212,168,67,0.1)]"
              >
                <Link href={secondaryHref}>
                  {plansHeavy ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {language === "zh" ? "先抽免费塔罗" : "Free Tarot first"}
                    </>
                  ) : classic ? (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      {language === "zh" ? "了解公益计划" : "Learn About Charity"}
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      {language === "zh" ? "查看会员方案" : "See plans"}
                    </>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeCommunity({ language, flags }: HomeSectionProps) {
  if (!flags.showCommunityBlock) return null;

  const compact = flags.density === "compact" || flags.decorLevel === "low";

  if (compact) {
    return (
      <section className="py-10 relative" data-home-community>
        <div className="container max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
            <div>
              <h3 className="font-semibold text-sm md:text-base">
                {language === "zh" ? "社区 · 分享感悟与科普" : "Community · insights & experts"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {language === "zh" ? "与志同道合的朋友一起探索" : "Explore with like-minded people"}
              </p>
            </div>
            <Button asChild size="sm" className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a] font-semibold shrink-0">
              <Link href="/community">
                <Users className="w-4 h-4 mr-2" />
                {language === "zh" ? "进入社区" : "Explore"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${sectionPad(flags.density)} relative`} data-home-community>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-xs tracking-[0.3em] uppercase text-[rgba(212,168,67,0.6)] font-medium">
              {language === "zh" ? "社区" : "Community"}
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold mt-3 mb-4">
              {language === "zh" ? (
                <>
                  加入我们的<span className="gradient-text">心灵社区</span>
                </>
              ) : (
                <>
                  Join Our <span className="gradient-text">Community</span>
                </>
              )}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed font-light text-sm">
              {language === "zh"
                ? "分享测算感悟与成长故事，浏览科普内容，与志同道合的朋友一起探索。"
                : "Share reading insights, browse expert content, and explore with like-minded friends."}
            </p>
            <Button asChild size="lg" className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a] font-semibold glow-gold">
              <Link href="/community">
                <Users className="w-5 h-5 mr-2" />
                {language === "zh" ? "探索社区" : "Explore Community"}
              </Link>
            </Button>
          </div>
          {flags.decorLevel === "high" && (
            <div className="flex-1 grid grid-cols-2 gap-3">
              {[
                {
                  Icon: ChatIcon,
                  title: language === "zh" ? "分享感悟" : "Share Insights",
                  desc: language === "zh" ? "记录成长点滴" : "Record your growth",
                },
                {
                  Icon: ExpertIcon,
                  title: language === "zh" ? "专家内容" : "Expert Content",
                  desc: language === "zh" ? "专业知识科普" : "Professional knowledge",
                },
                {
                  Icon: InteractionIcon,
                  title: language === "zh" ? "互动交流" : "Interaction",
                  desc: language === "zh" ? "结识同道" : "Meet people",
                },
                {
                  Icon: GrowthIcon,
                  title: language === "zh" ? "成长打卡" : "Growth",
                  desc: language === "zh" ? "每日进步" : "Daily improvement",
                },
              ].map((item) => (
                <div key={item.title} className="glass-card rounded-2xl p-4">
                  <div className="mb-2">
                    <item.Icon size={28} />
                  </div>
                  <div className="font-semibold text-sm mb-0.5">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
