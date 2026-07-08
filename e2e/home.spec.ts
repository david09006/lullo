import {test, expect} from '@playwright/test';

test.describe('home', () => {
  test('renders the hero, nav, featured products, and footer', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lullo/);
    await expect(page.getByRole('heading', {level: 1})).toContainText('calmer');
    await expect(page.getByRole('link', {name: 'Shop the Calm Kit'})).toBeVisible();
    // Featured product cards
    await expect(page.locator('.product-card').first()).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('primary CTA leads to the Calm Kits collection', async ({page}) => {
    await page.goto('/');
    await page.getByRole('link', {name: 'Shop the Calm Kit'}).click();
    await expect(page).toHaveURL(/\/collections\/kits/);
    await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  });
});
