"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";

export type TabsVariant = "surface" | "line";

export type TabItem<T extends string = string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

type TabsProps<T extends string> = {
  items: readonly TabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  ariaLabel?: string;
  variant?: TabsVariant;
  size?: "sm" | "md";
  className?: string;
};

export default function Tabs<T extends string>({
  items,
  value,
  onValueChange,
  ariaLabel,
  variant = "surface",
  size = "md",
  className = "",
}: TabsProps<T>) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    const enabled = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.disabled);
    if (enabled.length === 0) return;

    const currentIndex = enabled.findIndex(({ item }) => item.value === value);
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + enabled.length) % enabled.length;
    const next = enabled[nextIndex];

    event.preventDefault();
    onValueChange(next.item.value);
    buttonRefs.current[next.index]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`flex w-full min-w-0 items-center gap-1 overflow-x-auto scrollbar-thin ${
        variant === "surface"
          ? "rounded-xl border border-border bg-secondary p-1"
          : "border-b border-border"
      } ${className}`}
    >
      {items.map((item, index) => {
        const active = item.value === value;
        const activeClass =
          variant === "surface"
            ? "bg-surface text-primary shadow-subtle"
            : "border-b-2 border-primary text-primary";

        return (
          <button
            key={item.value}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={item.disabled}
            onClick={() => onValueChange(item.value)}
            className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 ${
              size === "sm" ? "min-h-9 px-3 py-1.5 text-caption" : "min-h-11 px-4 py-2 text-label sm:min-h-10"
            } ${active ? activeClass : "text-text-muted hover:text-text"}`}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
