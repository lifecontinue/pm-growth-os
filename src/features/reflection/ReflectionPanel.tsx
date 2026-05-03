import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';
import type { WeeklySummary } from '../../types/domain';

export function ReflectionPanel() {
  const generateReflectionDraft = useAppStore((state) => state.generateReflectionDraft);
  const notes = useAppStore((state) => state.notes);
  const reflectionDraft = useAppStore((state) => state.reflectionDraft);
  const updateReflectionDraft = useAppStore((state) => state.updateReflectionDraft);
  const weeklySummary = useAppStore((state) => state.weeklySummary);

  const draft = reflectionDraft || buildFallbackDraft(weeklySummary);

  return (
    <SectionCard
      title="Reflection Agent"
      subtitle="定期总结"
      actionLabel="生成周报"
      onAction={generateReflectionDraft}
    >
      <div className="stack-sm">
        <div className="section-inline-header">
          <p className="panel-intro">{weeklySummary.period}</p>
          <span className="muted-text">{notes.length} 条记录可用</span>
        </div>
        <div className="summary-block">
          <strong>本周进展</strong>
          <ul className="plain-list">
            {weeklySummary.progress.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="summary-block">
          <strong>下周计划</strong>
          <ul className="plain-list">
            {weeklySummary.nextActions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <textarea
          className="summary-editor"
          value={draft}
          onChange={(event) => updateReflectionDraft(event.target.value)}
        />
        <div className="reflection-actions">
          <button
            className="solid-button"
            disabled={!draft.trim()}
            onClick={() => downloadMarkdown(draft)}
          >
            导出 Markdown
          </button>
          <button
            className="ghost-button"
            disabled={!draft.trim()}
            onClick={() => updateReflectionDraft(buildFallbackDraft(weeklySummary))}
          >
            恢复模板
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function buildFallbackDraft(weeklySummary: WeeklySummary) {
  return [
    `# ${weeklySummary.period}`,
    '',
    '## 本周进展',
    ...weeklySummary.progress.map((item, index) => `${index + 1}. ${item}`),
    '',
    '## 下周计划',
    ...weeklySummary.nextActions.map((item, index) => `${index + 1}. ${item}`),
  ].join('\n');
}

function downloadMarkdown(markdown: string) {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `pm-growth-weekly-${new Date().toISOString().slice(0, 10)}.md`;
  link.click();
  URL.revokeObjectURL(url);
}
