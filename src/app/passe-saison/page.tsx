import type { Metadata } from 'next';
import { SeasonClient } from './SeasonClient';

export const metadata: Metadata = {
  title: 'Étapes — Michelin+',
  description: 'Progresse dans les étapes : paliers, récompenses épiques et missions à points.',
};

export default function PasseSaisonPage() {
  return <SeasonClient />;
}
