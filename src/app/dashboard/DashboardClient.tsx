'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import './dashboard.css';
import {
  Card, Badge, Button, PointsCounter, TierGauge, StatTile, MemberCard, UnlockDialog, LeaderboardRow,
} from '@/components/grip';
import { AppHeader } from '@/components/site/AppHeader';
import { BottomTabBar } from '@/components/site/BottomTabBar';
import { ToastStack, useToasts } from '@/components/site/ToastStack';
import { apiGet, apiPost } from '@/lib/client-api';
import type { DashboardState } from '@/lib/dashboard';

interface LeaderRow { rank: number; name: string; meta: string; km: number; you: boolean; avatar: string | null }
interface UnlockedReward { id: string; title: string; image: string | null; edition: string | null }

const ic = {
  bolt: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>,
  shield: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-5z" /></svg>,
  bike: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 17.5h-3l3-7.5 3 4h3" /></svg>,
  trophy: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg>,
  flame: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5 12 2l3.5 12.5M5 22c0-3 3-5 7-5s7 2 7 5" /></svg>,
  gift: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M7.5 8a2.5 2.5 0 1 1 4.5-1.5C12 4 16 4 16.5 6.5A2.5 2.5 0 1 1 16.5 8" /></svg>,
  sync: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>,
  card: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 0 0 0 4h4v-4z" /></svg>,
};

function feedIcon(source: string) {
  if (source === 'purchase') return <span className="feed-ic blue">{ic.card}</span>;
  if (source === 'tier') return <span className="feed-ic gold">{ic.shield}</span>;
  return <span className="feed-ic">{ic.bike}</span>;
}

