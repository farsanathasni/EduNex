
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent" | "outline";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary-hover",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
    accent:
      "bg-accent text-accent-foreground hover:bg-accent-hover",
    outline:
      "border border-border bg-surface text-text hover:bg-secondary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-caption",
    md: "px-4 py-2 text-label",
    lg: "px-5 py-3 text-label",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
