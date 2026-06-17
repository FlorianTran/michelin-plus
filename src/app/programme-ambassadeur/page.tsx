import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Badge, Button } from '@/components/grip';
import { TeamProgress } from './TeamProgress';
import { Reveal } from './Reveal';
import './programme.css';

export const metadata: Metadata = {
  title: 'Programme Ambassadeur — Michelin+',
  description:
    "Deviens Créateur Michelin : un pourcentage reversé sur tes ventes, ton propre clan à animer et des éditions à ton nom. Démo aspirationnelle autour de Romain Bardet.",
};

interface ValueProp {
  big?: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}

const VALUES: ValueProp[] = [
  {
    big: '12%',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
    title: 'Reversés sur tes ventes',
    body: 'Un pourcentage sur chaque pneu Michelin acheté via ton code. Plus ton clan roule, plus ton statut monte.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Ton propre clan',
    body: 'Recrute, anime, fédère. Tes membres cumulent les kilomètres sous tes couleurs et grimpent le classement ensemble.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
      </svg>
    ),
    title: 'Des éditions à ton nom',
    body: 'Des séries limitées numérotées floquées à ton effigie — la rareté que seuls les Créateurs Michelin débloquent.',
  },
];

interface Step {
  n: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Candidate',
    body: 'Rejoins le cercle restreint des ambassadeurs. On évalue ton profil de coureur et ta communauté.',
  },
  {
    n: '02',
    title: 'Reçois ton code',
    body: 'Ton code personnel recrute tes membres et trace chaque vente. Ton clan se constitue, ton espace s’ouvre.',
  },
  {
    n: '03',
    title: 'Anime & gagne',
    body: 'Tes membres roulent, ton cercle grandit. Tu touches ton pourcentage et débloques tes éditions signées.',
  },
];

