import React from 'react'

function Timeline({ events }) {
  return (
    <div className="timeline">
      <h2>📅 时间线</h2>
      <div className="timeline-container">
        {events.map((event, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker">
              <div className={`marker ${event.status}`}></div>
              {index < events.length - 1 && <div className="line"></div>}
            </div>
            <div className="timeline-content">
              <span className="time">{event.time}</span>
              <div className="event-detail">
                <span className="type">{event.type === 'task' ? '📋 任务' : '🚀 项目'}</span>
                <span className="title">{event.title}</span>
                <span className={`status-badge ${event.status}`}>
                  {event.status === 'completed' ? '已完成' : '进行中'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
