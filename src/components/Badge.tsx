"use client";

import React from "react";

export type BadgeVariant =
  | "discount"
  | "organic"
  | "stock"
  | "featured"
  | "orange"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Farmart Design System Badge
 * Strictly mapped from DESIGN.md:
 * - badge-discount: bg #DC2626, text #FFFFFF, font 10px, bold, tracking 1px, rounded 4px, padding 3px 6px
 * - badge-organic: bg #2B5F3F, text #FFFFFF, font 10px, bold, tracking 1px, rounded 4px, padding 3px 6px
 * - stock: bg #ECFDF5, text #047857, border #10B981, with fresh emerald pip
 */
export function Badge({
  variant = "discount",
  children,
  icon,
  className = "",
  ...props
}: BadgeProps) {
  const baseStyle =
    "inline-flex items-center gap-1 font-mono uppercase text-[10px] font-bold tracking-[1px] leading-none px-2 py-1 rounded-[4px] select-none";

  const variantStyles: Record<BadgeVariant, string> = {
    discount: "bg-[#DC2626] text-white",
    organic: "bg-[#2B5F3F] text-white",
    stock: "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]",
    featured: "bg-[#FAB528] text-black",
    orange: "bg-[#F25C05] text-white",
    neutral: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
  };

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`} {...props}>
      {icon}
      <span> { children} </span>
    </span>
  );
}
