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
    category: 'Skills',
    progress: 72,
    stageLabel: 'Advancing',
    summary: 'You can write stable structured prompts and are improving constraint design.',
    evidenceCount: 6,
    updatedAt: '2026-05-01',
  },
  {
    id: 'context-engineering',
    name: 'Context Engineering',
    category: 'Skills',
    progress: 48,
    stageLabel: 'Emerging',
    summary: 'You are learning conversation decay, summary compression, and state slicing.',
    evidenceCount: 4,
    updatedAt: '2026-05-01',
  },
  {
    id: 'agent-design',
    name: 'Agent Design',
    category: 'Application',
    progress: 31,
    stageLabel: 'Foundational',
    summary: 'You are practicing agent roles, handoffs, orchestration, and guardrails.',
    evidenceCount: 3,
    updatedAt: '2026-05-01',
  },
  {
    id: 'ai-evaluation',
    name: 'AI Evaluation',
    category: 'Tooling',
    progress: 16,
    stageLabel: 'Unstructured',
    summary: 'You need to bring observation, metrics, and regression checks into daily work.',
    evidenceCount: 1,
    updatedAt: '2026-05-01',
  },
];

export const defaultCaptureDraft =
  'Today I reframed the PRD around an agent-first workflow. It became clearer that this product is not just a note tool, but a system for maintaining growth state over time. Next I want to connect Capture and Profile into one loop.';

export const defaultSuggestions: CaptureSuggestions = {
  tags: ['AgentDesign', 'ProfileState', 'Workflow'],
  confidence: 'high',
  nextPrompt: 'Next, map the handoff inputs and outputs from Capture to Profile.',
  relatedCapabilities: [
    {
      id: 'agent-design',
      name: 'Agent Design',
      reason: 'This note mentions agent roles, collaboration, or workflow design.',
    },
    {
      id: 'context-engineering',
      name: 'Context Engineering',
      reason: 'This note mentions context, state, or memory management.',
    },
    {
      id: 'ai-evaluation',
      name: 'AI Evaluation',
      reason: 'This note mentions evaluation, observability, or quality guardrails.',
    },
  ],
};

export const coachPlan: CoachPlan = {
  description:
    'Coach Agent recommends building a small loop first: capture a note, identify capabilities, then update your growth profile.',
  steps: [
    {
      id: 'define-input',
      title: 'Step 1: Define the input structure',
      detail: 'Make sure each note includes raw context, candidate tags, time, and related capability dimensions.',
      status: 'active',
    },
    {
      id: 'profile-rules',
      title: 'Step 2: Design profile update rules',
      detail: 'Create structured write rules for stage, capability progress, and long-term goals.',
      status: 'todo',
    },
    {
      id: 'validate-handoff',
      title: 'Step 3: Validate one full handoff',
      detail: 'Run one real note through the Capture Agent to Profile Agent handoff.',
      status: 'todo',
    },
  ],
};

export const weeklySummary: WeeklySummary = {
  period: 'Week 1, May 2026',
  progress: [
    'Reworked the PRD into an agent-first product structure.',
    'Defined Capture, Coach, Reflection, and Profile as the core product agents.',
    'Started building the frontend workspace and homepage module structure.',
  ],
  nextActions: [
    'Complete local persistence for the Capture flow.',
    'Finish capability and note state update logic.',
    'Add weekly reflection draft generation and editing.',
  ],
};

export const userProfile: UserProfile = {
  currentStageLabel: 'Moving from tool user to workflow designer',
  weeklyGoal: 4,
  focusArea: 'Agent Workflow',
  preferredModel: 'GPT + Claude dual-model workflow',
  longTermGoal: 'Build a personal operating system for compounding AI PM capability.',
  savedNotes: 0,
  lastInsight: 'No new notes yet. Start with one real work reflection.',
};
