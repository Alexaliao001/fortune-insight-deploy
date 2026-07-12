import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { HelpCircle, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";

export default function FAQ() {
  const { language } = useTranslation();
  const isZh = language === "zh";

  const categories = isZh ? [
    {
      title: "基础功能",
      items: [
        { q: "如何获取免费的塔罗占卜？", a: "您可以直接访问塔罗占卜页面，选择问题类型后即可免费体验基础解读。每天有1次免费机会，无需注册即可使用。" },
        { q: "八字精批报告多久能收到？", a: "AI会在您提交出生信息后立即生成报告，通常只需要几秒钟。报告会自动保存在您的账户中，随时可以查看。" },
        { q: "星座运势多久更新一次？", a: "每日运势每天自动更新，为您提供最新的星象分析和生活建议。" },
        { q: "AI解梦是如何工作的？", a: "我们的AI基于心理学理论（荣格分析心理学、弗洛伊德精神分析等）对您描述的梦境进行深度分析，提供心理学解读和成长建议。" },
      ]
    },
    {
      title: "会员与支付",
      items: [
        { q: "会员有哪些权益？", a: "会员享有无限次塔罗占卜、八字精批和AI解梦，以及专属深度分析报告、PDF导出功能和优先客服支持。" },
        { q: "支持哪些支付方式？", a: "我们支持微信支付、支付宝和国际信用卡/借记卡支付。系统会根据您的地区自动显示合适的支付方式。" },
        { q: "如何取消会员订阅？", a: "您可以在个人中心的会员管理页面取消订阅，取消后当前周期内仍可继续使用会员功能。" },
        { q: "会员可以退款吗？", a: "开通后7天内如未使用任何付费功能，可申请全额退款。请通过联系我们页面提交退款申请。" },
      ]
    },
    {
      title: "隐私与安全",
      items: [
        { q: "我的数据安全吗？", a: "我们非常重视您的隐私安全。所有数据均加密存储，严格遵守隐私保护法规，绝不与第三方共享您的个人信息。" },
        { q: "我的占卜记录会被别人看到吗？", a: "不会。您的所有占卜记录、八字报告和梦境日记都是私密的，只有您本人可以查看。" },
        { q: "如何删除我的账户和数据？", a: "您可以通过联系我们页面提交账户删除申请，我们会在3个工作日内处理并永久删除您的所有数据。" },
      ]
    },
    {
      title: "公益计划",
      items: [
        { q: "公益捐赠如何运作？", a: "我们将每笔会员收入的10%捐赠给社会公益项目。每月会在公益页面公示所有捐赠记录。" },
        { q: "我可以查看捐赠记录吗？", a: "可以。您可以在个人中心的公益贡献标签页查看您的捐赠记录，也可以在公益页面查看所有公示记录。" },
      ]
    },
  ] : [
    {
      title: "Basic Features",
      items: [
        { q: "How do I get a free tarot reading?", a: "You can visit the tarot reading page directly and select a question type to experience a free basic reading. You get 1 free reading per day, no registration required." },
        { q: "How long does it take to receive a BaZi report?", a: "AI generates the report immediately after you submit your birth information, usually within seconds. The report is automatically saved to your account for future reference." },
        { q: "How often are horoscope readings updated?", a: "Daily horoscopes are automatically updated every day, providing you with the latest celestial insights and life guidance." },
        { q: "How does AI Dream Interpretation work?", a: "Our AI analyzes your dream descriptions based on psychological theories (Jungian analytical psychology, Freudian psychoanalysis, etc.) to provide deep psychological interpretations and growth advice." },
      ]
    },
    {
      title: "Membership & Payment",
      items: [
        { q: "What are the membership benefits?", a: "Members enjoy unlimited tarot readings, BaZi analysis, and AI dream interpretation, plus exclusive in-depth analysis reports, PDF export, and priority customer support." },
        { q: "What payment methods are supported?", a: "We support WeChat Pay, Alipay, and international credit/debit cards. The system automatically displays appropriate payment methods based on your region." },
        { q: "How do I cancel my subscription?", a: "You can cancel your subscription in the membership management section of your profile. You'll retain access until the end of your billing period." },
        { q: "Can I get a refund?", a: "You can request a full refund within 7 days if you haven't used any paid features. Please submit a refund request through our Contact Us page." },
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        { q: "Is my data secure?", a: "We take your privacy very seriously. All data is encrypted and stored securely. We strictly comply with privacy regulations and never share your personal information with third parties." },
        { q: "Can others see my reading records?", a: "No. All your tarot readings, BaZi reports, and dream journals are private and only accessible by you." },
        { q: "How do I delete my account and data?", a: "You can submit an account deletion request through our Contact Us page. We will process it within 3 business days and permanently delete all your data." },
      ]
    },
    {
      title: "Charity Program",
      items: [
        { q: "How does the charity donation work?", a: "We donate 10% of every membership payment to social welfare projects. All donation records are published monthly on the charity page." },
        { q: "Can I view donation records?", a: "Yes. You can view your personal donation records in the Charity tab of your profile, and see all published records on the charity page." },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="faq" path="/faq" />
      <StarryBackground />
      <Navbar />
      <main className="flex-1 relative z-10 pt-24 pb-16">
        <div className="container max-w-3xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.08)] text-[#d4a843] text-sm mb-6">
              <HelpCircle className="w-4 h-4" />
              {isZh ? "帮助中心" : "HELP CENTER"}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {isZh ? "常见问题" : "FAQ"}
            </h1>
            <p className="text-muted-foreground">
              {isZh ? "找不到答案？请通过联系我们页面与我们取得联系。" : "Can't find your answer? Reach out through our Contact Us page."}
            </p>
          </motion.div>

          {/* FAQ Categories */}
          {categories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * ci }}
              className="mb-8"
            >
              <h2 className="font-display text-xl font-bold text-[#d4a843] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {cat.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {cat.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${ci}-${i}`}
                    className="border border-[rgba(212,168,67,0.15)] rounded-lg bg-[rgba(13,15,26,0.5)] backdrop-blur-sm px-4"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:text-[#d4a843] transition-colors">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
