import { prisma } from '@/lib/db';
import { hashPassword, createSession } from '@/lib/auth';
import { ok, fail, handle } from '@/lib/api';

export async function POST(req: Request) {
  return handle(async () => {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = String(body.name || '').trim();

    if (!email || !password || !name) return fail('Email, nom et mot de passe requis');
    if (password.length < 6) return fail('Mot de passe trop court (min. 6 caractères)');

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return fail('Un compte existe déjà avec cet email', 409);

    const count = await prisma.user.count();
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: await hashPassword(password),
        memberId: `M+ ${String(1000 + count).padStart(4, '0')} ${String(1000 + count * 7).slice(-4)}`,
        sinceYear: String(new Date().getFullYear()),
      },
    });

    await createSession(user.id);
    return ok({ id: user.id, name: user.name, email: user.email, role: user.role });
  });
}
