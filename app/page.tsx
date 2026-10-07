"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/Footer";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  itemCount: number;
}

interface BrandData {
  id: string;
  name: string;
  logoUrl?: string;
  tag?: string;
  title?: string;
  productCount: number;
}

interface TopSaverDeal {
  id: string;
  productId?: string;
  name: string;
  price: number;
  oldPrice: number;
  discountPercent: number;
  unit: string;
  stockTotal: number;
  stockSold: number;
  imageUrl?: string;
}

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category?: string;
  categorySlug?: string;
  price: number;
  oldPrice?: number;
  unit?: string;
  discountPercent?: number;
  isOrganic?: boolean;
  rating: number;
  reviewCount: number;
  imageUrl?: string;
}

function ProductSvgGraphic({ name, category }: { name: string; category?: string }) {
  const lower = (name + " " + (category || "")).toLowerCase();
  if (lower.includes("avocado") || lower.includes("ice-block")) {
    return (
      <svg width="110" height="110" viewBox="0 0 130 140" fill="none">
        <rect x="25" y="20" width="80" height="100" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2"/>
        <rect x="25" y="45" width="80" height="60" fill="#10B981"/>
        <circle cx="65" cy="75" r="18" fill="#FFFFFF"/>
        <path d="M65 64 C72 67 72 78 65 83 C58 78 58 67 65 64 Z" fill="#059669"/>
        <text x="65" y="115" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="8" fill="#334155" textAnchor="middle">ORGANIC</text>
      </svg>
    );
  }
  if (lower.includes("beef") || lower.includes("meat") || lower.includes("mince")) {
    return (
      <svg width="100" height="80" viewBox="0 0 120 90" fill="none">
        <rect x="15" y="10" width="90" height="70" rx="6" fill="#1E293B"/>
        <rect x="20" y="15" width="80" height="60" rx="4" fill="#DC2626"/>
        <path d="M25 25 Q35 18 45 28 T65 25 T85 28" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
        <path d="M25 45 Q35 38 45 48 T65 45 T85 48" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
        <path d="M25 65 Q35 58 45 68 T65 65 T85 68" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
        <rect x="40" y="30" width="40" height="30" rx="2" fill="#FFFFFF"/>
        <text x="60" y="44" fontSize="7" fontWeight="bold" fill="#000" textAnchor="middle">BEEF</text>
        <text x="60" y="53" fontSize="6" fill="#64748B" textAnchor="middle">20% FAT</text>
      </svg>
    );
  }
  if (lower.includes("bread") || lower.includes("bakery") || lower.includes("toast")) {
    return (
      <svg width="100" height="80" viewBox="0 0 120 90" fill="none">
        <rect x="25" y="20" width="70" height="50" rx="8" fill="#FDE68A" stroke="#D97706" strokeWidth="2"/>
        <path d="M25 35 Q60 25 95 35 L95 65 Q60 75 25 65 Z" fill="#F59E0B"/>
        <rect x="38" y="32" width="44" height="26" rx="4" fill="#FFFFFF"/>
        <text x="60" y="44" fontSize="7" fontWeight="bold" fill="#000" textAnchor="middle">FARMART</text>
        <text x="60" y="52" fontSize="5" fill="#64748B" textAnchor="middle">FARMHOUSE</text>
      </svg>
    );
  }
  if (lower.includes("orange") || lower.includes("citrus")) {
    return (
      <svg width="100" height="80" viewBox="0 0 120 90" fill="none">
        <circle cx="45" cy="48" r="24" fill="#EA580C"/>
        <circle cx="78" cy="45" r="22" fill="#F97316"/>
        <circle cx="45" cy="48" r="20" fill="#FDBA74"/>
        <path d="M45 28 L45 68 M25 48 L65 48 M31 34 L59 62 M31 62 L59 34" stroke="#EA580C" strokeWidth="2"/>
        <circle cx="45" cy="48" r="4" fill="#FFFFFF"/>
      </svg>
    );
  }
  if (lower.includes("melon") || lower.includes("water melon")) {
    return (
      <svg width="80" height="70" viewBox="0 0 90 80" fill="none">
        <ellipse cx="45" cy="40" rx="28" ry="32" fill="#FACC15"/>
        <ellipse cx="45" cy="40" rx="24" ry="28" fill="#FDE047"/>
        <path d="M45 8 L43 2 M45 8 L48 2" stroke="#65A30D" strokeWidth="2"/>
      </svg>
    );
  }
  if (lower.includes("juice") || lower.includes("detox") || lower.includes("drink")) {
    return (
      <svg width="100" height="100" viewBox="0 0 120 130" fill="none">
        <rect x="25" y="20" width="70" height="90" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2"/>
        <rect x="25" y="40" width="70" height="50" fill="#047857"/>
        <circle cx="60" cy="65" r="14" fill="#FFFFFF"/>
        <text x="60" y="105" fontSize="7" fontWeight="bold" fill="#334155" textAnchor="middle">ORGANIC JUICE</text>
      </svg>
    );
  }
  if (lower.includes("snack") || lower.includes("spice")) {
    return (
      <svg width="80" height="70" viewBox="0 0 90 80" fill="none">
        <rect x="22" y="12" width="46" height="58" rx="4" fill="#DC2626"/>
        <circle cx="45" cy="40" r="14" fill="#FEF08A"/>
        <text x="45" y="44" fontSize="8" fontWeight="900" fill="#B91C1C" textAnchor="middle">6</text>
      </svg>
    );
  }
  if (lower.includes("cookie") || lower.includes("oat")) {
    return (
      <svg width="80" height="70" viewBox="0 0 90 80" fill="none">
        <polygon points="25,20 65,20 60,65 30,65" fill="#D97706"/>
        <rect x="22" y="16" width="46" height="8" rx="2" fill="#FDE68A"/>
        <circle cx="45" cy="42" r="12" fill="#FFFFFF"/>
        <text x="45" y="45" fontSize="6" fontWeight="bold" fill="#78350F" textAnchor="middle">OAT</text>
      </svg>
    );
  }
  if (lower.includes("soup") || lower.includes("turkey") || lower.includes("can")) {
    return (
      <svg width="80" height="70" viewBox="0 0 90 80" fill="none">
        <circle cx="45" cy="40" r="28" fill="#1E293B"/>
        <circle cx="45" cy="40" r="24" fill="#F8FAFC"/>
        <circle cx="45" cy="40" r="18" fill="#FDE68A"/>
        <circle cx="42" cy="36" r="3" fill="#10B981"/>
        <circle cx="48" cy="42" r="3" fill="#EF4444"/>
      </svg>
    );
  }
  if (lower.includes("egg")) {
    return (
      <svg width="70" height="60" viewBox="0 0 80 70" fill="none">
        <rect x="18" y="18" width="44" height="34" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2"/>
        <circle cx="30" cy="35" r="6" fill="#FED7AA"/>
        <circle cx="50" cy="35" r="6" fill="#FED7AA"/>
      </svg>
    );
  }
  if (lower.includes("oil") || lower.includes("honey")) {
    return (
      <svg width="70" height="60" viewBox="0 0 80 70" fill="none">
        <rect x="25" y="18" width="30" height="38" rx="6" fill="#F59E0B"/>
        <rect x="22" y="12" width="36" height="8" rx="2" fill="#FFFFFF" stroke="#D97706"/>
      </svg>
    );
  }
  if (lower.includes("wipe") || lower.includes("clean") || lower.includes("bamboo")) {
    return (
      <svg width="70" height="60" viewBox="0 0 80 70" fill="none">
        <rect x="20" y="20" width="40" height="32" rx="4" fill="#06B6D4"/>
        <rect x="28" y="16" width="24" height="6" rx="2" fill="#CFFAFE"/>
      </svg>
    );
  }

  return (
    <svg width="70" height="60" viewBox="0 0 80 70" fill="none">
      <rect x="15" y="15" width="50" height="40" rx="4" fill="#047857"/>
      <circle cx="40" cy="35" r="12" fill="#FDE047"/>
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();

  // State
  const [cartCount, setCartCount] = useState<number>(3);
  const [cartTotal, setCartTotal] = useState<number>(2450.59);
  const [topSaverQty, setTopSaverQty] = useState<number>(1);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [wishlistActive, setWishlistActive] = useState<{ [key: string]: boolean }>({});
  const [activeCategory, setActiveCategory] = useState<string>("Breads & Sweets");
  const [bestSellerTab, setBestSellerTab] = useState<string>("All");
  const [justLandingTab, setJustLandingTab] = useState<string>("All");
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("ALL CATEGORIES");

  // Dynamic API Data states
  const [categories, setCategories] = useState<CategoryData[]>([
    { id: "cat-1", name: "Fruits &\nVegetables", slug: "fruits-vegetables", icon: "fruit", itemCount: 154 },
    { id: "cat-2", name: "Breads &\nSweets", slug: "breads-sweets", icon: "bread", itemCount: 82 },
    { id: "cat-3", name: "Frozen\nSeafoods", slug: "frozen-seafoods", icon: "seafood", itemCount: 64 },
    { id: "cat-4", name: "Raw Meats", slug: "raw-meats", icon: "meat", itemCount: 45 },
    { id: "cat-5", name: "Wines &\nAlcohol Drinks", slug: "wines-alcohol-drinks", icon: "wine", itemCount: 38 },
    { id: "cat-6", name: "Coffees and\nTeas", slug: "coffees-teas", icon: "coffee", itemCount: 92 },
    { id: "cat-7", name: "Milks and\nDairies", slug: "milks-dairies", icon: "milk", itemCount: 53 },
    { id: "cat-8", name: "Pet Foods", slug: "pet-foods", icon: "pet", itemCount: 29 },
  ]);

  const [brands, setBrands] = useState<BrandData[]>([
    { id: "brand-1", name: "Hoodpouch", tag: "HOODPOUCH", title: "New Snacks Release", productCount: 18 },
    { id: "brand-2", name: "Tea-ric", tag: "TEA-RIC", title: "Happy Tea 100% Organic, From $29.9", productCount: 24 },
    { id: "brand-3", name: "Soda Brand", tag: "SODA BRAND", title: "Soda Can Box 24 Pieces - 30% OFF", productCount: 15 },
    { id: "brand-4", name: "Farmart Organic Direct", tag: "FARMART", title: "Fresh Meat Sausage. BUY 2 GET 1", productCount: 32 },
  ]);

  const [topSaverDeals, setTopSaverDeals] = useState<TopSaverDeal[]>([
    {
      id: "deal-1",
      productId: "1",
      name: "Fresh Organic Hass Avocado (Pack of 4)",
      price: 45.00,
      oldPrice: 59.00,
      discountPercent: 24,
      unit: "Pack of 4 pcs",
      stockTotal: 40,
      stockSold: 20,
    },
    {
      id: "deal-2",
      productId: "3",
      name: "British Beef Mince (20% Fat)",
      price: 59.00,
      oldPrice: 65.00,
      discountPercent: 12,
      unit: "500g vacuum sealed",
      stockTotal: 100,
      stockSold: 25,
    },
    {
      id: "deal-3",
      productId: "4",
      name: "Farmart Farmhouse Soft White",
      price: 12.70,
      oldPrice: 14.50,
      discountPercent: 12,
      unit: "800g loaf",
      stockTotal: 20,
      stockSold: 8,
    },
    {
      id: "deal-4",
      productId: "5",
      name: "Fresh Blood Oranges (1kg)",
      price: 11.15,
      oldPrice: 13.99,
      discountPercent: 20,
      unit: "1kg bag",
      stockTotal: 20,
      stockSold: 12,
    },
  ]);

  const [bestSellerProducts, setBestSellerProducts] = useState<ProductItem[]>([]);
  const [justLandingProducts, setJustLandingProducts] = useState<ProductItem[]>([]);

  const [timeLeft, setTimeLeft] = useState({
    hours: "08",
    minutes: "25",
    seconds: "37",
  });

  const showToast = useCallback((message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 2500);
  }, []);

  // Fetch Categories from SQLite API
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch Brands from SQLite API
  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
        }
      })
      .catch((err) => console.error("Error fetching brands:", err));
  }, []);

  // Fetch Top Saver Deals & Countdown from SQLite API
  useEffect(() => {
    fetch("/api/deals/top-saver")
      .then((res) => res.json())
      .then((data) => {
        if (data.deals && Array.isArray(data.deals)) {
          setTopSaverDeals(data.deals);
        }
        if (data.timeLeftFormatted) {
          setTimeLeft(data.timeLeftFormatted);
        }
      })
      .catch((err) => console.error("Error fetching top saver:", err));
  }, []);

  // Live Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSec = parseInt(prev.hours, 10) * 3600 + parseInt(prev.minutes, 10) * 60 + parseInt(prev.seconds, 10);
        if (totalSec <= 0) return prev;
        const nextSec = totalSec - 1;
        const h = String(Math.floor(nextSec / 3600)).padStart(2, "0");
        const m = String(Math.floor((nextSec % 3600) / 60)).padStart(2, "0");
        const s = String(nextSec % 60).padStart(2, "0");
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Best Sellers when tab changes
  useEffect(() => {
    fetch(`/api/products/best-sellers?category=${encodeURIComponent(bestSellerTab)}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBestSellerProducts(data);
        }
      })
      .catch((err) => console.error("Error fetching best sellers:", err));
  }, [bestSellerTab]);

  // Fetch Just Landing when tab changes
  useEffect(() => {
    fetch(`/api/products/just-landing?category=${encodeURIComponent(justLandingTab)}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJustLandingProducts(data);
        }
      })
      .catch((err) => console.error("Error fetching just landing:", err));
  }, [justLandingTab]);

  const handleUpdateQty = (delta: number) => {
    setTopSaverQty((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = (productName: string, price: number) => {
    setCartCount((prev) => prev + 1);
    setCartTotal((prev) => prev + price);
    showToast(`Added "${productName}" to your cart!`);
  };

  const toggleWishlist = (id: string) => {
    setWishlistActive((prev) => {
      const isFav = !prev[id];
      if (isFav) {
        setWishlistCount((c) => c + 1);
        showToast("Saved to your wishlist!");
      } else {
        setWishlistCount((c) => Math.max(0, c - 1));
      }
      return { ...prev, [id]: isFav };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (searchCategory && searchCategory !== "ALL CATEGORIES" && searchCategory !== "All") {
      params.set("category", searchCategory);
    }
    router.push(`/search?${params.toString()}`);
  };

  const filterTabs = [
    "All",
    "Fruits & Vegetables",
    "Frozen Seafoods",
    "Raw Meats",
    "Coffees & Teas",
    "Pet Foods",
    "Milks & Dairies",
  ];

  const mainTopSaver = topSaverDeals[0] || {
    id: "deal-1",
    productId: "1",
    name: "Fresh Organic Hass Avocado (Pack of 4)",
    price: 45.0,
    oldPrice: 59.0,
    discountPercent: 24,
    unit: "Pack of 4 pcs",
    stockTotal: 40,
    stockSold: 20,
  };

  const sideTopSaverDeals = topSaverDeals.slice(1, 4);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white text-slate-800">
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

          {/* Search Bar - Connected to /search */}
          <div className="search-wrapper">
            <form onSubmit={handleSearch} className="search-bar">
              <div className="category-select">
                <select
                  aria-label="Select Category"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="ALL CATEGORIES">ALL CATEGORIES</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name.replace("\n", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                className="search-input"
                placeholder="I'm searching for fresh organic produce..."
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              {/* Account */}
              <Link href="/search" className="action-icon-btn" aria-label="Search Catalog" title="Search All Products">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </Link>
              {/* Wishlist */}
              <Link href="/search" className="action-icon-btn" aria-label="Wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
                <span className="badge-count">{wishlistCount}</span>
              </Link>
              {/* Cart */}
              <div className="cart-summary" onClick={() => showToast("Cart drawer opened")}>
                <div className="action-icon-btn" style={{ width: "auto", height: "auto", padding: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* 2. NAVIGATION BAR */}
      <nav className="nav-bar">
        <div className="container nav-bar-inner">
          <Link href="/search" className="category-dropdown-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>SHOP BY CATEGORY</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Link>

          <ul className="nav-links">
            <li>
              <Link href="/search" className="nav-link active-deal">
                <span>🔥</span> Deals Today
              </Link>
            </li>
            <li>
              <Link href="/products/1" className="nav-link special-price font-bold text-[#F25C05]">
                <span>🥑</span> Organic Avocado (Detail)
              </Link>
            </li>
            <li>
              <Link href="/products/2" className="nav-link text-[#2B5F3F] font-bold">
                <span>🌱</span> Detox Juice
              </Link>
            </li>
            <li><Link href="/search?category=fruits-vegetables" className="nav-link">Fresh ▾</Link></li>
            <li><Link href="/search?category=frozen-seafoods" className="nav-link">Frozen ▾</Link></li>
            <li><Link href="/design" className="nav-link text-[#64748B]">🎨 Design System</Link></li>
          </ul>

          <Link href="/search" className="nav-right-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Catalog Explorer
          </Link>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-grid">
          {/* Main Hero Banner */}
          <div className="hero-banner-main">
            <div className="hero-content">
              <h1 className="hero-title">Active Summer With Juice Milk 300ml</h1>
              <p className="hero-desc">New arrivals with maracuja, fruits, juice milk, essential for summer.</p>
              <Link href="/search?q=juice" className="btn-shop-now">Shop Now</Link>
            </div>
            <div className="hero-image-box">
              <svg className="hero-product-img" width="220" height="220" viewBox="0 0 200 200" fill="none">
                <rect x="50" y="30" width="90" height="140" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2"/>
                <path d="M50 40 L95 15 L140 40 L95 65 Z" fill="#E2E8F0"/>
                <rect x="50" y="65" width="90" height="105" rx="4" fill="#3B82F6"/>
                <circle cx="95" cy="115" r="32" fill="#F59E0B"/>
                <circle cx="95" cy="115" r="26" fill="#FBBF24"/>
                <path d="M95 92 L95 138 M72 115 L118 115" stroke="#F59E0B" strokeWidth="3"/>
                <text x="95" y="165" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="14" fill="#FFFFFF" textAnchor="middle">JUICE MILK</text>
                <rect x="90" y="10" width="12" height="15" rx="3" fill="#EF4444"/>
              </svg>
            </div>
            <div className="hero-slider-nav">
              <span className="slider-arrow-btn">‹</span>
              <span>1 / 3</span>
              <span className="slider-arrow-btn">›</span>
            </div>
          </div>

          {/* Right Promo Banner */}
          <div className="hero-banner-side">
            <div className="hero-side-content">
              <div className="sale-badge-text">20% SALE OFF</div>
              <p className="sale-sub-text">Synthetic seeds<br />Net 2.0 OZ</p>
              <Link href="/search?isOrganic=true" className="btn-shop-now">Shop Now</Link>
            </div>
            <div className="hero-side-img-box">
              <svg className="hero-side-product-img" width="160" height="140" viewBox="0 0 160 140" fill="none">
                <polygon points="30,40 130,40 145,110 15,110" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2"/>
                <polygon points="30,40 80,15 130,40" fill="#F1F5F9"/>
                <rect x="45" y="55" width="70" height="45" rx="4" fill="#10B981"/>
                <text x="80" y="78" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="11" fill="#FFFFFF" textAnchor="middle">FOOD BOX</text>
                <text x="80" y="90" fontSize="8" fill="#ECFDF5" textAnchor="middle">Fresh Organic</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BROWSE BY CATEGORY (Connected to SQLite API) */}
      <section className="container" style={{ marginBottom: "24px" }}>
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <div className="section-nav-actions">
            <Link href="/search" className="link-all">All Categories &gt;</Link>
            <div className="carousel-arrows">
              <button className="arrow-nav-btn" aria-label="Previous">‹</button>
              <button className="arrow-nav-btn" aria-label="Next">›</button>
            </div>
          </div>
        </div>

        <div className="category-grid">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className={`category-card ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(cat.name);
                router.push(`/search?category=${encodeURIComponent(cat.slug)}`);
              }}
            >
              <div className="category-icon-box">
                {cat.slug === "fruits-vegetables" && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="14" r="5" fill="#fef3c7"/>
                    <circle cx="15" cy="14" r="5" fill="#fee2e2" stroke="#ef4444"/>
                    <path d="M12 9c0-3 1.5-4 4-4" stroke="#10b981"/>
                  </svg>
                )}
                {cat.slug === "breads-sweets" && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14c0-4.4 3.6-8 8-8s8 3.6 8 8v2H4v-2Z" fill="#fef3c7"/>
                    <line x1="8" y1="10" x2="8" y2="13"></line>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="16" y1="10" x2="16" y2="13"></line>
                  </svg>
                )}
                {cat.slug === "frozen-seafoods" && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5Z" fill="#e0f2fe"/>
                    <path d="M5 12H2m20 0h-3M7 8l-3-3m16 0-3 3M7 16l-3 3m16 0-3-3"></path>
                  </svg>
                )}
                {cat.slug === "raw-meats" && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 8c0-3.3-2.7-6-6-6S7 4.7 7 8c0 2.2 1.2 4.1 3 5.1V18l3 3 6-6v-3.9c1.8-1 3-2.9 3-5.1Z" fill="#fee2e2"/>
                    <circle cx="13" cy="8" r="2" fill="#ef4444"/>
                  </svg>
                )}
                {cat.slug === "wines-alcohol-drinks" && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 22h8M12 17v5M8 10a4 4 0 0 0 8 0V4H8v6Z" fill="#ede9fe"/>
                    <rect x="18" y="9" width="4" height="12" rx="1" fill="#ddd6fe"/>
                  </svg>
                )}
                {cat.slug === "coffees-teas" && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" fill="#fef3c7"/>
                    <line x1="6" y1="2" x2="6" y2="4"></line>
                    <line x1="10" y1="2" x2="10" y2="4"></line>
                    <line x1="14" y1="2" x2="14" y2="4"></line>
                  </svg>
                )}
                {cat.slug === "milks-dairies" && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 8V4l3-2h4l3 2v4H7Z" fill="#f0f9ff"/>
                    <rect x="7" y="8" width="10" height="14" rx="2" fill="#e0f2fe"/>
                    <circle cx="12" cy="15" r="2" fill="#0ea5e9"/>
                  </svg>
                )}
                {cat.slug === "pet-foods" && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#65a30d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="6" width="12" height="16" rx="2" fill="#ecfccb"/>
                    <circle cx="12" cy="14" r="2" fill="#65a30d"/>
                    <circle cx="10" cy="11" r="1" fill="#65a30d"/>
                    <circle cx="14" cy="11" r="1" fill="#65a30d"/>
                  </svg>
                )}
              </div>
              <span className="category-name" style={{ whiteSpace: "pre-line" }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED BRANDS (Connected to SQLite API) */}
      <section className="container" style={{ marginBottom: "24px" }}>
        <div className="section-header">
          <h2 className="section-title">Featured Brands</h2>
          <div className="section-nav-actions">
            <Link href="/search" className="link-all">All Offers &gt;</Link>
            <div className="carousel-arrows">
              <button className="arrow-nav-btn" aria-label="Previous">‹</button>
              <button className="arrow-nav-btn" aria-label="Next">›</button>
            </div>
          </div>
        </div>

        <div className="featured-brands-grid">
          {brands.map((b, idx) => {
            const colors = ["card-purple", "card-beige", "card-blue", "card-green"];
            const colorClass = colors[idx % colors.length];
            return (
              <div
                key={b.id}
                className={`brand-promo-card ${colorClass} cursor-pointer`}
                onClick={() => router.push(`/search?brand=${encodeURIComponent(b.name)}`)}
              >
                <div className="brand-img-container">
                  <ProductSvgGraphic name={b.name} />
                </div>
                <div className="brand-meta">
                  <div className="brand-tag">{b.tag || b.name.toUpperCase()}</div>
                  <div className="brand-card-title">{b.title || `${b.name} Products (${b.productCount})`}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TOP SAVER TODAY (Connected to SQLite API) */}
      <section className="container" style={{ marginBottom: "24px" }}>
        <div className="section-header">
          <div className="top-saver-header-wrap">
            <h2 className="section-title">Top Saver Today</h2>
            <div className="countdown-timer-pill">
              <span>Expires in:</span>
              <span>{timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}</span>
            </div>
          </div>
          <div className="section-nav-actions">
            <Link href="/search" className="link-all">All Offers &gt;</Link>
            <div className="carousel-arrows">
              <button className="arrow-nav-btn" aria-label="Previous">‹</button>
              <button className="arrow-nav-btn" aria-label="Next">›</button>
            </div>
          </div>
        </div>

        <div className="top-saver-layout">
          {/* Left Deal Card */}
          <div className="highlight-deal-card">
            <span className="discount-badge">-{mainTopSaver.discountPercent}%</span>
            <button
              className="wishlist-btn-small"
              aria-label="Add to Wishlist"
              onClick={() => toggleWishlist(mainTopSaver.id)}
              style={{
                color: wishlistActive[mainTopSaver.id] ? "#ef4444" : "#94a3b8",
                background: wishlistActive[mainTopSaver.id] ? "#fee2e2" : "#f8fafc",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlistActive[mainTopSaver.id] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </button>

            <div className="highlight-product-img-box">
              <ProductSvgGraphic name={mainTopSaver.name} />
            </div>

            <div className="product-brand">Farmart Direct</div>
            <h3 className="product-title">
              <Link href={`/products/${mainTopSaver.productId || "1"}`} className="hover:text-[#F25C05] transition-colors">
                {mainTopSaver.name}
              </Link>
            </h3>

            <div className="rating-row">
              <div className="stars">★★★★★</div>
              <span className="review-count">(5)</span>
            </div>

            <div className="price-row">
              <span className="current-price">${mainTopSaver.price.toFixed(2)}</span>
              {mainTopSaver.oldPrice > mainTopSaver.price && (
                <span className="old-price" style={{ marginLeft: "8px", textDecoration: "line-through", color: "#94a3b8", fontSize: "12px" }}>
                  ${mainTopSaver.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="progress-wrap">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${Math.min(100, Math.round((mainTopSaver.stockSold / mainTopSaver.stockTotal) * 100))}%` }}
                ></div>
              </div>
              <div className="progress-text">Sold: {mainTopSaver.stockSold}/{mainTopSaver.stockTotal}</div>
            </div>

            <div className="qty-stepper-row">
              <div className="stepper">
                <button className="stepper-btn" onClick={() => handleUpdateQty(-1)}>-</button>
                <span className="stepper-value">{topSaverQty}</span>
                <button className="stepper-btn" onClick={() => handleUpdateQty(1)}>+</button>
              </div>
              <span className="stepper-total">
                Total: <b>${(topSaverQty * mainTopSaver.price).toFixed(2)}</b>
              </span>
            </div>

            <button
              className="btn-add-cart"
              onClick={() => handleAddToCart(mainTopSaver.name, mainTopSaver.price * topSaverQty)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              Add To Cart
            </button>
          </div>

          {/* Middle: 3 Product Cards from SQLite API */}
          <div className="top-saver-cards-grid">
            {sideTopSaverDeals.map((deal) => (
              <div key={deal.id} className="product-mini-card">
                {deal.discountPercent > 0 && (
                  <span className="discount-badge">-{deal.discountPercent}%</span>
                )}
                <div className="product-img-box">
                  <ProductSvgGraphic name={deal.name} />
                </div>
                <div className="product-brand">Farmart</div>
                <h4 className="product-title">
                  <Link href={`/products/${deal.productId || "1"}`} className="hover:text-[#F25C05] transition-colors">
                    {deal.name}
                  </Link>
                </h4>
                <div className="rating-row">
                  <div className="stars">★★★★★</div>
                  <span className="review-count">({deal.stockSold > 10 ? 8 : 2})</span>
                </div>
                <div className="price-row">
                  <span className="current-price">${deal.price.toFixed(2)}</span>
                  {deal.oldPrice > deal.price && (
                    <span className="old-price">${deal.oldPrice.toFixed(2)}</span>
                  )}
                </div>
                <div className="progress-wrap">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.min(100, Math.round((deal.stockSold / deal.stockTotal) * 100))}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">Sold: {deal.stockSold}/{deal.stockTotal}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Member Sign-up Banner (15% OFF) */}
          <div className="member-signup-card">
            <div className="member-heading">15% OFF</div>
            <p className="member-sub">For new member sign up at the first time</p>

            <form
              className="signup-form"
              onSubmit={(e) => {
                e.preventDefault();
                showToast("Registration Successful! Coupon added to your wallet.");
              }}
            >
              <div className="input-field-wrap">
                <span className="input-icon">✉</span>
                <input type="email" className="member-input" placeholder="yourdomain@gmail.com" required />
              </div>
              <div className="input-field-wrap">
                <span className="input-icon">🔒</span>
                <input type="password" className="member-input" placeholder="Password" required />
              </div>
              <div className="input-field-wrap">
                <span className="input-icon">🔒</span>
                <input type="password" className="member-input" placeholder="Re-type Password" required />
              </div>
              <button type="submit" className="btn-register">Register Now</button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. BEST SELLER (Connected to SQLite API with Tab filtering) */}
      <section className="container" style={{ marginBottom: "30px" }}>
        <div className="section-header">
          <div className="section-title-tabs-wrap">
            <h2 className="section-title">Best Seller</h2>
            <ul className="filter-tabs-list">
              {filterTabs.map((tab) => (
                <li
                  key={tab}
                  className={`filter-tab ${bestSellerTab === tab ? "active" : ""}`}
                  onClick={() => {
                    setBestSellerTab(tab);
                    showToast(`Filtered Best Seller by: ${tab}`);
                  }}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
          <div className="carousel-arrows">
            <button className="arrow-nav-btn" aria-label="Previous">‹</button>
            <button className="arrow-nav-btn" aria-label="Next">›</button>
          </div>
        </div>

        <div className="best-seller-layout">
          {/* Left Deal Card */}
          <div className="highlight-deal-card">
            <span className="discount-badge">-18%</span>
            <button
              className="wishlist-btn-small"
              aria-label="Wishlist"
              onClick={() => toggleWishlist("best-seller-deal")}
              style={{
                color: wishlistActive["best-seller-deal"] ? "#ef4444" : "#94a3b8",
                background: wishlistActive["best-seller-deal"] ? "#fee2e2" : "#f8fafc",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlistActive["best-seller-deal"] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </button>
            <div className="highlight-product-img-box">
              <ProductSvgGraphic name="Raw Green Detox Cold-Pressed Juice 500ml" />
            </div>
            <div className="product-brand">Farmart</div>
            <h3 className="product-title">
              <Link href="/products/2" className="hover:text-[#F25C05] transition-colors">
                Raw Green Detox Juice 500ml
              </Link>
            </h3>
            <div className="rating-row">
              <div className="stars">★★★★★</div>
              <span className="review-count">(12)</span>
            </div>
            <div className="price-row">
              <span className="current-price">$18.25</span>
            </div>
            <button className="btn-add-cart" onClick={() => handleAddToCart("Raw Green Detox Juice 500ml", 18.25)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              Add To Cart
            </button>
          </div>

          {/* Right 5 Products Grid from SQLite */}
          <div className="product-shelf-grid-5">
            {bestSellerProducts.length > 0 ? (
              bestSellerProducts.slice(0, 5).map((prod) => (
                <div key={prod.id} className="shelf-card">
                  {prod.discountPercent && prod.discountPercent > 0 ? (
                    <span className="discount-badge">-{prod.discountPercent}%</span>
                  ) : null}
                  <div className="product-img-box">
                    <ProductSvgGraphic name={prod.name} category={prod.category} />
                  </div>
                  <div className="product-brand">{prod.brand || "Farmart"}</div>
                  <h4 className="product-title">
                    <Link href={`/products/${prod.id}`} className="hover:text-[#F25C05] transition-colors">
                      {prod.name}
                    </Link>
                  </h4>
                  <div className="rating-row">
                    <div className="stars">★★★★★</div>
                    <span className="review-count">({prod.reviewCount || 4})</span>
                  </div>
                  <div className="price-row">
                    <span className="current-price">${prod.price.toFixed(2)}</span>
                    {prod.oldPrice && prod.oldPrice > prod.price && (
                      <span className="old-price">${prod.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-5 py-8 text-center text-xs text-slate-400">
                Loading Best Sellers...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. JUST LANDING (Connected to SQLite API with Tab filtering) */}
      <section className="container" style={{ marginBottom: "40px" }}>
        <div className="section-header">
          <div className="section-title-tabs-wrap">
            <h2 className="section-title">Just Landing</h2>
            <ul className="filter-tabs-list">
              {filterTabs.map((tab) => (
                <li
                  key={tab}
                  className={`filter-tab ${justLandingTab === tab ? "active" : ""}`}
                  onClick={() => {
                    setJustLandingTab(tab);
                    showToast(`Filtered Just Landing by: ${tab}`);
                  }}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
          <div className="carousel-arrows">
            <button className="arrow-nav-btn" aria-label="Previous">‹</button>
            <button className="arrow-nav-btn" aria-label="Next">›</button>
          </div>
        </div>

        <div className="product-shelf-grid-6">
          {justLandingProducts.length > 0 ? (
            justLandingProducts.slice(0, 6).map((prod) => (
              <div key={prod.id} className="shelf-card">
                {prod.discountPercent && prod.discountPercent > 0 ? (
                  <span className="discount-badge">-{prod.discountPercent}%</span>
                ) : null}
                <div className="product-img-box">
                  <ProductSvgGraphic name={prod.name} category={prod.category} />
                </div>
                <div className="product-brand">{prod.brand || "Farmart"}</div>
                <h4 className="product-title">
                  <Link href={`/products/${prod.id}`} className="hover:text-[#F25C05] transition-colors">
                    {prod.name}
                  </Link>
                </h4>
                <div className="price-row">
                  <span className="current-price">${prod.price.toFixed(2)}</span>
                  {prod.oldPrice && prod.oldPrice > prod.price && (
                    <span className="old-price" style={{ textDecoration: "line-through", color: "#94a3b8", fontSize: "11px", marginLeft: "4px" }}>
                      ${prod.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-6 py-8 text-center text-xs text-slate-400">
              Loading Just Landing Products...
            </div>
          )}
        </div>
      </section>

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
