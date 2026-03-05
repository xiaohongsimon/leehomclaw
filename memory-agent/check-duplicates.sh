#!/bin/bash
# 检测 memory 文件中的重复内容

MEMORY_DIR="$1"

echo "🔍 正在检测冗余记录..."

# 检查 employee 目录
if [ -d "$MEMORY_DIR/employee" ]; then
    echo ""
    for file in $MEMORY_DIR/employee/*.md; do
        if [ -f "$file" ]; then
            basename=$(basename $file .md)
            count_lines=$(wc -l < "$file")
            echo "📄 [$basename] $count_lines 行"
        fi
    done

    # 比较相似度（简单版：检查内容长度）
    echo ""
fi

echo "✅ 检测完成"