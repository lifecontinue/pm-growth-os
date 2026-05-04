import type { Capability, CaptureSuggestions } from '../types/domain';

const rules = [
  {
    capabilityId: 'prompt-engineering',
    tags: ['PromptEngineering'],
    keywords: ['prompt', 'few-shot', 'chain-of-thought', 'cot', 'constraint', 'instruction'],
  },
  {
    capabilityId: 'context-engineering',
    tags: ['ContextEngineering', 'Memory'],
    keywords: ['context', 'memory', 'state', 'compression', 'window', 'long-term memory'],
  },
  {
    capabilityId: 'agent-design',
    tags: ['AgentDesign', 'Workflow'],
    keywords: ['agent', 'handoff', 'workflow', 'orchestration', 'tool call', 'profile', 'capture'],
  },
  {
    capabilityId: 'ai-evaluation',
    tags: ['Evaluation', 'Guardrails'],
    keywords: ['evaluation', 'eval', 'metric', 'observability', 'trace', 'guardrail', 'quality'],
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

function getConfidence(draft: string, matchCount: number): CaptureSuggestions['confidence'] {
  if (draft.trim().length < 12 || matchCount === 0) return 'low';
  if (matchCount === 1) return 'medium';
  return 'high';
}

function getReason(capabilityId: string) {
  const reasons: Record<string, string> = {
    'prompt-engineering': 'This note mentions prompting, constraints, or examples.',
    'context-engineering': 'This note mentions context, state, or memory management.',
    'agent-design': 'This note mentions agents, handoffs, roles, or workflow design.',
    'ai-evaluation': 'This note mentions evaluation, observability, metrics, or guardrails.',
  };

  return reasons[capabilityId] ?? 'This note can become a new piece of growth evidence.';
}

function getNextPrompt(capabilityId?: string) {
  const prompts: Record<string, string> = {
    'prompt-engineering': 'Next, capture one counterexample where a prompt failed and why.',
    'context-engineering': 'Next, separate what should become long-term memory from what can stay in the current session.',
    'agent-design': 'Next, map the handoff inputs and outputs between Capture and Profile.',
    'ai-evaluation': 'Next, define one minimal metric that tells whether the output is good enough.',
  };

  return prompts[capabilityId ?? 'agent-design'];
}
