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
      subtitle="能力深挖"
      actionLabel="生成聚焦任务"
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
            <small>{selectedCapability.evidenceCount} 条证据</small>
            <small>{selectedCapability.updatedAt}</small>
          </div>
          <div className="detail-actions">
            <button
              className="solid-button"
              onClick={() => sendCapabilityToCapture(selectedCapability.id)}
            >
              创建探索草稿
            </button>
            <button
              className="ghost-button"
              onClick={() => generateCapabilityCoachPlan(selectedCapability.id)}
            >
              更新 Coach 议程
            </button>
          </div>
        </div>
        <div className="guidance-stack">
          <div className="summary-block">
            <strong>当前风险</strong>
            <p>{guidance.risk}</p>
          </div>
          <div className="summary-block">
            <strong>下一步建议</strong>
            <p>{guidance.nextAction}</p>
          </div>
          <div className="summary-block">
            <strong>验收标准</strong>
            <p>{guidance.acceptance}</p>
          </div>
        </div>
      </div>
      <div className="evidence-section">
        <div className="section-inline-header">
          <strong>能力证据</strong>
          <span className="muted-text">{evidenceNotes.length} 条关联记录</span>
        </div>
        {evidenceNotes.length > 0 ? (
          <div className="evidence-list">
            {evidenceNotes.slice(0, 4).map((note) => (
              <article className="evidence-note" key={note.id}>
                <p>{note.content}</p>
                <span>{new Date(note.createdAt).toLocaleString('zh-CN')}</span>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted-text">还没有关联证据。可以先创建一条探索草稿，再保存为记录。</p>
        )}
      </div>
    </SectionCard>
  );
}

function getCapabilityGuidance(capability: Capability) {
  if (capability.progress >= 75) {
    return {
      risk: '已经有较多实践积累，主要风险是经验停留在个人隐性判断里。',
      nextAction: '整理一个可复用案例，说明输入、约束、判断标准和失败边界。',
      acceptance: '能把方法讲给另一个 PM，并让对方复用到一个真实任务中。',
    };
  }

  if (capability.progress >= 45) {
    return {
      risk: '已经进入实践区，但证据可能分散，需要把经验变成稳定流程。',
      nextAction: '选择一个最近场景，补齐「问题 -> 实验 -> 结果 -> 反思」四段记录。',
      acceptance: '能说清楚这个能力在什么场景有效，以及什么场景需要降级或换方法。',
    };
  }

  return {
    risk: '当前证据较少，容易停留在概念理解，缺少真实工作场景校验。',
    nextAction: '先做一个 20 分钟微型练习，把输入、输出和评价标准写进记录。',
    acceptance: '至少沉淀 2 条真实记录，并能说明这个能力解决了哪个 PM 工作问题。',
  };
}
