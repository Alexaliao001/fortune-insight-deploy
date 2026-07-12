# GROK /goal — Fortune Insight 体验与工程优化

> **用途**：在 Grok Build 里执行  
> `/goal 按 GROK_GOAL.md 做 Fortune Insight`  
> 或把下方「§〇 粘贴版启动指令」整段贴进对话，作为**唯一任务源**。  
>  
> **仓库路径（权威）**：本文件所在目录 = fortune-insight 工作副本  
> 常见：`/tmp/fortune-insight-` 或 `git clone` 后的本地路径。  
> 线上：`https://fortunesite.one`（**本 goal 默认不部署、不 push**）

---

## 〇、粘贴版启动指令（复制从这里到 §〇 结束）

```
你是 Fortune Insight 的 /goal 工程代理。唯一任务源：工作区里的 GROK_GOAL.md（若无则用本消息全文）。

【铁律 — 违反 = 本轮作废】
1. 禁止 git push / gh pr create / 强制推送 / 改远程保护分支。未获用户明确说「可以 push」前，一切改动只留本地。
2. 禁止部署到 Manus / 改线上 secrets / 对 fortunesite.one 做破坏性写操作。
3. 每轮 backlog 只做 1 项；全仓仅 1 个写者（不并行改同一工作区）。
4. 不打印、不提交 .env / API Key / Stripe 真密钥。
5. 不删除用户未点名的功能；最小 diff。

【本地预览铁律】
- 改前端/全栈后必须：在本地启动 dev（或 build+start），用浏览器/可打开的 URL 自测。
- 默认命令（在仓库根）：
  pnpm install   # 若缺依赖
  pnpm dev       # 典型 http://localhost:3000 或终端打印的端口
- 验收写清：本地 URL + 点了什么 + 期望结果。用户说 OK 前不要 push。

【SOP】
0. 读 GROK_GOAL.md 全文 + package.json scripts + client/src/App.tsx 路由
1. 读 PROGRESS_FORTUNE.md（若无则创建）最近状态
2. 从 §六 Backlog 取优先级最高且未完成的 1 项
3. 实现（最小 diff）
4. 验证：pnpm exec tsc --noEmit（若项目支持）；相关 vitest；本地浏览器路径
5. 更新 PROGRESS_FORTUNE.md 一行
6. git commit 仅本地（message: fortune: …）；默认 git push 禁止
7. 向用户汇报：做了哪项、本地怎么打开、请用户测什么；等用户「OK 再 push」

【本轮请开始】执行 SOP，做 §六 中第一项未完成的 P0。
```

---

## 一、使命（一句话）

在**不推送到远程、先本地浏览器可验**的前提下，把 Fortune Insight 的 **工程稳定项 + 塔罗/结果页体验 + 事业入口** 做到可给朋友回归测试的程度；每轮交付 **1 项可勾选验收** 的改进。

---

## 二、非目标（本 goal 不做）

| 不做 | 原因 |
|------|------|
| 判定「能不能赚钱 / PMF」 | 商业决策，人定 |
| 解读朋友是否暧昧 | 非工程 |
| 未授权改定价/Stripe 线上配置 | 风险 |
| 默认 `git push` / Manus 发布 | 用户明确要求先本地看 |
| 大重构换框架 | 超 scope |
| stock-skills 的 score/regression | 另一仓库 |

---

## 三、边界（铁律）

1. **默认禁止 push**：任何 `git push`、`sync-repo.sh push`、开 PR 到 main 合并，须用户当轮明文「可以 push / 发布」。
2. **默认禁止动线上**：不对 fortunesite.one 写数据清理、不删用户；只读探测可以。
3. **单写者**：每轮 1 个 backlog；禁止无 worktree 双 agent 同改一工作区。
4. **最小 diff**：不为「完美」扩 scope；UI 改动集中塔罗/结果/入口相关文件。
5. **密钥**：不提交 `.env`；不把 `JWT_SECRET` / Stripe live key 写进文档。
6. **本地可演示**：UI/体验类项未在本地浏览器走通 → 项未完成。
7. **好友滤镜**：验收以「可客观描述的行为」为准，不把熟人「挺准」写成产品已验证。

---

## 四、每轮 SOP（按序）