export default function ProgrammeAmbassadeurPage() {
  return (
    <div className="pa">
      <MarketingHeader active="/programme-ambassadeur" />

      {/* HERO */}
      <section className="pa-hero">
        <div className="pa-hero__photo">
          <picture>
            <source srcSet="/bardet/bardet-hero.webp" type="image/webp" />
            <img src="/bardet/bardet-hero.png" alt="Romain Bardet, coureur professionnel" />
          </picture>
        </div>
        <div className="pa-hero__overlay" />
        <div className="mch-container pa-hero__inner">
          <div className="pa-hero__tags">
            <span className="pa-chip">Programme Ambassadeur</span>
            <Badge tone="neutral" dot>Démo · exemple illustratif</Badge>
          </div>
          <h1>
            Deviens
            <br />
            ambassadeur
            <span className="sub">Michelin+</span>
          </h1>
          <p className="pa-hero__strong">Ensemble, roulons plus loin.</p>
          <p className="pa-hero__lead">
            Promeus, gagne un pourcentage, anime ton clan. Ton code recrute, tes membres roulent, ton
            cercle grandit — et débloque des éditions à ton nom.
          </p>
          <div className="pa-hero__cta">
            <Link href="/login">
              <Button variant="prestige" size="lg">
                Devenir ambassadeur
              </Button>
            </Link>
            <Link href="/ambassador-dashboard">
              <Button variant="outline" size="lg">
                Voir l’espace ambassadeur
              </Button>
            </Link>
          </div>
          <div className="pa-hero__who">
            <span className="pa-hero__who-mark">RB</span>
            <span className="pa-hero__who-txt">
              <b>Romain Bardet</b>
              <span>Coureur professionnel · démo</span>
            </span>
          </div>
        </div>
      </section>

      {/* PITCH — Créateur Michelin */}
      <section className="mch-section">
        <div className="mch-container">
          <div className="pa-pitch">
            <Reveal>
              <span className="pa-chip">Cercle restreint</span>
              <h2>
                Deviens un <em>Créateur Michelin</em>.
              </h2>
              <p>
                L’ambassadeur n’est pas un client de plus : c’est une figure du club. Tu portes la marque
                là où la passion est la plus forte, tu rassembles ta communauté autour d’un objectif
                commun et tu transformes chaque sortie en appartenance. En échange, Michelin+ te reverse
                une part de ce que ton cercle génère et grave ton nom dans des éditions exclusives.
              </p>
            </Reveal>
            <Reveal className="pa-pitch__media">
              <img src="/bardet/bardet-road.jpg" alt="Romain Bardet à l’entraînement sur route" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section
        className="mch-section"
        style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(232,194,74,.05), transparent 70%)' }}
      >
        <div className="mch-container">
          <div className="pa-sec-head mch-reveal">
            <span className="pa-chip">Ce que tu débloques</span>
            <h2>
              Un statut qui <em>rapporte</em>.
            </h2>
          </div>
          <div className="pa-values">
            {VALUES.map((v) => (
              <Reveal key={v.title} className="pa-value">
                {v.big ? (
                  <span className="pa-value__big">{v.big}</span>
                ) : (
                  <span className="pa-value__ic">{v.icon}</span>
                )}
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mch-section">
        <div className="mch-container">
          <div className="pa-sec-head mch-reveal">
            <span className="pa-chip">En 3 temps</span>
            <h2>
              Intègre le cercle en <em>3 étapes</em>.
            </h2>
          </div>
          <div className="pa-steps">
            {STEPS.map((s) => (
              <Reveal key={s.n} className="pa-step">
                <span className="pa-step__n">{s.n}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM PROGRESSION */}
      <section className="mch-section">
        <div className="mch-container">
          <TeamProgress current={7350} max={20000} />
        </div>
      </section>

      {/* AMBASSADOR REWARD — gourde */}
      <section className="mch-section">
        <div className="mch-container">
          <div className="pa-reward mch-reveal">
            <div>
              <Badge tone="prestige" dot>
                Récompense ambassadeur
              </Badge>
              <h2>
                La gourde <em>Équipe Romain Bardet</em>.
              </h2>
              <p>
                Le premier signe d’appartenance au clan : une gourde aux couleurs de l’équipe, remise dès
                tes premiers paliers franchis. Un indispensable pour toutes tes sorties — et celles de tes
                membres.
              </p>
              <Link href="/login">
                <Button variant="prestige" size="lg">
                  Candidater
                </Button>
              </Link>
            </div>
            <div className="pa-reward__media">
              <span className="pa-reward__pts">
                <b>5 000</b>
                <span>Points</span>
              </span>
              <img src="/rewards/gourde-bardet.png" alt="Gourde Équipe Romain Bardet" />
            </div>
          </div>
        </div>
      </section>

      {/* MICRO-AMBASSADEUR — two-level model */}
      <section className="mch-section" style={{ background: 'radial-gradient(60% 60% at 50% 50%, rgba(232,194,74,.05), transparent 70%)' }}>
        <div className="mch-container">
          <div className="pa-sec-head mch-reveal">
            <span className="pa-chip">Deux niveaux d’engagement</span>
            <h2>
              Pas besoin d’être pro pour <em>fédérer</em>.
            </h2>
            <p>
              Le club s’anime à deux échelles. L’ambassadeur porte la marque à grande échelle ;
              le micro-ambassadeur — chef de club — rassemble sa communauté locale et touche, lui aussi,
              une commission sur les ventes qu’il génère.
            </p>
          </div>
          <div className="pa-tiers2">
            <Reveal className="pa-tier2">
              <span className="pa-tier2__lvl">Niveau 01</span>
              <h3>Ambassadeur</h3>
              <span className="pa-tier2__pct">12%<small>reversés / vente</small></span>
              <ul>
                <li>Figure publique du club, audience large</li>
                <li>Éditions numérotées à son nom</li>
                <li>Clan officiel &amp; événements VIP</li>
              </ul>
            </Reveal>
            <Reveal className="pa-tier2 pa-tier2--micro">
              <span className="pa-tier2__lvl">Niveau 02 · accessible à tous</span>
              <h3>Micro-ambassadeur</h3>
              <span className="pa-tier2__pct">6%<small>+ bonus communauté</small></span>
              <ul>
                <li>Chef de club : tu animes ta communauté locale</li>
                <li>Ton code recrute et trace tes ventes</li>
                <li>Bonus de points quand ton clan progresse</li>
              </ul>
              <p className="pa-tier2__eg">Ex. <b>Sofia</b> anime son club à Lyon Sud — code <code>SOFIA-CLUB</code>.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="mch-section">
        <div className="mch-container">
          <div className="pa-cta mch-reveal">
            <span className="pa-chip">Rejoins le cercle</span>
            <h2>Prêt à porter les couleurs ?</h2>
            <p>
              Les places d’ambassadeur sont rares et nominatives. Candidate dès maintenant pour ouvrir ton
              espace, recevoir ton code et lancer ton clan.
            </p>
            <div className="pa-cta__row">
              <Link href="/login">
                <Button variant="prestige" size="lg">
                  Devenir ambassadeur
                </Button>
              </Link>
              <Link href="/ambassador-dashboard">
                <Button variant="outline" size="lg">
                  Voir l’espace ambassadeur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
