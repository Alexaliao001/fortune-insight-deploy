# GROK /goal — Fortune Insight 塔罗全效果长时任务（v1.1.1）

> **用途**：在 Grok Build 里执行  
> `/goal 按 GROK_GOAL_TAROT.md 做塔罗效果`  
> 或把下方「§〇 粘贴版启动指令」整段贴进对话，作为**唯一任务源**。  
>  
> **仓库路径（权威）**：本文件所在目录 = fortune-insight 工作副本  
> 常见：`/tmp/fortune-insight-` 或 `git clone` 后的本地路径。  
> 线上：`https://fortunesite.one`（**全程默认不 push、不部署**；用户总检 OK 后才说「可以 push」）

**版本**

| 版本 | 说明 |
|------|------|
| 1.0 | 初稿：A–E 全清单入 T01–T25 |
| **1.1** | 核查修订：静音前置、波次闸、复用牌库/现成组件、scope cap、验收钩子、baseline、MVP 切片 |
| **1.1.1** | 音频策略：默认 **背景声静音**，**交互音效保留**（双通道） |

**与兄弟 goal**

| 文件 | 范围 | 关系 |
|------|------|------|
| `GROK_GOAL.md` | 工程稳定 + 事业入口等 | **已 ship**；本 goal **禁止**重做 F0–F2 工程债 |
| **`GROK_GOAL_TAROT.md`（本文件）** | 塔罗仪式/牌面/结果/深度/声音 | 塔罗路径冲突时 **以本文件为准** |

**Baseline（禁止破坏）**

改塔罗时不得回归：

- 缺失 `/assets/*` → 404 非 SPA HTML  
- `auth.me` 无 `passwordHash`  
- Login 无 Manus 登录/analytics  
- 注册试用默认 **14 天**（`trialPolicy`）  
- `/tarot?type=career` 事业入口仍可用  

---

## 〇、粘贴版启动指令（复制从这里到 §〇 结束）

```
你是 Fortune Insight 塔罗体验的 /goal 工程代理。
唯一任务源：工作区 GROK_GOAL_TAROT.md（v1.1+；若无则用本消息全文）。

【铁律 — 违反 = 本轮作废】
1. 禁止 git push / gh pr create / 强制推送 / 改远程保护分支。
   仅当用户明文「可以 push」才可 push。此前只本地 commit。
2. 禁止 Manus 部署 / 改线上 secrets / 对 fortunesite.one 破坏性写。
3. 每轮 backlog 只做 1 个 T 编号；全仓 1 写者。
4. 不提交 .env / 真密钥；不打印密钥。
5. 最小 diff；优先 client 塔罗路径；禁止无关重构。
6. 版权：不抄伟特/商业牌面；牌艺仅自有/几何/符号 SVG。
7. 动画尊重 prefers-reduced-motion。
8. **音频双通道（产品硬规则）**：
   - **背景声 ambient**（环境垫乐/循环氛围）：默认 **静音/关闭**。
   - **交互音效 sfx**（抽牌/翻牌/洗牌短音等）：默认 **开启**，克制音量。
   - 两路分别可关；localStorage 分 key 持久化（见 T00）。不得用「总静音」默认关掉 sfx。
9. 性能：drawing 可交互；禁止无节制全屏粒子；飞牌只动画「被选中的那张」。
10. 禁止破坏 Baseline（asset 404 / auth.me / 无 Manus / 14 天试用 / career 深链）。
11. 复用优先：牌库 keywords/reversed、ShareResultCard 出图、CrossSell、TTS、playTone——禁止平行造轮子。
    TTS 属「朗读」通道，默认不自动播；与 ambient/sfx 分离。

【波次闸】
- 必须上一波全部 [x] 或 [skip] 后，才能开始下一波第一项。
- 同波内严格按 T 编号升序。

【本地预览】
- 改前端后：pnpm dev；汇报 URL + 操作 + 期望。
- [x] = 本机验收通过（代理自测 + 结构测试）；用户总检只在 §七「用户总检」做一次。

【SOP】
0. 读 GROK_GOAL_TAROT.md v1.1+ 全文 + Tarot.tsx 阶段机 + §八
1. 读 PROGRESS_TAROT.md
2. 取 §六 最高优先级未完成 1 项（先 T00，再 W1…W6）
3. 实现（遵守该项 Scope Cap）
4. 验证：tsc；相关 vitest；pnpm dev 浏览器；本项 data-* 钩子若有则 curl/DOM 可述
5. PROGRESS_TAROT.md 一行
6. 本地 commit：fortune-tarot: <id> <简述>
7. 汇报用户；等继续或「可以 push」

【本轮请开始】做 §六 第一项未完成项（通常是 T00）。
```

