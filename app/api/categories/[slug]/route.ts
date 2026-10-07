import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const db = getDb();
    const row = db.prepare(`
      SELECT id, name, slug, icon, item_count as itemCount
      FROM categories
      WHERE slug = ? OR id = ?
    `).get(slug, slug) as { id: string; name: string; slug: string; icon: string | null; itemCount: number } | undefined;

    if (!row) {
      return NextResponse.json(
        {
          error: 'Not Found',
          message: `Category with slug or id '${slug}' not found`,
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(row);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to fetch category',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
