# GROK /goal — Fortune Insight 总编排（信任 → 转化 → 体验 → 验收）

> **用途（唯一主任务源）**  
> `/goal 按 GROK_GOAL_MASTER.md 做总编排`  
> 或粘贴 §〇 启动指令。  
>  
> **仓库**：本文件所在目录 = fortune-insight 工作副本（常见 `/tmp/fortune-insight-`）  
> **线上**：`https://fortunesite.one` — **默认不 push / 不部署**；仅当用户明文「可以 push」才 push。

**版本**

| 版本 | 说明 |
|------|------|
| **1.0** | 合并：线上审计修复 + 伦理转化 + 产品页 UX + 统一验收；强制波次顺序 |
| **1.1** | **产品立场修订**：Cosmic 戏剧/紧迫/逆行类钩子 **保留并增强**，禁止删除；假评分/假 live 仍禁；钩子必须接到免费行动 |
| **1.2** | **用户自执行包**：§〇 自包含；进度模板；G52 总检与戏剧立场一致；本文件 = 唯一执行源 |

**产品立场（戏剧张力 · 用户已拍板）**

| 要 | 不要 |
|----|------|
| 增强 CosmicAlert：逆行、满月、关系宫、财运窗等 **戏剧感与紧迫感** | 删除「水星逆行」等钩子当「净化」 |
| high/medium 分级、倒计时、视觉脉冲、每日轮换更有戏 | 假 4.8、假 live 动态 |
| 每条 Alert **必须** CTA 到具体产品（塔罗/运势/八字/解梦/合盘） | 只吓人无出口 |
| 五皮可调强度：`ritual`/`classic` 最冲，`focus` 可略收但仍可有戏 | 医疗/法律恐吓、诅咒式「不付费就灾」 |
| 转化用人性：好奇、损失厌恶、时间窗、完成欲 | 造假社会证明 |

**兄弟文件（降级为附录，执行以本文件为准）**

| 旧文件 | 并入本 goal 的波次 |
|--------|-------------------|
| `GROK_GOAL_PROD_FIX.md` | Wave 1–2（**假证明删除 + 安全**；Alert 改为增强，见 G12） |
| `GROK_GOAL_CONVERT.md` | Wave 3（伦理转化） |
| `GROK_GOAL_PRODUCT_UX.md` | Wave 4（八字→解梦→星座体验） |
| `GROK_GOAL_HOME.md` / `TAROT` | **禁止重做**已 ship 主页五皮 / 塔罗大礼包 |

**编排总图（必须按序，禁止跳波）**

```
Wave 0  测绘与进度文件
   ↓
Wave 1  信任 + 戏剧钩子（去假分 / 增强 Alert / 真信任）
   ↓
Wave 2  工程安全（响应头 / 错误 /trpc）
   ↓
Wave 3  伦理转化脊柱（aha → soft → trial → pay）
   ↓
Wave 4  产品仪式 UX（共享地基 → 八字 → 解梦 → 星座）
   ↓
Wave 5  总验收
```

**为什么这样排**

1. 先去掉 **假证明**（4.8），并 **加强** 情绪钩子（Alert），再写转化——真张力 + 假分数必须分开。  
2. 安全头与 API 与 UI 解耦。  
3. SoftPaywall / 试用建立后，再加深产品体验。  
4. 最后统一冒烟。  

---

## 〇、粘贴版启动指令（复制整段到对话即可执行）

