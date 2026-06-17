// Michelin+ — Grip · join a clan via an ambassador code (real DB write).
// Resolves the clan owned by the ambassador whose AmbassadorProfile.code matches,
// then adds the current user as a ClanMember. Powers the dashboard "Saisis le code
// de ton ambassadeur" CTA.
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { ok, fail, handle } from '@/lib/api';

export async function POST(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));
    const code = String(body.code || '').trim().toUpperCase();
    if (!code) return fail('Code requis');

    const profile = await prisma.ambassadorProfile.findUnique({ where: { code } });
    if (!profile) return fail('Code ambassadeur inconnu', 404);

    const clan = await prisma.clan.findFirst({ where: { ambassadorUserId: profile.userId } });
    if (!clan) return fail("Cet ambassadeur n'anime pas encore de clan", 404);

    const existing = await prisma.clanMember.findUnique({
      where: { clanId_userId: { clanId: clan.id, userId: user.id } },
    });
    if (existing) return fail('Tu fais déjà partie de ce clan', 409);

    await prisma.clanMember.create({ data: { clanId: clan.id, userId: user.id, km: 0 } });
    const size = await prisma.clanMember.count({ where: { clanId: clan.id } });

    return ok({ ok: true, clan: { id: clan.id, name: clan.name, size } });
  });
}
