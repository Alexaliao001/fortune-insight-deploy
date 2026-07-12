# GROK /goal — 线上明显问题收口（信任 / 文案 / 安全）

> **⚠️ 已并入总编排**  
> 优先执行：**`GROK_GOAL_MASTER.md`**（Wave 1–2 = 本文件内容）。  
> 单独跑本文件仅在「只修信任、不做转化/体验」时使用。

> **用途**：在 Grok Build 里执行  
> `/goal 按 GROK_GOAL_PROD_FIX.md 修线上明显问题`  
> 或把下方「§〇 粘贴版启动指令」整段贴进对话，作为**唯一任务源**。  
>  
> **仓库路径（权威）**：本文件所在目录 = fortune-insight 工作副本  
> 常见：`/tmp/fortune-insight-`  
> 线上：`https://fortunesite.one`（**默认不 push、不部署**；用户明文「可以 push」后才 push；Manus 发布由用户做）

**版本**

| 版本 | 说明 |
|------|------|
| **1.0** | 针对 2026-07 线上只读审计：会员 4.8、逆行恐吓 Alert、安全头、错误 API 路径；不含产品页大 UX 重做 |
| **1.1** | 研究后澄清：本 goal = **信任底盘 only**；获客/付费路径 → `GROK_GOAL_CONVERT.md`；仪式 UX → `PRODUCT_UX`；可选小补丁 PF03/12/22/31（仍非转化） |
| **1.2** | **与 MASTER v1.1 对齐**：不再要求删除 CosmicAlert 恐吓/戏剧钩子；Alert 策略以 **MASTER G12 增强** 为准；本文件 PF10 若冲突作废 |

**审计来源（问题清单）**

| # | 严重度 | 现象 | 证据位置（当时 prod） |
|---|--------|------|----------------------|
| P1 | 中 | 会员页静态 **4.8/5** | `Membership-*.js` 含 `4.8/5` |
| P2 | 中-低 | 主页 CosmicAlert **水星逆行警告** 等恐吓文案 | `Home-*.js` / `CosmicAlert` |
| P3 | 低 | 缺 **CSP**、**X-Frame-Options** | 响应头仅有 HSTS + nosniff |
| P4 | 低 | 错误路径 `/trpc/...` 回 SPA HTML | 正确 API 为 `/api/trpc` |
| — | 信息 | 站点可开、chunk 全 200、缺 asset 404 非 HTML、无 Manus | 已健康，**禁止回退** |

**与兄弟 goal**

| 文件 | 关系 |
|------|------|
| `GROK_GOAL.md` | 工程债；不重复已 ship 的 F0 除非回归 |
| `GROK_GOAL_HOME.md` | 主页五皮已上线；本 goal **只修信任文案**，不改五皮架构 |
| `GROK_GOAL_PRODUCT_UX.md` | 八字/解梦/星座体验 **本 goal 不做**（用户另决策） |
| `GROK_GOAL_CONVERT.md` | **伦理付费路径**（SoftPaywall/试用/结果升级）；**本 goal 不做** |
| **`GROK_GOAL_PROD_FIX.md`（本文件）** | 线上明显问题收口 = 信任/安全 |

**Baseline（禁止破坏）**

- 缺 `/assets/*` → **404** 且 body **非** SPA HTML  
- `auth.me` 不暴露 `passwordHash`  
- Login **无 Manus**  
- 试用默认 **14 天** 文案/策略不谎改  
- `/tarot?type=career` 仍可用  
- 主页 `fortune.homeVariant` 五皮仍可用  
- 不重新引入 LiveActivity 假 feed  

---

## 〇、粘贴版启动指令（复制从这里到 §〇 结束）

