import { prisma } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';
import { ok, fail, handle } from '@/lib/api';

export async function POST(req: Request) {
  return handle(async () => {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) return fail('Email et mot de passe requis');

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return fail('Identifiants invalides', 401);
    }

    await createSession(user.id);
    return ok({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
}
