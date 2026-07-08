import {test, expect} from '@playwright/test';

// Smoke-level journey; expanded into full flows (product → cart → checkout
// handoff, form validation, 404) during the QA phase.
test('home page loads and renders a heading', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('h1, h2').first()).toBeVisible();
});
