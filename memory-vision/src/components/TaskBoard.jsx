import React from 'react'

function TaskBoard({ tasks, mistakes }) {
  return (
    <div className="task-board">
      <div className="board-column">
        <h3>📊 任务统计</h3>
        <div className="progress-card">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(tasks.completed / tasks.total) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            完成率：{Math.round((tasks.completed / tasks.total) * 100)}%
          </div>
        </div>
      </div>

      <div className="board-column">
        <h3>✅ 已完成</h3>
        <div className="task-list completed">
          <div className="task-item">权限确认</div>
          <div className="task-item">Obsidian 迁移</div>
          <div className="task-item">GitHub Token 配置</div>
          <div className="task-item">心跳测试</div>
          <div className="task-item">记忆可视化规划</div>
        </div>
      </div>

      <div className="board-column">
        <h3>⏳ 待完成</h3>
        <div className="task-list pending">
          <div className="task-item">工作场景说明（等待中）</div>
          <div className="task-item">记忆可视化开发</div>
          <div className="task-item">多 Agent 配置</div>
        </div>
      </div>

      <div className="board-column full-width">
        <h3>⚠️ 错误趋势</h3>
        <div className="mistake-stats">
          <div className="mistake-stat">
            <span className="label">今日错误</span>
            <span className="value high">1</span>
          </div>
          <div className="mistake-stat">
            <span className="label">累计错误</span>
            <span className="value">{mistakes.length}</span>
          </div>
          <div className="mistake-stat">
            <span className="label">严重错误</span>
            <span className="value high">1</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskBoard
