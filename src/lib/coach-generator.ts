import type { Capability, CoachPlan, Note, UserProfile } from '../types/domain';

export function generateCoachPlan({
  capabilities,
  notes,
  targetCapabilityId,
  userProfile,
}: {
  capabilities: Capability[];
  notes: Note[];
  targetCapabilityId?: string;
  userProfile: UserProfile;
}): CoachPlan {
  const defaultCapability = capabilities
    .slice()
    .sort((a, b) => a.progress - b.progress)[0];
  const targetCapability =
    capabilities.find((capability) => capability.id === targetCapabilityId) ?? defaultCapability;
  const strongestCapability = capabilities
    .slice()
    .sort((a, b) => b.progress - a.progress)[0];
  const recentTopic = notes[0]?.tags[0] ?? userProfile.focusArea;

  return {
    description: `Coach Agent 建议围绕 ${targetCapability.name} 建一个小任务，并借用 ${strongestCapability.name} 的已有经验降低启动成本。`,
    steps: [
      {
        id: 'inspect-gap',
        title: 'Step 1: 定义能力缺口',
        detail: `写下 ${targetCapability.name} 目前最不确定的 1 个问题，并补充一个真实工作场景。`,
        status: 'active',
      },
      {
        id: 'run-micro-practice',
        title: 'Step 2: 完成微型实践',
        detail: `基于 ${recentTopic} 设计一个 20 分钟内能完成的练习，并记录输入、输出和判断标准。`,
        status: 'todo',
      },
      {
        id: 'capture-evidence',
        title: 'Step 3: 沉淀能力证据',
        detail: `把实践结果写成一条记录，关联到 ${targetCapability.name}，并说明它如何改变你的判断。`,
        status: 'todo',
      },
    ],
  };
}
