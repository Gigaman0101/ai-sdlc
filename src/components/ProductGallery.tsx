"use client";

import React, { useState } from "react";
import { Badge } from "./Badge";
import { Dialog } from "./Dialog";

export interface GalleryImage {
  id: string;
  label: string;
  svgNode: React.ReactNode;
  highResSvg?: React.ReactNode;
  imageUrl?: string;
}

export interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
  isOrganic?: boolean;
  discountPercent?: number;
  className?: string;
}

/**
 * Farmart Product Gallery Component
 * Follows DESIGN.md:
 * - Surface card with hairline border
 * - Zoom Dialog modal integration (dialog-modal)
 * - Badges overlay: badge-discount & badge-organic
 * - Mobile touch targets >= 44px for thumbnails
 */
export function ProductGallery({
  images,
  productName,
  isOrganic,
  discountPercent,
  className = "",
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  const activeImage = images[selectedIndex] || images[0];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Main Showcase Viewport */}
      <div className="relative group bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-6 flex items-center justify-center min-h-[360px] sm:min-h-[420px] overflow-hidden">
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {discountPercent && discountPercent > 0 && (
            <Badge variant="discount">-{discountPercent}% OFF</Badge>
          )}
          {isOrganic && (
            <Badge variant="organic">100% ORGANIC CERTIFIED</Badge>
          )}
        </div>

        {/* Zoom Action Button */}
        <button
          type="button"
          aria-label="Zoom image"
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1E293B] hover:text-[#FAB528] shadow-md border border-[#E2E8F0] flex items-center justify-center transition-all opacity-90 group-hover:opacity-100 cursor-pointer z-10"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </button>

        {/* Current Image / SVG Preview */}
        <div
          onClick={() => setIsZoomOpen(true)}
          className="w-full h-full flex items-center justify-center cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
        >
          {activeImage?.svgNode}
        </div>

        {/* Current View Label */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur-xs border border-[#E2E8F0] rounded-full text-[11px] font-mono font-semibold text-[#64748B]">
          {activeImage?.label || "Main View"}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => {
            const isCurrent = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View ${img.label}`}
                className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 min-w-[64px] min-h-[64px] p-2 rounded-[8px] bg-white border-2 transition-all cursor-pointer overflow-hidden shrink-0 ${
                  isCurrent
                    ? "border-[#FAB528] shadow-sm ring-2 ring-[#FAB528]/20"
                    : "border-[#E2E8F0] hover:border-[#94A3B8] opacity-75 hover:opacity-100"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center pointer-events-none scale-75">
                  {img.svgNode}
                </div>
                <span className="absolute bottom-0.5 inset-x-0 text-center text-[9px] font-medium text-[#64748B] bg-white/95 truncate px-1">
                  {img.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox / Zoom Dialog Modal */}
      <Dialog
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        size="lg"
        title={productName}
        description={activeImage?.label ? `Detailed high-resolution view: ${activeImage.label}` : undefined}
      >
        <div className="w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]">
          <div className="max-w-md w-full flex items-center justify-center scale-125 my-8">
            {activeImage?.highResSvg || activeImage?.svgNode}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold cursor-pointer transition-colors ${
                  idx === selectedIndex
                    ? "bg-[#FAB528] text-black"
                    : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
                }`}
              >
                {img.label}
              </button>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
