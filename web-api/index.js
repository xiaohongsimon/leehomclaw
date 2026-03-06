/**
 * OpenClaw Web API Server
 * 
 * 启动方式：
 *   npm start
 * 
 * 公网暴露：
 *   ngrok http 3456
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3456;

// 中间件
app.use(cors());
app.use(express.json());

// API Key 认证（可选）
const API_KEY = process.env.API_KEY || null;

function authMiddleware(req, res, next) {
  if (!API_KEY) {
    return next(); // 未设置 API Key 时跳过认证
  }
  
  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey === API_KEY || authHeader === `Bearer ${API_KEY}`) {
    return next();
  }
  
  return res.status(401).json({ error: 'Unauthorized' });
}

// ==================== 路由 ====================

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 文档
app.get('/', (req, res) => {
  res.json({
    name: 'OpenClaw Web API',
    version: '1.0.0',
    endpoints: {
      'GET /health': '健康检查',
      'POST /api/execute': '执行 OpenClaw 工具',
      'GET /api/status': '查看任务状态',
      'POST /api/nightowl/start': '启动 NightOwl',
      'GET /api/nightowl/status': 'NightOwl 状态'
    },
    auth: API_KEY ? 'API Key required' : 'No auth required'
  });
});

// 执行工具（核心接口）
app.post('/api/execute', authMiddleware, async (req, res) => {
  const { tool, args } = req.body;
  
  if (!tool) {
    return res.status(400).json({ error: 'Missing tool parameter' });
  }
  
  console.log(`[API] 执行工具：${tool}`, args);
  
  // 这里调用 OpenClaw 工具
  // 简化版本：写入命令文件，由主进程处理
  const commandFile = path.join(__dirname, 'pending-commands.jsonl');
  const command = {
    id: Date.now(),
    tool,
    args,
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  
  require('fs').appendFileSync(commandFile, JSON.stringify(command) + '\n');
  
  res.json({
    success: true,
    command_id: command.id,
    status: 'pending',
    message: '命令已加入队列'
  });
});

// 查看命令状态
app.get('/api/status/:commandId', authMiddleware, (req, res) => {
  const { commandId } = req.params;
  const fs = require('fs');
  const commandFile = path.join(__dirname, 'pending-commands.jsonl');
  
  if (!fs.existsSync(commandFile)) {
    return res.status(404).json({ error: 'No commands found' });
  }
  
  const lines = fs.readFileSync(commandFile, 'utf-8').trim().split('\n');
  const command = lines
    .map(line => JSON.parse(line))
    .find(cmd => cmd.id == commandId);
  
  if (!command) {
    return res.status(404).json({ error: 'Command not found' });
  }
  
  res.json(command);
});

// NightOwl 相关
app.post('/api/nightowl/start', authMiddleware, (req, res) => {
  const { exec } = require('child_process');
  const nightowlDir = path.join(process.env.HOME, '.openclaw', 'workspace', 'nightowl');
  
  exec(`cd ${nightowlDir} && ./start.sh`, (error, stdout) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({
      success: true,
      message: 'NightOwl 已启动',
      output: stdout
    });
  });
});

app.get('/api/nightowl/status', authMiddleware, (req, res) => {
  const fs = require('fs');
  const stateFile = path.join(process.env.HOME, '.openclaw', 'workspace', 'nightowl', 'nightowl-state.json');
  
  if (!fs.existsSync(stateFile)) {
    return res.status(404).json({ error: 'NightOwl not running' });
  }
  
  try {
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
    res.json(state);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== 错误处理 ====================

app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ==================== 启动 ====================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║           OpenClaw Web API Server                      ║
╠════════════════════════════════════════════════════════╣
║  本地访问：http://localhost:${PORT}                     ║
║  公网访问：运行 ngrok http ${PORT}                      ║
║  API 认证：${API_KEY ? '已启用' : '未启用'}                              ║
╚════════════════════════════════════════════════════════╝
  `);
});
