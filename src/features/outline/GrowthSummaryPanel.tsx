import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';

export function GrowthSummaryPanel() {
  const notes = useAppStore((state) => state.notes);
  const user = useAppStore((state) => state.userProfile);
  const weeklySummary = useAppStore((state) => state.weeklySummary);

  return (
    <SectionCard title="Weekly Snapshot" subtitle="Progress and next moves">
      <div className="snapshot-grid">
        <div className="snapshot-card snapshot-card-primary">
          <span className="snapshot-label">Current Focus</span>
          <strong>{user.focusArea}</strong>
          <p>{user.lastInsight}</p>
        </div>
        <div className="snapshot-card">
          <span className="snapshot-label">Notes Captured</span>
          <strong>
            {notes.length}/{user.weeklyGoal}
          </strong>
          <p>Local notes saved in this browser.</p>
        </div>
        <div className="snapshot-card">
          <span className="snapshot-label">This Week</span>
          <ul className="compact-list">
            {weeklySummary.progress.slice(0, 2).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="snapshot-card">
          <span className="snapshot-label">Next Actions</span>
          <ul className="compact-list">
            {weeklySummary.nextActions.slice(0, 2).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </SectionCard>
  );
}
