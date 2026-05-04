import type { ReactNode } from 'react';

export type WorkspaceView = 'growth' | 'notes' | 'reflection' | 'dev' | 'system';
export type WorkspaceModal = 'capture' | 'connectors' | 'telemetry' | null;

type WorkspaceFrameProps = {
  activeModal: WorkspaceModal;
  activeView: WorkspaceView;
  children: ReactNode;
  modalContent: ReactNode;
  onCloseModal: () => void;
  onOpenModal: (modal: Exclude<WorkspaceModal, null>) => void;
  onSelectView: (view: WorkspaceView) => void;
};

const navItems: Array<{ id: WorkspaceView; label: string; description: string; icon: string }> = [
  {
    id: 'growth',
    label: 'Growth Map',
    description: 'Capability graph and path',
    icon: 'M9 19V6l12-3v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm12-3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z',
  },
  {
    id: 'notes',
    label: 'Notes Library',
    description: 'History and search',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  },
  {
    id: 'reflection',
    label: 'Weekly Review',
    description: 'Generate and export',
    icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L12 17l-7-9',
  },
  {
    id: 'dev',
    label: 'Dev Board',
    description: 'Tokens and traces',
    icon: 'M4 7h16M4 12h10M4 17h7M17 14l3 3-3 3',
  },
  {
    id: 'system',
    label: 'System',
    description: 'Tools and cost',
    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  },
];

export function WorkspaceFrame({
  activeModal,
  activeView,
  children,
  modalContent,
  onCloseModal,
  onOpenModal,
  onSelectView,
}: WorkspaceFrameProps) {
  return (
    <div className="workspace-frame">
      <aside className="workspace-sidebar" aria-label="Workspace navigation">
        <div className="sidebar-brand">
          <strong>PM Growth OS</strong>
          <span>Agent workspace</span>
        </div>
        <nav className="workspace-nav">
          {navItems.map((item) => (
            <button
              className={`nav-item ${activeView === item.id ? 'nav-item-active' : ''}`}
              key={item.id}
              onClick={() => onSelectView(item.id)}
            >
              <div className="nav-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
              </div>
              <div className="nav-text">
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </div>
            </button>
          ))}
        </nav>
        <div className="sidebar-actions">
          <button className="solid-button" onClick={() => onOpenModal('capture')}>
            New Note
          </button>
          <button className="ghost-button" onClick={() => onOpenModal('connectors')}>
            Connect Tools
          </button>
          <button className="ghost-button" onClick={() => onOpenModal('telemetry')}>
            Cost Monitor
          </button>
        </div>
      </aside>
      <section className="workspace-content">{children}</section>
      {activeModal ? (
        <div className="modal-backdrop" role="presentation" onClick={onCloseModal}>
          <div
            aria-modal="true"
            className="modal-panel"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <strong>{getModalTitle(activeModal)}</strong>
              <button
                aria-label="Close modal"
                className="icon-button"
                title="Close modal"
                onClick={onCloseModal}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {modalContent}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getModalTitle(modal: Exclude<WorkspaceModal, null>) {
  const titles = {
    capture: 'New Note',
    connectors: 'Tool Connectors',
    telemetry: 'Cost Monitor',
  };

  return titles[modal];
}
