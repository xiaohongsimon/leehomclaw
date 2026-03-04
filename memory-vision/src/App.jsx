import React, { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard.jsx'
import Timeline from './components/Timeline.jsx'
import TaskBoard from './components/TaskBoard.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [data, setData] = useState(null)

  useEffect(() => {
    // 模拟加载记忆数据
    const mockData = {
      today: {
        date: '2026-03-04',
        tasks: { total: 12, completed: 8, pending: 4 },
        mistakes: 10,
        memories: 1,
        events: [
          { time: '10:36', type: 'task', title: '权限确认', status: 'completed' },
          { time: '11:09', type: 'task', title: 'Obsidian 迁移', status: 'completed' },
          { time: '12:00', type: 'task', title: 'GitHub Token 配置', status: 'completed' },
          { time: '12:26', type: 'task', title: '心跳测试', status: 'completed' },
          { time: '13:00', type: 'project', title: '记忆可视化项目规划', status: 'completed' },
        ]
      },
      mistakes: [
        { id: 1, title: '模型诊断错误', date: '2026-03-03', category: '判断' },
        { id: 2, title: 'Docker 建议仓促', date: '2026-03-03', category: '沟通' },
        { id: 10, title: '隐私保护疏漏', date: '2026-03-04', category: '安全', severity: 'high' },
      ],
      capabilities: [
        { name: 'exec', status: 'active' },
        { name: 'fs', status: 'active' },
        { name: 'message', status: 'active' },
        { name: 'browser', status: 'active' },
        { name: 'Claude Code', status: 'active' },
      ]
    }
    setData(mockData)
  }, [])

  if (!data) {
    return <div className="loading">加载记忆数据中...</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🧠 Memory Vision</h1>
        <nav className="nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'timeline' ? 'active' : ''}
            onClick={() => setActiveTab('timeline')}
          >
            时间线
          </button>
          <button 
            className={activeTab === 'tasks' ? 'active' : ''}
            onClick={() => setActiveTab('tasks')}
          >
            任务看板
          </button>
        </nav>
      </header>

      <main className="main">
        {activeTab === 'dashboard' && <Dashboard data={data} />}
        {activeTab === 'timeline' && <Timeline events={data.today.events} />}
        {activeTab === 'tasks' && <TaskBoard tasks={data.today.tasks} mistakes={data.mistakes} />}
      </main>

      <footer className="footer">
        <p>Memory Vision v0.1.0 - OpenClaw 记忆可视化系统</p>
      </footer>
    </div>
  )
}

export default App
