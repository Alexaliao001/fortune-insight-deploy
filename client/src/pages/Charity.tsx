import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users, Globe, BookOpen, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEOHead from "@/components/SEOHead";

export default function Charity() {
  const { language } = useTranslation();
  const isZh = language === "zh";

  const projects = isZh ? [
    { icon: BookOpen, title: "教育助学", desc: "资助贫困地区儿童的教育，为他们提供学习用品和课外辅导。", progress: 35 },
    { icon: Heart, title: "心理健康", desc: "支持心理健康公益组织，为需要帮助的人提供免费心理咨询。", progress: 28 },
    { icon: Users, title: "社区关怀", desc: "帮助社区中的弱势群体，提供生活物资和精神关怀。", progress: 42 },
    { icon: Globe, title: "环境保护", desc: "参与植树造林和环境保护项目，为地球的未来贡献力量。", progress: 20 },
  ] : [
    { icon: BookOpen, title: "Education Support", desc: "Funding education for children in underserved areas, providing learning materials and tutoring.", progress: 35 },
    { icon: Heart, title: "Mental Health", desc: "Supporting mental health organizations to provide free counseling for those in need.", progress: 28 },
    { icon: Users, title: "Community Care", desc: "Helping vulnerable groups in communities with living supplies and emotional support.", progress: 42 },
    { icon: Globe, title: "Environmental Protection", desc: "Participating in reforestation and environmental protection projects for a better future.", progress: 20 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="charity" path="/charity" />
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
              <Heart className="w-4 h-4" />
              {isZh ? "公益计划" : "CHARITY PROGRAM"}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">{isZh ? "每一次体验，都是一份爱心" : "Every Experience, An Act of Kindness"}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {isZh
                ? "我们承诺将会员收入的10%捐赠给社会公益项目。您的每一次使用，都在帮助需要帮助的人。"
                : "We commit to donating 10% of membership revenue to social welfare projects. Every time you use our service, you're helping those in need."}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-16"
          >
            {[
              { value: "10%", label: isZh ? "收入捐赠比例" : "Revenue Donated" },
              { value: isZh ? "每月" : "Monthly", label: isZh ? "公示频率" : "Transparency Reports" },
              { value: "4", label: isZh ? "公益项目方向" : "Project Categories" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-[rgba(212,168,67,0.15)] bg-[rgba(13,15,26,0.5)] backdrop-blur-sm">
                <div className="text-2xl md:text-3xl font-bold text-[#d4a843] mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-16 p-8 rounded-2xl border border-[rgba(212,168,67,0.2)] bg-[rgba(13,15,26,0.6)] backdrop-blur-sm"
          >
            <h2 className="font-display text-2xl font-bold text-[#d4a843] mb-6 text-center">
              {isZh ? "运作方式" : "How It Works"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(isZh ? [
                { step: "1", title: "您的使用", desc: "每当您购买会员或单次服务" },
                { step: "2", title: "自动捐赠", desc: "收入的10%自动划入公益基金" },
                { step: "3", title: "透明公示", desc: "每月公示捐赠记录和项目进展" },
              ] : [
                { step: "1", title: "Your Purchase", desc: "Every time you buy a membership or service" },
                { step: "2", title: "Auto Donation", desc: "10% of revenue goes to the charity fund" },
                { step: "3", title: "Transparency", desc: "Monthly reports on donations and project progress" },
              ]).map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[rgba(212,168,67,0.15)] border border-[rgba(212,168,67,0.3)] flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#d4a843] font-bold">{item.step}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              <Sparkles className="w-5 h-5 inline-block text-[#d4a843] mr-2" />
              {isZh ? "公益项目方向" : "Project Categories"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-[rgba(212,168,67,0.15)] bg-[rgba(13,15,26,0.5)] backdrop-blur-sm hover:border-[rgba(212,168,67,0.4)] transition-all duration-300"
                >
                  <project.icon className="w-8 h-8 text-[#d4a843] mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.desc}</p>
                  <div className="w-full bg-[rgba(212,168,67,0.1)] rounded-full h-2">
                    <div
                      className="bg-[#d4a843] h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {isZh ? `已筹集 ${project.progress}%` : `${project.progress}% funded`}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <HandHeart className="w-12 h-12 text-[#d4a843] mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-4">
              {isZh ? "加入我们，一起传递爱心" : "Join Us in Spreading Kindness"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {isZh
                ? "成为会员，不仅解锁全部功能，还能为公益事业贡献一份力量。"
                : "Become a member to unlock all features and contribute to charitable causes."}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a] font-semibold glow-gold"
            >
              <Link href="/membership">
                <Heart className="w-5 h-5 mr-2" />
                {isZh ? "成为会员" : "Become a Member"}
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
