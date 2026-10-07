"use client";

import React from "react";

export type ButtonVariant = "primary" | "pill" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Farmart Design System Button
 * Strictly mapped from DESIGN.md:
 * - button-primary: bg #FAB528, text #000000, hover #E5A420, translateY(-1px), rounded 6px
 * - button-pill: bg #FFFFFF, text #0F172A, hover #FAB528, rounded full, padding 10px 24px
 * - Accessible: touch targets >= 44px on mobile viewports
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyle =
      "inline-flex items-center justify-center font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-0 text-center";

    // Size mappings (ensuring touch targets >= 44px on mobile)
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "text-[11px] px-3 py-2 min-h-[36px] sm:min-h-[36px] gap-1.5",
      md: "text-[12px] px-4 py-2.5 min-h-[44px] gap-2 tracking-wide uppercase",
      lg: "text-[14px] px-6 py-3 min-h-[48px] gap-2.5 tracking-wide uppercase",
    };

    // Variant mappings
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[#FAB528] text-black rounded-[6px] hover:bg-[#E5A420] hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow",
      pill:
        "bg-white text-[#0F172A] rounded-full border border-[#E2E8F0] hover:bg-[#FAB528] hover:border-[#FAB528] hover:text-black shadow-sm",
      secondary:
        "bg-[#0F172A] text-white rounded-[6px] hover:bg-[#1E293B] hover:-translate-y-0.5 active:translate-y-0 shadow-sm",
      outline:
        "bg-white text-[#1E293B] border border-[#E2E8F0] rounded-[6px] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:bg-[#F1F5F9]",
      ghost:
        "bg-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-[6px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
