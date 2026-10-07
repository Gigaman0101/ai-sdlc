"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface HeaderProps {
  cartCount?: number;
  cartTotal?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
}

export function Header({
  cartCount = 0,
  cartTotal = 0,
  wishlistCount = 0,
  onOpenCart,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-[#F1F5F9] sticky top-0 z-40">
      {/* 1. TOP BAR */}
      <div className="border-b border-[#F1F5F9] py-3.5">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo Area */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-[38px] h-[38px] bg-[#2B5F3F] rounded-[8px] flex items-center justify-center text-white shadow-xs group-hover:bg-[#10B981] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[22px] font-extrabold text-[#0F172A] tracking-[-0.5px] leading-none">
                Farmart
              </span>
              <span className="text-[10px] font-bold text-[#FAB528] tracking-[1.5px] uppercase">
                GROCERY
              </span>
            </div>
          </Link>

          {/* Center Search Input */}
          <div className="hidden md:flex flex-1 max-w-[580px] items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] overflow-hidden focus-within:border-[#FAB528] focus-within:ring-2 focus-within:ring-[#FAB528]/20 transition-all">
            <div className="border-r border-[#E2E8F0] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B]">
              <select className="bg-transparent outline-hidden cursor-pointer" defaultValue="All">
                <option value="All">ALL CATEGORIES</option>
                <option value="fruits">Fresh Fruits & Veggies</option>
                <option value="meats">Raw Meats & Seafood</option>
                <option value="bakery">Breads & Bakery</option>
                <option value="dairy">Dairy & Milks</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="I'm searching for fresh organic produce..."
              className="flex-1 px-4 py-2.5 text-xs text-[#0F172A] bg-transparent outline-hidden placeholder:text-[#94A3B8]"
            />
            <button
              type="button"
              aria-label="Search"
              className="px-4 py-2.5 bg-[#FAB528] text-black hover:bg-[#E5A420] transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>

          {/* Right Action Icons & Hotline */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[13px] font-extrabold text-[#0F172A] font-mono">
                8 800 332 65-66
              </span>
              <span className="text-[10px] text-[#64748B] font-medium">Support 24/7</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Wishlist */}
              <Link
                href="/"
                className="relative w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#1E293B] hover:text-[#EF4444] hover:border-[#FCA5A5] transition-colors"
                aria-label="Wishlist"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FAB528] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={onOpenCart}
                className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-[8px] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors cursor-pointer"
                aria-label="View Shopping Cart"
              >
                <div className="relative flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2B5F3F" strokeWidth="2.2">
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FAB528] text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] text-[#64748B] font-semibold leading-none">Your Cart</span>
                  <span className="text-xs font-extrabold text-[#0F172A] font-mono leading-tight">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-[6px] border border-[#E2E8F0] text-[#1E293B]"
                aria-label="Toggle navigation"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION BAR */}
      <div className={`border-b border-[#E2E8F0] bg-white ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2 py-1">
          <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto py-1 scrollbar-none text-xs font-bold text-[#1E293B]">
            <Link href="/" className="text-[#2B5F3F] hover:text-[#10B981] flex items-center gap-1 shrink-0 py-2">
              <span>🌾</span> All Departments
            </Link>
            <Link href="/products/1" className="hover:text-[#F25C05] flex items-center gap-1 shrink-0 py-2">
              <span>🔥</span> Fresh Deals
            </Link>
            <Link href="/products/2" className="hover:text-[#2B5F3F] flex items-center gap-1 shrink-0 py-2">
              <span>🌱</span> 100% Organic
            </Link>
            <Link href="/design" className="text-[#64748B] hover:text-[#0F172A] shrink-0 py-2">
              🎨 Design System
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-[#64748B]">
            <span>🚚 Free 2-Hour Delivery on $50+</span>
            <span className="text-[#E2E8F0]">|</span>
            <span className="text-[#10B981] font-semibold">● Farm-Direct Fresh Guarantee</span>
          </div>
        </div>
      </div>
    </header>
  );
}
