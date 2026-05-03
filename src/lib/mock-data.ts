import type {
  CaptureSuggestions,
  Capability,
  CoachPlan,
  UserProfile,
  WeeklySummary,
} from '../types/domain';

export const capabilities: Capability[] = [
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
    stageLabel: '入门到进阶',
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
    stageLabel: '未成体系',
    summary: '需要把观察、指标和回归校验纳入日常工作流。',
    evidenceCount: 1,
    updatedAt: '2026-05-01',
  },
];

export const defaultCaptureDraft =
  '今天把 PRD 重写成 Agent-first 结构后，我更清楚这个产品不是一个普通笔记工具，而是一个能持续维护成长状态的工作流系统。接下来想把 Capture 和 Profile 先串起来。';

export const defaultSuggestions: CaptureSuggestions = {
  tags: ['AgentDesign', 'ProfileState', 'Workflow'],
  confidence: 'high',
  nextPrompt: '下一步可以画出 Capture 到 Profile 的 handoff 输入输出。',
  relatedCapabilities: [
    {
      id: 'agent-design',
      name: 'Agent Design',
      reason: '记录中出现了 Agent、角色协作或工作流相关线索。',
    },
    {
      id: 'context-engineering',
      name: 'Context Engineering',
      reason: '记录中出现了上下文、状态或记忆管理相关线索。',
    },
    {
      id: 'ai-evaluation',
      name: 'AI Evaluation',
      reason: '记录中出现了评测、观测或质量护栏相关线索。',
    },
  ],
};

export const coachPlan: CoachPlan = {
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

export const weeklySummary: WeeklySummary = {
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

export const userProfile: UserProfile = {
  currentStageLabel: '从工具使用者走向工作流设计者',
  weeklyGoal: 4,
  focusArea: 'Agent Workflow',
  preferredModel: 'GPT + Claude 双模型',
  longTermGoal: '建立一套能持续沉淀 AI PM 能力的个人操作系统。',
  savedNotes: 0,
  lastInsight: '还没有保存新记录，先从一条真实工作思考开始。',
};
