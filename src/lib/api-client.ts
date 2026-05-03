import type { ToolConnector, WorkspaceState } from '../types/domain';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export async function fetchWorkspace() {
  return request<WorkspaceState>('/api/workspace');
}

export async function resetWorkspaceApi() {
  return request<WorkspaceState>('/api/reset', {
    method: 'POST',
  });
}

export async function createNoteApi(content: string) {
  return request<WorkspaceState>('/api/notes', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ content }),
  });
}

export async function deleteNoteApi(noteId: string) {
  return request<WorkspaceState>(`/api/notes/${encodeURIComponent(noteId)}`, {
    method: 'DELETE',
  });
}

export async function generateCoachPlanApi(capabilityId?: string) {
  return request<WorkspaceState>('/api/coach/generate', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ capabilityId }),
  });
}

export async function sendCoachStepToCaptureApi(stepId: string) {
  return request<WorkspaceState>(`/api/coach/steps/${encodeURIComponent(stepId)}/capture`, {
    method: 'POST',
  });
}

export async function sendCapabilityToCaptureApi(capabilityId: string) {
  return request<WorkspaceState>(
    `/api/capabilities/${encodeURIComponent(capabilityId)}/capture`,
    {
      method: 'POST',
    },
  );
}

export async function sendNoteToCaptureApi(noteId: string) {
  return request<WorkspaceState>(`/api/notes/${encodeURIComponent(noteId)}/capture`, {
    method: 'POST',
  });
}

export async function selectCapabilityApi(capabilityId: string) {
  return request<WorkspaceState>('/api/capabilities/selected', {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify({ capabilityId }),
  });
}

export async function generateReflectionDraftApi() {
  return request<WorkspaceState>('/api/reflection/generate', {
    method: 'POST',
  });
}

export async function updateReflectionDraftApi(draft: string) {
  return request<WorkspaceState>('/api/reflection', {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify({ draft }),
  });
}

export async function clearModelTracesApi() {
  return request<WorkspaceState>('/api/traces', {
    method: 'DELETE',
  });
}

export async function updateConnectorApi(
  connectorId: string,
  payload: {
    enabled?: boolean;
    status?: ToolConnector['status'];
    mcpEndpoint?: string;
    accountHint?: string;
  },
) {
  return request<WorkspaceState>(`/api/connectors/${encodeURIComponent(connectorId)}`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