```
你是 Fortune Insight 总编排 /goal 工程代理。
唯一任务源：工作区 GROK_GOAL_MASTER.md（v1.2+）。若无该文件，用本消息全文 + 同目录已有代码。
旧文件 PROD_FIX / CONVERT / PRODUCT_UX / HOME / TAROT 仅附录；冲突以 MASTER 为准。

【编排顺序 — 禁止跳波】
W0 G00
W1 G10→G11→G12→G13     去假4.8 + 真信任 + CosmicAlert戏剧增强
W2 G20→G21→G22         XFO/CSP + /trpc非SPA
W3 G30→G36             SoftPaywall/试用/结果升级/会员价值栈
W4 G40→G44 (G45可选)   共享loading/quote → 八字 → 解梦 → 星座
W5 G50→G51→G52         tsc/vitest/rg闸/手测文档

【产品铁律 — 违反=本轮作废】
1. 上一波全 [x]|[skip] 才能进下一波；同波 G 编号升序；每轮 1 个 G；单写者；最小 diff。
2. 转化：aha before ask；软墙；14天试用风险对冲。禁止假4.8、假live、暗扣费、无法关闭硬全屏墙。
3. CosmicAlert：禁止删除逆行/满月等钩子；必须增强文案/视觉/CTA；每条href到真产品；禁医疗/诅咒式「不付费就灾」。
4. 禁止重做主页五皮架构、塔罗T00–T25、换框架、未授权改Stripe价/试用天数默认。
5. 禁止 push/部署，除非用户明文「可以 push」。
6. 不提交.env/密钥；中英一致。
7. Baseline：asset404非SPA HTML；auth.me无passwordHash；无Manus；14天不谎；/tarot?type=career；homeVariant可用。

【本地】pnpm dev；安全头用 build+start 或 curl。 [x]=tsc+相关vitest+路径可述。
【进度】PROGRESS_MASTER.md  |  commit: fortune-master: <Gid> …
【SOP】读MASTER全文→PROGRESS→做最小未完成G→验证→PROGRESS一行→本地commit→汇报。
【开始】做 §六 第一项未完成（通常 G00）。
```

---

## 一、使命（一句话）

在**不 push** 前提下，按编排顺序交付：  
**去假证明 + 戏剧钩子更上头 → 诚实免费到付费 → 产品手感 → 可回归验收**。  
用人性（好奇、紧迫、完成欲）拉进免费 aha，再用软墙与试用转化——**张力要强，证明要真**。

---

## 二、完美定义（整 goal 完成才算完）

### A. 信任真伪 + 戏剧钩子（Wave 1–2）

1. 用户可见静态 `4.8/5` / `4.8/5 Rating` **清除**（假证明）。  
2. CosmicAlert **增强**：逆行/满月/关系/财运等事件库更丰、更有戏；每条含 urgency + CTA 到真实路由；中英齐全；dismiss 仍可用。  
3. Production 响应有 **X-Frame-Options** + nosniff；CSP 或 CSP-Report-Only 有一版。  
4. `GET /trpc/*`（无 api 前缀）**非** SPA HTML；`/api/trpc/*` 正常。  


### B. 伦理转化（Wave 3）

5. SoftPaywall / 额度 / 试用 14 天文案**同源不矛盾**；无「完全免费」盖需额度产品。  
6. 结果后有可 dismiss 的升级引导；分享摘要非空（有内容时）。  
7. 会员页价值栈诚实（无假分）；试用优先 + 年付锚定可用。  

### C. 产品体验（Wave 4）

8. 八字/解梦/星座：共享 LoadingRitual + 长等待文案；结果可扫读 + pull-quote 路径。  
9. 解梦可一键示例填入（不自动提交）；星座深度默认可折叠。  

### D. 验收（Wave 5）

10. tsc 0；相关 vitest 过；PROGRESS 齐；手测路径可述。  

---

## 三、非目标

| 不做 | 原因 |
|------|------|
| 主页第 6 套皮 / 重做 variant registry | HOME 已 ship |
| 塔罗仪式全量回改 T00–T25 | TAROT 已 ship |
| 合盘/社区大改 | 默认 skip |
| 假评分、假 live、暗扣费、无法关闭硬墙 | 铁律 |
| 删除 Cosmic 戏剧/逆行钩子 | 用户要求增强，禁止「净化删除」 |
| 全站 A/B 实验平台 / 默认 push | 另议 |
| 改命理算法 / 换 LLM 供应商 | 非本 scope |

---

## 四、转化脊柱（Wave 3–4 共用契约）

```
Home 免费塔罗/Career
  → 一次完整可读结果（Aha）
  → SoftPaywall / 额度条（Desire，可 dismiss）
  → 注册 + 14 天试用（Trial，风险对冲文案）
  → 会员深度/无限（Pay，年付锚定 + 真权益）
  → 分享回链 + 日运回访（Loop）
  → Home CosmicAlert 戏剧钩子持续拉新会话（有 CTA，非假证明）
```

---

## 五、每轮 SOP

见 §〇。卡住 >40 分钟：PROGRESS 记障碍，标 blocked，禁止硬推铁律。

