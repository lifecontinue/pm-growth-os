import { SectionCard } from '../../components/ui/SectionCard';
import { formatUsd, summarizeModelCalls } from '../../lib/model-telemetry';
import { useAppStore } from '../../store/app-store';

export function TelemetryPanel() {
  const clearModelTraces = useAppStore((state) => state.clearModelTraces);
  const exportModelTraces = useAppStore((state) => state.exportModelTraces);
  const traces = useAppStore((state) => state.modelTraces);
  const summary = summarizeModelCalls(traces);

  return (
    <SectionCard
      title="Cost Monitor"
      subtitle="模型调用追踪"
      actionLabel="清空"
      actionDisabled={traces.length === 0}
      onAction={clearModelTraces}
    >
      <div className="stack-sm">
        <div className="telemetry-grid">
          <div className="telemetry-metric">
            <strong>{summary.totalCalls}</strong>
            <span>调用次数</span>
          </div>
          <div className="telemetry-metric">
            <strong>{summary.totalTokens}</strong>
            <span>Total tokens</span>
          </div>
          <div className="telemetry-metric">
            <strong>{formatUsd(summary.estimatedCostUsd)}</strong>
            <span>估算成本</span>
          </div>
        </div>
        <div className="token-split">
          <span>Prompt {summary.promptTokens}</span>
          <span>Completion {summary.completionTokens}</span>
        </div>
        <div className="trace-list">
          <div className="section-inline-header">
            <strong>最近调用</strong>
            <button
              className="text-button"
              disabled={traces.length === 0}
              onClick={() => downloadJson(exportModelTraces())}
            >
              导出 JSON
            </button>
          </div>
          {traces.length > 0 ? (
            traces.slice(0, 4).map((trace) => (
              <article className="trace-item" key={trace.id}>
                <div className="section-inline-header">
                  <strong>{trace.agent}</strong>
                  <span>{formatUsd(trace.estimatedCostUsd)}</span>
                </div>
                <p>{trace.operation}</p>
                <small>
                  {trace.model} · {trace.totalTokens} tokens · {trace.latencyMs} ms
                </small>
              </article>
            ))
          ) : (
            <p className="muted-text">执行保存记录、生成探索或生成周报后会出现 trace。</p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function downloadJson(content: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `pm-growth-model-traces-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
