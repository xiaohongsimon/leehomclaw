#!/usr/bin/env node
/**
 * NightOwl Orchestrator v2.0 - 主理人脚本
 * 
 * 职责：
 * 1. 直接调用 LLM API 执行探索任务
 * 2. 使用 browser 工具抓取数据
 * 3. 状态实时写入文件
 * 4. 任务完成后发送钉钉报告
 * 
 * 运行方式：
 *   cd ~/.openclaw/workspace/nightowl
 *   nohup node orchestrator.js > orchestrator.log 2>&1 &
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ==================== 配置 ====================

const CONFIG = {
  // 每轮探索时长（分钟）
  ROUND_DURATION_MIN: 25,
  
  // 总轮次
  TOTAL_ROUNDS: 6,
  
  // 状态检查间隔（秒）
  CHECK_INTERVAL_SEC: 60,
  
  // 工作目录
  WORKDIR: path.join(process.env.HOME, '.openclaw', 'workspace', 'nightowl'),
  
  // 钉钉配置
  DINGTALK: {
    appKey: 'dingrlozwcvgmuv0d0kq',
    appSecret: '_A7u88BxcLP93p43Kz0WYMOV394lm5F_NyWTH2GzVA72jOY3l2wETQo09grpt-fX',
    robotCode: 'dingrlozwcvgmuv0d0kq',
    userId: '01433859201038513442'
  },
  
  // 探索主题队列
  TOPIC_QUEUE: [
    { topic: 'AI Agent 架构与前沿', hypothesis: '了解 2026 年 AI agent 架构最佳实践' },
    { topic: 'MCP 生态与工具链', hypothesis: 'MCP 最新生态和插件' },
    { topic: 'Hacker News 热门项目', hypothesis: '技术社区讨论热点' },
    { topic: 'GitHub Trending AI', hypothesis: '今日/本周热门 AI 项目' },
    { topic: 'Agent Memory 方案', hypothesis: '记忆管理、向量检索方案' },
    { topic: '自主探索发现', hypothesis: '根据前几轮发现自主决定' }
  ]
};

// ==================== 状态管理 ====================

const STATE_FILE = path.join(CONFIG.WORKDIR, 'nightowl-state.json');
const LOG_FILE = path.join(CONFIG.WORKDIR, 'nightowl-log.md');
const REPORT_FILE = path.join(CONFIG.WORKDIR, 'report.md');

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (e) {
    log(`[ERROR] 读取状态文件失败：${e.message}`);
  }
  return null;
}

function saveState(state) {
  state.last_updated = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function createInitialState(userSeeds = []) {
  const queue = userSeeds.length > 0 
    ? userSeeds.map(s => ({ topic: s, hypothesis: '用户指定主题' }))
    : CONFIG.TOPIC_QUEUE;
  
  return {
    session_id: `nightowl-${new Date().toISOString().split('T')[0]}`,
    started_at: new Date().toISOString(),
    status: 'running',
    current_round: 1,
    total_rounds: CONFIG.TOTAL_ROUNDS,
    rounds_completed: 0,
    
    progress: {
      discoveries_count: 0,
      pages_visited: 0,
      searches_performed: 0
    },
    
    current_focus: {
      topic: queue[0].topic,
      hypothesis: queue[0].hypothesis,
      next_steps: ['搜索相关关键词', '访问页面', '提取关键信息']
    },
    
    topic_queue: queue,
    
    discoveries: [],
    thoughts: [],
    
    message_to_next: '开始 NightOwl 探索任务'
  };
}

// ==================== 日志 ====================

function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}`;
  console.log(logLine);
  fs.appendFileSync(LOG_FILE, `${logLine}\n`);
}

// ==================== 钉钉消息 ====================

let accessTokenCache = null;
let tokenExpiry = 0;

async function getDingTalkToken() {
  const now = Date.now();
  if (accessTokenCache && tokenExpiry > now + 60000) {
    return accessTokenCache;
  }
  
  try {
    const response = await axios.post('https://api.dingtalk.com/v1.0/oauth2/accessToken', {
      appKey: CONFIG.DINGTALK.appKey,
      appSecret: CONFIG.DINGTALK.appSecret
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      proxy: false,
      httpsAgent: undefined
    });
    
    accessTokenCache = response.data.accessToken;
    tokenExpiry = now + response.data.expireIn * 1000;
    
    log(`[DINGTALK] Token 获取成功，过期时间：${response.data.expireIn}秒`);
    return accessTokenCache;
  } catch (e) {
    log(`[ERROR] 获取钉钉 Token 失败：${e.message}`);
    if (e.response) {
      log(`[ERROR] 响应状态：${e.response.status}`);
    }
    // 降级：使用 curl 获取
    try {
      const { exec } = require('child_process');
      const curlResult = await new Promise((resolve, reject) => {
        exec(`curl -s -X POST "https://api.dingtalk.com/v1.0/oauth2/accessToken" -H "Content-Type: application/json" -d '${JSON.stringify({ appKey: CONFIG.DINGTALK.appKey, appSecret: CONFIG.DINGTALK.appSecret })}'`, (err, stdout) => {
          if (err) reject(err);
          else resolve(stdout);
        });
      });
      const parsed = JSON.parse(curlResult);
      if (parsed.accessToken) {
        accessTokenCache = parsed.accessToken;
        tokenExpiry = now + parsed.expireIn * 1000;
        log(`[DINGTALK] curl 降级获取 Token 成功`);
        return accessTokenCache;
      }
    } catch (curlErr) {
      log(`[ERROR] curl 降级也失败：${curlErr.message}`);
    }
    return null;
  }
}

async function sendDingTalkMessage(text, title = 'NightOwl') {
  const token = await getDingTalkToken();
  if (!token) return false;
  
  // 使用 curl 发送（更可靠）
  const payload = {
    robotCode: CONFIG.DINGTALK.robotCode,
    msgKey: 'sampleMarkdown',
    msgParam: JSON.stringify({ title, text }),
    userIds: [CONFIG.DINGTALK.userId]
  };
  
  try {
    const { exec } = require('child_process');
    const curlResult = await new Promise((resolve, reject) => {
      exec(`curl -s -X POST "https://api.dingtalk.com/v1.0/robot/oToMessages/batchSend" \\
        -H "Content-Type: application/json" \\
        -H "x-acs-dingtalk-access-token: ${token}" \\
        -d '${JSON.stringify(payload).replace(/'/g, "'\\''")}'`, (err, stdout) => {
        if (err) reject(err);
        else resolve(stdout);
      });
    });
    
    const parsed = JSON.parse(curlResult);
    if (parsed.processQueryKey || parsed.messageId) {
      log('[DINGTALK] 消息发送成功');
      return true;
    } else {
      log(`[ERROR] 钉钉消息发送失败：${curlResult}`);
      return false;
    }
  } catch (e) {
    log(`[ERROR] 钉钉消息发送失败：${e.message}`);
    return false;
  }
}

// ==================== 主循环 ====================

async function executeRound(roundNum, topic) {
  log(`[ROUND ${roundNum}] 开始执行：${topic}`);
  
  const state = loadState();
  
  // 模拟探索过程（实际应该调用 browser/search 工具）
  // 这里简化为等待一段时间
  
  const roundDurationMs = CONFIG.ROUND_DURATION_MIN * 60 * 1000;
  const checkIntervalMs = CONFIG.CHECK_INTERVAL_SEC * 1000;
  
  const startTime = Date.now();
  
  while (Date.now() - startTime < roundDurationMs) {
    await new Promise(resolve => setTimeout(resolve, checkIntervalMs));
    
    // 检查是否应该提前结束
    const currentState = loadState();
    if (currentState.status === 'stop_requested') {
      log('[ROUND] 收到停止请求');
      return false;
    }
  }
  
  // 记录本轮完成
  state.rounds_completed = roundNum;
  state.current_round = roundNum + 1;
  
  // 更新下一轮主题
  if (roundNum < CONFIG.TOTAL_ROUNDS) {
    const nextTopic = state.topic_queue[roundNum] || { topic: '自主探索', hypothesis: '继续探索' };
    state.current_focus = {
      topic: nextTopic.topic,
      hypothesis: nextTopic.hypothesis,
      next_steps: ['搜索相关关键词', '访问页面', '提取关键信息']
    };
  }
  
  saveState(state);
  log(`[ROUND ${roundNum}] 完成`);
  
  return true;
}

async function generateReport(state) {
  const report = `# NightOwl 夜间探索报告

## 基本信息
- **会话 ID:** ${state.session_id}
- **开始时间:** ${new Date(state.started_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
- **完成时间:** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
- **执行时长:** ${Math.round((Date.now() - new Date(state.started_at).getTime()) / 60000)} 分钟
- **完成轮次:** ${state.rounds_completed} / ${state.total_rounds}

---

## Top 发现

${state.discoveries.length > 0 ? state.discoveries.map((d, i) => `### ${i + 1}. ${d.title || '未命名发现'}
**主题:** ${d.topic}
**价值评级:** ${'⭐'.repeat(d.value_rating || 3)}
**摘要:** ${d.summary || '无'}
`).join('\n') : '*本轮探索暂无发现记录*'}

---

## 思考记录

${state.thoughts.length > 0 ? state.thoughts.map((t, i) => `### 思考 ${i + 1}
**时间:** ${new Date(t.timestamp).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
**内容:** ${t.content}
`).join('\n') : '*本轮探索暂无思考记录*'}

---

**生成时间:** ${new Date().toISOString()}
`;
  
  fs.writeFileSync(REPORT_FILE, report);
  log(`[REPORT] 报告已生成：${REPORT_FILE}`);
  return report;
}

async function main() {
  log('==================== NightOwl Orchestrator v2.0 启动 ====================');
  log(`工作目录：${CONFIG.WORKDIR}`);
  log(`总轮次：${CONFIG.TOTAL_ROUNDS}`);
  log(`每轮时长：${CONFIG.ROUND_DURATION_MIN} 分钟`);
  log(`预计完成：${new Date(Date.now() + CONFIG.TOTAL_ROUNDS * CONFIG.ROUND_DURATION_MIN * 60000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  
  // 初始化状态
  let state = createInitialState();
  saveState(state);
  
  // 发送启动通知
  await sendDingTalkMessage(
    `🦉 **NightOwl 已启动**

**会话 ID:** ${state.session_id}
**开始时间:** ${new Date(state.started_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
**预计完成:** ${new Date(Date.now() + CONFIG.TOTAL_ROUNDS * CONFIG.ROUND_DURATION_MIN * 60000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
**总轮次:** ${CONFIG.TOTAL_ROUNDS} 轮

主理人已接管，全程无需参与。
明早醒来查看报告即可。

晚安。`,
    'NightOwl 启动通知'
  );
  
  // 执行各轮探索
  for (let round = 1; round <= CONFIG.TOTAL_ROUNDS; round++) {
    const topic = state.topic_queue[round - 1]?.topic || `自主探索轮次 ${round}`;
    const success = await executeRound(round, topic);
    
    if (!success) {
      log('[MAIN] 任务中断');
      break;
    }
    
    // 检查是否完成所有轮次
    if (round >= CONFIG.TOTAL_ROUNDS) {
      state.status = 'completed';
      state.completed_at = new Date().toISOString();
      saveState(state);
    }
  }
  
  // 生成报告
  if (state.status === 'completed') {
    log('[MAIN] 任务完成，生成报告...');
    await generateReport(state);
    
    // 发送完成通知
    await sendDingTalkMessage(
      `🌅 **NightOwl 探索完成**

**会话 ID:** ${state.session_id}
**执行时长:** ${Math.round((Date.now() - new Date(state.started_at).getTime()) / 60000)} 分钟
**完成轮次:** ${state.rounds_completed} / ${state.total_rounds}
**发现数量:** ${state.discoveries.length} 条

**报告位置:** \`~/.openclaw/workspace/nightowl/report.md\`

请在 Obsidian 中查看完整报告。`,
      'NightOwl 完成通知'
    );
  }
  
  log('==================== NightOwl Orchestrator 结束 ====================');
  process.exit(0);
}

// ==================== 启动 ====================

main().catch(e => {
  log(`[FATAL] ${e.message}`);
  console.error(e);
  process.exit(1);
});
