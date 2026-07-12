# PROGRESS — Product UX (八字 → 解梦 → 星座)

## U00 baseline inventory (2026-07-10)

| 路径 | LoadingRitual | ShareResultCard | 报告组件 | 最长等待 |
|------|---------------|-----------------|----------|----------|
| `/bazi` | 有 | 有 | BaZiReport | mutation ~30–90s |
| `/dream` | 有 | 有 | DreamReport | mutation ~30–90s |
| `/horoscope` | 有 | 有 | HoroscopeReport | query 较短 |

与塔罗差距（改前）：
1. 结果页缺统一 pull-quote 扫读句  
2. 星座 deep 默认摊开偏墙  
3. 解梦缺一键示例填入  

## 进度日志

| 日期 | id | 结果 | 本地URL | 遗留 |
|------|-----|------|---------|------|
| 2026-07-10 | U00 | inventory 写入本文件 | — | — |
| 2026-07-10 | U01 | longWaitHint 分类型阶段文案 + loadingStageLabels；LoadingRitual aria-busy | /bazi loading | — |
| 2026-07-10 | U02 | reportScan.ts extractPullQuote/shareSummary；tarot re-export | unit | — |
| 2026-07-10 | B00–B03 | 八字 loading aria、表单校验 toast、错误保留表单、BaZiReport pull-quote、shareSummary | /bazi | — |
| 2026-07-10 | D00–D02 | 示例填入、pull-quote、shareSummary | /dream | D03 journal skip（无独立空态 journal 块） |
| 2026-07-10 | S00–S03 | 今日一览 takeaway、deep 默认折叠、14 天试用钩、CrossSell 已有 | /horoscope | — |
| 2026-07-10 | U10–U11 | tsc 0；vitest report-scan+structure+loading+career 26 pass；PROGRESS | dev shell 200 | 不 push 除非用户授权 |

## 本地怎么测

```bash
cd /tmp/fortune-insight-   # 或你的 clone
pnpm dev
# 打开 /bazi /dream /horoscope
# 解梦：点「填入示例梦境」应只填表不自动提交
# 星座：选座后先看「今日一览」，深度分析默认收起
```
