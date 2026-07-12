import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Gift,
  Copy,
  Check,
  Users,
  Trophy,
  Sparkles,
  Share2,
  ArrowRight,
  Crown,
  Zap,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarryBackground from "@/components/StarryBackground";

export default function Referral() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const isZh = language === "zh";
  const [copied, setCopied] = useState(false);

  const { data: referralData, isLoading } = trpc.referral.getMyReferral.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: history } = trpc.referral.getReferralHistory.useQuery(
    undefined,
    { enabled: !!user }
  );
  const { data: leaderboard } = trpc.referral.getLeaderboard.useQuery();

  const referralLink = useMemo(() => {
    if (!referralData?.code) return "";
    return `${window.location.origin}?ref=${referralData.code}`;
  }, [referralData?.code]);

  const copyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success(isZh ? "邀请链接已复制到剪贴板" : "Referral link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = isZh
      ? "我在 Fortune Insight 发现了超准的 AI 命理分析！用我的邀请链接注册，我们都能获得免费额度"
      : "I found amazing AI fortune readings on Fortune Insight! Sign up with my link and we both get free credits";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = () => {
    const text = isZh
      ? `来试试 Fortune Insight 的 AI 命理分析吧！用我的邀请链接注册，我们都能获得免费额度 ${referralLink}`
      : `Try Fortune Insight's AI fortune readings! Sign up with my link and we both get free credits ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Determine if data is truly loading vs loaded with zero values
  const dataReady = !isLoading && referralData;

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <StarryBackground />
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4a843]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <StarryBackground />
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full glass-card border-[rgba(212,168,67,0.2)]">
            <CardContent className="pt-8 pb-8 text-center">
              <Gift className="w-16 h-16 text-[#d4a843] mx-auto mb-4" />
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                {isZh ? "邀请好友，一起探索" : "Invite Friends, Explore Together"}
              </h2>
              <p className="text-gray-400 mb-6">
                {isZh
                  ? "登录后获取你的专属邀请码，每邀请一位好友，双方都能获得免费使用额度！"
                  : "Sign in to get your unique referral code. Both you and your friend earn free credits!"}
              </p>
              <Button asChild className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a]">
                <a href={getLoginUrl()}>
                  {isZh ? "立即登录" : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StarryBackground />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-gradient mb-6">
              <Gift className="w-4 h-4 text-[#d4a843]" />
              <span className="text-sm font-medium text-[#d4a843]/80">
                {isZh ? "邀请奖励计划" : "Referral Rewards Program"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              {isZh ? (
                <>邀请好友，<span className="gradient-text text-glow-gold">共享福利</span></>
              ) : (
                <>Invite Friends, <span className="gradient-text text-glow-gold">Share Rewards</span></>
              )}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {isZh
                ? "每成功邀请一位好友注册，你和好友各获得 1 次塔罗、八字、解梦的免费额度"
                : "For each friend who signs up, both of you earn 1 free credit for Tarot, BaZi, and Dream readings"}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card rounded-2xl border-gradient p-6 text-center">
              <Users className="w-8 h-8 text-[#d4a843] mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {dataReady ? (referralData.totalReferrals ?? 0) : (
                  <div className="h-7 w-8 mx-auto rounded bg-white/10 animate-pulse" />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "已邀请" : "Invited"}
              </div>
            </div>
            <div className="glass-card rounded-2xl border-gradient p-6 text-center">
              <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {dataReady ? (referralData.completedReferrals ?? 0) : (
                  <div className="h-7 w-8 mx-auto rounded bg-white/10 animate-pulse" />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "已完成" : "Completed"}
              </div>
            </div>
            <div className="glass-card rounded-2xl border-gradient p-6 text-center">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {dataReady ? (referralData.totalRewards ?? 0) : (
                  <div className="h-7 w-8 mx-auto rounded bg-white/10 animate-pulse" />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isZh ? "获得额度" : "Credits Earned"}
              </div>
            </div>
          </div>

          {/* Referral Code + Share */}
          <div className="glass-card rounded-2xl border-gradient p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-[#d4a843]" />
              <h2 className="text-lg font-semibold text-white">
                {isZh ? "你的邀请码" : "Your Referral Code"}
              </h2>
            </div>
            
            {/* Code Display */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.3)] rounded-lg px-4 py-3 font-mono text-xl text-[#d4a843] tracking-widest text-center">
                {dataReady ? referralData.code : (
                  <div className="h-6 w-32 mx-auto rounded bg-[#d4a843]/10 animate-pulse" />
                )}
              </div>
              <Button
                onClick={copyLink}
                disabled={!dataReady}
                className="bg-[#d4a843] hover:bg-[#c09030] text-[#0d0f1a] px-6"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? (isZh ? "已复制" : "Copied") : (isZh ? "复制链接" : "Copy Link")}
              </Button>
            </div>

            {/* Referral Link */}
            <div className="text-sm text-gray-400 mb-6 break-all bg-[rgba(0,0,0,0.2)] rounded-lg px-3 py-2">
              {referralLink || (isZh ? "加载中..." : "Loading...")}
            </div>

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={shareOnTwitter}
                disabled={!dataReady}
                className="border-[rgba(212,168,67,0.3)] text-white hover:bg-[rgba(212,168,67,0.1)] hover:text-[#d4a843]"
              >
                <span className="mr-2">𝕏</span>
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={shareOnFacebook}
                disabled={!dataReady}
                className="border-[rgba(212,168,67,0.3)] text-white hover:bg-[rgba(212,168,67,0.1)] hover:text-[#d4a843]"
              >
                <span className="mr-2 font-bold">f</span>
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={shareOnWhatsApp}
                disabled={!dataReady}
                className="border-[rgba(212,168,67,0.3)] text-white hover:bg-[rgba(212,168,67,0.1)] hover:text-[#d4a843]"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* How It Works */}
          <div className="glass-card rounded-2xl border-gradient p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#d4a843]" />
              <h2 className="text-lg font-semibold text-white">
                {isZh ? "如何运作" : "How It Works"}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: isZh ? "分享邀请链接" : "Share Your Link",
                  desc: isZh
                    ? "复制你的专属邀请链接，发送给好友"
                    : "Copy your unique referral link and share it with friends",
                },
                {
                  step: "2",
                  title: isZh ? "好友注册" : "Friend Signs Up",
                  desc: isZh
                    ? "好友通过你的链接注册并完成登录"
                    : "Your friend signs up through your link and logs in",
                },
                {
                  step: "3",
                  title: isZh ? "双方获得奖励" : "Both Get Rewards",
                  desc: isZh
                    ? "你和好友各获得 1 次塔罗、八字、解梦免费额度"
                    : "Both of you earn 1 free Tarot, BaZi, and Dream credit",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-[rgba(212,168,67,0.15)] text-[#d4a843] font-bold text-lg flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Referral History */}
            <div className="glass-card rounded-2xl border-gradient p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#d4a843]" />
                <h2 className="text-lg font-semibold text-white">
                  {isZh ? "邀请记录" : "Referral History"}
                </h2>
              </div>
              {!history || history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>{isZh ? "还没有邀请记录" : "No referrals yet"}</p>
                  <p className="text-sm mt-1">
                    {isZh ? "分享你的邀请链接开始吧！" : "Share your link to get started!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0"
                    >
                      <div>
                        <div className="text-sm text-white">{item.referredName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "rewarded"
                            ? "bg-green-500/10 text-green-400"
                            : item.status === "completed"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {item.status === "rewarded"
                          ? isZh ? "已奖励" : "Rewarded"
                          : item.status === "completed"
                          ? isZh ? "已完成" : "Completed"
                          : isZh ? "待完成" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <div className="glass-card rounded-2xl border-gradient p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-[#d4a843]" />
                <h2 className="text-lg font-semibold text-white">
                  {isZh ? "邀请排行榜" : "Referral Leaderboard"}
                </h2>
              </div>
              {!leaderboard || leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>{isZh ? "成为第一个上榜的人！" : "Be the first on the board!"}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((item) => (
                    <div
                      key={item.rank}
                      className="flex items-center gap-3 py-2 border-b border-[rgba(255,255,255,0.05)] last:border-0"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          item.rank === 1
                            ? "bg-[rgba(212,168,67,0.2)] text-[#d4a843]"
                            : item.rank === 2
                            ? "bg-[rgba(192,192,192,0.15)] text-gray-300"
                            : item.rank === 3
                            ? "bg-[rgba(205,127,50,0.15)] text-orange-400"
                            : "bg-[rgba(255,255,255,0.05)] text-gray-500"
                        }`}
                      >
                        {item.rank <= 3 ? (
                          <Crown className="w-4 h-4" />
                        ) : (
                          item.rank
                        )}
                      </div>
                      <div className="flex-1 text-sm text-white">{item.name}</div>
                      <div className="text-sm text-[#d4a843] font-semibold">
                        {item.referralCount} {isZh ? "人" : "referrals"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
