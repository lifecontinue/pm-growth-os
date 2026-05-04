import { generateCoachPlan } from './coach-generator-enhanced';
import { inferCaptureSuggestions } from './capture-inference';
import {
  capabilities,
  coachPlan,
  defaultCaptureDraft,
  defaultSuggestions,
  userProfile,
  weeklySummary,
} from './mock-data';
import { createModelCallTrace } from './model-telemetry';
import { generateWeeklyMarkdown } from './reflection-generator';
import type {
  Capability,
  CaptureSuggestions,
  ToolConnector,
  UserProfile,
  WorkspaceState,
} from '../types/domain';

const STORAGE_KEY = 'pm-growth-os.workspace.v1';

type ConnectorPatch = {
  enabled?: boolean;
  status?: ToolConnector['status'];
  mcpEndpoint?: string;
  accountHint?: string;
};

const initialToolConnectors: ToolConnector[] = [
  {
    id: 'local-ai',
    name: 'Local AI Heuristics',
    category: 'llm',
    method: 'local',
    status: 'enabled',
    scope: 'platform',
    description:
      'Runs capture inference, coach planning, reflection drafting, and token estimates in the browser.',
    useCases: ['Capture suggestions', 'Coach plan generation', 'Weekly reflection draft'],
    requiredInputs: ['No setup required'],
    enabled: true,
  },
  {
    id: 'browser-storage',
    name: 'Browser Local Storage',
    category: 'knowledge',
    method: 'local',
    status: 'enabled',
    scope: 'platform',
    description: 'Persists notes, growth state, reflection drafts, and traces in this browser.',
    useCases: ['Offline usage', 'Static Vercel deployment', 'Private local workspace'],
    requiredInputs: ['No setup required'],
    enabled: true,
  },
  {
    id: 'web-search',
    name: 'Real Web Search Knowledge Tool',
    category: 'knowledge',
    method: 'mcp',
    status: 'enabled',
    scope: 'platform',
    description:
      'Calls the platform search API to retrieve current learning resources, then structures them for Coach Agent guidance.',
    useCases: ['Learning resources', 'Guided practice', 'Future MCP web search adapter'],
    requiredInputs: ['Platform search API key'],
    mcpEndpoint: '/api/knowledge-search',
    accountHint:
      'Set TAVILY_API_KEY, BRAVE_SEARCH_API_KEY, or SERPAPI_API_KEY in the deployment environment. Users do not need to configure anything.',
    enabled: true,
  },
  {
    id: 'markdown-export',
    name: 'Markdown Export',
    category: 'export',
    method: 'local',
    status: 'enabled',
    scope: 'platform',
    description: 'Exports notes and trace data without an external account.',
    useCases: ['Export notes', 'Export model traces', 'Copy weekly reflections'],
    requiredInputs: ['No setup required'],
    enabled: true,
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'knowledge',
    method: 'account',
    status: 'needs_account',
    scope: 'user',
    description: 'Optional future sync target for notes and learning summaries.',
    useCases: ['Import historical notes', 'Export weekly reports', 'Build a knowledge base'],
    requiredInputs: ['Notion integration token', 'Database ID'],
    accountHint: 'Static mode stores this setup hint locally. Real sync requires a serverless connector.',
    enabled: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'workflow',
    method: 'account',
    status: 'needs_account',
    scope: 'user',
    description: 'Optional future connector for issues, PRs, and project evidence.',
    useCases: ['Import issue notes', 'Track shipping evidence', 'Generate project retrospectives'],
    requiredInputs: ['GitHub token or GitHub MCP server'],
    accountHint: 'Static mode does not call GitHub directly. Use this as a local setup note for now.',
    enabled: false,
  },
];

let memoryWorkspace: WorkspaceState | null = null;

export async function fetchWorkspace() {
  return readWorkspace();
}

export async function resetWorkspaceApi() {
  const workspace = createInitialWorkspace();
  return writeWorkspace(workspace);
}