```
你是 Fortune Insight 线上明显问题收口的 /goal 工程代理。
唯一任务源：工作区 GROK_GOAL_PROD_FIX.md（v1.0+；若无则用本消息全文）。

【产品铁律 — 违反 = 本轮作废】
1. 只解决审计清单：会员假评分、CosmicAlert 恐吓文案、安全响应头、错误 /trpc 路径行为。
2. 禁止扩 scope 到产品页大 UX、塔罗仪式重做、主页五皮重构、换框架。
3. 禁止重新引入：假 LiveActivity、主页/会员静态 4.8 信任欺诈、Manus 登录/analytics。
4. 禁止 git push / 部署，除非用户当轮明文「可以 push」。
5. 每轮 backlog 只做 1 个 PF 编号；全仓 1 写者；最小 diff。
6. 不提交 .env / 密钥。
7. 中英双语一致；改文案两边都改。
8. 禁止破坏 Baseline（asset404 / auth.me / 无 Manus / 14 天试用 / career / homeVariant）。

【波次闸】
- 上一波全部 [x] 或 [skip] 后才能开下一波。
- 同波按 PF 编号升序。

【本地预览】
- 改前端/服务端后：pnpm dev；相关路径自测。
- 安全头：本地或 curl 响应头可述（dev 与 prod 中间件路径见 §八）。
- [x] = tsc + 相关 vitest + 本地可述。

【SOP】
0. 读 GROK_GOAL_PROD_FIX.md 全文 + 相关源码 §八
1. 读/建 PROGRESS_PROD_FIX.md
2. 取 §六 最高优先级未完成 1 项
3. 实现（Scope Cap）
4. 验证：tsc；相关 vitest；pnpm dev 或 curl
5. PROGRESS_PROD_FIX.md 一行
6. 本地 commit：fortune-prod: <id> <简述>
7. 汇报用户；等继续或「可以 push」

【本轮请开始】做 §六 第一项未完成项（通常是 PF00）。
```

---

## 一、使命（一句话）

在**不 push** 前提下，把 fortunesite.one 审计出的 **信任口径漏洞 + 恐吓营销文案 + 基础安全头 + 错误 API 路径** 修到可验收；交付小而硬，禁止借机大改产品。

---

## 二、非目标

| 不做 | 原因 |
|------|------|
| 八字/解梦/星座结果页大 UX | 另 goal；用户可能暂不上线 |
| 主页再加第 6 套皮 / 重做选择器 | 已 ship |
| 塔罗 T00–T25 回潮大改 | 另 goal |
| 改 Stripe 定价 / 试用天数算法 | 非本审计 |
| 默认 push / Manus 发布 | 铁律 |
| 全站换 CSP 严格到打爆内联（若破坏现有脚本则用 report-only 或分阶段） | 见 PF10 Scope |

---

## 三、完美定义（DoD 总览）

全部满足才算 goal 完成：

1. **全仓源码** 无面向用户的静态 `4.8/5` / `4.8/5 Rating`（会员页、主页、组件、locales 一并清）；若需评分必须来自真实数据源且可关——本 goal **默认删除静态评分**。  
2. **CosmicAlert**：默认与主页 weak 路径均为 **非恐吓**「今日主题」；legacy 恐吓列表（水星逆行警告等）删除或永不挂载；`classic` 也不得展示恐吓标题。  
3. **安全头**：生产（及本地 start/prod 中间件）响应至少：  
   - `X-Frame-Options: DENY`（或 `SAMEORIGIN`，二选一写死并文档说明）  
   - `X-Content-Type-Options: nosniff`（若已有则保持）  
   - `Content-Security-Policy`：**至少** 一版可用策略（可先 `default-src 'self'` + 现有脚本/样式/连接所需放行；禁止空 CSP）；若过严导致白屏则用 `Content-Security-Policy-Report-Only` 并记 PROGRESS，但 **XFO 必须 enforce**。  
4. **错误 `/trpc`（无 `/api` 前缀）**：不得返回完整 SPA HTML 伪装成 API；应 **404** 或 JSON 错误（与 `/api/trpc` 语义区分）。  
5. Baseline 回归测试 / 结构测试通过；`PROGRESS_PROD_FIX.md` 齐。  

---

## 四、边界（铁律）

见 §〇。额外：

- Commit 前缀：`fortune-prod:`  
- 改中间件时确认 **dev HMR 不被 CSP 误杀**（dev 可跳过严格 CSP，**production 必须有 XFO**）。  
- 不改业务计费逻辑。  

---

## 五、每轮 SOP

见 §〇。卡住 >40 分钟：PROGRESS 记障碍，标 blocked。

---

## 六、Backlog

状态：`[ ]` · `[~]` · `[x]` · `[ship]` · `[skip]`

---

### Wave 0 — 基线与测绘

