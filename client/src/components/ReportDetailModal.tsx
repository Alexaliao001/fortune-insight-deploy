import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import {
  X,
  Crown,
  Calendar,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Lock,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TarotReport from "@/components/TarotReport";
import BaZiReport from "@/components/BaZiReport";
import DreamReport from "@/components/DreamReport";
import HoroscopeReport from "@/components/HoroscopeReport";

interface ReportDetailModalProps {
  reportId: number;
  /** Optionally pass initial data from the list to show immediately while fetching full data */
  initialData?: {
    id: number;
    reportType: string;
    title: string;
    inputSummary: string | null;
    reportData: any;
    aiInterpretation: string | null;
    isPaid: boolean;
    isFavorite: boolean;
    createdAt: string | number;
  };
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
}

export default function ReportDetailModal({
  reportId,
  initialData,
  onClose,
  onToggleFavorite,
}: ReportDetailModalProps) {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [showRawText, setShowRawText] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Type labels (defined early for use in handleExportPDF)
  const typeLabels: Record<string, string> = isEn
    ? {
        tarot: "Tarot Reading",
        bazi: "BaZi Analysis",
        horoscope: "Horoscope",
        dream: "Dream Interpretation",
      }
    : {
        tarot: "塔罗占卜",
        bazi: "八字精批",
        horoscope: "星座运势",
        dream: "AI解梦",
      };

  // Fetch full report data from API to ensure completeness
  const {
    data: fetchedReport,
    isLoading,
    error,
  } = trpc.reports.getById.useQuery(
    { id: reportId },
    { enabled: !!reportId }
  );

  // Use fetched data if available, otherwise fall back to initial data
  const report = fetchedReport || initialData;

  // PDF Export via browser print
  const handleExportPDF = useCallback(async () => {
    if (!report) return;
    setIsExporting(true);
    toast.info(isEn ? "Preparing PDF..." : "正在准备PDF...");

    try {
      // Get the modal content element
      const contentEl = document.getElementById('report-modal-content');
      if (!contentEl) {
        toast.error(isEn ? "Export failed" : "导出失败");
        setIsExporting(false);
        return;
      }

      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        toast.error(isEn ? "Please allow pop-ups to export PDF" : "请允许弹出窗口以导出PDF");
        setIsExporting(false);
        return;
      }

      // Build the print document
      const title = report.title || 'Fortune Insight Report';
      const dateStr = new Date(report.createdAt).toLocaleDateString(
        isEn ? 'en-US' : 'zh-CN',
        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      );

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            @page { margin: 1.5cm; size: A4; }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
              color: #1a1a2e;
              background: #fff;
              line-height: 1.6;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              margin-bottom: 24px;
              border-bottom: 2px solid #d4a843;
            }
            .header h1 {
              font-size: 22px;
              color: #1a1a2e;
              margin-bottom: 8px;
            }
            .header .meta {
              font-size: 12px;
              color: #666;
            }
            .header .badge {
              display: inline-block;
              padding: 2px 10px;
              border-radius: 12px;
              font-size: 11px;
              background: #d4a843;
              color: #fff;
              margin: 4px 2px;
            }
            .content {
              font-size: 14px;
            }
            .content h2, .content h3 {
              color: #1a1a2e;
              margin: 16px 0 8px;
            }
            .content p {
              margin-bottom: 10px;
            }
            .content table {
              width: 100%;
              border-collapse: collapse;
              margin: 12px 0;
            }
            .content table th, .content table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-size: 13px;
            }
            .content table th {
              background: #f5f5f5;
            }
            .score-grid {
              display: flex;
              justify-content: center;
              gap: 24px;
              margin: 16px 0;
              flex-wrap: wrap;
            }
            .score-item {
              text-align: center;
              padding: 12px;
            }
            .score-item .value {
              font-size: 28px;
              font-weight: bold;
              color: #d4a843;
            }
            .score-item .label {
              font-size: 12px;
              color: #666;
              margin-top: 4px;
            }
            .section {
              margin: 16px 0;
              padding: 12px 16px;
              border-left: 3px solid #d4a843;
              background: #fafafa;
              border-radius: 0 8px 8px 0;
            }
            .section h3 {
              font-size: 15px;
              margin-bottom: 6px;
            }
            .footer {
              text-align: center;
              margin-top: 32px;
              padding-top: 16px;
              border-top: 1px solid #eee;
              font-size: 11px;
              color: #999;
            }
            /* Hide elements not suitable for print */
            button, .no-print { display: none !important; }
            /* Ensure colors print */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <div class="meta">
              <span class="badge">${typeLabels[report.reportType] || report.reportType}</span>
              ${report.isPaid ? `<span class="badge">${isEn ? 'Premium' : '付费'}</span>` : ''}
            </div>
            <div class="meta" style="margin-top:8px">${dateStr}</div>
            ${report.inputSummary ? `<div class="meta" style="margin-top:4px">${report.inputSummary}</div>` : ''}
          </div>
          <div class="content" id="pdf-content"></div>
          <div class="footer">
            Fortune Insight - AI-Powered Spiritual Growth Platform<br>
            ${isEn ? 'Generated on' : '生成于'} ${new Date().toLocaleDateString(isEn ? 'en-US' : 'zh-CN')}
          </div>
        </body>
        </html>
      `);

      // Clone the content and clean it for printing
      const clone = contentEl.cloneNode(true) as HTMLElement;
      // Remove buttons and interactive elements
      clone.querySelectorAll('button, .no-print').forEach(el => el.remove());
      // Fix dark theme colors for print
      clone.querySelectorAll('*').forEach((el) => {
        const htmlEl = el as HTMLElement;
        const computed = window.getComputedStyle(el);
        // Convert light-on-dark text to dark-on-light for printing
        if (computed.color) {
          const rgb = computed.color.match(/\d+/g);
          if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            if (brightness > 200) {
              htmlEl.style.color = '#1a1a2e';
            }
          }
        }
        // Remove dark backgrounds
        if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          const rgb = computed.backgroundColor.match(/\d+/g);
          if (rgb) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            if (brightness < 50) {
              htmlEl.style.backgroundColor = 'transparent';
            } else if (brightness < 100) {
              htmlEl.style.backgroundColor = '#f8f8f8';
            }
          }
        }
        // Ensure borders are visible
        if (htmlEl.style.borderColor === 'transparent' || computed.borderColor?.includes('rgba(255')) {
          htmlEl.style.borderColor = '#ddd';
        }
      });

      const pdfContent = printWindow.document.getElementById('pdf-content');
      if (pdfContent) {
        pdfContent.innerHTML = clone.innerHTML;
      }

      printWindow.document.close();

      // Wait for content to render then trigger print
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Close after a delay to allow print dialog
        setTimeout(() => {
          printWindow.close();
        }, 1000);
        setIsExporting(false);
        toast.success(isEn ? "PDF ready - use Save as PDF in print dialog" : "PDF已准备 - 在打印对话框中选择「另存为PDF」");
      }, 500);
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error(isEn ? "Export failed" : "导出失败");
      setIsExporting(false);
    }
  }, [report, isEn, typeLabels]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const typeColors: Record<string, string> = {
    tarot: "from-purple-500/20 to-indigo-500/20 border-purple-500/30",
    bazi: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
    horoscope: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
    dream: "from-teal-500/20 to-emerald-500/20 border-teal-500/30",
  };

  const renderStructuredReport = useCallback(() => {
    if (!report) return null;
    const data = report.reportData;

    switch (report.reportType) {
      case "tarot":
        if (data?.cards && data?.spread) {
          return (
            <TarotReport
              cards={data.cards}
              spread={data.spread}
              reading={report.aiInterpretation || ""}
              isPaid={report.isPaid ?? false}
              questionType={data.questionType}
              question={data.question}
            />
          );
        }
        break;
      case "bazi":
        if (data?.chart) {
          return (
            <BaZiReport
              chart={data.chart}
              reading={report.aiInterpretation || ""}
              isPaid={report.isPaid ?? false}
            />
          );
        }
        break;
      case "horoscope":
        if (data?.horoscopeData) {
          return (
            <HoroscopeReport
              data={data.horoscopeData}
              signName={data.signName || ""}
              signSymbol={data.signSymbol || ""}
              isPaid={report.isPaid ?? false}
            />
          );
        }
        break;
      case "dream":
        return (
          <DreamReport
            interpretation={report.aiInterpretation || ""}
            symbolAnalysis={data?.symbolAnalysis || []}
            theme={data?.theme || null}
            dreamContent={report.inputSummary || ""}
            emotions={data?.emotions || []}
            keyElements={data?.elements || []}
            isPaid={report.isPaid ?? false}
          />
        );
      default:
        break;
    }
    return null;
  }, [report]);

  // Loading state
  if (isLoading && !initialData) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md p-12 rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Loader2 className="w-8 h-8 animate-spin text-[#d4a843] mx-auto mb-4" />
          <p className="text-gray-400">
            {isEn ? "Loading report..." : "加载报告中..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !report) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md p-12 rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            {isEn ? "Failed to load report" : "报告加载失败"}
          </p>
          <Button variant="outline" onClick={onClose}>
            {isEn ? "Close" : "关闭"}
          </Button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const structuredContent = renderStructuredReport();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`sticky top-0 z-10 bg-gradient-to-r ${typeColors[report.reportType] || typeColors.tarot} border-b border-white/10 px-6 py-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-lg font-bold text-white truncate">
                      {report.title}
                    </h2>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {typeLabels[report.reportType]}
                    </Badge>
                    {report.isPaid ? (
                      <Badge className="text-xs bg-[#d4a843]/20 text-[#d4a843] border-[#d4a843]/30 shrink-0">
                        <Crown className="w-3 h-3 mr-1" />
                        {isEn ? "Premium" : "付费"}
                      </Badge>
                    ) : (
                      <Badge className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/30 shrink-0">
                        {isEn ? "Free" : "免费"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.createdAt).toLocaleDateString(
                        isEn ? "en-US" : "zh-CN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                    {report.inputSummary && (
                      <span className="truncate max-w-[200px]">
                        {report.inputSummary}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  title={isEn ? "Export PDF" : "导出PDF"}
                >
                  {isExporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white"
                  onClick={() => onToggleFavorite(report.id)}
                >
                  {report.isFavorite ? (
                    <BookmarkCheck className="w-5 h-5 text-[#d4a843]" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div id="report-modal-content" className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            {/* Loading indicator when fetching full data but showing initial data */}
            {isLoading && initialData && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEn
                  ? "Loading full report data..."
                  : "正在加载完整报告数据..."}
              </div>
            )}

            {/* Structured report if available */}
            {structuredContent && (
              <div className="mb-6">{structuredContent}</div>
            )}

            {/* AI Interpretation text (fallback when no structured content) */}
            {report.aiInterpretation && !structuredContent && (
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer>{report.aiInterpretation}</MarkdownRenderer>
              </div>
            )}

            {/* Upgrade prompt for free reports without structured content */}
            {!report.isPaid && !structuredContent && !report.aiInterpretation && (
              <div className="text-center py-12">
                <Lock className="w-12 h-12 text-[#d4a843]/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {isEn
                    ? "Premium Report Content"
                    : "付费报告内容"}
                </h3>
                <p className="text-gray-400 mb-4">
                  {isEn
                    ? "Upgrade to view the full structured report with detailed analysis"
                    : "升级查看完整结构化报告和详细分析"}
                </p>
              </div>
            )}

            {/* Toggle raw text for structured reports */}
            {structuredContent && report.aiInterpretation && (
              <div className="border-t border-white/10 pt-4 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white w-full"
                  onClick={() => setShowRawText(!showRawText)}
                >
                  {showRawText ? (
                    <ChevronUp className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  )}
                  {isEn ? "View Original AI Text" : "查看原始AI解读文本"}
                </Button>
                <AnimatePresence>
                  {showRawText && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="prose prose-invert max-w-none mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <MarkdownRenderer>
                          {report.aiInterpretation}
                        </MarkdownRenderer>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* No content fallback */}
            {!report.aiInterpretation && !structuredContent && report.isPaid && (
              <div className="text-center py-12 text-gray-500">
                <p>{isEn ? "No report content available" : "暂无报告内容"}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
