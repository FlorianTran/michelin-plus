'use client';
import React from 'react';
import './parrainage.css';
import { Card, Badge, Button, StatTile, Avatar } from '@/components/grip';
import { AppHeader } from '@/components/site/AppHeader';
import { BottomTabBar } from '@/components/site/BottomTabBar';
import { SiteFooter } from '@/components/site/SiteFooter';
import { ToastStack, useToasts } from '@/components/site/ToastStack';
import { apiGet } from '@/lib/client-api';

interface ReferralState {
  code: string;
  link: string;
  bonus: number;
  count: number;
  totalEarned: number;
  referred: { name: string; joinedAt: string }[];
}

const icon = {
  gift: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M7.5 8a2.5 2.5 0 1 1 4.5-1.5C12 4 16 4 16.5 6.5A2.5 2.5 0 1 1 16.5 8" /></svg>,
  users: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  bolt: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>,
  copy: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
};

export function ParrainageClient({ name, points, accent }: { name: string; points: number; accent: 'energy' | 'prestige' }) {
  const [state, setState] = React.useState<ReferralState | null>(null);
  const { toasts, push, dismiss } = useToasts();

  React.useEffect(() => {
    apiGet<ReferralState>('/api/referral/me').then(setState).catch(() => setState(null));
  }, []);

  const link = state?.link ?? '';
  const shareText = `Rejoins-moi sur Michelin+ — le club des cyclistes premium. Chaque kilomètre te rapproche de l'exception :`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      push({ tone: 'energy', title: 'Lien copié', message: 'Partage-le à un ami cycliste.' });
    } catch {
      push({ tone: 'info', title: 'Copie impossible', message: link });
    }
  }

  async function nativeShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Michelin+', text: shareText, url: link });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  }

  const enc = encodeURIComponent;
  const waHref = `https://wa.me/?text=${enc(`${shareText} ${link}`)}`;
  const mailHref = `mailto:?subject=${enc('Rejoins-moi sur Michelin+')}&body=${enc(`${shareText}\n\n${link}`)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(link)}`;

  return (
    <div className="parr">
      <div className="parr__aurora" />
      <AppHeader points={points} name={name} accent={accent} />

      <main className="parr__main mch-container mch-container--wide">
        <div className="parr__hero">
          <div className="parr__hero-copy">
            <span className="mch-eyebrow" style={{ color: 'var(--gold-400)' }}>Programme de parrainage</span>
            <h1 className="mch-title parr__title">Invite un ami. <em>Gagnez tous les deux.</em></h1>
            <p className="mch-lead">
              Partage ton lien. Quand un ami rejoint Michelin+, tu reçois{' '}
              <b style={{ color: 'var(--mch-yellow)' }}>{(state?.bonus ?? 1000).toLocaleString('fr-FR')} points</b>{' '}
              — et il entre dans le club avec sa propre carte.
            </p>

            <Card variant="hero" padding="md" className="parr__linkcard">
              <span className="parr__linklabel">Ton lien de parrainage</span>
              <div className="parr__linkrow">
                <code className="parr__link">{link || '…'}</code>
                <Button variant={accent} size="sm" iconLeft={icon.copy} onClick={copy} disabled={!link}>Copier</Button>
              </div>
              <div className="parr__share">
                <button className="parr__sharebtn" onClick={nativeShare} disabled={!link}>Partager</button>
                <a className="parr__sharebtn parr__sharebtn--wa" href={waHref} target="_blank" rel="noreferrer">WhatsApp</a>
                <a className="parr__sharebtn" href={mailHref}>Email</a>
                <a className="parr__sharebtn" href={xHref} target="_blank" rel="noreferrer">X</a>
              </div>
              <span className="parr__code">Code : <b>{state?.code ?? '—'}</b></span>
            </Card>
          </div>

          <div className="parr__hero-media">
            <img src="/cards/card-handover.png" alt="Carte Michelin+ partagée de main en main" />
            <div className="parr__hero-media-glow" />
          </div>
        </div>

        <div className="parr__stats">
          <Card variant="solid" padding="lg"><StatTile label="Filleuls" value={state?.count ?? 0} tone="prestige" icon={icon.users} /></Card>
          <Card variant="solid" padding="lg"><StatTile label="Points gagnés" value={(state?.totalEarned ?? 0).toLocaleString('fr-FR')} unit="pts" tone="energy" icon={icon.bolt} /></Card>
          <Card variant="solid" padding="lg"><StatTile label="Bonus / invitation" value={`+${(state?.bonus ?? 1000).toLocaleString('fr-FR')}`} unit="pts" icon={icon.gift} /></Card>
        </div>

        <div className="parr__grid">
          <Card variant="glass" padding="lg">
            <h3 className="parr__h3">Tes filleuls</h3>
            {state && state.referred.length > 0 ? (
              <div className="parr__filleuls">
                {state.referred.map((f, i) => (
                  <div className="parr__filleul" key={i}>
                    <Avatar name={f.name} size="md" ring={accent} />
                    <div className="parr__filleul-id">
                      <b>{f.name}</b>
                      <span>A rejoint le {new Date(f.joinedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <Badge tone="success" dot>+{(state.bonus).toLocaleString('fr-FR')} pts</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="parr__empty">
                <p>Tu n’as pas encore de filleul. Partage ton lien — ton premier ami te rapporte {(state?.bonus ?? 1000).toLocaleString('fr-FR')} points.</p>
              </div>
            )}
          </Card>

          <Card variant="glass" padding="lg">
            <h3 className="parr__h3">Comment ça marche</h3>
            <ol className="parr__steps">
              <li><span className="parr__stepn">1</span><div><b>Partage ton lien</b><span>Par message, email ou réseaux — ton code unique est intégré.</span></div></li>
              <li><span className="parr__stepn">2</span><div><b>Ton ami rejoint</b><span>Il crée son compte via ton lien et reçoit sa carte Michelin+.</span></div></li>
              <li><span className="parr__stepn">3</span><div><b>Vous gagnez tous les deux</b><span>Tu reçois {(state?.bonus ?? 1000).toLocaleString('fr-FR')} points, il démarre dans le club.</span></div></li>
            </ol>
          </Card>
        </div>
      </main>

      <SiteFooter />
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      <BottomTabBar />
    </div>
  );
}
