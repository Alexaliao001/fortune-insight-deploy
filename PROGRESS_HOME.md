# PROGRESS — Homepage multi-variant

| 日期 | 任务ID | 结果 | 本地URL | 遗留 |
|------|--------|------|---------|------|
| 2026-07-10 | H00–H13 | batch ship: variant contract + shared sections + picker + 5 flags + IA cleanup + tests | `pnpm dev` → `/` · 右下「外观」切换；`?variant=minimal` 调试 | 用户总检后 push；H14/H15 skip |
| 2026-07-10 | career-entry | F1-1 test follows HomeSections composition; vitest career+variant 16/16; tsc log non-empty | http://127.0.0.1:56310/ | no push |
| 2026-07-10 | polish+push | classic=改版前结构；其它页不拆五套只挂 data-home-variant；push | 线上 / 本地 | 用户可总检 |

## 产品裁定：其它页面要不要跟风？

**不做**「塔罗/八字/会员页各 5 套布局」——维护爆炸、品牌分裂、客服难对齐。

| 层 | 策略 |
|----|------|
| 主页 | 5 外观包 + 选择器（已做） |
| 其它产品页 | **单一布局** 继续迭代体验（如塔罗仪式） |
| 全站 | `document.documentElement.dataset.homeVariant` 写入偏好，**预留**以后可选的轻量色调/密度 CSS，默认不强制 |

**经典 = 改版前主页结构**：无结果预览 mock、legacy CosmicAlert、社区四宫格+高装饰、会员价展示与「立即加入/公益」双按钮；**仍去掉**假 LiveActivity 与 4.8 静态分（诚实 IA）。
2026-07-10 | career-entry fix | PASS | HomeSections path | tsc log non-empty