export function DashboardClient({ initial, leaderboard }: { initial: DashboardState; leaderboard: LeaderRow[] }) {
  const router = useRouter();
  const [state, setState] = React.useState(initial);
  const [board, setBoard] = React.useState(leaderboard);
  const [busy, setBusy] = React.useState(false);
  const [activateOpen, setActivateOpen] = React.useState(false);
  const [codeInput, setCodeInput] = React.useState('');
  const [clanOpen, setClanOpen] = React.useState(false);
  const [clanCode, setClanCode] = React.useState('');
  const [unlock, setUnlock] = React.useState<{ title: string; image: string | null; edition: string | null; eyebrow?: string; description?: string } | null>(null);
  const { toasts, push, dismiss } = useToasts();

  const accent = state.tier.current === 'Carbone' ? 'prestige' : 'energy';

  // Reaching a tier (via Strava or card activation) unlocks a reward → claim it for
  // real, then fire the celebration pop-up. Real progress, real redemption.
  async function celebrateTierUp(tierName: string, reward: UnlockedReward) {
    let shown: { title: string; image: string | null; edition: string | null } = reward;
    try {
      const r = await apiPost<{ reward: { title: string; image: string | null; edition: string | null } }>(`/api/rewards/${reward.id}/redeem`);
      shown = r.reward;
    } catch {
      /* already claimed — celebrate with what we have */
    }
    setUnlock({ ...shown, eyebrow: `Palier ${tierName} atteint`, description: 'Ton nouveau palier débloque cette récompense — elle est ajoutée à ton espace membre.' });
    await refresh();
  }

  async function refresh() {
    const next = await apiGet<DashboardState>('/api/dashboard');
    setState(next);
    if (next.clan) {
      const lb = await apiGet<{ rows: LeaderRow[] }>(`/api/clan/${next.clan.id}/leaderboard`);
      setBoard(lb.rows);
    }
  }

  async function syncStrava() {
    setBusy(true);
    try {
      const res = await apiPost<{ activity: { name: string; km: number; points: number }; awarded: number; tierUp: string | null; unlockedReward: UnlockedReward | null }>('/api/strava/sync');
      await refresh();
      push({
        tone: res.tierUp ? 'prestige' : 'energy',
        title: res.tierUp ? `Palier ${res.tierUp} atteint !` : 'Strava synchronisé',
        message: `${res.activity.name} · ${res.activity.km} km importés`,
        points: `+${res.awarded.toLocaleString('fr-FR')} pts`,
        icon: ic.sync,
      });
      if (res.tierUp && res.unlockedReward) await celebrateTierUp(res.tierUp, res.unlockedReward);
    } catch (e) {
      push({ tone: 'info', title: 'Erreur', message: e instanceof Error ? e.message : '' });
    } finally {
      setBusy(false);
    }
  }

  async function activate() {
    if (!codeInput.trim()) return;
    setBusy(true);
    try {
      const res = await apiPost<{ awarded: number; product: string; tierUp: string | null; unlockedReward: UnlockedReward | null }>('/api/codes/activate', { code: codeInput });
      setActivateOpen(false);
      setCodeInput('');
      await refresh();
      push({
        tone: res.tierUp ? 'prestige' : 'energy',
        title: res.tierUp ? `Palier ${res.tierUp} atteint !` : 'Carte activée',
        message: res.product,
        points: `+${res.awarded.toLocaleString('fr-FR')} pts`,
      });
      if (res.tierUp && res.unlockedReward) await celebrateTierUp(res.tierUp, res.unlockedReward);
    } catch (e) {
      push({ tone: 'info', title: 'Activation refusée', message: e instanceof Error ? e.message : '' });
    } finally {
      setBusy(false);
    }
  }

  async function joinClan() {
    if (!clanCode.trim()) return;
    setBusy(true);
    try {
      const res = await apiPost<{ clan: { name: string; size: number } }>('/api/clan/join', { code: clanCode });
      setClanOpen(false);
      setClanCode('');
      await refresh();
      push({ tone: 'energy', title: `Bienvenue dans ${res.clan.name}`, message: `Tu es le ${res.clan.size}ᵉ membre du clan.` });
    } catch (e) {
      push({ tone: 'info', title: 'Clan introuvable', message: e instanceof Error ? e.message : '' });
    } finally {
      setBusy(false);
    }
  }

  async function redeemNext() {
    const r = state.nextReward;
    if (!r) return;
    if (r.locked) {
      push({ tone: 'info', title: 'Verrouillé', message: `Palier ${r.tierRequired} requis` });
      return;
    }
    setBusy(true);
    try {
      const res = await apiPost<{ reward: { title: string; image: string | null; edition: string | null } }>(`/api/rewards/${r.id}/redeem`);
      setUnlock(res.reward);
      await refresh();
    } catch (e) {
      push({ tone: 'info', title: 'Erreur', message: e instanceof Error ? e.message : '' });
    } finally {
      setBusy(false);
    }
  }

  const { user, points, tier, stats, feed, clan, nextReward } = state;

  return (
    <div className="dash">
      <div className="dash__aurora" />
      <AppHeader points={points.total} name={user.name} accent={accent} activeKey="dashboard" />

      <main className="dash__main">
        <div className="dash__hello">
          <div>
            <h1>Salut, <em>{user.firstName}</em>.</h1>
            <p>
              Palier {tier.current}
              {tier.next ? ` · plus que ${tier.remaining.toLocaleString('fr-FR')} pts avant le ${tier.next}.` : ' · palier maximal atteint.'}
            </p>
          </div>
          <div className="dash__hello-actions">
            <Button variant="blue" size="sm" className="dash-sync" iconLeft={ic.sync} disabled={busy} onClick={syncStrava}>Synchroniser Strava</Button>
            <Button variant="energy" size="sm" className="dash-activate" disabled={busy} onClick={() => setActivateOpen(true)}>Activer une carte</Button>
          </div>
        </div>

        <div className="bento">
          {/* POINTS */}
          <Card variant="glass" padding="lg" className="points-tile b-points points-card">
            <div className="tile__label">{ic.bolt} Solde de points</div>
            <div><PointsCounter value={points.total} tone="white" size="lg" /></div>
            <div className="points-row">
              <div><span>Ce mois</span><b>+{points.thisMonth.toLocaleString('fr-FR')}</b></div>
              <div><span>Achats</span><b>{points.fromPurchases.toLocaleString('fr-FR')}</b></div>
              <div><span>Kilomètres</span><b>{points.fromKm.toLocaleString('fr-FR')}</b></div>
            </div>
            {/* Mobile-only: actions relocated from the header into the hero card (app-like). */}
            <div className="points-card__actions">
              <Button variant="blue" size="sm" className="dash-sync" iconLeft={ic.sync} disabled={busy} onClick={syncStrava}>Strava</Button>
              <Button variant="energy" size="sm" className="dash-activate" disabled={busy} onClick={() => setActivateOpen(true)}>Activer</Button>
            </div>
          </Card>

          {/* TIER GAUGE */}
          <Card variant="glass" padding="lg" className="tier-tile b-tier">
            <div className="tier-tile__head">
              <div className="tile__label">{ic.shield} Progression de palier</div>
              <div className="tier-badges">
                <Badge tone="neutral">{tier.current}</Badge>
                {tier.next ? <Badge tone={tier.current === 'Titane' ? 'prestige' : 'energy'} dot>{tier.next}</Badge> : null}
              </div>
            </div>
            <TierGauge value={tier.value} max={tier.max} current={tier.current} next={tier.next ?? 'Max'} tone={tier.tone} />
            <div className="tier-tile__benefits">
              {tier.perks.map((p, i) => (
                <div key={i}><span style={{ color: i === tier.perks.length - 1 && tier.current !== 'Carbone' ? 'var(--gold-400)' : 'var(--text-secondary)' }}>{i === tier.perks.length - 1 && tier.current !== 'Carbone' ? '★' : '✓'}</span> {p}</div>
              ))}
            </div>
          </Card>

          {/* STATS */}
          <Card variant="solid" padding="lg" className="b-stat"><StatTile label="KM ce mois" value={stats.kmThisMonth} unit="km" delta={stats.kmDeltaPct != null ? `${stats.kmDeltaPct >= 0 ? '+' : ''}${stats.kmDeltaPct}%` : null} deltaUp={(stats.kmDeltaPct ?? 0) >= 0} tone="energy" icon={ic.bike} /></Card>
          <Card variant="solid" padding="lg" className="b-stat"><StatTile label="Rang clan" value={stats.clanRank ? `#${stats.clanRank}` : '—'} unit={stats.clanSize ? `/ ${stats.clanSize}` : ''} delta={null} tone="prestige" icon={ic.trophy} /></Card>
          <Card variant="solid" padding="lg" className="b-stat"><StatTile label="Série en cours" value={stats.streakDays} unit={stats.streakDays > 1 ? 'jours' : 'jour'} delta={null} icon={ic.flame} /></Card>
          <Card variant="solid" padding="lg" className="b-stat"><StatTile label="Récompenses" value={stats.rewardsCount} delta={stats.rewardsThisMonth > 0 ? `+${stats.rewardsThisMonth}` : null} icon={ic.gift} /></Card>

          {/* FEED */}
          <Card variant="glass" padding="lg" className="feed-tile b-feed">
            <div className="clan-head"><h3>Activité récente</h3><Badge tone="success" dot>Strava connecté</Badge></div>
            {feed.map((f) => (
              <div className="feed-row" key={f.id}>
                {feedIcon(f.source)}
                <div className="feed-body"><b>{f.name}</b><span>{f.meta}</span></div>
                <span className={`feed-pts${f.points === 0 ? ' muted' : ''}`}>{f.points === 0 ? 'Statut' : `+${f.points.toLocaleString('fr-FR')} pts`}</span>
              </div>
            ))}
          </Card>

          {/* NEXT REWARD */}
          <Card variant="glass" accent="prestige" padding="lg" className="reward-tile b-reward">
            <div className="clan-head"><h3>Prochaine récompense</h3></div>
            {nextReward ? (
              <>
                <div className="reward-tile__media">
                  {nextReward.image ? <img src={nextReward.image} alt={nextReward.title} /> : null}
                  {nextReward.edition ? <span className="flag"><Badge tone="prestige" dot>Édition limitée</Badge></span> : <span className="flag"><Badge tone="blue" dot>Palier {nextReward.tierRequired}</Badge></span>}
                  {nextReward.edition ? <span className="edition">{nextReward.edition}</span> : null}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.0625rem', textTransform: 'uppercase', color: '#fff', letterSpacing: '-.01em' }}>{nextReward.title}</div>
                <div className="reward-tile__foot">
                  <span className="reward-tile__cost">{nextReward.cost.toLocaleString('fr-FR')} <span>pts</span></span>
                  <Button variant={nextReward.edition ? 'prestige' : 'energy'} size="sm" disabled={busy} onClick={redeemNext}>
                    {nextReward.locked ? `Palier ${nextReward.tierRequired}` : 'Débloquer'}
                  </Button>
                </div>
              </>
            ) : <p style={{ color: 'var(--text-secondary)' }}>Toutes les récompenses sont débloquées.</p>}
          </Card>

          {/* MEMBER CARD */}
          <Card variant="glass" padding="lg" className="b-card">
            <div className="b-card-inner">
              <MemberCard name={user.name} tier={tier.current} memberId={user.memberId ?? 'M+ ——'} points={points.total} since={user.sinceYear ?? '2024'} variant={accent} />
              <div className="wallet-row">
                <Button variant="ghost" size="sm" disabled iconLeft={ic.card} style={{ opacity: 0.55 }}>Ajouter au wallet</Button>
                <Badge tone="neutral">Bientôt</Badge>
              </div>
              <a href="/revendeurs" className="dash-revendeur">Trouver un revendeur partenaire →</a>
            </div>
          </Card>

          {/* CLAN LEADERBOARD */}
          <Card variant="glass" padding="lg" className="clan-tile b-clan">
            <div className="clan-head">
              <h3>Classement · {clan?.name ?? 'Clan'}</h3>
              {clan ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge tone="blue">{board.length} membres</Badge>
                  <button type="button" className="clan-join-link" onClick={() => setClanOpen(true)}>+ Code</button>
                </div>
              ) : null}
            </div>
            {clan ? (
              <div>
                {board.map((m) => (
                  <LeaderboardRow key={m.rank} rank={m.rank} name={m.name} meta={m.meta} value={m.km.toLocaleString('fr-FR')} unit="km" you={m.you} avatar={m.avatar} />
                ))}
              </div>
            ) : (
              <div className="clan-empty">
                <p>Tu n’as pas encore de clan. Saisis le code de ton ambassadeur pour rejoindre sa communauté et grimper le classement ensemble.</p>
                <Button variant="energy" size="sm" onClick={() => setClanOpen(true)}>Rejoindre un clan</Button>
                <span className="clan-empty__hint">Code démo : <b>VIDAL-LYON</b></span>
              </div>
            )}
          </Card>
        </div>
      </main>

      {activateOpen && (
        <ActivateModal value={codeInput} onChange={setCodeInput} onConfirm={activate} onClose={() => setActivateOpen(false)} busy={busy} />
      )}

      {clanOpen && (
        <CodeModal
          eyebrow="Rejoindre un clan"
          title="Code de ton ambassadeur"
          help="Ton ambassadeur t’a partagé un code de clan. Saisis-le pour rejoindre sa communauté."
          placeholder="VIDAL-LYON"
          hint="Code démo : VIDAL-LYON"
          value={clanCode}
          onChange={setClanCode}
          onConfirm={joinClan}
          onClose={() => setClanOpen(false)}
          busy={busy}
        />
      )}

      {unlock && (
        <UnlockDialog
          open
          eyebrow={unlock.eyebrow ?? 'Récompense débloquée'}
          title={unlock.title}
          image={unlock.image}
          edition={unlock.edition}
          description={unlock.description ?? 'Bravo ! Cette récompense est ajoutée à ton espace membre.'}
          onPrimary={() => { setUnlock(null); push({ tone: 'prestige', title: 'Ajoutée à tes récompenses' }); }}
          onClose={() => setUnlock(null)}
          secondaryLabel="Fermer"
        />
      )}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
      <BottomTabBar />
    </div>
  );
}

