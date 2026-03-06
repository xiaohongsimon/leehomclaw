#!/bin/bash
# NightOwl 停止脚本

cd "$(dirname "$0")"

if [ -f nightowl.pid ]; then
  PID=$(cat nightowl.pid)
  if ps -p $PID > /dev/null 2>&1; then
    kill $PID
    echo "✅ NightOwl 已停止 (PID: $PID)"
    rm -f nightowl.pid
    
    # 更新状态为停止
    if [ -f nightowl-state.json ]; then
      jq '.status = "stop_requested"' nightowl-state.json > tmp.json && mv tmp.json nightowl-state.json
      echo "📝 状态已更新为 stop_requested"
    fi
  else
    echo "⚠️  进程不存在 (PID: $PID)"
    rm -f nightowl.pid
  fi
else
  echo "⚠️  未找到 PID 文件"
  # 尝试查找并杀死所有 nightowl 进程
  pkill -f "node orchestrator.js" && echo "✅ 已停止所有 nightowl 进程" || echo "⚠️  未找到 nightowl 进程"
fi