---

## 一、使命

在**全程本地可验、不自动 push** 下，把塔罗打成：

**仪式清楚 → 牌面可辨 → 结果可扫可读可分享 → 交互有深度 → 声音可关不吵**

每轮 1 项可客观验收的交付。

**成功标准（全部 `[x]`/`[skip]` 后用户总检）**

1. 手机宽：选题 → 问题 →（洗牌）→ 抽/飞/翻 → 解读 → 分段结果+金句 → 再问/分享，无明显廉价感  
2. `prefers-reduced-motion: reduce` 下全流程可完成、无强闪强飞  
3. 背景声默认静音；交互音效默认可响且可单独关；刷新后偏好保持
4. 无版权牌面；无密钥；commits 清晰  
5. Baseline 不回归  
6. 用户总检 OK 后才 push / 发布  

---

## 二、非目标

| 不做 | 原因 |
|------|------|
| 默认 push / Manus 发布 | 你要求总检后再上传 |
| 准不准 / 能否赚钱 | 人定 |
| 抄袭商业牌面 | 版权 |
| 3D 引擎 / 换框架 | 超 scope |
| 改 Stripe / 试用天数 | 另决策（当前 14 天） |
| 大改八字/解梦/社区 | 本 goal 仅塔罗主路径 |
| 重做已 ship 的 F0–F2 工程项 | 见 Baseline |
| stock-skills | 另一仓库 |

---

## 三、边界（铁律）

1. **禁止 push** 直至用户明文「可以 push / 可以发布」。  
2. **禁止线上写**；只读探测可选。  
3. **单写者 · 每轮 1 个 T 编号**。  
4. **最小 diff** + §八 路径。  
5. **无密钥**。  
6. **浏览器未走通 → 该项未完成**。  
7. **性能**：单次飞入/洗牌可跳过；drawing 新增强制等待建议 ≤ 1.5s（可跳过合计感 < 4s）。  
8. **a11y**：reduce 时淡入替代飞牌/洗牌；控件可聚焦可点。  
9. **中英**用户文案。  
10. **波次闸**见 §五。  

---

## 四、每轮 SOP

```
0. 读本文件 + Tarot 阶段机 select|question|drawing|result
1. 读 PROGRESS_TAROT.md
2. 选下一项（T00 → 按波次）
3. 实现（Scope Cap 内）
4. tsc · vitest · pnpm dev
5. PROGRESS 一行
6. commit: fortune-tarot: Tid …
7. 汇报 URL/测法
```

**卡住 >40 分钟**：记 `[blocked]` 或拆子步骤进 PROGRESS，禁止硬推。

**质量门槛（每项至少一条）**

- vitest 锁纯函数 / data 属性 / storage key；或  
- 明确 `data-tarot-*` 钩子 + 人工步骤可复述  

**每波结束自检（代理必做，不占独立 T 号）**

- 在 DevTools 模拟 `prefers-reduced-motion: reduce` 走通当前波已交付路径  
- 记入 PROGRESS 波次小结一行  

---

## 五、波次与优先级

| 波 | 主题 | ID | 进入条件 |
|----|------|-----|----------|
| **W0** | 声控前置 | **T00** | 立即开始 |
| **W1** | 仪式 | T01–T06 | T00 = [x] |
| **W2** | 牌面 | T07–T10 | W1 全 [x]/[skip] |
| **W3** | 结果 | T11–T15 | W2 全 [x]/[skip] |
| **W4** | 深度 | T16–T19 | W3 全 [x]/[skip] |
| **W5** | 声音打磨 | T20–T21 | W4 全 [x]/[skip]（T00 已含 ambient 默关 + sfx 默开） |
| **W6** | 总闸 | T23–T25 | W5 全 [x]/[skip] |

- 同波内 **严格升序** T 编号。  
- 用户可说「跳过 Tid」→ `[skip]` + 原因。  
- 用户可说「只跑 MVP」→ 只做 §十五 MVP 列表。  

**状态语义**

| 状态 | 含义 |
|------|------|
| `[ ]` | 未做 |
| `[~]` | 进行中 |
| `[x]` | **本地完成**（代理验收通过）；非「用户已总检」 |
| `[skip]` | 跳过（须理由） |
| `[blocked]` | 阻塞 |
| `[ship]` | 用户已授权 push/发布后标记 |

---

## 六、Backlog

### W0 — 前置（必须先于仪式声画）

