import Link from 'next/link';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Button } from '@/components/grip';
import { TIERS, type TierName } from '@/lib/tiers';
import './tiers.css';

export const metadata = {
  title: 'Michelin+ — Paliers de carte',
  description:
    "Trois paliers, trois matières. De l'aluminium brossé au carbone tissé liseré d'or — ta carte de fidélité Michelin+ monte en gamme à mesure que tu roules.",
};

/** Per-tier presentation that isn't part of the loyalty engine (visual skin + sample card face). */
interface TierPresentation {
  cardClass: string;
  paletteLabel: string;
  rank: string;
  pts: string;
  finish: string;
}

const PRESENTATION: Record<TierName, TierPresentation> = {
  Aluminium: {
    cardClass: 'card--alu',
    paletteLabel: '0 — 5 000 pts',
    rank: 'Palier 01 · entrée',
    pts: '2 480',
    finish: 'Aluminium brossé. Ta première carte numérotée, dès l’activation.',
  },
  Titane: {
    cardClass: 'card--ti',
    paletteLabel: '5 000 — 15 000 pts',
    rank: 'Palier 02 · confirmé',
    pts: '12 480',
    finish: 'Titane gunmetal, reflet chaud. Accès aux récompenses premium et aux drops.',
  },
  Carbone: {
    cardClass: 'card--carbon',
    paletteLabel: '15 000 pts +',
    rank: 'Palier 03 · élite',
    pts: '28 900',
    finish: 'Carbone tissé, liseré d’or. Éditions numérotées, statut ambassadeur, événements VIP.',
  },
};

export default function TiersPage() {
  return (
    <div className="tiers-page">
      <MarketingHeader active="/tiers" />

      <div className="tiers-wrap">
        <header className="tiers-head">
          <span className="tiers-head__chip">Carte de fidélité · 3 paliers</span>
          <h1>Plus tu roules, plus ta carte change de matière.</h1>
          <p>
            Chaque palier débloque une carte numérotée d’une matière plus rare. De l’aluminium
            brossé au carbone tissé liseré d’or — le statut se voit.
          </p>
        </header>

        {/* Hero — flocked-tyre product showcase (Léa Moreau · 3 paliers) */}
        <div className="tiers-hero">
          <img
            src="/tiers/tires-flockes.png"
            alt="Pneus floqués Michelin+ — Léa Moreau, paliers Aluminium, Titane et Carbone"
          />
          <div className="tiers-hero__overlay" />
          <div className="tiers-hero__cap">
            <b>Léa Moreau · les 3 paliers</b>
            <span>Aluminium · Titane · Carbone — chaque matière, une édition floquée.</span>
          </div>
        </div>

        <div className="tiers-grid">
          {TIERS.map((tier) => {
            const p = PRESENTATION[tier.name];
            const palier = `Palier ${String(tier.level).padStart(2, '0')}`;
            return (
              <article className="tier" key={tier.name}>
                <div className={`card ${p.cardClass}`}>
                  {tier.name === 'Carbone' && <div className="card__tex" />}
                  <div className="card__top">
                    <span className="card__brand">
                      MICHELIN<b>+</b>
                    </span>
                    <span className="card__tier">{palier}</span>
                  </div>
                  <div className="card__chip" />
                  <div className="card__name">
                    <span className="card__flag" />
                    Léa Moreau
                  </div>
                  <div className="card__tread" />
                  <div className="card__row">
                    <div>
                      <div className="card__id">M+ 0042 1180</div>
                      <div className="card__since">Membre depuis 2024</div>
                    </div>
                    <div className="card__pts">
                      <b>{p.pts}</b>
                      <span>points</span>
                    </div>
                  </div>
                </div>

                <div className="meta">
                  <div className="meta__rank">{p.rank}</div>
                  <div className="meta__top">
                    <span className="meta__name">{tier.name}</span>
                    <span className="meta__thresh">{p.paletteLabel}</span>
                  </div>
                  <p>{p.finish}</p>
                  <div className="meta__perks">
                    {tier.perks.map((perk) => (
                      <span className="perk" key={perk}>
                        {perk}
                      </span>
                    ))}
                  </div>
                  <div className="meta__cta">
                    {tier.level === 1 ? (
                      <Link href="/login">
                        <Button variant="outline" size="sm">
                          Rejoindre
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/dashboard">
                        <Button
                          variant={tier.tone === 'prestige' ? 'prestige' : 'outline'}
                          size="sm"
                        >
                          Voir ma progression
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer CTA */}
        <section className="tiers-cta">
          <div className="tiers-cta__txt">
            <h2>Ta carte t’attend.</h2>
            <p>
              Active ta carte, connecte Strava et regarde ta matière évoluer. Chaque kilomètre te
              rapproche du carbone.
            </p>
          </div>
          <div className="tiers-cta__actions">
            <Link href="/login">
              <Button variant="blue" size="lg">
                Rejoindre le club
              </Button>
            </Link>
            <Link href="/rewards">
              <Button variant="prestige" size="lg">
                Voir mes récompenses
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
