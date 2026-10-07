import { test, expect } from '@playwright/test';

const AVOCADO = 'Fresh Organic Hass Avocado (Pack of 4)';

test.describe('Product detail page', () => {
  test('/products redirects to the first product', async ({ page }) => {
    await page.goto('/products');

    await expect(page).toHaveURL(/\/products\/1$/);
    await expect(page.getByRole('heading', { level: 1, name: AVOCADO })).toBeVisible();
  });

  test('quantity stepper updates the add-to-cart total', async ({ page }) => {
    await page.goto('/products/1');

    const addToCart = page.getByRole('button', { name: /^Add To Cart • \$/ });
    await expect(addToCart).toHaveText(/\$6\.49/);

    await page.getByRole('button', { name: 'Increase quantity' }).first().click();
    await expect(page.getByLabel('Item quantity').first()).toHaveValue('2');
    await expect(addToCart).toHaveText(/\$12\.98/);
  });

  test('add to cart opens the cart drawer with a toast', async ({ page }) => {
    await page.goto('/products/1');

    await page.getByRole('button', { name: /^Add To Cart • \$/ }).click();

    await expect(page.getByRole('dialog', { name: 'Shopping Cart Drawer' })).toBeAttached();
    await expect(page.getByText(`Added 1x "${AVOCADO}" to your cart!`)).toBeVisible();
  });

  test('cart drawer panel is fully visible and can be closed', async ({ page }) => {
    // Known bug: `--spacing-md: 12px` in app/globals.css @theme makes Tailwind v4
    // resolve `max-w-md` on the CartDrawer panel to 12px, so the panel renders
    // off-screen. Remove `test.fail()` once the drawer width is fixed.
    test.fail(true, 'CartDrawer max-w-md collapses to 12px (spacing token collision)');

    await page.goto('/products/1');
    await page.getByRole('button', { name: /^Add To Cart • \$/ }).click();

    const drawer = page.getByRole('dialog', { name: 'Shopping Cart Drawer' });
    await expect(drawer).toBeInViewport({ ratio: 1, timeout: 5_000 });

    await page.getByRole('button', { name: 'Close cart' }).click({ timeout: 5_000 });
    await expect(drawer).toBeHidden();
  });

  test('wishlist button toggles its state', async ({ page }) => {
    await page.goto('/products/1');

    await page.getByRole('button', { name: 'Add to wishlist', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Remove from wishlist', exact: true })).toBeVisible();
    await expect(page.getByText('Added to your wishlist!')).toBeVisible();
  });
});
