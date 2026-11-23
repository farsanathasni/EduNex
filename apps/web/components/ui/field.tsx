"use client";

import { useId, type ReactNode } from "react";

export type FieldRenderProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export type FieldProps = {
  id?: string;
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode | ((props: FieldRenderProps) => ReactNode);
};

export function fieldControlClass(
  error?: boolean,
  className = "",
  fixedHeight = true,
) {
  return [
    fixedHeight ? "h-11 sm:h-10" : "min-h-11",
    "w-full min-w-0 rounded-lg border bg-surface px-3 py-2 text-label text-text outline-none transition",
    "placeholder:text-text-subtle hover:border-primary/50",
    "focus:border-primary focus:ring-2 focus:ring-primary/20",
    "disabled:cursor-not-allowed disabled:opacity-50",
    error
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "border-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Field({
  id,
  label,
  helperText,
  error,
  required = false,
  className = "",
  children,
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = `${fieldId}-helper`;
  const errorId = `${fieldId}-error`;
  const describedBy = error
    ? errorId
    : helperText
      ? helperId
      : undefined;

  const renderProps: FieldRenderProps = {
    id: fieldId,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
  };

  return (
    <div className={`min-w-0 space-y-1.5 ${className}`}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="block text-label font-medium text-text"
        >
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </label>
      ) : null}

      {typeof children === "function" ? children(renderProps) : children}

      {error ? (
        <p id={errorId} role="alert" className="text-caption text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-caption text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
