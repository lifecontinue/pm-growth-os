import { getResourceSearchKeywords } from './agent-prompts';
import type { Capability, LearningResource } from '../types/domain';

export interface MCPToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'data' | 'communication' | 'storage';
  capabilities: ('web_search' | 'knowledge' | 'analytics' | 'export')[];
  status: 'available' | 'needs_config' | 'unavailable';
  configFields?: {
    name: string;
    type: 'string' | 'password' | 'select';
    required: boolean;
    placeholder: string;
  }[];
}

export interface SearchOptions {
  capability?: Capability;
  focusArea?: string;
  limit?: number;
  dateRange?: 'day' | 'week' | 'month' | 'year';
}

export const MCP_TOOL_REGISTRY: MCPToolDefinition[] = [
  {
    id: 'web-search',
    name: 'Real Web Search Knowledge Tool',
    description:
      'Calls the platform search API to retrieve current learning resources, then structures them for Coach Agent guidance.',
    category: 'search',
    capabilities: ['web_search', 'knowledge'],
    status: 'available',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Optional future sync target for notes, weekly reviews, and learning evidence.',
    category: 'storage',
    capabilities: ['export'],
    status: 'needs_config',
    configFields: [
      {
        name: 'notion_api_key',
        type: 'password',
        required: true,
        placeholder: 'ntn_xxxxxxxxxxxx',
      },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Optional future connector for issues, pull requests, and example repositories.',
    category: 'storage',
    capabilities: ['export'],
    status: 'needs_config',
    configFields: [
      {
        name: 'github_token',
        type: 'password',
        required: true,
        placeholder: 'ghp_xxxxxxxxxxxx',
      },
    ],
  },
];

export async function searchLearningResources(
  capabilityId: string,
  options: SearchOptions = {},
): Promise<LearningResource[]> {
  const limit = options.limit ?? 8;
  const keywords = getResourceSearchKeywords(capabilityId);
  const response = await fetch('/api/knowledge-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      capabilityId,
      focusArea: options.focusArea,
      limit,
      queries: buildSearchQueries(capabilityId, keywords, options),
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(
      payload?.message ??
        `Real web search failed with status ${response.status}. Check platform search configuration.`,
    );
  }

  const payload = (await response.json()) as { resources?: LearningResource[] };
  return (payload.resources ?? []).slice(0, limit);
}

export function formatResourcesAsMarkdown(resources: LearningResource[]): string {
  if (resources.length === 0) {
    return '_No learning resources available yet._';
  }

  return resources
    .map(
      (resourceItem, index) =>
        `${index + 1}. **${resourceItem.title}** (${resourceItem.resourceType})\n` +
        `   ${resourceItem.summary}\n` +
        `   Why it helps: ${resourceItem.whyUseful}\n` +
        `   ${resourceItem.url}`,
    )
    .join('\n\n');
}

export function formatResourcesAsCards(resources: LearningResource[]) {
  return resources.map((resourceItem) => ({
    id: resourceItem.id,
    title: resourceItem.title,
    url: resourceItem.url,
    snippet: resourceItem.summary,
    badge: resourceItem.resourceType,
  }));
}

export interface ToolStatus {
  id: string;
  name: string;
  status: 'available' | 'needs_config' | 'configured' | 'error';
  lastUsed?: string;
  config?: Record<string, unknown>;
}

export function getToolStatus(): ToolStatus[] {
  return MCP_TOOL_REGISTRY.map((tool) => ({
    id: tool.id,
    name: tool.name,
    status: tool.status === 'needs_config' ? 'needs_config' : 'available',
  }));
}

export function formatToolsForUI(tools: MCPToolDefinition[]) {
  return tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    status: tool.status,
    badge: getStatusBadge(tool.status),
    icon: getToolIcon(tool.id),
  }));
}

function buildSearchQueries(
  capabilityId: string,
  keywords: string[],
  options: SearchOptions,
) {
  const readableCapability = capabilityId.replace(/-/g, ' ');
  const focusArea = options.focusArea ?? 'AI product management';
  const primaryKeyword = keywords[0] ?? readableCapability;

  return [
    `${primaryKeyword} official documentation AI product management`,
    `${primaryKeyword} practical tutorial ${focusArea}`,
    `${primaryKeyword} case study ${focusArea}`,
    `${primaryKeyword} research paper LLM AI workflow`,
    `${primaryKeyword} open source tool example`,
  ];
}

function getStatusBadge(status: MCPToolDefinition['status']): string {
  const badgeMap: Record<MCPToolDefinition['status'], string> = {
    available: 'Available',
    needs_config: 'Needs setup',
    unavailable: 'Unavailable',
  };
  return badgeMap[status];
}

function getToolIcon(toolId: string): string {
  const iconMap: Record<string, string> = {
    'web-search': 'Search',
    notion: 'Notes',
    github: 'Code',
  };
  return iconMap[toolId] ?? 'Tool';
}

export default {
  MCP_TOOL_REGISTRY,
  searchLearningResources,
  formatResourcesAsMarkdown,
  formatResourcesAsCards,
  getToolStatus,
  formatToolsForUI,
};