export async function createNoteApi(content: string, selectedCapabilityIds?: string[]) {
  const normalizedContent = content.trim();

  if (!normalizedContent) {
    throw new Error('Note content is required.');
  }

  return updateWorkspace((current) => {
    const inferredSuggestions = inferCaptureSuggestions(normalizedContent, current.capabilities);
    const suggestions =
      selectedCapabilityIds === undefined
        ? inferredSuggestions
        : buildAdjustedSuggestions(inferredSuggestions, current.capabilities, selectedCapabilityIds);
    const now = new Date().toISOString();
    const trace = createModelCallTrace({
      agent: 'Capture Agent',
      operation: 'infer_capture_suggestions',
      prompt: normalizedContent,
      completion: JSON.stringify(suggestions),
    });
    const note = {
      id: createId(),
      content: normalizedContent,
      createdAt: now,
      relatedCapabilityIds: suggestions.relatedCapabilities.map((item) => item.id),
      tags: suggestions.tags,
    };
    const nextCapabilities = current.capabilities.map((capability) => {
      if (!note.relatedCapabilityIds.includes(capability.id)) return capability;

      const nextProgress = Math.min(capability.progress + 6, 100);
      return {
        ...capability,
        progress: nextProgress,
        evidenceCount: capability.evidenceCount + 1,
        stageLabel: getStageLabel(nextProgress),
        updatedAt: now.slice(0, 10),
      };
    });

    return {
      ...current,
      capabilities: nextCapabilities,
      captureDraft: '',
      captureSuggestions: inferCaptureSuggestions('', nextCapabilities),
      modelTraces: [trace, ...current.modelTraces],
      notes: [note, ...current.notes],
      userProfile: {
        ...current.userProfile,
        focusArea: suggestions.relatedCapabilities[0]?.name ?? current.userProfile.focusArea,
        savedNotes: current.userProfile.savedNotes + 1,
        lastInsight: suggestions.nextPrompt,
      },
    };
  });
}

export async function deleteNoteApi(noteId: string) {
  return updateWorkspace((current) => {
    const note = current.notes.find((item) => item.id === noteId);
    if (!note) return current;

    return {
      ...current,
      capabilities: current.capabilities.map((capability) => {
        if (!note.relatedCapabilityIds.includes(capability.id)) return capability;

        const nextProgress = Math.max(capability.progress - 6, 0);
        return {
          ...capability,
          evidenceCount: Math.max(capability.evidenceCount - 1, 0),
          progress: nextProgress,
          stageLabel: getStageLabel(nextProgress),
        };
      }),
      notes: current.notes.filter((item) => item.id !== noteId),
      userProfile: {
        ...current.userProfile,
        savedNotes: Math.max(current.userProfile.savedNotes - 1, 0),
      },
    };
  });
}

export async function generateCoachPlanApi(capabilityId?: string) {
  return updateWorkspace(async (current) => {
    const nextPlan = await generateCoachPlan({
      capabilities: current.capabilities,
      notes: current.notes,
      targetCapabilityId: capabilityId,
      userProfile: current.userProfile,
    });
    const targetCapability = current.capabilities.find((item) => item.id === capabilityId);
    const coachTrace = createModelCallTrace({
      agent: 'Coach Agent',
      operation: capabilityId ? 'generate_capability_coach_plan' : 'generate_coach_plan',
      prompt: JSON.stringify({
        targetCapability,
        capabilities: current.capabilities,
        recentNotes: current.notes.slice(0, 3),
        userProfile: current.userProfile,
      }),
      completion: JSON.stringify(nextPlan),
    });
    const knowledgeTrace = createModelCallTrace({
      agent: 'Knowledge Tool',
      operation: 'enrich_learning_resources',
      prompt: JSON.stringify({
        capabilityId: nextPlan.learningGuide?.capabilityId,
        focusArea: current.userProfile.focusArea,
      }),
      completion: JSON.stringify(nextPlan.learningGuide?.resources ?? []),
    });

    return {
      ...current,
      coachPlan: nextPlan,
      modelTraces: [knowledgeTrace, coachTrace, ...current.modelTraces],
      selectedCapabilityId: capabilityId ?? current.selectedCapabilityId,
      userProfile: {
        ...current.userProfile,
        focusArea: targetCapability?.name ?? current.userProfile.focusArea,
        lastInsight: nextPlan.learningGuide?.nextStep ?? current.userProfile.lastInsight,
      },
    };
  });
}

export async function sendLearningResourceToCaptureApi(resourceId: string) {
  return updateWorkspace((current) => {
    const guide = current.coachPlan.learningGuide;
    const resource = guide?.resources.find((item) => item.id === resourceId);

    if (!guide || !resource) return current;

    const nextDraft = [
      `Learning resource: ${resource.title}`,
      '',
      `Capability: ${guide.capabilityName}`,
      `Resource type: ${resource.resourceType}`,
      `URL: ${resource.url}`,
      '',
      `Why this matters: ${resource.whyUseful}`,
      '',
      'Practice task:',
      guide.practiceTask,
      '',
      'Capture template:',
      guide.captureTemplate,
    ].join('\n');
    const trace = createModelCallTrace({
      agent: 'Knowledge Tool',
      operation: 'handoff_resource_to_capture',
      prompt: JSON.stringify(resource),
      completion: nextDraft,
    });

    return {
      ...current,
      captureDraft: nextDraft,
      captureSuggestions: buildAdjustedSuggestions(
        inferCaptureSuggestions(nextDraft, current.capabilities),
        current.capabilities,
        [guide.capabilityId],
      ),
      modelTraces: [trace, ...current.modelTraces],
    };
  });
}

