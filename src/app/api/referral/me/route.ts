import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { uniqueReferralCode, referralLink, REFERRAL_BONUS } from '@/lib/referral';
import { ok, handle } from '@/lib/api';

/** The current member's referral state: code, link, filleuls, points earned. */
export async function GET(req: Request) {
  return handle(async () => {
    const user = await requireUser();

    // Backfill a code for legacy accounts created before referrals existed.
    let code = user.referralCode;
    if (!code) {
      code = await uniqueReferralCode(prisma, user.name);
      await prisma.user.update({ where: { id: user.id }, data: { referralCode: code } });
    }

    const referred = await prisma.user.findMany({
      where: { referredById: user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, createdAt: true },
    });
    const earned = await prisma.pointsEntry.aggregate({
      where: { userId: user.id, type: 'referral' },
      _sum: { amount: true },
    });

    const origin = new URL(req.url).origin;
    return ok({
      code,
      link: referralLink(code, origin),
      bonus: REFERRAL_BONUS,
      count: referred.length,
      totalEarned: earned._sum.amount ?? 0,
      referred: referred.map((r) => ({ name: r.name, joinedAt: r.createdAt })),
    });
  });
}
