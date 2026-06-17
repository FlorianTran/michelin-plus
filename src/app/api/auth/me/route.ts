import { getCurrentUser } from '@/lib/auth';
import { ok, handle } from '@/lib/api';

export async function GET() {
  return handle(async () => {
    const user = await getCurrentUser();
    if (!user) return ok({ user: null });
    return ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberId: user.memberId,
        sinceYear: user.sinceYear,
      },
    });
  });
}
