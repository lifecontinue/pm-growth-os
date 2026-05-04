import { create } from 'zustand';
import {
  clearModelTracesApi,
  createNoteApi,
  deleteNoteApi,
  fetchWorkspace,
  generateCoachPlanApi,
  generateReflectionDraftApi,
  resetWorkspaceApi,
  selectCapabilityApi,
  sendCapabilityToCaptureApi,
  sendCoachStepToCaptureApi,
  sendLearningResourceToCaptureApi,
  sendNoteToCaptureApi,
  updateCaptureCapabilityLinksApi,
  updateCaptureDraftApi,
  updateConnectorApi,
  updateReflectionDraftApi,
  updateUserProfileApi,
} from '../lib/api-client';
import { inferCaptureSuggestions } from '../lib/capture-inference';
import { exportNotesToMarkdown } from '../lib/note-export';
import {
  capabilities,
  coachPlan,
  defaultCaptureDraft,
  defaultSuggestions,
  userProfile,
  weeklySummary,
} from '../lib/mock-data';
import type { ToolConnector, UserProfile, WorkspaceState } from '../types/domain';

type AppState = WorkspaceState & {
  backendError: string | null;
  isBackendReady: boolean;
  clearModelTraces: () => void;
  deleteNote: (noteId: string) => void;
  exportModelTraces: () => string;
  exportNotesMarkdown: () => string;
  generateCapabilityCoachPlan: (capabilityId: string) => void;
  generateCoachPlan: () => void;
  generateReflectionDraft: () => void;
  loadWorkspace: () => Promise<void>;
  resetWorkspace: () => void;
  saveCaptureNote: () => void;
  selectCapability: (capabilityId: string) => void;
  sendCapabilityToCapture: (capabilityId: string) => void;
  sendCoachStepToCapture: (stepId: string) => void;
  sendLearningResourceToCapture: (resourceId: string) => void;
  sendNoteToCapture: (noteId: string) => void;
  updateCaptureCapabilityLinks: (capabilityIds: string[]) => void;
  updateCaptureDraft: (draft: string) => void;
  updateConnector: (
    connectorId: string,
    payload: {
      enabled?: boolean;
      status?: ToolConnector['status'];
      mcpEndpoint?: string;
      accountHint?: string;
    },
  ) => void;
  updateReflectionDraft: (draft: string) => void;
  updateUserProfile: (patch: Partial<UserProfile>) => void;
};

const initialState: WorkspaceState = {
  capabilities,
  captureDraft: defaultCaptureDraft,
  captureSuggestions: defaultSuggestions,
  coachPlan,
  modelTraces: [],
  notes: [],
  reflectionDraft: '',
  selectedCapabilityId: capabilities[0]?.id ?? '',
  toolConnectors: [],
  weeklySummary,
  userProfile,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,
  backendError: null,
  isBackendReady: false,
  clearModelTraces: () => {
    runWorkspaceAction(set, clearModelTracesApi);
  },
  deleteNote: (noteId: string) => {
    runWorkspaceAction(set, () => deleteNoteApi(noteId));
  },
  exportModelTraces: () => JSON.stringify(get().modelTraces, null, 2),
  exportNotesMarkdown: () => exportNotesToMarkdown(get().notes, get().capabilities),
  generateCapabilityCoachPlan: (capabilityId: string) => {
    runWorkspaceAction(set, () => generateCoachPlanApi(capabilityId));
  },
  generateCoachPlan: () => {
    runWorkspaceAction(set, () => generateCoachPlanApi());
  },
  generateReflectionDraft: () => {
    runWorkspaceAction(set, generateReflectionDraftApi);
  },
  loadWorkspace: async () => {
    try {
      const workspace = await fetchWorkspace();
      setWorkspace(set, workspace);
    } catch (error) {
      set({
        backendError: formatError(error),
        isBackendReady: false,
      });
    }
  },
  resetWorkspace: () => {
    runWorkspaceAction(set, resetWorkspaceApi);
  },
  saveCaptureNote: () => {
    const content = get().captureDraft.trim();
    if (!content) return;

    const selectedCapabilityIds = get().captureSuggestions.relatedCapabilities.map((item) => item.id);
    runWorkspaceAction(set, () => createNoteApi(content, selectedCapabilityIds));
  },
  selectCapability: (capabilityId: string) => {
    set({
      selectedCapabilityId: capabilityId,
    });
    runWorkspaceAction(set, () => selectCapabilityApi(capabilityId));
  },
  sendCapabilityToCapture: (capabilityId: string) => {
    runWorkspaceAction(set, () => sendCapabilityToCaptureApi(capabilityId));
  },
  sendCoachStepToCapture: (stepId: string) => {
    runWorkspaceAction(set, () => sendCoachStepToCaptureApi(stepId));
  },
  sendLearningResourceToCapture: (resourceId: string) => {
    runWorkspaceAction(set, () => sendLearningResourceToCaptureApi(resourceId));
  },
  sendNoteToCapture: (noteId: string) => {
    runWorkspaceAction(set, () => sendNoteToCaptureApi(noteId));
  },
  updateCaptureCapabilityLinks: (capabilityIds: string[]) => {
    set((state) => ({
      captureSuggestions: {
        ...state.captureSuggestions,
        relatedCapabilities: state.capabilities
          .filter((capability) => capabilityIds.includes(capability.id))
          .map((capability) => {
            const existing = state.captureSuggestions.relatedCapabilities.find(
              (item) => item.id === capability.id,
            );

            return {
              id: capability.id,
              name: capability.name,
              reason: existing?.reason ?? 'Manually linked by the user.',
            };
          }),
        confidence:
          capabilityIds.length === 0 ? 'low' : capabilityIds.length === 1 ? 'medium' : 'high',
      },
    }));
    runWorkspaceAction(set, () => updateCaptureCapabilityLinksApi(capabilityIds));
  },
  updateCaptureDraft: (draft: string) =>
    set((state) => {
      void updateCaptureDraftApi(draft).catch((error) => {
        set({
          backendError: formatError(error),
          isBackendReady: false,
        });
      });

      return {
        captureDraft: draft,
        captureSuggestions: inferCaptureSuggestions(draft, state.capabilities),
      };
    }),
  updateConnector: (connectorId, payload) => {
    set((state) => ({
      toolConnectors: state.toolConnectors.map((connector) =>
        connector.id === connectorId
          ? {
              ...connector,
              ...payload,
              updatedAt: new Date().toISOString(),
            }
          : connector,
      ),
    }));
    runWorkspaceAction(set, () => updateConnectorApi(connectorId, payload));
  },
  updateReflectionDraft: (draft: string) => {
    set({ reflectionDraft: draft });
    runWorkspaceAction(set, () => updateReflectionDraftApi(draft));
  },
  updateUserProfile: (patch: Partial<UserProfile>) => {
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        ...patch,
      },
    }));
    runWorkspaceAction(set, () => updateUserProfileApi(patch));
  },
}));

function setWorkspace(
  set: (partial: Partial<AppState>) => void,
  workspace: WorkspaceState,
) {
  set({
    ...workspace,
    backendError: null,
    isBackendReady: true,
  });
}

async function runWorkspaceAction(
  set: (partial: Partial<AppState>) => void,
  action: () => Promise<WorkspaceState>,
) {
  try {
    const workspace = await action();
    setWorkspace(set, workspace);
  } catch (error) {
    set({
      backendError: formatError(error),
      isBackendReady: false,
    });
  }
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