export async function sendCoachStepToCaptureApi(stepId: string) {
  return updateWorkspace((current) => {
    const step = current.coachPlan.steps.find((item) => item.id === stepId);
    if (!step) return current;

    const nextDraft = [
      `Practice task: ${step.title}`,
      '',
      step.detail,
      '',
      'My practice notes:',
    ].join('\n');
    const trace = createModelCallTrace({
      agent: 'Coach Agent',
      operation: 'handoff_step_to_capture',
      prompt: JSON.stringify(step),
      completion: nextDraft,
    });

    return {
      ...current,
      captureDraft: nextDraft,
      captureSuggestions: inferCaptureSuggestions(nextDraft, current.capabilities),
      coachPlan: {
        ...current.coachPlan,
        steps: current.coachPlan.steps.map((item) =>
          item.id === stepId ? { ...item, status: 'active' } : item,
        ),
      },
      modelTraces: [trace, ...current.modelTraces],
    };
  });
}

export async function sendCapabilityToCaptureApi(capabilityId: string) {
  return updateWorkspace((current) => {
    const capability = current.capabilities.find((item) => item.id === capabilityId);
    if (!capability) return current;

    const nextDraft = [
      `Capability exploration: ${capability.name}`,
      '',
      `Current stage: ${capability.stageLabel}`,
      `Current progress: ${capability.progress}%`,
      '',
      'Real scenario I encountered today:',
      '',
      'Question I want to validate:',
    ].join('\n');
    const trace = createModelCallTrace({
      agent: 'Profile Agent',
      operation: 'handoff_capability_to_capture',
      prompt: JSON.stringify(capability),
      completion: nextDraft,
    });

    return {
      ...current,
      captureDraft: nextDraft,
      captureSuggestions: inferCaptureSuggestions(nextDraft, current.capabilities),
      modelTraces: [trace, ...current.modelTraces],
      selectedCapabilityId: capabilityId,
    };
  });
}

export async function sendNoteToCaptureApi(noteId: string) {
  return updateWorkspace((current) => {
    const note = current.notes.find((item) => item.id === noteId);
    if (!note) return current;

    return {
      ...current,
      captureDraft: note.content,
      captureSuggestions: inferCaptureSuggestions(note.content, current.capabilities),
    };
  });
}

export async function selectCapabilityApi(capabilityId: string) {
  return updateWorkspace((current) => ({
    ...current,
    selectedCapabilityId: capabilityId,
  }));
}

export async function updateCaptureDraftApi(draft: string) {
  return updateWorkspace((current) => ({
    ...current,
    captureDraft: draft,
    captureSuggestions: inferCaptureSuggestions(draft, current.capabilities),
  }));
}

export async function updateCaptureCapabilityLinksApi(capabilityIds: string[]) {
  return updateWorkspace((current) => ({
    ...current,
    captureSuggestions: buildAdjustedSuggestions(
      current.captureSuggestions,
      current.capabilities,
      capabilityIds,
    ),
  }));
}

export async function generateReflectionDraftApi() {
  return updateWorkspace((current) => {
    const reflectionDraft = generateWeeklyMarkdown(current);
    const trace = createModelCallTrace({
      agent: 'Reflection Agent',
      operation: 'generate_weekly_markdown',
      prompt: JSON.stringify({
        notes: current.notes.slice(0, 5),
        userProfile: current.userProfile,
        weeklySummary: current.weeklySummary,
      }),
      completion: reflectionDraft,
    });

    return {
      ...current,
      reflectionDraft,
      modelTraces: [trace, ...current.modelTraces],
    };
  });
}

export async function updateReflectionDraftApi(draft: string) {
  return updateWorkspace((current) => ({
    ...current,
    reflectionDraft: draft,
  }));
}

export async function updateUserProfileApi(patch: Partial<UserProfile>) {
  return updateWorkspace((current) => ({
    ...current,
    userProfile: {
      ...current.userProfile,
      ...patch,
      weeklyGoal: normalizeWeeklyGoal(patch.weeklyGoal, current.userProfile.weeklyGoal),
    },
  }));
}

export async function clearModelTracesApi() {
  return updateWorkspace((current) => ({
    ...current,
    modelTraces: [],
  }));
}

