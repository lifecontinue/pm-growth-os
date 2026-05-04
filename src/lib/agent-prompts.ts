export type LearningStage = 'foundational' | 'advancing' | 'mastery';

type LearningPathMap = Record<string, Record<LearningStage, string[]>>;

export const COACH_AGENT_PROMPT = {
  role: 'Coach Agent',
  mission:
    'Turn the current growth map into a focused learn-by-doing path with useful resources, practice prompts, and capture-ready evidence.',
  workflow: ['Learn', 'Practice', 'Capture', 'Reflect', 'Next step'],
  nextPromptTemplates: {
    'prompt-engineering': [
      'Which prompt variable changed the result most clearly?',
      'What would you test next if this prompt had to run every week?',
    ],
    'context-engineering': [
      'What context did the model need, and what context created noise?',
      'How would you compress this conversation for the next session?',
    ],
    'agent-design': [
      'Which responsibility belongs to the agent, and which belongs to a tool?',
      'Where should the workflow pause for human review?',
    ],
    'ai-evaluation': [
      'What would make this output pass or fail in a real workflow?',
      'Which metric would catch regressions without creating busywork?',
    ],
    default: [
      'What did this exercise teach you about your current product workflow?',
      'What small repeatable habit would make this skill improve next week?',
    ],
  },
};

export const MCP_TOOLS = {
  webSearch: {
    name: 'Knowledge Tool',
    purpose:
      'Find and structure learning resources so the Coach Agent can guide users through practice, reflection, and evidence capture.',
    searchTemplates: [
      '{capability} official documentation',
      '{capability} practical tutorial',
      '{capability} case study AI product manager',
      '{capability} research paper',
      '{capability} example repository',
    ],
  },
};

const learningPaths: LearningPathMap = {
  'prompt-engineering': {
    foundational: [
      'Learn how instructions, context, examples, and constraints change model output.',
      'Compare three prompt variants on the same product task.',
      'Capture the winning pattern as a reusable prompt note.',
    ],
    advancing: [
      'Design a small prompt experiment with a hypothesis and scoring rubric.',
      'Test reasoning, structure, and examples separately.',
      'Turn the result into a prompt pattern for future product work.',
    ],
    mastery: [
      'Create a reusable prompt framework for a recurring PM workflow.',
      'Add evaluation criteria and failure examples.',
      'Document when the framework should not be used.',
    ],
  },
  'context-engineering': {
    foundational: [
      'Identify what context the model needs to complete the task.',
      'Remove redundant context and compare output quality.',
      'Write a compact handoff summary for the next conversation.',
    ],
    advancing: [
      'Separate task instructions, user intent, constraints, and reference material.',
      'Test how much history can be compressed before quality drops.',
      'Create a repeatable context template for PM workflows.',
    ],
    mastery: [
      'Design a retrieval or memory strategy for a multi-session workflow.',
      'Define what should be stored, summarized, or discarded.',
      'Add quality checks for stale or conflicting context.',
    ],
  },
  'agent-design': {
    foundational: [
      'Map a single-agent workflow with input, decision, tool use, and output.',
      'Identify where the user should approve or correct the agent.',
      'Capture one agent boundary that improved clarity.',
    ],
    advancing: [
      'Split a workflow into planner, researcher, executor, and reviewer roles.',
      'Define handoff artifacts between agents.',
      'Test where coordination overhead becomes too high.',
    ],
    mastery: [
      'Design a multi-agent operating loop with observability and fallback paths.',
      'Define tool contracts and state transitions.',
      'Document failure modes and recovery behavior.',
    ],
  },
  'ai-evaluation': {
    foundational: [
      'Write acceptance criteria for one AI output.',
      'Compare two outputs against the same rubric.',
      'Capture the metric that best predicts usefulness.',
    ],
    advancing: [
      'Build a small eval set from real product examples.',
      'Add pass/fail checks and qualitative notes.',
      'Use traces to compare cost, latency, and quality.',
    ],
    mastery: [
      'Design a repeatable evaluation workflow for shipped AI features.',
      'Add regression examples and review thresholds.',
      'Connect evaluation results to roadmap decisions.',
    ],
  },
};

const keywordMap: Record<string, string[]> = {
  'prompt-engineering': [
    'prompt engineering',
    'prompt design',
    'structured prompting',
    'chain of thought prompting',
  ],
  'context-engineering': [
    'context engineering',
    'context window management',
    'conversation summarization',
    'retrieval augmented generation',
  ],
  'agent-design': [
    'agent design',
    'multi agent workflow',
    'tool calling agents',
    'agent orchestration',
  ],
  'ai-evaluation': [
    'LLM evaluation',
    'AI evaluation rubric',
    'LLM as judge',
    'model tracing',
  ],
};

export function getLearningPath(capabilityId: string, stage: LearningStage) {
  return learningPaths[capabilityId]?.[stage] ?? learningPaths['prompt-engineering'][stage];
}

export function getResourceSearchKeywords(capabilityId: string) {
  return keywordMap[capabilityId] ?? keywordMap['prompt-engineering'];
}

export function generateCoachStepDetail({
  capabilityName,
  stage,
  focusArea,
}: {
  capabilityName: string;
  stage: LearningStage;
  focusArea: string;
}) {
  return [
    `Focus on ${capabilityName} at the ${stage} stage.`,
    `Use ${focusArea} as the working context so the practice stays close to real product work.`,
    'Capture one evidence note after the exercise so Growth Map can update.',
  ].join(' ');
}
