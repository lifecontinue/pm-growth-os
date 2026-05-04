import type { Capability, Note } from '../types/domain';

export function exportNotesToMarkdown(notes: Note[], capabilities: Capability[]) {
  const capabilityNameById = new Map(
    capabilities.map((capability) => [capability.id, capability.name]),
  );

  if (notes.length === 0) {
    return '# PM Growth OS Notes Export\n\nNo notes yet.\n';
  }

  return [
    '# PM Growth OS Notes Export',
    '',
    `Exported at: ${new Date().toLocaleString('en-US')}`,
    `Total notes: ${notes.length}`,
    '',
    ...notes.flatMap((note, index) => [
      `## ${index + 1}. ${new Date(note.createdAt).toLocaleString('en-US')}`,
      '',
      note.content,
      '',
      `Capabilities: ${formatCapabilities(note, capabilityNameById)}`,
      `Tags: ${note.tags.length > 0 ? note.tags.map((tag) => `#${tag}`).join(' ') : 'None'}`,
      '',
    ]),
  ].join('\n');
}

function formatCapabilities(note: Note, capabilityNameById: Map<string, string>) {
  if (note.relatedCapabilityIds.length === 0) {
    return 'Unlinked';
  }

  return note.relatedCapabilityIds.map((id) => capabilityNameById.get(id) ?? id).join(' / ');
}
