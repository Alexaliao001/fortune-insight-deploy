import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarryBackground from "@/components/StarryBackground";
import SEOHead from "@/components/SEOHead";
import HomeVariantPicker from "@/components/HomeVariantPicker";
import {
  HomeHero,
  HomeTrust,
  HomePreviewSection,
  HomeCareer,
  HomeServices,
  HomeFeatures,
  HomeTestimonials,
  HomeMembership,
  HomeCommunity,
} from "@/components/home/HomeSections";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  type HomeVariantId,
  getHomeVariantFlags,
  resolveInitialHomeVariant,
  writeHomeVariant,
} from "@/lib/homeVariant";

/**
 * Homepage: shared conversion IA + five appearance variants via registry flags.
 * Not five competing funnels — see GROK_GOAL_HOME.md / homeVariant.ts.
 */
export default function Home() {
  const { language } = useTranslation();
  const [variant, setVariant] = useState<HomeVariantId>("focus");

  useEffect(() => {
    setVariant(resolveInitialHomeVariant());
  }, []);

  const flags = useMemo(() => getHomeVariantFlags(variant), [variant]);

  const onVariantChange = useCallback((id: HomeVariantId) => {
    const next = writeHomeVariant(id);
    setVariant(next);
  }, []);

  // Preference lives site-wide on <html> for optional future chrome tinting.
  // Product pages (Tarot/BaZi/…) intentionally keep a single layout — not 5 forks.

  const sectionProps = { variant, flags, language };

  return (
    <div
      className="min-h-screen flex flex-col"
      data-home-variant={variant}
      data-home-secondary-cta={flags.secondaryCta}
      data-home-community={flags.showCommunityBlock ? "1" : "0"}
      data-home-alert={flags.showCosmicAlert ? "1" : "0"}
      data-home-preview-dual={flags.heroPreviewDual ? "1" : "0"}
    >
      <SEOHead titleKey="home" path="/" />
      <StarryBackground />
      <Navbar />

      <HomeHero {...sectionProps} />
      <HomeTrust {...sectionProps} />
      <HomePreviewSection {...sectionProps} />
      <HomeCareer {...sectionProps} />
      <HomeServices {...sectionProps} />
      <HomeFeatures {...sectionProps} />
      <HomeTestimonials {...sectionProps} />
      <HomeMembership {...sectionProps} />
      <HomeCommunity {...sectionProps} />

      <Footer />

      <HomeVariantPicker value={variant} onChange={onVariantChange} />
    </div>
  );
}
