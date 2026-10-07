import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getProductById as getFallbackProduct } from '@/data/products';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = getDb();

    interface ProductRow {
      id: string;
      slug: string;
      name: string;
      brand: string;
      category: string;
      category_slug: string;
      price: number;
      old_price: number | null;
      unit: string;
      discount_percent: number;
      is_organic: number;
      rating: number;
      review_count: number;
      stock_status: string;
      stock_count: number;
      sku: string | null;
      barcode: string | null;
      short_description: string | null;
      full_description: string | null;
      highlights: string | null;
      nutrition_facts: string | null;
      origin_info: string | null;
      image_url: string | null;
    }

    const row = db.prepare(`
      SELECT * FROM products
      WHERE id = ? OR slug = ?
    `).get(id, id) as ProductRow | undefined;

    if (!row) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: `Product with ID or slug '${id}' not found`,
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // Try finding rich fallback reviews or gallery if present in mock data
    const fallback = getFallbackProduct(row.id);

    const fullDescription = row.full_description
      ? JSON.parse(row.full_description)
      : fallback?.fullDescription || [row.short_description || row.name];

    const highlights = row.highlights
      ? JSON.parse(row.highlights)
      : fallback?.highlights || ['100% Guaranteed Fresh'];

    const nutritionFacts = row.nutrition_facts
      ? JSON.parse(row.nutrition_facts)
      : fallback?.nutritionFacts || [];

    const originInfo = row.origin_info
      ? JSON.parse(row.origin_info)
      : fallback?.originInfo || {
          farmName: 'Farmart Partner Network',
          location: 'Thailand',
          harvestDate: 'Daily Fresh Delivery',
          storageTemp: 'Standard cool environment',
          shelfLife: '5 to 7 days',
        };

    const gallery = fallback?.gallery
      ? fallback.gallery.map((g) => ({
          id: g.id,
          label: g.label,
          imageUrl: row.image_url || '/images/products/default.png',
        }))
      : [
          {
            id: 'front',
            label: 'Front View',
            imageUrl: row.image_url || '/images/products/default.png',
          },
        ];

    const reviews = fallback?.reviews
      ? fallback.reviews.map((r) => ({
          id: r.id,
          author: r.author,
          rating: r.rating,
          date: r.date,
          title: r.title,
          comment: r.comment,
          verified: r.verified,
          helpfulCount: r.helpfulCount,
        }))
      : [];

    const relatedIds = fallback?.relatedIds || ['1', '2', '3'];

    const productDetail = {
      id: row.id,
      slug: row.slug,
      name: row.name,
      brand: row.brand,
      category: row.category,
      categorySlug: row.category_slug,
      price: row.price,
      oldPrice: row.old_price || undefined,
      unit: row.unit,
      discountPercent: row.discount_percent || undefined,
      isOrganic: Boolean(row.is_organic),
      rating: row.rating,
      reviewCount: row.review_count,
      stockStatus: row.stock_status,
      stockCount: row.stock_count,
      sku: row.sku || `FM-${row.id}`,
      barcode: row.barcode || `88591234000${row.id}`,
      shortDescription: row.short_description || row.name,
      fullDescription,
      highlights,
      nutritionFacts,
      originInfo,
      gallery,
      reviews,
      relatedIds,
    };

    return NextResponse.json(productDetail);
  } catch (error) {
    console.error('Error fetching product by id:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch product details',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
