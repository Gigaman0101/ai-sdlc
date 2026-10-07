import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category')?.trim() || 'All';
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '8', 10)));

    const db = getDb();
    const conditions: string[] = ['is_just_landing = 1'];
    const params: (string | number)[] = [];

    if (category && category.toLowerCase() !== 'all') {
      conditions.push('(category = ? OR category_slug = ?)');
      params.push(category, category);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    const sql = `
      SELECT
        id, slug, name, brand, category, category_slug as categorySlug,
        price, old_price as oldPrice, unit, discount_percent as discountPercent,
        is_organic as isOrganic, rating, review_count as reviewCount,
        image_url as imageUrl
      FROM products
      ${whereClause}
      ORDER BY id DESC
      LIMIT ?
    `;

    interface ProductRow {
      id: string;
      slug: string;
      name: string;
      brand: string;
      category: string;
      categorySlug: string;
      price: number;
      oldPrice: number | null;
      unit: string;
      discountPercent: number;
      isOrganic: number;
      rating: number;
      reviewCount: number;
      imageUrl: string | null;
    }

    let rows = db.prepare(sql).all(...params, limit) as ProductRow[];

    // Fallback if no specific just-landing in category
    if (rows.length === 0 && category.toLowerCase() !== 'all') {
      const fallbackSql = `
        SELECT
          id, slug, name, brand, category, category_slug as categorySlug,
          price, old_price as oldPrice, unit, discount_percent as discountPercent,
          is_organic as isOrganic, rating, review_count as reviewCount,
          image_url as imageUrl
        FROM products
        WHERE (category = ? OR category_slug = ?)
        ORDER BY id DESC
        LIMIT ?
      `;
      rows = db.prepare(fallbackSql).all(category, category, limit) as ProductRow[];
    }

    const products = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      brand: r.brand,
      category: r.category,
      categorySlug: r.categorySlug,
      price: r.price,
      oldPrice: r.oldPrice || undefined,
      unit: r.unit,
      discountPercent: r.discountPercent || undefined,
      isOrganic: Boolean(r.isOrganic),
      rating: r.rating,
      reviewCount: r.reviewCount,
      imageUrl: r.imageUrl || undefined,
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching just landing products:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch just landing products',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