#### PF00 — 仓库全文测绘 + PROGRESS
- **DoD**：创建 `PROGRESS_PROD_FIX.md`；`rg` 列出所有 `4.8`、`水星逆行`、`Mercury Retrograde`、`LiveActivity`、`X-Frame-Options`、CSP 相关位置；记文件:行号。  
- **Scope Cap**：只读 + 文档。  
- **Verify**：PROGRESS 有表。

---

### Wave 1 — 信任口径（P1）

#### PF01 — 清除静态 4.8/5（会员页为主）
- **DoD**：  
  - 删除或替换 `client/src/pages/Membership.tsx`（及任何组件/locales）中的静态 `4.8/5` / `4.8/5 Rating`。  
  - 替换文案须真实（如「Stripe 支付」「14 天试用」「10% 公益」），**禁止**换一个假分。  
  - `rg '4\.8/5|4\.8/5 Rating'` 在 `client/` 无用户可见命中（测试/注释除外且注释不得渲染）。  
- **Scope Cap**：不重做会员页布局。  
- **Verify**：结构/rg 测试或 vitest 读源码断言无 `4.8/5`；本地 `/membership` 目测。

#### PF02 — 信任文案一致性抽检
- **DoD**：主页 Trust、会员页、登录页：无假评分、无假 live；14 天试用表述一致且不承诺「永久无限」。  
- **Scope Cap**：文案对齐，不大改 UI。  
- **Verify**：PROGRESS 勾选三页。

#### PF03 — 信任三件套真实性核对（可选小补丁）
- **DoD**：Stripe / 加密 / 10% 公益：仅修正**虚假或自相矛盾**表述；不新增营销段。  
- **Scope Cap**：不写会员销售页（→ CONVERT C21）。  
- **Verify**：rg + PROGRESS。

---

### Wave 2 — CosmicAlert 去恐吓（P2）

#### PF10 — CosmicAlert 数据源净化
- **DoD**：  
  - `CosmicAlert.tsx`：**删除**恐吓型 `cosmicEvents`（水星逆行警告、满月峰值恐吓、关系宫重大转折等 **FOMO/恐吓** 标题），或永久不再被引用。  
  - 仅保留 **weakThemes 风格**（今日主题 · 事业/关系/觉察等）中性文案。  
  - `weak` prop：可简化为始终中性；若保留 `legacy`，legacy **不得**含恐吓列表。  
  - 中英齐全。  
- **Scope Cap**：不删主页 Alert 槽位；可保留 dismiss。  
- **Verify**：`rg '水星逆行|Mercury Retrograde'` 在 client 无用户可见命中；本地主页 classic/ritual 开 Alert 时无恐吓标题。

#### PF11 — 主页挂载与五皮兼容
- **DoD**：`Home` / `HomeSections` 无论 `alertTone` 为何，展示的都是中性主题条；`data-home-cosmic-alert` 仍可测。  
- **Scope Cap**：不改 homeVariant 枚举。  
- **Verify**：本地 `?variant=classic` 与 `ritual` 切换，Alert 文案中性。

#### PF12 — Alert dismiss 与不循环 FOMO
- **DoD**：dismiss 当日有效；禁止关闭后立刻换恐吓条再弹。  
- **Scope Cap**：不重做动画。  

---

### Wave 3 — 安全响应头（P3）

#### PF20 — 生产中间件挂载安全头
- **DoD**：在 Express（或现有 `server/_core` 入口）为 **production** 响应设置：  
  - `X-Frame-Options: DENY`（或 SAMEORIGIN，PROGRESS 写明选择理由）  
  - 保持/设置 `X-Content-Type-Options: nosniff`  
  - `Content-Security-Policy` 或 `Content-Security-Policy-Report-Only`（见完美定义 §三.3）  
  - 不破坏现有静态资源、Vite 生产构建、API。  
- **Scope Cap**：dev 环境可放宽 CSP；**不可**在 prod 省略 XFO。  
- **Verify**：`pnpm build && pnpm start`（或项目等价）后 `curl -sI localhost:$PORT/` 可见 XFO；有 vitest/集成测读 header 更佳。

#### PF21 — 安全头回归测试
- **DoD**：新增 `server/security-headers.test.ts`（或扩展现有）：对 app 注入请求，断言关键 header 存在。  
- **Scope Cap**：不引入重型 e2e 框架。  
- **Verify**：`pnpm exec vitest run` 该文件 PASS。

