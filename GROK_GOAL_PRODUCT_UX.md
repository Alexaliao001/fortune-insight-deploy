# GROK /goal — 产品页体验：八字 → 解梦 → 星座

> **⚠️ 已并入总编排**  
> 优先执行：**`GROK_GOAL_MASTER.md`**（Wave 4 = 本文件内容）。  
> 单独跑本文件仅在信任+转化已完成后「只补体验」时使用。

> **用途**：在 Grok Build 里执行  
> `/goal 按 GROK_GOAL_PRODUCT_UX.md 做产品页体验`  
> 或把下方「§〇 粘贴版启动指令」整段贴进对话，作为**唯一任务源**。  
>  
> **仓库路径（权威）**：本文件所在目录 = fortune-insight 工作副本  
> 常见：`/tmp/fortune-insight-`  
> 线上：`fortunesite.one`（**默认不 push、不部署**；用户明文「可以 push」才 push）

**版本**

| 版本 | 说明 |
|------|------|
| **1.0** | 初稿：波次闸 共享地基 → 八字 → 解梦 → 星座；禁止 5 套皮肤分叉 |

**与兄弟 goal**

| 文件 | 范围 | 关系 |
|------|------|------|
| `GROK_GOAL.md` | 工程债 F0–F2 | **不重做**已 ship 工程项；可承接其 F2-2 精神 |
| `GROK_GOAL_TAROT.md` | 塔罗仪式 | **禁止大改** Tarot 流程；只**复用**其报告/分享/loading 模式 |
| `GROK_GOAL_HOME.md` | 主页 5 皮 | **禁止**给产品页做 5 套布局；可选读 `data-home-variant` 但不改版式 |
| **`GROK_GOAL_PRODUCT_UX.md`（本文件）** | 八字/解梦/星座体验 | 产品页冲突时 **以本文件为准** |

**Baseline（禁止破坏）**

- asset 404 / auth.me 无 passwordHash / 无 Manus 登录 / 试用 14 天  
- `/tarot?type=career` 仍可用；主页多版本与 `fortune.homeVariant` 仍可用  
- 不引入假 LiveActivity / 静态 4.8  
- 不把「完全免费」盖在需额度的八字上  
- SoftPaywall / 额度逻辑不静默删掉  

---

## 〇、粘贴版启动指令（复制从这里到 §〇 结束）

```
你是 Fortune Insight 产品页体验（八字→解梦→星座）的 /goal 工程代理。
唯一任务源：工作区 GROK_GOAL_PRODUCT_UX.md（v1.0+；若无则用本消息全文）。

【产品铁律 — 违反 = 本轮作废】
1. 优化「等待体验 + 结果可读 + 跨页一致」，不是 5 套外观、不是换框架。
2. 顺序固定：Wave 0 共享 → Wave 1 八字(B*) → Wave 2 解梦(D*) → Wave 3 星座(S*)。
   禁止跳波；同波内按编号升序，每轮只做 1 个编号。
3. 复用优先：LoadingRitual / longWaitHint / ShareResultCard / SoftPaywall / 塔罗报告分段思路。
   禁止平行造第三套 loading 或第三套分享卡。
4. 不改主页五皮业务；不把 homeVariant 变成产品页 5 布局。
5. 禁止 git push / 部署，除非用户当轮明文「可以 push」。
6. 全仓 1 写者；最小 diff；不提交 .env / 密钥。
7. 中英双语；prefers-reduced-motion 减弱动效。
8. 禁止破坏 Baseline（asset404 / auth / 无 Manus / 14 天试用 / career / 假证明 / 额度）。

【波次闸】
- 上一波全部 [x] 或 [skip] 后才能开下一波。
- 同波严格按 B/D/S 编号升序。

【本地预览】
- 改前端后：pnpm dev；汇报 URL + 路径（/bazi /dream /horoscope）+ 操作 + 期望。
- [x] = 代理自测（tsc + 相关 vitest + 本地关键路径可述）。

【SOP】
0. 读 GROK_GOAL_PRODUCT_UX.md 全文 + 本节相关页面/组件 + §八
1. 读/建 PROGRESS_PRODUCT_UX.md
2. 取 §六 最高优先级未完成 1 项
3. 实现（遵守 Scope Cap）
4. 验证：tsc；相关 vitest；pnpm dev 对应该产品路径
5. PROGRESS_PRODUCT_UX.md 一行
6. 本地 commit：fortune-ux: <id> <简述>
7. 汇报用户；等继续或「可以 push」

【本轮请开始】做 §六 第一项未完成项（通常是 U00）。
```