| ID | 项 | Scope Cap | 做法要点 | 验收 | 可测钩子 |
|----|-----|-----------|----------|------|----------|
| **T00** | **音频双通道 + 持久化** | 仅音频 policy + UI 控件 + 包装 playTone/draw/reveal（及日后 ambient） | **两路：** ① `ambient` 背景/垫乐 **默认 off（静音）**；② `sfx` 交互短音 **默认 on**。分别 `localStorage`：如 `fi.tarot.ambient=0`、`fi.tarot.sfx=1`。UI：至少「背景声」开关（默认关）+「音效」开关（默认开）；或等价文案。禁止默认总静音误杀 sfx。音量克制（gain 小）。TTS 不走 ambient/sfx 总开关。 | ① 默认进入：抽牌/翻牌 **有** sfx，**无** 背景循环声；② 关音效后 sfx 无声，刷新仍无；③ 开背景后才有 ambient（若尚未实现 ambient 播放，则开关就位 + 默认 off 即可，T20 洗牌声算 sfx 不是 ambient） | `data-tarot-ambient="on\|off"` `data-tarot-sfx="on\|off"` |

---

### W1 — 仪式感（P0）

| ID | 项 | Scope Cap | 做法要点 | 验收 | 可测钩子 |
|----|-----|-----------|----------|------|----------|
| **T01** | 洗牌动画 | 仅 drawing 入场；时长 0.8–1.5s **可跳过** | reduce → 跳过动画直接可点选 | 问题页开始 → 见洗牌或跳过 → 可点牌 | `data-tarot-phase="shuffle"\|"ready"` |
| **T02** | 抽牌飞入槽位 | **只动画被点中的那一张**；牌堆其余不集体飞 | 飞到 past/present/future；与进度点同步 | 三张均有飞入；reduce 则淡入占位 | `data-tarot-slot="0\|1\|2"` + `data-filled` |
| **T03** | 翻牌金光 | 光晕或 ≤12 粒子，**≤400ms**；不挡牌名 | 无全屏粒子场 | 翻开有短反馈；连抽不卡死 | `data-tarot-flip="flash"` 可选瞬时 |
| **T04** | 点选震动 | 单次短 `vibrate`；无 API **不抛错** | 验收以不报错为主；Android 震动加分 | try/catch 静默 | 无强制 DOM；代码路径可单测 mock |
| **T05** | 牌台氛围 | **仅 drawing 容器** CSS；不改全局 Starry | 烛光/星尘呼吸，不糊字 | 氛围可见；对比度可读 | 容器 `data-tarot-altar="1"` |
| **T06** | 齐牌静默强化 | **不禁用**「开始解读」；仅文案/样式 2s 强调 | 已有「静待启示」可加强 CTA | 齐 3 张后 CTA 更显眼；可立刻点 | `data-tarot-phase="await-reading"` |

---

### W2 — 牌面（P0）

| ID | 项 | Scope Cap | 做法要点 | 验收 | 可测钩子 |
|----|-----|-----------|----------|------|----------|
| **T07** | 关键词 chip | **复用** `tarot-database` / 牌数据 `keywords`·`keywordsZh`；禁止另造全套假库 | 翻开每张 2–3 chip | 中英随 language | chip 文本来自映射单测 |
| **T08** | 元素色边 | 映射表 fire/water/air/earth → 边框色 | 不同元素可辨 | 同花色一致 | `data-tarot-element="fire\|…"` |
| **T09** | 逆位视觉 | **不重做牌库**；接 `isReversed` / API 已有 reversed | 有则倒牌+「逆位」；数据路径已有则只补 UI | 逆位可辨；若运行时从不给 reversed → 测 fixture 或 `[skip]`+证据 | `data-tarot-orientation="upright\|reversed"` |
| **T10** | 抽象牌艺 | **仅** drawing 牌背 + 翻开正面壳 SVG/几何；**禁止**全站换肤、禁止外部 tarot 图包 | 成套感强于纯 Moon icon | 牌背统一；正面成套 | 共用 `TarotCardFace` 类名可测存在 |

---

### W3 — 结果与分享（P1）

| ID | 项 | Scope Cap | 做法要点 | 验收 | 可测钩子 |
|----|-----|-----------|----------|------|----------|
| **T11** | 结果分段入场 | 只动结果区；reduce → 一次显示 | 总论→三牌→建议 | 非同帧整墙；可扫读 | `data-tarot-result-section` |
| **T12** | 金句置顶放大 | **增强**现有 format/Share 金句；不重写整页 | 字号/层级 | 3 秒抓住主题句 | `data-tarot-pullquote` |
| **T13** | 再问/换题 CTA | 重置 stage **无脏 state**（牌、flip、reading 清空） | 结果底两个 CTA | 再抽/换题后流程干净 | 按钮 `data-tarot-action="again\|retype"` |
| **T14** | 出图分享增强 | **扩展**现有 `ShareResultCard`+`html-to-image`；不新依赖除非 PROGRESS 批准 | 失败 toast；Safari 失败可降级复制文案 | 能导出或明确失败 | 沿用分享卡；可测失败分支 |
| **T15** | Cross-sell 克制 | **已有** `CrossSellCard`：不挡主 CTA、可折叠或次级样式 | 不误触 | 主「再问/分享」优先 | `data-tarot-cross-sell` |

