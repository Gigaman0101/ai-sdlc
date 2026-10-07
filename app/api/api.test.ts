import { describe, it, expect } from 'vitest';
import { GET as getProducts } from './products/route';
import { GET as getCategories } from './categories/route';
import { GET as getCategoryBySlug } from './categories/[slug]/route';
import { GET as getBrands } from './brands/route';
import { GET as getTopSaver } from './deals/top-saver/route';
import { GET as getBestSellers } from './products/best-sellers/route';
import { GET as getJustLanding } from './products/just-landing/route';
import { GET as getProductById } from './products/[id]/route';
import { GET as getRelatedProducts } from './products/[id]/related/route';
import { NextRequest } from 'next/server';

describe('Farmart Backend API Endpoints (SQLite)', () => {
  it('GET /api/categories returns a list of categories', async () => {
    const res = await getCategories();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(8);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('slug');
    expect(data[0]).toHaveProperty('itemCount');
  });

  it('GET /api/categories/[slug] returns a specific category', async () => {
    const req = new NextRequest('http://localhost:3000/api/categories/fruits-vegetables');
    const res = await getCategoryBySlug(req, { params: Promise.resolve({ slug: 'fruits-vegetables' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slug).toBe('fruits-vegetables');
    expect(data.name).toBe('Fruits & Vegetables');
  });

  it('GET /api/brands returns a list of brands', async () => {
    const res = await getBrands();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(4);
    expect(data[0]).toHaveProperty('name');
    expect(data[0]).toHaveProperty('productCount');
  });

  it('GET /api/deals/top-saver returns top saver countdown and deals', async () => {
    const res = await getTopSaver();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('expiresAt');
    expect(data).toHaveProperty('timeLeftFormatted');
    expect(data.timeLeftFormatted).toHaveProperty('hours');
    expect(data.timeLeftFormatted).toHaveProperty('minutes');
    expect(data.timeLeftFormatted).toHaveProperty('seconds');
    expect(Array.isArray(data.deals)).toBe(true);
    expect(data.deals.length).toBeGreaterThan(0);
  });

  it('GET /api/products returns paginated product list', async () => {
    const req = new NextRequest('http://localhost:3000/api/products?page=1&limit=6');
    const res = await getProducts(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('total');
    expect(data.page).toBe(1);
    expect(data.limit).toBe(6);
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeLessThanOrEqual(6);
  });

  it('GET /api/products searches with keyword "avocado"', async () => {
    const req = new NextRequest('http://localhost:3000/api/products?q=avocado');
    const res = await getProducts(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.total).toBeGreaterThanOrEqual(1);
    expect(data.products.some((p: { name: string }) => p.name.toLowerCase().includes('avocado'))).toBe(true);
  });

  it('GET /api/products filters by category "raw-meats"', async () => {
    const req = new NextRequest('http://localhost:3000/api/products?category=raw-meats');
    const res = await getProducts(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.total).toBeGreaterThanOrEqual(1);
    expect(data.products.every((p: { categorySlug: string }) => p.categorySlug === 'raw-meats')).toBe(true);
  });

  it('GET /api/products/best-sellers returns best seller items', async () => {
    const req = new NextRequest('http://localhost:3000/api/products/best-sellers?limit=5');
    const res = await getBestSellers(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('GET /api/products/just-landing returns just landing items', async () => {
    const req = new NextRequest('http://localhost:3000/api/products/just-landing?limit=5');
    const res = await getJustLanding(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('GET /api/products/[id] returns detailed product', async () => {
    const req = new NextRequest('http://localhost:3000/api/products/1');
    const res = await getProductById(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe('1');
    expect(data.slug).toBe('organic-hass-avocado');
    expect(data).toHaveProperty('nutritionFacts');
    expect(data).toHaveProperty('originInfo');
  });

  it('GET /api/products/[id]/related returns related products', async () => {
    const req = new NextRequest('http://localhost:3000/api/products/1/related');
    const res = await getRelatedProducts(req, { params: Promise.resolve({ id: '1' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });
});