---

## 一、使命（一句话）

在**不 push** 前提下，把 **八字 → 解梦 → 星座** 的「等得住、看得懂、可分享」拉到接近塔罗结果页水准；**共享组件先收口**，再按产品顺序打磨，禁止五套皮肤与无关大重构。

---

## 二、非目标

| 不做 | 原因 |
|------|------|
| 产品页 5 套 homeVariant 布局 | 维护与品牌成本 |
| 重做塔罗 T00–T25 / 主页 H00–H13 | 兄弟 goal 已 ship |
| 合盘 / 社区 / 会员大改 | 本 goal 排期外（可另开） |
| 改命理算法正确性/换 LLM 供应商 | 体验 goal，非算法 goal |
| 默认 push / Manus 部署 | 铁律 |
| 假社交证明、恐吓式运势文案升级 | 与主站理性定位冲突 |

---

## 三、体验原则（全波共用）

1. **等待可预期**：>3s 必有阶段文案；长等待用 `longWaitHint` / LoadingRitual 增强，不白屏。  
2. **结果可扫读**：3 秒内抓住主题；分段标题；可选「金句/pull-quote」；避免整墙 Markdown 无层次。  
3. **分享可截图**：有结果则尽量接 `ShareResultCard`（或等价），中英 ok。  
4. **额度诚实**：免费/试用/会员边界与 SoftPaywall 一致，不谎称全免费。  
5. **复用塔罗模式**：结构对齐，不复制粘贴整页 Tarot.tsx。  
6. **a11y**：焦点、`aria-busy`（loading 时）、reduced-motion。  

---

## 四、边界（铁律）

见 §〇。额外：

- 八字排盘/API 契约不无故破坏；若改 loading 仅 UI/文案层优先。  
- 星座日运缓存仍按语言隔离（F0-6 已做，禁止回退）。  
- Commit 前缀：`fortune-ux:`  

---

## 五、每轮 SOP

见 §〇。卡住 >40 分钟：PROGRESS 记障碍，标 blocked，禁止硬推铁律。

---

## 六、Backlog

状态：`[ ]` · `[~]` · `[x]` · `[ship]` · `[skip]`

---

### Wave 0 — 共享地基（必须先做）

#### U00 — 基线盘点与 PROGRESS
- **DoD**：创建 `PROGRESS_PRODUCT_UX.md`；用 10–20 行记录当前：
  - `/bazi` `/dream` `/horoscope` 是否已用 LoadingRitual、ShareResultCard、报告组件名
  - 最长等待体感（代码路径：mutation/query）
  - 与塔罗结果页差距 3 条 bullet
- **Scope Cap**：只读 + 文档，不改业务 UI。
- **Verify**：文件存在且路径写对。

#### U01 — LoadingRitual / longWaitHint 能力对齐
- **DoD**：
  - 确认 `LoadingRitual` 对 `bazi|dream|horoscope` 均有合理文案阶段（中英）
  - 长等待 hint（`longWaitHint`）在八字路径**必定**可达（若仅 tarot 用则扩展）
  - `prefers-reduced-motion` 时减弱循环动画（若已有则补测）
- **Scope Cap**：不改各页业务逻辑；可小改 LoadingRitual / loadingWaitHint。
- **Verify**：unit 或结构测试：bazi/dream/horoscope type 有文案 key；本地切 reduced-motion 不炸。

#### U02 — 报告扫读共享约定（轻量）
- **DoD**：新增或扩展一个**小**工具模块（如 `client/src/lib/reportScan.ts` 或复用 `tarotReportFormat` 的通用化）：
  - `extractPullQuote(text, maxLen)` 可被非塔罗复用（若已在 tarot 模块，导出通用函数，避免循环依赖）
  - 文档注释：结果页应有「主题句 + 分段」
