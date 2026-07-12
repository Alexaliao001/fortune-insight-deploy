import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StarryBackground from "@/components/StarryBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useTranslation } from "@/contexts/LanguageContext";
import { 
  Users,
  Heart,
  MessageCircle,
  Sparkles,
  BookOpen,
  PenLine,
  Send,
  Loader2,
  Crown
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import VoiceInput from "@/components/VoiceInput";
import TextToSpeech from "@/components/TextToSpeech";
import SEOHead from "@/components/SEOHead";

export default function Community() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [newPostContent, setNewPostContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState("");

  const { data: posts, isLoading, refetch } = trpc.community.getPosts.useQuery({
    type: activeTab === "all" ? undefined : activeTab as "insight" | "story" | "article",
    limit: 20,
    offset: 0,
  });

  const { data: comments, refetch: refetchComments, isLoading: commentsLoading } =
    trpc.community.getComments.useQuery(
      { postId: openCommentsPostId ?? 0, limit: 30 },
      { enabled: openCommentsPostId != null && openCommentsPostId > 0 }
    );

  const createPostMutation = trpc.community.createPost.useMutation({
    onSuccess: () => {
      toast.success(language === "zh" ? "发布成功！" : "Posted successfully!");
      setNewPostContent("");
      setIsDialogOpen(false);
      refetch();
    },
    onError: () => {
      toast.error(language === "zh" ? "发布失败，请重试" : "Failed to post, please try again");
    },
  });

  const likePostMutation = trpc.community.likePost.useMutation({
    onSuccess: (data) => {
      toast.success(data.liked 
        ? (language === "zh" ? "已点赞" : "Liked") 
        : (language === "zh" ? "已取消点赞" : "Unliked"));
      refetch();
    },
  });

  const addCommentMutation = trpc.community.addComment.useMutation({
    onSuccess: () => {
      toast.success(language === "zh" ? "评论已发布" : "Comment posted");
      setCommentDraft("");
      refetchComments();
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || (language === "zh" ? "评论失败" : "Failed to comment"));
    },
  });

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    createPostMutation.mutate({
      type: "insight",
      content: newPostContent,
    });
  };

  const handleLike = (postId: number) => {
    if (!isAuthenticated) {
      toast.error(language === "zh" ? "请先登录" : "Please login first");
      return;
    }
    likePostMutation.mutate({ postId });
  };

  const toggleComments = (postId: number) => {
    setOpenCommentsPostId((prev) => (prev === postId ? null : postId));
    setCommentDraft("");
  };

  const handleAddComment = (postId: number) => {
    if (!isAuthenticated) {
      toast.error(language === "zh" ? "请先登录" : "Please login first");
      return;
    }
    if (!commentDraft.trim()) return;
    addCommentMutation.mutate({ postId, content: commentDraft.trim() });
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (language === "zh") {
      if (hours < 1) return "刚刚";
      if (hours < 24) return `${hours}小时前`;
      if (days < 7) return `${days}天前`;
      return d.toLocaleDateString('zh-CN');
    } else {
      if (hours < 1) return "Just now";
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return d.toLocaleDateString('en-US');
    }
  };

  const typeLabels: Record<string, { label: string; labelEn: string; icon: typeof Sparkles }> = {
    insight: { label: "感悟", labelEn: "Insight", icon: Sparkles },
    story: { label: "故事", labelEn: "Story", icon: BookOpen },
    article: { label: "文章", labelEn: "Article", icon: PenLine },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead titleKey="community" path="/community" />
      <StarryBackground />
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-gradient mb-6"
            >
              <Users className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-cyan-300/80 tracking-wider uppercase">{t.community.title}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-5">
              {language === "zh" ? (
                <>分享您的<span className="gradient-text text-glow-gold">成长故事</span></>
              ) : (
                <>Share Your <span className="gradient-text text-glow-gold">Growth Story</span></>
              )}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.community.subtitle}
            </p>
          </div>

          {/* Create Post Button */}
          <div className="flex justify-end mb-6">
            {isAuthenticated ? (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PenLine className="w-4 h-4" />
                    {t.community.newPost}
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-gradient rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {language === "zh" ? "分享您的感悟" : "Share Your Insights"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea
                        placeholder={t.community.postPlaceholder}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[150px] bg-input/50 pr-12"
                      />
                      <div className="absolute right-2 top-2">
                        <VoiceInput
                          onTranscript={(text) => setNewPostContent(prev => prev + text)}
                          className="h-8 w-8 text-muted-foreground hover:text-cyan-400"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        {t.common.cancel}
                      </Button>
                      <Button 
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim() || createPostMutation.isPending}
                      >
                        {createPostMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        {t.community.publish}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>
                  {language === "zh" ? "登录后发布" : "Login to Post"}
                </a>
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="all">{t.common.all}</TabsTrigger>
              <TabsTrigger value="insight" className="gap-1">
                <Sparkles className="w-3 h-3" />
                {language === "zh" ? "感悟" : "Insights"}
              </TabsTrigger>
              <TabsTrigger value="story" className="gap-1">
                <BookOpen className="w-3 h-3" />
                {language === "zh" ? "故事" : "Stories"}
              </TabsTrigger>
              <TabsTrigger value="article" className="gap-1">
                <PenLine className="w-3 h-3" />
                {language === "zh" ? "文章" : "Articles"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : posts && posts.length > 0 ? (
                posts.map((post, index) => {
                  const TypeIcon = typeLabels[post.type]?.icon || Sparkles;
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card border-gradient rounded-2xl hover:glow-gold transition-all duration-500">
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium flex items-center gap-1.5">
                                  {post.displayName || (language === "zh" ? "匿名用户" : "Anonymous User")}
                                  {post.isPremiumUser && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-cosmic-gold/20 text-cosmic-gold text-[10px] font-semibold">
                                      <Crown className="w-2.5 h-2.5" />
                                      Premium
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(post.createdAt)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 text-xs">
                              <TypeIcon className="w-3 h-3" />
                              {language === "zh" 
                                ? typeLabels[post.type]?.label 
                                : typeLabels[post.type]?.labelEn || post.type}
                            </div>
                          </div>

                          {/* Title */}
                          {post.title && (
                            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                          )}

                          {/* Content */}
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {post.content}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                            {/* 语音朗读按钮 */}
                            <TextToSpeech
                              text={post.content}
                              size="sm"
                              className="text-muted-foreground hover:text-cyan-400"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 text-muted-foreground hover:text-rose-400"
                              onClick={() => handleLike(post.id)}
                            >
                              <Heart className="w-4 h-4" />
                              {post.likesCount || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`gap-2 ${
                                openCommentsPostId === post.id
                                  ? "text-cyan-400"
                                  : "text-muted-foreground hover:text-cyan-400"
                              }`}
                              onClick={() => toggleComments(post.id)}
                            >
                              <MessageCircle className="w-4 h-4" />
                              {post.commentsCount || 0}
                            </Button>
                          </div>

                          {/* Comments panel (F2-1) */}
                          {openCommentsPostId === post.id && (
                            <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                {language === "zh" ? "评论" : "Comments"}
                              </p>
                              {commentsLoading ? (
                                <div className="flex justify-center py-3">
                                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                </div>
                              ) : comments && comments.length > 0 ? (
                                <div className="space-y-2.5 max-h-56 overflow-y-auto">
                                  {comments.map((c) => (
                                    <div
                                      key={c.id}
                                      className="rounded-lg bg-muted/30 px-3 py-2 text-sm"
                                    >
                                      <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <span className="font-medium text-foreground/90 text-xs">
                                          {c.displayName ||
                                            (language === "zh" ? "用户" : "User")}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          {formatDate(c.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {c.content}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground text-center py-2">
                                  {language === "zh"
                                    ? "还没有评论，来抢沙发"
                                    : "No comments yet — be the first"}
                                </p>
                              )}
                              {isAuthenticated ? (
                                <div className="flex gap-2">
                                  <Textarea
                                    value={commentDraft}
                                    onChange={(e) => setCommentDraft(e.target.value)}
                                    placeholder={
                                      language === "zh"
                                        ? "写一句友善的评论…"
                                        : "Write a kind comment…"
                                    }
                                    className="min-h-[60px] text-sm bg-input/40"
                                    maxLength={1000}
                                  />
                                  <Button
                                    size="sm"
                                    className="shrink-0 self-end"
                                    disabled={
                                      !commentDraft.trim() || addCommentMutation.isPending
                                    }
                                    onClick={() => handleAddComment(post.id)}
                                  >
                                    {addCommentMutation.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Send className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <Button asChild variant="outline" size="sm" className="w-full">
                                  <a href={getLoginUrl()}>
                                    {language === "zh" ? "登录后评论" : "Login to comment"}
                                  </a>
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <Card className="glass-card border-gradient rounded-2xl">
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {t.community.noComments}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {language === "zh" 
                        ? "成为第一个分享感悟的人吧" 
                        : "Be the first to share your insights"}
                    </p>
                    {isAuthenticated ? (
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <PenLine className="w-4 h-4 mr-2" />
                        {t.community.newPost}
                      </Button>
                    ) : (
                      <Button asChild>
                        <a href={getLoginUrl()}>
                          {language === "zh" ? "登录后发布" : "Login to Post"}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
