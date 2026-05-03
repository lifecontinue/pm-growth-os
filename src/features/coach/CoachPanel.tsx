import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';

export function CoachPanel() {
  const coachPlan = useAppStore((state) => state.coachPlan);
  const generateCoachPlan = useAppStore((state) => state.generateCoachPlan);
  const sendCoachStepToCapture = useAppStore((state) => state.sendCoachStepToCapture);

  return (
    <SectionCard
      title="Coach Agent"
      subtitle="引导探索"
      actionLabel="生成任务"
      onAction={generateCoachPlan}
    >
      <div className="stack-sm">
        <p className="panel-intro">{coachPlan.description}</p>
        <ol className="agenda-list">
          {coachPlan.steps.map((step) => (
            <li key={step.title}>
              <div className="agenda-item-head">
                <strong>{step.title}</strong>
                <span className={`status-dot status-${step.status}`}>{step.status}</span>
              </div>
              <span>{step.detail}</span>
              <button className="text-button" onClick={() => sendCoachStepToCapture(step.id)}>
                转成记录草稿
              </button>
            </li>
          ))}
        </ol>
      </div>
    </SectionCard>
  );
}