- **Scope Cap**：不重写三个 Report 组件；只抽工具 + 1 个调用点试点可放到 B 波。
- **Verify**：vitest 对 extractPullQuote 通用路径 2–3 case。

---

### Wave 1 — 八字（Bazi）优先

#### B00 — 八字加载：阶段感 + 不焦虑
- **DoD**：
  - 提交排盘/分析后：LoadingRitual 全程可见；>8–12s 出现第二阶段文案（「正在细排…」类，中英）
  - 错误态：可重试，不丢已填出生信息（若当前会丢则修）
  - `aria-busy` 或等价可述
- **Scope Cap**：主要 `Bazi.tsx` + LoadingRitual 配置；不改 bazi-engine 算法。
- **Verify**：本地 `/bazi` 走一次（mock 或真 API）；长等待文案可述；tsc。

#### B01 — 八字结果扫读结构
- **DoD**：
  - `BaZiReport`（或页内结果区）：清晰 H2/小节；日主/格局/建议等分层（按现有字段，不虚构新命理字段）
  - 顶部 1 句 pull-quote（用 U02 工具）
  - 移动端首屏可见主题句
- **Scope Cap**：展示层；不新增付费墙绕过。
- **Verify**：有结果 fixture 或结构测试（class/data 属性/标题存在）。

#### B02 — 八字分享与交叉转化
- **DoD**：
  - 结果区 `ShareResultCard` 文案含非空摘要（pull-quote 优先）
  - 轻量 cross-sell：塔罗事业/合盘等（若已有 CrossSell 则复用，禁止硬塞广告墙）
- **Scope Cap**：1 个分享 + 最多 1 个 cross-sell 块。
- **Verify**：本地结果页可见分享控件。

#### B03 — 八字输入区体验（轻）
- **DoD**：出生信息表单：标签清晰、校验错误中英、主 CTA 固定可点（移动不躲到键盘下——尽量）
- **Scope Cap**：不重做日期控件库。
- **Verify**：空提交有错误提示。

---

### Wave 2 — 解梦（Dream）

#### D00 — 解梦输入仪式（轻）
- **DoD**：
  - 占位符/示例梦境（中英各 1）可一键填入（不自动提交）
  - 提交后过渡到 LoadingRitual，避免「点了没反应」
- **Scope Cap**：`Dream.tsx` 输入区；不改梦境符号库算法。
- **Verify**：本地 `/dream` 点示例 → 输入框有字 → 可提交。

#### D01 — 解梦加载与长文等待
- **DoD**：与 B00 同级：阶段文案 + 长等待 hint；失败可重试并保留正文
- **Scope Cap**：UI/状态；不改 dream router 模型选型。
- **Verify**：loading 路径可述。

#### D02 — 解梦结果扫读 + 金句
- **DoD**：
  - `DreamReport`：分段（主题 / 象征 / 建议等——按现有数据结构映射，不编造字段）
  - pull-quote + ShareResultCard 摘要非空
- **Scope Cap**：展示层。
- **Verify**：结构测试或 data 钩子。

#### D03 — 解梦日记/历史入口可读（若已有）
- **DoD**：若页内已有 journal/历史：空态文案中英；有数据时列表可读日期+一句摘要
- **Scope Cap**：无 journal 则 `[skip]` 并在 PROGRESS 注明。
- **Verify**：空态或列表二选一可述。

---

### Wave 3 — 星座（Horoscope）

#### S00 — 今日运势首屏「一屏有用」
- **DoD**：
  - 选星座后：今日主题/总分或等价字段在首屏突出（按 API 已有字段）
  - 加载用 LoadingRitual；刷新按钮不造成布局抖动失控
- **Scope Cap**：`Horoscope.tsx` + `HoroscopeReport`；不改缓存 key 语义（语言隔离保留）。
- **Verify**：本地 `/horoscope` 选 sign → 有首屏要点。

#### S01 — 深度分析折叠与扫读
- **DoD**：
  - deep 内容默认折叠或分页签，避免首屏墙
  - 展开后分段标题；pull-quote 可选
- **Scope Cap**：展示；不强制每日重生成 LLM。
- **Verify**：首屏不出现超长无结构墙（可测量折叠存在）。

#### S02 — 星座分享 + 回访钩子
- **DoD**：
  - ShareResultCard 或等价「今日一句」
  - 轻文案：明日再来 / 注册领试用（链到 `/login` 或 `/membership`，与主站 14 天一致，不说谎）
- **Scope Cap**：1 分享 + 1 钩子。
- **Verify**：未登录可见试用相关一句。

#### S03 — 星座 × 塔罗/八字交叉（轻）
- **DoD**：结果底 1 个 CrossSell（如「用塔罗问今日抉择」）
- **Scope Cap**：单卡。
- **Verify**：链接可达。

---

### Wave 4 — 收口（全产品）

#### U10 — 回归与冒烟
- **DoD**：
  - `pnpm exec tsc --noEmit` 0
  - 相关 vitest（本 goal 新增 + career-entry + 既有 report 类若有）
  - `scripts/local_smoke.sh` 若可跑则跑；否则手测 `/bazi` `/dream` `/horoscope` 记录 PROGRESS
- **Verify**：日志或 PROGRESS 粘贴命令结果摘要。

#### U11 — 文档
- **DoD**：更新 `PROGRESS_PRODUCT_UX.md` 总结；可选 `LOCAL_PREVIEW.md` 增加三页「测什么」
- **Verify**：文档与代码一致。

#### U12 — `[skip]` 除非用户点名：合盘体验对齐  
#### U13 — `[skip]` 除非用户点名：会员页文案与主页试用完全统一  

---

## 七、用户总检（一次）

1. `/bazi`：填信息 → 有阶段 loading → 结果能 3 秒抓住要点 → 可分享。  
2. `/dream`：示例输入 → loading → 分段结果 → 可分享。  
3. `/horoscope`：选座 → 首屏有今日要点 → 深度不炸首屏 → 分享/试用钩子不谎。  
4. 主页五皮与塔罗 career 深链仍正常。  
5. 总检 OK → 用户说「可以 push」才允许 push。  

---

## 八、关键路径

| 路径 | 用途 |
|------|------|
| `client/src/pages/Bazi.tsx` | 八字页 |
| `client/src/components/BaZiReport.tsx` | 八字报告 |
| `client/src/pages/Dream.tsx` | 解梦页 |
| `client/src/components/DreamReport.tsx` | 解梦报告 |
| `client/src/pages/Horoscope.tsx` | 星座页 |
| `client/src/components/HoroscopeReport.tsx` | 星座报告 |
| `client/src/components/LoadingRitual.tsx` | 加载仪式 |
| `client/src/lib/loadingWaitHint.ts` | 长等待文案 |
| `client/src/components/ShareResultCard.tsx` | 分享卡 |
| `client/src/lib/tarotReportFormat.tsx` | pull-quote（可通用化） |
| `client/src/components/CrossSellCard.tsx` | 交叉转化 |
| `server/routers/bazi.ts` / `dream.ts` / `horoscope.ts` | API（少动） |
| `PROGRESS_PRODUCT_UX.md` | 进度（新建） |

---

## 九、Commit 约定

- `fortune-ux: U00 baseline inventory`  
- `fortune-ux: B00 bazi loading stages`  
- …  
- 禁止 push 除非用户授权。

---

## 十、完成定义（整个 goal）

- [ ] Wave 0–3 各项 `[x]` 或经用户 `[skip]`  
- [ ] U10–U11 `[x]`  
- [ ] 用户总检通过  
- [ ] （可选）授权后 push  

---

## 十一、给用户的执行顺序速览

```
U00 → U01 → U02
  → B00 → B01 → B02 → B03
  → D00 → D01 → D02 → D03
  → S00 → S01 → S02 → S03
  → U10 → U11
```

*End of GROK_GOAL_PRODUCT_UX v1.0*
