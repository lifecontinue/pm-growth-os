import { useState } from 'react';
import { SectionCard } from '../../components/ui/SectionCard';
import { useAppStore } from '../../store/app-store';
import type { LearningResourceType } from '../../types/domain';

const resourceFilters: Array<LearningResourceType | 'all'> = [
  'all',
  'official',
  'framework',
  'tutorial',
  'case-study',
  'paper',
  'tool',
];

export function CoachPanel() {
  const [activeFilter, setActiveFilter] = useState<LearningResourceType | 'all'>('all');
  const coachPlan = useAppStore((state) => state.coachPlan);
  const generateCoachPlan = useAppStore((state) => state.generateCoachPlan);
  const sendLearningResourceToCapture = useAppStore(
    (state) => state.sendLearningResourceToCapture,
  );
  const sendCoachStepToCapture = useAppStore((state) => state.sendCoachStepToCapture);
  const learningGuide = coachPlan.learningGuide;
  const filteredResources =
    activeFilter === 'all'
      ? learningGuide?.resources ?? []
      : learningGuide?.resources.filter((resource) => resource.resourceType === activeFilter) ?? [];

  return (
    <SectionCard
      title="Coach Agent"
      subtitle="Knowledge-guided practice"
      actionLabel="Generate Learning Path"
      onAction={generateCoachPlan}
    >
      <div className="stack-sm">
        <p className="panel-intro">{coachPlan.description}</p>
        {learningGuide ? (
          <div className="learning-guide-card">
            <div className="section-inline-header">
              <div>
                <strong>{learningGuide.capabilityName}</strong>
                <span className="muted-text">Learn &gt; Practice &gt; Capture &gt; Reflect</span>
              </div>
              <span className="chip chip-muted">Knowledge Tool</span>
            </div>
            <p>{learningGuide.whyNow}</p>
            <div className="learning-path-list">
              {learningGuide.learningPath.map((item, index) => (
                <span key={item}>
                  <strong>{index + 1}</strong>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <ol className="agenda-list">
          {coachPlan.steps.map((step) => (
            <li key={step.title}>
              <div className="agenda-item-head">
                <strong>{step.title}</strong>
                <span className={`status-dot status-${step.status}`}>{step.status}</span>
              </div>
              <p className="coach-step-detail">{step.detail}</p>
              <button className="text-button" onClick={() => sendCoachStepToCapture(step.id)}>
                Turn into Capture Draft
              </button>
            </li>
          ))}
        </ol>
        {learningGuide ? (
          <div className="learning-resources">
            <div className="section-inline-header">
              <div>
                <strong>Learning Resources</strong>
                <span className="muted-text">
                  Pick one resource, practice immediately, then capture evidence.
                </span>
              </div>
              <span className="muted-text">{filteredResources.length} shown</span>
            </div>
            <div className="resource-filter-row">
              {resourceFilters.map((filter) => (
                <button
                  className={`filter-chip ${activeFilter === filter ? 'filter-chip-active' : ''}`}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {formatResourceType(filter)}
                </button>
              ))}
            </div>
            <div className="resource-grid">
              {filteredResources.map((resource) => (
                <article className="resource-card" key={resource.id}>
                  <div className="section-inline-header">
                    <span className="chip chip-muted">
                      {formatResourceType(resource.resourceType)}
                    </span>
                    <span className="muted-text">{resource.estimatedMinutes} min</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.summary}</p>
                  <div className="why-resource">
                    <strong>Why this resource?</strong>
                    <span>{resource.whyUseful}</span>
                  </div>
                  <div className="resource-meta">
                    <span>{resource.source}</span>
                    <span>{resource.difficulty}</span>
                  </div>
                  <div className="detail-actions">
                    <a
                      className="solid-button resource-link"
                      href={resource.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Start Learning
                    </a>
                    <button
                      className="ghost-button"
                      onClick={() => sendLearningResourceToCapture(resource.id)}
                      type="button"
                    >
                      Send Practice to Capture
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

function formatResourceType(type: LearningResourceType | 'all') {
  const labelMap: Record<LearningResourceType | 'all', string> = {
    all: 'All',
    official: 'Official',
    framework: 'Framework',
    tutorial: 'Tutorial',
    'case-study': 'Case Study',
    paper: 'Paper',
    tool: 'Tool',
  };

  return labelMap[type];
}
