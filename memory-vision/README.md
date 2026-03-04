# Memory Vision 🧠

OpenClaw 记忆可视化系统 - 将文本记忆转换为交互式可视化界面

## 功能特性

- 📊 **Dashboard** - 概览今日任务、错误、记忆和能力状态
- 📅 **时间线** - 按时间顺序展示事件流
- 📋 **任务看板** - 任务进度和错误统计

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

## 技术栈

- React 18
- Vite
- D3.js (可视化)
- Tailwind CSS (样式)

## 项目结构

```
memory-vision/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Timeline.jsx
│   │   └── TaskBoard.jsx
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## MVP 状态

- ✅ Dashboard 组件
- ✅ 时间线组件
- ✅ 任务看板组件
- ✅ 基础样式
- ⏳ 真实 Markdown 数据解析（下一步）
- ⏳ 知识图谱（后续版本）

---

**v0.1.0** - MVP 原型完成