```
0. 读本文件 + 相关源码路径（§八）
1. 读/建 PROGRESS_FORTUNE.md
2. 选 §六 最高优先级未完成项（P0 > P1 > P2；同级按编号）
3. 实现（1 写者）
4. 验证：
   a. pnpm exec tsc --noEmit（有则跑）
   b. 相关 vitest（有则跑，如 payment / chunk-reload）
   c. 本地 pnpm dev → 浏览器验收（§七 对应行）
5. PROGRESS_FORTUNE.md 追加一行：日期 | 任务ID | 结果 | 本地URL | 遗留
6. 仅本地 commit：fortune: <task_id> <简述>
7. 汇报用户：截图建议 + 请测步骤；等待 OK 再 push
```

**卡住 >40 分钟**：PROGRESS 记障碍，跳下一项或标 blocked，禁止硬推铁律。

### 4.1 子代理（可选）

| 情况 | 策略 |
|------|------|
| 单文件/路径清 | 主窗直做 |
| 塔罗 UI 涉及多文件 | 可先 read-only explore 列文件，再单写者改 |
| 验收 | 主窗自测本地；或 spawn general-purpose 只跑 curl localhost（勿 push） |

**不要**用 stock-explore/stock-verifier（那是 stock-skills 专用）。

---

## 五、优先级规则

1. 先 **工程回归类 P0**（本地/逻辑错会影响所有人）  
2. 再 **塔罗体验 P0**（朋友 1 UI 反馈）  
3. 再 **事业入口 + 结果可读 P1**（朋友 2 场景）  
4. **试用政策代码** 仅在用户书面选定规则后做  
5. 禁止同一轮既大改 UI 又改 auth 又改支付  

---

## 六、Backlog

状态：`[ ]` 未做 · `[~]` 进行中 · `[x]` 本地完成待用户 OK · `[ship]` 用户已 OK 且已 push（仅用户授权后）

### P0 — 工程稳定（Grok 最强项）

| ID | 项 | 做法要点 | 验收（本地） |
|----|-----|----------|--------------|
| **F0-1** | 缺失 `/assets/*` 永不 SPA 200 HTML | `server/_core/vite.ts` 用 `originalUrl` 判路径；404 text/plain | `pnpm build && pnpm start` 后 `curl -sI localhost:$PORT/assets/no-such.js` → **404**；body 非 `<!doctype` |
| **F0-2** | `auth.me` 不暴露 passwordHash | `routers.ts` strip 字段 | 本地注册后 `auth.me` JSON **无** passwordHash |
| **F0-3** | 登录页/HTML 无 Manus 登录与 Manus analytics | `Login.tsx` 无 Manus 按钮；`index.html` 不注入 manus-analytics | 浏览器打开 `/login` 源码检索 `manus`：无登录文案、无 manus-analytics（或按文件策略跳过） |
| **F0-4** | Admin API 非 admin → FORBIDDEN | payment.admin* 用 TRPCError | 普通用户 cookie 调 adminListUsers → 403 语义 |
| **F0-5** | 登录失败/重复注册错误码 | BAD_REQUEST / UNAUTHORIZED 非 500 | 错误密码不返回 INTERNAL_SERVER_ERROR 作为主码 |
| **F0-6** | 星座日运缓存按语言隔离 | horoscope cache key 含 language | 同 sign 先 zh 再 en，en 为英文（本地 DB 或清缓存测） |

### P0 — 塔罗体验（朋友 1 · UI/UX）

| ID | 项 | 做法要点 | 验收（本地浏览器） |
|----|-----|----------|-------------------|
| **F0-7** | 塔罗抽牌/翻牌视觉层级 | `client/src/pages/Tarot.tsx` + 相关组件：牌背/翻牌/间距/暗色氛围，避免廉价表单感 | 手机宽度（DevTools iPhone）走完：选问题→抽牌→出结果；主观：比改前更「仪式感」（自检 + 请用户看） |
| **F0-8** | 塔罗结果页可读结构 | 标题层级、分段、弱化生 Markdown；关键句可扫读 | 结果页 3 秒内能抓住主题；无整墙无层次纯文本 |

### P1 — 场景与分享（朋友 2 · 事业）

| ID | 项 | 做法要点 | 验收 |
|----|-----|----------|------|
| **F1-1** | 事业/求职入口可见 | 首页或塔罗问题类型强化「工作/事业」 | 新用户 10 秒内找到工作向路径 |
| **F1-2** | 结果金句/分享友好 | 结果区强调 1–2 句可截图；可选分享按钮 | 手机截一张图信息完整 |
| **F1-3** | 本地 README 预览说明 | 根目录 `LOCAL_PREVIEW.md`：如何 pnpm dev、端口、测哪些 URL | 用户按文档能打开 |

