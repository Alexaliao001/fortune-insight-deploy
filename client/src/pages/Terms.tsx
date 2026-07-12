import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Terms() {
  const { language } = useTranslation();
  const isZh = language === "zh";

  const sections = isZh ? [
    { title: "服务概述", content: "Fortune Insight（\"洞察未来\"）是一个融合AI技术与东方智慧的心灵成长平台，提供塔罗占卜、八字分析、星座运势、AI解梦等服务。使用我们的服务即表示您同意本服务条款。" },
    { title: "账户注册", content: "您需要通过邮箱注册账户才能使用完整功能。您有责任维护账户安全，不得将账户转让或共享给他人。如发现未经授权的使用，请立即通知我们。" },
    { title: "服务内容", content: "我们提供的AI分析服务（塔罗占卜、八字分析、星座运势、AI解梦）仅供参考和个人成长之用。这些服务基于AI技术和传统文化理论，不构成专业的心理咨询、医疗建议或财务建议。重要决策请咨询相关专业人士。" },
    { title: "免费与付费服务", content: "部分服务提供免费体验额度（如每日1次免费塔罗占卜）。超出免费额度后，您可以选择单次购买或订阅会员。所有价格以页面显示为准，我们保留调整价格的权利。" },
    { title: "支付与退款", content: "支付通过Stripe安全处理。会员订阅为自动续费，您可以随时取消。取消后当前周期内仍可使用。开通后7天内如未使用任何付费功能，可申请全额退款。" },
    { title: "公益承诺", content: "我们承诺将会员收入的10%捐赠给社会公益项目。捐赠记录每月公示。此承诺不构成法律义务，但我们将尽最大努力履行。" },
    { title: "用户行为规范", content: "使用我们的服务时，您不得：发布违法、有害或侵权内容；利用服务进行欺诈或误导行为；干扰或破坏服务的正常运行；未经授权访问其他用户的数据；将服务用于商业目的（除非获得书面许可）。" },
    { title: "知识产权", content: "Fortune Insight的所有内容、设计、代码和AI模型均受知识产权法保护。您可以保存和分享您的个人分析报告，但不得复制、修改或分发平台的其他内容。" },
    { title: "免责声明", content: "我们的服务按\"现状\"提供，不保证AI分析结果的准确性或完整性。我们不对因使用服务而产生的任何直接或间接损失承担责任。服务可能因维护或不可抗力而暂时中断。" },
    { title: "条款修改", content: "我们保留随时修改本条款的权利。重大变更将提前通知。继续使用服务即表示您接受修改后的条款。" },
    { title: "适用法律", content: "本条款受中华人民共和国法律管辖。如有争议，双方应友好协商解决；协商不成的，提交有管辖权的人民法院裁决。" },
  ] : [
    { title: "Service Overview", content: "Fortune Insight is a spiritual growth platform that combines AI technology with Eastern wisdom, offering tarot reading, BaZi analysis, horoscope, and AI dream interpretation services. By using our services, you agree to these Terms of Service." },
    { title: "Account Registration", content: "You need to register an account with your email to access full features. You are responsible for maintaining account security and must not transfer or share your account with others. If you discover unauthorized use, please notify us immediately." },
    { title: "Service Content", content: "Our AI analysis services (tarot reading, BaZi analysis, horoscope, AI dream interpretation) are for reference and personal growth purposes only. These services are based on AI technology and traditional cultural theories and do not constitute professional psychological counseling, medical advice, or financial advice. Please consult relevant professionals for important decisions." },
    { title: "Free and Paid Services", content: "Some services offer free usage quotas (e.g., 1 free tarot reading per day). Beyond free quotas, you can choose single purchases or membership subscriptions. All prices are as displayed on the page, and we reserve the right to adjust pricing." },
    { title: "Payment and Refunds", content: "Payments are processed securely through Stripe. Membership subscriptions auto-renew, and you can cancel at any time. After cancellation, you retain access until the end of your billing period. Full refunds are available within 7 days if no paid features have been used." },
    { title: "Charity Commitment", content: "We commit to donating 10% of membership revenue to social welfare projects. Donation records are published monthly. This commitment does not constitute a legal obligation, but we will make our best effort to fulfill it." },
    { title: "User Conduct", content: "When using our services, you must not: post illegal, harmful, or infringing content; use services for fraud or misleading purposes; interfere with or disrupt normal service operations; access other users' data without authorization; use services for commercial purposes without written permission." },
    { title: "Intellectual Property", content: "All content, design, code, and AI models of Fortune Insight are protected by intellectual property law. You may save and share your personal analysis reports but may not copy, modify, or distribute other platform content." },
    { title: "Disclaimer", content: "Our services are provided \"as is\" without guarantees of accuracy or completeness of AI analysis results. We are not liable for any direct or indirect damages arising from service use. Services may be temporarily interrupted for maintenance or force majeure." },
    { title: "Terms Modification", content: "We reserve the right to modify these terms at any time. Significant changes will be communicated in advance. Continued use of services constitutes acceptance of modified terms." },
    { title: "Governing Law", content: "These terms are governed by applicable laws. In case of disputes, both parties should seek amicable resolution first; if unsuccessful, disputes shall be submitted to a court of competent jurisdiction." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="terms" path="/terms" />
      <StarryBackground />
      <Navbar />
      <main className="flex-1 relative z-10 pt-24 pb-16">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.08)] text-[#d4a843] text-sm mb-6">
              <FileText className="w-4 h-4" />
              {isZh ? "法律条款" : "LEGAL"}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {isZh ? "服务条款" : "Terms of Service"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isZh ? "最后更新：2025年1月" : "Last updated: January 2025"}
            </p>
          </motion.div>

          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="p-6 rounded-xl border border-[rgba(212,168,67,0.12)] bg-[rgba(13,15,26,0.5)] backdrop-blur-sm"
              >
                <h2 className="font-display text-lg font-semibold text-[#d4a843] mb-3">
                  {i + 1}. {section.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>
              {isZh
                ? "如有任何关于服务条款的问题，请联系我们："
                : "If you have any questions about these terms, please contact us:"}
            </p>
            <a href="mailto:fortuneinsight@outlook.com" className="text-[#d4a843] hover:underline">
              fortuneinsight@outlook.com
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
