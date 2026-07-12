# 塔罗全效果验收清单（GROK_GOAL_TAROT）

**本地：** `pnpm dev` → 打开下方 URL（示例 `http://127.0.0.1:56410`）  
**线上：** Manus 发布最新 `main` 后在 fortunesite.one 复测  

## 主路径

| # | 路径 / 操作 | 期望 |
|---|-------------|------|
| 1 | `/tarot` | 题型可选；页脚左侧「声音」 |
| 2 | `/tarot?type=career` | 事业题型高亮 |
| 3 | 问题页 | 单张/三牌切换；3 条问题模板可点填 |
| 4 | 开始抽牌 | 洗牌动画（可跳过）；牌台氛围 |
| 5 | 点选牌背 | 飞入槽位；翻牌金光；可选震动；关键词 chip；元素色边；可能逆位 |
| 6 | 齐牌 | 「静待启示」+ 开始解读 CTA 强调（可立刻点） |
| 7 | 结果 | 金句置顶放大；分段报告；TTS；再抽/换题；分享出图；更多功能折叠 |
| 8 | 声音 | 默认有短音效；关「声音」后无 sfx；无背景循环 |
| 9 | reduce-motion | 系统减少动态后仍可完成全流程 |

## 回归

```bash
pnpm exec vitest run server/tarot-*.test.ts
bash scripts/local_smoke.sh http://127.0.0.1:PORT
```
