import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES: {name: string; path: string}[] = [
  {name: 'home', path: '/'},
  {name: 'collection', path: '/collections/all'},
  {name: 'product', path: '/products/nook-calming-bed'},
  {name: 'bundle product', path: '/products/calm-kit-starter'},
  {name: 'contact', path: '/contact'},
  {name: 'faq', path: '/faq'},
  {name: 'search', path: '/search'},
  {name: '404', path: '/not-a-page'},
];

// WCAG 2.1 A + AA. Fail on any violation at these levels.
for (const {name, path} of PAGES) {
  test(`a11y: ${name} has no WCAG A/AA violations`, async ({page}) => {
    await page.goto(path);
    const results = await new AxeBuilder({page})
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Concise, greppable summary of any violations.
    for (const v of results.violations) {
      for (const node of v.nodes) {
        const cc = node.any?.[0]?.data as
          | {contrastRatio?: number; fgColor?: string; bgColor?: string}
          | undefined;
        // eslint-disable-next-line no-console
        console.log(
          `AXE|${name}|${v.id}|${node.target.join(' ')}|${
            cc ? `${cc.contrastRatio} fg=${cc.fgColor} bg=${cc.bgColor}` : ''
          }`,
        );
      }
    }

    // Surface details in the report if it fails.
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({id: v.id, nodes: v.nodes.length})),
        null,
        2,
      ),
    ).toEqual([]);
  });
}
