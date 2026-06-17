'use client';
import React from 'react';
import './rewards.css';
import { Card, Badge, RewardCard, UnlockDialog } from '@/components/grip';
import { AppHeader } from '@/components/site/AppHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { ToastStack, useToasts } from '@/components/site/ToastStack';
import { apiGet, apiPost } from '@/lib/client-api';

type RewardKind = 'edition' | 'goodie' | 'experience';

interface Reward {
  id: string;
  title: string;
  image: string | null;
  tierRequired: string;
  cost: number;
  kind: RewardKind;
  edition: string | null;
  locked: boolean;
  redeemed: boolean;
}

interface RewardsResponse {
  total: number;
  currentTier: string;
  rewards: Reward[];
}

interface RedeemResponse {
  ok: boolean;
  reward: { id: string; title: string; image: string | null; edition: string | null };
}

const GROUPS: { kind: RewardKind; eyebrow: string; title: string; lead: string }[] = [
  {
    kind: 'edition',
    eyebrow: 'Le hook prestige',
    title: 'Éditions numérotées',
    lead: 'Séries limitées, chaque pièce porte son numéro. Palier Carbone requis.',
  },
  {
    kind: 'goodie',
    eyebrow: 'Pour rouler en couleurs',
    title: 'Goodies',
    lead: 'Accessoires et équipements de la collection Grip.',
  },
  {
    kind: 'experience',
    eyebrow: 'Au-delà du produit',
    title: 'Expériences',
    lead: 'Évènements, stages et rencontres réservés aux membres.',
  },
];

export function RewardsClient({ name }: { name: string }) {
  const [data, setData] = React.useState<RewardsResponse | null>(null);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [unlock, setUnlock] = React.useState<RedeemResponse['reward'] | null>(null);
  const { toasts, push, dismiss } = useToasts();

  const refresh = React.useCallback(async () => {
    const next = await apiGet<RewardsResponse>('/api/rewards');
    setData(next);
  }, []);

  React.useEffect(() => {
    refresh().catch((e: unknown) => {
      push({ tone: 'info', title: 'Erreur', message: e instanceof Error ? e.message : '' });
    });
  }, [refresh, push]);

  async function unlockReward(reward: Reward) {
    if (reward.redeemed || busyId) return;
    if (reward.locked) {
      push({ tone: 'info', title: 'Verrouillé', message: `Palier ${reward.tierRequired} requis` });
      return;
    }
    setBusyId(reward.id);
    try {
      const res = await apiPost<RedeemResponse>(`/api/rewards/${reward.id}/redeem`);
      setUnlock(res.reward);
      await refresh();
      push({
        tone: 'prestige',
        title: 'Récompense débloquée',
        message: res.reward.title,
        points: res.reward.edition,
      });
    } catch (e) {
      push({ tone: 'info', title: 'Erreur', message: e instanceof Error ? e.message : '' });
    } finally {
      setBusyId(null);
    }
  }

  const total = data?.total ?? 0;
  const currentTier = data?.currentTier ?? 'Aluminium';
  const accent = currentTier === 'Carbone' ? 'prestige' : 'energy';
  const rewards = data?.rewards ?? [];

  return (
    <div className="rwd">
      <div className="rwd__aurora" />
      <AppHeader points={total} name={name} accent={accent} activeKey="rewards" />

      <main className="rwd__main">
        <div className="rwd__hero">
          <div>
            <span className="mch-eyebrow" style={{ color: 'var(--mch-yellow)' }}>Catalogue Grip</span>
            <h1 className="rwd__title">Récompenses</h1>
            <p className="rwd__lead">
              Débloque éditions numérotées, goodies et expériences avec ton palier.
              {' '}Palier Carbone requis pour les éditions numérotées.
            </p>
          </div>
          <Card variant="glass" padding="lg" className="rwd__band">
            <div className="rwd__band-row">
              <div>
                <span>Palier actuel</span>
                <Badge tone={currentTier === 'Carbone' ? 'prestige' : currentTier === 'Titane' ? 'energy' : 'neutral'} dot>
                  {currentTier}
                </Badge>
              </div>
              <div>
                <span>Solde de points</span>
                <b className="rwd__band-points">{total.toLocaleString('fr-FR')} <em>pts</em></b>
              </div>
            </div>
          </Card>
        </div>

        {GROUPS.map((group) => {
          const items = rewards.filter((r) => r.kind === group.kind);
          if (data && items.length === 0) return null;
          return (
            <section className="rwd__group" key={group.kind}>
              <header className="rwd__group-head">
                <span className="mch-eyebrow">{group.eyebrow}</span>
                <h2 className="rwd__group-title">{group.title}</h2>
                <p className="rwd__group-lead">{group.lead}</p>
              </header>
              <div className="rwd__grid">
                {items.map((r) => (
                  <RewardCard
                    key={r.id}
                    title={r.title}
                    image={r.image}
                    tier={r.tierRequired}
                    cost={r.cost}
                    edition={r.edition}
                    locked={r.locked}
                    cta={r.redeemed ? 'Débloqué' : busyId === r.id ? '…' : 'Débloquer'}
                    onUnlock={() => unlockReward(r)}
                    aria-disabled={r.redeemed || undefined}
                    className={r.redeemed ? 'rwd-card--done' : undefined}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {data && rewards.length === 0 ? (
          <p className="rwd__empty">Aucune récompense disponible pour le moment.</p>
        ) : null}
      </main>

      <SiteFooter />

      {unlock ? (
        <UnlockDialog
          open
          title={unlock.title}
          image={unlock.image}
          edition={unlock.edition}
          description="Bravo ! Cette récompense est ajoutée à ton espace membre."
          primaryLabel="Ajouter à mes récompenses"
          secondaryLabel="Fermer"
          onPrimary={() => {
            setUnlock(null);
            push({ tone: 'success', title: 'Ajoutée à tes récompenses' });
          }}
          onClose={() => setUnlock(null)}
        />
      ) : null}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
