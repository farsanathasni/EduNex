
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg";
};

export default function Card({
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const paddingStyles = {
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
  };

  return (
    <div
      className={`rounded-2xl border border-border bg-surface shadow-subtle ${paddingStyles[padding]} ${className}`}
      {...props}
    />
  );
}
