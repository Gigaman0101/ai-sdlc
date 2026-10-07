import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const brand = searchParams.get('brand')?.trim() || '';
    const isOrganicParam = searchParams.get('isOrganic');
    const sort = searchParams.get('sort') || 'featured';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    // Validation
    const validSorts = ['featured', 'price_asc', 'price_desc', 'rating', 'newest'];
    if (!validSorts.includes(sort)) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: `Invalid sort parameter. Valid values are: ${validSorts.join(', ')}`,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Page parameter must be an integer greater than or equal to 1',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        {
          error: 'Bad Request',
          message: 'Limit parameter must be an integer between 1 and 50',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const db = getDb();
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (q) {
      conditions.push('(name LIKE ? OR brand LIKE ? OR short_description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category && category.toLowerCase() !== 'all') {
      conditions.push('(category_slug = ? OR category = ?)');
      params.push(category, category);
    }

    if (brand) {
      conditions.push('brand = ?');
      params.push(brand);
    }

    if (isOrganicParam !== null) {
      const isOrganic = isOrganicParam === 'true' || isOrganicParam === '1';
      conditions.push('is_organic = ?');
      params.push(isOrganic ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total matching items
    const countSql = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const totalRow = db.prepare(countSql).get(...params) as { total: number };
    const total = totalRow.total;

    // Sorting
    let orderBy = 'id ASC';
    if (sort === 'price_asc') {
      orderBy = 'price ASC';
    } else if (sort === 'price_desc') {
      orderBy = 'price DESC';
    } else if (sort === 'rating') {
      orderBy = 'rating DESC, review_count DESC';
    } else if (sort === 'newest') {
      orderBy = 'created_at DESC, id DESC';
    } else if (sort === 'featured') {
      orderBy = 'is_best_seller DESC, rating DESC';
    }

    const offset = (page - 1) * limit;
    const querySql = `
      SELECT
        id, slug, name, brand, category, category_slug as categorySlug,
        price, old_price as oldPrice, unit, discount_percent as discountPercent,
        is_organic as isOrganic, rating, review_count as reviewCount,
        image_url as imageUrl
      FROM products
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
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

    const rows = db.prepare(querySql).all(...params, limit, offset) as ProductRow[];

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

    return NextResponse.json({
      total,
      page,
      limit,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred while fetching products',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
