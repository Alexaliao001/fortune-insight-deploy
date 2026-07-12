# GROK /goal — 伦理转化脊柱（免费价值 → 试用 → 付费）

> **⚠️ 已并入总编排**  
> 优先执行：**`GROK_GOAL_MASTER.md`**（Wave 3 = 本文件内容）。  
> 单独跑本文件仅在 PROD_FIX 已完成、只做转化时使用。

> **用途**：在 Grok Build 里执行  
> `/goal 按 GROK_GOAL_CONVERT.md 做伦理付费路径`  
> 或把下方「§〇 粘贴版启动指令」整段贴进对话。  
>  
> **仓库**：fortune-insight 工作副本（常见 `/tmp/fortune-insight-`）  
> **线上**：默认不 push；用户明文「可以 push」后才可。

**版本**

| 版本 | 说明 |
|------|------|
| **1.0** | 研究合成：多 agent + X/web freemium 实践；伦理转化，禁止黑帽人性操控 |

**与兄弟 goal（硬边界）**

| Goal | 文件 | 只负责 |
|------|------|--------|
| A 信任底盘 | `GROK_GOAL_PROD_FIX.md` | 假评分/恐吓文案/安全头/错误 API |
| **B 转化脊柱（本文件）** | `GROK_GOAL_CONVERT.md` | SoftPaywall、额度诚实、试用叙事、结果页升级、会员价值栈 |
| C 仪式体验 | `GROK_GOAL_PRODUCT_UX.md` + TAROT/HOME | 等待/扫读/分享/产品页手感 |
| D 冒烟 | scripts + 可选 smoke goal | 回归断言，不设计功能 |

**原则**

1. **先给完整免费价值，再问钱**（aha before ask）。  
2. **软墙 > 硬墙**：同质输出 + 用量/深度门，不是假预览骗点。  
3. **14 天试用 = 风险对冲文案**，不是倒计时恐吓。  
4. **禁止**：假 4.8、假 live、宿命恐吓、「不付费就倒霉」、暗扣费、无退出的弹层。  
5. **转化靠结构**（placement / trial / packaging）优于换皮。  

**行业锚点（研究摘要，非 KPI 承诺）**

- Freemium free→paid 常见 **约 2–5% 好 / 6–8% 优秀**（Lenny 等汇总量级）。  
- Soft paywall 往往比 hard **更容易起步转化**；LTV 需另测。  
- 最高胜率实验常是 **trial 结构 / 套餐时长 / 本地化**，不是按钮颜色。  
- 用户常在**到达 paywall 前**已决定是否愿付；paywall 只是成交点。  

---

## 〇、粘贴版启动指令

```
你是 Fortune Insight 伦理转化脊柱的 /goal 工程代理。
唯一任务源：工作区 GROK_GOAL_CONVERT.md（v1.0+）。

【铁律】
1. 只做转化路径：SoftPaywall / 额度文案 / 试用叙事 / 结果页升级 / 会员价值栈诚实。
2. 禁止假评分、假 live、恐吓迷信、暗模式、强制无法关闭的全屏墙（可 dismiss 的 soft 可以）。
3. 禁止改 Stripe 定价算法、试用天数默认值（14 天）除非用户书面改。
4. 禁止吞并 PROD_FIX（安全头/4.8 删除）或 PRODUCT_UX 大改报告结构——可引用其组件。
5. 禁止 push 除非用户明文「可以 push」。
6. 每轮 1 个 C 编号；单写者；最小 diff；中英一致。
7. 前置：若线上仍有 4.8 或逆行恐吓，先提醒用户跑完 PROD_FIX 或本轮只做不依赖其的项。

【SOP】
0. 读本文件 + SoftPaywall/PaywallCTA/Membership/结果页挂载点
1. 读/建 PROGRESS_CONVERT.md
2. 取 §六 最高优先级未完成 1 项
3. 实现
4. tsc + 相关 vitest + 本地路径
5. PROGRESS 一行
6. commit: fortune-convert: <id> …
7. 汇报；等继续或 push

【本轮请开始】§六 第一项未完成（通常 C00）。
```

---

## 一、使命

做出一条用户**感到被帮助、而不是被套路**的路径：  
**游客完整一次价值 → 看清付费多什么 → 注册/14 天试用 → 习惯后升级**。

---

## 二、转化脊柱（产品契约）

