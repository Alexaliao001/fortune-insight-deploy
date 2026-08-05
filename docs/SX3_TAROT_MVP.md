# SX3 — 访客免费塔罗 1 牌阵 MVP

> 任务源：`~/quantradar/GROK_GOAL_SITES_EXTREME.md` · SX3  
> 日期：2026-07-13  
> 部署：Nube VPS `fortune.service` · 域 `fortunesite.one`

## 产品切片（只做这些）

| 做 | 不做（默认） |
|----|--------------|
| 访客 **1 张牌** 预览（大阿尔卡那 22 张） | 完整 78 张 / 复杂牌阵 |
| 规则牌义（中英关键词 + 短解读） | LLM 润色（SX3-5 授权后） |
| `POST /api/tarot/preview` 结构化 JSON | 登录 / 支付 / 历史云存 |
| 每 IP 滑动窗口限流 | Stripe / 会员 |
| 静态页 `/free-tarot` 接真 API | 改造整站 Manus SPA |

## API 契约

```http
POST /api/tarot/preview
Content-Type: application/json

{ "question": "optional string", "language": "zh" | "en" }
```

成功 `200`:

```json
{
  "ok": true,
  "spread": "single",
  "card": {
    "id": 0,
    "name_en": "The Fool",
    "name_zh": "愚者",
    "upright": true,
    "keywords": ["beginnings", "faith"],
    "meaning": "…"
  },
  "summary": "…",
  "disclaimer": "Educational / entertainment only — not professional advice.",
  "source": "rules",
  "meta": { "version": "sx3-1.0", "rate_remaining": 19 }
}
```

限流：`429` + `{ "ok": false, "error": "rate_limited" }`  
无 AI key 时：`source` 恒为 `"rules"`（本 MVP 不调 LLM）。

## 健康检查

```http
GET /health
→ { "ok": true, "service": "fortune-insight", "tarot_preview": true, "manus_login": false }
```

## 前端

- 生产 SPA 仍为营销壳（`/tarot` 等可能依赖已下线 trpc）。  
- **可产品路径**：https://fortunesite.one/free-tarot  
- 失败：页面显示错误/空态，**不白屏、不装成功**。

## 验收

```bash
curl -sS https://fortunesite.one/health
curl -sS -X POST https://fortunesite.one/api/tarot/preview \
  -H 'content-type: application/json' \
  -d '{"language":"zh","question":"today"}'
# 浏览器打开 /free-tarot 抽 1 次
python3 ~/quantradar/scripts/sites_extreme_verify.py
```
