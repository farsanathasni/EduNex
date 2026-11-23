import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "accent";

export type BadgeStatus =
  | "open"
  | "pending"
  | "in_progress"
  | "active"
  | "approved"
  | "resolved"
  | "completed"
  | "closed"
  | "inactive"
  | "rejected"
  | "cancelled"
  | "failed";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  status?: BadgeStatus;
  size?: "sm" | "md";
  dot?: boolean;
  children: ReactNode;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-border bg-secondary text-text-muted",
  primary: "border-primary/20 bg-primary-subtle text-primary",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-700",
  success: "border-green-500/30 bg-green-500/10 text-green-700",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  danger: "border-red-500/30 bg-red-500/10 text-red-700",
  accent: "border-accent/30 bg-accent-subtle text-accent",
};

const statusTone: Record<BadgeStatus, BadgeTone> = {
  open: "info",
  pending: "warning",
  in_progress: "info",
  active: "success",
  approved: "success",
  resolved: "success",
  completed: "success",
  closed: "neutral",
  inactive: "neutral",
  rejected: "danger",
  cancelled: "neutral",
  failed: "danger",
};

const dotClasses: Record<BadgeTone, string> = {
  neutral: "bg-text-muted",
  primary: "bg-primary",
  info: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  accent: "bg-accent",
};

export default function Badge({
  tone,
  status,
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const resolvedTone = tone ?? (status ? statusTone[status] : "neutral");

  return (
    <span
      {...props}
      className={`inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-semibold ${size === "sm" ? "px-2 py-0.5 text-caption" : "px-3 py-1 text-caption"} ${toneClasses[resolvedTone]} ${className}`}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${dotClasses[resolvedTone]}`}
        />
      ) : null}
      {children}
    </span>
  );
}
