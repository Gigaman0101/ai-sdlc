import { test, expect, type Page } from '@playwright/test';

/** Product cards in the results grid link to the detail page and carry an h3 name. */
const productCards = (page: Page) => page.locator('main a[href^="/products/"] h3');

test.describe('Search page', () => {
  test('lists all products when no filter is applied', async ({ page }) => {
    await page.goto('/search');

    await expect(page.getByRole('heading', { level: 1, name: 'All Products' })).toBeVisible();
    await expect(productCards(page).first()).toBeVisible();
    await expect(page.getByText(/Showing \d+ of \d+ items found/)).toBeVisible();
  });

  test('keyword query returns matching products', async ({ page }) => {
    await page.goto('/search?q=avocado');

    await expect(page.getByRole('heading', { level: 1, name: 'Search results for "avocado"' })).toBeVisible();
    await expect(productCards(page).filter({ hasText: /avocado/i }).first()).toBeVisible();
  });

  test('unknown keyword shows the empty state and can reset', async ({ page }) => {
    await page.goto('/search?q=zzz-no-such-product');

    await expect(page.getByRole('heading', { name: 'No products found' })).toBeVisible();
    await page.getByRole('button', { name: 'View All Products' }).click();

    await expect(page).toHaveURL(/\/search$/);
    await expect(page.getByRole('heading', { level: 1, name: 'All Products' })).toBeVisible();
    await expect(productCards(page).first()).toBeVisible();
  });

  test('category filter in the sidebar updates the URL', async ({ page }) => {
    await page.goto('/search');

    await page.getByRole('button', { name: /Raw Meats/ }).click();
    await expect(page).toHaveURL(/category=raw-meats/);
    await expect(productCards(page).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset All' })).toBeVisible();
  });

  test('organic filter and sort are reflected in the URL', async ({ page }) => {
    await page.goto('/search');
    // Products are fetched client-side, so a rendered card means React has hydrated.
    await expect(productCards(page).first()).toBeVisible();

    // Controlled checkbox: state follows the URL, so click and assert on navigation.
    const organic = page.getByRole('checkbox', { name: /Organic Produce Only/ });
    await organic.click();
    await expect(page).toHaveURL(/isOrganic=true/);
    await expect(organic).toBeChecked();

    await page.locator('main select').selectOption('price_asc');
    await expect(page).toHaveURL(/sort=price_asc/);
    await expect(page).toHaveURL(/isOrganic=true/);
  });

  test('clicking a product card opens its detail page', async ({ page }) => {
    await page.goto('/search?q=avocado');

    const card = productCards(page).first();
    await expect(card).toBeVisible();
    await card.click();

    await expect(page).toHaveURL(/\/products\/[^/]+$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
