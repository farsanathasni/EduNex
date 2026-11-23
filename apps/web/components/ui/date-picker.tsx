"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

import Field, { fieldControlClass } from "@/components/ui/field";

type DatePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
};

export default function DatePicker({
  label,
  helperText,
  error,
  containerClassName = "",
  className = "",
  ...props
}: DatePickerProps) {
  return (
    <Field
      id={props.id}
      label={label}
      helperText={helperText}
      error={error}
      className={`w-full ${containerClassName}`}
    >
      {(fieldProps) => (
        <input
          {...fieldProps}
          {...props}
          type="date"
          className={fieldControlClass(
            Boolean(error),
            `[color-scheme:light] ${className}`,
          )}
        />
      )}
    </Field>
  );
}
