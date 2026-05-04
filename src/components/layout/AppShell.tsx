import type { ReactNode } from 'react';
import { useAppStore } from '../../store/app-store';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const backendError = useAppStore((state) => state.backendError);
  const user = useAppStore((state) => state.userProfile);

  return (
    <div className="app-shell">
      <div className="hero-backdrop" />
      <header className="hero">
        <div className="hero-left">
          <div className="hero-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>AI PM Growth System</span>
          </div>
          <h1>PM Growth OS</h1>
          <p className="hero-copy">
            Capture your AI product work, track capability growth, and generate periodic reflections.
          </p>
        </div>
        <div className="hero-right">
          <div className="growth-stats">
            <div className="stat-item">
              <span className="stat-value">{user.savedNotes}</span>
              <span className="stat-label">Notes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.weeklyGoal}</span>
              <span className="stat-label">Weekly Goal</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{user.focusArea}</span>
              <span className="stat-label">Focus Area</span>
            </div>
          </div>
          <div className="hero-tagline">{user.currentStageLabel}</div>
        </div>
      </header>
      {backendError ? <div className="backend-alert">{backendError}</div> : null}
      <main className="main-stack">{children}</main>
    </div>
  );
}