#### PF22 — 生产/dev 行为文档化
- **DoD**：PROGRESS 写明：CSP 严格度在 dev 可放宽；**prod/`pnpm start` 必须带 XFO**。  
- **Verify**：文档存在。

---

### Wave 4 — 错误 /trpc 路径（P4）

#### PF30 — 非 /api/trpc 前缀不返回 SPA HTML
- **DoD**：  
  - 请求 `GET /trpc` 或 `GET /trpc/auth.me`（无 api 前缀）→ **404** 或 **JSON** `{ error: ... }`，**Content-Type 非 text/html**（或非完整 doctype SPA）。  
  - `/api/trpc/*` 行为不变。  
  - SPA 路由（`/tarot` 等）仍回 index HTML。  
- **Scope Cap**：只修挂载顺序 / 显式 404，不大改 tRPC。  
- **Verify**：curl 或 supertest：`/trpc/auth.me` 非 HTML；`/api/trpc/auth.me` 仍可用；`/tarot` 仍 HTML。

#### PF31 — 错误路径 JSON hint（可选）
- **DoD**：`/trpc/*` 404 JSON 可含 `hint: "use /api/trpc"`；不返回 SPA。  
- **Scope Cap**：一行级提示即可。

---

### Wave 5 — 收口

#### PF40 — 全量 rg 闸 + Baseline 冒烟
- **DoD**：  
  - `rg` 闸：无用户可见 `4.8/5`、`水星逆行`、`Mercury Retrograde Alert`。  
  - asset 404 行为仍对（有测则跑）。  
  - `pnpm exec tsc --noEmit` 0。  
  - 相关 vitest 全过。  
- **Verify**：PROGRESS 贴命令摘要。

#### PF41 — 文档
- **DoD**：`PROGRESS_PROD_FIX.md` 完成表；可选更新 `LOCAL_PREVIEW.md`「上线前检查」三行。  
- **Verify**：文件存在。

#### PF42 — `[skip]` 除非用户点名：严格 CSP enforce 到零 unsafe-inline  
#### PF43 — `[skip]` 除非用户点名：push + 协助对照 fortunesite.one 再审计  

---

## 七、用户总检

1. 本地 `/membership`：无 4.8 分。  
2. 本地 `/` 各外观：Alert 若显示，标题像「今日主题」而非「逆行警告」。  
3. `curl -sI` 生产构建端口：有 `X-Frame-Options`。  
4. `curl` `/trpc/auth.me` 非 SPA HTML；`/api/trpc/auth.me` 正常。  
5. 总检 OK → 用户说「可以 push」→ 用户 Manus 发布 → 可选再扫 fortunesite.one。  

---

## 八、关键路径

| 路径 | 用途 |
|------|------|
| `client/src/pages/Membership.tsx` | 4.8 评分 |
| `client/src/components/CosmicAlert.tsx` | 恐吓事件列表 |
| `client/src/pages/Home.tsx` / `components/home/HomeSections.tsx` | Alert 挂载 |
| `server/_core/index.ts` 或 `vite.ts` / express 入口 | 安全头、路由顺序 |
| `server/security-headers.test.ts` | 新建测试 |
| `PROGRESS_PROD_FIX.md` | 进度 |
| `scripts/prod_smoke.sh` / `local_smoke.sh` | 可扩展断言 |

---

## 九、Commit 约定

- `fortune-prod: PF01 remove membership 4.8 rating`  
- `fortune-prod: PF10 neutralize CosmicAlert`  
- `fortune-prod: PF20 security headers`  
- …  
- 禁止 push 除非用户授权。

---

## 十、完成定义

- [ ] PF00–PF02、PF10–PF11、PF20–PF21、PF30、PF40–PF41 均为 `[x]` 或用户 `[skip]`  
- [ ] 完美定义 §三 1–5 满足  
- [ ] 用户总检通过  
- [ ] （可选）授权后 push  

---

## 十一、执行顺序速览

```
PF00
 → PF01 → PF02
 → PF10 → PF11
 → PF20 → PF21
 → PF30
 → PF40 → PF41
```

*End of GROK_GOAL_PROD_FIX v1.0*