function ActivateModal({ value, onChange, onConfirm, onClose, busy }: { value: string; onChange: (v: string) => void; onConfirm: () => void; onClose: () => void; busy: boolean }) {
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(5,6,9,.78)', backdropFilter: 'blur(8px)' }}>
      <Card variant="hero" padding="lg" style={{ width: 'min(420px, 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span className="mch-eyebrow" style={{ color: 'var(--mch-yellow)' }}>Activer une carte produit</span>
          <h3 className="mch-title" style={{ fontSize: '1.5rem' }}>Saisis ton code</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '.875rem', margin: 0 }}>Le code figure sur la carte glissée dans l’emballage de tes pneus.</p>
          <input
            autoFocus value={value} onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(); }}
            placeholder="GRIP-2000"
            style={{ height: 'var(--control-h)', padding: '0 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '1rem', letterSpacing: '.06em', outline: 'none', textTransform: 'uppercase' }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="energy" full disabled={busy} onClick={onConfirm}>Activer</Button>
            <Button variant="ghost" full onClick={onClose}>Annuler</Button>
          </div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '.75rem', margin: 0 }}>Codes démo : GRIP-2000 · MICH-CLASSIC · CARBON-CDM</p>
        </div>
      </Card>
    </div>
  );
}

function CodeModal({ eyebrow, title, help, placeholder, hint, value, onChange, onConfirm, onClose, busy }: {
  eyebrow: string; title: string; help: string; placeholder: string; hint: string;
  value: string; onChange: (v: string) => void; onConfirm: () => void; onClose: () => void; busy: boolean;
}) {
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(5,6,9,.78)', backdropFilter: 'blur(8px)' }}>
      <Card variant="hero" padding="lg" style={{ width: 'min(420px, 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span className="mch-eyebrow" style={{ color: 'var(--mch-yellow)' }}>{eyebrow}</span>
          <h3 className="mch-title" style={{ fontSize: '1.5rem' }}>{title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '.875rem', margin: 0 }}>{help}</p>
          <input
            autoFocus value={value} onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={(e) => { if (e.key === 'Enter') onConfirm(); }}
            placeholder={placeholder}
            style={{ height: 'var(--control-h)', padding: '0 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '1rem', letterSpacing: '.06em', outline: 'none', textTransform: 'uppercase' }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="energy" full disabled={busy} onClick={onConfirm}>Rejoindre</Button>
            <Button variant="ghost" full onClick={onClose}>Annuler</Button>
          </div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '.75rem', margin: 0 }}>{hint}</p>
        </div>
      </Card>
    </div>
  );
}
