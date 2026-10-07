"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { StarRating } from "./StarRating";

export interface ProductCardData {
  id: string | number;
  name: string;
  brand?: string;
  category?: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isOrganic?: boolean;
  rating?: number;
  reviewCount?: number;
  imageSvg?: React.ReactNode;
  imageUrl?: string;
  soldText?: string;
  stockProgress?: number; // 0 - 100%
  inStock?: boolean;
}

export interface ProductCardProps {
  product: ProductCardData;
  onAddToCart?: (product: ProductCardData) => void;
  onToggleWishlist?: (id: string | number, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
  className?: string;
  showProgress?: boolean;
}

/**
 * Farmart Product Card Component
 * Strictly mapped from DESIGN.md:
 * - card-product: surface-card (#FFFFFF), border 1px solid hairline (#E2E8F0), rounded-lg (10px), padding 16px
 * - Elevation: Tier 1 at rest, Tier 2 on hover (box-shadow 0 8px 20px -4px rgba(0,0,0,0.08); translateY(-3px))
 * - Badges: badge-discount & badge-organic
 * - Conversion CTA: button-primary
 */
export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className = "",
  showProgress = false,
}: ProductCardProps) {
  const [wishlist, setWishlist] = useState(isWishlisted);
  const [isAdding, setIsAdding] = useState(false);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !wishlist;
    setWishlist(next);
    onToggleWishlist?.(product.id, next);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart?.(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-[10px] p-4 transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.08)] ${className}`}
    >
      {/* Top row: Badges and Wishlist Button */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {product.discountPercent && product.discountPercent > 0 && (
            <Badge variant="discount">-{product.discountPercent}%</Badge>
          )}
          {product.isOrganic && (
            <Badge variant="organic">100% ORGANIC</Badge>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            wishlist
              ? "bg-[#FEE2E2] text-[#EF4444]"
              : "bg-[#F8FAFC] text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2]"
          }`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={wishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Product Image & Link */}
      <Link
        href={`/products/${product.id}`}
        className="block mt-4 mb-3 cursor-pointer outline-hidden group-focus-visible:ring-2 group-focus-visible:ring-[#FAB528]"
      >
        <div className="w-full h-36 sm:h-40 flex items-center justify-center bg-[#F8FAFC] rounded-[8px] p-3 transition-transform group-hover:scale-105 duration-200">
          {product.imageSvg ? (
            product.imageSvg
          ) : product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor"/>
              <polyline points="21 15 16 10 5 21" stroke="currentColor"/>
            </svg>
          )}
        </div>

        {/* Brand & Category */}
        <div className="mt-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider truncate">
          {product.brand || product.category || "Farmart"}
        </div>

        {/* Product Title */}
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[14px] text-[#0F172A] leading-[1.35] line-clamp-2 mt-1 min-h-[38px] group-hover:text-[#F25C05] transition-colors">
          {product.name}
        </h3>
      </Link>

      {/* Ratings */}
      <div className="mb-2">
        <StarRating
          rating={product.rating || 5}
          reviewCount={product.reviewCount || 0}
          size="sm"
        />
      </div>

      {/* Price Block */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-['Inter',sans-serif] font-extrabold text-[16px] text-[#0F172A] tabular-nums">
          ${product.price.toFixed(2)}
        </span>
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="font-['Inter',sans-serif] text-[12px] text-[#94A3B8] line-through tabular-nums">
            ${product.oldPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock Progress Bar (Optional, Top Saver feature) */}
      {showProgress && product.stockProgress !== undefined && (
        <div className="mb-3">
          <div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#10B981] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, product.stockProgress))}%` }}
            />
          </div>
          {product.soldText && (
            <div className="text-[10px] text-[#64748B] mt-1 font-medium">
              {product.soldText}
            </div>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        variant="primary"
        size="sm"
        fullWidth
        onClick={handleAdd}
        isLoading={isAdding}
        leftIcon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        }
      >
        Add To Cart
      </Button>
    </div>
  );
}
