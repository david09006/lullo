/**
 * Local navigation model. Replaces the Storefront `menu` queries so nav is
 * fully under our control (and doesn't depend on the linked store's menus).
 */

export interface NavLinkItem {
  label: string;
  to: string;
}

export interface NavColumn {
  heading: string;
  links: NavLinkItem[];
}

export const PRIMARY_NAV: NavLinkItem[] = [
  {label: 'Shop', to: '/collections/all'},
  {label: 'Calm Kits', to: '/collections/kits'},
  {label: 'For Anxious Dogs', to: '/collections/for-anxious-dogs'},
  {label: 'Our Story', to: '/about'},
];

export const FOOTER_COLUMNS: NavColumn[] = [
  {
    heading: 'Shop',
    links: [
      {label: 'Beds & Blankets', to: '/collections/beds'},
      {label: 'Enrichment Mats', to: '/collections/mats'},
      {label: 'Slow Feeders', to: '/collections/bowls'},
      {label: 'Calming Wraps', to: '/collections/vests'},
      {label: 'Calming Collars', to: '/collections/collars'},
      {label: 'Crates & Dens', to: '/collections/crates'},
      {label: 'Calm Kits', to: '/collections/kits'},
    ],
  },
  {
    heading: 'Help',
    links: [
      {label: 'Contact', to: '/contact'},
      {label: 'FAQ', to: '/faq'},
      {label: 'Shipping & Returns', to: '/shipping-returns'},
      {label: 'Search', to: '/search'},
    ],
  },
  {
    heading: 'Lullo',
    links: [
      {label: 'Our Story', to: '/about'},
      {label: 'For Anxious Dogs', to: '/collections/for-anxious-dogs'},
      {label: 'Privacy', to: '/privacy'},
    ],
  },
];

export const LEGAL_LINKS: NavLinkItem[] = [
  {label: 'Privacy', to: '/privacy'},
  {label: 'Shipping & Returns', to: '/shipping-returns'},
  {label: 'Contact', to: '/contact'},
];
