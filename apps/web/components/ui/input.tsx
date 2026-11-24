"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

import Field, { fieldControlClass } from "@/components/ui/field";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
};

export default function Input({
  label,
  helperText,
  error,
  containerClassName = "",
  className = "",
  ...props
}: InputProps) {
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
          className={fieldControlClass(Boolean(error), className)}
        />
      )}
    </Field>
  );
}
