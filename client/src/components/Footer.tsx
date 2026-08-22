import { Sparkles, Heart, Mail, Shield } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t, language } = useTranslation();
  const siteTitle = language === "zh" ? "洞察未来" : "Fortune Insight";

  return (
    <footer className="relative border-t border-[rgba(212,168,67,0.08)] bg-[rgba(8,9,24,0.8)] backdrop-blur-xl">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(212,168,67,0.3)] to-transparent" />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Sparkles className="w-6 h-6 text-[#d4a843]" />
              <span className="text-lg font-display font-bold gradient-text tracking-wider">{siteTitle}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-light">
              {language === "zh" 
                ? "结合AI技术与传统智慧，为您提供科学化的命理分析与心理成长服务。"
                : "Combining AI technology with ancient wisdom to provide scientific destiny analysis and personal growth services."}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm tracking-wider uppercase">{t.footer.services}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/tarot" className="hover:text-[#d4a843] transition-colors duration-300">
                  {t.nav.tarot}
                </Link>
              </li>
              <li>
                <Link href="/bazi" className="hover:text-[#d4a843] transition-colors duration-300">
                  {t.nav.bazi}
                </Link>
              </li>
              <li>
                <Link href="/horoscope" className="hover:text-[#d4a843] transition-colors duration-300">
                  {t.nav.horoscope}
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#d4a843] transition-colors duration-300">
                  {t.nav.community}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground text-sm tracking-wider uppercase">{t.footer.support}</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-[#d4a843] transition-colors duration-300">
                  {t.common.about}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#d4a843] transition-colors duration-300">
                  {language === "zh" ? "常见问题" : "FAQ"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#d4a843] transition-colors duration-300">
                  {t.common.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#d4a843] transition-colors duration-300">
                  {t.common.terms}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#d4a843] transition-colors duration-300">
                  {t.common.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Charity */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground flex items-center gap-2 text-sm tracking-wider uppercase">
              <Heart className="w-4 h-4 text-[#c06080]" />
              {language === "zh" ? "公益承诺" : "Charity"}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3 font-light">
              {language === "zh"
                ? "我们承诺将会员收入的10%捐赠给公益项目，帮助需要帮助的人。"
                : "We pledge to donate 10% of membership revenue to charity projects."}
            </p>
            <Link 
              href="/charity" 
              className="text-sm text-[#d4a843] hover:text-[#e0b94e] transition-colors duration-300"
            >
              {language === "zh" ? "查看捐赠记录 →" : "View donation records →"}
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[rgba(212,168,67,0.08)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-[rgba(212,168,67,0.5)]" />
            <span className="font-light">{language === "zh" ? "您的数据安全受到保护" : "Your data is protected"}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="mailto:fortuneinsight@outlook.com" className="flex items-center gap-1.5 hover:text-[#d4a843] transition-colors duration-300">
              <Mail className="w-4 h-4" />
              <span className="font-light">fortuneinsight@outlook.com</span>
            </a>
            <a href="https://x.com/FortuneInsight_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#d4a843] transition-colors duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span className="font-light">@FortuneInsight_</span>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground font-light">
          <p className="flex flex-wrap justify-center gap-x-2 gap-y-1 opacity-70">
            <a
              href="https://t.me/storefrontbrief"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4a843] transition-colors duration-300"
            >
              Storefront Brief — weekly App Store intel (Telegram)
            </a>
            <span className="opacity-40">·</span>
            <a
              href="https://buy.stripe.com/6oUcMZ17IbCk4X3dmle7m02"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4a843] transition-colors duration-300"
            >
              Full brief $12/mo
            </a>
          </p>
          <p className="mt-3">{t.footer.copyright}</p>
          <p className="mt-1 opacity-60">
            {language === "zh"
              ? "本平台提供的命理分析仅供参考和娱乐，不构成任何专业建议。"
              : "The destiny analysis provided by this platform is for reference and entertainment only."}
          </p>
        </div>
      </div>
    </footer>
  );
}
