import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VoiceInput from "@/components/VoiceInput";
import { useTranslation } from "@/contexts/LanguageContext";
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Send,
  HelpCircle,
  Wrench,
  CreditCard,
  Handshake,
  MessageCircle,
  MoreHorizontal,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";

export default function Contact() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 根据语言定义分类
  const categories = language === "zh" ? [
    { value: "general", label: "一般咨询", icon: HelpCircle, description: "关于平台使用的一般问题" },
    { value: "technical", label: "技术支持", icon: Wrench, description: "遇到技术问题或Bug反馈" },
    { value: "billing", label: "账单问题", icon: CreditCard, description: "支付、退款、会员相关" },
    { value: "partnership", label: "商务合作", icon: Handshake, description: "广告、合作、投资咨询" },
    { value: "feedback", label: "意见反馈", icon: MessageCircle, description: "产品建议和改进意见" },
    { value: "other", label: "其他", icon: MoreHorizontal, description: "其他未分类的问题" },
  ] : [
    { value: "general", label: "General Inquiry", icon: HelpCircle, description: "General questions about the platform" },
    { value: "technical", label: "Technical Support", icon: Wrench, description: "Technical issues or bug reports" },
    { value: "billing", label: "Billing", icon: CreditCard, description: "Payment, refunds, membership" },
    { value: "partnership", label: "Partnership", icon: Handshake, description: "Advertising, collaboration, investment" },
    { value: "feedback", label: "Feedback", icon: MessageCircle, description: "Product suggestions and improvements" },
    { value: "other", label: "Other", icon: MoreHorizontal, description: "Other uncategorized questions" },
  ];

  // 根据语言定义FAQ
  const faqs = language === "zh" ? [
    {
      question: "如何获取免费的塔罗占卜？",
      answer: "您可以直接访问塔罗占卜页面，选择问题类型后即可免费体验基础解读。无需注册即可使用。"
    },
    {
      question: "八字精批报告多久能收到？",
      answer: "AI会在您提交信息后立即生成报告，通常只需要几秒钟。报告会自动保存在您的账户中。"
    },
    {
      question: "如何取消会员订阅？",
      answer: "您可以在个人中心的会员管理页面取消订阅，取消后当前周期内仍可继续使用会员功能。"
    },
    {
      question: "我的数据安全吗？",
      answer: "我们非常重视您的隐私安全，所有数据均加密存储，不会与第三方共享您的个人信息。"
    },
  ] : [
    {
      question: "How do I get a free tarot reading?",
      answer: "You can visit the tarot reading page directly and select a question type to experience a free basic reading. No registration required."
    },
    {
      question: "How long does it take to receive a BaZi report?",
      answer: "AI generates the report immediately after you submit your information, usually within seconds. The report is automatically saved to your account."
    },
    {
      question: "How do I cancel my membership subscription?",
      answer: "You can cancel your subscription in the membership management section of your profile. You'll retain access until the end of your billing period."
    },
    {
      question: "Is my data secure?",
      answer: "We take your privacy very seriously. All data is encrypted and stored securely. We never share your personal information with third parties."
    },
  ];
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    category: "general" as "general" | "technical" | "billing" | "partnership" | "feedback" | "other",
    message: "",
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      toast.success(language === "zh" ? "提交成功" : "Submitted Successfully", {
        description: data.message,
      });
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast.error(language === "zh" ? "提交失败" : "Submission Failed", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleVoiceInput = (text: string) => {
    setFormData(prev => ({
      ...prev,
      message: prev.message + (prev.message ? " " : "") + text
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead titleKey="contact" path="/contact" />
        <StarryBackground />
        <Navbar />
        <main className="flex-1 pt-24 pb-12">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="glass-card border-gradient rounded-2xl">
                <CardContent className="pt-12 pb-8">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-display font-bold mb-4">
                    {language === "zh" ? "消息已发送！" : "Message Sent!"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {language === "zh" 
                      ? "感谢您的联系，我们会在1-2个工作日内回复您的邮箱。"
                      : "Thank you for contacting us. We'll reply to your email within 1-2 business days."}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      {language === "zh" ? "发送新消息" : "Send Another Message"}
                    </Button>
                    <Button asChild>
                      <a href="/">{t.common.back}</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StarryBackground />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-gradient mb-6">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-cyan-300/80 tracking-wider uppercase">{t.contact.subtitle}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-5">
              <span className="gradient-text text-glow-gold">{t.contact.title}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light">
              {language === "zh" 
                ? "有任何问题或建议？请随时与我们联系，我们会尽快回复您"
                : "Have any questions or suggestions? Feel free to contact us, and we'll get back to you soon"}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card border-gradient rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    {language === "zh" ? "发送消息" : "Send a Message"}
                  </CardTitle>
                  <CardDescription>
                    {language === "zh" 
                      ? "填写以下表单，我们会在1-2个工作日内回复您"
                      : "Fill out the form below, and we'll reply within 1-2 business days"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.contact.form.name} *</Label>
                        <Input
                          id="name"
                          placeholder={language === "zh" ? "例如：张三" : "e.g., John Doe"}
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.contact.form.email} *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={language === "zh" ? "例如：example@email.com" : "e.g., example@email.com"}
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{language === "zh" ? "问题类型" : "Category"} *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: typeof formData.category) => 
                          setFormData(prev => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === "zh" ? "选择问题类型" : "Select category"} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <SelectItem key={cat.value} value={cat.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  <span>{cat.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t.contact.form.subject} *</Label>
                      <Input
                        id="subject"
                        placeholder={language === "zh" ? "例如：关于会员订阅的咨询" : "e.g., Question about membership subscription"}
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="message">{t.contact.form.message} *</Label>
                        <VoiceInput 
                          onTranscript={handleVoiceInput}
                          className="scale-90"
                          size="sm"
                        />
                      </div>
                      <Textarea
                        id="message"
                        placeholder={t.contact.form.messagePlaceholder}
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                        minLength={10}
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === "zh" 
                          ? "至少10个字符，描述越详细我们越能快速帮助您"
                          : "At least 10 characters. The more detail you provide, the faster we can help you"}
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          {language === "zh" ? "提交中..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t.contact.form.submit}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Contact Info */}
              <Card className="glass-card border-gradient rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-display">
                    {language === "zh" ? "联系方式" : "Contact Info"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{t.contact.info.email}</p>
                      <a 
                        href="mailto:fortuneinsight@outlook.com" 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        fortuneinsight@outlook.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{language === "zh" ? "响应时间" : "Response Time"}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "zh" ? "1-2个工作日内回复" : "1-2 business days"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card className="glass-card border-gradient rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    {t.membership.faq.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium text-sm mb-1">{faq.question}</h4>
                      <p className="text-xs text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
