"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProductById, PRODUCTS, ProductDetail, ReviewItem } from "@/data/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { QuantityStepper } from "@/components/QuantityStepper";
import { StarRating } from "@/components/StarRating";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Tabs } from "@/components/Tabs";
import { Dialog } from "@/components/Dialog";
import { CartDrawer, CartItem } from "@/components/CartDrawer";

export default function ProductDetailPage() {
  const routeParams = useParams();
  const productId = (routeParams?.id as string) || "1";
  const product: ProductDetail = getProductById(productId) || PRODUCTS[0];

  // Cart & Wishlist State
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "demo-item",
      name: "Ice-block Box Sealed x 24 Pieces",
      price: 45.0,
      quantity: 1,
      unit: "24 pcs box",
    },
  ]);

  // Toast feedback
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // Review submission dialog state
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState<boolean>(false);
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewTitle, setNewReviewTitle] = useState<string>("");
  const [newReviewComment, setNewReviewComment] = useState<string>("");
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>("");
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(product.reviews);

  // Bundle selection for "Frequently Bought Together"
  const [bundleChecked, setBundleChecked] = useState<{ [key: string]: boolean }>({
    main: true,
    rel1: true,
    rel2: true,
  });

  // Calculate Cart Totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Add current product to cart
  const handleAddToCart = () => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          unit: product.unit,
          imageSvg: product.gallery[0]?.svgNode,
        },
      ];
    });
    showToast(`Added ${quantity}x "${product.name}" to your cart!`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id: string | number, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (id: string | number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Removed item from your cart.");
  };

  const handleToggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    showToast(next ? "Added to your wishlist!" : "Removed from your wishlist.");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim() || "Farmart Customer",
      rating: newReviewRating,
      date: "Just now",
      title: newReviewTitle.trim(),
      comment: newReviewComment.trim(),
      verified: true,
      helpfulCount: 0,
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsReviewDialogOpen(false);
    setNewReviewTitle("");
    setNewReviewComment("");
    setNewReviewAuthor("");
    showToast("Thank you! Your verified review was published.");
  };

  // Related products
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  const bundleItems = PRODUCTS.filter((p) => product.relatedIds.includes(p.id)).slice(0, 2);

  // Bundle price calculation
  const bundleItemsList = [
    { id: "main", product: product },
    ...bundleItems.map((p, idx) => ({ id: `rel${idx + 1}`, product: p })),
  ];
  const bundleTotalPrice = bundleItemsList
    .filter((b) => bundleChecked[b.id])
    .reduce((sum, b) => sum + b.product.price, 0);

  const handleAddBundleToCart = () => {
    bundleItemsList.forEach((b) => {
      if (bundleChecked[b.id]) {
        setCartItems((prev) => {
          const ex = prev.find((item) => item.id === b.product.id);
          if (ex) {
            return prev.map((item) =>
              item.id === b.product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [
            ...prev,
            {
              id: b.product.id,
              name: b.product.name,
              price: b.product.price,
              quantity: 1,
              unit: b.product.unit,
              imageSvg: b.product.gallery[0]?.svgNode,
            },
          ];
        });
      }
    });
    showToast("Added complete combo bundle to your cart!");
    setIsCartOpen(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      {/* 1. HEADER */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={isWishlisted ? 1 : 0}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. BREADCRUMBS */}
      <div className="w-full bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto max-w-[1240px] px-4 sm:px-6">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: product.category, href: "/" },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* 3. MAIN PRODUCT SHOWCASE CONTAINER */}
      <main className="container mx-auto max-w-[1240px] px-4 sm:px-6 py-6 sm:py-8 flex-1">
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-4 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT COLUMN: Gallery & Certifications (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <ProductGallery
                images={product.gallery}
                productName={product.name}
                isOrganic={product.isOrganic}
                discountPercent={product.discountPercent}
              />

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xl">🌱</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#0F172A]">Certified Organic</div>
                    <div className="text-[10px] text-[#64748B]">Non-GMO & zero wax</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-xl">❄️</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#0F172A]">Chilled Cold-Chain</div>
                    <div className="text-[10px] text-[#64748B]">Strict temperature control</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Details & Purchase Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand & Stock Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2B5F3F] bg-[#ECFDF5] px-2.5 py-0.5 rounded-[4px] border border-[#A7F3D0]">
                      {product.brand}
                    </span>
                    <span className="text-xs text-[#94A3B8] font-mono">SKU: {product.sku}</span>
                  </div>

                  {/* Stock pip */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#047857]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span>In Stock ({product.stockCount} available)</span>
                  </div>
                </div>

                {/* Product Title */}
                <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating & Review Counter Anchor */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#F1F5F9] mb-4">
                  <StarRating
                    rating={product.rating}
                    reviewCount={reviewsList.length}
                    showScore
                    size="md"
                    onReviewClick={() => {
                      const tabElement = document.getElementById("tab-reviews");
                      tabElement?.scrollIntoView({ behavior: "smooth" });
                      tabElement?.click();
                    }}
                  />
                  <span className="text-xs text-[#CBD5E1]">|</span>
                  <span className="text-xs text-[#047857] font-semibold flex items-center gap-1">
                    <span>✓</span> 100% Verified Purchases
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 flex-wrap bg-[#FFF8EB] border border-[#FEE8B7] rounded-[10px] p-4 mb-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-mono tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-base text-[#94A3B8] line-through font-mono tabular-nums">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {product.discountPercent && (
                    <Badge variant="discount">SAVE {product.discountPercent}% OFF</Badge>
                  )}

                  <span className="text-xs text-[#64748B] font-medium ml-auto">
                    Packaging: <b className="text-[#0F172A]">{product.unit}</b>
                  </span>
                </div>

                {/* Short Description */}
                <p className="text-sm text-[#475569] leading-relaxed mb-5">
                  {product.shortDescription}
                </p>

                {/* Highlights List */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-4 mb-6">
                  <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-extrabold uppercase tracking-wider text-[#0F172A] mb-2.5">
                    Fresh Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#334155]">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#10B981] font-bold text-sm shrink-0">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Purchase Zone: Stepper + Dynamic Subtotal + CTA Buttons */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#0F172A]">Quantity:</span>
                    <QuantityStepper
                      value={quantity}
                      onChange={setQuantity}
                      min={1}
                      max={product.stockCount}
                      size="md"
                    />
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#64748B] mr-2">Subtotal:</span>
                    <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                      ${(quantity * product.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    leftIcon={
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                      </svg>
                    }
                  >
                    Add To Cart • ${(quantity * product.price).toFixed(2)}
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto shrink-0 px-8"
                    onClick={() => {
                      handleAddToCart();
                    }}
                  >
                    Buy Now
                  </Button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className={`w-12 h-12 rounded-[6px] border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isWishlisted
                        ? "bg-[#FEE2E2] border-[#FCA5A5] text-[#EF4444]"
                        : "bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#EF4444] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={isWishlisted ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>

                {/* Fulfillment Guarantee Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#FBF7ED] border border-[#F6E8C3] rounded-[8px] text-xs text-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🚚</span>
                    <div>
                      <div className="font-bold">Home Delivery</div>
                      <div className="text-[11px] text-[#64748B]">Today in 2 Hours</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base">🏪</span>
                    <div>
                      <div className="font-bold">Store Pickup</div>
                      <div className="text-[11px] text-[#64748B]">Ready in 30 mins</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base">🛡️</span>
                    <div>
                      <div className="font-bold">100% Fresh</div>
                      <div className="text-[11px] text-[#64748B]">Or Money Back</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FREQUENTLY BOUGHT TOGETHER BUNDLE */}
        {bundleItems.length > 0 && (
          <section className="mt-8 bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-xs">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-[#0F172A] mb-4">
              Frequently Bought Together
            </h3>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Items in bundle */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {bundleItemsList.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <span className="text-lg font-bold text-[#94A3B8]">+</span>}
                    <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                      <input
                        type="checkbox"
                        id={`bundle-${item.id}`}
                        checked={bundleChecked[item.id]}
                        onChange={(e) =>
                          setBundleChecked({ ...bundleChecked, [item.id]: e.target.checked })
                        }
                        className="w-4 h-4 accent-[#FAB528] rounded cursor-pointer"
                      />
                      <div className="w-14 h-14 bg-white border border-[#E2E8F0] rounded-[6px] flex items-center justify-center p-1">
                        <div className="scale-60">{item.product.gallery[0]?.svgNode}</div>
                      </div>
                      <div className="max-w-[140px]">
                        <label
                          htmlFor={`bundle-${item.id}`}
                          className="text-xs font-bold text-[#0F172A] line-clamp-1 cursor-pointer"
                        >
                          {item.product.name}
                        </label>
                        <div className="font-mono font-extrabold text-xs text-[#0F172A]">
                          ${item.product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Bundle Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#FFF8EB] border border-[#FEE8B7] p-4 rounded-[10px] w-full lg:w-auto">
                <div>
                  <div className="text-xs text-[#64748B]">Total Bundle Price:</div>
                  <div className="font-mono text-2xl font-extrabold text-[#0F172A]">
                    ${bundleTotalPrice.toFixed(2)}
                  </div>
                </div>
                <Button variant="primary" size="md" onClick={handleAddBundleToCart}>
                  Add Selected To Cart
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* 5. IN-DEPTH TABS (Description, Nutrition, Farm Origin, Customer Reviews) */}
        <section className="mt-8 bg-white border border-[#E2E8F0] rounded-[14px] p-4 sm:p-8 shadow-xs">
          <Tabs
            defaultTab="description"
            tabs={[
              {
                id: "description",
                label: "Description & Farm Story",
                content: (
                  <div className="space-y-6 text-sm text-[#334155] leading-relaxed">
                    <div>
                      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#0F172A] mb-3">
                        About {product.name}
                      </h3>
                      {product.fullDescription.map((paragraph, idx) => (
                        <p key={idx} className="mb-3">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#F1F5F9]">
                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                        <div className="text-xl mb-1">🌱</div>
                        <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-1">
                          Regenerative Farming
                        </h4>
                        <p className="text-xs text-[#64748B]">
                          Enriching topsoil and local ecosystems through companion planting and zero chemical pesticides.
                        </p>
                      </div>

                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                        <div className="text-xl mb-1">📦</div>
                        <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-1">
                          Eco Packaging
                        </h4>
                        <p className="text-xs text-[#64748B]">
                          100% recyclable, biodegradable packaging that cushions each piece safely during express transit.
                        </p>
                      </div>

                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                        <div className="text-xl mb-1">⚡</div>
                        <h4 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider mb-1">
                          Optimal Ripeness
                        </h4>
                        <p className="text-xs text-[#64748B]">
                          Laser checked for uniform firmness and density to ensure perfect ready-to-eat condition.
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: "nutrition",
                label: "Nutritional Facts & Ingredients",
                content: (
                  <div className="max-w-2xl">
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#0F172A] mb-3">
                      Nutritional Value & Composition
                    </h3>
                    <p className="text-xs text-[#64748B] mb-4">
                      *Percent Daily Values (%DV) are based on a 2,000 calorie diet.
                    </p>

                    <div className="border border-[#0F172A] rounded-[8px] overflow-hidden bg-white">
                      <div className="bg-[#0F172A] text-white p-3">
                        <div className="text-xl font-extrabold font-['Plus_Jakarta_Sans',sans-serif]">
                          Nutrition Facts
                        </div>
                        <div className="text-xs opacity-80">Serving Size: {product.nutritionFacts[0]?.amount}</div>
                      </div>

                      <div className="divide-y divide-[#E2E8F0]">
                        {product.nutritionFacts.slice(1).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 text-xs text-[#1E293B] hover:bg-[#F8FAFC]"
                          >
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center gap-4">
                              <span className="font-mono font-bold text-[#0F172A]">{item.amount}</span>
                              {item.dailyValue && (
                                <span className="font-mono text-[#64748B] w-10 text-right">
                                  {item.dailyValue}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 p-3.5 bg-[#FFF8EB] border border-[#FEE8B7] rounded-[8px] text-xs text-[#1E293B]">
                      <b className="text-[#0F172A]">Allergen Statement:</b> Packaged in a certified facility that strictly handles only fresh fruits, vegetables, and botanical produce. Naturally gluten-free, dairy-free, and vegan.
                    </div>
                  </div>
                ),
              },
              {
                id: "origin",
                label: "Storage & Farm Origin",
                content: (
                  <div className="space-y-6">
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#0F172A] mb-3">
                      Farm Provenance & Freshness Guide
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                          Cultivation Source
                        </h4>
                        <div className="text-base font-extrabold text-[#0F172A]">
                          {product.originInfo.farmName}
                        </div>
                        <div className="text-xs text-[#475569] mt-1 flex items-center gap-1">
                          <span>📍</span> {product.originInfo.location}
                        </div>
                      </div>

                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                          Harvest Timestamp
                        </h4>
                        <div className="text-base font-extrabold text-[#047857]">
                          {product.originInfo.harvestDate}
                        </div>
                        <div className="text-xs text-[#475569] mt-1 flex items-center gap-1">
                          <span>🚚</span> Express chilled transport to warehouse
                        </div>
                      </div>

                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                          Storage Instructions
                        </h4>
                        <div className="text-sm font-bold text-[#0F172A]">
                          {product.originInfo.storageTemp}
                        </div>
                        <div className="text-xs text-[#64748B] mt-1">
                          Keep in a cool, ventilated pantry away from direct sunlight until ripe, then refrigerate.
                        </div>
                      </div>

                      <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                          Estimated Shelf Life
                        </h4>
                        <div className="text-sm font-bold text-[#0F172A]">
                          {product.originInfo.shelfLife}
                        </div>
                        <div className="text-xs text-[#64748B] mt-1">
                          Guaranteed freshness window under proper household storage.
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: "reviews",
                label: `Customer Reviews (${reviewsList.length})`,
                badge: reviewsList.length,
                content: (
                  <div className="space-y-6">
                    {/* Overview & Breakdown */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-mono text-4xl font-extrabold text-[#0F172A]">
                            {product.rating.toFixed(1)}
                          </div>
                          <div className="text-xs text-[#64748B]">out of 5.0</div>
                        </div>
                        <div>
                          <StarRating rating={product.rating} size="lg" />
                          <div className="text-xs text-[#64748B] mt-1">
                            Based on {reviewsList.length} verified customer reviews
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => setIsReviewDialogOpen(true)}
                      >
                        Write a Customer Review
                      </Button>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4">
                      {reviewsList.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-5 bg-white border border-[#E2E8F0] rounded-[10px] space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <StarRating rating={rev.rating} size="sm" />
                              <h4 className="text-sm font-bold text-[#0F172A]">{rev.title}</h4>
                            </div>
                            <span className="text-xs text-[#94A3B8]">{rev.date}</span>
                          </div>

                          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                            {rev.comment}
                          </p>

                          <div className="flex items-center justify-between pt-2 text-xs text-[#64748B]">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0F172A]">{rev.author}</span>
                              {rev.verified && (
                                <span className="bg-[#ECFDF5] text-[#047857] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#A7F3D0] flex items-center gap-1">
                                  <span>✓</span> Verified Purchase
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                showToast("Thank you for your feedback!");
                              }}
                              className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer"
                            >
                              <span>👍</span> Helpful ({rev.helpfulCount})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </section>

        {/* 6. RELATED PRODUCTS SHELF */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-[#0F172A]">
                Related Grocery Items
              </h2>
              <p className="text-xs text-[#64748B]">Customers who bought this also love these farm-fresh selections</p>
            </div>
            <Link href="/" className="text-xs font-bold text-[#0F172A] hover:text-[#FAB528] flex items-center gap-1">
              View All &gt;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={{
                  id: rel.id,
                  name: rel.name,
                  brand: rel.brand,
                  category: rel.category,
                  price: rel.price,
                  oldPrice: rel.oldPrice,
                  discountPercent: rel.discountPercent,
                  isOrganic: rel.isOrganic,
                  rating: rel.rating,
                  reviewCount: rel.reviewCount,
                  imageSvg: rel.gallery[0]?.svgNode,
                }}
                onAddToCart={(p) => {
                  setCartItems((prev) => [
                    ...prev,
                    {
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      quantity: 1,
                      imageSvg: p.imageSvg,
                    },
                  ]);
                  showToast(`Added "${p.name}" to cart!`);
                  setIsCartOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      </main>

      {/* 7. WRITE A REVIEW DIALOG (dialog-modal) */}
      <Dialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        size="md"
        title="Write a Customer Review"
        description={`Share your experience with "${product.name}" to help fellow market shoppers.`}
      >
        <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Your Overall Rating
            </label>
            <StarRating
              rating={newReviewRating}
              interactive
              onRatingChange={setNewReviewRating}
              size="lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={newReviewAuthor}
              onChange={(e) => setNewReviewAuthor(e.target.value)}
              placeholder="e.g. Somchai S."
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] text-xs text-[#0F172A] outline-hidden focus:border-[#FAB528]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Review Headline
            </label>
            <input
              type="text"
              required
              value={newReviewTitle}
              onChange={(e) => setNewReviewTitle(e.target.value)}
              placeholder="e.g. Excellent ripeness and flavor!"
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] text-xs text-[#0F172A] outline-hidden focus:border-[#FAB528]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Detailed Feedback
            </label>
            <textarea
              required
              rows={4}
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              placeholder="Tell others how you enjoyed the produce, packaging condition, or recipe ideas..."
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] text-xs text-[#0F172A] outline-hidden focus:border-[#FAB528]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Review
            </Button>
          </div>
        </form>
      </Dialog>

      {/* 8. SLIDE-OUT CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
      />

      {/* 9. MOBILE FLOATING PURCHASE BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E2E8F0] p-3 shadow-lg z-30 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-[#64748B]">Total Price:</div>
          <div className="font-mono text-lg font-extrabold text-[#0F172A]">
            ${(quantity * product.price).toFixed(2)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={product.stockCount}
            size="sm"
          />
          <Button variant="primary" size="md" onClick={handleAddToCart}>
            Add To Cart
          </Button>
        </div>
      </div>

      {/* 10. TOAST FEEDBACK NOTIFICATION */}
      <div
        className={`fixed bottom-16 sm:bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0F172A] text-white px-4 py-3 rounded-[8px] shadow-xl text-xs font-semibold transition-all duration-300 ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center text-[10px] text-white font-bold">
          ✓
        </span>
        <span>{toast.message}</span>
      </div>

      {/* 11. FOOTER */}
      <Footer />
    </div>
  );
}
