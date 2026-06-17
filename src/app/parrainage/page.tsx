import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { totalPoints } from '@/lib/points';
import { tierForPoints } from '@/lib/tiers';
import { ParrainageClient } from './ParrainageClient';

export const dynamic = 'force-dynamic';

export default async function ParrainagePage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const total = await totalPoints(user.id);
  const accent = tierForPoints(total).name === 'Carbone' ? 'prestige' : 'energy';
  return <ParrainageClient name={user.name} points={total} accent={accent} />;
}
