# OpenClaw Web API

将 OpenClaw 能力暴露为公网可访问的 REST API。

---

## 快速启动

### 1. 启动服务

```bash
cd ~/.openclaw/workspace/web-api
npm start
```

### 2. 暴露到公网

**方式 A：ngrok（推荐）**

```bash
# 安装 ngrok
brew install ngrok

# 启动隧道
ngrok http 3456
```

**方式 B：Cloudflare Tunnel**

```bash
# 安装 cloudflared
brew install cloudflared

# 启动隧道
cloudflared tunnel --url http://localhost:3456
```

---

## API 接口

### 健康检查

```bash
curl https://<ngrok-url>.ngrok.io/health
```

### 执行工具

```bash
curl -X POST https://<ngrok-url>.ngrok.io/api/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "tool": "web_search",
    "args": { "query": "AI agent 2026" }
  }'
```

### 查看状态

```bash
curl https://<ngrok-url>.ngrok.io/api/status/<command_id>
```

### 启动 NightOwl

```bash
curl -X POST https://<ngrok-url>.ngrok.io/api/nightowl/start \
  -H "X-API-Key: your-api-key"
```

### NightOwl 状态

```bash
curl https://<ngrok-url>.ngrok.io/api/nightowl/status
```

---

## 安全配置

### 启用 API Key 认证

```bash
# 生成随机 Key
openssl rand -hex 32

# 写入 .env 文件
cp .env.example .env
# 编辑 .env，填入 API_KEY
```

### 调用时携带 Key

```bash
# 方式 1：X-API-Key 头
curl -H "X-API-Key: your-key" ...

# 方式 2：Authorization 头
curl -H "Authorization: Bearer your-key" ...
```

---

## 部署选项

### 选项 A：本地运行 + ngrok（开发/测试）

- ✅ 快速启动
- ✅ 免费
- ❌ ngrok URL 每次重启变化
- ❌ 依赖本地机器

### 选项 B：云服务器（生产环境）

**推荐服务商：**
- Vercel（免费，Serverless）
- Railway（$5/月）
- DigitalOcean（$6/月）
- AWS Lambda（按量付费）

### 选项 C：Cloudflare Tunnel（推荐生产）

- ✅ 固定域名
- ✅ 免费
- ✅ DDoS 保护
- ❌ 需要 Cloudflare 账号

---

## 扩展接口

在 `index.js` 中添加新接口：

```javascript
app.post('/api/your-function', authMiddleware, async (req, res) => {
  const { param1, param2 } = req.body;
  
  // 调用 OpenClaw 工具
  // ...
  
  res.json({ result: '...' });
});
```

---

## 监控

### 查看日志

```bash
tail -f ~/.openclaw/workspace/web-api/pending-commands.jsonl
```

### 查看活跃连接

```bash
# ngrok 控制台
http://localhost:4040
```

---

## 故障排除

### 端口被占用

```bash
# 查看占用端口的进程
lsof -i :3456

# 杀死进程
kill -9 <PID>
```

### ngrok 连接失败

```bash
# 检查 ngrok 状态
ngrok http 3456 --log stderr
```

---

**版本：** 1.0.0
**最后更新：** 2026-03-06
