import type {Page} from '@playwright/test';

/**
 * Navigate and wait until the client has hydrated (handlers attached). Prevents
 * flaky "click lost before hydration" failures in interaction tests.
 */
export async function gotoReady(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForSelector('html[data-hydrated="true"]', {timeout: 15_000});
}
