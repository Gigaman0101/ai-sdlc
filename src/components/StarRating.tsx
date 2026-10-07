"use client";

import React from "react";

export interface StarRatingProps {
  rating: number; // e.g. 4.8
  maxStars?: number;
  reviewCount?: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
  onReviewClick?: () => void;
}

export function StarRating({
  rating,
  maxStars = 5,
  reviewCount,
  showScore = false,
  size = "md",
  interactive = false,
  onRatingChange,
  className = "",
  onReviewClick,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5 text-xs",
    md: "w-4 h-4 text-sm",
    lg: "w-5 h-5 text-base",
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        role={interactive ? "radiogroup" : "img"}
        aria-label={`Rating: ${rating} out of ${maxStars} stars`}
      >
        {Array.from({ length: maxStars }).map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= Math.round(displayRating);
          const isHalf =
            !isFilled &&
            starNumber - 0.5 <= displayRating &&
            displayRating < starNumber;

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              aria-label={interactive ? `${starNumber} star` : undefined}
              onClick={() => interactive && onRatingChange?.(starNumber)}
              onMouseEnter={() => interactive && setHoverRating(starNumber)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${starSizes[size]} transition-transform ${
                interactive
                  ? "cursor-pointer hover:scale-110 active:scale-95 focus:outline-hidden"
                  : "cursor-default"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full"
                fill={isFilled ? "#FAB528" : isHalf ? "url(#half-star)" : "none"}
                stroke={isFilled || isHalf ? "#FAB528" : "#CBD5E1"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="half-star">
                    <stop offset="50%" stopColor="#FAB528" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="font-bold text-[#0F172A] text-xs sm:text-sm font-mono tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <button
          type="button"
          onClick={onReviewClick}
          className={`text-xs text-[#64748B] hover:text-[#0284C7] font-medium transition-colors ${
            onReviewClick ? "cursor-pointer underline decoration-dotted" : "cursor-default"
          }`}
        >
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </button>
      )}
    </div>
  );
}
