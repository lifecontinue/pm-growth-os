import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';

export function ProfilePanel() {
  const user = useAppStore((state) => state.userProfile);
  const resetWorkspace = useAppStore((state) => state.resetWorkspace);

  return (
    <SectionCard
      title="Profile Agent"
      subtitle="成长画像"
      actionLabel="重置"
      onAction={resetWorkspace}
    >
      <div className="stack-sm">
        <div className="profile-metric-row">
          <div className="profile-metric">
            <strong>{user.focusArea}</strong>
            <span>当前关注主题</span>
          </div>
          <div className="profile-metric">
            <strong>{user.preferredModel}</strong>
            <span>偏好模型</span>
          </div>
          <div className="profile-metric">
            <strong>{user.savedNotes}</strong>
            <span>已保存记录</span>
          </div>
        </div>
        <div className="summary-block">
          <strong>本周目标</strong>
          <p>{user.weeklyGoal} 次探索，1 次阶段总结，1 个输出作品。</p>
        </div>
        <div className="summary-block">
          <strong>最近洞察</strong>
          <p>{user.lastInsight}</p>
        </div>
        <div className="summary-block">
          <strong>长期目标</strong>
          <p>{user.longTermGoal}</p>
        </div>
      </div>
    </SectionCard>
  );
}
