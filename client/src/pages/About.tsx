import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Sparkles, Heart, Shield, Users, Star, Globe } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function About() {
  const { language } = useTranslation();
  const isZh = language === "zh";

  const values = isZh ? [
    { icon: Sparkles, title: "AI驱动的洞察", desc: "融合人工智能与千年东方智慧，提供科学化的命理分析服务。" },
    { icon: Heart, title: "公益承诺", desc: "我们将会员收入的10%捐赠给公益项目，让每一次体验都充满爱心。" },
    { icon: Shield, title: "隐私保护", desc: "所有数据加密存储，严格遵守隐私保护法规，绝不与第三方共享。" },
    { icon: Users, title: "社区共建", desc: "打造一个温暖的心灵成长社区，让志同道合的朋友互相启发。" },
    { icon: Star, title: "持续进化", desc: "不断优化AI模型和用户体验，为您提供越来越精准的洞察。" },
    { icon: Globe, title: "全球服务", desc: "支持中英双语，服务全球华人和国际用户。" },
  ] : [
    { icon: Sparkles, title: "AI-Powered Insights", desc: "Combining artificial intelligence with ancient Eastern wisdom to provide scientific destiny analysis." },
    { icon: Heart, title: "Charity Commitment", desc: "We donate 10% of membership revenue to charity projects, making every experience meaningful." },
    { icon: Shield, title: "Privacy Protection", desc: "All data is encrypted and stored securely. We strictly comply with privacy regulations." },
    { icon: Users, title: "Community Building", desc: "Creating a warm spiritual growth community where like-minded friends inspire each other." },
    { icon: Star, title: "Continuous Evolution", desc: "Constantly optimizing AI models and user experience to provide increasingly accurate insights." },
    { icon: Globe, title: "Global Service", desc: "Supporting Chinese and English, serving global users worldwide." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="about" path="/about" />
      <StarryBackground />
      <Navbar />
      <main className="flex-1 relative z-10 pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.08)] text-[#d4a843] text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              {isZh ? "关于我们" : "ABOUT US"}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">{isZh ? "洞察未来" : "Fortune Insight"}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isZh
                ? "Fortune Insight 是一个融合AI技术与东方古老智慧的心灵成长平台。我们相信，每个人都拥有独特的天赋和潜能，而我们的使命就是帮助您发现并释放这些潜能。"
                : "Fortune Insight is a spiritual growth platform that combines AI technology with ancient Eastern wisdom. We believe everyone possesses unique talents and potential, and our mission is to help you discover and unlock them."}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16 p-8 rounded-2xl border border-[rgba(212,168,67,0.2)] bg-[rgba(13,15,26,0.6)] backdrop-blur-sm"
          >
            <h2 className="font-display text-2xl font-bold text-[#d4a843] mb-4 text-center">
              {isZh ? "我们的使命" : "Our Mission"}
            </h2>
            <p className="text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto">
              {isZh
                ? "通过科学化的命理分析和个性化的成长建议，帮助每一位用户更好地认识自己、理解自己，在人生的每个阶段做出更明智的选择。我们不预测命运，而是帮助您掌握命运。"
                : "Through scientific destiny analysis and personalized growth advice, we help every user better understand themselves and make wiser choices at every stage of life. We don't predict fate — we help you master it."}
            </p>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              {isZh ? "我们的价值观" : "Our Values"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-[rgba(212,168,67,0.15)] bg-[rgba(13,15,26,0.5)] backdrop-blur-sm hover:border-[rgba(212,168,67,0.4)] transition-all duration-300"
                >
                  <item.icon className="w-8 h-8 text-[#d4a843] mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <h2 className="font-display text-2xl font-bold mb-4">
              {isZh ? "联系我们" : "Get in Touch"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isZh
                ? "如果您有任何问题、建议或合作意向，欢迎随时联系我们。"
                : "If you have any questions, suggestions, or partnership inquiries, feel free to reach out."}
            </p>
            <a
              href="mailto:fortuneinsight@outlook.com"
              className="inline-flex items-center gap-2 text-[#d4a843] hover:underline"
            >
              fortuneinsight@outlook.com
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
