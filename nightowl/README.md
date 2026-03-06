# NightOwl v2.0 - 夜间自主探索

> 让用户安心睡觉，醒来时世界已经不一样了。

---

## 快速启动

### 默认探索（6 轮，约 3 小时）

```bash
cd ~/.openclaw/workspace/nightowl
./start.sh
```

### 自定义主题

```bash
./start.sh "MCP 生态新插件" "Claude Opus 4.6 新特性"
```

---

## 管理命令

### 查看状态

```bash
./status.sh
```

### 停止任务

```bash
./stop.sh
```

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `orchestrator.js` | 主理人脚本（核心） |
| `nightowl-state.json` | 实时状态（探索进度、发现） |
| `nightowl-log.md` | 执行日志 |
| `report.md` | 最终报告（完成后生成） |
| `orchestrator.log` | 主理人进程日志 |

---

## 输出说明

### 启动通知（钉钉）

```
🦉 NightOwl 已启动

会话 ID: nightowl-2026-03-06
开始时间：2026-03-06 23:40:00
预计完成：2026-03-07 02:40:00
总轮次：6 轮

主理人已接管，全程无需参与。
明早醒来查看报告即可。

晚安。
```

### 完成通知（钉钉）

```
🌅 NightOwl 探索完成

会话 ID: nightowl-2026-03-06
执行时长：180 分钟
完成轮次：6 / 6
发现数量：12 条

报告位置：~/.openclaw/workspace/nightowl/report.md

请在 Obsidian 中查看完整报告。
```

---

## 探索主题（默认）

| 轮次 | 主题 |
|------|------|
| 1 | AI Agent 架构与前沿 |
| 2 | MCP 生态与工具链 |
| 3 | Hacker News 热门项目 |
| 4 | GitHub Trending AI |
| 5 | Agent Memory 方案 |
| 6 | 自主探索发现 |

---

## 技术架构

```
用户说"晚安，去吧"
       ↓
主理人启动（orchestrator.js）
       ↓
┌─────────────────────────────────────┐
│  主理人循环（3 小时）                 │
│  - 执行第 1 轮探索                    │
│  - 执行第 2 轮探索                    │
│  - ...                              │
│  - 执行第 6 轮探索                    │
│  - 生成报告                         │
│  - 发送钉钉通知                     │
└─────────────────────────────────────┘
       ↓
用户醒来收到报告
```

---

## 注意事项

1. **确保网络畅通** - 探索需要访问 GitHub/X/YouTube 等
2. **保持 Mac 唤醒** - 睡眠可能导致进程暂停
3. **钉钉配置** - 确保钉钉插件已配置
4. **磁盘空间** - 日志和状态文件会增长

---

## 故障排除

### 进程意外停止

```bash
# 查看日志
tail -f orchestrator.log

# 重新启动
./start.sh
```

### 状态文件损坏

```bash
# 备份
cp nightowl-state.json nightowl-state.json.bak

# 手动修复或重新启动
./stop.sh
./start.sh
```

### 钉钉消息未发送

检查 `~/.openclaw/openclaw.json` 中的钉钉配置：
- clientId
- clientSecret
- userId

---

## 版本

v2.0 - 主理人架构，用户完全离线

---

**NightOwl 核心理念：**

> 让用户安心睡觉，醒来时世界已经不一样了。