export async function updateConnectorApi(connectorId: string, payload: ConnectorPatch) {
  return updateWorkspace((current) => ({
    ...current,
    toolConnectors: current.toolConnectors.map((connector) => {
      if (connector.id !== connectorId) return connector;

      const nextConnector = {
        ...connector,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      if (nextConnector.enabled && nextConnector.status === 'not_connected') {
        nextConnector.status =
          nextConnector.method === 'account' ? 'needs_account' : 'configured';
      }

      return nextConnector;
    }),
  }));
}

function readWorkspace(): WorkspaceState {
  const storage = getStorage();

  if (!storage) {
    if (!memoryWorkspace) {
      memoryWorkspace = createInitialWorkspace();
    }

    return memoryWorkspace;
  }

  const raw = storage.getItem(STORAGE_KEY);

  if (!raw) {
    const workspace = createInitialWorkspace();
    storage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    return workspace;
  }

  try {
    return normalizeWorkspace(JSON.parse(raw) as Partial<WorkspaceState>);
  } catch {
    const workspace = createInitialWorkspace();
    storage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    return workspace;
  }
}

function writeWorkspace(workspace: WorkspaceState): WorkspaceState {
  const nextWorkspace = {
    ...workspace,
    updatedAt: new Date().toISOString(),
  };
  const storage = getStorage();

  if (!storage) {
    memoryWorkspace = nextWorkspace;
    return nextWorkspace;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(nextWorkspace));
  return nextWorkspace;
}

async function updateWorkspace(
  updater: (workspace: WorkspaceState) => WorkspaceState | Promise<WorkspaceState>,
) {
  const current = readWorkspace();
  return writeWorkspace(await updater(current));
}

function createInitialWorkspace(): WorkspaceState {
  return {
    capabilities: clone(capabilities),
    captureDraft: defaultCaptureDraft,
    captureSuggestions: clone(defaultSuggestions),
    coachPlan: clone(coachPlan),
    modelTraces: [],
    notes: [],
    reflectionDraft: '',
    selectedCapabilityId: capabilities[0]?.id ?? '',
    toolConnectors: clone(initialToolConnectors),
    weeklySummary: clone(weeklySummary),
    userProfile: clone(userProfile),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeWorkspace(workspace: Partial<WorkspaceState>): WorkspaceState {
  const initial = createInitialWorkspace();

  return {
    ...initial,
    ...workspace,
    capabilities: workspace.capabilities ?? initial.capabilities,
    captureSuggestions: workspace.captureSuggestions ?? initial.captureSuggestions,
    coachPlan: workspace.coachPlan ?? initial.coachPlan,
    modelTraces: workspace.modelTraces ?? [],
    notes: workspace.notes ?? [],
    toolConnectors: mergeToolConnectors(workspace.toolConnectors, initial.toolConnectors),
    weeklySummary: workspace.weeklySummary ?? initial.weeklySummary,
    userProfile: {
      ...initial.userProfile,
      ...(workspace.userProfile ?? {}),
    },
  };
}

function mergeToolConnectors(
  existing: ToolConnector[] = [],
  latest: ToolConnector[] = [],
): ToolConnector[] {
  const existingById = new Map(existing.map((connector) => [connector.id, connector]));

  return latest.map((connector) => {
    const existingConnector = existingById.get(connector.id);

    if (!existingConnector) {
      return connector;
    }

    return {
      ...connector,
      status: existingConnector.status ?? connector.status,
      enabled: existingConnector.enabled ?? connector.enabled,
      mcpEndpoint: existingConnector.mcpEndpoint ?? connector.mcpEndpoint,
      accountHint: existingConnector.accountHint ?? connector.accountHint,
      updatedAt: existingConnector.updatedAt,
    };
  });
}

function getStorage() {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getStageLabel(progress: number) {
  if (progress >= 75) return 'Mastery Sprint';
  if (progress >= 45) return 'Advancing';
  if (progress > 0) return 'Foundational';
  return 'Unexplored';
}

function buildAdjustedSuggestions(
  current: CaptureSuggestions,
  capabilities: Capability[],
  capabilityIds: string[],
): CaptureSuggestions {
  const selectedIds = new Set(capabilityIds);
  const relatedCapabilities = capabilities
    .filter((capability) => selectedIds.has(capability.id))
    .map((capability) => {
      const existing = current.relatedCapabilities.find((item) => item.id === capability.id);

      return {
        id: capability.id,
        name: capability.name,
        reason: existing?.reason ?? 'Manually linked by the user.',
      };
    });

  return {
    ...current,
    relatedCapabilities,
    confidence:
      relatedCapabilities.length === 0 ? 'low' : relatedCapabilities.length === 1 ? 'medium' : 'high',
  };
}

function normalizeWeeklyGoal(nextValue: number | undefined, currentValue: number) {
  if (typeof nextValue !== 'number' || Number.isNaN(nextValue)) {
    return currentValue;
  }

  return Math.max(1, Math.round(nextValue));
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}-${Math.random()}`;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
