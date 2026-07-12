/**
 * 梦境日记PDF生成器
 * 生成精美的梦境解读报告PDF
 */

import { DreamRecord } from "../drizzle/schema";

// 梦境类型标签
const dreamTypeLabels: Record<string, string> = {
  normal: "普通梦境",
  nightmare: "噩梦",
  lucid: "清醒梦",
  recurring: "重复梦",
  prophetic: "预知梦",
};

// 格式化日期
function formatDate(date: Date | string | null): string {
  if (!date) return "未知日期";
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 清理Markdown格式，转换为纯文本
function cleanMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "") // 移除标题标记
    .replace(/\*\*(.*?)\*\*/g, "$1") // 移除粗体
    .replace(/\*(.*?)\*/g, "$1") // 移除斜体
    .replace(/`(.*?)`/g, "$1") // 移除代码标记
    .replace(/\n{3,}/g, "\n\n"); // 减少多余空行
}

// 生成单个梦境的HTML内容
function generateDreamHTML(dream: DreamRecord, index?: number): string {
  const emotions = Array.isArray(dream.emotions) ? dream.emotions.join("、") : "";
  const elements = Array.isArray(dream.keyElements) ? dream.keyElements.join("、") : "";
  const interpretation = dream.interpretation ? cleanMarkdown(dream.interpretation) : "暂无解读";
  
  return `
    <div class="dream-card" style="page-break-inside: avoid; margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.3);">
      ${index !== undefined ? `<div style="color: rgba(139, 92, 246, 0.6); font-size: 12px; margin-bottom: 10px;">梦境记录 #${index + 1}</div>` : ''}
      
      <h2 style="color: #a78bfa; font-size: 22px; margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 28px;">🌙</span>
        ${dream.title || "未命名梦境"}
      </h2>
      
      <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; font-size: 13px; color: #94a3b8;">
        <span>📅 ${formatDate(dream.createdAt)}</span>
        <span>🏷️ ${dreamTypeLabels[dream.dreamType || "normal"]}</span>
        ${dream.clarity ? `<span>✨ 清晰度 ${dream.clarity}/5</span>` : ''}
      </div>
      
      <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="color: #60a5fa; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">梦境内容</h3>
        <p style="color: #e2e8f0; line-height: 1.8; margin: 0; white-space: pre-wrap;">${dream.dreamContent}</p>
      </div>
      
      ${emotions || elements ? `
      <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
        ${emotions ? `
        <div style="flex: 1; min-width: 200px;">
          <h4 style="color: #f472b6; font-size: 13px; margin: 0 0 8px 0;">💭 梦中情绪</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${(dream.emotions as string[]).map(e => `<span style="background: rgba(244, 114, 182, 0.2); color: #f472b6; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${e}</span>`).join('')}
          </div>
        </div>
        ` : ''}
        ${elements ? `
        <div style="flex: 1; min-width: 200px;">
          <h4 style="color: #fbbf24; font-size: 13px; margin: 0 0 8px 0;">✨ 关键元素</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${(dream.keyElements as string[]).map(e => `<span style="background: rgba(251, 191, 36, 0.2); color: #fbbf24; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${e}</span>`).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #8b5cf6;">
        <h3 style="color: #a78bfa; font-size: 16px; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
          <span>🔮</span> AI智能解读
        </h3>
        <div style="color: #e2e8f0; line-height: 1.9; white-space: pre-wrap; font-size: 14px;">${interpretation}</div>
      </div>
    </div>
  `;
}

// 生成完整的PDF HTML
export function generateDreamPDFHTML(dreams: DreamRecord[], title?: string): string {
  const isSingle = dreams.length === 1;
  const pageTitle = title || (isSingle ? (dreams[0].title || "梦境解读报告") : "梦境日记");
  
  const dreamsHTML = dreams.map((dream, index) => 
    generateDreamHTML(dream, isSingle ? undefined : index)
  ).join('');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pageTitle} - 洞察未来</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 50px;
      padding: 40px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
      border-radius: 20px;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .logo {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    .site-name {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .report-title {
      font-size: 20px;
      color: #94a3b8;
      margin-bottom: 15px;
    }
    
    .report-meta {
      font-size: 13px;
      color: #64748b;
    }
    
    .footer {
      text-align: center;
      margin-top: 50px;
      padding: 30px;
      border-top: 1px solid rgba(139, 92, 246, 0.2);
      color: #64748b;
      font-size: 12px;
    }
    
    .footer-logo {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .disclaimer {
      margin-top: 15px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      font-size: 11px;
      line-height: 1.6;
    }
    
    @media print {
      body {
        background: white;
        color: #1a1a2e;
        padding: 20px;
      }
      
      .dream-card {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
      }
      
      .header {
        background: #f1f5f9 !important;
        border: 1px solid #e2e8f0 !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🌙✨</div>
      <div class="site-name">洞察未来</div>
      <div class="report-title">${pageTitle}</div>
      <div class="report-meta">
        生成时间：${formatDate(new Date())} | 
        共 ${dreams.length} 条梦境记录
      </div>
    </div>
    
    <div class="dreams-container">
      ${dreamsHTML}
    </div>
    
    <div class="footer">
      <div class="footer-logo">🌙</div>
      <div>洞察未来 - AI驱动的心灵成长平台</div>
      <div class="disclaimer">
        💡 梦境解读仅供参考，旨在帮助您进行自我探索和心理成长。
        真正的智慧来自您对自己内心的觉察与理解。
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// 生成PDF Buffer（使用服务端渲染）
export async function generateDreamPDF(dreams: DreamRecord[], title?: string): Promise<Buffer> {
  const html = generateDreamPDFHTML(dreams, title);
  
  // 使用puppeteer或类似工具生成PDF
  // 这里我们返回HTML内容，让前端处理PDF生成
  return Buffer.from(html, 'utf-8');
}


/**
 * 八字精批PDF生成器
 * 生成精美的八字分析报告PDF
 */

import { BaziReading } from "../drizzle/schema";

// 性别标签
const genderLabels: Record<string, string> = {
  male: "男",
  female: "女",
};

// 生成八字HTML内容
function generateBaziHTML(bazi: BaziReading, index?: number): string {
  const birthInfo = `${bazi.birthYear}年${bazi.birthMonth}月${bazi.birthDay}日${bazi.birthHour !== null ? ` ${bazi.birthHour}时` : ''}`;
  const genderText = bazi.gender ? genderLabels[bazi.gender] : "未知";
  const fullReport = bazi.fullReport ? cleanMarkdown(bazi.fullReport) : "暂无完整报告";
  
  return `
    <div class="bazi-card" style="page-break-inside: avoid; margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; border: 1px solid rgba(251, 191, 36, 0.3);">
      ${index !== undefined ? `<div style="color: rgba(251, 191, 36, 0.6); font-size: 12px; margin-bottom: 10px;">八字分析记录 #${index + 1}</div>` : ''}
      
      <h2 style="color: #fbbf24; font-size: 22px; margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 28px;">⭐</span>
        八字命理分析报告
      </h2>
      
      <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; font-size: 13px; color: #94a3b8;">
        <span>📅 出生：${birthInfo}</span>
        <span>👤 性别：${genderText}</span>
        <span>🕐 生成时间：${formatDate(bazi.createdAt)}</span>
      </div>
      
      ${bazi.baziChart ? `
      <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
        <h3 style="color: #fbbf24; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">八字命盘</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px;">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">年柱</div>
            <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">${(bazi.baziChart as any)?.year || '—'}</div>
          </div>
          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px;">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">月柱</div>
            <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">${(bazi.baziChart as any)?.month || '—'}</div>
          </div>
          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px;">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">日柱</div>
            <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">${(bazi.baziChart as any)?.day || '—'}</div>
          </div>
          <div style="background: rgba(251, 191, 36, 0.1); padding: 15px; border-radius: 8px;">
            <div style="color: #94a3b8; font-size: 12px; margin-bottom: 5px;">时柱</div>
            <div style="color: #fbbf24; font-size: 18px; font-weight: bold;">${(bazi.baziChart as any)?.hour || '—'}</div>
          </div>
        </div>
      </div>
      ` : ''}
      
      ${bazi.personalityAnalysis ? `
      <div style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #8b5cf6;">
        <h3 style="color: #a78bfa; font-size: 16px; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span>🎭</span> 性格特点
        </h3>
        <div style="color: #e2e8f0; line-height: 1.8; white-space: pre-wrap; font-size: 14px;">${cleanMarkdown(bazi.personalityAnalysis)}</div>
      </div>
      ` : ''}
      
      ${bazi.talentAnalysis ? `
      <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
        <h3 style="color: #60a5fa; font-size: 16px; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span>💎</span> 天赋潜能
        </h3>
        <div style="color: #e2e8f0; line-height: 1.8; white-space: pre-wrap; font-size: 14px;">${cleanMarkdown(bazi.talentAnalysis)}</div>
      </div>
      ` : ''}
      
      ${bazi.careerSuggestions ? `
      <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #10b981;">
        <h3 style="color: #34d399; font-size: 16px; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
          <span>💼</span> 职业方向
        </h3>
        <div style="color: #e2e8f0; line-height: 1.8; white-space: pre-wrap; font-size: 14px;">${cleanMarkdown(bazi.careerSuggestions)}</div>
      </div>
      ` : ''}
      
      <div style="background: rgba(251, 191, 36, 0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #fbbf24;">
        <h3 style="color: #fbbf24; font-size: 16px; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
          <span>📜</span> 完整命理分析
        </h3>
        <div style="color: #e2e8f0; line-height: 1.9; white-space: pre-wrap; font-size: 14px;">${fullReport}</div>
      </div>
    </div>
  `;
}

// 生成完整的八字PDF HTML
export function generateBaziPDFHTML(readings: BaziReading[], title?: string): string {
  const isSingle = readings.length === 1;
  const pageTitle = title || (isSingle ? "八字命理分析报告" : "八字分析记录");
  
  const readingsHTML = readings.map((reading, index) => 
    generateBaziHTML(reading, isSingle ? undefined : index)
  ).join('');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pageTitle} - 洞察未来</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
      color: #e2e8f0;
      min-height: 100vh;
      padding: 40px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 50px;
      padding: 40px;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
      border-radius: 20px;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }
    
    .logo {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    .site-name {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .report-title {
      font-size: 20px;
      color: #94a3b8;
      margin-bottom: 15px;
    }
    
    .report-meta {
      font-size: 13px;
      color: #64748b;
    }
    
    .footer {
      text-align: center;
      margin-top: 50px;
      padding: 30px;
      border-top: 1px solid rgba(251, 191, 36, 0.2);
      color: #64748b;
      font-size: 12px;
    }
    
    .footer-logo {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .disclaimer {
      margin-top: 15px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      font-size: 11px;
      line-height: 1.6;
    }
    
    @media print {
      body {
        background: white;
        color: #1a1a2e;
        padding: 20px;
      }
      
      .bazi-card {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
      }
      
      .header {
        background: #fffbeb !important;
        border: 1px solid #fde68a !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">⭐✨</div>
      <div class="site-name">洞察未来</div>
      <div class="report-title">${pageTitle}</div>
      <div class="report-meta">
        生成时间：${formatDate(new Date())} | 
        共 ${readings.length} 条分析记录
      </div>
    </div>
    
    <div class="readings-container">
      ${readingsHTML}
    </div>
    
    <div class="footer">
      <div class="footer-logo">⭐</div>
      <div>洞察未来 - AI驱动的心灵成长平台</div>
      <div class="disclaimer">
        💡 八字分析仅供参考，旨在帮助您进行自我认知和人生规划。
        命运掌握在自己手中，积极的心态和努力才是成功的关键。
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// 生成八字PDF Buffer
export async function generateBaziPDF(readings: BaziReading[], title?: string): Promise<Buffer> {
  const html = generateBaziPDFHTML(readings, title);
  return Buffer.from(html, 'utf-8');
}
