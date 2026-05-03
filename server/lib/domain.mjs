export const initialCapabilities = [
  {
    id: 'prompt-engineering',
    name: 'Prompt Engineering',
    category: '技能层',
    progress: 72,
    stageLabel: '进阶',
    summary: '已经能写出稳定结构化 Prompt，正在强化约束设计。',
    evidenceCount: 6,
    updatedAt: '2026-05-01',
  },
  {
    id: 'context-engineering',
    name: 'Context Engineering',
    category: '技能层',
    progress: 48,
    stageLabel: '进阶',
    summary: '开始理解长对话衰减、摘要压缩和状态切片。',
    evidenceCount: 4,
    updatedAt: '2026-05-01',
  },
  {
    id: 'agent-design',
    name: 'Agent Design',
    category: '应用层',
    progress: 31,
    stageLabel: '入门',
    summary: '正在学习 Agent 角色拆分、handoff 和 guardrails。',
    evidenceCount: 3,
    updatedAt: '2026-05-01',
  },
  {
    id: 'ai-evaluation',
    name: 'AI Evaluation',
    category: '工具层',
    progress: 16,
    stageLabel: '入门',
    summary: '需要把观察、指标和回归校验纳入日常工作流。',
    evidenceCount: 1,
    updatedAt: '2026-05-01',
  },
];

export const initialCoachPlan = {
  description: 'Coach Agent 基于你最近的记录，建议先完成最小闭环：记录 -> 识别 -> 更新画像。',
  steps: [
    {
      id: 'define-input',
      title: 'Step 1: 明确输入结构',
      detail: '确定记录内容至少包含原文、标签候选、时间、关联维度。',
      status: 'active',
    },
    {
      id: 'profile-rules',
      title: 'Step 2: 设计画像更新规则',
      detail: '为阶段、能力进度和长期目标建立结构化写入策略。',
      status: 'todo',
    },
    {
      id: 'validate-handoff',
      title: 'Step 3: 验证一次完整流转',
      detail: '用单条记录跑通 Capture Agent 到 Profile Agent 的 handoff。',
      status: 'todo',
    },
  ],
};

export const initialWeeklySummary = {
  period: '2026 年 5 月第 1 周',
  progress: [
    '完成 Agent-first PRD 目录与核心章节重构。',
    '定义 Capture / Coach / Reflection / Profile 四个关键角色。',
    '开始搭建前端工作区和首页模块骨架。',
  ],
  nextActions: [
    '实现 Capture 表单的交互与本地持久化。',
    '补全 Capability 和 Note 的状态更新逻辑。',
    '增加周报草稿的生成与编辑视图。',
  ],
};

export const initialUserProfile = {
  currentStageLabel: '从工具使用者走向工作流设计者',
  weeklyGoal: 4,
  focusArea: 'Agent Workflow',
  preferredModel: 'GPT + Claude 双模型',
  longTermGoal: '建立一套能持续沉淀 AI PM 能力的个人操作系统。',
  savedNotes: 0,
  lastInsight: '还没有保存新记录，先从一条真实工作思考开始。',
};

