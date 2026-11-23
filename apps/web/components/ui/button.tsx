"use client";

import type { ButtonHTMLAttributes, Ref } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "outline"
  | "ghost"
  | "danger"
  | "destructive";

type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
    accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
    outline: "border border-border bg-surface text-text hover:bg-secondary",
    ghost: "bg-transparent text-text hover:bg-secondary",
    danger: "bg-red-600 text-white hover:bg-red-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "min-h-11 px-3 py-1.5 text-caption sm:min-h-9",
    md: "min-h-11 px-4 py-2 text-label sm:min-h-10",
    lg: "min-h-12 px-5 py-2.5 text-label sm:min-h-11",
    icon: "h-11 w-11 p-0 sm:h-10 sm:w-10",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
