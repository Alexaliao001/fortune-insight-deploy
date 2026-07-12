# 主页 Wireframe v1 — 视觉 / 文案

**状态**：设计稿（未实现）  
**目标**：首屏更尖、试用曝光、去掉假社交证明、主路径清晰  
**受众双态**：游客（Guest）/ 登录用户（Auth）  
**语言**：中文主写，英文对照

---

## 0. 设计原则

1. **首屏只做一件事**：让用户开始第一次免费体验（默认塔罗）。
2. **真实优先**：无真实数据不写假 live / 假评分。
3. **试用上首屏**：14 天无限是注册钩子，不埋在会员页。
4. **一条主路径 + 次入口**：Career 是高亮入口，不是第二 Hero。
5. **移动优先**：手机首屏 ≈ 标题 + 一句价值 + 主 CTA + 试用一行；其余可滚。

---

## 1. 页面信息架构（改后）

```
[Navbar]
────────────────────────────────
1. HERO（瘦身）
   · 标题 + 副标题
   · 价值主张 1 行
   · 主 CTA + 次 CTA
   · 试用/额度说明 1 行
   · 真实统计（有数据才显示）
   · [可选折叠] CosmicAlert / 站内通知

2. TRUST 精简条（3 项，全真）

3. 结果预览（1 张静态 mock）

4. 服务网格（4 卡 + Career 高亮位 或 5 卡含 Career）
   · 合盘：次级宽卡，去掉过期 NEW

5. 为何不同（3 特征，保留）

6. 用户声音（3 证言，改中性标题 + 弱模板）

7. 会员 / 试用 CTA（试用优先，年付次之）

8. 社区（压缩为单行 CTA 或半高）

[Footer]
```

**下线 / 弱化**

| 模块 | 处理 |
|------|------|
| LiveActivityIndicator | **移除**（假数据） |
| Trust「4.8/5 Rating」 | **移除** |
| CosmicAlert 顶占位 | **移出首屏** → Hero 底或服务区上，可 dismiss |
| InAppNotifications | **仅 Auth + 有消息时**显示；游客不占首屏 |
| 独立 Career 通栏 | **并入服务区**高亮卡 |
| Community 四宫格大段 | **压缩** |

---

## 2. 首屏 Wireframe（Mobile ≈ 390px）

```
┌─────────────────────────────────────┐
│  [Logo 洞察未来]     中/EN   登录    │  Navbar
├─────────────────────────────────────┤
│                                     │
│           洞察未来                   │  H1 gradient
│        遇见更好的自己                 │  H1 sub
│                                     │
│   AI 塔罗 · 八字 · 星座 · 解梦        │  value line
│   心理学视角，不搞玄学恐吓             │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  ★ 免费抽一副塔罗            │    │  Primary CTA → /tarot
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │  注册领 14 天无限体验        │    │  Secondary → /login 或 /membership
│  └─────────────────────────────┘    │
│                                     │
│  游客可先体验 · 注册后 14 天无限     │  microcopy
│                                     │
│  12,480+ 报告    |  东西方融合       │  stats：仅 API 有值时显示数字
│                                     │  无数据时只保留「东西方融合 / 可先体验」
└─────────────────────────────────────┘
     ↑ 以上尽量一屏内（含 CTA）
```

### Desktop（≥1024）

```
┌──────────────────────────────────────────────────────────────┐
│ Logo · 导航服务 · 社区 · 会员 · 语言 · 登录/头像                │
├────────────────────────────┬─────────────────────────────────┤
│                            │                                 │
│  洞察未来                   │   ┌─────────────────────────┐   │
│  遇见更好的自己              │   │  [结果预览卡 mock]       │   │
│                            │   │  塔罗报告片段 / 三张牌    │   │
│  AI 塔罗·八字·星座·解梦     │   │  模糊关键词 + 解读段落   │   │
│  心理学视角，理性而不迷信    │   │                         │   │
│                            │   └─────────────────────────┘   │
│  [免费抽一副塔罗]           │         ↑ 可与 Hero 并排        │
│  [注册领 14 天无限]         │         移动端则下沉到 §3       │
│                            │                                 │
│  游客可先体验 · 注册后…     │                                 │
│  12k+ 报告 · 东西方融合     │                                 │
└────────────────────────────┴─────────────────────────────────┘
```

