import {test, expect} from '@playwright/test';
import {gotoReady} from './helpers';

test.describe('contact form', () => {
  test('shows validation errors on empty submit', async ({page}) => {
    await gotoReady(page, '/contact');
    await page.getByRole('button', {name: 'Send message'}).click();
    await expect(page.getByText('This field is required.').first()).toBeVisible();
    // Still on the contact page (not navigated away).
    await expect(page).toHaveURL(/\/contact/);
  });

  test('accepts a valid submission', async ({page}) => {
    await gotoReady(page, '/contact');
    const form = page.locator('.contact__form');
    await form.getByLabel('Your name').fill('Dana');
    await form.getByLabel('Email', {exact: true}).fill('dana@example.com');
    await form
      .getByLabel('Message')
      .fill('My rescue lab loves the Nook bed — do you ship to Canada?');
    await page.getByRole('button', {name: 'Send message'}).click();
    await expect(page.getByRole('heading', {name: /talk soon/i})).toBeVisible();
  });

  test('rejects an invalid email', async ({page}) => {
    await gotoReady(page, '/contact');
    const form = page.locator('.contact__form');
    await form.getByLabel('Your name').fill('Dana');
    await form.getByLabel('Email', {exact: true}).fill('not-an-email');
    await form.getByLabel('Message').fill('This is a long enough message.');
    await page.getByRole('button', {name: 'Send message'}).click();
    await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  });
});

test.describe('404', () => {
  test('renders the branded not-found page', async ({page}) => {
    const res = await page.goto('/definitely-not-a-real-page');
    expect(res?.status()).toBe(404);
    await expect(page.locator('.error-page__code')).toHaveText('404');
    await expect(page.getByRole('link', {name: 'Back home'})).toBeVisible();
  });
});
