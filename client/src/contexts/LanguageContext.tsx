import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { type Translations, type Language, languages } from "@/locales";
// Import zh synchronously as default (most users are Chinese)
// en will be dynamically imported only when needed
import { zh } from "@/locales/zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cache loaded translations to avoid re-importing
const translationCache: Partial<Record<Language, Translations>> = { zh };

// 检测用户地区并返回对应语言
function detectUserLanguage(): Language {
  // 1. 首先检查localStorage中保存的语言偏好
  const savedLanguage = localStorage.getItem("fortune-insight-language") as Language | null;
  if (savedLanguage && (savedLanguage === "zh" || savedLanguage === "en")) {
    return savedLanguage;
  }

  // 2. 检查浏览器语言设置
  const browserLang = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || "";
  
  // 中文地区（简体中文、繁体中文、中国、台湾、香港、澳门）
  const chinesePatterns = [
    /^zh/i,           // zh, zh-CN, zh-TW, zh-HK, zh-SG
    /^cn/i,           // cn
  ];
  
  for (const pattern of chinesePatterns) {
    if (pattern.test(browserLang)) {
      return "zh";
    }
  }

  // 3. 默认返回英文
  return "en";
}

// Preload English translations in background after initial render
function preloadEnglish() {
  if (!translationCache.en) {
    import("@/locales/en").then(({ en }) => {
      translationCache.en = en;
    });
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => detectUserLanguage());
  const [translations, setTranslations] = useState<Translations>(() => {
    // If detected language is zh, use it immediately
    // If en, use zh as fallback until en loads
    return translationCache[language] || zh;
  });
  const initialLoadDone = useRef(false);

  // Load translations for the current language
  useEffect(() => {
    const loadTranslations = async () => {
      if (translationCache[language]) {
        setTranslations(translationCache[language]!);
        return;
      }
      
      try {
        if (language === "en") {
          const { en } = await import("@/locales/en");
          translationCache.en = en;
          setTranslations(en);
        }
      } catch (error) {
        console.error("Failed to load translations for", language, error);
        // Fallback to zh
        setTranslations(zh);
      }
    };

    loadTranslations();
  }, [language]);

  // Preload English translations in background after first render
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      // Delay preload to not compete with critical resources
      const timer = setTimeout(preloadEnglish, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // 设置语言并保存到localStorage
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("fortune-insight-language", lang);
    // 更新html lang属性
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, []);

  // 初始化时设置html lang属性
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations,
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// 简化的翻译hook
export function useTranslation() {
  const { t, language, setLanguage, languages } = useLanguage();
  return { t, language, setLanguage, languages };
}
