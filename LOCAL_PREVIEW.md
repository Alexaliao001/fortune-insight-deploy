# 本地预览（先测再 push）

## 启动

```bash
cd /tmp/fortune-insight-   # 或你的 clone
pnpm install
# 建议 .env（勿提交）：
# PORT=56310
# JWT_SECRET=...
# DATABASE_URL=mysql://fortune:fortune_local_dev@127.0.0.1:3306/fortune_insight
pnpm dev
```

当前 goal 会话：**http://127.0.0.1:56310**

## 全量浏览器自测（F0–F2）

| # | URL | 期望 |
|---|-----|------|
| 1 | `/` | 200；可见「求职·事业」横幅 |
| 2 | `/tarot?type=career` | 事业题型已选中/高亮 |
| 3 | `/tarot` | 抽牌仪式感（牌背/进度） |
| 4 | 塔罗走完结果 | 可读分段 + 金句/分享 |
| 5 | `/login` | 邮箱密码；源码无 `manus` |
| 6 | `/assets/no-such.js` | 纯文本 `Asset not found`（404） |
| 7 | 登录后 Network `auth.me` | **无** `passwordHash` |
| 8 | 非 admin 开 `/admin` 或调 admin API | 拒绝 / FORBIDDEN |
| 9 | 重复注册 / 错密 | 业务错误，非 500 |
| 10 | `/horoscope` | 中英切换不串缓存（有缓存或 key 时） |
| 11 | `/membership` | 试用说明；默认 14 天文案 |
| 12 | `/community` | 登录后发帖→评论→列表 |
| 13 | 八字长等待 | loading 有已用时提示（若触达） |

## 一键冒烟

```bash
# 本地
bash scripts/local_smoke.sh http://127.0.0.1:56310

# 线上（只读）
bash scripts/prod_smoke.sh https://fortunesite.one
```

## 试用天数（F1-4）

| `SIGNUP_TRIAL_DAYS` | 行为 |
|--------------------|------|
| 未设置 | **14 天**（当前产品默认） |
| `90` | 90 天 |
| `0` | 不发自动试用 |

## 推送

本地满意后说：**可以 push**。未说不得 `git push`。

## 塔罗全效果

见 [TAROT_PREVIEW.md](./TAROT_PREVIEW.md)。


## Product UX pages (八字 / 解梦 / 星座)

| Path | What to check |
|------|----------------|
| `/bazi` | Submit → staged LoadingRitual; result pull-quote; share summary non-empty |
| `/dream` | 「填入示例」fills only; loading ritual; pull-quote + share |
| `/horoscope` | Today takeaway above fold; deep analysis collapsed until expand; 14-day trial copy if guest |
