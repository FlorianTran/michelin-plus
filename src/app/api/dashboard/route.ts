import { requireUser } from '@/lib/auth';
import { getDashboardState } from '@/lib/dashboard';
import { ok, handle } from '@/lib/api';

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    const state = await getDashboardState(user);
    return ok(state);
  });
}
