"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog } from "@/components/Dialog";
import { ProductCard } from "@/components/ProductCard";

export default function DesignSystemPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [stepperVal, setStepperVal] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<string>("Breads & Sweets");
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [showYamlModal, setShowYamlModal] = useState<boolean>(false);
  const [activeDialog, setActiveDialog] = useState<"confirm" | "quickview" | "promo" | null>(null);
  const [quickViewQty, setQuickViewQty] = useState<number>(1);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2400);
  };

  const copyToClipboard = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    triggerToast(`Copied ${label || text} to clipboard!`);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  // Color Tokens Data strictly mapped from DESIGN.md
  const brandAccentColors = [
    { name: "Primary Yellow", token: "{colors.primary}", hex: "#FAB528", role: "Primary CTA, active highlights, star ratings", textLight: false },
    { name: "Primary Yellow Hover", token: "{colors.primary-hover}", hex: "#E5A420", role: "Active/hover state for yellow interactive buttons", textLight: false },
    { name: "Primary Yellow Light", token: "{colors.primary-light}", hex: "#FFF8EB", role: "Soft warm tint for category icon containers & active filters", textLight: false },
    { name: "Accent Orange", token: "{colors.accent-orange}", hex: "#F25C05", role: "Secondary warm accent for hot promo tags, flash deals", textLight: true },
    { name: "Accent Orange Light", token: "{colors.accent-orange-light}", hex: "#FFF0EB", role: "Light background tint for orange highlights", textLight: false },
    { name: "Deal Red", token: "{colors.deal-red}", hex: "#DC2626", role: "Urgent discount percentage badges (-24%), countdown timer", textLight: true },
    { name: "Organic Green", token: "{colors.organic-green}", hex: "#2B5F3F", role: "Brand leaf emblem, 100% organic certification badges", textLight: true },
    { name: "Fresh Emerald", token: "{colors.fresh-emerald}", hex: "#10B981", role: "In-stock indicator, fresh produce badges", textLight: true },
    { name: "Sky Blue", token: "{colors.sky-blue}", hex: "#0284C7", role: "Category icon accent for dairy, cold beverages, special prices", textLight: true },
  ];

  const surfaceNeutralColors = [
    { name: "Ink Primary", token: "{colors.ink}", hex: "#0F172A", role: "Maximum legibility heading and price text", textLight: true },
    { name: "Body Text", token: "{colors.body}", hex: "#1E293B", role: "Standard product titles and description copy", textLight: true },
    { name: "Text Muted", token: "{colors.muted}", hex: "#64748B", role: "Secondary labels, review quantities, unit counts", textLight: true },
    { name: "Text Subtle", token: "{colors.subtle}", hex: "#94A3B8", role: "Strikethrough previous price tags ($14.50), placeholders", textLight: false },
    { name: "Canvas", token: "{colors.canvas}", hex: "#F8FAFC", role: "The clean foundation page floor", textLight: false },
    { name: "Surface Card", token: "{colors.surface-card}", hex: "#FFFFFF", role: "Crisp white plates for product items, modals, search bars", textLight: false },
    { name: "Surface Cream", token: "{colors.surface-cream}", hex: "#FBF7ED", role: "Warm container for membership recruitment cards", textLight: false },
    { name: "Hairline Default", token: "{colors.hairline}", hex: "#E2E8F0", role: "1px structural borders dividing product cards", textLight: false },
    { name: "Hairline Light", token: "{colors.hairline-light}", hex: "#F1F5F9", role: "Soft horizontal rules and top-bar utility dividers", textLight: false },
  ];

  const brandPastels = [
    { name: "Pastel Purple", token: "{colors.pastel-purple}", hex: "#EBE7F7", brand: "HOODPOUCH", desc: "Playful backdrop for snacks, biscuits, confectionery" },
    { name: "Pastel Beige", token: "{colors.pastel-beige}", hex: "#F4EEE2", brand: "TEA-RIC", desc: "Earthy organic backdrop for whole grains, nuts, teas" },
    { name: "Pastel Blue", token: "{colors.pastel-blue}", hex: "#E3EBF3", brand: "SODA BRAND", desc: "Cool refreshing backdrop for mineral waters, sodas, seltzers" },
    { name: "Pastel Green", token: "{colors.pastel-green}", hex: "#E4EFE7", brand: "FARMART MEATS", desc: "Crisp backdrop for butcher-fresh meats and sausages" },
  ];

  const typographyTokens = [
    { token: "{typography.display-lg}", size: "28px", weight: "800", lh: "1.25", ls: "-0.5px", sample: "Active Summer With Fresh Juice Milk 300ml", role: "Main hero marketing titles" },
    { token: "{typography.display-md}", size: "20px", weight: "800", lh: "1.30", ls: "-0.25px", sample: "Top Saver Today & Best Seller Grocery Deals", role: "Section titles (Featured Brands, Top Deals)" },
    { token: "{typography.card-title}", size: "14px", weight: "700", lh: "1.35", ls: "0px", sample: "British Beef Mince (Typically 20% Fat) 500g", role: "Product item titles, promo headlines" },
    { token: "{typography.body-md}", size: "14px", weight: "400", lh: "1.50", ls: "0px", sample: "Farm-fresh groceries delivered directly to your door within 2 hours.", role: "Standard descriptive prose" },
    { token: "{typography.body-sm}", size: "13px", weight: "400", lh: "1.50", ls: "0px", sample: "Free delivery on orders over $50.00 • Sold by Farmart Direct", role: "Metadata, shipping notices, reviews count" },
    { token: "{typography.button}", size: "12px", weight: "700", lh: "1.00", ls: "0px", sample: "ADD TO CART", role: "Interactive buttons, cart triggers" },
    { token: "{typography.price-current}", size: "16px", weight: "800", lh: "1.00", ls: "0px", sample: "$45.00", role: "Current sale price (tabular numbers)" },
    { token: "{typography.price-old}", size: "12px", weight: "400", lh: "1.00", ls: "0px", sample: "$58.00", role: "Strikethrough regular price" },
    { token: "{typography.label-caps}", size: "10px", weight: "700", lh: "1.00", ls: "+1.0px", sample: "ORGANIC 100%", role: "Badges, discount tags, uppercase categories" },
  ];

  const spacingTokens = [
    { token: "{spacing.xs}", value: "4px", desc: "Micro padding between badge text and icon edges" },
    { token: "{spacing.sm}", value: "8px", desc: "Compact gaps between tags, icon-to-label offsets" },
    { token: "{spacing.md}", value: "12px", desc: "Standard gap between form fields, rating stars, price rows" },
    { token: "{spacing.base}", value: "16px", desc: "Default card inner padding and standard component gutters" },
    { token: "{spacing.lg}", value: "24px", desc: "Gap between major product columns and category blocks" },
    { token: "{spacing.xl}", value: "32px", desc: "Margin separating distinct promo sections and shelf banners" },
    { token: "{spacing.section}", value: "48px", desc: "Generous vertical separation between primary page modules" },
  ];

  const roundedTokens = [
    { token: "{rounded.none}", value: "0px", desc: "Square cards and full-bleed dividers" },
    { token: "{rounded.sm}", value: "4px", desc: "Badges, steppers, and discount pill tags" },
    { token: "{rounded.md}", value: "6px", desc: "Primary action buttons ('Add to Cart')" },
    { token: "{rounded.lg}", value: "10px", desc: "Standard product cards and category tiles" },
    { token: "{rounded.xl}", value: "12px", desc: "Promo banners and highlight modal cards" },
    { token: "{rounded.full}", value: "9999px", desc: "Pill buttons ('Shop Now') and circular badges" },
  ];

  const rawYamlFrontmatter = `---
version: alpha
name: Farmart
description: A fresh, organic, and cheerful grocery market canvas where honey yellow (#FAB528) drives primary action and conversion moments, paired with organic greens (#2B5F3F) and high-contrast slate ink (#0F172A). Clean white cards float on a light canvas with hairline borders, generous touch targets (≥44px), and centered responsive layouts.

colors:
  primary: "#FAB528"
  primary-hover: "#E5A420"
  primary-light: "#FFF8EB"
  accent-orange: "#F25C05"
  accent-orange-light: "#FFF0EB"
  deal-red: "#DC2626"
  organic-green: "#2B5F3F"
  fresh-emerald: "#10B981"
  sky-blue: "#0284C7"
  ink: "#0F172A"
  body: "#1E293B"
  muted: "#64748B"
  subtle: "#94A3B8"
  canvas: "#F8FAFC"
  surface-card: "#FFFFFF"
  surface-cream: "#FBF7ED"
  hairline: "#E2E8F0"
  hairline-light: "#F1F5F9"
  on-primary: "#000000"
  on-accent: "#FFFFFF"
  pastel-purple: "#EBE7F7"
  pastel-beige: "#F4EEE2"
  pastel-blue: "#E3EBF3"
  pastel-green: "#E4EFE7"

typography:
  display-lg:
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.5px
  display-md:
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: -0.25px
  card-title:
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: 0px
  body-md:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-sm:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  button:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0px
  price-current:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: 0px
  price-old:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0px
  label-caps:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 1px

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 10px
  xl: 12px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  section: 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-pill:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
  card-product:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  badge-discount:
    backgroundColor: "{colors.deal-red}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: "3px 6px"
  badge-organic:
    backgroundColor: "{colors.organic-green}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: "3px 6px"
  stepper-control:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    rounded: "{rounded.sm}"
    padding: "3px 6px"
  dialog-modal:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    rounded: "{rounded.xl}"
    padding: "24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  category-icon-primary:
    backgroundColor: "{colors.primary-light}"
    rounded: "{rounded.full}"
    size: "44px"
  category-icon-accent:
    backgroundColor: "{colors.accent-orange}"
    rounded: "{rounded.full}"
    size: "44px"
  category-icon-accent-light:
    backgroundColor: "{colors.accent-orange-light}"
    rounded: "{rounded.full}"
    size: "44px"
  status-in-stock:
    backgroundColor: "{colors.fresh-emerald}"
    rounded: "{rounded.full}"
    size: "8px"
  category-icon-cold:
    backgroundColor: "{colors.sky-blue}"
    rounded: "{rounded.full}"
    size: "44px"
  text-muted:
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  price-old-display:
    textColor: "{colors.subtle}"
    typography: "{typography.price-old}"
  page-canvas:
    backgroundColor: "{colors.canvas}"
  card-membership:
    backgroundColor: "{colors.surface-cream}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  divider:
    backgroundColor: "{colors.hairline}"
    height: "1px"
  divider-light:
    backgroundColor: "{colors.hairline-light}"
    height: "1px"
  card-brand-purple:
    backgroundColor: "{colors.pastel-purple}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-brand-beige:
    backgroundColor: "{colors.pastel-beige}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-brand-blue:
    backgroundColor: "{colors.pastel-blue}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-brand-green:
    backgroundColor: "{colors.pastel-green}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
---`;

  const canonicalSections = [
    { id: "overview", label: "1. Overview & Voice" },
    { id: "colors", label: "2. Colors" },
    { id: "typography", label: "3. Typography" },
    { id: "layout", label: "4. Layout & Spacing" },
    { id: "elevation", label: "5. Elevation" },
    { id: "components", label: "6. Components" },
    { id: "responsive", label: "7. Responsive Behavior" },
    { id: "known-gaps", label: "8. Known Gaps & Rules" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col items-center">
      {/* Top Banner Header */}
      <header className="w-full bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-95">
        <div className="container flex items-center justify-between py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FAB528] rounded-lg flex items-center justify-center text-slate-950 font-black text-xl shadow-xs">
              F
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">Farmart Design System</span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider">
                  getdesign.md alpha spec
                </span>
              </div>
              <p className="text-xs text-slate-400">Official Interactive Showcase for DESIGN.md</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowYamlModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold px-3 py-2 rounded-md transition-all flex items-center gap-1.5"
            >
              <span>{`{ }`} View YAML Tokens</span>
            </button>
            <Link
              href="/"
              className="bg-[#FAB528] hover:bg-[#E5A420] text-slate-950 text-xs font-bold px-3.5 py-2 rounded-md transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>← Back to Storefront</span>
            </Link>
          </div>
        </div>

        {/* Canonical Sections Navigation Bar */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto scrollbar-none">
          <div className="container flex items-center gap-1 py-1.5 text-xs font-medium">
            {canonicalSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-1 text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 rounded-md whitespace-nowrap transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="container py-10 flex flex-col gap-14">

        {/* 1. OVERVIEW */}
        <section id="overview" className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Canonical Spec Section 01</span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">## Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">Atmosphere Statement &amp; Brand Voice in plain English</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                Fresh &amp; Organic
              </span>
              <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                Warm &amp; Cheerful
              </span>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200">
                WCAG AAA Touch
              </span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed mb-6 space-y-3">
            <p>
              Farmart embodies a fresh, organic, trustworthy, and cheerful modern grocery market. The aesthetic bridges the approachable friendliness of an artisan farmers&apos; market with the frictionless checkout and high-density product discovery of a premier online store.
            </p>
            <p>
              The canvas defaults to a soft off-white <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{`{colors.canvas}`} (#F8FAFC)</code> supporting pure white card plates <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{`{colors.surface-card}`} (#FFFFFF)</code>. Primary visual energy is carried exclusively by honey/golden yellow <code className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{`{colors.primary}`} (#FAB528)</code> on high-intent CTAs and star ratings, while organic green <code className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{`{colors.organic-green}`} (#2B5F3F)</code> and fresh emerald <code className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-mono text-xs font-bold">{`{colors.fresh-emerald}`} (#10B981)</code> authenticate organic produce and stock status.
            </p>
          </div>

          {/* Key Characteristics Cards */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Key Characteristics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-sm mb-2.5">
                  ★
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Single Conversion Accent</h4>
                <p className="text-[11px] text-slate-600 leading-snug">
                  <code>{`{colors.primary}`}</code> (#FAB528) carries every primary CTA, cart badge, and star rating. Never diluted on body text.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-2.5">
                  🌿
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Authentic Organic Cues</h4>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Lush green accents (#2B5F3F &amp; #10B981) communicate farm freshness, sustainability, and verified stock availability.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/50">
                <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-bold flex items-center justify-center text-sm mb-2.5">
                  ↔
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Symmetrical Centered Shell</h4>
                <p className="text-[11px] text-slate-600 leading-snug">
                  All primary containers stop at <code>max-width: 1240px; margin: 0 auto;</code> ensuring balanced symmetrical gutters on all viewports.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200/80 bg-purple-50/50">
                <div className="w-8 h-8 rounded-lg bg-purple-500 text-white font-bold flex items-center justify-center text-sm mb-2.5">
                  📱
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1">Touch-First Accessibility</h4>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Every tap hitbox (steppers, filter tabs, navigation pills) strictly satisfies ≥ 44×44px hitboxes for iPhone usability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. COLORS */}
        <section id="colors" className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Canonical Spec Section 02</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">## Colors</h2>
            <p className="text-xs text-slate-500 mt-1">Named semantic tokens from the YAML block with rationale. Click any card to copy token or hex.</p>
          </div>

          <div className="space-y-8">
            {/* Brand & Accent */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> ### Brand &amp; Accent Tokens
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {brandAccentColors.map((c) => (
                  <div
                    key={c.hex}
                    onClick={() => copyToClipboard(c.token, c.name)}
                    className="group border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white"
                  >
                    <div
                      className="h-16 w-full flex items-end p-2.5 transition-transform group-hover:scale-102"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs ${c.textLight ? "bg-black/40 text-white" : "bg-white/90 text-slate-900"}`}>
                        {copiedToken === c.token ? "COPIED! ✓" : c.hex}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-xs text-slate-900">{c.name}</div>
                      <div className="text-[10px] font-mono text-amber-700 font-semibold mb-1">{c.token}</div>
                      <div className="text-[11px] text-slate-500 leading-tight">{c.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Surface & Canvas / Hairlines / Text */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span> ### Surface, Canvas, Hairline &amp; Text Tokens
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {surfaceNeutralColors.map((c) => (
                  <div
                    key={c.name}
                    onClick={() => copyToClipboard(c.token, c.name)}
                    className="group border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white"
                  >
                    <div
                      className="h-16 w-full flex items-end p-2.5 border-b border-slate-100"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs ${c.textLight ? "bg-white/90 text-slate-900" : "bg-black/50 text-white"}`}>
                        {copiedToken === c.token ? "COPIED! ✓" : c.hex}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-xs text-slate-900">{c.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 font-semibold mb-1">{c.token}</div>
                      <div className="text-[11px] text-slate-500 leading-tight">{c.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Brand Pastel Card Tints */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span> ### Featured Brand Pastel Cards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                {brandPastels.map((b) => (
                  <div
                    key={b.hex}
                    onClick={() => copyToClipboard(b.token, b.name)}
                    className="p-4 rounded-xl border border-slate-200/80 cursor-pointer hover:shadow-sm transition-all"
                    style={{ backgroundColor: b.hex }}
                  >
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{b.brand}</span>
                    <h4 className="font-extrabold text-sm text-slate-900 mb-0.5">{b.name}</h4>
                    <div className="text-[10px] font-mono text-slate-700 font-semibold mb-1.5">{b.token}</div>
                    <p className="text-xs text-slate-700 mb-2">{b.desc}</p>
                    <span className="text-[10px] font-mono font-bold bg-white/70 px-1.5 py-0.5 rounded text-slate-800">
                      {b.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. TYPOGRAPHY */}
        <section id="typography" className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Canonical Spec Section 03</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">## Typography</h2>
            <p className="text-xs text-slate-500 mt-1">Font family hierarchy, semantic role styles, and tabular numeric alignment.</p>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                <b className="text-slate-900 font-bold">Font Families:</b> Headings use <code>&apos;Plus Jakarta Sans&apos;</code> (display weights 700–800); Body &amp; Controls use <code>&apos;Inter&apos;</code> (weights 400–700).
              </div>
              <div className="bg-white border px-2.5 py-1 rounded font-mono text-[11px] text-amber-800">
                font-variant-numeric: tabular-nums;
              </div>
            </div>

            {/* Type Scale Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {typographyTokens.map((t) => (
                <div
                  key={t.token}
                  onClick={() => copyToClipboard(t.token, t.token)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <div className="sm:w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">{t.token}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{t.weight} weight</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mt-1">{t.size} / LH {t.lh} / LS {t.ls}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.role}</p>
                  </div>
                  <div className="sm:w-2/3">
                    <div
                      style={{
                        fontSize: t.size,
                        fontWeight: Number(t.weight),
                        lineHeight: Number(t.lh),
                        letterSpacing: t.ls,
                        fontVariantNumeric: "tabular-nums",
                      }}
                      className="text-slate-950 truncate"
                    >
                      {t.sample}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LAYOUT & SPACING */}
        <section id="layout" className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Canonical Spec Section 04</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">## Layout</h2>
            <p className="text-xs text-slate-500 mt-1">8-point baseline spacing scale, corner radii tokens, and centered 1240px container geometry.</p>
          </div>

          <div className="space-y-6">
            {/* Spacing Tokens */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">### Spacing Scale</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {spacingTokens.map((s) => (
                  <div
                    key={s.token}
                    onClick={() => copyToClipboard(s.token, s.token)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center cursor-pointer hover:border-amber-300 transition-colors"
                  >
                    <div className="bg-[#FAB528] rounded-xs mb-2" style={{ width: s.value, height: "18px" }}></div>
                    <span className="font-mono font-bold text-xs text-slate-900">{s.value}</span>
                    <span className="text-[10px] text-amber-700 font-mono font-semibold">{s.token}</span>
                    <span className="text-[10px] text-slate-400 text-center leading-tight mt-1">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rounded Corner Tokens */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">### Corner Radii Scale (rounded:)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {roundedTokens.map((r) => (
                  <div
                    key={r.token}
                    onClick={() => copyToClipboard(r.token, r.token)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center cursor-pointer hover:border-amber-300 transition-colors"
                  >
                    <div
                      className="w-12 h-12 bg-white border-2 border-amber-400 mb-2 flex items-center justify-center"
                      style={{ borderRadius: r.value }}
                    >
                      <span className="text-[9px] font-mono text-slate-600 font-bold">{r.value}</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-mono font-semibold">{r.token}</span>
                    <span className="text-[10px] text-slate-400 text-center leading-tight mt-1">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Centered Canvas Container Spec */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <b className="text-amber-950 font-bold">Global Container Constraint:</b> All primary viewports wrap in <code>.container</code> with <code>max-width: 1240px; margin: 0 auto;</code> to guarantee balanced centered margins on large screens.
              </div>
              <code className="bg-white border border-amber-300 px-2 py-1 rounded text-amber-800 font-mono font-semibold">
                max-width: 1240px
              </code>
            </div>
          </div>
        </section>

        {/* 5. ELEVATION */}
        <section id="elevation" className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Canonical Spec Section 05</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">## Elevation</h2>
            <p className="text-xs text-slate-500 mt-1">Crisp hairline borders and directional lifts rather than heavy muddy drop shadows.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="border border-slate-200 rounded-xl p-5 bg-white text-center flex flex-col items-center justify-center min-h-[150px]">
              <span className="text-xs font-bold text-slate-900 mb-1">Tier 0: Flat Surface</span>
              <span className="text-[11px] font-mono text-slate-400 mb-2">No shadow</span>
              <p className="text-[11px] text-slate-500">Used on canvas <code>{`{colors.canvas}`}</code> and static background sections</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-white text-center flex flex-col items-center justify-center min-h-[150px] shadow-xs">
              <span className="text-xs font-bold text-slate-900 mb-1">Tier 1: Card Resting</span>
              <span className="text-[11px] font-mono text-slate-400 mb-2">0 1px 3px rgba(0,0,0,0.04)</span>
              <p className="text-[11px] text-slate-500">Provides subtle physical presence for default product cards</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-white text-center flex flex-col items-center justify-center min-h-[150px] shadow-md hover:-translate-y-1 transition-transform cursor-pointer">
              <span className="text-xs font-bold text-slate-900 mb-1">Tier 2: Card Hover (Active)</span>
              <span className="text-[11px] font-mono text-amber-700 mb-2">0 8px 20px -4px rgba(0,0,0,0.08)</span>
              <p className="text-[11px] text-slate-500">Interactive card lift <code>translateY(-3px)</code> to indicate clickability</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 bg-white text-center flex flex-col items-center justify-center min-h-[150px] shadow-lg">
              <span className="text-xs font-bold text-slate-900 mb-1">Tier 3: Floating Overlay</span>
              <span className="text-[11px] font-mono text-slate-400 mb-2">0 12px 28px -6px rgba(0,0,0,0.14)</span>
              <p className="text-[11px] text-slate-500">Search dropdowns, floating cart toast notifications, modal dialogs</p>
            </div>
          </div>
        </section>

        {/* 6. COMPONENTS */}
        <section id="components" className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Canonical Spec Section 06</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">## Components</h2>
            <p className="text-xs text-slate-500 mt-1">Live specimens for all 7 components declared in the YAML components: block (including Dialog Modal).</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Component Specs 1 & 2: button-primary & button-pill */}
            <div className="border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-mono font-bold text-xs text-slate-900">**button-primary** &amp; **button-pill**</h3>
                <span className="text-[10px] text-slate-400 font-mono">YAML Spec 1:1</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="btn-add-cart w-auto px-5 py-2.5"
                  onClick={() => triggerToast("button-primary Clicked!")}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  button-primary (Add to Cart)
                </button>

                <button
                  className="btn-shop-now"
                  onClick={() => triggerToast("button-pill Clicked!")}
                >
                  button-pill (Shop Now →)
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border">
                <code>bg: {`{colors.primary}`} | text: {`{colors.on-primary}`} | rounded: {`{rounded.md}`} | padding: 8px 16px</code>
              </div>

              {/* Component Spec 6: stepper-control */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-mono font-bold text-xs text-slate-900">**stepper-control**</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Quantity Adjuster</span>
                </div>
                <div className="qty-stepper-row w-64">
                  <div className="stepper">
                    <button className="stepper-btn" onClick={() => setStepperVal((v) => Math.max(1, v - 1))}>-</button>
                    <span className="stepper-value font-bold text-xs">{stepperVal}</span>
                    <button className="stepper-btn" onClick={() => setStepperVal((v) => v + 1)}>+</button>
                  </div>
                  <span className="stepper-total text-xs">Total: <b className="text-slate-900">${(stepperVal * 45).toFixed(2)}</b></span>
                </div>
              </div>

              {/* Component Specs 4 & 5: badge-discount & badge-organic */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-mono font-bold text-xs text-slate-900">**badge-discount** &amp; **badge-organic**</h4>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">-24% DISCOUNT</span>
                  <span className="bg-[#2B5F3F] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">100% ORGANIC</span>
                  <span className="bg-[#FAB528] text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded font-mono">FEATURED</span>
                  <span className="countdown-timer-pill text-[10px]">08 : 25 : 37</span>
                </div>
              </div>
            </div>

            {/* Component Spec 3: card-product (Live Card Preview) */}
            <div className="border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-mono font-bold text-xs text-slate-900">**card-product** (Live Specimen)</h3>
                <span className="text-[10px] text-slate-400 font-mono">Tier 2 Elevation (Spec 1:1)</span>
              </div>

              <div className="max-w-xs mx-auto w-full">
                <ProductCard
                  product={{
                    id: "demo-specimen",
                    name: "British Beef Mince (Typically 20% Fat) 500g",
                    brand: "Farmart Direct",
                    category: "Raw Meats",
                    price: 38.5,
                    oldPrice: 47.0,
                    discountPercent: 18,
                    isOrganic: true,
                    rating: 5,
                    reviewCount: 14,
                    stockProgress: 65,
                    soldText: "Sold: 26/40 units",
                    imageSvg: (
                      <svg width="110" height="120" viewBox="0 0 130 140" fill="none">
                        <rect x="25" y="20" width="80" height="100" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                        <rect x="25" y="45" width="80" height="60" fill="#DC2626" rx="4" />
                        <circle cx="65" cy="75" r="18" fill="#FFFFFF" />
                        <text x="65" y="82" fontSize="22" textAnchor="middle">🥩</text>
                        <text x="65" y="115" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="8" fill="#334155" textAnchor="middle">PRIME CUT</text>
                      </svg>
                    ),
                  }}
                  isWishlisted={isWishlisted}
                  showProgress={true}
                  onAddToCart={(p) => triggerToast(`Added ${p.name} to Cart!`)}
                  onToggleWishlist={(id, w) => {
                    setIsWishlisted(w);
                    triggerToast(w ? "Added to Wishlist!" : "Removed from Wishlist");
                  }}
                />
              </div>

              <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border">
                <code>bg: &#123;colors.surface-card&#125; | border: 1px hairline | rounded: &#123;rounded.lg&#125; (10px) | padding: 16px | Tier 2 hover</code>
              </div>
            </div>
          </div>

          {/* Interactive Category Selector Specimen */}
          <div className="mt-8 border border-slate-200 rounded-xl p-5">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-4">
              Category Tabs &amp; Card Interaction (Active Accent Glow)
            </h3>
            <div className="category-grid">
              {["Fruits & Vegetables", "Breads & Sweets", "Frozen Seafoods", "Raw Meats"].map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    setActiveTab(cat);
                    triggerToast(`Active Category: ${cat}`);
                  }}
                  className={`category-card ${activeTab === cat ? "active" : ""}`}
                >
                  <div className="category-icon-box">
                    <span className="text-xl">{cat.includes("Fruit") ? "🍎" : cat.includes("Bread") ? "🥐" : cat.includes("Seafood") ? "🦀" : "🥩"}</span>
                  </div>
                  <span className="category-name">{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Component Spec 7: dialog-modal */}
          <div className="mt-8 border border-slate-200 rounded-xl p-6 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-6 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono font-bold text-sm text-slate-900">**dialog-modal**</h3>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                    Tier 3 Elevation (Spec 1:1)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accessible floating modal dialog with backdrop blur, Tier 3 elevation, keyboard escape handling, and ≥44px touch targets.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">src/components/Dialog.tsx</span>
              </div>
            </div>

            {/* Token Mapping Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-6 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Surface</span>
                <span className="font-mono font-semibold text-slate-800">{"{colors.surface-card}"}</span>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block"></span> #FFFFFF
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Border</span>
                <span className="font-mono font-semibold text-slate-800">1px hairline</span>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#E2E8F0] inline-block"></span> #E2E8F0
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Elevation</span>
                <span className="font-mono font-semibold text-slate-800">Tier 3 Overlay</span>
                <div className="text-[11px] text-slate-500 mt-0.5">0 12px 28px -6px</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Radius</span>
                <span className="font-mono font-semibold text-slate-800">{"{rounded.xl}"}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">12px rounded</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Padding</span>
                <span className="font-mono font-semibold text-slate-800">{"{spacing.lg}"}</span>
                <div className="text-[11px] text-slate-500 mt-0.5">24px inner gutter</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Backdrop</span>
                <span className="font-mono font-semibold text-slate-800">Slate 900 / 45%</span>
                <div className="text-[11px] text-slate-500 mt-0.5">blur(2px) overlay</div>
              </div>
            </div>

            {/* Interactive Live Demonstrations & Static Anatomy */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Trigger Buttons */}
              <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
                    Test Interactive Triggers
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Click any trigger button below to test live Dialog instances with WAI-ARIA focus management, Esc key dismiss, and backdrop tap support.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveDialog("confirm")}
                      className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                          🗑
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                            1. Confirmation Dialog
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Destructive / Confirm action with alert description
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-600">Open →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveDialog("quickview")}
                      className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                          🥩
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                            2. Product Quick View Dialog
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Rich modal with price, stepper, organic badge &amp; CTA
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-600">Open →</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveDialog("promo")}
                      className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                          🎁
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                            3. Membership Promo Dialog
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Welcome 15% voucher registration and coupon claim
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-600">Open →</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>WAI-ARIA Dialog 1.2</span>
                  <span>Esc &amp; Backdrop dismiss: Active</span>
                </div>
              </div>

              {/* Right Column: In-page Visual Specimen Anatomy */}
              <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Dialog Anatomy Specimen
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Preview (In-Page)</span>
                </div>

                {/* Simulated Dialog Frame */}
                <div className="rounded-[12px] border border-[#E2E8F0] shadow-[0_12px_28px_-6px_rgba(0,0,0,0.14)] bg-white overflow-hidden">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#0F172A]">Dialog Header &amp; Title</span>
                        <span className="text-[9px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded">
                          {"{typography.card-title}"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Supporting dialog description text ({`{typography.body-sm}`})
                      </p>
                    </div>
                    <div className="w-[36px] h-[36px] rounded-lg bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center text-xs">
                      ✕
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="px-5 py-4 text-xs text-[#1E293B] space-y-2.5 bg-slate-50/20">
                    <p>
                      The dialog body takes child components, form inputs, or grocery item summaries. It uses standard padding <code>{"{spacing.lg}"} (24px)</code> and neutral typography.
                    </p>
                    <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                      <span className="font-bold">💡 Farmart Token Spec:</span>
                      <span>Elevates with Tier 3 shadow to pop above product shelves and hero banners cleanly.</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC]/50 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-[6px] border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                      onClick={() => triggerToast("Cancel clicked in preview specimen")}
                    >
                      Secondary (Cancel)
                    </button>
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-[6px] bg-[#FAB528] hover:bg-[#E5A420] text-xs font-bold text-black transition-colors"
                      onClick={() => triggerToast("Primary action clicked in preview specimen")}
                    >
                      Primary Action (Confirm)
                    </button>
                  </div>
                </div>

                {/* Code Snippet */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <code className="text-[11px] font-mono text-slate-500 truncate max-w-[320px]">
                    {"<Dialog isOpen={isOpen} onClose={...} title=\"...\" />"}
                  </code>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `import { Dialog } from "@/components/Dialog";\n\n<Dialog\n  isOpen={isOpen}\n  onClose={() => setIsOpen(false)}\n  title="Dialog Title"\n  description="Dialog description text"\n  footer={\n    <>\n      <button onClick={() => setIsOpen(false)}>Cancel</button>\n      <button className="btn-primary">Confirm</button>\n    </>\n  }\n>\n  <p>Dialog body content goes here</p>\n</Dialog>`,
                        "Dialog Component Code"
                      )
                    }
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Copy Snippet 📋
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. RESPONSIVE BEHAVIOR */}
        <section id="responsive" className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Canonical Spec Section 07</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">## Responsive Behavior</h2>
            <p className="text-xs text-slate-500 mt-1">Multi-device breakpoint table, touch targets (≥44px), and iPhone collapsing strategy.</p>
          </div>

          {/* Breakpoint Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Breakpoint Name</th>
                  <th className="p-3">Screen Width</th>
                  <th className="p-3">Layout &amp; UI Adaptations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="bg-amber-50/40 font-medium">
                  <td className="p-3 font-bold text-amber-900">Mobile (iPhone)</td>
                  <td className="p-3 font-mono text-amber-800">&lt; 640px</td>
                  <td className="p-3">2-column product grid; search input full width; sticky header with cart badge; hero banner text scales to 20px; category shelf scrolls horizontally.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">Tablet</td>
                  <td className="p-3 font-mono text-slate-500">640px – 1023px</td>
                  <td className="p-3">3-column product grid; 2-column promotional hero cards; search bar centered at 500px width.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">Desktop</td>
                  <td className="p-3 font-mono text-slate-500">1024px – 1279px</td>
                  <td className="p-3">5-column product grid; full category navigation bar; visible countdown timers.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-800">Wide Desktop</td>
                  <td className="p-3 font-mono text-slate-500">≥ 1280px</td>
                  <td className="p-3">Content strictly capped at 1240px; centered with balanced gutters; 5-to-6 product columns.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Touch Targets & Collapsing Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">### Touch Targets (WCAG AAA)</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>• Primary CTAs &amp; buttons meet or exceed <b>44 × 44px</b> hitboxes.</li>
                <li>• Quantity steppers provide ample tap areas to prevent erroneous inputs on iPhone.</li>
                <li>• Category horizontal pills feature <b>44px</b> height with 16px lateral padding.</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">### Collapsing Strategy</h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>• Top utility row items hide below 1024px; search input occupies 100% width on mobile.</li>
                <li>• Product grid drops column count cleanly (<code>5 → 4 → 3 → 2</code>) without row reflow.</li>
                <li>• Hero banner stacks vertically below 768px, keeping CTAs and copy centered.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8. KNOWN GAPS & GUARDRAILS */}
        <section id="known-gaps" className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Canonical Spec Section 08</span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">## Known Gaps &amp; AI Guardrails</h2>
            <p className="text-xs text-slate-500 mt-1">Stated boundaries from DESIGN.md and strict rules for AI pair programming.</p>
          </div>

          {/* Known Gaps List */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">### Stated Known Gaps</h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li>• <b>Dark Mode:</b> Farmart renders exclusively in light/warm canvas mode (<code>#F8FAFC</code>). Dark mode is intentionally out of scope to preserve fresh grocery market ambiance.</li>
              <li>• <b>Complex Animation Curves:</b> Third-party physics spring animations are omitted in favor of simple native CSS transitions (<code>all 0.2s ease</code>).</li>
              <li>• <b>Multi-step Checkout Accordion:</b> Checkout flows and payment gateway modals are maintained in downstream application files.</li>
            </ul>
          </div>

          {/* DO's and DON'Ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm uppercase tracking-wide">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                DO (Mandatory Practices)
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><b>Always center containers:</b> Wrap sections in <code>.container</code> with <code>max-width: 1240px; margin: 0 auto;</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><b>Use tabular figures for prices:</b> Apply <code>tabular-nums</code> so prices and countdown timers never jitter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><b>Swipeable touch scrolling:</b> Ensure categories swipe smoothly on mobile via <code>overflow-x: auto</code>.</span>
                </li>
              </ul>
            </div>

            <div className="border border-rose-200 bg-rose-50/40 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm uppercase tracking-wide">
                <span className="w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs">✕</span>
                DON&apos;T (Strict Anti-Patterns)
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><b>Don&apos;t allow horizontal overflow:</b> Never permit unconstrained wide elements that break iPhone viewport width.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><b>Don&apos;t invent unapproved colors:</b> Stick strictly to Farmart tokens (`#FAB528`, `#2B5F3F`, `#DC2626`).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span><b>Don&apos;t modify AGENTS.md rules:</b> Always preserve existing project instructions and user rules at line 1.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* AI Coding Assistant Prompt Templates */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Ready-to-Use Agent Prompt Templates
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 rounded-xl text-slate-100 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2">
                  <span>Prompt: Adding a New Shelf Section</span>
                  <button
                    className="hover:text-amber-300 transition-colors"
                    onClick={() => copyToClipboard(`"Create a new shelf section in src/app/page.tsx called '[Shelf Name]' strictly following DESIGN.md. Wrap it in a centered .container with .section-header. Use the 5-column product shelf pattern for desktop and 2-column on mobile. Ensure all buttons use var(--primary-yellow) styling and match existing typography."`, "Prompt")}
                  >
                    Copy Prompt 📋
                  </button>
                </div>
                <p className="text-amber-300">
                  &quot;Create a new shelf section in src/app/page.tsx called &apos;[Shelf Name]&apos; strictly following DESIGN.md. Wrap it in a centered .container with .section-header. Use the 5-column product shelf pattern for desktop and 2-column on mobile. Ensure all buttons use var(--primary-yellow) styling and match existing typography.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* YAML Spec Modal */}
      {showYamlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="font-mono text-amber-400 font-bold text-sm">DESIGN.md YAML Front Matter</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Google alpha spec</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(rawYamlFrontmatter, "Full YAML Front Matter")}
                  className="text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-md transition-colors"
                >
                  Copy YAML 📋
                </button>
                <button
                  onClick={() => setShowYamlModal(false)}
                  className="text-slate-400 hover:text-white p-1 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto font-mono text-[11px] text-slate-300 bg-slate-950 leading-relaxed">
              <pre>{rawYamlFrontmatter}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Specimen 1: Confirmation Dialog */}
      <Dialog
        isOpen={activeDialog === "confirm"}
        onClose={() => setActiveDialog(null)}
        title="Empty Shopping Cart?"
        description="Are you sure you want to remove all 3 items from your cart? This action cannot be undone."
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setActiveDialog(null)}
              className="px-4 py-2 rounded-[6px] border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Keep Items
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveDialog(null);
                triggerToast("Shopping cart cleared!");
              }}
              className="px-4 py-2 rounded-[6px] bg-[#DC2626] hover:bg-[#b91c1c] text-xs font-bold text-white transition-colors"
            >
              Yes, Empty Cart
            </button>
          </>
        }
      >
        <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <span className="text-rose-600 font-bold">⚠️</span>
          <span>Your current items will lose their locked promotional discounts if removed.</span>
        </div>
      </Dialog>

      {/* Interactive Specimen 2: Product Quick View Dialog */}
      <Dialog
        isOpen={activeDialog === "quickview"}
        onClose={() => setActiveDialog(null)}
        title="British Beef Mince (Typically 20% Fat) 500g"
        description="Fresh pasture-raised organic butcher cut • SKU: FM-98214"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setActiveDialog(null)}
              className="px-4 py-2 rounded-[6px] border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Continue Browsing
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveDialog(null);
                triggerToast(`Added ${quickViewQty} x British Beef Mince to cart!`);
              }}
              className="btn-add-cart w-auto px-5 py-2 text-xs"
            >
              Add To Cart (${(quickViewQty * 38.5).toFixed(2)})
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-24 h-24 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-4xl shadow-xs shrink-0">
              🥩
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#2B5F3F] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">100% ORGANIC</span>
                <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">-18% OFF</span>
                <span className="text-emerald-600 text-[11px] font-bold">● In Stock</span>
              </div>
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-extrabold text-slate-900">$38.50</span>
                <span className="text-xs text-slate-400 line-through">$47.00</span>
                <span className="text-xs text-slate-500">/ 500g pack</span>
              </div>
              <p className="text-xs text-slate-500">
                100% grass-fed British beef mince. Perfect for bolognese, homemade burgers, and cottage pies.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Adjust Quantity:</span>
            <div className="qty-stepper-row w-48 justify-end">
              <div className="stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuickViewQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="stepper-value font-bold text-xs">{quickViewQty}</span>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuickViewQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Interactive Specimen 3: Membership Promo Dialog */}
      <Dialog
        isOpen={activeDialog === "promo"}
        onClose={() => setActiveDialog(null)}
        title="Join Farmart Club & Get 15% Off!"
        description="Exclusive perks, free 2-hour express delivery, and weekly organic farm box discounts."
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setActiveDialog(null)}
              className="px-4 py-2 rounded-[6px] border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveDialog(null);
                triggerToast("Welcome to Farmart Club! Promo code FARMART15 applied.");
              }}
              className="px-5 py-2 rounded-[6px] bg-[#FAB528] hover:bg-[#E5A420] text-xs font-bold text-black transition-colors"
            >
              Claim 15% Voucher 🎁
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300 rounded-xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FAB528] flex items-center justify-center text-2xl shadow-sm shrink-0">
              🌾
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Your Welcome Voucher: <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-amber-700">FARMART15</code></div>
              <div className="text-[11px] text-slate-600 mt-0.5">Valid on all fresh organic produce and dairy items for 30 days.</div>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Enter your email for instant membership:</label>
            <input
              type="email"
              placeholder="e.g. shopper@farmart.example"
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FAB528]"
              defaultValue="shopper@farmart.example"
            />
          </div>
        </div>
      </Dialog>

      {/* Floating Toast Notification */}
      <div className={`cart-toast ${showToast ? "show" : ""}`}>
        <span className="toast-icon">✓</span>
        <span>{toastMsg}</span>
      </div>
    </div>
  );
}
