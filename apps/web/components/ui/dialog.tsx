"use client";

import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import Button from "@/components/ui/button";

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  hideClose?: boolean;
  className?: string;
};

const subscribe = () => () => {};

const sizeClasses: Record<DialogSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-5xl",
  full: "sm:max-w-[calc(100vw-4rem)]",
};

export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  hideClose = false,
  className = "",
}: DialogProps) {
  const titleId = useId();
  const descriptionId = `${titleId}-description`;
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-surface shadow-xl sm:rounded-2xl ${sizeClasses[size]} ${className}`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border p-5 sm:p-6">
          <div className="min-w-0">
            <h2 id={titleId} className="break-words text-section-title font-bold text-text">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 break-words text-label text-text-muted">
                {description}
              </p>
            ) : null}
          </div>
          {hideClose ? null : (
            <Button
              ref={closeRef}
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close dialog"
              onClick={onClose}
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] scrollbar-thin sm:p-6">
          {children}
        </div>

        {footer ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
            {footer}
          </div>
        ) : null}
      </section>
    </div>,
    document.body,
  );
}
