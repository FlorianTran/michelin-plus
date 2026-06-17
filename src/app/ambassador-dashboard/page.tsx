import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AmbassadorClient } from './AmbassadorClient';

export const dynamic = 'force-dynamic';

export default async function AmbassadorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return <AmbassadorClient />;
}
