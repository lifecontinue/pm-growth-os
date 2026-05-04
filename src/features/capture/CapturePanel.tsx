import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';

export function CapturePanel() {
  const capabilities = useAppStore((state) => state.capabilities);
  const draft = useAppStore((state) => state.captureDraft);
  const suggestions = useAppStore((state) => state.captureSuggestions);
  const saveCaptureNote = useAppStore((state) => state.saveCaptureNote);
  const updateCaptureCapabilityLinks = useAppStore(
    (state) => state.updateCaptureCapabilityLinks,
  );
  const updateCaptureDraft = useAppStore((state) => state.updateCaptureDraft);
  const selectedCapabilityIds = suggestions.relatedCapabilities.map((capability) => capability.id);

  return (
    <SectionCard
      title="Capture Agent"
      subtitle="Work journal"
      actionLabel="Save Note"
      actionDisabled={!draft.trim()}
      onAction={saveCaptureNote}
    >
      <div className="capture-container">
        <div className="capture-header">
          <div className="capture-prompt-hint">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.42z" />
            </svg>
            <span>Capture real thoughts, problems, or observations from AI product work.</span>
          </div>
        </div>
        <textarea
          className="capture-input"
          value={draft}
          placeholder="Today I noticed context loss while debugging an agent workflow..."
          onChange={(event) => updateCaptureDraft(event.target.value)}
        />
        {draft.trim() && (
          <div className="capability-detected">
            <div className="detected-header">
              <span className="detected-label">Related capabilities detected</span>
              <span className={`confidence-pill confidence-${suggestions.confidence}`}>
                {suggestions.confidence}
              </span>
            </div>
            {suggestions.relatedCapabilities.length > 0 ? (
              <div className="detected-caps">
                {suggestions.relatedCapabilities.map((cap) => (
                  <span key={cap.id} className="detected-cap">
                    <span className="cap-name">{cap.name}</span>
                    <span className="cap-reason">{cap.reason}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted-text">
                No capability link selected yet. Choose one or more dimensions below.
              </p>
            )}
            <label className="field-label" htmlFor="capture-capability-links">
              Adjust related capabilities
            </label>
            <select
              className="library-select multi-select"
              id="capture-capability-links"
              multiple
              value={selectedCapabilityIds}
              onChange={(event) =>
                updateCaptureCapabilityLinks(
                  Array.from(event.target.selectedOptions, (option) => option.value),
                )
              }
            >
              {capabilities.map((capability) => (
                <option key={capability.id} value={capability.id}>
                  {capability.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {suggestions.nextPrompt && (
          <div className="ai-suggestion">
            <div className="suggestion-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.42z" />
              </svg>
            </div>
            <p>{suggestions.nextPrompt}</p>
          </div>
        )}
        <div className="capture-footer">
          <div className="tag-row">
            {suggestions.tags.map((tag) => (
              <span className="chip" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
