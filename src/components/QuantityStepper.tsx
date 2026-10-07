"use client";

import React from "react";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  unitLabel?: string;
}

/**
 * Farmart Quantity Stepper Component
 * Strictly mapped from DESIGN.md:
 * - stepper-control: surface-card, border 1px solid hairline, rounded 4px
 * - Tabular numerals (tabular-nums) to prevent jitter
 * - Mobile touch-target accessibility >= 44px
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  size = "md",
  className = "",
  unitLabel,
}: QuantityStepperProps) {
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  const sizeClasses = {
    sm: {
      container: "h-9",
      btn: "w-8 h-9 min-h-[36px] text-sm",
      input: "w-10 text-xs",
    },
    md: {
      container: "h-11 min-h-[44px]",
      btn: "w-11 h-11 min-w-[44px] min-h-[44px] text-base",
      input: "w-12 text-sm",
    },
    lg: {
      container: "h-12 min-h-[48px]",
      btn: "w-12 h-12 min-w-[48px] min-h-[48px] text-lg",
      input: "w-14 text-base",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`inline-flex items-center bg-white border border-[#E2E8F0] rounded-[6px] overflow-hidden shadow-xs select-none ${currentSize.container} ${className}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={handleDecrement}
        disabled={value <= min}
        className={`flex items-center justify-center bg-[#F8FAFC] text-[#1E293B] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer ${currentSize.btn}`}
      >
        <span className="font-bold leading-none">−</span>
      </button>

      <div className="flex items-center justify-center px-1">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label="Item quantity"
          value={value}
          onChange={handleDirectInput}
          className={`text-center font-bold text-[#0F172A] bg-transparent outline-hidden font-mono tabular-nums ${currentSize.input}`}
        />
        {unitLabel && (
          <span className="text-[11px] text-[#64748B] font-medium mr-1">{unitLabel}</span>
        )}
      </div>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={handleIncrement}
        disabled={value >= max}
        className={`flex items-center justify-center bg-[#F8FAFC] text-[#1E293B] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer ${currentSize.btn}`}
      >
        <span className="font-bold leading-none">+</span>
      </button>
    </div>
  );
}
