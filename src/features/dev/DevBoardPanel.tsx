import { SectionCard } from '../../components/ui/SectionCard';
import { formatUsd, summarizeModelCalls } from '../../lib/model-telemetry';
import { useAppStore } from '../../store/app-store';
import type { ModelCallTrace } from '../../types/domain';

const TOKEN_BUDGET = 50_000;

export function DevBoardPanel() {
  const clearModelTraces = useAppStore((state) => state.clearModelTraces);
  const exportModelTraces = useAppStore((state) => state.exportModelTraces);
  const traces = useAppStore((state) => state.modelTraces);
  const summary = summarizeModelCalls(traces);
  const usagePercent = Math.min(100, Math.round((summary.totalTokens / TOKEN_BUDGET) * 100));
  const agentRows = summarizeByAgent(traces);

  return (
    <div className="view-stack">
      <SectionCard
        title="Development Board"
        subtitle="Token usage and local agent traces"
        actionLabel="Export Traces"
        actionDisabled={traces.length === 0}
        onAction={() => downloadJson(exportModelTraces())}
      >
        <div className="dev-board">
          <div className="dev-hero-card">
            <div>
              <span className="snapshot-label">Token Budget</span>
              <strong>{summary.totalTokens.toLocaleString()} tokens</strong>
              <p>{usagePercent}% of the local planning budget used.</p>
            </div>
            <div className="progress-bar dev-budget-bar">
              <span style={{ width: `${usagePercent}%` }} />
            </div>
          </div>

          <div className="dev-metric-grid">
            <Metric label="Calls" value={summary.totalCalls.toLocaleString()} />
            <Metric label="Prompt Tokens" value={summary.promptTokens.toLocaleString()} />
            <Metric label="Completion Tokens" value={summary.completionTokens.toLocaleString()} />
            <Metric label="Estimated Cost" value={formatUsd(summary.estimatedCostUsd)} />
          </div>

          <div className="dev-split-grid">
            <div className="summary-block">
              <strong>Usage by Agent</strong>
              {agentRows.length > 0 ? (
                <div className="agent-usage-list">
                  {agentRows.map((row) => (
                    <div className="agent-usage-row" key={row.agent}>
                      <div>
                        <strong>{row.agent}</strong>
                        <span>{row.calls} calls</span>
                      </div>
                      <span>{row.tokens.toLocaleString()} tokens</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted-text">No agent traces yet.</p>
              )}
            </div>

            <div className="summary-block">
              <strong>Trace Controls</strong>
              <p>
                Use this board while developing prompts, local heuristics, and future
                multi-agent workflows.
              </p>
              <div className="detail-actions">
                <button
                  className="ghost-button"
                  disabled={traces.length === 0}
                  onClick={clearModelTraces}
                >
                  Clear Traces
                </button>
              </div>
            </div>
          </div>

          <div className="trace-list">
            <div className="section-inline-header">
              <strong>Latest Trace Events</strong>
              <span className="muted-text">{traces.length} total</span>
            </div>
            {traces.length > 0 ? (
              traces.slice(0, 8).map((trace) => (
                <article className="trace-item" key={trace.id}>
                  <div className="section-inline-header">
                    <strong>{trace.agent}</strong>
                    <span>{formatUsd(trace.estimatedCostUsd)}</span>
                  </div>
                  <p>{trace.operation}</p>
                  <small>
                    {trace.promptTokens} prompt + {trace.completionTokens} completion =
                    {' '}
                    {trace.totalTokens} tokens · {trace.latencyMs} ms
                  </small>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">T</div>
                <h3>No traces yet</h3>
                <p>Save a note, generate a task, or create a weekly review to populate this board.</p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="telemetry-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function summarizeByAgent(traces: ModelCallTrace[]) {
  const rows = new Map<string, { agent: string; calls: number; tokens: number }>();

  for (const trace of traces) {
    const row = rows.get(trace.agent) ?? {
      agent: trace.agent,
      calls: 0,
      tokens: 0,
    };

    row.calls += 1;
    row.tokens += trace.totalTokens;
    rows.set(trace.agent, row);
  }

  return Array.from(rows.values()).sort((a, b) => b.tokens - a.tokens);
}

function downloadJson(content: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `pm-growth-dev-traces-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
