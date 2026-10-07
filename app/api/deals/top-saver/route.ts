import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    interface DealRow {
      id: string;
      product_id: string | null;
      name: string;
      price: number;
      old_price: number;
      discount_percent: number;
      unit: string;
      stock_total: number;
      stock_sold: number;
      image_url: string | null;
      expires_at: string;
    }

    const rows = db.prepare(`
      SELECT id, product_id, name, price, old_price, discount_percent, unit, stock_total, stock_sold, image_url, expires_at
      FROM top_saver_deals
      ORDER BY id ASC
    `).all() as DealRow[];

    // Calculate time left from the first deal's expiration or fallback
    let expiresAt = rows[0]?.expires_at;
    if (!expiresAt || new Date(expiresAt).getTime() < Date.now()) {
      // If expired, roll forward 8h 25m
      const nextExpires = new Date(Date.now() + (8 * 3600 + 25 * 60 + 37) * 1000);
      expiresAt = nextExpires.toISOString();
      db.prepare('UPDATE top_saver_deals SET expires_at = ?').run(expiresAt);
    }

    const diffMs = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const totalSeconds = Math.floor(diffMs / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');

    const deals = rows.map((r) => ({
      id: r.id,
      productId: r.product_id || undefined,
      name: r.name,
      price: r.price,
      oldPrice: r.old_price,
      discountPercent: r.discount_percent,
      unit: r.unit,
      stockTotal: r.stock_total,
      stockSold: r.stock_sold,
      imageUrl: r.image_url || undefined,
    }));

    return NextResponse.json({
      expiresAt,
      timeLeftFormatted: {
        hours: h,
        minutes: m,
        seconds: s,
      },
      deals,
    });
  } catch (error) {
    console.error('Error fetching top saver deals:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch top saver deals',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
