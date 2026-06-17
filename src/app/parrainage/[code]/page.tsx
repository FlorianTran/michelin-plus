import Link from 'next/link';
import { prisma } from '@/lib/db';
import { REFERRAL_BONUS } from '@/lib/referral';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Card, Badge } from '@/components/grip';
import './invite.css';

export const dynamic = 'force-dynamic';

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const referrer = await prisma.user.findUnique({
    where: { referralCode: code.toUpperCase() },
    select: { name: true, referralCode: true },
  });

  const firstName = referrer?.name.split(' ')[0] ?? null;
  const joinHref = referrer ? `/login?ref=${encodeURIComponent(referrer.referralCode!)}&mode=signup` : '/login?mode=signup';

  return (
    <div className="inv">
      <MarketingHeader />
      <main className="inv__main mch-container">
        <section className="inv__hero">
          <div className="inv__copy">
            <span className="mch-eyebrow" style={{ color: 'var(--gold-400)' }}>Invitation au club</span>
            <h1 className="mch-title inv__title">
              {firstName ? <>{firstName} t’invite dans <em>Michelin+</em>.</> : <>Rejoins <em>Michelin+</em>.</>}
            </h1>
            <p className="mch-lead">
              Le club des cyclistes premium. Roule, gagne des points, grimpe les paliers
              (Aluminium → Titane → Carbone) et débloque récompenses & éditions numérotées.
              {firstName ? <> En entrant via l’invitation de {firstName}, vous démarrez l’aventure ensemble.</> : null}
            </p>
            <div className="inv__perks">
              <Badge tone="energy" dot>Carte de membre offerte</Badge>
              <Badge tone="prestige" dot>+{REFERRAL_BONUS.toLocaleString('fr-FR')} pts pour ton parrain</Badge>
              <Badge tone="blue" dot>Accès au clan</Badge>
            </div>
            <div className="inv__cta">
              <Link href={joinHref} className="inv__btn inv__btn--primary">Rejoindre le club</Link>
              <Link href="/" className="inv__btn inv__btn--ghost">Découvrir le programme</Link>
            </div>
            {!referrer ? (
              <p className="inv__note">Ce lien d’invitation n’est plus valide, mais tu peux quand même rejoindre le club.</p>
            ) : null}
          </div>

          <div className="inv__media">
            <Card variant="hero" padding="none" className="inv__mediacard">
              <img src="/cards/card-handover.png" alt="Carte Michelin+ remise de main en main" />
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
