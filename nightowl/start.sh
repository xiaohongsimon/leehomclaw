#!/bin/bash
# NightOwl 启动脚本
# 
# 使用方式：
#   ./start.sh                    # 启动默认 6 轮探索
#   ./start.sh "MCP 生态" "Claude 新特性"  # 自定义主题

cd "$(dirname "$0")"

# 清理旧的状态文件（如果需要）
# rm -f nightowl-state.json nightowl-log.md

# 启动主理人进程
nohup node orchestrator.js > orchestrator.log 2>&1 &
PID=$!

echo "🦉 NightOwl 已启动"
echo "   进程 ID: $PID"
echo "   日志文件：orchestrator.log"
echo "   状态文件：nightowl-state.json"
echo ""
echo "预计完成时间：$(date -v+${6:-3}H +%Y-%m-%d\ %H:%M)"
echo ""
echo "晚安，LH。"

# 保存 PID
echo $PID > nightowl.pid
