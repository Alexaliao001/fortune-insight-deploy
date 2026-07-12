import { Button } from "@/components/ui/button";
import { Home, Moon, Star, CloudMoon, ArrowRight } from "lucide-react";
import { useLocation, Link } from "wouter";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { language } = useTranslation();
  const isZh = language === "zh";

  const suggestions = [
    {
      icon: Moon,
      href: "/tarot",
      title: isZh ? "爱情塔罗占卜" : "Love Tarot Reading",
      desc: isZh ? "免费体验AI爱情占卜" : "Free AI love tarot reading",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      icon: Star,
      href: "/bazi",
      title: isZh ? "八字命理分析" : "BaZi Destiny Analysis",
      desc: isZh ? "深度性格与命运解析" : "Deep personality & destiny analysis",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: CloudMoon,
      href: "/dream",
      title: isZh ? "AI解梦" : "Dream Interpreter",
      desc: isZh ? "心理学角度解读梦境" : "Psychology-based dream analysis",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="notFound" path="/404" noindex />
      <StarryBackground />
      <Navbar />
      <main className="flex-1 relative z-10 flex items-center justify-center pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4 max-w-lg"
        >
          <h1 className="font-display text-7xl font-bold gradient-text mb-3">404</h1>
          <p className="text-muted-foreground mb-8">
            {isZh
              ? "页面消失在星空中了。不如试试这些："
              : "This page has vanished into the stars. Try these instead:"}
          </p>

          <div className="space-y-3 mb-8">
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Link href={s.href}>
                    <div className="group flex items-center gap-3 p-4 rounded-xl glass-card border-gradient cursor-pointer hover:scale-[1.02] transition-all">
                      <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{s.title}</div>
                        <div className="text-xs text-muted-foreground">{s.desc}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#d4a843] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            size="sm"
            className="border-[rgba(212,168,67,0.3)] text-[#d4a843]"
          >
            <Home className="w-4 h-4 mr-2" />
            {isZh ? "返回首页" : "Go Home"}
          </Button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
