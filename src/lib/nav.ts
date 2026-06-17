// Shared navigation + footer config (single source of truth for chrome).
import type { HeaderLink, FooterColumn } from '@/components/grip';

export const MARKETING_NAV: HeaderLink[] = [
  { label: 'Comment ça marche', href: '/#how' },
  { label: 'Paliers', href: '/tiers' },
  { label: 'Saison', href: '/passe-saison' },
  { label: 'Ambassadeur', href: '/programme-ambassadeur' },
  { label: 'Revendeurs', href: '/revendeurs' },
];

export const APP_NAV: { label: string; href: string; key: string }[] = [
  { label: 'Tableau de bord', href: '/dashboard', key: 'dashboard' },
  { label: 'Récompenses', href: '/rewards', key: 'rewards' },
  { label: 'Paliers', href: '/tiers', key: 'tiers' },
  { label: 'Parrainage', href: '/parrainage', key: 'parrainage' },
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Programme',
    links: [
      { label: 'Comment ça marche', href: '/#how' },
      { label: 'Paliers', href: '/tiers' },
      { label: 'Passe Saison', href: '/passe-saison' },
    ],
  },
  {
    title: 'Communauté',
    links: [
      { label: 'Espace membre', href: '/dashboard' },
      { label: 'Ambassadeurs', href: '/programme-ambassadeur' },
      { label: 'Récompenses', href: '/rewards' },
      { label: 'Revendeurs', href: '/revendeurs' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { label: 'FAQ', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Démo · /debug', href: '/debug' },
    ],
  },
];
