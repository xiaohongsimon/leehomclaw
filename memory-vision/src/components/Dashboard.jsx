import React from 'react'

function Dashboard({ data }) {
  const { today, mistakes, capabilities } = data

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>📋 今日任务</h3>
          <div className="stat-value">{today.tasks.total}</div>
          <div className="stat-detail">
            <span className="success">✅ {today.tasks.completed}</span>
            <span className="pending">⏳ {today.tasks.pending}</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>⚠️ 错误记录</h3>
          <div className="stat-value">{mistakes.length}</div>
          <div className="stat-detail">累计错误数</div>
        </div>

        <div className="stat-card">
          <h3>🧠 记忆条目</h3>
          <div className="stat-value">{today.memories}</div>
          <div className="stat-detail">今日记录</div>
        </div>

        <div className="stat-card">
          <h3>🔧 可用能力</h3>
          <div className="stat-value">{capabilities.length}</div>
          <div className="stat-detail">已激活</div>
        </div>
      </div>

      <div className="section">
        <h2>📅 今日事件</h2>
        <div className="event-list">
          {today.events.map((event, index) => (
            <div key={index} className={`event-item ${event.status}`}>
              <span className="time">{event.time}</span>
              <span className="type">{event.type === 'task' ? '📋' : '🚀'}</span>
              <span className="title">{event.title}</span>
              <span className="status">{event.status === 'completed' ? '✅' : '⏳'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>⚠️ 最近错误</h2>
        <div className="mistake-list">
          {mistakes.slice(-5).map((mistake) => (
            <div key={mistake.id} className={`mistake-item ${mistake.severity || ''}`}>
              <span className="mistake-id">#{mistake.id}</span>
              <span className="mistake-title">{mistake.title}</span>
              <span className="mistake-category">{mistake.category}</span>
              <span className="mistake-date">{mistake.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
