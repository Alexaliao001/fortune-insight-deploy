# GROK /goal — 主页多版本（外观包）+ 样式选择器

> **用途**：在 Grok Build 里执行  
> `/goal 按 GROK_GOAL_HOME.md 做主页多版本`  
> 或把下方「§〇 粘贴版启动指令」整段贴进对话，作为**唯一任务源**。  
>  
> **仓库路径（权威）**：本文件所在目录 = fortune-insight 工作副本  
> 常见：`/tmp/fortune-insight-`  
> 配套：`HOME_WIREFRAME.md` · `HOME_WIREFRAME_PREVIEWS.html`  
> 线上：`https://fortunite.one` / `fortunesite.one`（**默认不 push、不部署**）

**版本**

| 版本 | 说明 |
|------|------|
| **1.0** | 初稿：5 外观包 + 客户可选样式器；IA 统一；禁 5 套转化漏斗分叉 |

**与兄弟 goal**

| 文件 | 范围 | 关系 |
|------|------|------|
| `GROK_GOAL.md` | 工程债 / 事业入口等 | 已 ship；本 goal **不重做** F0–F2 工程项 |
| `GROK_GOAL_TAROT.md` | 塔罗仪式/牌面 | **不改** Tarot 流程；主页链到 `/tarot` 即可 |
| **`GROK_GOAL_HOME.md`（本文件）** | 主页多版本 + 选择器 | 主页路径冲突时 **以本文件为准** |

**Baseline（禁止破坏）**

- 缺失 `/assets/*` → 404 非 SPA HTML  
- `auth.me` 无 `passwordHash`  
- Login 无 Manus  
- 注册试用默认 **14 天**  
- `/tarot?type=career` 事业入口仍可用  
- 不引入假 LiveActivity / 静态 4.8 评分  
- 不把「完全免费」盖在需额度的八字上  

---

## 〇、粘贴版启动指令（复制从这里到 §〇 结束）

```
你是 Fortune Insight 主页多版本的 /goal 工程代理。
唯一任务源：工作区 GROK_GOAL_HOME.md（v1.0+；若无则用本消息全文）。
配套只读：HOME_WIREFRAME.md、HOME_WIREFRAME_PREVIEWS.html（若存在）。

【产品铁律 — 违反 = 本轮作废】
1. 做的是「5 个外观包 HomeVariant」，不是 5 套互斥转化漏斗。
   - 全包共享同一套转化 IA：主 CTA=免费塔罗、次 CTA 与试用 14 天文案、诚实 badge、Trust 三真、Career 高亮、无假 live/4.8。
   - 版本差异只允许：版式密度、Hero 是否双栏预览、Alert 是否显示、次 CTA 链、社区块是否显示、视觉装饰强度。
2. 默认版本 = focus（推荐包 2：1A 2A 3B 4A）。新访客未选手动选择时必须看到 focus。
3. 客户可选手动覆盖；偏好写入 localStorage key: fortune.homeVariant；合法值仅五枚枚举。
4. 禁止复制粘贴 5 份完整 Home.tsx。必须：variant registry + 共享 sections + 每包 layout/theme props。
5. 样式选择器：不挡主 CTA；位置固定可发现（建议桌面右下 / 移动底栏上方或 Hero 底小按钮「外观」）；可关面板；尊重 a11y。
6. 禁止 git push / 部署；用户明文「可以 push」前只本地 commit。
7. 每轮 backlog 只做 1 个 H 编号；全仓 1 写者；最小 diff。
8. 不提交 .env / 密钥。
9. 中英双语；prefers-reduced-motion 时减弱装饰动画。
10. 禁止破坏 Baseline（asset404 / auth / 无 Manus / 14 天试用 / career / 无假社交证明）。

【波次闸】
- 必须上一波全部 [x] 或 [skip] 后，才能开始下一波。
- 同波内严格按 H 编号升序。

【本地预览】
- 改前端后：pnpm dev；汇报 URL + 如何切换 5 版 + 期望。
- [x] = 代理自测通过（tsc + 相关测试 + 本地切换 5 版可述）。

【SOP】
0. 读 GROK_GOAL_HOME.md 全文 + client/src/pages/Home.tsx + 相关组件 + §八
1. 读/建 PROGRESS_HOME.md
2. 取 §六 最高优先级未完成 1 项
3. 实现（遵守该项 Scope Cap）
4. 验证：tsc；相关 vitest（若本项要求）；pnpm dev 五版切换
5. PROGRESS_HOME.md 一行：日期 | id | 结果 | 本地URL | 遗留
6. 本地 commit：fortune-home: <id> <简述>
7. 汇报用户；等继续或「可以 push」

【本轮请开始】做 §六 第一项未完成项（通常是 H00）。
```

