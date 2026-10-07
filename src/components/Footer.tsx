"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#0F172A] text-white pt-12 pb-8 mt-16 border-t border-[#1E293B]">
      <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Top 4 Value props */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-xl shrink-0 text-[#FAB528]">
              🚚
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Free Express Delivery</h4>
              <p className="text-xs text-[#94A3B8]">Orders over $50 delivered in 2h</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-xl shrink-0 text-[#10B981]">
              🌱
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">100% Organic & Fresh</h4>
              <p className="text-xs text-[#94A3B8]">Direct from certified partner farms</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-xl shrink-0 text-[#FAB528]">
              🛡️
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Satisfaction Guaranteed</h4>
              <p className="text-xs text-[#94A3B8]">Instant refund if not 100% fresh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1E293B] flex items-center justify-center text-xl shrink-0 text-[#0284C7]">
              📞
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-[#94A3B8]">Hotline: 8 800 332 65-66</p>
            </div>
          </div>
        </div>

        {/* Links & Brand columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#2B5F3F] rounded-[6px] flex items-center justify-center text-white font-bold">
                🌾
              </div>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold tracking-tight text-white">
                Farmart
              </span>
              <span className="text-[9px] font-bold text-[#FAB528] tracking-widest uppercase">
                MARKET
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              Farmart brings artisan groceries and fresh, pesticide-free harvest straight from local regenerative farms directly to your doorstep.
            </p>
            <div className="text-xs text-[#94A3B8]">
              <p>📍 128 Organic Valley Way, Chiang Mai, Thailand</p>
              <p className="mt-1">✉ hello@farmart-market.com</p>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-3">Categories</h5>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li><Link href="/products/1" className="hover:text-white transition-colors">Fruits & Vegetables</Link></li>
              <li><Link href="/products/3" className="hover:text-white transition-colors">Raw Meats & Seafood</Link></li>
              <li><Link href="/products/4" className="hover:text-white transition-colors">Breads & Sweets</Link></li>
              <li><Link href="/products/2" className="hover:text-white transition-colors">Cold-Pressed Juices</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-3">Customer Care</h5>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delivery Schedule</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-white mb-3">Membership</h5>
            <p className="text-xs text-[#94A3B8] mb-3">Sign up now for 15% off your first online order!</p>
            <div className="inline-block px-3 py-1.5 bg-[#1E293B] border border-[#334155] rounded-sm text-[11px] font-mono font-bold text-[#FAB528]">
              CODE: NEWFARM15
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© 2026 Farmart Grocery Online. Formatted strictly to DESIGN.md specification.</p>
          <div className="flex items-center gap-4">
            <Link href="/design" className="hover:text-white transition-colors">Design System</Link>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
