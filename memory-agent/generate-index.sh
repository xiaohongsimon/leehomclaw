#!/bin/bash
# 生成 memory 索引和摘要

MEMORY_DIR="$1"

echo "📝 正在生成本周精华..."

# 读取今天的 memory
TODAY_FILE="$MEMORY_DIR/$(date '+%Y-%m-%d').md"
if [ -f "$TODAY_FILE" ]; then
    echo "📅 今日概览：" >> $MEMORY_DIR/.tmp/weekly-summary.md 2>/dev/null || echo "📅 今日概览：" > "$MEMORY_DIR/.tmp/weekly-summary.md"
    cat $TODAY_FILE >>"$MEMORY_DIR/.tmp/weekly-summary.md" 2>/dev/null || echo "- 今日记录已生成"
    printf "\n\n---\n" >>"$MEMORY_DIR/.tmp/weekly-summary.md"
fi

# 生成索引
echo "🗂️ 正在生成本周清单..."
{
    echo "# 本周日志"
    printf "\n📅 时间: $(date '+%Y-%m-%d %H:%M')\n\n"

    if [ -f "$MEMORY_DIR/2026-02-28.md" ]; then
        echo "## 📅 今日待办"
        grep -A 10 "**" "$MEMORY_DIR/2026-02-28.md" | head -20
    fi

} > "$MEMORY_DIR/.tmp/weekly-index.html"

echo "✅ 索引生成完成"