---

### W4 — 交互深度（P1）

| ID | 项 | Scope Cap | 做法要点 | 验收 | 可测钩子 |
|----|-----|-----------|----------|------|----------|
| **T16** | 单张今日指引 | **本项允许逻辑大但 UI 最小**：spreadSize=1 或等价；与三牌共存 | 入口明确；解读请求 1 张 | 只抽 1 张并出结果；额度仍走 tarot | `data-tarot-spread="1\|3"` |
| **T17** | 问题模板 | 每题型 **3** 条；一键填入 | locales | 点击填入 question | `data-tarot-template` |
| **T18** | 保存反馈 | 仅 toast/勾；不改 reports API 契约 | 成功/失败明确 | 登录用户可见 | toast 文案可测常量 |
| **T19** | 结果 TTS | **已有** TextToSpeech：确认读金句/摘要、可停；已满足可 `[skip]`+截图/说明 | 不强制自动播 | 可播可停 | 沿用组件 |

---

### W5 — 声音打磨（P2）

| ID | 项 | Scope Cap | 做法要点 | 验收 | 可测钩子 |
|----|-----|-----------|----------|------|----------|
| **T20** | 洗牌声 | Web Audio 合成；属 **sfx**，服从 `fi.tarot.sfx`；**不是** ambient | 短促；sfx off 时无声 | 与 T00 sfx 联测 |
| **T21** | 三连音阶 | 扩展 playTone：第 1/2/3 张音高递进；属 **sfx** | 可辨差异 | 三张不同频 | 纯函数 `drawToneHz(i)` 单测 |

**禁止**把抽牌/翻牌/洗牌短音做成「背景循环」。若未来加环境垫乐，必须走 **ambient** 且 **默认 off**。

---

### W6 — 总闸（P2）

| ID | 项 | Scope Cap | 做法要点 | 验收 |
|----|-----|-----------|----------|------|
| **T23** | 结构/回归 vitest | 扩展 `tarot-ui-structure` / 新增 `tarot-ritual-*.test.ts` 等 | 锁：ambient/sfx storage key 默认值、phase 枚举、element 映射、drawToneHz、spread 1\|3 | `pnpm exec vitest` 相关文件 PASS |
| **T24** | reduced-motion 总检 | 全路径手测 + 关键分支代码存在 | DevTools reduce 下完成三牌+解读 | PROGRESS 记步骤 |
| **T25** | 验收文档 | 写 `TAROT_PREVIEW.md` 或写入 `LOCAL_PREVIEW.md` 专节 | 用户可按清单点完 §七 | 文档存在且链接 `/tarot` |

---

## 七、验收矩阵

### 7.1 代理/本地（随项）

| 场景 | 操作 | 期望 |
|------|------|------|
| 默认音频 | 新会话进塔罗抽牌 | **有** sfx；**无** 背景循环 |
| 关音效 | T00 关 sfx 后抽牌 | sfx 无声；刷新仍无 |
| 背景 | 默认 / 未开 ambient | 无垫乐；开 ambient 后才有（若已实现） |
| 冷启动 | `/tarot` | 题型可选 |
| 事业 | `/tarot?type=career` | 事业高亮 |
| 三牌仪式 | 问题→开始→洗牌→抽 3→翻 | W1 行为 |
| 解读 | 开始解读 | LoadingRitual + 结果结构 |
| 结果 | 金句+再问 | W3 |
| 单张 | 若 T16 | 1 牌闭环 |
| reduce | T24 | 全流程可完成 |
| Baseline | smoke 可选 | asset 404 / 无 manus 等 |

### 7.2 用户总检（全部 `[x]`/`[skip]` 后 · 一次）

1. iPhone 宽度：三牌完整 + career 一次  
2. 主观：仪式感 ↑、不廉价  
3. 默认有短音效；关「音效」后无 sfx；「背景声」默认关  

4. 明文 **可以 push** 才会上传  

---

## 八、路径索引

