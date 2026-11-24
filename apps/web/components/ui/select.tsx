"use client";

import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import Field, { fieldControlClass } from "@/components/ui/field";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  containerClassName?: string;
};

export default function Select({
  label,
  helperText,
  error,
  placeholder,
  containerClassName = "",
  className = "",
  children,
  disabled,
  ...props
}: SelectProps) {
  return (
    <Field
      id={props.id}
      label={label}
      helperText={helperText}
      error={error}
      className={`w-full ${containerClassName}`}
    >
      {(fieldProps) => (
        <div className="relative w-full min-w-0">
          <select
            {...fieldProps}
            {...props}
            disabled={disabled}
            className={fieldControlClass(
              Boolean(error),
              `appearance-none truncate pl-3 pr-10 ${className}`,
            )}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {children}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          />
        </div>
      )}
    </Field>
  );
}