---

## 一、使命（一句话）

在**不 push** 的前提下，把主页改成 **「统一转化骨架 + 5 个可切换外观包」**，并提供客户可用的 **样式选择器**；默认 **focus**，偏好可持久化；工程上可维护，禁止五套分叉屎山。

---

## 二、对「客户选 5 版」思路的产品裁定（已拍板）

### 2.1 用户原想法

> 做 5 个版本 + 样式选择按钮，客户选自己喜欢的。

### 2.2 裁定：**方向 OK，必须加约束后做**

| 维度 | 裁定 |
|------|------|
| 客户可选外观 | ✅ 做 |
| 5 个完整互斥漏斗（不同主路径/不同价值主张） | ❌ 不做 |
| 默认统一转化 IA | ✅ 必须 |
| 工程：registry 而非 5×Home | ✅ 必须 |
| 第 5 包 = 现网「经典清理版」作对照 | ✅ 做 |
| 上线后立刻做服务端 A/B 分流 | ❌ 本 goal 不做（可记 P2 以后） |

**理由（给代理与人类对齐）**：

1. **转化科学**：主 CTA / 试用钩子若每版不同，无法解释数据，也难客服。  
2. **品牌**：5 套完全不同首页 = 5 个产品。外观可异，承诺与路径应同。  
3. **维护**：5 份 Home.tsx 会在第二次改文案时爆炸；registry 可活。  
4. **体验价值**：偏好（密/疏、仪式感/极简）真实存在；用外观包满足，不拿漏斗冒险。

### 2.3 五包定义（锁定）

| id | 名称（中） | Name (EN) | 对应 wireframe | 版式差异（仅此） |
|----|------------|-----------|----------------|------------------|
| `classic` | 经典 | Classic | 现网清理 | 接近现 Home 信息密度；无假 live/4.8；仍可有弱 Alert |
| `focus` | 专注 **默认** | Focus | 包2 `1A2A3B4A` | 双栏预览；无首屏 Alert；次 CTA→/login；社区单行 |
| `ritual` | 仪式 | Ritual | 包1 视觉加强 | 双栏；可有弱「今日主题」；装饰/分隔更强；转化 IA 同 focus |
| `plans` | 方案 | Plans | 包3 `1A2B3B4A` | 双栏；次 CTA→**/membership**；会员块更重；其余 IA 同 |
| `minimal` | 极简 | Minimal | 包4 `1B2A3B4B` | 预览独立节；无 Alert；主页无社区块（Footer 仍有） |

**所有包必须共享**：

- 主 CTA：免费塔罗 → `/tarot`（Auth 可按时段微调，但不得消失）  
- 试用 14 天至少 1 处可见（Hero micro 或会员块）  
- Trust：Stripe / 加密 / 10% 公益（无 4.8、无假 live）  
- Career 高亮 → `/tarot?type=career`  
- 服务 badge 诚实（可体验 vs 需额度）  
- 合盘无过期 NEW（可热门或无角标）  
- 证言标题中性（非「她们的」）

---

## 三、非目标

| 不做 | 原因 |
|------|------|
| 服务端实验平台 / 统计后台 | 另 goal |
| 改定价、Stripe、试用天数算法 | 已 14 天；非本范围 |
| 重做塔罗仪式 T00–T25 | 兄弟 goal |
| 暗黑/亮色整站 Theme 大重构 | 仅主页包 |
| 默认 push / Manus | 铁律 |
| 每包独立路由 `/home/v2` 对外 | 单一 `/` + 选择器即可；可用 `?variant=` 仅调试 |

---

## 四、边界（铁律）

1. 默认禁止 push / 部署。  
2. 每轮 1 个 H 项；单写者。  
3. 最小 diff；共享组件优先。  
4. `localStorage` 键名固定：`fortune.homeVariant`。  
5. URL `?variant=focus` 仅开发/调试覆盖，**不**作为分享永久源（可选实现：读一次后写 localStorage 并 strip query——H03）。  
6. 选择器文案中英齐全。  
7. 无障碍：按钮可键盘聚焦；面板 Esc 关闭；`aria-expanded`。  
8. 性能：切换包不整页重载；不预加载 5 套大图。  

