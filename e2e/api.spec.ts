import { test, expect } from '@playwright/test';

/** API contract smoke tests through the running Next.js server. */
test.describe('API routes', () => {
  test('GET /api/categories returns seeded categories', async ({ request }) => {
    const res = await request.get('/api/categories');
    expect(res.ok()).toBe(true);

    const data = await res.json();
    expect(data.length).toBeGreaterThanOrEqual(8);
    expect(data[0]).toEqual(expect.objectContaining({ id: expect.anything(), slug: expect.any(String) }));
  });

  test('GET /api/brands returns seeded brands', async ({ request }) => {
    const res = await request.get('/api/brands');
    expect(res.ok()).toBe(true);
    expect((await res.json()).length).toBeGreaterThanOrEqual(4);
  });

  test('GET /api/products filters by keyword', async ({ request }) => {
    const res = await request.get('/api/products?q=avocado');
    expect(res.ok()).toBe(true);

    const data = await res.json();
    expect(data.total).toBeGreaterThanOrEqual(1);
    expect(data.products.some((p: { name: string }) => /avocado/i.test(p.name))).toBe(true);
  });

  test('GET /api/deals/top-saver returns deals with a countdown', async ({ request }) => {
    const res = await request.get('/api/deals/top-saver');
    expect(res.ok()).toBe(true);

    const data = await res.json();
    expect(data.deals.length).toBeGreaterThan(0);
    expect(data.timeLeftFormatted).toEqual(
      expect.objectContaining({ hours: expect.anything(), minutes: expect.anything(), seconds: expect.anything() }),
    );
  });
});
