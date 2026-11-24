"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
};

export default function Checkbox({
  id,
  label,
  helperText,
  error,
  containerClassName = "",
  className = "",
  disabled,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className={`min-w-0 ${containerClassName}`}>
      <label
        htmlFor={inputId}
        className={`flex min-h-11 items-start gap-3 text-label text-text ${disabled ? "opacity-50" : "cursor-pointer"}`}
      >
        <input
          {...props}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={`mt-0.5 h-5 w-5 shrink-0 rounded-md border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed ${className}`}
        />
        {label ? <span className="min-w-0 break-words">{label}</span> : null}
      </label>
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
