import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders title, hero and main sections', async ({ page }) => {
    await expect(page).toHaveTitle(/Farmart/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Active Summer With Juice Milk 300ml' }),
    ).toBeVisible();

    for (const section of ['Browse by Category', 'Featured Brands', 'Top Saver Today', 'Best Seller', 'Just Landing']) {
      await expect(page.getByRole('heading', { level: 2, name: section })).toBeVisible();
    }
  });

  test('loads categories from the API into the search select', async ({ page }) => {
    const select = page.getByLabel('Select Category');
    // "ALL CATEGORIES" plus at least 8 seeded categories.
    await expect(select.locator('option')).not.toHaveCount(1);
    expect(await select.locator('option').count()).toBeGreaterThanOrEqual(9);
    await expect(select.locator('option[value="fruits-vegetables"]')).toHaveCount(1);
  });

  test('search form navigates to /search with the query', async ({ page }) => {
    const input = page.getByRole('textbox', { name: 'Search products' });
    test.skip(!(await input.isVisible()), 'Header search is hidden on this viewport');
    // Categories are fetched client-side, so seeded options mean React has hydrated
    // and the form's onSubmit handler is attached.
    await expect(page.locator('option[value="fruits-vegetables"]')).toBeAttached();

    await input.fill('avocado');
    await page.getByRole('button', { name: 'Search', exact: true }).click();

    await expect(page).toHaveURL(/\/search\?q=avocado/);
    await expect(page.getByRole('heading', { level: 1, name: 'Search results for "avocado"' })).toBeVisible();
  });

  test('clicking a category card filters search by that category', async ({ page }) => {
    const card = page.locator('.category-card').first();
    await expect(card).toBeVisible();
    await card.click();

    await expect(page).toHaveURL(/\/search\?category=[a-z-]+/);
  });
});
