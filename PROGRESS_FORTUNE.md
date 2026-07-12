# Fortune Insight /goal 进度

**Base 线上：** https://fortunesite.one  
**Base 本地：** http://127.0.0.1:56310（若 dev 仍开着）  
**Git：** `main` @ `361df69` 已 push；后续见最新 commit  

**用户节点：** push 授权 → Manus 发布 → 线上只读冒烟 OK → 「对了 继续」

| ID | 状态 | 验证 |
|----|------|------|
| F0-1 | `[ship]` | 线上 `/assets/no-such*.js` → **404 非 HTML**（CF 可能空 body） |
| F0-2 | `[ship]` | 线上 `auth.me` 无 passwordHash |
| F0-3 | `[ship]` | 线上 Login shell + chunks 无 manus |
| F0-4 | `[ship]` | 本地非 admin FORBIDDEN 403 |
| F0-5 | `[ship]` | 本地 BAD_REQUEST / UNAUTHORIZED |
| F0-6 | `[ship]` | 本地 cache key 语言隔离 |
| F0-7 | `[ship]` | 线上 Tarot chunk 含 drawing 仪式结构 |
| F0-8 | `[ship]` | 结构测试 + 结果页组件 |
| F1-1 | `[ship]` | 线上 Home chunk 含「求职 · 事业」 |
| F1-2 | `[ship]` | ShareResultCard 金句 |
| F1-3 | `[ship]` | LOCAL_PREVIEW.md |
| F1-4 | `[ship]` | 默认试用 **14 天**（`DEFAULT_SIGNUP_TRIAL_DAYS`） |
| F2-1 | `[ship]` | 线上 Community chunk 含 getComments |
| F2-2 | `[ship]` | LoadingRitual 长等待 |
| F2-3 | `[ship]` | local_smoke + **prod_smoke.sh** |

### 继续项（本轮）

- 新增 `scripts/prod_smoke.sh`：对 fortunesite.one 只读冒烟  

### 可选后续（未排期）

- 404 文案与本地对齐（CF/CDN 空 body，非功能回归）  
- F0-7 主观仪式感人眼再评  
- 新功能 / 转化漏斗（需另开 backlog）  
