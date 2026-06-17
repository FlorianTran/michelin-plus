import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { RewardsClient } from './RewardsClient';

export const dynamic = 'force-dynamic';

export default async function RewardsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <RewardsClient name={user.name} />;
}
