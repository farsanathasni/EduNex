"use client";

import { useId, type ReactNode } from "react";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  name?: string;
  value?: string;
  className?: string;
};

export default function Switch({
  checked,
  onCheckedChange,
  label,
  helperText,
  error,
  disabled = false,
  name,
  value,
  className = "",
}: SwitchProps) {
  const generatedId = useId();
  const switchId = generatedId;
  const helperId = `${switchId}-helper`;
  const errorId = `${switchId}-error`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className={`min-w-0 ${className}`}>
      <div className="flex min-h-11 items-center gap-3">
        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          onClick={() => onCheckedChange(!checked)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-primary" : "bg-secondary-hover"}`}
        >
          <span
            aria-hidden="true"
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow-subtle transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
        {name ? (
          <input type="hidden" name={name} value={value ?? String(checked)} />
        ) : null}
        {label ? (
          <label htmlFor={switchId} className="min-w-0 break-words text-label font-medium text-text">
            {label}
          </label>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-caption text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1 text-caption text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
