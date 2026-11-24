interface SkeletonProps {
  className?: string;
  shape?: "text" | "badge" | "button" | "circle";
}

export function Skeleton({ className = "", shape = "text" }: SkeletonProps) {
  const shapes = {
    text: "rounded-md",
    badge: "h-6 w-20 rounded-full",
    button: "h-9 w-24 rounded-lg",
    circle: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-secondary ${shapes[shape]} ${className}`}
    />
  );
}
