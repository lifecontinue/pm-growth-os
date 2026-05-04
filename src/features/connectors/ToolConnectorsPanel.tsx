import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';
import type { ToolConnector } from '../../types/domain';

export function ToolConnectorsPanel() {
  const connectors = useAppStore((state) => state.toolConnectors);
  const updateConnector = useAppStore((state) => state.updateConnector);
  const platformConnectors = connectors.filter((connector) => connector.scope === 'platform');
  const userConnectors = connectors.filter((connector) => connector.scope === 'user');
  const connectedCount = connectors.filter(
    (connector) => connector.enabled || connector.status === 'configured',
  ).length;

  return (
    <SectionCard title="Tool Connectors" subtitle="MCP / account connections" actionLabel="Refresh">
      <div className="stack-sm">
        <div className="section-inline-header">
          <strong>Platform Capabilities</strong>
          <span className="muted-text">
            {connectedCount}/{connectors.length} configured
          </span>
        </div>
        <div className="connector-list">
          {platformConnectors.map((connector) => (
            <ConnectorCard
              connector={connector}
              key={connector.id}
              updateConnector={updateConnector}
            />
          ))}
        </div>
        <div className="section-inline-header">
          <strong>Optional User Connections</strong>
          <span className="muted-text">{userConnectors.length} integrations</span>
        </div>
        <div className="connector-list">
          {userConnectors.map((connector) => (
            <ConnectorCard
              connector={connector}
              key={connector.id}
              updateConnector={updateConnector}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function ConnectorCard({
  connector,
  updateConnector,
}: {
  connector: ToolConnector;
  updateConnector: (
    connectorId: string,
    payload: {
      enabled?: boolean;
      status?: ToolConnector['status'];
      mcpEndpoint?: string;
      accountHint?: string;
    },
  ) => void;
}) {
  const isPlatform = connector.scope === 'platform';

  return (
    <article className="connector-card">
      <div className="section-inline-header">
        <div>
          <strong>{connector.name}</strong>
          <span className="connector-method">
            {isPlatform ? 'platform managed' : connector.method}
          </span>
        </div>
        <span className={`status-dot status-${getStatusClass(connector)}`}>
          {connector.status}
        </span>
      </div>
      <p>{connector.description}</p>
      <div className="connector-field">
        <strong>{isPlatform ? 'Configured by the platform' : 'Optional user-provided setup'}</strong>
        <span>{connector.requiredInputs.join(' / ')}</span>
      </div>
      <div className="tag-row">
        {connector.useCases.map((useCase) => (
          <span className="chip chip-muted" key={useCase}>
            {useCase}
          </span>
        ))}
      </div>
      {connector.method === 'mcp' && isPlatform ? (
        <input
          className="library-input"
          value={connector.mcpEndpoint ?? ''}
          placeholder="MCP server URL, configured by the platform"
          onChange={(event) =>
            updateConnector(connector.id, {
              enabled: Boolean(event.target.value.trim()),
              mcpEndpoint: event.target.value,
              status: event.target.value.trim() ? 'configured' : 'not_connected',
            })
          }
        />
      ) : null}
      {connector.accountHint ? <p className="muted-text">{connector.accountHint}</p> : null}
      {!isPlatform ? (
        <div className="library-actions">
          <button
            className="text-button"
            onClick={() =>
              updateConnector(connector.id, {
                enabled: true,
                status: 'needs_account',
              })
            }
          >
            Request Connection
          </button>
          <button
            className="text-button danger-text"
            onClick={() =>
              updateConnector(connector.id, {
                enabled: false,
                status: 'needs_account',
              })
            }
          >
            Pause
          </button>
        </div>
      ) : null}
    </article>
  );
}

function getStatusClass(connector: ToolConnector) {
  if (connector.enabled || connector.status === 'configured' || connector.status === 'enabled') {
    return 'done';
  }

  if (connector.status === 'needs_account') {
    return 'active';
  }

  return 'todo';
}