---

## 五、每轮 SOP

见 §〇。卡住 >40 分钟：PROGRESS 记障碍，标 blocked，禁止硬推铁律。

### 5.1 子代理

| 情况 | 策略 |
|------|------|
| 结构拆分 | 主窗直做或 read-only 列文件 |
| 验收 | 主窗 `pnpm dev` 切换五版；勿 push |

---

## 六、Backlog

状态：`[ ]` · `[~]` · `[x]` · `[ship]` · `[skip]`

### Wave 0 — 契约与骨架

#### H00 — 枚举 / 类型 / 存储契约
- **DoD**：新增 `client/src/lib/homeVariant.ts`（或等价）导出：
  - `HomeVariantId = 'classic' | 'focus' | 'ritual' | 'plans' | 'minimal'`
  - `DEFAULT_HOME_VARIANT = 'focus'`
  - `parseHomeVariant(raw): HomeVariantId`
  - `readHomeVariant(): HomeVariantId` / `writeHomeVariant(id)`（localStorage）
  - 每包 `HomeVariantMeta`：`id, labelZh, labelEn, blurbZh, blurbEn`
- **Scope Cap**：不改 Home UI；可加 vitest 测 parse/默认。
- **Verify**：unit 测非法值回落 focus；合法五枚通过。

#### H01 — 共享 Section 抽取（不改观感）
- **DoD**：把现 `Home.tsx` 拆成可复用块（可同文件先抽函数组件）：  
  `HomeHero` / `HomeTrust` / `HomePreview` / `HomeCareer` / `HomeServices` / `HomeFeatures` / `HomeTestimonials` / `HomeMembership` / `HomeCommunity`  
  行为与现网**视觉可暂保持**；为 H02 准备 `variant` prop 接口。
- **Scope Cap**：禁止同时做五套样式；禁止删 career。
- **Verify**：`pnpm dev` 主页可开，主路径可点。

### Wave 1 — 统一转化 IA（全包地基）

#### H02 — 统一转化文案与去假证明
- **DoD**：
  - 移除/永不渲染：`LiveActivityIndicator` 假 feed、Trust「4.8/5」
  - DynamicStats：无真实数不装「4 功能」伪指标；口径「可体验」非「无需注册」互打试用
  - Hero/会员：14 天试用至少一处；主 CTA 塔罗；八字 badge 诚实
  - 证言 H2 中性；合盘去 NEW
  - Career 保留且易见
- **Scope Cap**：只做内容/IA，不做选择器。
- **Verify**：本地目测；grep 无 `4.8/5`、无 LiveActivity 挂载于 Home。

### Wave 2 — 五包布局差异

#### H03 — Variant 布局开关接线
- **DoD**：`Home` 根读取 `readHomeVariant()`；可选 `?variant=` 调试。  
  按包应用布局 flags（建议表驱动）：

  | flag | classic | focus | ritual | plans | minimal |
  |------|---------|-------|--------|-------|---------|
  | `heroPreviewDual` | false 或 true | true | true | true | false |
  | `showCosmicAlert` | true(弱文案) | false | true(弱) | false | false |
  | `secondaryCta` | login | login | login | membership | login |
  | `showCommunityBlock` | true | true | true | true | false |
  | `density` | comfortable | cozy | rich | cozy | compact |
  | `decorLevel` | mid | low | high | mid | low |

- **Scope Cap**：先让 flags 生效（即使三包看起来接近也行）；选择器 UI 留给 H04。
- **Verify**：控制台/临时 `?variant=` 切换，flags 行为可述。

#### H04 — 样式选择器 UI
- **DoD**：
  - 组件 `HomeVariantPicker`：打开面板列出 5 包（名+一句话+选中态）
  - 点击写入 localStorage 并立即切换，无需刷新
  - 默认 focus 高亮「推荐」
  - 不遮挡主 CTA（z-index/位置合理）
  - 中英；Esc/点击外部关闭
  - 仅主页挂载（不污染其它页）
- **Scope Cap**：不做用户账户云同步。
- **Verify**：清 storage → 默认 focus；选手动 → 刷新仍保留。

