import React from "react";

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface NutritionItem {
  name: string;
  amount: string;
  dailyValue?: string;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  unit: string;
  discountPercent?: number;
  isOrganic?: boolean;
  rating: number;
  reviewCount: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  stockCount: number;
  sku: string;
  barcode: string;
  shortDescription: string;
  fullDescription: string[];
  highlights: string[];
  nutritionFacts: NutritionItem[];
  originInfo: {
    farmName: string;
    location: string;
    harvestDate: string;
    storageTemp: string;
    shelfLife: string;
  };
  gallery: {
    id: string;
    label: string;
    svgNode: React.ReactNode;
    highResSvg?: React.ReactNode;
  }[];
  reviews: ReviewItem[];
  relatedIds: string[];
}

export const PRODUCTS: ProductDetail[] = [
  {
    id: "1",
    slug: "organic-hass-avocado",
    name: "Fresh Organic Hass Avocado (Pack of 4)",
    brand: "Farmart Organic Direct",
    category: "Fruits & Vegetables",
    categorySlug: "fruits-vegetables",
    price: 6.49,
    oldPrice: 8.99,
    unit: "4 pcs (~650g)",
    discountPercent: 28,
    isOrganic: true,
    rating: 4.9,
    reviewCount: 128,
    stockStatus: "in_stock",
    stockCount: 84,
    sku: "FM-ORG-AVO-04",
    barcode: "8859123400192",
    shortDescription:
      "Hand-picked buttery Hass avocados cultivated on certified regenerative organic orchards. Perfect for fresh guacamole, morning sourdough toast, or crisp garden salads.",
    fullDescription: [
      "Our Fresh Organic Hass Avocados are nurtured under temperate sun drenched orchards without any synthetic pesticides, petroleum fertilizers, or GMO seeds. Each fruit is hand harvested at peak maturity to ensure an exceptionally rich, creamy, and nutty flavor profile with uniform ripening in your kitchen.",
      "Avocados are known as nature's superfood, loaded with heart-healthy monounsaturated oleic acid, fiber, and potassium (more per serving than bananas!). Every avocado in this 4-pack undergoes laser sorting to guarantee zero bruising and consistent density.",
      "Delivered in our eco-friendly 100% biodegradable unbleached carton that cushions each fruit during transit."
    ],
    highlights: [
      "100% Certified Organic (USDA & Bio-Organic)",
      "Zero Synthetic Chemical Sprays or Waxes",
      "Picked within 36 hours of your delivery",
      "High in Potassium, Folate & Vitamins E, K, B6",
      "Ready to eat within 2-3 days at room temperature"
    ],
    nutritionFacts: [
      { name: "Serving Size", amount: "1/2 Avocado (80g)" },
      { name: "Calories", amount: "130 kcal", dailyValue: "7%" },
      { name: "Total Fat", amount: "12g", dailyValue: "15%" },
      { name: "Saturated Fat", amount: "1.5g", dailyValue: "8%" },
      { name: "Monounsaturated Fat", amount: "8g" },
      { name: "Sodium", amount: "5mg", dailyValue: "0%" },
      { name: "Total Carbohydrate", amount: "6g", dailyValue: "2%" },
      { name: "Dietary Fiber", amount: "5g", dailyValue: "18%" },
      { name: "Sugars", amount: "0.2g" },
      { name: "Protein", amount: "1.5g", dailyValue: "3%" },
      { name: "Potassium", amount: "400mg", dailyValue: "9%" }
    ],
    originInfo: {
      farmName: "Green Valley Regenerative Cooperative",
      location: "Chiang Mai Highlands, Thailand",
      harvestDate: "Yesterday morning (06:30 AM)",
      storageTemp: "12°C - 15°C (Cool Pantry)",
      shelfLife: "5 to 7 days from delivery date"
    },
    gallery: [
      {
        id: "front",
        label: "Fresh Whole Fruit",
        svgNode: (
          <svg width="220" height="200" viewBox="0 0 200 200" fill="none">
            {/* Outer skin */}
            <path
              d="M100 25 C65 25 45 70 45 120 C45 165 70 185 100 185 C130 185 155 165 155 120 C155 70 135 25 100 25 Z"
              fill="#223E28"
            />
            {/* Texture bumps */}
            <circle cx="80" cy="65" r="3" fill="#182C1D" opacity="0.6"/>
            <circle cx="115" cy="80" r="4" fill="#182C1D" opacity="0.6"/>
            <circle cx="70" cy="110" r="3.5" fill="#182C1D" opacity="0.6"/>
            <circle cx="120" cy="130" r="4" fill="#182C1D" opacity="0.6"/>
            <circle cx="95" cy="155" r="3" fill="#182C1D" opacity="0.6"/>
            {/* Stem */}
            <rect x="96" y="15" width="8" height="12" rx="3" fill="#5C3D2E"/>
            <path d="M100 15 Q115 5 125 10" stroke="#2B5F3F" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <circle cx="125" cy="10" r="3" fill="#10B981"/>
          </svg>
        ),
        highResSvg: (
          <svg width="320" height="300" viewBox="0 0 200 200" fill="none">
            <path
              d="M100 25 C65 25 45 70 45 120 C45 165 70 185 100 185 C130 185 155 165 155 120 C155 70 135 25 100 25 Z"
              fill="#223E28"
            />
            <circle cx="80" cy="65" r="3" fill="#182C1D" opacity="0.6"/>
            <circle cx="115" cy="80" r="4" fill="#182C1D" opacity="0.6"/>
            <circle cx="70" cy="110" r="3.5" fill="#182C1D" opacity="0.6"/>
            <circle cx="120" cy="130" r="4" fill="#182C1D" opacity="0.6"/>
            <circle cx="95" cy="155" r="3" fill="#182C1D" opacity="0.6"/>
            <rect x="96" y="15" width="8" height="12" rx="3" fill="#5C3D2E"/>
          </svg>
        )
      },
      {
        id: "cross-section",
        label: "Cut Cross-Section",
        svgNode: (
          <svg width="220" height="200" viewBox="0 0 200 200" fill="none">
            {/* Skin */}
            <path
              d="M100 25 C65 25 45 70 45 120 C45 165 70 185 100 185 C130 185 155 165 155 120 C155 70 135 25 100 25 Z"
              fill="#223E28"
            />
            {/* Green flesh rim */}
            <path
              d="M100 30 C68 30 50 72 50 118 C50 160 73 178 100 178 C127 178 150 160 150 118 C150 72 132 30 100 30 Z"
              fill="#84CC16"
            />
            {/* Creamy yellow interior */}
            <path
              d="M100 40 C75 40 60 76 60 116 C60 152 80 168 100 168 C120 168 140 152 140 116 C140 76 125 40 100 40 Z"
              fill="#FEF08A"
            />
            {/* Avocado Pit */}
            <circle cx="100" cy="120" r="28" fill="#78350F" />
            <ellipse cx="106" cy="114" rx="20" ry="18" fill="#92400E" />
            <ellipse cx="112" cy="108" rx="8" ry="6" fill="#B45309" opacity="0.7"/>
          </svg>
        )
      },
      {
        id: "pack",
        label: "Pack of 4 Packaging",
        svgNode: (
          <svg width="220" height="200" viewBox="0 0 200 200" fill="none">
            {/* Tray */}
            <rect x="30" y="50" width="140" height="110" rx="14" fill="#F4EEE2" stroke="#E2E8F0" strokeWidth="3"/>
            <rect x="42" y="60" width="50" height="42" rx="10" fill="#223E28"/>
            <rect x="108" y="60" width="50" height="42" rx="10" fill="#223E28"/>
            <rect x="42" y="108" width="50" height="42" rx="10" fill="#223E28"/>
            <rect x="108" y="108" width="50" height="42" rx="10" fill="#223E28"/>
            <rect x="65" y="85" width="70" height="36" rx="4" fill="#FAB528" />
            <text x="100" y="102" fontSize="9" fontWeight="900" fill="#000000" textAnchor="middle" fontFamily="sans-serif">
              4x ORGANIC
            </text>
            <text x="100" y="113" fontSize="7" fontWeight="bold" fill="#000000" textAnchor="middle" fontFamily="sans-serif">
              FARMART
            </text>
          </svg>
        )
      }
    ],
    reviews: [
      {
        id: "r1",
        author: "Sarah Montgomery",
        rating: 5,
        date: "September 3, 2026",
        title: "Perfection in every bite!",
        comment:
          "Easily the best avocados I've ordered online. Arrived firm with slight give, within two days they were like velvet. No brown spots or stringiness whatsoever!",
        verified: true,
        helpfulCount: 19
      },
      {
        id: "r2",
        author: "David Chen",
        rating: 5,
        date: "August 28, 2026",
        title: "Creamy and delicious guacamole staple",
        comment:
          "My family makes avocado toast almost every morning. These are noticeably creamier and richer than supermarket ones. Farmart delivery was spot on within 2 hours.",
        verified: true,
        helpfulCount: 11
      },
      {
        id: "r3",
        author: "Pornpen S.",
        rating: 4,
        date: "August 21, 2026",
        title: "Very fresh and great packaging",
        comment:
          "The unbleached carton protected them very nicely. 3 of them were ready in 2 days and 1 took 4 days, which was actually ideal for pacing.",
        verified: true,
        helpfulCount: 6
      }
    ],
    relatedIds: ["2", "4", "5"]
  },
  {
    id: "2",
    slug: "raw-green-detox-juice",
    name: "Raw Green Detox Cold-Pressed Juice 500ml",
    brand: "Farmart Botanicals",
    category: "Beverages",
    categorySlug: "beverages",
    price: 18.25,
    oldPrice: 22.50,
    unit: "500ml glass bottle",
    discountPercent: 18,
    isOrganic: true,
    rating: 4.8,
    reviewCount: 42,
    stockStatus: "in_stock",
    stockCount: 35,
    sku: "FM-BOT-DETOX-01",
    barcode: "8859123400208",
    shortDescription:
      "Cold-pressed kale, crisp green apple, English cucumber, celery, fresh ginger, and Meyer lemon. 100% raw and unpasteurized.",
    fullDescription: [
      "Crafted every dawn in our certified hygienic cleanroom using hydraulic cold-press extraction. This process applies over 9 tons of pressure without heat, conserving delicate enzymes, antioxidants, and chlorophyll.",
      "Contains no added sugar, artificial preservatives, or diluting water. Simply 1.2kg of raw organic produce pressed into a 500ml recyclable amber glass bottle."
    ],
    highlights: [
      "100% Cold-Pressed, Raw & Unpasteurized",
      "Over 1.2kg of organic greens in every bottle",
      "No Added Sugar, Water, or Additives",
      "Kept strictly under 4°C cold chain logistics"
    ],
    nutritionFacts: [
      { name: "Serving Size", amount: "1 Bottle (500ml)" },
      { name: "Calories", amount: "140 kcal", dailyValue: "7%" },
      { name: "Total Sugars", amount: "22g (Naturally occurring from apples)" },
      { name: "Vitamin C", amount: "95mg", dailyValue: "105%" },
      { name: "Vitamin K", amount: "180mcg", dailyValue: "150%" },
      { name: "Potassium", amount: "520mg", dailyValue: "11%" }
    ],
    originInfo: {
      farmName: "Mae Rim Botanical Gardens",
      location: "Chiang Mai, Thailand",
      harvestDate: "Pressed 4 hours ago",
      storageTemp: "2°C - 4°C (Refrigerator)",
      shelfLife: "4 days from bottling"
    },
    gallery: [
      {
        id: "front",
        label: "Cold-Pressed Bottle",
        svgNode: (
          <svg width="220" height="200" viewBox="0 0 120 130" fill="none">
            <rect x="25" y="20" width="70" height="90" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2"/>
            <rect x="25" y="40" width="70" height="50" fill="#047857"/>
            <circle cx="60" cy="65" r="14" fill="#FFFFFF"/>
            <path d="M60 55 C65 58 65 68 60 73 C55 68 55 58 60 55 Z" fill="#047857"/>
            <text x="60" y="105" fontSize="7" fontWeight="bold" fill="#334155" textAnchor="middle">ORGANIC JUICE</text>
          </svg>
        )
      }
    ],
    reviews: [
      {
        id: "r1",
        author: "Emily K.",
        rating: 5,
        date: "September 1, 2026",
        title: "Clean, invigorating energy",
        comment: "The balance of ginger and lemon cuts right through the earthy greens. It feels alive and refreshing.",
        verified: true,
        helpfulCount: 8
      }
    ],
    relatedIds: ["1", "5"]
  },
  {
    id: "3",
    slug: "british-beef-mince",
    name: "British Grass-Fed Beef Mince (Typically 20% Fat) 500g",
    brand: "Farmart Butcher Craft",
    category: "Raw Meats",
    categorySlug: "raw-meats",
    price: 59.00,
    oldPrice: 65.00,
    unit: "500g vacuum sealed",
    discountPercent: 12,
    isOrganic: false,
    rating: 4.7,
    reviewCount: 24,
    stockStatus: "in_stock",
    stockCount: 18,
    sku: "FM-BTC-BEEF-20",
    barcode: "8859123400345",
    shortDescription:
      "100% pasture-raised British beef mince ground fresh daily. Rich in flavor with optimal 20% fat balance for juicy burgers and rich bolognese.",
    fullDescription: [
      "Our artisan butchers select whole prime cuts from naturally grazed British cattle. Course ground to retain moisture and texture when cooked on high heat.",
      "Vacuum skin packed in nitrogen-flushed chilled trays to seal in freshness and natural juices without artificial dyes or color enhancers."
    ],
    highlights: [
      "100% Grass-fed Pasture Raised",
      "Optimal 80/20 lean to fat ratio",
      "No Hormones or Routine Antibiotics",
      "Vacuum skin packed for up to 6 days chilled shelf life"
    ],
    nutritionFacts: [
      { name: "Serving Size", amount: "100g cooked" },
      { name: "Calories", amount: "254 kcal", dailyValue: "13%" },
      { name: "Protein", amount: "26g", dailyValue: "52%" },
      { name: "Total Fat", amount: "17g", dailyValue: "22%" },
      { name: "Iron", amount: "2.8mg", dailyValue: "16%" }
    ],
    originInfo: {
      farmName: "Cotswold Green Pastures",
      location: "Gloucestershire, United Kingdom",
      harvestDate: "Chilled import batch 48h",
      storageTemp: "0°C - 3°C",
      shelfLife: "6 days chilled or 6 months frozen"
    },
    gallery: [
      {
        id: "front",
        label: "Butcher Pack",
        svgNode: (
          <svg width="220" height="200" viewBox="0 0 120 90" fill="none">
            <rect x="15" y="10" width="90" height="70" rx="6" fill="#1E293B"/>
            <rect x="20" y="15" width="80" height="60" rx="4" fill="#DC2626"/>
            <path d="M25 25 Q35 18 45 28 T65 25 T85 28" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
            <path d="M25 45 Q35 38 45 48 T65 45 T85 48" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
            <path d="M25 65 Q35 58 45 68 T65 65 T85 68" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
            <rect x="40" y="30" width="40" height="30" rx="2" fill="#FFFFFF"/>
            <text x="60" y="44" fontSize="7" fontWeight="bold" fill="#000" textAnchor="middle">BEEF</text>
            <text x="60" y="53" fontSize="6" fill="#64748B" textAnchor="middle">20% FAT</text>
          </svg>
        )
      }
    ],
    reviews: [
      {
        id: "r1",
        author: "Mark Evans",
        rating: 5,
        date: "August 15, 2026",
        title: "Incredible burgers!",
        comment: "Cooked smash burgers on cast iron, the crust and beefy flavor were phenomenal.",
        verified: true,
        helpfulCount: 5
      }
    ],
    relatedIds: ["4", "1"]
  },
  {
    id: "4",
    slug: "farmhouse-soft-white-bread",
    name: "Farmart Farmhouse Soft White Sliced Bread 800g",
    brand: "Farmart Artisan Bakery",
    category: "Breads & Sweets",
    categorySlug: "breads-sweets",
    price: 12.70,
    oldPrice: 14.50,
    unit: "800g loaf (18 slices)",
    discountPercent: 12,
    isOrganic: false,
    rating: 4.9,
    reviewCount: 58,
    stockStatus: "in_stock",
    stockCount: 50,
    sku: "FM-BKR-WHT-80",
    barcode: "8859123400451",
    shortDescription:
      "Traditional slow-fermented farmhouse loaf baked with stone-ground unbleached wheat flour and golden sea salt. Pillowy soft crumb with crisp golden crust.",
    fullDescription: [
      "Our master bakers mix dough using a 14-hour sponge fermentation technique that enhances digestibility, natural sweetness, and irresistible aroma.",
      "Thickly sliced and sealed in a wax-paper lined bag to keep freshness intact for 5 days without harsh preservatives."
    ],
    highlights: [
      "14-Hour Slow Natural Fermentation",
      "Stone-Ground Unbleached Wheat Flour",
      "Baked fresh every morning at 04:00 AM",
      "No High Fructose Corn Syrup"
    ],
    nutritionFacts: [
      { name: "Serving Size", amount: "2 Slices (88g)" },
      { name: "Calories", amount: "210 kcal", dailyValue: "11%" },
      { name: "Protein", amount: "7g", dailyValue: "14%" },
      { name: "Carbohydrates", amount: "42g", dailyValue: "15%" },
      { name: "Fiber", amount: "2.5g", dailyValue: "9%" }
    ],
    originInfo: {
      farmName: "Heritage Grain Mill & Bakery",
      location: "Khao Yai, Thailand",
      harvestDate: "Baked this morning",
      storageTemp: "Room temperature in bread box",
      shelfLife: "5 days"
    },
    gallery: [
      {
        id: "front",
        label: "Artisan Loaf",
        svgNode: (
          <svg width="220" height="200" viewBox="0 0 120 90" fill="none">
            <rect x="25" y="20" width="70" height="50" rx="8" fill="#FDE68A" stroke="#D97706" strokeWidth="2"/>
            <path d="M25 35 Q60 25 95 35 L95 65 Q60 75 25 65 Z" fill="#F59E0B"/>
            <rect x="38" y="32" width="44" height="26" rx="4" fill="#FFFFFF"/>
            <text x="60" y="44" fontSize="7" fontWeight="bold" fill="#000" textAnchor="middle">FARMART</text>
            <text x="60" y="52" fontSize="5" fill="#64748B" textAnchor="middle">FARMHOUSE</text>
          </svg>
        )
      }
    ],
    reviews: [
      {
        id: "r1",
        author: "Nongluk T.",
        rating: 5,
        date: "September 2, 2026",
        title: "Softest bread ever",
        comment: "Toasts up golden and crispy on the outside while staying tender inside. Best toast with butter!",
        verified: true,
        helpfulCount: 14
      }
    ],
    relatedIds: ["1", "2"]
  },
  {
    id: "5",
    slug: "fresh-blood-oranges",
    name: "Fresh Blood Oranges Citrus Box (1kg)",
    brand: "Citrus Grove Direct",
    category: "Fruits & Vegetables",
    categorySlug: "fruits-vegetables",
    price: 11.15,
    oldPrice: 13.99,
    unit: "1kg bag (~6-8 pcs)",
    discountPercent: 20,
    isOrganic: true,
    rating: 5.0,
    reviewCount: 18,
    stockStatus: "in_stock",
    stockCount: 42,
    sku: "FM-FRT-ORG-10",
    barcode: "8859123400512",
    shortDescription:
      "Sweet-tart Moro blood oranges with ruby anthocyanin flesh and vibrant floral bouquet. Superb for cold squeezing or winter citrus salads.",
    fullDescription: [
      "Cultivated on hillside volcanic soil that experiences sharp day-to-night temperature drops, which spurs the natural synthesis of vivid red anthocyanin antioxidants.",
      "Juicy, seedless, and bursting with intense raspberry-tinged citrus notes."
    ],
    highlights: [
      "High Anthocyanin Content",
      "Loaded with Vitamin C (120% DV per orange)",
      "Unwaxed and pesticide tested",
      "Perfect for artisanal cocktails and fresh juice"
    ],
    nutritionFacts: [
      { name: "Serving Size", amount: "1 Orange (140g)" },
      { name: "Calories", amount: "70 kcal" },
      { name: "Vitamin C", amount: "70mg", dailyValue: "115%" },
      { name: "Dietary Fiber", amount: "3.2g", dailyValue: "12%" }
    ],
    originInfo: {
      farmName: "Sun Valley Citrus Estate",
      location: "Fang Valley, Chiang Mai",
      harvestDate: "Two days ago",
      storageTemp: "Refrigerator or cool basket",
      shelfLife: "10 to 14 days"
    },
    gallery: [
      {
        id: "front",
        label: "Blood Oranges",
        svgNode: (
          <svg width="220" height="200" viewBox="0 0 120 90" fill="none">
            <circle cx="45" cy="48" r="24" fill="#EA580C"/>
            <circle cx="78" cy="45" r="22" fill="#F97316"/>
            <circle cx="45" cy="48" r="20" fill="#FDBA74"/>
            <path d="M45 28 L45 68 M25 48 L65 48 M31 34 L59 62 M31 62 L59 34" stroke="#EA580C" strokeWidth="2"/>
            <circle cx="45" cy="48" r="4" fill="#FFFFFF"/>
          </svg>
        )
      }
    ],
    reviews: [
      {
        id: "r1",
        author: "Jonathan P.",
        rating: 5,
        date: "August 30, 2026",
        title: "Vibrant and intensely sweet",
        comment: "The ruby color is stunning and the flavor has complex berry notes. Makes the most amazing morning juice.",
        verified: true,
        helpfulCount: 7
      }
    ],
    relatedIds: ["1", "2"]
  }
];

export function getProductById(id: string): ProductDetail | undefined {
  return PRODUCTS.find((p) => p.id === id || p.slug === id);
}
