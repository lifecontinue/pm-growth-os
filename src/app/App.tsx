import { useEffect, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import {
  WorkspaceFrame,
  type WorkspaceModal,
  type WorkspaceView,
} from '../components/layout/WorkspaceFrame';
import { CoachPanel } from '../features/coach/CoachPanel';
import { CapturePanel } from '../features/capture/CapturePanel';
import { DevBoardPanel } from '../features/dev/DevBoardPanel';
import { NotesLibraryPanel } from '../features/notes/NotesLibraryPanel';
import { CapabilityDetailPanel } from '../features/outline/CapabilityDetailPanel';
import { GrowthSummaryPanel } from '../features/outline/GrowthSummaryPanel';
import { OutlineOverview } from '../features/outline/OutlineOverview';
import { ProfilePanel } from '../features/profile/ProfilePanel';
import { ReflectionPanel } from '../features/reflection/ReflectionPanel';
import { TelemetryPanel } from '../features/telemetry/TelemetryPanel';
import { ToolConnectorsPanel } from '../features/connectors/ToolConnectorsPanel';
import { useAppStore } from '../store/app-store';

export function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>('growth');
  const [activeModal, setActiveModal] = useState<WorkspaceModal>(null);
  const loadWorkspace = useAppStore((state) => state.loadWorkspace);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  return (
    <AppShell>
      <WorkspaceFrame
        activeModal={activeModal}
        activeView={activeView}
        modalContent={renderModal(activeModal)}
        onCloseModal={() => setActiveModal(null)}
        onOpenModal={setActiveModal}
        onSelectView={setActiveView}
      >
        {renderView(activeView)}
      </WorkspaceFrame>
    </AppShell>
  );
}

function renderView(view: WorkspaceView) {
  switch (view) {
    case 'growth':
      return (
        <div className="view-stack">
          <GrowthSummaryPanel />
          <OutlineOverview />
          <CapabilityDetailPanel />
          <CoachPanel />
        </div>
      );
    case 'notes':
      return <NotesLibraryPanel />;
    case 'reflection':
      return <ReflectionPanel />;
    case 'dev':
      return <DevBoardPanel />;
    case 'system':
      return (
        <div className="content-grid">
          <ProfilePanel />
          <ToolConnectorsPanel />
          <TelemetryPanel />
        </div>
      );
  }
}

function renderModal(modal: WorkspaceModal) {
  switch (modal) {
    case 'capture':
      return <CapturePanel />;
    case 'connectors':
      return <ToolConnectorsPanel />;
    case 'telemetry':
      return <TelemetryPanel />;
    default:
      return null;
  }
}