**Commit 前缀统一**：`fortune-master:`  

**Skills 建议（非强制）**

| 波次 | 可用 skill |
|------|------------|
| 调研 | agent-reach |
| 文案 | human-chat-eq |
| UI | design-taste-frontend / emil-design-eng / web-design-guidelines |
| 验收 | check-work |
| 可选外装 | coreyhaines31/marketingskills（仅 CRO/copy，禁黑帽） |

---

## 六、Backlog（总表）

状态：`[ ]` · `[~]` · `[x]` · `[ship]` · `[skip]`

---

### Wave 0 — 测绘

#### G00 — 建立 PROGRESS + 全仓测绘
- **DoD**：创建 `PROGRESS_MASTER.md`；`rg` 记录：`4.8/5`、`CosmicAlert`/`水星逆行`、`LiveActivity`、`SoftPaywall` 挂载点、安全头有无、LoadingRitual/reportScan 现状；列出当前 cosmicEvents 条数与 CTA href。  
- **Scope**：只读 + 文档。  
- **Verify**：PROGRESS 有表。

---

### Wave 1 — 假证明删除 + 戏剧钩子增强（原 P1 + 修订后的 Alert）

#### G10 — 清除静态 4.8/5
- **DoD**：Membership 及全 client 用户可见 `4.8/5` 删除/替换为真实信任语（Stripe / 试用 / 公益）；禁止换假分。  
- **Verify**：`rg '4\.8/5'` 无用户可见命中；`/membership` 目测。

#### G11 — 信任三页一致 + 三件套不撒谎
- **DoD**：Home Trust / Login / Membership：无假 live、无假分；Stripe·加密·10% 公益表述不自相矛盾；14 天不承诺永久无限。  
- **Verify**：三页勾选 PROGRESS。

#### G12 — CosmicAlert **戏剧增强**（禁止删除逆行等钩子）
- **DoD**：  
  1. **保留并扩写** `cosmicEvents`（含水星逆行、满月、关系宫、财运窗、事业土星等）；中英都更抓人。  
  2. 每条必须：`urgency` + 清晰 CTA + **真实 href**（`/tarot` `/tarot?type=career` `/horoscope` `/bazi` `/dream` `/compatibility` 等）。  
  3. **视觉增强**：high 更醒目（边框/脉冲/图标）；倒计时可保留或强化「今日窗口」。  
  4. 可选：按 weekday / 时辰微调文案池（仍可确定性按 dayOfYear）。  
  5. **禁止**：医疗恐吓、诅咒「不付费就倒霉」；禁止 CTA 死链。  
  6. `weak` 模式：可做「略收」版（短标题），但 **不得删掉戏剧库**；`classic`/`ritual` 用满配戏剧。  
- **Scope Cap**：主要 `CosmicAlert.tsx` + 主页挂载；不大拆五皮。  
- **Verify**：本地首页可见有戏 Alert；至少 5 条事件 CTA 可点进对应产品；逆行类文案仍存在且更好。

#### G13 — Alert × 五皮强度 + dismiss
- **DoD**：  
  - `ritual` / `classic`：show alert + 满配戏剧（legacy 或 full）。  
  - `focus` / `plans`：可 show 或弱化版，但若 show 仍用戏剧库（非删库）。  
  - `minimal`：可关 alert（产品选择），关不等于从代码删除事件库。  
  - dismiss 当日有效；关闭后不立刻用另一恐吓条洗屏（可等次日或下一次会话）。  
- **Verify**：`?variant=ritual` 钩子强；`minimal` 行为符合 flags。

---

### Wave 2 — 工程安全（原线上 P3–P4）

#### G20 — 生产安全响应头
- **DoD**：prod/`start`：`X-Frame-Options`（DENY 或 SAMEORIGIN）+ nosniff + CSP 或 CSP-Report-Only；dev 可放宽 CSP 但文档写明。  
- **Verify**：build+start 后 curl -sI 见 XFO。

#### G21 — 安全头测试
- **DoD**：`server/security-headers.test.ts`（或等价）断言关键 header。  
- **Verify**：vitest PASS。

#### G22 — 错误 /trpc 不返回 SPA HTML
- **DoD**：`/trpc`、`/trpc/auth.me` → 404 或 JSON（可含 hint 用 `/api/trpc`）；`/api/trpc/*` 不变；`/tarot` 仍 HTML。  
- **Verify**：curl/supertest。

