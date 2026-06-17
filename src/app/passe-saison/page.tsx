import type { Metadata } from 'next';
import { SeasonClient } from './SeasonClient';

export const metadata: Metadata = {
  title: 'Passe Saison — Michelin+',
  description: 'Progresse dans le Passe Saison : paliers, récompenses épiques et missions à points de saison.',
};

export default function PasseSaisonPage() {
  return <SeasonClient />;
}