export const initialToolConnectors = [
  {
    id: 'openai',
    name: 'OpenAI API（平台托管）',
    category: 'llm',
    method: 'env',
    scope: 'platform',
    status: process.env.OPENAI_API_KEY ? 'configured' : 'not_connected',
    description: '平台统一配置的默认 LLM 能力，普通用户无需提供 API key。',
    useCases: ['Capture 语义识别', 'Reflection 周报生成', 'Coach 探索任务', 'LLM-as-Judge'],
    requiredInputs: ['平台管理员配置 OPENAI_API_KEY', 'OPENAI_MODEL 可选'],
    envKeys: ['OPENAI_API_KEY', 'OPENAI_MODEL'],
    enabled: Boolean(process.env.OPENAI_API_KEY),
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude API（平台托管）',
    category: 'llm',
    method: 'env',
    scope: 'platform',
    status: process.env.ANTHROPIC_API_KEY ? 'configured' : 'not_connected',
    description: '平台可选配置的长上下文模型，普通用户无需提供 API key。',
    useCases: ['长记录总结', '能力复盘', '深度探索建议'],
    requiredInputs: ['平台管理员配置 ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL 可选'],
    envKeys: ['ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL'],
    enabled: Boolean(process.env.ANTHROPIC_API_KEY),
  },
  {
    id: 'supabase',
    name: 'Supabase Auth + Database（平台托管）',
    category: 'workflow',
    method: 'env',
    scope: 'platform',
    status:
      process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY ? 'configured' : 'not_connected',
    description: '平台统一配置账号登录、云端数据和多用户隔离。',
    useCases: ['用户登录', '云端笔记', '多端同步', 'Row Level Security'],
    requiredInputs: ['平台管理员配置 SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
    envKeys: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
    enabled: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  },
  {
    id: 'mcp-memory',
    name: 'MCP Memory / Knowledge（平台可选）',
    category: 'mcp',
    method: 'mcp',
    scope: 'platform',
    status: process.env.MCP_MEMORY_URL ? 'configured' : 'not_connected',
    description: '平台可选配置的长期记忆/知识库 MCP，用户无需自己部署。',
    useCases: ['长期记忆检索', '项目知识库查询', '上下文恢复'],
    requiredInputs: ['平台管理员配置 MCP_MEMORY_URL', '可选 MCP_MEMORY_TOKEN'],
    envKeys: ['MCP_MEMORY_URL', 'MCP_MEMORY_TOKEN'],
    mcpEndpoint: process.env.MCP_MEMORY_URL ?? '',
    enabled: Boolean(process.env.MCP_MEMORY_URL),
  },
  {
    id: 'markdown-export',
    name: 'Markdown Export（内置）',
    category: 'export',
    method: 'local',
    scope: 'platform',
    status: 'enabled',
    description: '内置记录、周报和 trace 导出能力，不需要任何外部账号。',
    useCases: ['导出记录', '导出周报', '导出模型 trace'],
    requiredInputs: ['无需配置'],
    enabled: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'knowledge',
    method: 'account',
    scope: 'user',
    status: 'needs_account',
    description: '同步 PM 笔记、学习资料和阶段性总结。',
    useCases: ['导入历史笔记', '导出周报', '沉淀知识库'],
    requiredInputs: ['Notion integration token', 'Database ID'],
    accountHint: '提供 Notion integration token 和目标 database/page ID 后可连接。',
    enabled: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'workflow',
    method: 'account',
    scope: 'user',
    status: 'needs_account',
    description: '关联代码仓库、PR、issue 和 AI PM 实践项目证据。',
    useCases: ['导入 issue/PR 记录', '追踪 Vibe Coding 产出', '生成项目复盘'],
    requiredInputs: ['GitHub token 或 MCP GitHub server'],
    accountHint: '可通过 GitHub token 或 GitHub MCP server 连接。',
    enabled: false,
  },
  {
    id: 'feishu',
    name: '飞书 / Lark',
    category: 'workflow',
    method: 'account',
    scope: 'user',
    status: 'needs_account',
    description: '对接飞书文档、周报和团队协作文档。',
    useCases: ['导出周报', '同步项目文档', '沉淀复盘'],
    requiredInputs: ['App ID', 'App Secret', '文档或多维表格权限'],
    accountHint: '需要你提供飞书开放平台应用凭证和目标文档权限。',
    enabled: false,
  },
];

export function createInitialWorkspace() {
  return {
    capabilities: structuredClone(initialCapabilities),
    captureDraft:
      '今天把 PRD 重写成 Agent-first 结构后，我更清楚这个产品不是一个普通笔记工具，而是一个能持续维护成长状态的工作流系统。接下来想把 Capture 和 Profile 先串起来。',
    captureSuggestions: inferCaptureSuggestions(
      '今天把 PRD 重写成 Agent-first 结构后，我更清楚这个产品不是一个普通笔记工具，而是一个能持续维护成长状态的工作流系统。接下来想把 Capture 和 Profile 先串起来。',
      initialCapabilities,
    ),
    coachPlan: structuredClone(initialCoachPlan),
    modelTraces: [],
    notes: [],
    reflectionDraft: '',
    selectedCapabilityId: initialCapabilities[0]?.id ?? '',
    toolConnectors: structuredClone(initialToolConnectors),
    weeklySummary: structuredClone(initialWeeklySummary),
    userProfile: structuredClone(initialUserProfile),
    updatedAt: new Date().toISOString(),
  };
}

const rules = [
  {
    capabilityId: 'prompt-engineering',
    tags: ['PromptEngineering'],
    keywords: ['prompt', '提示词', 'few-shot', 'chain-of-thought', 'cot', '约束'],
  },
  {
    capabilityId: 'context-engineering',
    tags: ['ContextEngineering', 'Memory'],
    keywords: ['context', '上下文', '记忆', '状态', '压缩', '窗口', '长期记忆'],
  },
  {
    capabilityId: 'agent-design',
    tags: ['AgentDesign', 'Workflow'],
    keywords: ['agent', 'handoff', '工作流', '编排', '工具调用', 'profile', 'capture'],
  },
  {
    capabilityId: 'ai-evaluation',
    tags: ['Evaluation', 'Guardrails'],
    keywords: ['评测', 'eval', '指标', '观测', 'trace', 'guardrail', '护栏', '质量'],
  },
];

export function inferCaptureSuggestions(draft, capabilities) {
  const normalizedDraft = draft.toLowerCase();
  const matchedRuleIds = new Set();
  const tags = new Set();

  for (const rule of rules) {
    const hasKeyword = rule.keywords.some((keyword) =>
      normalizedDraft.includes(keyword.toLowerCase()),
    );

    if (hasKeyword) {
      matchedRuleIds.add(rule.capabilityId);
      rule.tags.forEach((tag) => tags.add(tag));
    }
  }

  if (draft.trim().length > 0 && matchedRuleIds.size === 0) {
    matchedRuleIds.add('agent-design');
    tags.add('Reflection');
  }

  const relatedCapabilities = capabilities
    .filter((capability) => matchedRuleIds.has(capability.id))
    .map((capability) => ({
      id: capability.id,
      name: capability.name,
      reason: getReason(capability.id),
    }));

  return {
    tags: Array.from(tags),
    relatedCapabilities,
    confidence: getConfidence(draft, matchedRuleIds.size),
    nextPrompt: getNextPrompt(relatedCapabilities[0]?.id),
  };
}

export function generateCoachPlan({ capabilities, notes, targetCapabilityId, userProfile }) {
  const defaultCapability = capabilities.slice().sort((a, b) => a.progress - b.progress)[0];
  const targetCapability =
    capabilities.find((capability) => capability.id === targetCapabilityId) ?? defaultCapability;
  const strongestCapability = capabilities.slice().sort((a, b) => b.progress - a.progress)[0];
  const recentTopic = notes[0]?.tags[0] ?? userProfile.focusArea;

  return {
    description: `Coach Agent 建议围绕 ${targetCapability.name} 建一个小任务，并借用 ${strongestCapability.name} 的已有经验降低启动成本。`,
    steps: [
      {
        id: 'inspect-gap',
        title: 'Step 1: 定义能力缺口',
        detail: `写下 ${targetCapability.name} 目前最不确定的 1 个问题，并补充一个真实工作场景。`,
        status: 'active',
      },
      {
        id: 'run-micro-practice',
        title: 'Step 2: 完成微型实践',
        detail: `基于 ${recentTopic} 设计一个 20 分钟内能完成的练习，并记录输入、输出和判断标准。`,
        status: 'todo',
      },
      {
        id: 'capture-evidence',
        title: 'Step 3: 沉淀能力证据',
        detail: `把实践结果写成一条记录，关联到 ${targetCapability.name}，并说明它如何改变你的判断。`,
        status: 'todo',
      },
    ],
  };
}

export function generateWeeklyMarkdown({ capabilities, notes, userProfile, weeklySummary }) {
  const period = getCurrentWeekLabel();
  const recentNotes = notes.slice(0, 5);
  const activeCapabilities = capabilities
    .filter((capability) =>
      recentNotes.some((note) => note.relatedCapabilityIds.includes(capability.id)),
    )
    .sort((a, b) => b.progress - a.progress);
  const progressItems =
    recentNotes.length > 0
      ? recentNotes.map((note) => summarizeNote(note.content))
      : weeklySummary.progress;
  const capabilityItems =
    activeCapabilities.length > 0
      ? activeCapabilities.map(
          (capability) =>
            `${capability.name}: ${capability.progress}% 进度，累计 ${capability.evidenceCount} 条证据`,
        )
      : capabilities
          .slice()
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 3)
          .map((capability) => `${capability.name}: ${capability.stageLabel}`);
  const nextActions =
    recentNotes.length > 0
      ? [
          userProfile.lastInsight,
          `围绕 ${userProfile.focusArea} 再补 2 条真实工作记录`,
          '把本周最有价值的一条记录整理成可复用案例',
        ]
      : weeklySummary.nextActions;

  return [
    `# ${period} 周报`,
    '',
    '## 本周进展',
    ...progressItems.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## 能力变化',
    ...capabilityItems.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## 下周计划',
    ...nextActions.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## 反思',
    `本周重点集中在 ${userProfile.focusArea}。下一步需要把零散记录进一步沉淀为明确的能力证据和可复用方法。`,
  ].join('\n');
}

