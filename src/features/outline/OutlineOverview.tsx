import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';

export function OutlineOverview() {
  const capabilities = useAppStore((state) => state.capabilities);
  const selectCapability = useAppStore((state) => state.selectCapability);
  const selectedCapabilityId = useAppStore((state) => state.selectedCapabilityId);
  const exploredCount = capabilities.filter((item) => item.progress > 0).length;
  const weakestCapability = capabilities.slice().sort((a, b) => a.progress - b.progress)[0];
  const overallProgress = Math.round(
    capabilities.reduce((sum, item) => sum + item.progress, 0) / capabilities.length,
  );

  return (
    <SectionCard
      title="Skill Graph"
      subtitle="Progress Tracker"
      actionLabel="聚焦弱项"
      onAction={() => selectCapability(weakestCapability.id)}
    >
      <div className="outline-header">
        <div>
          <strong>{overallProgress}%</strong>
          <span>整体进度</span>
        </div>
        <div>
          <strong>
            {exploredCount}/{capabilities.length}
          </strong>
          <span>已激活维度</span>
        </div>
      </div>
      <div className="capability-grid">
        {capabilities.map((capability) => (
          <button
            className={`capability-card capability-card-button ${
              selectedCapabilityId === capability.id ? 'capability-card-selected' : ''
            }`}
            key={capability.id}
            onClick={() => selectCapability(capability.id)}
          >
            <div className="capability-card-top">
              <span className="chip">{capability.category}</span>
              <span className="progress-number">{capability.progress}%</span>
            </div>
            <h3>{capability.name}</h3>
            <p>{capability.summary}</p>
            <div className="progress-bar">
              <span style={{ width: `${capability.progress}%` }} />
            </div>
            <div className="capability-meta">
              <small>{capability.stageLabel}</small>
              <small>{capability.evidenceCount} 条证据</small>
              <small>{capability.updatedAt}</small>
            </div>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
