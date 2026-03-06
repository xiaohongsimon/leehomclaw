# Memory Visualization Demo

AI Agent 记忆可视化系统 - 将离散的记忆文件转化为交互式知识图谱

## 核心功能

1. **自动解析** - 从 `memory/*.md` 和 `MEMORY.md` 提取实体与关系
2. **图谱可视化** - D3.js 力导向图展示记忆网络
3. **时间线视图** - 按时间轴展示记忆演化
4. **搜索与过滤** - 快速定位关键记忆节点

## 技术栈

- **后端**: Node.js + Express
- **图谱解析**: 自定义 Markdown 解析器
- **前端**: D3.js + HTML/CSS
- **数据存储**: 内存 + 可选 SQLite

## 快速启动

```bash
cd memory-viz
npm install
npm start
# 访问 http://localhost:3030
```

## 记忆节点类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `entity` | 人物、组织、项目 | 顾立宏、支付宝、OpenClaw |
| `event` | 关键事件 | AI 组织转型研讨 |
| `decision` | 重要决策 | 采用 Orchestra 框架 |
| `concept` | 核心概念 | 人机共生、数据飞轮 |
| `task` | 待办任务 | 记忆可视化开发 |

## 关系类型

- `PARTICIPATED_IN` - 参与事件
- `DECIDED_ON` - 做出决策
- `RELATED_TO` - 概念关联
- `WORKING_ON` - 正在进行
- `BLOCKED_BY` - 被阻塞

---

**状态**: 开发中 (2026-03-07 夜间启动)
**优先级**: 高 (HEARTBEAT.md 夜间项目)
