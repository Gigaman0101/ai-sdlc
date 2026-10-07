import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Unit tests isolate the route handler's branching logic (validation, WHERE
// clause / params construction, row -> DTO mapping) from the real SQLite
// database by mocking `@/lib/db`.
const prepareMock = vi.fn();

vi.mock('@/lib/db', () => ({
  getDb: () => ({ prepare: prepareMock }),
}));

const { GET } = await import('./route');

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
  discountPercent: number | null;
  isOrganic: number;
  rating: number;
  reviewCount: number;
  imageUrl: string | null;
}

const sampleRow: ProductRow = {
  id: '1',
  slug: 'organic-hass-avocado',
  name: 'Fresh Organic Hass Avocado',
  brand: 'Farmart Organic Direct',
  category: 'Fruits & Vegetables',
  categorySlug: 'fruits-vegetables',
  price: 6.49,
  oldPrice: null,
  unit: '4 pcs',
  discountPercent: null,
  isOrganic: 1,
  rating: 4.9,
  reviewCount: 128,
  imageUrl: null,
};

function mockDbResponses(total: number, rows: ProductRow[]) {
  prepareMock.mockImplementation((sql: string) => {
    if (sql.includes('COUNT(*)')) {
      return { get: vi.fn(() => ({ total })), all: vi.fn() };
    }
    return { get: vi.fn(), all: vi.fn(() => rows) };
  });
}

function makeRequest(query: string) {
  return new NextRequest(`http://localhost:3000/api/products${query}`);
}

describe('GET /api/products (unit)', () => {
  beforeEach(() => {
    prepareMock.mockReset();
    mockDbResponses(1, [sampleRow]);
  });

  it('rejects an invalid sort value with 400 and does not query the database', async () => {
    const res = await GET(makeRequest('?sort=bogus'));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Bad Request');
    expect(data.message).toContain('Invalid sort parameter');
    expect(prepareMock).not.toHaveBeenCalled();
  });

  it.each(['0', '-1', 'abc'])('rejects an invalid page value (%s) with 400', async (page) => {
    const res = await GET(makeRequest(`?page=${page}`));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain('Page parameter');
    expect(prepareMock).not.toHaveBeenCalled();
  });

  it.each(['0', '-5', '51', 'abc'])('rejects an invalid limit value (%s) with 400', async (limit) => {
    const res = await GET(makeRequest(`?limit=${limit}`));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain('Limit parameter');
    expect(prepareMock).not.toHaveBeenCalled();
  });

  it('accepts limit=50 as the upper boundary', async () => {
    const res = await GET(makeRequest('?limit=50'));
    expect(res.status).toBe(200);
  });

  it('builds a WHERE clause combining q, category, brand and isOrganic filters', async () => {
    await GET(makeRequest('?q=avocado&category=fruits-vegetables&brand=Farmart&isOrganic=true'));

    const countCall = prepareMock.mock.calls.find(([sql]) => sql.includes('COUNT(*)'));
    expect(countCall).toBeTruthy();
    const countSql = countCall![0] as string;
    expect(countSql).toContain('name LIKE ? OR brand LIKE ? OR short_description LIKE ?');
    expect(countSql).toContain('category_slug = ? OR category = ?');
    expect(countSql).toContain('brand = ?');
    expect(countSql).toContain('is_organic = ?');

    const countStatement = prepareMock.mock.results.find(
      (r, i) => (prepareMock.mock.calls[i][0] as string).includes('COUNT(*)')
    )!.value;
    expect(countStatement.get).toHaveBeenCalledWith(
      '%avocado%',
      '%avocado%',
      '%avocado%',
      'fruits-vegetables',
      'fruits-vegetables',
      'Farmart',
      1
    );
  });

  it('treats category=all as no category filter', async () => {
    await GET(makeRequest('?category=all'));
    const countCall = prepareMock.mock.calls.find(([sql]) => sql.includes('COUNT(*)'));
    expect(countCall![0]).not.toContain('category_slug');
  });

  it.each([
    ['isOrganic=true', 1],
    ['isOrganic=1', 1],
    ['isOrganic=false', 0],
    ['isOrganic=0', 0],
  ])('maps %s to is_organic=%i', async (queryParam, expected) => {
    await GET(makeRequest(`?${queryParam}`));
    const countStatement = prepareMock.mock.results.find(
      (r, i) => (prepareMock.mock.calls[i][0] as string).includes('COUNT(*)')
    )!.value;
    const lastArg = countStatement.get.mock.calls[0].at(-1);
    expect(lastArg).toBe(expected);
  });

  it.each([
    ['price_asc', 'price ASC'],
    ['price_desc', 'price DESC'],
    ['rating', 'rating DESC, review_count DESC'],
    ['newest', 'created_at DESC, id DESC'],
    ['featured', 'is_best_seller DESC, rating DESC'],
  ])('maps sort=%s to ORDER BY %s', async (sort, expectedOrderBy) => {
    await GET(makeRequest(`?sort=${sort}`));
    const querySql = prepareMock.mock.calls.find(([sql]) => !sql.includes('COUNT(*)'))![0] as string;
    expect(querySql).toContain(`ORDER BY ${expectedOrderBy}`);
  });

  it('defaults to featured sort and page 1 / limit 12 when unspecified', async () => {
    const res = await GET(makeRequest(''));
    const data = await res.json();
    expect(data.page).toBe(1);
    expect(data.limit).toBe(12);
    const querySql = prepareMock.mock.calls.find(([sql]) => !sql.includes('COUNT(*)'))![0] as string;
    expect(querySql).toContain('ORDER BY is_best_seller DESC, rating DESC');
  });

  it('maps database rows to the response DTO, defaulting nullable fields to undefined', async () => {
    const res = await GET(makeRequest(''));
    const data = await res.json();
    expect(data.total).toBe(1);
    expect(data.products).toEqual([
      {
        id: '1',
        slug: 'organic-hass-avocado',
        name: 'Fresh Organic Hass Avocado',
        brand: 'Farmart Organic Direct',
        category: 'Fruits & Vegetables',
        categorySlug: 'fruits-vegetables',
        price: 6.49,
        oldPrice: undefined,
        unit: '4 pcs',
        discountPercent: undefined,
        isOrganic: true,
        rating: 4.9,
        reviewCount: 128,
        imageUrl: undefined,
      },
    ]);
  });

  it('returns 500 when the database throws', async () => {
    prepareMock.mockImplementation(() => {
      throw new Error('boom');
    });
    const res = await GET(makeRequest(''));
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Internal Server Error');
  });
});
