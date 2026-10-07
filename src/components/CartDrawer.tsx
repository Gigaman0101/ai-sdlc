"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { QuantityStepper } from "./QuantityStepper";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  imageSvg?: React.ReactNode;
  imageUrl?: string;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string | number, qty: number) => void;
  onRemoveItem: (id: string | number) => void;
  freeShippingThreshold?: number;
}

/**
 * Farmart Slide-Out Cart Drawer Component
 * Follows PLAN.md (Phase 3) & DESIGN.md:
 * - Slide-out drawer with backdrop blur
 * - Realtime quantity update (+ / -)
 * - Free shipping progress bar
 * - Clear subtotal and conversion CTA
 */
export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  freeShippingThreshold = 50,
}: CartDrawerProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const diffToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart Drawer"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2B5F3F" strokeWidth="2.2">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-[#0F172A]">
                Your Cart ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#FFF8EB] px-5 py-3 border-b border-[#FEE8B7]">
            {diffToFreeShipping > 0 ? (
              <div className="text-xs text-[#1E293B]">
                Add <b className="text-[#F25C05]">${diffToFreeShipping.toFixed(2)}</b> more to qualify for{" "}
                <b className="text-[#2B5F3F]">FREE Express Delivery!</b>
              </div>
            ) : (
              <div className="text-xs font-bold text-[#2B5F3F] flex items-center gap-1.5">
                <span>🎉</span> You unlocked FREE Express Delivery!
              </div>
            )}
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#FAB528] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#64748B]">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" className="mb-3">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <p className="font-bold text-[#0F172A] text-base mb-1">Your cart is currently empty</p>
                <p className="text-xs text-[#64748B] mb-4">Discover our farm-fresh produce and artisanal groceries.</p>
                <Button variant="primary" size="sm" onClick={onClose}>
                  Start Shopping
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] relative"
                >
                  <div className="w-16 h-16 bg-white border border-[#E2E8F0] rounded-[6px] flex items-center justify-center shrink-0 p-1">
                    {item.imageSvg ? (
                      <div className="scale-75">{item.imageSvg}</div>
                    ) : item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="w-8 h-8 bg-slate-200 rounded" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                      {item.name}
                    </h4>
                    {item.unit && (
                      <div className="text-[11px] text-[#64748B]">{item.unit}</div>
                    )}
                    <div className="mt-1 font-mono font-bold text-xs text-[#0F172A]">
                      ${item.price.toFixed(2)}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(qty) => onUpdateQty(item.id, qty)}
                        size="sm"
                        min={1}
                        max={99}
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-xs text-[#DC2626] hover:underline cursor-pointer ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E2E8F0] bg-[#FFFFFF] space-y-3">
              <div className="space-y-1.5 text-xs text-[#64748B]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-[#0F172A]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="font-semibold text-[#047857]">
                    {diffToFreeShipping === 0 ? "FREE" : "$4.99"}
                  </span>
                </div>
                <div className="border-t border-[#E2E8F0] pt-2 flex justify-between text-sm font-bold text-[#0F172A]">
                  <span>Total:</span>
                  <span className="font-mono text-base text-[#0F172A]">
                    ${(subtotal + (diffToFreeShipping === 0 ? 0 : 4.99)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Button variant="primary" size="md" fullWidth onClick={() => alert("Proceeding to Checkout!")}>
                  Proceed to Checkout
                </Button>
                <Link href="/" className="block text-center text-xs text-[#64748B] hover:text-[#0F172A] py-1">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
