"use client";

import type { ReactNode, TextareaHTMLAttributes } from "react";

import Field, { fieldControlClass } from "@/components/ui/field";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
};

export default function Textarea({
  label,
  helperText,
  error,
  containerClassName = "",
  className = "",
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <Field
      id={props.id}
      label={label}
      helperText={helperText}
      error={error}
      className={`w-full ${containerClassName}`}
    >
      {(fieldProps) => (
        <textarea
          {...fieldProps}
          {...props}
          rows={rows}
          className={fieldControlClass(
            Boolean(error),
            `min-h-24 resize-y py-2.5 ${className}`,
            false,
          )}
        />
      )}
    </Field>
  );
}
