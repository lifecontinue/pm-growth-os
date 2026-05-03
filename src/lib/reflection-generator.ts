import type { Capability, Note, UserProfile, WeeklySummary } from '../types/domain';

export function generateWeeklyMarkdown({
  capabilities,
  notes,
  userProfile,
  weeklySummary,
}: {
  capabilities: Capability[];
  notes: Note[];
  userProfile: UserProfile;
  weeklySummary: WeeklySummary;
}) {
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

function summarizeNote(content: string) {
  const normalized = content.replace(/\s+/g, ' ').trim();

  if (normalized.length <= 52) {
    return normalized;
  }

  return `${normalized.slice(0, 52)}...`;
}

function getCurrentWeekLabel() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekOfMonth = Math.ceil(day / 7);

  return `${now.getFullYear()} 年 ${month} 月第 ${weekOfMonth} 周`;
}