```
[获客] Home 主 CTA 免费塔罗 / Career
    ↓
[Aha] 一次完整可读结果（非残缺骗点）+ 可选分享
    ↓
[Desire] SoftPaywall / 额度条：诚实「还剩 N 次 / 深度报告」
    ↓
[Trial] 注册 → 14 天无限（文案：不合适可回免费额度）
    ↓
[Pay] 会员：年付锚定 + 真实权益 + Stripe + 公益 10%
    ↓
[Loop] 日运/回访 + cross-sell 深度（八字/合盘）非恐吓
```

---

## 三、非目标

| 不做 |
|------|
| CSP / XFO / `/trpc` 404（→ PROD_FIX） |
| LoadingRitual 阶段文案大改（→ PRODUCT_UX，可轻链） |
| 主页第 6 套皮 |
| 假紧迫感、假评分、假社交证明 |
| 全站 A/B 实验平台（可记 skip） |

---

## 四、Backlog

### Wave 0 — 审计

#### C00 — SoftPaywall / PaywallCTA 全站挂载表
- **DoD**：表格：文件路径 × 触发条件 × 当前文案 × 是否诚实（免费/试用/会员）。  
- **Scope**：只读 + `PROGRESS_CONVERT.md`。  

#### C01 — 「完全免费」口径清扫
- **DoD**：`rg` 清掉会误导的「完全免费」盖在需额度产品上；与 SoftPaywall 一致。  
- **Verify**：rg + 本地抽 3 页。  

### Wave 1 — 结果后转化（最高 ROI）

#### C10 — 结果页升级时刻（Tarot 先，可复用）
- **DoD**：结果出现后、分享附近：可 dismiss 的升级条；写清「试用 14 天 / 深度 / 无限」；主 CTA 塔罗路径不挡。  
- **禁止**：结果未出完就全屏墙。  

#### C11 — SoftPaywall 文案契约
- **DoD**：统一组件文案键：增量利益列表（非「你完蛋了」）；次按钮「继续用免费额度」。  
- **Verify**：三产品页文案同源或共享常量。  

#### C12 — 分享卡回链获客
- **DoD**：ShareResultCard OG/文案含「免费试一次」+ 站内路径；不伪造用户数。  

### Wave 2 — 试用与会员

#### C20 — 14 天文案单一事实源
- **DoD**：Login / Membership / SoftPaywall / Home micro 引用同一常量或 locales key（天数可配置但不互相矛盾）。  

#### C21 — 会员页价值栈（4.8 已删之后）
- **DoD**：无假分；年付锚定；权益对照表；试用优先 CTA；公益 10% 真。  
- **前置**：PROD_FIX PF01 完成或本项一并删 4.8。  

#### C22 — 额度可见性
- **DoD**：登录用户可见「今日剩余 / 试用中」类提示（已有 UsageBadge 则对齐文案）。  

### Wave 3 — 漏斗验证

#### C30 — 转化冒烟（结构）
- **DoD**：vitest/rg：SoftPaywall 仍挂载；无 4.8；无「水星逆行警告」；career 深链仍在。  

#### C31 — 本地手测脚本段落
- **DoD**：`LOCAL_PREVIEW.md` 增加「游客一次塔罗 → 见 soft → 登录页 14 天」步骤。  

#### C40 — `[skip]` 埋点 variant_selected / paywall_view（用户点名再做）  

---

## 五、推荐 Skills 用法（执行本 goal 时）

| 环节 | Skill | 用法 |
|------|--------|------|
| 竞品/话术调研 | `agent-reach` | X/web 搜 paywall 结构，**不**抄假紧迫 |
| 文案去 AI 味 | `human-chat-eq` | SoftPaywall / 会员中文 |
| 会员/落地视觉 | `design-taste-frontend` + `emil-design-eng` | 只改转化相关块，不大拆 |
| a11y | `web-design-guidelines` | paywall 可键盘关闭 |
| 验收 | `check-work` | 改完跑 |
| 缺 CRO skill | 见 `create-skill` | 跑通 C00–C21 后沉淀 `cro-paywall` |
| 外部包（可选装） | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | CRO/copy/SEO skill 包；**安装前人工筛掉黑帽** |

---

## 六、完成定义

- [ ] C00–C01、C10–C12、C20–C22、C30–C31 `[x]` 或用户 skip  
- [ ] 游客路径可手测「有价值 → 懂为何付 → 能试用」  
- [ ] 无假证明/恐吓  
- [ ] 用户授权后才 push  

*End CONVERT v1.0*
