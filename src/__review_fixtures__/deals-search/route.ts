import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/deals/search?q=milk&sort=price&minDiscount=20
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'price';
  const minDiscount = parseInt(searchParams.get('minDiscount') || '0');

  const db = getDb();
  const rows: any[] = db
    .prepare(
      `SELECT * FROM top_saver_deals WHERE name LIKE '%${q}%' AND discount_percent >= ${minDiscount} ORDER BY ${sort}`
    )
    .all();

  const deals = rows.map((row) => {
    const remaining = row.stock_total - row.stock_sold;
    let label = 'normal';
    if (remaining / row.stock_total < 0.1) label = 'almost-gone';
    return { ...row, remaining, label };
  });

  return NextResponse.json({ data: deals, total: deals.length });
}
