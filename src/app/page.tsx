'use client';

import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Badge, Button } from '@/components/grip';
import './landing.css';

interface HeroStat {
  count: number;
  suffix?: string;
  label: string;
}

const HERO_STATS: HeroStat[] = [
  { count: 442, label: 'récompenses au catalogue' },
  { count: 3, label: 'paliers de statut' },
  { count: 500, suffix: ' éd.', label: 'séries numérotées' },
];

/** Kinetic count-up — easeOutCubic, respects prefers-reduced-motion. */
function HeroStatValue({ count, suffix = '' }: { count: number; suffix?: string }) {
  const ref = React.useRef<HTMLElement>(null);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(count);
      return;
    }

    let raf = 0;
    let started = false;
    const run = () => {
      const duration = 1400;
      let start: number | undefined;
      const tick = (t: number) => {
        if (start === undefined) start = t;
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(count * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [count]);

  return (
    <b ref={ref}>
      {display.toLocaleString('fr-FR')}
      {suffix}
    </b>
  );
}

export default function Home() {
  // Scroll-reveal: add `.in` to every `.mch-reveal` as it enters the viewport.
  React.useEffect(() => {
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.mch-reveal'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      reveals.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="landing">
      <MarketingHeader />

      {/* HERO */}
      <section className="lp-hero">
        <div
          className="lp-hero__bg"
          style={{ backgroundImage: "url('/bardet/bardet-hero.png')" }}
        />
        <div className="lp-hero__overlay" />
        <div className="lp-hero__aurora" />
        <div className="mch-container lp-hero__inner">
          <div className="lp-hero__flag">
            <span className="tag">Club premium · By Michelin LB 2 Wheels</span>
          </div>
          <h1 className="mch-title">
            Chaque kilomètre te rapproche de l’
            <em>exception</em>.
          </h1>
          <p className="lp-hero__sub mch-lead">
            Roule, gagne des points — en magasin ou en ligne — grimpe les paliers et débloque
            récompenses, éditions limitées numérotées et l’accès à la communauté.
          </p>
          <div className="lp-hero__cta">
            <Link href="/login">
              <Button variant="blue" size="lg">
                Rejoindre le club
              </Button>
            </Link>
            <a href="#video">
              <Button variant="outline" size="lg">
                Voir le programme
              </Button>
            </a>
          </div>
          <div className="lp-hero__stats">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="lp-hero__stat">
                <HeroStatValue count={stat.count} suffix={stat.suffix} />
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lp-scroll-hint">Défile</div>
      </section>

      {/* VIDEO / DEMO */}
      <section className="mch-section" id="video" style={{ paddingTop: 'clamp(40px,6vw,80px)' }}>
        <div className="mch-container">
          <div className="lp-sec-head mch-reveal" style={{ marginBottom: 28 }}>
            <span className="lp-chip">Le programme en 40 secondes</span>
            <h2 className="mch-title">D’un achat à une appartenance.</h2>
          </div>
          <div className="lp-video-wrap mch-reveal">
            <div className="lp-video-frame__bar">
              <i />
              <i />
              <i />
            </div>
            <div className="lp-video-stage">
              <span className="lp-video-stage__play" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="lp-video-stage__cap">Aperçu · le programme en 40 secondes</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section className="mch-section">
        <div className="mch-container">
          <div className="lp-sec-head mch-reveal">
            <span className="lp-chip">Le constat</span>
            <h2 className="mch-title">On ne vend pas un pneu. On crée une appartenance.</h2>
          </div>
          <div className="lp-narrative">
            <div className="mch-reveal">
              <Badge tone="neutral" dot>
                Le cercle vicieux
              </Badge>
              <h3>Michelin est invisible chez le passionné</h3>
              <p>
                Achat en B2B, choix dicté par le revendeur, aucune relation directe.{' '}
                <span className="vicious">
                  Faible demande exprimée → peu de visibilité → faible demande.
                </span>{' '}
                La marque mythique reste muette là où la passion est la plus forte.
              </p>
            </div>
            <div className="mch-reveal">
              <Badge tone="energy" dot>
                La solution Michelin+
              </Badge>
              <h3>La couche d’engagement post-achat</h3>
              <p>
                Pas de boutique.{' '}
                <span className="solution">
                  Une carte glissée dans l’emballage active le digital après la vente
                </span>{' '}
                — peu importe le canal. Points, paliers, communauté : on transforme l’achat en
                entrée dans un écosystème qui crée la demande, les avis et le bouche-à-oreille.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="mch-section"
        id="how"
        style={{
          background: 'radial-gradient(60% 60% at 50% 50%, rgba(232,194,74,.05), transparent 70%)',
        }}
      >
        <div className="mch-container">
          <div className="lp-sec-head mch-reveal">
            <span className="lp-chip">En 3 temps</span>
            <h2 className="mch-title">Comment ça marche</h2>
          </div>
          <div className="lp-steps">
            <div className="lp-step mch-reveal">
              <div className="lp-step__n">01</div>
              <div className="lp-step__ic" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h4>Achète</h4>
              <p>Tes pneus Michelin, où tu veux — en magasin ou en ligne. Aucune contrainte de canal.</p>
            </div>
            <div className="lp-step mch-reveal">
              <div className="lp-step__n">02</div>
              <div className="lp-step__ic" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20M7 15h4" />
                </svg>
              </div>
              <h4>Active</h4>
              <p>
                Saisis le code de la carte reçue dans l’emballage. Ton compte Michelin+ est crédité
                instantanément.
              </p>
            </div>
            <div className="lp-step mch-reveal">
              <div className="lp-step__n">03</div>
              <div className="lp-step__ic" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </div>
              <h4>Roule &amp; gagne</h4>
              <p>Connecte Strava : tes kilomètres deviennent des points. Grimpe les paliers, débloque les drops.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIERS SHOWCASE */}
      <section className="mch-section" id="tiers">
        <div className="mch-container">
          <div className="lp-sec-head mch-reveal">
            <span className="lp-chip lp-chip--gold">Paliers de statut</span>
            <h2 className="mch-title">Ton statut, dans la matière.</h2>
            <p className="mch-lead" style={{ marginTop: 14 }}>
              Plus tu roules et tu achètes, plus ta carte de fidélité monte en gamme — de l’aluminium
              brossé au carbone tissé, liseré d’or.
            </p>
          </div>
          <div className="lp-tiers-row">
            <Link href="/tiers" className="lp-tier-card lp-tier--alu mch-reveal">
              <div className="lp-tier-card__head">
                <span className="lp-tier-card__brand">
                  Michelin<b>+</b>
                </span>
                <span className="lp-tier-card__pill">Palier 01</span>
              </div>
              <div className="lp-tier-card__lab">
                <div className="m">Aluminium</div>
                <div className="t">0 – 5 000 pts · l’entrée du club</div>
              </div>
            </Link>
            <Link href="/tiers" className="lp-tier-card lp-tier--tit mch-reveal">
              <div className="lp-tier-card__head">
                <span className="lp-tier-card__brand">
                  Michelin<b>+</b>
                </span>
                <span className="lp-tier-card__pill">Palier 02</span>
              </div>
              <div className="lp-tier-card__lab">
                <div className="m">Titane</div>
                <div className="t">5 000 – 15 000 pts · le confirmé</div>
              </div>
            </Link>
            <Link href="/tiers" className="lp-tier-card lp-tier--car mch-reveal">
              <div className="lp-tier-card__tex" />
              <div className="lp-tier-card__head">
                <span className="lp-tier-card__brand">
                  Michelin<b>+</b>
                </span>
                <span className="lp-tier-card__pill">Palier 03</span>
              </div>
              <div className="lp-tier-card__lab">
                <div className="m">Carbone</div>
                <div className="t">15 000 pts + · l’élite, éditions numérotées</div>
              </div>
            </Link>
          </div>
          <p className="lp-tier-note mch-reveal" style={{ marginTop: 22 }}>
            <b>Carbone</b> débloque les éditions numérotées, les drops prioritaires et le statut
            ambassadeur.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mch-section" id="features">
        <div className="mch-container">
          <div className="lp-sec-head mch-reveal">
            <span className="lp-chip">Le club</span>
            <h2 className="mch-title">Ce que tu débloques</h2>
          </div>
          <div className="lp-features">
            <div className="lp-feature mch-reveal">
              <span className="lp-feature__ic">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-5z" />
                </svg>
              </span>
              <h4>Points &amp; paliers</h4>
              <p>Achats + kilomètres = points. Trois paliers de statut : Aluminium, Titane, Carbone.</p>
            </div>
            <div className="lp-feature mch-reveal">
              <span className="lp-feature__ic">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <h4>Clans &amp; classements</h4>
              <p>Rejoins le clan d’un ambassadeur. Cumule les km, grimpe le classement, gagne des tirages.</p>
            </div>
            <div className="lp-feature lp-feature--gold mch-reveal">
              <span className="lp-feature__ic">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
                </svg>
              </span>
              <h4>Éditions numérotées</h4>
              <p>Des pneus floqués en série limitée — ton numéro, gravé. La rareté que les autres n’ont pas.</p>
            </div>
            <div className="lp-feature lp-feature--gold mch-reveal">
              <span className="lp-feature__ic">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  <path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
                </svg>
              </span>
              <h4>Statut ambassadeur</h4>
              <p>Le badge « Créateur Michelin », un % sur les ventes, ton propre clan à animer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PASSE SAISON */}
      <section className="mch-section" id="passe">
        <div className="mch-container">
          <div className="lp-passe mch-reveal">
            <div>
              <span className="lp-chip lp-chip--gold">Passe Saison 01 · L’Ascension</span>
              <h2 className="mch-title">
                Une <em>saison</em>, 50 paliers, des récompenses à chaque pas.
              </h2>
              <p>
                Chaque palier débloque des goodies, des avantages et des éditions limitées. Le Passe
                Carbone ouvre la voie aux pneus signés et aux places d’événements VIP.
              </p>
              <Link href="/passe-saison">
                <Button variant="prestige" size="lg">
                  Découvrir le Passe
                </Button>
              </Link>
            </div>
            <div className="lp-passe__ladder">
              <div className="lp-prow">
                <span className="lp-prow__n">14</span>
                <div className="lp-prow__b">
                  <b>T-shirt édition saison</b>
                  <span>Palier actuel · Standard</span>
                </div>
                <span className="lp-prow__tag" style={{ color: 'var(--text-secondary)' }}>
                  Réclamé
                </span>
              </div>
              <div className="lp-prow lp-prow--epic">
                <span className="lp-prow__n">20</span>
                <div className="lp-prow__b">
                  <b>Power Cup Carbone #042</b>
                  <span>Édition numérotée · Carbone</span>
                </div>
                <span className="lp-prow__tag">Épique</span>
              </div>
              <div className="lp-prow lp-prow--epic">
                <span className="lp-prow__n">50</span>
                <div className="lp-prow__b">
                  <b>Pneus signés + Weekend VIP</b>
                  <span>Grand tirage de fin de saison</span>
                </div>
                <span className="lp-prow__tag">Grand prix</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOON / VITRINE */}
      <section
        className="mch-section"
        id="soon"
        style={{
          background: 'radial-gradient(60% 60% at 50% 50%, rgba(232,194,74,.05), transparent 70%)',
        }}
      >
        <div className="mch-container">
          <div className="lp-sec-head mch-reveal">
            <span className="lp-chip lp-chip--gold">Vision · bientôt</span>
            <h2 className="mch-title">La suite du programme</h2>
            <p className="mch-lead" style={{ marginTop: 14 }}>
              Au-delà du digital : la carte dans ton wallet, une carte physique premium chez les
              revendeurs, et l’accès aux événements VIP Michelin.
            </p>
          </div>
          <div className="lp-soon">
            <div className="lp-soon__tile mch-reveal">
              <img
                src="/cards/card-handover.png"
                alt="Carte Michelin+ présentée au comptoir"
              />
              <Badge tone="prestige" dot style={{ alignSelf: 'flex-start' }}>
                Bientôt
              </Badge>
              <h4>Carte au wallet</h4>
              <p>Apple &amp; Google Wallet — ta carte Michelin+ toujours sur toi.</p>
            </div>
            <div className="lp-soon__tile mch-reveal">
              <img
                src="/cards/card-carbon-premium.png"
                alt="Carte physique Michelin+ en carbone, liseré or"
              />
              <Badge tone="prestige" dot style={{ alignSelf: 'flex-start' }}>
                Bientôt
              </Badge>
              <h4>Carte physique premium</h4>
              <p>Aux paliers hauts : une carte métal NFC, utilisable chez les revendeurs.</p>
            </div>
            <div className="lp-soon__tile mch-reveal">
              <img
                src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=60&sat=-100"
                alt=""
              />
              <Badge tone="prestige" dot style={{ alignSelf: 'flex-start' }}>
                Bientôt
              </Badge>
              <h4>Événements VIP</h4>
              <p>Tirages pour des places à des courses sponsorisées Michelin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AMBASSADOR */}
      <section className="mch-section" id="ambassador">
        <div className="mch-container">
          <div className="lp-ambassador mch-reveal">
            <div className="lp-ambassador__bg">
              <img src="/bardet/bardet-road.jpg" alt="" />
            </div>
            <div>
              <span className="mch-eyebrow" style={{ color: 'var(--gold-400)' }}>
                Programme ambassadeur
              </span>
              <h2 className="mch-title">
                Deviens un <em>Créateur Michelin</em>.
              </h2>
              <p>
                Promeus, gagne un pourcentage, anime ton clan. Ton code recrute, tes membres roulent,
                ton cercle grandit — et débloque des éditions à ton nom.
              </p>
              <Link href="/programme-ambassadeur">
                <Button variant="prestige" size="lg">
                  Candidater
                </Button>
              </Link>
            </div>
            <div className="mch-card mch-card--blue mch-card--pad-lg lp-amb-card">
              <Badge tone="prestige" dot>
                Cercle restreint
              </Badge>
              <div className="lp-amb-card__pct">
                12<span>% reversés</span>
              </div>
              <div className="lp-amb-card__tread" />
              <p>Sur chaque vente via ton code. Plus ton clan roule, plus ton statut monte.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
