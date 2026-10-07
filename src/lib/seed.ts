import type Database from 'better-sqlite3';

export function seedDatabase(db: Database.Database) {
  // Create categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT,
      item_count INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0
    );
  `);

  // Create brands table
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo_url TEXT,
      tag TEXT,
      title TEXT,
      product_count INTEGER DEFAULT 0
    );
  `);

  // Create products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      price REAL NOT NULL,
      old_price REAL,
      unit TEXT NOT NULL,
      discount_percent INTEGER DEFAULT 0,
      is_organic INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      stock_status TEXT DEFAULT 'in_stock',
      stock_count INTEGER DEFAULT 50,
      sku TEXT,
      barcode TEXT,
      short_description TEXT,
      full_description TEXT,
      highlights TEXT,
      nutrition_facts TEXT,
      origin_info TEXT,
      image_url TEXT,
      is_best_seller INTEGER DEFAULT 0,
      is_just_landing INTEGER DEFAULT 0,
      is_top_saver INTEGER DEFAULT 0,
      stock_sold INTEGER DEFAULT 0,
      stock_total INTEGER DEFAULT 100,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create top_saver_deals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS top_saver_deals (
      id TEXT PRIMARY KEY,
      product_id TEXT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      old_price REAL NOT NULL,
      discount_percent INTEGER NOT NULL,
      unit TEXT NOT NULL,
      stock_total INTEGER NOT NULL,
      stock_sold INTEGER NOT NULL,
      image_url TEXT,
      expires_at TEXT NOT NULL
    );
  `);

  // Check if categories are already populated
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (categoryCount.count === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, icon, item_count, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const categories = [
      { id: 'cat-1', name: 'Fruits & Vegetables', slug: 'fruits-vegetables', icon: 'fruit', itemCount: 154, order: 1 },
      { id: 'cat-2', name: 'Breads & Sweets', slug: 'breads-sweets', icon: 'bread', itemCount: 82, order: 2 },
      { id: 'cat-3', name: 'Frozen Seafoods', slug: 'frozen-seafoods', icon: 'seafood', itemCount: 64, order: 3 },
      { id: 'cat-4', name: 'Raw Meats', slug: 'raw-meats', icon: 'meat', itemCount: 45, order: 4 },
      { id: 'cat-5', name: 'Wines & Alcohol Drinks', slug: 'wines-alcohol-drinks', icon: 'wine', itemCount: 38, order: 5 },
      { id: 'cat-6', name: 'Coffees and Teas', slug: 'coffees-teas', icon: 'coffee', itemCount: 92, order: 6 },
      { id: 'cat-7', name: 'Milks and Dairies', slug: 'milks-dairies', icon: 'milk', itemCount: 53, order: 7 },
      { id: 'cat-8', name: 'Pet Foods', slug: 'pet-foods', icon: 'pet', itemCount: 29, order: 8 },
    ];

    for (const c of categories) {
      insertCat.run(c.id, c.name, c.slug, c.icon, c.itemCount, c.order);
    }
  }

  // Check if brands are already populated
  const brandCount = db.prepare('SELECT COUNT(*) as count FROM brands').get() as { count: number };
  if (brandCount.count === 0) {
    const insertBrand = db.prepare(`
      INSERT INTO brands (id, name, logo_url, tag, title, product_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const brands = [
      { id: 'brand-1', name: 'Hoodpouch', logoUrl: '/images/brands/hoodpouch.svg', tag: 'HOODPOUCH', title: 'New Snacks Release', productCount: 18 },
      { id: 'brand-2', name: 'Tea-ric', logoUrl: '/images/brands/tea-ric.svg', tag: 'TEA-RIC', title: 'Happy Tea 100% Organic, From $29.9', productCount: 24 },
      { id: 'brand-3', name: 'Soda Brand', logoUrl: '/images/brands/soda.svg', tag: 'SODA BRAND', title: 'Soda Can Box 24 Pieces - 30% OFF', productCount: 15 },
      { id: 'brand-4', name: 'Farmart Organic Direct', logoUrl: '/images/brands/farmart.svg', tag: 'FARMART', title: 'Fresh Meat Sausage. BUY 2 GET 1', productCount: 32 },
    ];

    for (const b of brands) {
      insertBrand.run(b.id, b.name, b.logoUrl, b.tag, b.title, b.productCount);
    }
  }

  // Check if products are already populated
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, slug, name, brand, category, category_slug, price, old_price, unit,
        discount_percent, is_organic, rating, review_count, stock_status, stock_count,
        sku, barcode, short_description, full_description, highlights, nutrition_facts,
        origin_info, image_url, is_best_seller, is_just_landing, is_top_saver, stock_sold, stock_total
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const products = [
      {
        id: '1',
        slug: 'organic-hass-avocado',
        name: 'Fresh Organic Hass Avocado (Pack of 4)',
        brand: 'Farmart Organic Direct',
        category: 'Fruits & Vegetables',
        categorySlug: 'fruits-vegetables',
        price: 6.49,
        oldPrice: 8.99,
        unit: '4 pcs (~650g)',
        discountPercent: 28,
        isOrganic: 1,
        rating: 4.9,
        reviewCount: 128,
        stockStatus: 'in_stock',
        stockCount: 84,
        sku: 'FM-ORG-AVO-04',
        barcode: '8859123400192',
        shortDescription: 'Hand-picked buttery Hass avocados cultivated on certified regenerative organic orchards.',
        fullDescription: JSON.stringify([
          'Our Fresh Organic Hass Avocados are nurtured under temperate sun drenched orchards without any synthetic pesticides.',
          'Avocados are known as nature\'s superfood, loaded with heart-healthy monounsaturated oleic acid, fiber, and potassium.'
        ]),
        highlights: JSON.stringify([
          '100% Certified Organic (USDA & Bio-Organic)',
          'Zero Synthetic Chemical Sprays or Waxes',
          'Picked within 36 hours of your delivery'
        ]),
        nutritionFacts: JSON.stringify([
          { name: 'Serving Size', amount: '1/2 Avocado (80g)' },
          { name: 'Total Fat', amount: '12g', dailyValue: '15%' }
        ]),
        originInfo: JSON.stringify({
          farmName: 'Green Valley Regenerative Cooperative',
          location: 'Chiang Mai Highlands, Thailand',
          harvestDate: 'Yesterday morning (06:30 AM)',
          storageTemp: '12°C - 15°C (Cool Pantry)',
          shelfLife: '5 to 7 days from delivery date'
        }),
        imageUrl: '/images/products/avocado.png',
        isBestSeller: 1,
        isJustLanding: 0,
        isTopSaver: 1,
        stockSold: 20,
        stockTotal: 40
      },
      {
        id: '2',
        slug: 'raw-green-detox-juice',
        name: 'Raw Green Detox Cold-Pressed Juice 500ml',
        brand: 'Farmart Botanicals',
        category: 'Beverages',
        categorySlug: 'beverages',
        price: 18.25,
        oldPrice: 22.50,
        unit: '500ml glass bottle',
        discountPercent: 18,
        isOrganic: 1,
        rating: 4.8,
        reviewCount: 42,
        stockStatus: 'in_stock',
        stockCount: 35,
        sku: 'FM-BOT-DETOX-01',
        barcode: '8859123400208',
        shortDescription: 'Cold-pressed kale, crisp green apple, English cucumber, celery, fresh ginger, and Meyer lemon.',
        fullDescription: JSON.stringify([
          'Crafted every dawn in our certified hygienic cleanroom using hydraulic cold-press extraction.',
          'Contains no added sugar, artificial preservatives, or diluting water.'
        ]),
        highlights: JSON.stringify([
          '100% Cold-Pressed, Raw & Unpasteurized',
          'Over 1.2kg of organic greens in every bottle'
        ]),
        nutritionFacts: JSON.stringify([
          { name: 'Serving Size', amount: '1 Bottle (500ml)' },
          { name: 'Calories', amount: '140 kcal', dailyValue: '7%' }
        ]),
        originInfo: JSON.stringify({
          farmName: 'Mae Rim Botanical Gardens',
          location: 'Chiang Mai, Thailand',
          harvestDate: 'Pressed 4 hours ago',
          storageTemp: '2°C - 4°C (Refrigerator)',
          shelfLife: '4 days from bottling'
        }),
        imageUrl: '/images/products/detox-juice.png',
        isBestSeller: 1,
        isJustLanding: 0,
        isTopSaver: 0,
        stockSold: 35,
        stockTotal: 50
      },
      {
        id: '3',
        slug: 'british-beef-mince',
        name: 'British Grass-Fed Beef Mince (Typically 20% Fat) 500g',
        brand: 'Meat Brand',
        category: 'Raw Meats',
        categorySlug: 'raw-meats',
        price: 59.00,
        oldPrice: 65.00,
        unit: '500g vacuum sealed',
        discountPercent: 12,
        isOrganic: 0,
        rating: 4.7,
        reviewCount: 24,
        stockStatus: 'in_stock',
        stockCount: 18,
        sku: 'FM-BTC-BEEF-20',
        barcode: '8859123400345',
        shortDescription: '100% pasture-raised British beef mince ground fresh daily.',
        fullDescription: JSON.stringify([
          'Our artisan butchers select whole prime cuts from naturally grazed British cattle.'
        ]),
        highlights: JSON.stringify([
          '100% Grass-fed Pasture Raised',
          'Optimal 80/20 lean to fat ratio'
        ]),
        nutritionFacts: JSON.stringify([
          { name: 'Serving Size', amount: '100g cooked' },
          { name: 'Protein', amount: '26g', dailyValue: '52%' }
        ]),
        originInfo: JSON.stringify({
          farmName: 'Cotswold Green Pastures',
          location: 'Gloucestershire, United Kingdom',
          harvestDate: 'Chilled import batch 48h',
          storageTemp: '0°C - 3°C',
          shelfLife: '6 days chilled or 6 months frozen'
        }),
        imageUrl: '/images/products/beef-mince.png',
        isBestSeller: 1,
        isJustLanding: 0,
        isTopSaver: 1,
        stockSold: 25,
        stockTotal: 100
      },
      {
        id: '4',
        slug: 'farmhouse-soft-white-bread',
        name: 'Farmart Farmhouse Soft White Sliced Bread 800g',
        brand: 'Farmart',
        category: 'Breads & Sweets',
        categorySlug: 'breads-sweets',
        price: 12.70,
        oldPrice: 14.50,
        unit: '800g loaf (18 slices)',
        discountPercent: 12,
        isOrganic: 0,
        rating: 4.9,
        reviewCount: 58,
        stockStatus: 'in_stock',
        stockCount: 50,
        sku: 'FM-BKR-WHT-80',
        barcode: '8859123400451',
        shortDescription: 'Traditional slow-fermented farmhouse loaf baked with stone-ground unbleached wheat flour.',
        fullDescription: JSON.stringify([
          'Our master bakers mix dough using a 14-hour sponge fermentation technique.'
        ]),
        highlights: JSON.stringify([
          '14-Hour Slow Natural Fermentation',
          'Baked fresh every morning at 04:00 AM'
        ]),
        nutritionFacts: JSON.stringify([
          { name: 'Serving Size', amount: '2 Slices (88g)' },
          { name: 'Calories', amount: '210 kcal', dailyValue: '11%' }
        ]),
        originInfo: JSON.stringify({
          farmName: 'Heritage Grain Mill & Bakery',
          location: 'Khao Yai, Thailand',
          harvestDate: 'Baked this morning',
          storageTemp: 'Room temperature in bread box',
          shelfLife: '5 days'
        }),
        imageUrl: '/images/products/bread.png',
        isBestSeller: 0,
        isJustLanding: 0,
        isTopSaver: 1,
        stockSold: 8,
        stockTotal: 20
      },
      {
        id: '5',
        slug: 'fresh-blood-oranges',
        name: 'Fresh Blood Oranges Citrus Box (1kg)',
        brand: 'Brand Name',
        category: 'Fruits & Vegetables',
        categorySlug: 'fruits-vegetables',
        price: 11.15,
        oldPrice: 13.99,
        unit: '1kg bag (~6-8 pcs)',
        discountPercent: 20,
        isOrganic: 1,
        rating: 5.0,
        reviewCount: 18,
        stockStatus: 'in_stock',
        stockCount: 42,
        sku: 'FM-FRT-ORG-10',
        barcode: '8859123400512',
        shortDescription: 'Sweet-tart Moro blood oranges with ruby anthocyanin flesh and vibrant floral bouquet.',
        fullDescription: JSON.stringify([
          'Cultivated on hillside volcanic soil that experiences sharp day-to-night temperature drops.'
        ]),
        highlights: JSON.stringify([
          'High Anthocyanin Content',
          'Loaded with Vitamin C (120% DV per orange)'
        ]),
        nutritionFacts: JSON.stringify([
          { name: 'Serving Size', amount: '1 Orange (140g)' },
          { name: 'Vitamin C', amount: '70mg', dailyValue: '115%' }
        ]),
        originInfo: JSON.stringify({
          farmName: 'Sun Valley Citrus Estate',
          location: 'Fang Valley, Chiang Mai',
          harvestDate: 'Two days ago',
          storageTemp: 'Refrigerator or cool basket',
          shelfLife: '10 to 14 days'
        }),
        imageUrl: '/images/products/blood-oranges.png',
        isBestSeller: 0,
        isJustLanding: 0,
        isTopSaver: 1,
        stockSold: 12,
        stockTotal: 20
      },
      {
        id: '6',
        slug: 'us-yellow-water-melon',
        name: 'US Yellow Water Melon',
        brand: 'MariFairy',
        category: 'Fruits & Vegetables',
        categorySlug: 'fruits-vegetables',
        price: 15.90,
        oldPrice: 18.50,
        unit: '1 pc (~2.5kg)',
        discountPercent: 20,
        isOrganic: 0,
        rating: 4.9,
        reviewCount: 15,
        stockStatus: 'in_stock',
        stockCount: 30,
        sku: 'FM-FRT-WML-01',
        barcode: '8859123400601',
        shortDescription: 'Crisp, refreshing sweet yellow flesh watermelon grown under California sun.',
        fullDescription: JSON.stringify(['Juicy and hydrating with high lycopene and vitamin A.']),
        highlights: JSON.stringify(['Seedless and sweet', 'Naturally vine ripened']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '280g' }]),
        originInfo: JSON.stringify({ farmName: 'Sunny Valley Ranch', location: 'California, USA', harvestDate: '3 days ago', storageTemp: 'Chilled', shelfLife: '7 days' }),
        imageUrl: '/images/products/watermelon.png',
        isBestSeller: 1,
        isJustLanding: 0,
        isTopSaver: 0,
        stockSold: 28,
        stockTotal: 50
      },
      {
        id: '7',
        slug: 'spices-snack-6-penny-salty',
        name: 'Spices Snack 6-Penny Salty',
        brand: 'Farmart',
        category: 'Breads & Sweets',
        categorySlug: 'breads-sweets',
        price: 21.50,
        oldPrice: 23.80,
        unit: '1 pack (300g)',
        discountPercent: 10,
        isOrganic: 0,
        rating: 4.8,
        reviewCount: 30,
        stockStatus: 'in_stock',
        stockCount: 40,
        sku: 'FM-SNK-SPY-06',
        barcode: '8859123400701',
        shortDescription: 'Crunchy savory bites tossed in sea salt and freshly cracked aromatic peppercorn.',
        fullDescription: JSON.stringify(['Baked to golden perfection with natural spices.']),
        highlights: JSON.stringify(['Zero Trans Fat', 'Crispy and savory']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '50g' }]),
        originInfo: JSON.stringify({ farmName: 'Farmart Kitchens', location: 'Bangkok, Thailand', harvestDate: 'This week', storageTemp: 'Pantry', shelfLife: '30 days' }),
        imageUrl: '/images/products/spices-snack.png',
        isBestSeller: 1,
        isJustLanding: 0,
        isTopSaver: 0,
        stockSold: 42,
        stockTotal: 60
      },
      {
        id: '8',
        slug: 'oatmeal-cookies-tub',
        name: 'Oatmeal Cookies Tub',
        brand: 'Farmart',
        category: 'Breads & Sweets',
        categorySlug: 'breads-sweets',
        price: 29.00,
        oldPrice: 32.00,
        unit: '500g tub',
        discountPercent: 9,
        isOrganic: 1,
        rating: 4.9,
        reviewCount: 9,
        stockStatus: 'in_stock',
        stockCount: 25,
        sku: 'FM-BKR-OAT-01',
        barcode: '8859123400801',
        shortDescription: 'Handcrafted rolled oat cookies with organic Ceylon cinnamon and brown sugar.',
        fullDescription: JSON.stringify(['Wholesome whole rolled oats with rich butter flavor.']),
        highlights: JSON.stringify(['Organic Rolled Oats', 'No Artificial Flavors']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '2 cookies (40g)' }]),
        originInfo: JSON.stringify({ farmName: 'Farmart Bakery', location: 'Bangkok, Thailand', harvestDate: 'Yesterday', storageTemp: 'Cool dry', shelfLife: '14 days' }),
        imageUrl: '/images/products/oatmeal-cookies.png',
        isBestSeller: 1,
        isJustLanding: 0,
        isTopSaver: 0,
        stockSold: 18,
        stockTotal: 30
      },
      {
        id: '9',
        slug: 'canned-soup-with-turkey',
        name: 'Canned Soup With Turkey',
        brand: 'Brand Name',
        category: 'Raw Meats',
        categorySlug: 'raw-meats',
        price: 32.50,
        oldPrice: 35.00,
        unit: '400g can',
        discountPercent: 7,
        isOrganic: 0,
        rating: 4.6,
        reviewCount: 18,
        stockStatus: 'in_stock',
        stockCount: 60,
        sku: 'FM-CAN-TUR-01',
        barcode: '8859123400901',
        shortDescription: 'Slow-simmered savory broth with tender free-range turkey chunks and diced carrots.',
        fullDescription: JSON.stringify(['Hearty comforting soup ready to heat and serve in 3 minutes.']),
        highlights: JSON.stringify(['High Protein', 'No MSG']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '1 can (400g)' }]),
        originInfo: JSON.stringify({ farmName: 'Valley Naturals', location: 'Oregon, USA', harvestDate: 'Batch 2026', storageTemp: 'Room temp', shelfLife: '2 years' }),
        imageUrl: '/images/products/soup-turkey.png',
        isBestSeller: 1,
        isJustLanding: 0,
        isTopSaver: 0,
        stockSold: 30,
        stockTotal: 60
      },
      {
        id: '10',
        slug: 'special-meat-assorted',
        name: 'Special Meat Assorted',
        brand: 'Farmart',
        category: 'Raw Meats',
        categorySlug: 'raw-meats',
        price: 34.00,
        oldPrice: 38.00,
        unit: '1 kg pack',
        discountPercent: 10,
        isOrganic: 0,
        rating: 4.7,
        reviewCount: 14,
        stockStatus: 'in_stock',
        stockCount: 22,
        sku: 'FM-BTC-AST-01',
        barcode: '8859123401001',
        shortDescription: 'Chef curated selection of premium cured sausages, smoked cuts, and tender steaks.',
        fullDescription: JSON.stringify(['Perfect for charcuterie boards or weekend barbecue roasts.']),
        highlights: JSON.stringify(['Artisan Wood Smoked', 'Vacuum Pack Freshness']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '100g' }]),
        originInfo: JSON.stringify({ farmName: 'Farmart Butcheries', location: 'Khao Yai, Thailand', harvestDate: '24h fresh', storageTemp: '0°C - 4°C', shelfLife: '7 days' }),
        imageUrl: '/images/products/meat-assorted.png',
        isBestSeller: 0,
        isJustLanding: 1,
        isTopSaver: 0,
        stockSold: 15,
        stockTotal: 30
      },
      {
        id: '11',
        slug: 'fresh-meal-italian-bowl',
        name: 'Fresh Meal Italian Bowl',
        brand: 'Farmart',
        category: 'Breads & Sweets',
        categorySlug: 'breads-sweets',
        price: 22.50,
        oldPrice: 25.00,
        unit: '350g bowl',
        discountPercent: 10,
        isOrganic: 1,
        rating: 4.9,
        reviewCount: 22,
        stockStatus: 'in_stock',
        stockCount: 35,
        sku: 'FM-KIT-ITL-01',
        barcode: '8859123401101',
        shortDescription: 'Al dente penne pasta tossed with vine-ripened San Marzano tomatoes, fresh basil, and burrata.',
        fullDescription: JSON.stringify(['Authentic recipe crafted with extra virgin olive oil and imported Parmigiano.']),
        highlights: JSON.stringify(['Ready to Eat', 'Certified Organic Ingredients']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '1 bowl (350g)' }]),
        originInfo: JSON.stringify({ farmName: 'Farmart Ready Kitchen', location: 'Bangkok, Thailand', harvestDate: 'Morning prepared', storageTemp: '2°C - 5°C', shelfLife: '3 days' }),
        imageUrl: '/images/products/italian-bowl.png',
        isBestSeller: 0,
        isJustLanding: 1,
        isTopSaver: 0,
        stockSold: 20,
        stockTotal: 40
      },
      {
        id: '12',
        slug: 'extra-virgin-olive-oil',
        name: 'Extra Virgin Olive Oil',
        brand: 'Olive Co.',
        category: 'Fruits & Vegetables',
        categorySlug: 'fruits-vegetables',
        price: 16.80,
        oldPrice: 19.50,
        unit: '750ml bottle',
        discountPercent: 14,
        isOrganic: 1,
        rating: 4.8,
        reviewCount: 31,
        stockStatus: 'in_stock',
        stockCount: 50,
        sku: 'FM-OIL-EVO-75',
        barcode: '8859123401201',
        shortDescription: 'Single-origin cold extracted olive oil with peppery finish and golden-green hue.',
        fullDescription: JSON.stringify(['Pressed from Coratina and Arbequina olives harvested at optimum maturity.']),
        highlights: JSON.stringify(['First Cold Press', 'Acidity < 0.3%']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '1 tbsp (15ml)' }]),
        originInfo: JSON.stringify({ farmName: 'Mediterranean Estates', location: 'Tuscany, Italy', harvestDate: 'Recent harvest', storageTemp: 'Cool dark place', shelfLife: '18 months' }),
        imageUrl: '/images/products/olive-oil.png',
        isBestSeller: 0,
        isJustLanding: 1,
        isTopSaver: 0,
        stockSold: 38,
        stockTotal: 60
      },
      {
        id: '13',
        slug: 'raw-wildflower-honey',
        name: 'Raw Wildflower Honey',
        brand: 'Organic Pure',
        category: 'Breads & Sweets',
        categorySlug: 'breads-sweets',
        price: 19.00,
        oldPrice: 22.00,
        unit: '450g jar',
        discountPercent: 13,
        isOrganic: 1,
        rating: 5.0,
        reviewCount: 45,
        stockStatus: 'in_stock',
        stockCount: 40,
        sku: 'FM-HNY-WLD-45',
        barcode: '8859123401301',
        shortDescription: 'Unfiltered, unpasteurized honey gathered from protected mountain wildflower meadows.',
        fullDescription: JSON.stringify(['Rich in beneficial live enzymes, propolis, and wildflower pollen.']),
        highlights: JSON.stringify(['100% Raw & Unheated', 'Zero Sugar Added']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '1 tbsp (21g)' }]),
        originInfo: JSON.stringify({ farmName: 'Bee Haven Apiaries', location: 'Chiang Rai Hills, Thailand', harvestDate: 'Seasonal extract', storageTemp: 'Room temp', shelfLife: 'Indefinite' }),
        imageUrl: '/images/products/honey.png',
        isBestSeller: 0,
        isJustLanding: 1,
        isTopSaver: 0,
        stockSold: 25,
        stockTotal: 50
      },
      {
        id: '14',
        slug: 'kitchen-bamboo-wipes',
        name: 'Kitchen Bamboo Wipes',
        brand: 'Eco Clean',
        category: 'Pet Foods',
        categorySlug: 'pet-foods',
        price: 8.50,
        oldPrice: 10.00,
        unit: '60 wipes pack',
        discountPercent: 15,
        isOrganic: 1,
        rating: 4.6,
        reviewCount: 12,
        stockStatus: 'in_stock',
        stockCount: 70,
        sku: 'FM-ECO-WIP-60',
        barcode: '8859123401401',
        shortDescription: '100% compostable unbleached bamboo fiber wipes safe for kitchens and pets.',
        fullDescription: JSON.stringify(['Naturally antibacterial and tough on kitchen grease without harsh chemicals.']),
        highlights: JSON.stringify(['100% Biodegradable', 'Fragrance & Plastic Free']),
        nutritionFacts: JSON.stringify([]),
        originInfo: JSON.stringify({ farmName: 'Bamboo Valley Plant', location: 'Kanchanaburi, Thailand', harvestDate: 'Current batch', storageTemp: 'Dry place', shelfLife: '3 years' }),
        imageUrl: '/images/products/bamboo-wipes.png',
        isBestSeller: 0,
        isJustLanding: 1,
        isTopSaver: 0,
        stockSold: 40,
        stockTotal: 80
      },
      {
        id: '15',
        slug: 'farm-organic-brown-eggs',
        name: 'Farm Organic Brown Eggs',
        brand: 'FarmFresh',
        category: 'Milks & Dairies',
        categorySlug: 'milks-dairies',
        price: 6.20,
        oldPrice: 7.50,
        unit: '10 pack carton',
        discountPercent: 17,
        isOrganic: 1,
        rating: 4.9,
        reviewCount: 54,
        stockStatus: 'in_stock',
        stockCount: 55,
        sku: 'FM-EGG-BRN-10',
        barcode: '8859123401501',
        shortDescription: 'Free-range certified organic eggs with rich golden yolks and strong shells.',
        fullDescription: JSON.stringify(['Hens are free to forage on open organic pastures with zero antibiotics.']),
        highlights: JSON.stringify(['Certified Free-Range Pasture Raised', 'Rich in Omega-3 & Lutein']),
        nutritionFacts: JSON.stringify([{ name: 'Serving Size', amount: '1 egg (50g)' }, { name: 'Protein', amount: '6g', dailyValue: '12%' }]),
        originInfo: JSON.stringify({ farmName: 'Green Meadows Poultry', location: 'Ratchaburi, Thailand', harvestDate: 'Gathered yesterday', storageTemp: '2°C - 6°C', shelfLife: '28 days' }),
        imageUrl: '/images/products/brown-eggs.png',
        isBestSeller: 0,
        isJustLanding: 1,
        isTopSaver: 0,
        stockSold: 45,
        stockTotal: 60
      }
    ];

    for (const p of products) {
      insertProduct.run(
        p.id, p.slug, p.name, p.brand, p.category, p.categorySlug, p.price, p.oldPrice, p.unit,
        p.discountPercent, p.isOrganic, p.rating, p.reviewCount, p.stockStatus, p.stockCount,
        p.sku, p.barcode, p.shortDescription, p.fullDescription, p.highlights, p.nutritionFacts,
        p.originInfo, p.imageUrl, p.isBestSeller, p.isJustLanding, p.isTopSaver, p.stockSold, p.stockTotal
      );
    }
  }

  // Check if top saver deals are already populated
  const dealCount = db.prepare('SELECT COUNT(*) as count FROM top_saver_deals').get() as { count: number };
  if (dealCount.count === 0) {
    const insertDeal = db.prepare(`
      INSERT INTO top_saver_deals (
        id, product_id, name, price, old_price, discount_percent, unit, stock_total, stock_sold, image_url, expires_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date();
    // Expires in 8 hours 25 minutes 37 seconds
    const expiresAt = new Date(now.getTime() + (8 * 3600 + 25 * 60 + 37) * 1000).toISOString();

    const deals = [
      {
        id: 'deal-1',
        productId: '1',
        name: 'Fresh Organic Hass Avocado (Pack of 4)',
        price: 45.00,
        oldPrice: 59.00,
        discountPercent: 24,
        unit: 'Pack of 4 pcs',
        stockTotal: 40,
        stockSold: 20,
        imageUrl: '/images/products/avocado.png',
        expiresAt
      },
      {
        id: 'deal-2',
        productId: '3',
        name: 'British Beef Mince (20% Fat)',
        price: 59.00,
        oldPrice: 65.00,
        discountPercent: 12,
        unit: '500g pack',
        stockTotal: 100,
        stockSold: 25,
        imageUrl: '/images/products/beef-mince.png',
        expiresAt
      },
      {
        id: 'deal-3',
        productId: '4',
        name: 'Farmart Farmhouse Soft White',
        price: 12.70,
        oldPrice: 14.50,
        discountPercent: 12,
        unit: '800g loaf',
        stockTotal: 20,
        stockSold: 8,
        imageUrl: '/images/products/bread.png',
        expiresAt
      },
      {
        id: 'deal-4',
        productId: '5',
        name: 'Fresh Blood Oranges (1kg)',
        price: 11.15,
        oldPrice: 13.99,
        discountPercent: 20,
        unit: '1kg bag',
        stockTotal: 20,
        stockSold: 12,
        imageUrl: '/images/products/blood-oranges.png',
        expiresAt
      }
    ];

    for (const d of deals) {
      insertDeal.run(
        d.id, d.productId, d.name, d.price, d.oldPrice, d.discountPercent, d.unit,
        d.stockTotal, d.stockSold, d.imageUrl, d.expiresAt
      );
    }
  }
}