| 路径 | 内容 |
|------|------|
| `client/src/pages/Tarot.tsx` | 阶段机、抽牌、playTone |
| `client/src/components/TarotReport.tsx` | 结果结构 |
| `client/src/components/ShareResultCard.tsx` | 金句 + **已有出图** |
| `client/src/components/LoadingRitual.tsx` | 长等待 |
| `client/src/components/CrossSellCard.tsx` | **已有** cross-sell |
| `client/src/components/TextToSpeech.tsx` | **已有** TTS |
| `client/src/lib/tarotReportFormat.tsx` | 金句/格式 |
| `client/src/locales/zh.ts` · `en.ts` | 文案 |
| `server/routers/tarot.ts` | 解读 API |
| `server/tarot-database.ts` | **keywords / reversed 权威数据** |
| `server/tarot-ui-structure.test.ts` 等 | 结构测试 |
| `PROGRESS_TAROT.md` | 进度 |
| `package.json` | dev / test；`framer-motion` · `html-to-image` 已存在 |

---

## 九、本地命令

```bash
cd /tmp/fortune-insight-   # 或你的 clone
pnpm install
pnpm dev                   # 记下端口
# 主路径: /tarot  /tarot?type=career
pnpm exec tsc --noEmit
pnpm exec vitest run server/tarot-ui-structure.test.ts server/tarot-report-structure.test.ts
# T23 后追加本 goal 相关 test 文件
bash scripts/local_smoke.sh http://127.0.0.1:PORT   # 可选 baseline
```

---

## 十、PROGRESS_TAROT.md

**更新**（勿假装不存在）已有文件：

```markdown
| 日期 | ID | 结果 | 本地URL | 遗留 |
|------|-----|------|---------|------|
| YYYY-MM-DD | T00 | PASS | http://… | … |
```

- 每项 1 行；波次结束写 `Wn DONE` 小结（含 reduce 自检）  
- 未获 push 授权不得写「已上线」  

---

## 十一、设计原则

1. 先仪式后装饰（W1 完再重粒子/牌艺细节）。  
2. 可读 > 炫（结果 3 秒金句）。  
3. 可关可减（ambient 默关、sfx 可关 + reduce）。  
4. 视觉语言：金 `#d4a843`、深紫底、克制 glow。  
5. 失败可恢复（分享/TTS/动画中断 → toast）。  
6. 测得出（钩子 + 验收句）。  
7. **复用牌库与现成分享/TTS/CrossSell**。  

---

## 十二、依赖与资产

| 需求 | 策略 |
|------|------|
| 动画 | `framer-motion`（已有） |
| 出图 | `html-to-image` via ShareResultCard（已有） |
| 牌面 | SVG/几何；禁止未授权 tarot 图包 |
| 音效 sfx | Web Audio 短音；默认 on；服从 `fi.tarot.sfx` |
| 背景 ambient | 若做循环垫乐：默认 **off**；服从 `fi.tarot.ambient` |
| 新依赖 | 默认禁止；破例须 PROGRESS 写理由 |

---

## 十三、DoD

1. §六 全部 `[x]` 或 `[skip]`（skip 有理由）  
2. T23–T25 PASS  
3. PROGRESS_TAROT.md 完整 + 各波 reduce 小结  
4. Baseline 未回归（smoke 或手测记录）  
5. 用户完成 §7.2 并（若需上传）明文 **可以 push**  

此前：**不得**默认 push，**不得**声称已上线。

---

## 十四、启动检查清单（第一轮）

- [ ] `pnpm dev` 可用  
- [ ] 已读阶段机 `select | question | drawing | result`  
- [ ] 已读 PROGRESS_TAROT.md  
- [ ] 确认 T00 为第一项（非 T01）  
- [ ] 确认 html-to-image / ShareResultCard / tarot-database keywords 存在  

---

## 十五、MVP 切片（可选 · 用户说「只跑 MVP」时）

**最小可感 ship 集**（仍本地验完再 push）：

`T00 → T01 → T02 → T03 → T06 → T07 → T11 → T12 → T13 → T23 → T24 → T25`

其余可 `[skip]` 并记「MVP 外延后」。

---

## 十六、已知仓库锚点（代理勿重复发明）

| 能力 | 位置 |
|------|------|
| 阶段机 | `Tarot.tsx` Stage 四态 |
| playTone / draw / reveal | `Tarot.tsx` |
| 出图 | `ShareResultCard` + `html-to-image` |
| CrossSell | 结果区已挂 |
| TTS | 结果区已挂 TextToSpeech |
| keywords / reversed 文案 | `server/tarot-database.ts` |
| 前端 isReversed 分享 | `structuredCards` → ShareResultCard positions |

---

*v1.1.1 · 背景默静音 / 交互音效默认保留 · 本地总检后再上传*  