export function exportNotesToMarkdown(notes, capabilities) {
  const capabilityNameById = new Map(
    capabilities.map((capability) => [capability.id, capability.name]),
  );

  if (notes.length === 0) {
    return '# PM Growth OS 记录导出\n\n暂无记录。\n';
  }

  return [
    '# PM Growth OS 记录导出',
    '',
    `导出时间：${new Date().toLocaleString('zh-CN')}`,
    `记录数量：${notes.length}`,
    '',
    ...notes.flatMap((note, index) => [
      `## ${index + 1}. ${new Date(note.createdAt).toLocaleString('zh-CN')}`,
      '',
      note.content,
      '',
      `能力维度：${formatCapabilities(note, capabilityNameById)}`,
      `标签：${note.tags.length > 0 ? note.tags.map((tag) => `#${tag}`).join(' ') : '无'}`,
      '',
    ]),
  ].join('\n');
}

export function createModelCallTrace({ agent, operation, prompt, completion, status = 'success' }) {
  const promptTokens = estimateTokens(prompt);
  const completionTokens = estimateTokens(completion);
  const totalTokens = promptTokens + completionTokens;

  return {
    id: crypto.randomUUID(),
    agent,
    operation,
    model: 'pm-growth-local-agent',
    promptTokens,
    completionTokens,
    totalTokens,
    estimatedCostUsd: (promptTokens / 1_000_000) * 0.05 + (completionTokens / 1_000_000) * 0.2,
    latencyMs: 120 + totalTokens * 8,
    status,
    createdAt: new Date().toISOString(),
    promptPreview: preview(prompt),
    completionPreview: preview(completion),
  };
}

