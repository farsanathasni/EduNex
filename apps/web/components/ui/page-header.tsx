import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  breadcrumb?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
  action?: ReactNode;
  primaryAction?: ReactNode;
};

export default function PageHeader({
  title,
  description,
  subtitle,
  eyebrow,
  breadcrumb,
  backHref,
  backLabel = "Back",
  className = "",
  action,
  primaryAction,
}: PageHeaderProps) {
  const hasActions = Boolean(action || primaryAction);

  return (
    <header
      className={`flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div className="min-w-0">
        {breadcrumb ? (
          <nav aria-label="Breadcrumb" className="mb-2 text-caption text-text-muted">
            {breadcrumb}
          </nav>
        ) : null}

        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1.5 rounded-md text-label font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {backLabel}
          </Link>
        ) : null}

        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="break-words text-page-title font-extrabold leading-page-title tracking-tight text-text">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-1 break-words text-label font-medium text-text-muted">
            {subtitle}
          </p>
        ) : null}

        {description ? (
          <p className="mt-2 break-words text-label leading-relaxed text-text-muted">
            {description}
          </p>
        ) : null}
      </div>

      {hasActions ? (
        <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          {action ? <div className="min-w-0">{action}</div> : null}
          {primaryAction ? <div className="min-w-0">{primaryAction}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
