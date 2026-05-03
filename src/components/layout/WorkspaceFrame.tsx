import { ReactNode } from 'react';

export type WorkspaceView = 'growth' | 'notes' | 'reflection' | 'system';
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

const navItems: Array<{ id: WorkspaceView; label: string; description: string }> = [
  {
    id: 'growth',
    label: '成长地图',
    description: '能力图谱、证据和下一步探索',
  },
  {
    id: 'notes',
    label: '记录库',
    description: '检索、复用和导出历史记录',
  },
  {
    id: 'reflection',
    label: '周报复盘',
    description: '生成、编辑和导出总结',
  },
  {
    id: 'system',
    label: '系统设置',
    description: '画像、连接器和成本监控',
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
          <span>Agent 工作台</span>
        </div>
        <nav className="workspace-nav">
          {navItems.map((item) => (
            <button
              className={`nav-item ${activeView === item.id ? 'nav-item-active' : ''}`}
              key={item.id}
              onClick={() => onSelectView(item.id)}
            >
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-actions">
          <button className="solid-button" onClick={() => onOpenModal('capture')}>
            新建记录
          </button>
          <button className="ghost-button" onClick={() => onOpenModal('connectors')}>
            工具连接
          </button>
          <button className="ghost-button" onClick={() => onOpenModal('telemetry')}>
            成本监控
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
              <button className="text-button" onClick={onCloseModal}>
                关闭
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
    capture: '新建记录',
    connectors: '工具连接',
    telemetry: '成本监控',
  };

  return titles[modal];
}
