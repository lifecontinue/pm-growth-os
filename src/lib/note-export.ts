import type { Capability, Note } from '../types/domain';

export function exportNotesToMarkdown(notes: Note[], capabilities: Capability[]) {
  const capabilityNameById = new Map(
    capabilities.map((capability) => [capability.id, capability.name]),
  );

  if (notes.length === 0) {
    return '# PM Growth OS 记录导出\n\n暂无记录。\n';
  }

  return [
    '# PM Growth OS 记录导出',
    '',
    `导出时间：${new Date().toLocaleString('zh-CN')}`,
    `记录数量：${notes.length}`,
    '',
    ...notes.flatMap((note, index) => [
      `## ${index + 1}. ${new Date(note.createdAt).toLocaleString('zh-CN')}`,
      '',
      note.content,
      '',
      `能力维度：${formatCapabilities(note, capabilityNameById)}`,
      `标签：${note.tags.length > 0 ? note.tags.map((tag) => `#${tag}`).join(' ') : '无'}`,
      '',
    ]),
  ].join('\n');
}

function formatCapabilities(note: Note, capabilityNameById: Map<string, string>) {
  if (note.relatedCapabilityIds.length === 0) {
    return '未关联';
  }

  return note.relatedCapabilityIds
    .map((id) => capabilityNameById.get(id) ?? id)
    .join(' / ');
}
