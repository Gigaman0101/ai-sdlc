import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getProducts } from './route';

// Integration tests exercise the real seeded SQLite database (same setup
// used by app/api/api.test.ts) to cover the brand / isOrganic / sort query
// features added to GET /api/products for the product search page.
function request(query: string) {
  return new NextRequest(`http://localhost:3000/api/products${query}`);
}

describe('GET /api/products (integration, SQLite)', () => {
  it('filters by brand', async () => {
    const res = await getProducts(request('?brand=Meat Brand'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.total).toBeGreaterThanOrEqual(1);
    expect(data.products.every((p: { brand: string }) => p.brand === 'Meat Brand')).toBe(true);
  });

  it('filters organic products only', async () => {
    const res = await getProducts(request('?isOrganic=true&limit=50'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((p: { isOrganic: boolean }) => p.isOrganic === true)).toBe(true);
  });

  it('filters non-organic products only', async () => {
    const res = await getProducts(request('?isOrganic=false&limit=50'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((p: { isOrganic: boolean }) => p.isOrganic === false)).toBe(true);
  });

  it('sorts by price ascending', async () => {
    const res = await getProducts(request('?sort=price_asc&limit=50'));
    expect(res.status).toBe(200);
    const data = await res.json();
    const prices = data.products.map((p: { price: number }) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('sorts by price descending', async () => {
    const res = await getProducts(request('?sort=price_desc&limit=50'));
    expect(res.status).toBe(200);
    const data = await res.json();
    const prices = data.products.map((p: { price: number }) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('sorts by rating descending', async () => {
    const res = await getProducts(request('?sort=rating&limit=50'));
    expect(res.status).toBe(200);
    const data = await res.json();
    const ratings = data.products.map((p: { rating: number }) => p.rating);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it('accepts sort=newest without error', async () => {
    const res = await getProducts(request('?sort=newest&limit=50'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.products)).toBe(true);
  });

  it('combines category, isOrganic and sort filters together (search page use case)', async () => {
    const res = await getProducts(
      request('?category=fruits-vegetables&isOrganic=true&sort=price_asc&page=1&limit=10')
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(
      data.products.every(
        (p: { categorySlug: string; isOrganic: boolean }) =>
          p.categorySlug === 'fruits-vegetables' && p.isOrganic === true
      )
    ).toBe(true);
    const prices = data.products.map((p: { price: number }) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('returns an empty product list for a brand that does not exist, without erroring', async () => {
    const res = await getProducts(request('?brand=No Such Brand'));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.total).toBe(0);
    expect(data.products).toEqual([]);
  });

  it('rejects an invalid sort value end-to-end', async () => {
    const res = await getProducts(request('?sort=invalid'));
    expect(res.status).toBe(400);
  });
});
