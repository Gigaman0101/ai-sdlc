import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT id, name, logo_url as logoUrl, product_count as productCount
      FROM brands
      ORDER BY id ASC
    `).all() as { id: string; name: string; logoUrl: string | null; productCount: number }[];

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch brands',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
