'use client';
import React from 'react';
import './wallet.css';
import { Card, Badge, Button, MemberCard } from '@/components/grip';
import { AppHeader } from '@/components/site/AppHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export interface WalletCard {
  name: string;
  tier: string;
  memberId: string;
  points: number;
  since: string;
}

export interface WalletClientProps {
  card: WalletCard;
  authed: boolean;
}

const ic = {
  apple: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.8 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.8zM14.2 5.6c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
    </svg>
  ),
  google: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  ),
  card: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <path d="M2 10h20" />
      <path d="M6 15h5" />
    </svg>
  ),
  nfc: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8c4 0 7 2 7 4s-3 4-7 4" />
      <path d="M8 5c5.5 0 9 3 9 7s-3.5 7-9 7" />
      <path d="M12 2c7 0 11 4 11 10s-4 10-11 10" />
    </svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  ),
};

const INFO_TILES = [
  {
    icon: ic.card,
    title: 'Carte physique premium',
    body: 'Une carte membre métal, gravée de ton palier et de ton numéro. Réservée aux paliers Titane et Carbone, glissée dans ton coffret de bienvenue.',
  },
  {
    icon: ic.nfc,
    title: 'Sans contact en boutique',
    body: 'Présente ta carte ou ton téléphone au comptoir : la puce NFC crédite tes points et confirme ton statut en un geste, sans application à ouvrir.',
  },
  {
    icon: ic.bell,
    title: 'Mises à jour en direct',
    body: 'Solde de points, palier atteint, éditions débloquées : ta carte se met à jour automatiquement et te notifie depuis l’écran verrouillé.',
  },
];

export function WalletClient({ card, authed }: WalletClientProps) {
  const accent: 'energy' | 'prestige' = card.tier === 'Carbone' ? 'prestige' : 'energy';

  return (
    <div className="wallet">
      <div className="wallet__aurora" />
      <AppHeader points={authed ? card.points : null} name={card.name} accent={accent} activeKey="wallet" />

      <main className="wallet__main">
        <header className="wallet__head">
          <div className="wallet__eyebrow-row">
            <span className="mch-eyebrow" style={{ color: 'var(--mch-yellow)' }}>Wallet</span>
            <Badge tone="neutral">Bientôt</Badge>
          </div>
          <h1 className="mch-title">Ta carte de fidélité, dans ta poche</h1>
          <p className="mch-lead">
            La carte Michelin+ arrive dans Apple Wallet et Google Wallet. Solde de points,
            palier et numéro de membre, toujours à jour — prête à présenter en boutique.
            {!authed ? ' Aperçu d’une carte de démonstration.' : ''}
          </p>
        </header>

        <section className="wallet__showcase">
          <Card variant="glass" padding="lg" className="wallet__card-tile">
            <MemberCard
              name={card.name}
              tier={card.tier}
              memberId={card.memberId}
              points={card.points}
              since={card.since}
              variant={accent}
            />
            <p className="wallet__card-caption">
              Aperçu de la carte telle qu’elle apparaîtra dans ton wallet — design définitif.
            </p>
          </Card>

          <Card variant="glass" padding="lg" className="wallet__add-tile">
            <h2>Ajouter au wallet</h2>
            <p>
              L’ajout à Apple Wallet et Google Wallet sera disponible très prochainement.
              D’ici là, retrouve ton solde et ton palier dans ton espace membre.
            </p>

            <div className="wallet-cta">
              <span className="wallet-cta__btn">
                <span className="wallet-cta__logo">{ic.apple}</span>
                <span className="wallet-cta__txt">
                  <span className="wallet-cta__small">Ajouter à</span>
                  <span className="wallet-cta__big">Apple Wallet</span>
                </span>
              </span>
              <Badge tone="neutral">Bientôt</Badge>
            </div>

            <div className="wallet-cta">
              <span className="wallet-cta__btn">
                <span className="wallet-cta__logo">{ic.google}</span>
                <span className="wallet-cta__txt">
                  <span className="wallet-cta__small">Ajouter à</span>
                  <span className="wallet-cta__big">Google Wallet</span>
                </span>
              </span>
              <Badge tone="neutral">Bientôt</Badge>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="ghost" size="sm" disabled iconLeft={ic.apple} style={{ opacity: 0.55 }}>
                Ajouter à Apple Wallet
              </Button>
              <Button variant="ghost" size="sm" disabled iconLeft={ic.google} style={{ opacity: 0.55 }}>
                Ajouter à Google Wallet
              </Button>
            </div>

            <p className="wallet__add-note">
              Vitrine — fonctionnalité en cours de préparation. Émise par Michelin LB 2 Wheels.
            </p>
          </Card>
        </section>

        <section className="wallet__physical">
          <div className="wallet__physical-media">
            <img src="/cards/card-carbon-premium.png" alt="Carte physique Michelin+ en carbone, liseré or" />
          </div>
          <div className="wallet__physical-copy">
            <Badge tone="prestige" dot>Paliers hauts · Bientôt</Badge>
            <h2 className="mch-title" style={{ fontSize: 'var(--fs-display-lg)' }}>La carte physique, en <em style={{ fontStyle: 'normal', color: 'var(--gold-400)' }}>carbone</em>.</h2>
            <p className="mch-lead">
              Aux paliers Titane et Carbone, reçois une carte métal NFC gravée à ton nom — liseré or,
              fibre de carbone tissée. Utilisable chez les revendeurs partenaires : un geste au comptoir
              crédite tes points et confirme ton statut.
            </p>
          </div>
        </section>

        <section className="wallet__info">
          {INFO_TILES.map((t) => (
            <Card key={t.title} variant="solid" padding="lg" className="wallet-info-tile">
              <span className="wallet-info-tile__ic">{t.icon}</span>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </Card>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
