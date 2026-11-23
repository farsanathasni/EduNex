"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

import Field, { fieldControlClass } from "@/components/ui/field";

type FileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  containerClassName?: string;
};

export default function FileInput({
  label,
  helperText,
  error,
  containerClassName = "",
  className = "",
  ...props
}: FileInputProps) {
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
          type="file"
          className={fieldControlClass(
            Boolean(error),
            `cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-primary-subtle file:px-3 file:py-1.5 file:text-caption file:font-semibold file:text-primary hover:file:bg-secondary-hover ${className}`,
            false,
          )}
        />
      )}
    </Field>
  );
}