> 桌面：预览可放 Hero 右侧；移动：预览在 Trust 后单独一节。

---

## 3. 分节文案（中 / 英）

### 3.1 Hero

| 元素 | 中文 | English |
|------|------|---------|
| 品牌名 | 洞察未来 | Fortune Insight |
| 副标 | 遇见更好的自己 | Discover Your True Self |
| 价值主张 | AI 塔罗 · 八字 · 星座 · 解梦 — 心理学视角，理性而不迷信 | AI Tarot, BaZi, Horoscope & Dreams — psychology-first, not scare-mongering |
| Hook（游客） | 先免费体验一次，再决定要不要深入 | Try one free reading — go deeper when you're ready |
| Hook（Auth 上午） | {name}，先看今日运势？ | {name}, start with today's horoscope? |
| Hook（Auth 其他） | 保留时段逻辑，但 **去掉恐吓式**「宇宙特别为你准备」 | Keep time-of-day, drop cosmic FOMO |

**主 CTA（游客）**

| | 中文 | English | href |
|--|------|---------|------|
| Primary | 免费抽一副塔罗 | Free Tarot Reading | `/tarot` |
| Secondary | 注册领 14 天无限 | Sign up · 14-day unlimited | `/login`（注册 tab） |

**主 CTA（Auth，非会员）**

| | 中文 | English | href |
|--|------|---------|------|
| Primary | 继续占卜 / 查看今日运势 | Continue · Today's fortune | `/tarot` 或 `/horoscope`（按时段） |
| Secondary | 试用还剩 N 天 · 了解会员 | Trial · N days left | `/membership` |

**主 CTA（Auth + 会员）**

| | 中文 | English | href |
|--|------|---------|------|
| Primary | 开始今日占卜 | Start today's reading | `/tarot` |
| Secondary | 今日运势 | Daily horoscope | `/horoscope` |

**Microcopy（额度诚实）**

| 状态 | 中文 | English |
|------|------|---------|
| 游客 | 游客可先体验核心功能 · 注册解锁 14 天无限 | Try core features as a guest · sign up for 14 days unlimited |
| 试用中 | 试用中 · 还剩 {n} 天无限 | Free trial · {n} days left |
| 免费额度用尽 | 今日免费次数已用完 · 升级或等明日 | Free limit reached · upgrade or try tomorrow |

**禁止文案**

- ❌「完全免费」覆盖八字（若八字需登录/额度）
- ❌「无需注册」与「注册领试用」同屏打架 → 改成「可先体验」
- ❌ 假 urgency：水星逆行警告（若保留 CosmicAlert，语气改为「今日主题」非警告）

---

### 3.2 Trust 条（仅 3 项）

```
  [锁] 支付由 Stripe 处理    [盾] 数据加密传输    [心] 会员费 10% 捐赠公益
  Stripe secure payments     Encrypted in transit  10% of membership → charity
```

- 去掉：4.8/5、Global Users、SSL 重复文案（可并入加密）
- `opacity` 提到 70–80%，图标 + 短词

---

### 3.3 结果预览

```
┌──────────────────────────────────────────┐
│  你会得到什么                              │  What you'll get
│  ┌────────┐  ┌─────────────────────────┐ │
│  │ 牌面   │  │ 正/逆位 · 关键词         │ │
│  │ mock   │  │ 关系 / 行动建议段落…     │ │
│  └────────┘  │ （示例，非你的结果）      │ │
│              └─────────────────────────┘ │
│  [用这个格式抽我的牌 →]                    │
└──────────────────────────────────────────┘
```

| | 中文 | English |
|--|------|---------|
| 标题 | 你会得到什么 | What you'll get |
| 说明 | 示例报告结构 · 非个性化结果 | Sample layout · not your personal reading |
| CTA | 用这个格式抽我的牌 | Get my reading in this format |
| href | `/tarot` | `/tarot` |

实现注意：静态图或轻量 CSS mock 即可，不请求 LLM。

---

### 3.4 服务区

**布局（Mobile 单列 / Desktop 2×2 或 4 列）**

