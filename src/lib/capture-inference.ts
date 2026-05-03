import type { Capability, CaptureSuggestions } from '../types/domain';

type KeywordRule = {
  capabilityId: string;
  tags: string[];
  keywords: string[];
};

const rules: KeywordRule[] = [
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

export function inferCaptureSuggestions(
  draft: string,
  capabilities: Capability[],
): CaptureSuggestions {
  const normalizedDraft = draft.toLowerCase();
  const matchedRuleIds = new Set<string>();
  const tags = new Set<string>();

  for (const rule of rules) {
    const hasKeyword = rule.keywords.some((keyword) =>
      normalizedDraft.includes(keyword.toLowerCase()),
    );

    if (hasKeyword) {
      matchedRuleIds.add(rule.capabilityId);
      rule.tags.forEach((tag) => tags.add(tag));
    }
  }

  const fallbackId = 'agent-design';
  if (draft.trim().length > 0 && matchedRuleIds.size === 0) {
    matchedRuleIds.add(fallbackId);
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

function getConfidence(draft: string, matchCount: number): CaptureSuggestions['confidence'] {
  if (draft.trim().length < 12 || matchCount === 0) {
    return 'low';
  }

  if (matchCount === 1) {
    return 'medium';
  }

  return 'high';
}

function getReason(capabilityId: string) {
  const reasons: Record<string, string> = {
    'prompt-engineering': '记录中出现了提示词、约束或示例学习相关线索。',
    'context-engineering': '记录中出现了上下文、状态或记忆管理相关线索。',
    'agent-design': '记录中出现了 Agent、角色协作或工作流相关线索。',
    'ai-evaluation': '记录中出现了评测、观测或质量护栏相关线索。',
  };

  return reasons[capabilityId] ?? '这条记录可以沉淀为一个新的成长证据。';
}

function getNextPrompt(capabilityId?: string) {
  const prompts: Record<string, string> = {
    'prompt-engineering': '下一步可以补一条「什么输入让 Prompt 失效」的反例记录。',
    'context-engineering': '下一步可以写清楚哪些状态需要进长期记忆，哪些只留在会话里。',
    'agent-design': '下一步可以画出 Capture 到 Profile 的 handoff 输入输出。',
    'ai-evaluation': '下一步可以定义一个判断输出好坏的最小指标。',
  };

  return prompts[capabilityId ?? 'agent-design'];
}