---

### Wave 3 — 伦理转化脊柱

#### G30 — SoftPaywall / Paywall 挂载审计表
- **DoD**：PROGRESS 表：路径 × 触发 × 文案 × 是否诚实。  
- **Scope**：只读。

#### G31 — 「完全免费」误导清扫
- **DoD**：需额度产品不得写「完全免费」；与 SoftPaywall/Usage 一致。  
- **Verify**：rg + 抽查。

#### G32 — SoftPaywall 文案契约
- **DoD**：统一增量利益 +「继续免费额度」次按钮；可 dismiss；中英。  
- **Verify**：塔罗/八字/解梦至少 2 处同源或共享常量。

#### G33 — 结果页升级时刻（优先塔罗，模式可复用）
- **DoD**：结果出齐后、分享附近：可 dismiss 升级条；链试用/会员；**不**在 loading 中硬墙。  
- **Verify**：本地 `/tarot` 完整一次。

#### G34 — 14 天文案单一事实源
- **DoD**：Login / Membership / SoftPaywall / Home micro 天数与语义一致（常量或 locales）。  
- **Verify**：改一处不导致矛盾（文档说明 SSOT 位置）。

#### G35 — 会员价值栈（无假分之后）
- **DoD**：试用优先 CTA、年付锚定、权益对照、公益 10%；无 4.8。  
- **Verify**：`/membership` 目测。

#### G36 — 额度可见 + 分享回链
- **DoD**：UsageBadge/等价「剩余/试用中」可读；ShareResultCard 摘要非空（有内容时）+ 可回站试玩语义。  
- **Verify**：结构或手测。

---

### Wave 4 — 产品仪式 UX（八字 → 解梦 → 星座）

#### G40 — 共享：Loading / longWait / pull-quote 工具
- **DoD**：  
  - `longWaitHint` 覆盖 bazi/dream/horoscope 分类型中英阶段。  
  - `extractPullQuote` / `shareSummaryFromReading` 在可测模块（如 `reportScan`）；禁止第三套 loading。  
  - LoadingRitual `aria-busy`。  
- **Verify**：unit 测 quote + wait hint。  
- **注**：若本地已实现可验收后标 [x] 并补测，禁止无验收跳过。

#### G41 — 八字：加载阶段 + 表单校验 + 错误保留输入
- **DoD**：loading 可见阶段感；空提交有中英错误；失败回表单不丢出生信息。  
- **Verify**：`/bazi`。

#### G42 — 八字：结果扫读 + 分享摘要
- **DoD**：BaZiReport 主题句（pull-quote）+ data-report-scan；Share 用真实摘要。  
- **Verify**：结构测或 data 钩子。

#### G43 — 解梦：示例填入 + 加载 + 结果扫读
- **DoD**：一键示例不自动提交；LoadingRitual；DreamReport 金句 + 分享摘要。  
- **Verify**：`/dream`。

#### G44 — 星座：首屏一览 + 深度折叠 + 试用钩
- **DoD**：综合/寄语首屏突出；深度默认折叠可展开；游客 14 天试用文案诚实；轻 CrossSell 可保留。  
- **Verify**：`/horoscope`。

#### G45 — 八字/解梦轻量 cross-sell（可选）
- **DoD**：结果底最多 1 个 CrossSell；不硬塞。无则 [skip]。  

---

### Wave 5 — 总验收

#### G50 — 回归 vitest + tsc
- **DoD**：  
  - `pnpm exec tsc --noEmit` 0  
  - 本 goal 相关测试 + career-entry +（若有）security-headers / report-scan / product-ux-structure  
- **Verify**：命令摘要进 PROGRESS。

#### G51 — 字符串闸 + Baseline smoke
- **DoD**：  
  - rg 闸：无用户可见 `4.8/5` / `4.8/5 Rating`  
  - CosmicAlert：**仍有**戏剧钩子（如逆行/满月类至少一类存在）；每条 href 合法  
  - asset 404 非 HTML（有测则跑）  
  - SoftPaywall 仍存在；career 深链仍在；homeVariant 键仍在  
- **Verify**：PROGRESS 勾选。