```
┌──────────── Career 高亮（全宽或 span-2）────────────┐
│ 💼 求职·事业          [推荐]                        │
│ 工作卡关了？用塔罗看清下一步                          │
│ 跳槽 · 面试 · 职场选择                    [开始 →]  │
│ href: /tarot?type=career                            │
└────────────────────────────────────────────────────┘

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 塔罗     │ │ 星座     │ │ 解梦     │ │ 八字     │
│ [可体验] │ │ [可体验] │ │ [可体验] │ │ [需额度] │  ← badge 诚实
│ …        │ │ …        │ │ …        │ │ …        │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

┌──────────── 合盘（全宽次级）────────────────────────┐
│ 💕 关系合盘          去掉 NEW，可标「热门」可选       │
│ 双人缘分与相处建议                         [试试 →]  │
└────────────────────────────────────────────────────┘
```

**Badge 规范**

| 产品 | Badge 中 | Badge EN | 含义 |
|------|----------|----------|------|
| 塔罗 / 星座 / 解梦 | 可体验 | Try free | Guest 可跑 |
| 八字 | 需登录或额度 | Account / quota | 与真实 access 对齐 |
| Career | 推荐路径 | Featured | 产品策略入口 |
| 合盘 | 热门（可选） | Popular | 非 NEW |

**服务区标题**

| | 中文 | English |
|--|------|---------|
| 眉标 | 探索 | Explore |
| H2 | 选择你的入口 | Pick your path |
| 副文 | 从最想问的问题开始，一次只走一条路 | Start with one question — one path at a time |

---

### 3.5 为何不同（Features，保留精简）

| 卡 | 中文标题 | 中文描述 | EN title | EN body |
|----|----------|----------|----------|---------|
| 1 | AI 深度解读 | 大模型生成结构化报告，可分享、可回看 | AI-powered depth | Structured reports you can share and revisit |
| 2 | 理性视角 | 结合积极心理学，避免恐吓式迷信话术 | Grounded approach | Positive psychology — no fear-based superstition |
| 3 | 公益承诺 | 会员收入 10% 捐赠公益项目 | Charity | 10% of membership revenue to charity |

---

### 3.6 用户声音（Testimonials）

| | 中文 | English |
|--|------|---------|
| 眉标 | 用户反馈 | What users say |
| H2 | 真实使用感受 | Real experiences |
| ~~旧~~ | ~~她们的体验~~ | — |

证言内容可先保留现有 3 条，但：

- 作者可用缩写（已有 E.M. 等）
- 页脚小字：`示例用户反馈 · 体验因人而异` / `Illustrative feedback · results vary`
- 有真实投稿后再替换

---

### 3.7 会员 / 试用 CTA

```
┌────────────────────────────────────────────────┐
│  ⭐ 先免费 14 天，再决定是否留下                  │
│                                                │
│  注册即送 14 天无限塔罗 / 八字 / 解梦            │
│  到期自动回到免费额度 · 随时可升级               │
│                                                │
│  [注册领试用]     [查看会员方案 ¥16.6/月起]      │
│                                                │
│  年付更省 · 会员费 10% 捐赠公益                  │
└────────────────────────────────────────────────┘
```

| | 中文 | English |
|--|------|---------|
| 眉 | 试用优先 | Try first |
| H2 | 先免费 14 天，再决定是否留下 | 14 free days — then decide |
| 正文 | 注册即送 14 天无限塔罗、八字与解梦。到期回到免费额度，升级随时可。 | Sign up for 14 days unlimited Tarot, BaZi & Dreams. After trial, free limits return — upgrade anytime. |
| Primary | 注册领试用 | Claim free trial → `/login` |
| Secondary | 查看会员方案 | See plans → `/membership` |
| 价格行 | 年付约 ¥16.6/月 · 比月付更省 | From ~$5/mo on yearly |

**Auth 已在试用**：改标题为「试用还剩 N 天」+ 主按钮「了解会员权益」。  
**已是会员**：整块可换成「感谢支持」+「去社区」或隐藏。

---

### 3.8 社区（压缩）

```
┌────────────────────────────────────────────────┐
│  社区 · 分享感悟与科普          [进入社区 →]   │
└────────────────────────────────────────────────┘
```

去掉四宫格大图；需要时可在社区页内展示。

---

## 4. CosmicAlert / 通知 新位置

