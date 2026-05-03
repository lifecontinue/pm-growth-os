import { ReactNode } from 'react';

type SectionCardProps = {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
  children: ReactNode;
};

export function SectionCard({
  title,
  subtitle,
  actionLabel,
  actionDisabled,
  onAction,
  children,
}: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-card-header">
        <div>
          <p className="section-eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>
        {actionLabel ? (
          <button className="ghost-button" disabled={actionDisabled} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}