#### H05 — classic 包对齐「现网清理」
- **DoD**：`classic` 密度接近改前 Home，但已含 H02 清理；弱 Alert 可用。
- **Scope Cap**：不恢复假 live/4.8。
- **Verify**：`?variant=classic` 与 focus 可分辨。

#### H06 — focus 包（默认）完整
- **DoD**：对齐 HOME_WIREFRAME 包2：双栏预览（桌面）、无首屏 Alert、次 CTA→login、社区单行、试用优先会员块、结果预览 mock。
- **Verify**：默认进入即 focus 观感。

#### H07 — ritual 包
- **DoD**：在 focus IA 上提高 decor（divider/orb/弱今日主题）；不改 CTA 语义。
- **Verify**：与 focus 并排可辨「更仪式」。

#### H08 — plans 包
- **DoD**：次 CTA→`/membership`；会员块标题/双按钮与 Hero 呼应；仍有主 CTA 塔罗。
- **Verify**：点次 CTA 进会员页。

#### H09 — minimal 包
- **DoD**：预览独立节；无 Alert；无主页社区块；移动友好紧凑。
- **Verify**：无社区大段；Footer 仍可到社区。

### Wave 3 — 体验与验收加固

#### H10 — 登录态 CTA 矩阵
- **DoD**：游客 / 试用中 / 会员 的 Hero 主次按钮符合 wireframe 状态矩阵；各包共享同一矩阵，仅链目标随 `secondaryCta` 包配置微调。
- **Verify**：三种身份（或 mock）可述。

#### H11 — i18n 与 a11y 收口
- **DoD**：选择器与五包名/简介进 locales 或 meta；reduced-motion；选择器键盘可用。
- **Verify**：切 en 无中文硬编码漏网（选择器区域）。

#### H12 — 结构测试 / smoke
- **DoD**：vitest 或现有测试：`parseHomeVariant`；Home 相关 data 属性可选 `data-home-variant`；`scripts/local_smoke.sh` 若易加则加首页 200。
- **Verify**：CI 本地 `pnpm exec vitest run` 相关文件通过。

#### H13 — 文档与进度
- **DoD**：更新 `HOME_WIREFRAME.md` 增加「五包 + 选择器」一节；`PROGRESS_HOME.md` 齐；可选 `LOCAL_PREVIEW` 一节如何切换。
- **Verify**：文件存在且与实现一致。

### 可选（本 goal 默认 [skip] 除非用户点名）

#### H14 — [skip] 匿名事件打点（variant_selected）
#### H15 — [skip] 云端同步偏好到 user profile

---

## 七、验收（用户总检一次）

用户本地打开 dev URL 后：

1. 无 storage 时首页是 **focus**，首屏有主 CTA，无假 live/4.8。  
2. 打开样式选择器，可切 **5** 个版本，观感可辨。  
3. 刷新后仍是上次选择。  
4. 任意版本：能进 `/tarot`、career 深链、试用/登录或会员入口符合该包。  
5. 移动宽度下选择器不挡主按钮。  

总检 OK → 用户说「可以 push」才允许 push。

---

## 八、关键路径

| 路径 | 用途 |
|------|------|
| `client/src/pages/Home.tsx` | 主页组装 |
| `client/src/lib/homeVariant.ts` | 枚举/存储（新建） |
| `client/src/components/HomeVariantPicker.tsx` | 选择器（新建） |
| `client/src/components/home/*` | 可选 section 目录 |
| `client/src/components/PersonalizedHeroCTA.tsx` | CTA 矩阵 |
| `client/src/components/CosmicAlert.tsx` | 弱文案/显隐 |
| `client/src/locales/zh.ts` / `en.ts` | 文案 |
| `HOME_WIREFRAME.md` | 文案与 IA |
| `HOME_WIREFRAME_PREVIEWS.html` | 静态对照（只读参考） |
| `PROGRESS_HOME.md` | 进度（新建） |

---

## 九、Commit 约定

- `fortune-home: H00 variant contract`  
- `fortune-home: H04 variant picker`  
- …  
- 禁止 `git push` 除非用户当轮明文授权。

---

## 十、完成定义（整个 goal）

- [ ] H00–H13 均为 `[x]` 或经用户 `[skip]`  
- [ ] 默认 focus；五包可切可持久化  
- [ ] 统一转化 IA + 无假社交证明  
- [ ] 本地用户总检通过  
- [ ] （可选）用户授权后 push  

---

*End of GROK_GOAL_HOME v1.0*
