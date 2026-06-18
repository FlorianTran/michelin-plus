import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ok, fail, handle } from '@/lib/api';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  return handle(async () => {
    const { id } = await params;
    const me = await getCurrentUser();

    const clan = await prisma.clan.findUnique({ where: { id } });
    if (!clan) return fail('Équipe introuvable', 404);

    const roster = await prisma.clanMember.findMany({
      where: { clanId: id },
      orderBy: { km: 'desc' },
      include: { user: { select: { id: true, name: true, role: true, avatarUrl: true } } },
    });

    const rows = roster.map((m, i) => ({
      rank: i + 1,
      userId: m.user.id,
      name: m.user.name,
      meta: m.user.role === 'ambassador' ? 'Ambassadeur' : 'Membre',
      km: m.km,
      avatar: m.user.avatarUrl,
      you: me?.id === m.user.id,
    }));

    return ok({ clan: { id: clan.id, name: clan.name }, size: rows.length, rows });
  });
}
