# ⚠️ 路径检查清单

> 创建日期：2026-03-05
> 原因：再次混淆 `~/.openclaw/memory/` 和 `workspace/memory/`

---

## 🛑 写入文件前必须检查

### 第一步：停顿 3 秒

```
⏸️ 停顿
问自己：这个文件应该放在哪里？
```

### 第二步：路径判断

| 文件类型 | 正确路径 | 错误路径 |
|---------|---------|---------|
| 用户记忆/笔记 | `workspace/memory/` | ❌ `~/.openclaw/memory/` |
| 技能数据 | `workspace/memory/` | ❌ `~/.openclaw/memory/` |
| 报告文件 | `workspace/memory/reports/` | ❌ `~/.openclaw/memory/reports/` |
| 配置文件 | `workspace/` | ❌ `~/.openclaw/` (除非系统配置) |
| 系统数据 | `~/.openclaw/memory/` | ✅ 只有系统内部使用 |

### 第三步：绝对路径验证

```bash
# 写入前，在脑中展开绝对路径
memory/ai-scout/reports/xxx.md
  ↓
~/.openclaw/workspace/memory/ai-scout/reports/xxx.md ✅
```

---

## 🧠 记忆口诀

> **"工作区 = workspace，系统目录别乱写"**

> **"memory/ 开头 = workspace/memory/，不是 ~/.openclaw/memory/"**

---

## 📋 常见错误模式

### ❌ 错误思维

```
"写入 memory/ai-scout/..."
  ↓ (没有思考)
~/.openclaw/memory/ai-scout/ ❌
```

### ✅ 正确思维

```
"写入 memory/ai-scout/..."
  ↓ (停顿检查)
"memory/ = workspace/memory/"
  ↓
~/.openclaw/workspace/memory/ai-scout/ ✅
```

---

## 🔧 工具辅助

### 写入前执行验证命令

```bash
# 验证目标目录存在
ls -d ~/.openclaw/workspace/memory/ai-scout/ && echo "✅ 目录存在"

# 或直接用绝对路径
echo "xxx" > ~/.openclaw/workspace/memory/ai-scout/xxx.txt
```

---

## 📊 今天犯的错误

| 时间 | 错误 | 正确位置 |
|------|------|---------|
| 17:33 | 初始化到 `~/.openclaw/memory/ai-scout/` | `workspace/memory/ai-scout/` |
| 18:32 | v2 报告写到 `~/.openclaw/memory/ai-scout/reports/` | `workspace/memory/ai-scout/reports/` |

**根本原因**：没有建立强制检查机制，依赖不可靠的"记忆"

**解决方案**：
1. ✅ 创建此检查清单
2. ✅ 在技能文档中添加检查点注释
3. ✅ 写入前停顿 3 秒，展开绝对路径

---

## ✅ 承诺

**每次写入文件前，我都会：**
1. ⏸️ 停顿 3 秒
2. 🤔 问："这个文件应该放在哪里？"
3. ✅ 展开绝对路径验证
4. 📝 确认后再写入

---

_最后更新：2026-03-05_
_创建原因：避免再次混淆路径_
