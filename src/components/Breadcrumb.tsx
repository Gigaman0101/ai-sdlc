"use client";

import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Farmart Breadcrumb Component
 * Follows DESIGN.md:
 * - Semantic nav + ol
 * - Text: body-sm (13px), muted (#64748B) -> ink (#0F172A) hover
 * - Touch-friendly hit areas
 */
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-3 text-xs sm:text-[13px] text-[#64748B] flex items-center overflow-x-auto whitespace-nowrap scrollbar-none ${className}`}
    >
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <svg
                  className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}

              {isLast || !item.href ? (
                <span
                  className="font-semibold text-[#0F172A] truncate max-w-[200px] sm:max-w-[320px]"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#0F172A] hover:underline transition-colors py-1"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
