import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import SEOHead from "@/components/SEOHead";

export default function Privacy() {
  const { language } = useTranslation();
  const isZh = language === "zh";

  const sections = isZh ? [
    { title: "信息收集", content: "我们收集您在使用服务时主动提供的信息，包括：注册时的姓名和电子邮件地址、出生日期和时间（用于八字分析）、梦境描述（用于AI解梦）、以及您在社区中发布的内容。我们不会收集超出服务所需范围的个人信息。" },
    { title: "信息使用", content: "您的个人信息仅用于以下目的：提供和改进我们的服务（塔罗占卜、八字分析、星座运势、AI解梦）；管理您的账户和会员状态；处理支付和退款；发送与服务相关的通知；以及改善用户体验和服务质量。" },
    { title: "数据安全", content: "我们采用行业标准的安全措施保护您的数据，包括：传输过程中的SSL/TLS加密；存储数据的加密保护；定期安全审计和漏洞扫描；严格的访问控制和权限管理。" },
    { title: "数据共享", content: "我们不会出售、交易或以其他方式向第三方转让您的个人信息。以下情况除外：经您明确同意；法律法规要求；保护我们的合法权益。支付处理由Stripe安全处理，我们不存储您的完整支付卡信息。" },
    { title: "Cookie使用", content: "我们使用Cookie和类似技术来维持您的登录状态、记住您的语言偏好、以及分析网站使用情况以改善服务。您可以通过浏览器设置管理Cookie偏好。" },
    { title: "数据保留", content: "我们在您使用服务期间保留您的数据。如果您删除账户，我们将在30天内永久删除您的所有个人数据，法律要求保留的除外。" },
    { title: "您的权利", content: "您有权：访问和查看您的个人数据；更正不准确的信息；请求删除您的账户和数据；导出您的数据；撤回对数据处理的同意。如需行使这些权利，请通过联系我们页面提交请求。" },
    { title: "未成年人保护", content: "我们的服务不面向16岁以下的未成年人。如果我们发现收集了未成年人的个人信息，将立即删除相关数据。" },
    { title: "政策更新", content: "我们可能会不时更新本隐私政策。重大变更将通过网站通知或电子邮件通知您。继续使用我们的服务即表示您同意更新后的政策。" },
  ] : [
    { title: "Information Collection", content: "We collect information you voluntarily provide when using our services, including: your name and email address during registration, birth date and time (for BaZi analysis), dream descriptions (for AI dream interpretation), and content you post in the community. We do not collect personal information beyond what is necessary for our services." },
    { title: "Information Use", content: "Your personal information is used solely for: providing and improving our services (tarot reading, BaZi analysis, horoscope, AI dream interpretation); managing your account and membership status; processing payments and refunds; sending service-related notifications; and improving user experience and service quality." },
    { title: "Data Security", content: "We employ industry-standard security measures to protect your data, including: SSL/TLS encryption during transmission; encrypted data storage; regular security audits and vulnerability scanning; strict access control and permission management." },
    { title: "Data Sharing", content: "We do not sell, trade, or otherwise transfer your personal information to third parties. Exceptions include: with your explicit consent; as required by law; to protect our legitimate interests. Payment processing is handled securely by Stripe — we do not store your complete payment card information." },
    { title: "Cookie Usage", content: "We use cookies and similar technologies to maintain your login state, remember your language preferences, and analyze website usage to improve our services. You can manage cookie preferences through your browser settings." },
    { title: "Data Retention", content: "We retain your data for as long as you use our services. If you delete your account, we will permanently delete all your personal data within 30 days, except where retention is required by law." },
    { title: "Your Rights", content: "You have the right to: access and review your personal data; correct inaccurate information; request deletion of your account and data; export your data; withdraw consent for data processing. To exercise these rights, please submit a request through our Contact Us page." },
    { title: "Children's Privacy", content: "Our services are not intended for individuals under 16 years of age. If we discover that we have collected personal information from a minor, we will immediately delete the relevant data." },
    { title: "Policy Updates", content: "We may update this privacy policy from time to time. Significant changes will be communicated via website notification or email. Continued use of our services constitutes acceptance of the updated policy." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="privacy" path="/privacy" />
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
              <Shield className="w-4 h-4" />
              {isZh ? "隐私保护" : "PRIVACY PROTECTION"}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {isZh ? "隐私政策" : "Privacy Policy"}
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
                ? "如有任何关于隐私政策的问题，请联系我们："
                : "If you have any questions about this privacy policy, please contact us:"}
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