**不进首屏折叠区以上。**

推荐：

```
服务区标题上方：
  [可选] CosmicAlert — 文案去恐吓
  例如：今日主题：事业与选择 · 适合抽事业牌
  [查看] [×]
```

InAppNotifications：仅登录且有未读时，出现在 Navbar 铃铛或 Hero 最底一行。

---

## 5. 状态矩阵（实现时对照）

| 用户状态 | Hero Primary | Hero Secondary | Microcopy | 会员块 |
|----------|--------------|----------------|-----------|--------|
| 游客 | 免费塔罗 | 注册 14 天 | 可先体验… | 试用优先 |
| Auth 试用中 | 继续占卜 | 试用剩 N 天 | 试用中 | 剩 N 天 + 升级 |
| Auth 免费已尽 | 看会员 / 明日再来 | 试用已结束 | 额度用尽 | 升级主推 |
| Auth 会员 | 开始今日占卜 | 运势 | — | 隐藏或致谢 |

---

## 6. 视觉规格（轻）

| Token | 用途 |
|-------|------|
| 金 `#d4a843` | 主 CTA、品牌强调 |
| 玫粉→金 gradient | 塔罗主按钮（可保留） |
| 背景 | 现有 Starry + glass-card |
| 圆角 | `rounded-2xl` 卡 / `rounded-xl` 按钮 |
| 间距 | 节间 `py-12~16` 移动，`py-20` 桌面；Hero 下边距减小 |
| 动效 | 首屏仅 title fade-in 一次；去掉假 live 轮播；尊重 `prefers-reduced-motion` |

**不要**：首屏多 orb + alert + toast + live 同时动。

---

## 7. 与现状 diff 摘要

| 现 Home | Wireframe |
|---------|-----------|
| Alert + 通知顶置 | 下沉 / 条件显示 |
| 假 Live + 4.8 分 | 删除 |
| 统计 fallback「4 功能」 | 无数据不装数字 |
| 独立 Career 通栏 | 并入服务高亮 |
| 合盘 NEW | 去掉或改热门 |
| 「她们的体验」 | 「真实使用感受」 |
| 会员块先卖年付 | 先卖 14 天试用 |
| 社区四宫格 | 单行 CTA |
| 无结果预览 | 新增 mock |
| 免费文案冲突 | 统一额度矩阵 |

---

## 8. 验收清单（实现时）

- [ ] 手机首屏可见主 CTA，无需滚完才看到按钮
- [ ] 游客看到「14 天」至少一个入口（Hero 或会员块）
- [ ] 无 LiveActivity、无 4.8 静态分
- [ ] 八字/塔罗 free 口径与 access 一致
- [ ] Career 仍 ≤ ~10s 可见（可在服务区第一项）
- [ ] 中英 key 齐
- [ ] 本地 dev 目测 + 不强制 push

---

## 9. 开放选项（实现前请拍板）

1. **桌面 Hero 是否双栏预览？**  
   - A：双栏（推荐桌面）  
   - B：预览始终独立一节（实现更简单）

2. **次 CTA 链到哪？**  
   - A：`/login` 注册  
   - B：`/membership` 试用说明更长  

3. **CosmicAlert**  
   - A：改文案后保留（今日主题）  
   - B：整段移除 v1  

4. **Community**  
   - A：单行保留  
   - B：主页完全去掉，只留 Footer 链接  

**默认推荐**：1A · 2A · 3A（弱化）· 4A

---

*End of HOME_WIREFRAME v1*

---

## 10. 五外观包 + 选择器（已实现）

见 `GROK_GOAL_HOME.md` 与 `client/src/lib/homeVariant.ts`。

| id | 默认 | 双栏预览 | Alert | 次 CTA | 社区块 |
|----|------|----------|-------|--------|--------|
| classic | | 否 | 弱 | /login | 是 |
| **focus** | ✅ | 是 | 否 | /login | 单行 |
| ritual | | 是 | 弱 | /login | 是 |
| plans | | 是 | 否 | /membership | 是 |
| minimal | | 否 | 否 | /login | 否 |

- localStorage: `fortune.homeVariant`
- UI: 右下角「外观」`HomeVariantPicker`
- 调试: `?variant=plans`