#### G52 — 手测剧本 + 文档
- **DoD**：`LOCAL_PREVIEW.md` 或 PROGRESS 写入：  
  1) 游客塔罗 → 结果 → soft → 登录 14 天  
  2) membership 无 4.8  
  3) 主页 Alert 有戏（可含逆行）+ CTA 可进产品  
  4) bazi/dream/horoscope 各一次  

- **Verify**：文档存在。

#### G53 — `[skip]` 除非用户点名：合盘对齐 / 严格 CSP 零 unsafe-inline / 埋点  
#### G54 — `[skip]` 除非用户点名：push + 线上 fortunesite.one 再审计  

---

## 七、用户总检清单（一次）

| # | 操作 | 期望 |
|---|------|------|
| 1 | `/membership` | 无 4.8；有试用/年付真权益 |
| 2 | `/` 尤其 ritual/classic | Alert **有戏**（可含逆行等）+ CTA 能进产品 |
| 3 | curl 生产头 / start | 有 X-Frame-Options |
| 4 | curl `/trpc/auth.me` | 非 SPA HTML |
| 5 | 游客完整塔罗 | 有结果 → soft/额度可懂 → 可去注册 14 天 |
| 6 | `/bazi` `/dream` `/horoscope` | 能等、能扫、能分享（有内容时） |
| 7 | `/tarot?type=career` | 仍进事业路径 |

总检 OK → 用户说「可以 push」→ 用户 Manus 发布。

---

## 八、关键路径

| 区域 | 路径 |
|------|------|
| 会员 4.8 | `client/src/pages/Membership.tsx` |
| Alert | `client/src/components/CosmicAlert.tsx`、Home/HomeSections |
| 安全头 / 路由 | `server/_core/index.ts`、vite 静态中间件 |
| 转化 | SoftPaywall、PaywallCTA、UsageBadge、Login、Membership |
| 体验 | Bazi/Dream/Horoscope + *Report、LoadingRitual、reportScan、loadingWaitHint |
| 进度 | `PROGRESS_MASTER.md`（本 goal 唯一进度文件） |

---

## 九、波次完成门闩（DoD 门）

| 离开本波前必须 | |
|----------------|--|
| Wave 1 → 2 | G10–G13 全 [x/skip]；rg 无假 4.8；Alert 戏剧增强可述（逆行类仍在） |
| Wave 2 → 3 | G20–G22 [x/skip]；XFO 与 /trpc 行为可述 |
| Wave 3 → 4 | G30–G36 中转化核心（至少 G31–G35）[x/skip] |
| Wave 4 → 5 | G40–G44 [x/skip]（G45 可选） |
| Goal 完成 | G50–G52 [x] + 用户总检 |

---

## 十、执行顺序速览

```
G00
G10 → G11 → G12 → G13
G20 → G21 → G22
G30 → G31 → G32 → G33 → G34 → G35 → G36
G40 → G41 → G42 → G43 → G44 → (G45)
G50 → G51 → G52
```

---

---

## 十一、覆盖对照（确认「全都」在）

| 来源需求 | G 编号 |
|----------|--------|
| 会员假 4.8/5 | G10 |
| 真信任三件套 / 无假 live | G11 |
| Cosmic 戏剧/逆行 **增强**（不删） | G12–G13 |
| XFO / CSP | G20–G21 |
| `/trpc` 非 SPA HTML | G22 |
| SoftPaywall / 免费口径 / 结果升级 / 14 天 / 会员栈 / 额度分享 | G30–G36 |
| Loading/quote + 八字 + 解梦 + 星座 UX | G40–G44 |
| 总验收 | G50–G52 |
| 主页五皮 / 塔罗大礼包 | **不重做**（Baseline 保护） |

---

## 十二、PROGRESS 模板（G00 创建时用）

```markdown
# PROGRESS_MASTER

| 日期 | Gid | 结果 | 本地URL | 遗留 |
|------|-----|------|---------|------|
| | G00 | | | |

## 测绘摘要
- 4.8 位置:
- CosmicAlert 事件数 / CTA:
- SoftPaywall 挂载:
- 安全头现状:
```

---

*End of GROK_GOAL_MASTER v1.2 — 用户自执行 · 假证明删 / 戏剧增强 → 转化 → 体验 → 验收*