export function getStageLabel(progress) {
  if (progress >= 75) return '精通冲刺';
  if (progress >= 45) return '进阶';
  if (progress > 0) return '入门';
  return '未探索';
}

function getConfidence(draft, matchCount) {
  if (draft.trim().length < 12 || matchCount === 0) return 'low';
  if (matchCount === 1) return 'medium';
  return 'high';
}

function getReason(capabilityId) {
  const reasons = {
    'prompt-engineering': '记录中出现了提示词、约束或示例学习相关线索。',
    'context-engineering': '记录中出现了上下文、状态或记忆管理相关线索。',
    'agent-design': '记录中出现了 Agent、角色协作或工作流相关线索。',
    'ai-evaluation': '记录中出现了评测、观测或质量护栏相关线索。',
  };

  return reasons[capabilityId] ?? '这条记录可以沉淀为一个新的成长证据。';
}

function getNextPrompt(capabilityId) {
  const prompts = {
    'prompt-engineering': '下一步可以补一条「什么输入让 Prompt 失效」的反例记录。',
    'context-engineering': '下一步可以写清楚哪些状态需要进长期记忆，哪些只留在会话里。',
    'agent-design': '下一步可以画出 Capture 到 Profile 的 handoff 输入输出。',
    'ai-evaluation': '下一步可以定义一个判断输出好坏的最小指标。',
  };

  return prompts[capabilityId ?? 'agent-design'];
}

function summarizeNote(content) {
  const normalized = content.replace(/\s+/g, ' ').trim();
  return normalized.length <= 52 ? normalized : `${normalized.slice(0, 52)}...`;
}

function getCurrentWeekLabel() {
  const now = new Date();
  return `${now.getFullYear()} 年 ${now.getMonth() + 1} 月第 ${Math.ceil(now.getDate() / 7)} 周`;
}

function formatCapabilities(note, capabilityNameById) {
  if (note.relatedCapabilityIds.length === 0) return '未关联';
  return note.relatedCapabilityIds.map((id) => capabilityNameById.get(id) ?? id).join(' / ');
}

function estimateTokens(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;

  const cjkChars = [...trimmed].filter((char) => /[\u4e00-\u9fff]/u.test(char)).length;
  const latinWords = trimmed
    .replace(/[\u4e00-\u9fff]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(cjkChars * 0.65 + latinWords * 1.3));
}

function preview(text) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length <= 120 ? normalized : `${normalized.slice(0, 120)}...`;
}
