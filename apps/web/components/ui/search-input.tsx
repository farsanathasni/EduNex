"use client";

import {
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Search, X } from "lucide-react";

import Field, { fieldControlClass } from "@/components/ui/field";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  clearLabel?: string;
  onClear?: () => void;
  containerClassName?: string;
};

export default function SearchInput({
  label,
  helperText,
  error,
  clearLabel = "Clear search",
  onClear,
  containerClassName = "",
  className = "",
  value,
  defaultValue,
  onChange,
  disabled,
  ...props
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue === undefined || defaultValue === null
      ? ""
      : String(defaultValue),
  );
  const currentValue =
    value === undefined || value === null ? internalValue : String(value);

  const clear = () => {
    setInternalValue("");
    onClear?.();
    onChange?.({
      target: { value: "" },
      currentTarget: { value: "" },
    } as unknown as ChangeEvent<HTMLInputElement>);
  };

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
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
          />
          <input
            {...fieldProps}
            {...props}
            type="search"
            value={currentValue}
            disabled={disabled}
            onChange={(event) => {
              if (value === undefined) setInternalValue(event.target.value);
              onChange?.(event);
            }}
            className={fieldControlClass(Boolean(error), `pl-10 pr-10 ${className}`)}
          />
          {currentValue.length > 0 && !disabled ? (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={clear}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-text-subtle transition hover:bg-secondary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:h-8 sm:w-8"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      )}
    </Field>
  );
}