### P1 — 试用政策（仅用户拍板后）

| ID | 项 | 前置 | 验收 |
|----|-----|------|------|
| **F1-4** | `[x]` 落地试用天数/额度 | 默认 90；`SIGNUP_TRIAL_DAYS` 可配；`0`=不发试用 | 见 `server/trialPolicy.ts` + `LOCAL_PREVIEW.md`；未 push |

### P2 — 可选

| ID | 项 | 验收 |
|----|-----|------|
| **F2-1** | 社区评论 API+极简 UI | 登录可发/可看评论 |
| **F2-2** | 八字请求超时/加载态文案 | 长等待有明确 loading，不白屏 |
| **F2-3** | 全功能本地冒烟脚本 | `scripts/local_smoke.sh` curl localhost 主路径 |

---

## 七、验收矩阵（本地）

| 场景 | 操作 | 期望 |
|------|------|------|
| 首页 | 打开 `/` | 200，可点进塔罗 |
| 注册 | `/login` 注册测试号 | 成功；有试用或额度符合当前规则 |
| 塔罗 | 完整一次中文 general | 出牌 + 有解读正文 |
| 资产 | `GET /assets/no-such-xxx.js` | **404** 非 HTML |
| 安全 | 登录后 me | 无 passwordHash |
| 管理 | 非 admin 调 overview | 拒绝 |

**线上** `fortunesite.one`：仅在用户要求「对照线上」时只读探测；**修复仍只提交本地**，发布由用户 Manus 在 push 后做。

---

## 八、关键路径索引

| 路径 | 内容 |
|------|------|
| `client/src/pages/Tarot.tsx` | 塔罗主流程 |
| `client/src/pages/Login.tsx` | 登录注册 |
| `client/src/pages/Home.tsx` | 入口 |
| `client/src/pages/Membership.tsx` | 会员/兑换 |
| `client/index.html` | 分析脚本注入 |
| `server/_core/vite.ts` | 静态资源 / SPA fallback |
| `server/routers.ts` | auth / payment / admin |
| `server/db.ts` | 试用 grantSignupTrialIfNeeded |
| `server/routers/horoscope.ts` | 日运缓存 |
| `server/routers/tarot.ts` | 塔罗 API |
| `package.json` | `dev` / `build` / `start` / `check` |

---

## 九、本地预览标准命令

```bash
cd /path/to/fortune-insight   # 本仓库根
pnpm install
pnpm dev
# 浏览器打开终端提示的 URL（多为 http://localhost:3000 或 5173+API）
```

若需生产构建预览：

```bash
pnpm build && pnpm start
```

**数据库**：本地若无 `DATABASE_URL`，部分 API 会降级；优先保证前端体验项可演示；auth/试用需可用的本地或远程 dev DB（只写测试号，不删生产数据）。

---

## 十、完成定义（Definition of Done）

单项 DoD：

- [ ] 代码已改且本地 commit（可选，推荐）  
- [ ] §七 相关行在 **localhost** 通过  
- [ ] PROGRESS_FORTUNE.md 已记  
- [ ] 用户被告知「怎么打开、测什么」  
- [ ] **未 push**（除非用户当轮授权）  

整 goal 可宣布阶段完成当：

- F0-1 … F0-8 均为 `[x]`  
- 用户本地看过塔罗并回复 OK  
- 用户明确说可以 push 后，代理才执行 push，并将项标 `[ship]`

---

## 十一、PROGRESS 格式（PROGRESS_FORTUNE.md）

```markdown
# Fortune Insight /goal 进度

| 日期 | ID | 结果 | 本地验证 | 遗留 |
|------|-----|------|----------|------|
| 2026-07-10 | F0-1 | 改 vite originalUrl | curl 404 OK | 等用户看 |
```

---

## 十二、与用户协作话术（代理每轮结尾）

```
本轮完成：F0-x …
本地打开：http://localhost:PORT/…
请你测：1) … 2) …
确认 OK 后回复「可以 push」或「继续下一项 F0-y」。
在你说可以 push 之前我不会 push。
```

---

## 十三、Backlog 推荐执行顺序（默认）

```
F0-1 → F0-2 → F0-3 → F0-4 → F0-5 → F0-6
  → F0-7 → F0-8
  → F1-1 → F1-2 → F1-3
  →（用户定规则后）F1-4
  → F2-* 可选
```

---

*文件版本：2026-07-10 · 默认 no-push · 本地浏览器验收优先*
