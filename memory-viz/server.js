const express = require('express');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = 3030;
const WORKSPACE = '/Users/leehom/.openclaw/workspace';

// 内存数据库
let graphData = { nodes: [], links: [] };

// 解析记忆文件
function parseMemoryFiles() {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();

  // 读取 MEMORY.md
  const memoryPath = path.join(WORKSPACE, 'MEMORY.md');
  if (fs.existsSync(memoryPath)) {
    const content = fs.readFileSync(memoryPath, 'utf-8');
    const entities = extractEntities(content, 'MEMORY.md');
    entities.forEach(e => {
      if (!nodeMap.has(e.id)) {
        nodeMap.set(e.id, e);
        nodes.push(e);
      }
    });
  }

  // 读取 memory/*.md 文件
  const memoryDir = path.join(WORKSPACE, 'memory');
  if (fs.existsSync(memoryDir)) {
    const files = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md') && !f.includes('/'));
    files.forEach(file => {
      const filePath = path.join(memoryDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const entities = extractEntities(content, file);
      
      // 添加日期节点
      const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        const dateNode = {
          id: dateMatch[1],
          label: dateMatch[1],
          type: 'date',
          group: 'timeline'
        };
        if (!nodeMap.has(dateNode.id)) {
          nodeMap.set(dateNode.id, dateNode);
          nodes.push(dateNode);
        }
        
        // 连接事件到日期
        entities.forEach(e => {
          if (e.type === 'event' || e.type === 'decision') {
            links.push({
              source: e.id,
              target: dateNode.id,
              type: 'OCCURRED_ON'
            });
          }
        });
      }
      
      entities.forEach(e => {
        if (!nodeMap.has(e.id)) {
          nodeMap.set(e.id, e);
          nodes.push(e);
        }
      });
    });
  }

  // 添加 TODOS 中的任务节点
  const todosPath = path.join(WORKSPACE, 'TODOS.md');
  if (fs.existsSync(todosPath)) {
    const content = fs.readFileSync(todosPath, 'utf-8');
    const tasks = extractTasks(content);
    tasks.forEach(t => {
      if (!nodeMap.has(t.id)) {
        nodeMap.set(t.id, t);
        nodes.push(t);
      }
    });
  }

  // 自动生成关系
  generateRelationships(nodes, links);

  graphData = { nodes, links };
  return graphData;
}

// 从 Markdown 内容提取实体
function extractEntities(content, source) {
  const entities = [];
  
  // 提取组织/项目
  const orgPatterns = [
    /支付宝/gi, /OpenClaw/gi, /GitHub/gi, /Discord/gi, /Neo4j/gi
  ];
  orgPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const label = match[0];
      entities.push({
        id: label.toLowerCase().replace(/\s+/g, '-'),
        label: label,
        type: 'entity',
        group: 'organization',
        source: source
      });
    }
  });

  // 提取人物
  const personPatterns = [
    /顾立宏/gi, /立宏/gi, /枢/gi, /Shū/gi
  ];
  personPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const label = match[0];
      entities.push({
        id: label.toLowerCase().replace(/\s+/g, '-'),
        label: label,
        type: 'entity',
        group: 'person',
        source: source
      });
    }
  });

  // 提取核心概念
  const conceptPatterns = [
    /人机共生/gi, /数据飞轮/gi, /模型可控性/gi, /业务洞察/gi,
    /超级个体/gi, /降维赋能/gi, /第一性原理/gi, /Orchestra/gi,
    /MCP/gi, /Agent Memory/gi, /Knowledge Graph/gi
  ];
  conceptPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const label = match[0];
      entities.push({
        id: label.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
        label: label,
        type: 'concept',
        group: 'concept',
        source: source
      });
    }
  });

  // 提取事件
  const eventPatterns = [
    /AI 时代组织转型研讨/gi, /AI 组织转型/gi, /Orchestra 框架/gi,
    /记忆可视化/gi, /nightowl/gi
  ];
  eventPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const label = match[0];
      entities.push({
        id: label.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
        label: label,
        type: 'event',
        group: 'event',
        source: source
      });
    }
  });

  // 去重
  const unique = new Map();
  entities.forEach(e => {
    if (!unique.has(e.id)) unique.set(e.id, e);
  });
  
  return Array.from(unique.values());
}

// 提取任务
function extractTasks(content) {
  const tasks = [];
  const lines = content.split('\n');
  
  lines.forEach(line => {
    const match = line.match(/- \[([ x])\]\s+(.+)/);
    if (match) {
      const status = match[1] === 'x' ? 'completed' : 'pending';
      const label = match[2].replace(/✅|⚠️|🔴|🟡|🟢/g, '').trim();
      const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').substring(0, 50);
      
      tasks.push({
        id: `task-${id}`,
        label: label.substring(0, 40) + (label.length > 40 ? '...' : ''),
        type: 'task',
        group: status,
        status: status,
        source: 'TODOS.md'
      });
    }
  });
  
  return tasks;
}

// 自动生成关系
function generateRelationships(nodes, links) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  
  // 人物参与事件
  const persons = nodes.filter(n => n.group === 'person');
  const events = nodes.filter(n => n.type === 'event');
  persons.forEach(p => {
    events.forEach(e => {
      links.push({
        source: p.id,
        target: e.id,
        type: 'PARTICIPATED_IN'
      });
    });
  });

  // 概念与事件关联
  const concepts = nodes.filter(n => n.type === 'concept');
  events.forEach(e => {
    concepts.forEach(c => {
      if (Math.random() > 0.6) { // 随机连接避免过于密集
        links.push({
          source: c.id,
          target: e.id,
          type: 'RELATED_TO'
        });
      }
    });
  });

  // 组织与概念关联
  const orgs = nodes.filter(n => n.group === 'organization');
  orgs.forEach(o => {
    concepts.forEach(c => {
      if (Math.random() > 0.7) {
        links.push({
          source: o.id,
          target: c.id,
          type: 'USES'
        });
      }
    });
  });
}

// API: 获取图谱数据
app.get('/api/graph', (req, res) => {
  parseMemoryFiles();
  res.json(graphData);
});

// API: 重新解析
app.post('/api/refresh', (req, res) => {
  parseMemoryFiles();
  res.json({ success: true, nodes: graphData.nodes.length, links: graphData.links.length });
});

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 主页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🧠 Memory Viz running at http://localhost:${PORT}`);
  parseMemoryFiles();
  console.log(`   Loaded ${graphData.nodes.length} nodes, ${graphData.links.length} links`);
});
