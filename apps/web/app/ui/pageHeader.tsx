import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  description?: string;
  eyebrow?: string;
  className?: string;
  action?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  eyebrow,
  className = "",
  action,
}: PageHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div>
        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}

        <h1 className="text-heading-sm font-extrabold tracking-tight text-text">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-label leading-relaxed text-text-muted">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}