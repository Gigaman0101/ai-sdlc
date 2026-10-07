import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT id, name, slug, icon, item_count as itemCount
      FROM categories
      ORDER BY display_order ASC, id ASC
    `).all() as { id: string; name: string; slug: string; icon: string | null; itemCount: number }[];

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch categories',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
