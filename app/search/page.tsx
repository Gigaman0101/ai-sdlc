"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard, ProductCardData } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

interface BrandItem {
  id: string;
  name: string;
  productCount: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query parameters
  const qParam = searchParams.get("q") || "";
  const _qParam = searchParams.get("q") || "";
  const catParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand") || "";
  const isOrganicParam = searchParams.get("isOrganic") === "true";
  const sortParam = searchParams.get("sort") || "featured";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // Search input local state
  const [searchInput, setSearchInput] = useState(qParam);

  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const [cartCount, setCartCount] = useState(3);
  const [cartTotal, setCartTotal] = useState(2450.59);
  const [wishlistCount, setWishlistCount] = useState(0);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  // Fetch categories & brands for sidebar
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error(err));

    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (qParam) params.set("q", qParam);
    if (catParam) params.set("category", catParam);
    if (brandParam) params.set("brand", brandParam);
    if (isOrganicParam) params.set("isOrganic", "true");
    if (sortParam) params.set("sort", sortParam);
    params.set("page", String(pageParam));
    params.set("limit", "12");

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.products) {
            const mapped = data.products.map((p: ProductCardData) => ({
              ...p,
              id: String(p.id),
            }));
            setProducts(mapped);
            setTotal(data.total || 0);
          } else {
            setProducts([]);
            setTotal(0);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error(err);
          setProducts([]);
          setTotal(0);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [qParam, catParam, brandParam, isOrganicParam, sortParam, pageParam]);

  // Update URL helper
  const updateUrl = (newFilters: {
    q?: string;
    category?: string;
    brand?: string;
    isOrganic?: boolean;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    const nextQ = newFilters.q !== undefined ? newFilters.q : searchInput;
    const nextCat = newFilters.category !== undefined ? newFilters.category : catParam;
    const nextBrand = newFilters.brand !== undefined ? newFilters.brand : brandParam;
    const nextOrg = newFilters.isOrganic !== undefined ? newFilters.isOrganic : isOrganicParam;
    const nextSort = newFilters.sort !== undefined ? newFilters.sort : sortParam;
    const nextPage = newFilters.page !== undefined ? newFilters.page : 1;

    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextCat && nextCat !== "All") params.set("category", nextCat);
    if (nextBrand && nextBrand !== "All") params.set("brand", nextBrand);
    if (nextOrg) params.set("isOrganic", "true");
    if (nextSort && nextSort !== "featured") params.set("sort", nextSort);
    if (nextPage > 1) params.set("page", String(nextPage));

    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ q: searchInput, page: 1 });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    router.push("/search");
  };

  const handleAddToCart = (product: ProductCardData) => {
    setCartCount((c) => c + 1);
    setCartTotal((t) => t + product.price);
    showToast(`Added "${product.name}" to cart!`);
  };

  const handleToggleWishlist = (id: string | number, isWishlisted: boolean) => {
    setWishlistCount((c) => (isWishlisted ? c + 1 : Math.max(0, c - 1)));
    showToast(isWishlisted ? "Saved to wishlist!" : "Removed from wishlist");
  };

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-slate-800">
      {/* 1. TOP BAR & HEADER */}
      <header className="header-top">
        <div className="container header-top-inner">
          {/* Logo */}
          <Link href="/" className="logo-area">
            <div className="logo-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-title">Farmart</span>
              <span className="logo-subtitle">GROCERY</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="search-wrapper">
            <form onSubmit={handleSearchSubmit} className="search-bar">
              <div className="category-select">
                <select
                  aria-label="Select Category"
                  value={catParam || "All"}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateUrl({ category: val, page: 1 });
                  }}
                >
                  <option value="All">ALL CATEGORIES</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="I'm searching for fresh organic produce..."
                aria-label="Search products"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

          {/* Actions & Support */}
          <div className="header-actions">
            <div className="support-hotline">
              <span className="hotline-number">8 800 332 65-66</span>
              <span className="hotline-sub">Support 24/7</span>
            </div>

            <div className="user-actions">
              <Link href="/" className="action-icon-btn" aria-label="Home">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </Link>
              <div className="action-icon-btn" aria-label="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
                <span className="badge-count">{wishlistCount}</span>
              </div>
              <div className="cart-summary" onClick={() => showToast("Cart drawer opened")}>
                <div className="action-icon-btn" style={{ width: "auto", height: "auto", padding: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  <span className="badge-count">{cartCount}</span>
                </div>
                <div className="cart-info">
                  <span className="cart-label">Your Cart:</span>
                  <span className="cart-amount">${cartTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BREADCRUMB */}
      <div className="bg-[#F8FAFC] border-b border-[#F1F5F9] py-3">
        <div className="container mx-auto max-w-[1240px] px-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Search Products" },
            ]}
          />
        </div>
      </div>

      {/* 3. MAIN SEARCH CONTENT */}
      <main className="container mx-auto max-w-[1240px] px-4 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[18px] text-[#0F172A]">
                Filters
              </h2>
              {(searchInput || catParam || brandParam || isOrganicParam || sortParam !== "featured") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-[#EF4444] hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] mb-3 uppercase tracking-wider">
                Category
              </h3>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => {
                    updateUrl({ category: "All", page: 1 });
                  }}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-[6px] transition-colors flex items-center justify-between ${
                    !catParam || catParam === "All"
                      ? "bg-[#2B5F3F] text-white font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      updateUrl({ category: c.slug, page: 1 });
                    }}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-[6px] transition-colors flex items-center justify-between ${
                      catParam === c.slug
                        ? "bg-[#2B5F3F] text-white font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-75">({c.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Organic Filter */}
            <div className="border-t border-slate-100 pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#1E293B]">
                <input
                  type="checkbox"
                  checked={isOrganicParam}
                  onChange={(e) => {
                    updateUrl({ isOrganic: e.target.checked, page: 1 });
                  }}
                  className="w-4 h-4 rounded-sm text-[#2B5F3F] focus:ring-[#2B5F3F] cursor-pointer"
                />
                <span>🌿 100% Organic Produce Only</span>
              </label>
            </div>

            {/* Brands Filter */}
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-bold text-[#1E293B] mb-3 uppercase tracking-wider">
                Brand
              </h3>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    updateUrl({ brand: "All", page: 1 });
                  }}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-[6px] transition-colors flex items-center justify-between ${
                    !brandParam || brandParam === "All"
                      ? "bg-[#FAB528] text-[#0F172A] font-bold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>All Brands</span>
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      updateUrl({ brand: b.name, page: 1 });
                    }}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-[6px] transition-colors flex items-center justify-between ${
                      brandParam === b.name
                        ? "bg-[#FAB528] text-[#0F172A] font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] opacity-75">({b.productCount})</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN RESULTS GRID */}
          <div className="flex-1">
            {/* Top Bar in Main Content */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-4 mb-6">
              <div>
                <h1 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[18px] text-[#0F172A]">
                  {qParam ? `Search results for "${qParam}"` : "All Products"}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {products.length} of {total} items found
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Sort by:</span>
                <select
                  value={sortParam}
                  onChange={(e) => {
                    const newSort = e.target.value;
                    updateUrl({ sort: newSort, page: 1 });
                  }}
                  className="text-xs font-semibold bg-white border border-[#E2E8F0] rounded-[6px] px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#2B5F3F]"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Loading Skeleton or Empty State or Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-72 bg-slate-100 rounded-[10px] animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-[12px] border border-dashed border-slate-200">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[18px] text-[#0F172A]">
                  No products found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  We couldn&apos;t find any items matching your criteria. Try different keywords like &quot;avocado&quot;, &quot;beef&quot;, &quot;juice&quot;, or &quot;bread&quot;.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#2B5F3F] text-white rounded-[8px] text-xs font-bold hover:bg-[#1E452E] transition-colors"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  disabled={pageParam <= 1}
                  onClick={() => updateUrl({ page: pageParam - 1 })}
                  className="px-3 py-1.5 rounded-[6px] border border-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  ‹ Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => updateUrl({ page: pNum })}
                      className={`w-8 h-8 rounded-[6px] text-xs font-bold transition-colors ${
                        pageParam === pNum
                          ? "bg-[#2B5F3F] text-white"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  disabled={pageParam >= totalPages}
                  onClick={() => updateUrl({ page: pageParam + 1 })}
                  className="px-3 py-1.5 rounded-[6px] border border-slate-300 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next ›
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      <div className={`cart-toast ${toast.show ? "show" : ""}`}>
        <span className="toast-icon">✓</span>
        <span>{toast.message}</span>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold">Loading Farmart Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
