import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';

export function CapturePanel() {
  const draft = useAppStore((state) => state.captureDraft);
  const suggestions = useAppStore((state) => state.captureSuggestions);
  const notes = useAppStore((state) => state.notes);
  const saveCaptureNote = useAppStore((state) => state.saveCaptureNote);
  const updateCaptureDraft = useAppStore((state) => state.updateCaptureDraft);

  return (
    <SectionCard
      title="Capture Agent"
      subtitle="自由记录"
      actionLabel="保存记录"
      actionDisabled={!draft.trim()}
      onAction={saveCaptureNote}
    >
      <div className="stack-sm">
        <textarea
          className="capture-input"
          value={draft}
          placeholder="记录今天遇到的 AI 产品问题、一个观察、一次试错，或者一个需要继续追问的想法。"
          onChange={(event) => updateCaptureDraft(event.target.value)}
        />
        <div className="tag-row">
          {suggestions.tags.map((tag) => (
            <span className="chip" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
        <div className="suggestion-box">
          <div className="suggestion-head">
            <p className="suggestion-title">识别到的能力维度</p>
            <span className={`confidence-pill confidence-${suggestions.confidence}`}>
              {suggestions.confidence}
            </span>
          </div>
          {suggestions.relatedCapabilities.length > 0 ? (
            <ul className="plain-list">
              {suggestions.relatedCapabilities.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>
                  <span>{item.reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted-text">输入内容后会自动推断相关能力维度。</p>
          )}
          <p className="next-prompt">{suggestions.nextPrompt}</p>
        </div>
        <div className="recent-notes">
          <div className="section-inline-header">
            <strong>最近记录</strong>
            <span>{notes.length} 条</span>
          </div>
          {notes.length > 0 ? (
            <ul className="note-list">
              {notes.slice(0, 3).map((note) => (
                <li key={note.id}>
                  <p>{note.content}</p>
                  <span>{new Date(note.createdAt).toLocaleString('zh-CN')}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted-text">保存第一条记录后，这里会出现历史证据。</p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
