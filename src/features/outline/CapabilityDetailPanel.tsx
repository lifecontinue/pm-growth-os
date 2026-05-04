import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';
import type { Capability } from '../../types/domain';

export function CapabilityDetailPanel() {
  const capabilities = useAppStore((state) => state.capabilities);
  const generateCapabilityCoachPlan = useAppStore(
    (state) => state.generateCapabilityCoachPlan,
  );
  const notes = useAppStore((state) => state.notes);
  const selectedCapabilityId = useAppStore((state) => state.selectedCapabilityId);
  const sendCapabilityToCapture = useAppStore((state) => state.sendCapabilityToCapture);
  const selectedCapability =
    capabilities.find((capability) => capability.id === selectedCapabilityId) ??
    capabilities[0];
  const evidenceNotes = notes.filter((note) =>
    note.relatedCapabilityIds.includes(selectedCapability.id),
  );
  const guidance = getCapabilityGuidance(selectedCapability);

  return (
    <SectionCard
      title="Capability Detail"
      subtitle="Deep dive"
      actionLabel="Generate Focus Task"
      onAction={() => generateCapabilityCoachPlan(selectedCapability.id)}
    >
      <div className="capability-detail-grid">
        <div className="capability-detail-main">
          <div className="section-inline-header">
            <div>
              <p className="section-eyebrow">{selectedCapability.category}</p>
              <h2>{selectedCapability.name}</h2>
            </div>
            <span className="progress-number">{selectedCapability.progress}%</span>
          </div>
          <p>{selectedCapability.summary}</p>
          <div className="progress-bar">
            <span style={{ width: `${selectedCapability.progress}%` }} />
          </div>
          <div className="capability-meta">
            <small>{selectedCapability.stageLabel}</small>
            <small>{selectedCapability.evidenceCount} evidence notes</small>
            <small>{selectedCapability.updatedAt}</small>
          </div>
          <div className="detail-actions">
            <button
              className="solid-button"
              onClick={() => sendCapabilityToCapture(selectedCapability.id)}
            >
              Create Capture Draft
            </button>
            <button
              className="ghost-button"
              onClick={() => generateCapabilityCoachPlan(selectedCapability.id)}
            >
              Update Coach Plan
            </button>
          </div>
        </div>
        <div className="guidance-stack">
          <div className="summary-block">
            <strong>Current Risk</strong>
            <p>{guidance.risk}</p>
          </div>
          <div className="summary-block">
            <strong>Next Action</strong>
            <p>{guidance.nextAction}</p>
          </div>
          <div className="summary-block">
            <strong>Acceptance Criteria</strong>
            <p>{guidance.acceptance}</p>
          </div>
        </div>
      </div>
      <div className="evidence-section">
        <div className="section-inline-header">
          <strong>Capability Evidence</strong>
          <span className="muted-text">{evidenceNotes.length} linked notes</span>
        </div>
        {evidenceNotes.length > 0 ? (
          <div className="evidence-list">
            {evidenceNotes.slice(0, 4).map((note) => (
              <article className="evidence-note" key={note.id}>
                <p>{note.content}</p>
                <span>{new Date(note.createdAt).toLocaleString('en-US')}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-text">
            No linked evidence yet. Create a capture draft and save it as a note.
          </p>
        )}
      </div>
    </SectionCard>
  );
}

function getCapabilityGuidance(capability: Capability) {
  if (capability.progress >= 75) {
    return {
      risk: 'You have meaningful practice, but the main risk is keeping the knowledge implicit.',
      nextAction: 'Package one reusable case with inputs, constraints, judgment criteria, and failure boundaries.',
      acceptance: 'Another PM can reuse your method on a real task after you explain it.',
    };
  }

  if (capability.progress >= 45) {
    return {
      risk: 'You are in the practice zone, but evidence may be scattered across different contexts.',
      nextAction: 'Pick one recent scenario and write it as Problem -> Experiment -> Result -> Reflection.',
      acceptance: 'You can explain where this capability works and where it needs a fallback.',
    };
  }

  return {
    risk: 'Evidence is still thin, so the capability may stay conceptual instead of work-tested.',
    nextAction: 'Run one 20-minute micro-practice and capture the input, output, and evaluation criteria.',
    acceptance: 'Create at least two real notes and explain which PM problem the capability solved.',
  };
}
