#!/bin/bash
# NightOwl 状态查看脚本

cd "$(dirname "$0")"

echo "🦉 NightOwl 状态"
echo "================"
echo ""

# 检查进程
if [ -f nightowl.pid ]; then
  PID=$(cat nightowl.pid)
  if ps -p $PID > /dev/null 2>&1; then
    echo "✅ 进程运行中 (PID: $PID)"
  else
    echo "❌ 进程已停止 (PID: $PID)"
  fi
else
  echo "❌ 未找到进程"
fi

echo ""

# 显示状态
if [ -f nightowl-state.json ]; then
  echo "📊 当前状态:"
  jq -r '
    "  会话 ID: \(.session_id)",
    "  状态：\(.status)",
    "  轮次：\(.rounds_completed) / \(.total_rounds)",
    "  当前主题：\(.current_focus.topic)",
    "  发现数：\(.discoveries | length)",
    "  开始时间：\(.started_at)",
    "  最后更新：\(.last_updated)"
  ' nightowl-state.json 2>/dev/null || cat nightowl-state.json
else
  echo "📊 状态文件不存在"
fi

echo ""

# 显示最新日志
if [ -f nightowl-log.md ]; then
  echo "📝 最新日志 (最后 5 行):"
  tail -5 nightowl-log.md
fi
