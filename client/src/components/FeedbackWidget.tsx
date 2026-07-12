import { useState, useEffect } from "react";
import { Star, Send, Check, MessageSquare } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeedbackWidgetProps {
  sourceType: "tarot" | "bazi" | "horoscope" | "dream";
  sourceId?: number;
  sessionId?: string;
  className?: string;
}

export function FeedbackWidget({ sourceType, sourceId, sessionId, className = "" }: FeedbackWidgetProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get tags from translations
  const tags = t.feedback.feedbackTags[sourceType] || [];

  // 检查是否已提交反馈
  const { data: checkData } = trpc.feedback.checkSubmitted.useQuery(
    { sourceType, sourceId, sessionId },
    { enabled: !!sourceId || !!sessionId }
  );

  useEffect(() => {
    if (checkData?.submitted) {
      setIsSubmitted(true);
    }
  }, [checkData]);

  // 提交反馈
  const submitMutation = trpc.feedback.submit.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success(t.feedback.successToast);
    },
    onError: (error) => {
      toast.error(error.message || t.feedback.errorToast);
    },
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error(t.feedback.ratingRequired);
      return;
    }

    submitMutation.mutate({
      sourceType,
      sourceId,
      sessionId,
      rating,
      tags: selectedTags,
      comment: comment.trim() || undefined,
    });
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5: return t.feedback.ratingLabels.excellent;
      case 4: return t.feedback.ratingLabels.good;
      case 3: return t.feedback.ratingLabels.average;
      case 2: return t.feedback.ratingLabels.poor;
      case 1: return t.feedback.ratingLabels.bad;
      default: return "";
    }
  };

  // 已提交状态
  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 border border-cyan-500/20 ${className}`}
      >
        <div className="flex items-center justify-center gap-3 text-cyan-400">
          <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium">{t.feedback.thanks}</p>
            <p className="text-sm text-gray-400">{t.feedback.thanksDetail}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10 overflow-hidden ${className}`}
    >
      {/* 头部 */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{t.feedback.title}</h3>
            <p className="text-sm text-gray-400">{t.feedback.subtitle}</p>
          </div>
        </div>

        {/* 星级评分 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">{t.feedback.rating}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setRating(star);
                  if (!isExpanded) setIsExpanded(true);
                }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-cyan-400"
            >
              {getRatingLabel(rating)}
            </motion.p>
          )}
        </div>
      </div>

      {/* 展开的详细反馈 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 space-y-4">
              {/* 快捷标签 */}
              <div>
                <p className="text-sm text-gray-400 mb-3">{t.feedback.selectTags}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 文字反馈 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">{t.feedback.detailedFeedback}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <VoiceInput
                      onTranscript={(text) => setComment(prev => prev + text)}
                      className="h-6 w-6 text-gray-400 hover:text-cyan-400"
                    />
                    <span>{t.feedback.voice}</span>
                  </div>
                </div>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.feedback.commentPlaceholder}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{comment.length}/500</p>
              </div>

              {/* 提交按钮 */}
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || submitMutation.isPending}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
              >
                {submitMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {t.feedback.submitting}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t.feedback.submit}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 未展开时的提示 */}
      {!isExpanded && rating === 0 && (
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-gray-500">{t.feedback.clickToRate}</p>
        </div>
      )}
    </motion.div>
  );
}

export default FeedbackWidget;
