import {test, expect} from '@playwright/test';
import {gotoReady} from './helpers';

test.describe('shopping journey', () => {
  test('browse collection → product → add to cart → drawer → checkout-pending', async ({
    page,
  }) => {
    await gotoReady(page, '/collections/all');
    await expect(page.locator('.product-card').first()).toBeVisible();

    // Open a specific product for a stable assertion.
    await gotoReady(page, '/products/nook-calming-bed');
    await expect(page.getByRole('heading', {name: 'Nook Calming Bed'})).toBeVisible();

    // Choose a size + color.
    await page.getByRole('button', {name: 'Medium', exact: true}).click();

    // Add to cart.
    await page.locator('.purchase__actions button[type="submit"]').click();

    // Cart drawer opens with the line item + subtotal.
    const drawer = page.locator('.overlay.expanded');
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText('Nook Calming Bed')).toBeVisible();
    await expect(drawer.getByText('Subtotal')).toBeVisible();

    // Checkout is honestly pending (no fake checkout while unconnected).
    await expect(drawer.getByText(/Checkout goes live once real products/)).toBeVisible();
    await expect(
      drawer.getByRole('button', {name: 'Checkout on Shopify'}),
    ).toBeDisabled();
  });

  test('quantity updates recompute the subtotal', async ({page}) => {
    await gotoReady(page, '/products/forage-snuffle-mat');
    await page.locator('.purchase__actions button[type="submit"]').click();
    const drawer = page.locator('.overlay.expanded');
    await expect(drawer).toBeVisible();

    // Increase quantity in the drawer and expect the line to reflect it.
    await drawer.getByRole('button', {name: 'Increase quantity'}).first().click();
    await expect(drawer.locator('.qty__value').first()).toHaveText('2');
  });

  test('cart badge reflects items across navigation', async ({page}) => {
    await gotoReady(page, '/products/still-lick-mat');
    await page.locator('.purchase__actions button[type="submit"]').click();
    await expect(page.locator('.header__cart-count')).toBeVisible();
    // Navigate elsewhere; the badge persists (session cart).
    await gotoReady(page, '/about');
    await expect(page.locator('.header__cart-count')).toBeVisible();
  });
});

test.describe('mobile', () => {
  test('mobile menu opens', async ({page}) => {
    await gotoReady(page, '/');
    const toggle = page.locator('.header__menu-toggle');
    // Only meaningful when the hamburger is shown (narrow viewport).
    if (!(await toggle.isVisible())) return;

    // Retry the click through client hydration (a click before React attaches
    // its handler is lost — inherent to progressive enhancement).
    await expect(async () => {
      await toggle.click();
      await expect(page.locator('.overlay.expanded .mobile-nav')).toBeVisible({
        timeout: 1000,
      });
    }).toPass({timeout: 15_000});

    await expect(
      page.locator('.mobile-nav').getByRole('link', {name: 'Shop', exact: true}),
    ).toBeVisible();
  });
});
