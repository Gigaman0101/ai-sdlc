"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => {};

// Dialog Context for subcomponents
interface DialogContextValue {
  onClose: () => void;
  titleId: string;
  descriptionId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog compound components must be used within a <Dialog />");
  }
  return context;
}

export type DialogSize = "sm" | "md" | "lg" | "xl";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: DialogSize;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/**
 * Farmart Dialog Component
 * Follows DESIGN.md specifications:
 * - Surface: {colors.surface-card} (#FFFFFF)
 * - Border: 1px solid {colors.hairline} (#E2E8F0)
 * - Elevation: Tier 3 (0 12px 28px -6px rgba(0,0,0,0.14))
 * - Rounded: {rounded.xl} (12px)
 * - Padding: {spacing.lg} (24px)
 * - Backdrop: rgba(15, 23, 42, 0.45) with backdrop-blur
 * - Transition: Native CSS transition (all 0.2s ease)
 * - Accessible: ARIA dialog attributes, Esc key, click outside, focus management
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = "",
}: DialogProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Keyboard escape handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  // Initial focus management
  useEffect(() => {
    if (isOpen && panelRef.current) {
      // Find first focusable element or focus the panel itself
      const focusable = panelRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      } else {
        panelRef.current.focus();
      }
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const content = (
    <DialogContext.Provider value={{ onClose, titleId, descriptionId }}>
      <div
        className="farmart-dialog-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[2px] transition-opacity duration-200 animate-in fade-in"
        onClick={(e) => {
          if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
          }
        }}
        role="presentation"
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className={`farmart-dialog-panel relative w-full ${sizeClasses[size]} bg-white border border-[#E2E8F0] rounded-[12px] shadow-[0_12px_28px_-6px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col transition-all duration-200 focus:outline-none ${className}`}
        >
          {/* Header shorthand if title prop is supplied */}
          {(title || description) && (
            <div className="farmart-dialog-header px-6 pt-5 pb-4 border-b border-[#F1F5F9] flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h3
                    id={titleId}
                    className="farmart-dialog-title font-extrabold text-[18px] text-[#0F172A] tracking-tight leading-snug"
                  >
                    {title}
                  </h3>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className="farmart-dialog-description text-[13px] text-[#64748B] mt-1 leading-normal"
                  >
                    {description}
                  </p>
                )}
              </div>
              <DialogClose />
            </div>
          )}

          {/* Dialog Body */}
          <div className="farmart-dialog-body px-6 py-5 text-[#1E293B] text-[14px] leading-relaxed flex-1 overflow-y-auto max-h-[70vh]">
            {children}
          </div>

          {/* Footer shorthand if footer prop is supplied */}
          {footer && (
            <div className="farmart-dialog-footer px-6 py-4 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </DialogContext.Provider>
  );

  return createPortal(content, document.body);
}

// Subcomponents for Declarative Compound Usage
export function DialogHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`farmart-dialog-header px-6 pt-5 pb-4 border-b border-[#F1F5F9] flex items-start justify-between gap-4 ${className}`}
    >
      <div className="flex-1">{children}</div>
      <DialogClose />
    </div>
  );
}

export function DialogTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { titleId } = useDialog();
  return (
    <h3
      id={titleId}
      className={`farmart-dialog-title font-extrabold text-[18px] text-[#0F172A] tracking-tight leading-snug ${className}`}
    >
      {children}
    </h3>
  );
}

export function DialogDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { descriptionId } = useDialog();
  return (
    <p
      id={descriptionId}
      className={`farmart-dialog-description text-[13px] text-[#64748B] mt-1 leading-normal ${className}`}
    >
      {children}
    </p>
  );
}

export function DialogContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`farmart-dialog-body px-6 py-5 text-[#1E293B] text-[14px] leading-relaxed overflow-y-auto max-h-[70vh] ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`farmart-dialog-footer px-6 py-4 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center justify-end gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

export function DialogClose({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const { onClose } = useDialog();
  return (
    <button
      type="button"
      aria-label="Close dialog"
      onClick={() => {
        if (onClick) onClick();
        onClose();
      }}
      className={`farmart-dialog-close w-[44px] h-[44px] -mr-2 -mt-1 rounded-[8px] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FAB528] ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
