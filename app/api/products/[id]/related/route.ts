import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = getDb();

    // Get current product's category
    const current = db.prepare('SELECT id, category, category_slug FROM products WHERE id = ? OR slug = ?').get(id, id) as {
      id: string;
      category: string;
      category_slug: string;
    } | undefined;

    if (!current) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: `Product with ID '${id}' not found`,
          statusCode: 404,
        },
        { status: 404 }
      );
    }

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

    // Get related products in same category (or other products if not enough)
    const rows = db.prepare(`
      SELECT
        id, slug, name, brand, category, category_slug as categorySlug,
        price, old_price as oldPrice, unit, discount_percent as discountPercent,
        is_organic as isOrganic, rating, review_count as reviewCount,
        image_url as imageUrl
      FROM products
      WHERE id != ?
      ORDER BY (category_slug = ?) DESC, rating DESC
      LIMIT 4
    `).all(current.id, current.category_slug) as ProductRow[];

    const related = rows.map((r) => ({
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

    return NextResponse.json(related);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch related products',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
