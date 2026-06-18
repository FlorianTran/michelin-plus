'use client';
import React from 'react';
import { Button, Card, Badge } from '@/components/grip';
import { ToastStack, useToasts } from '@/components/site/ToastStack';
import { apiGet, apiPost } from '@/lib/client-api';

const CODES = ['GRIP-2000', 'MICH-CLASSIC', 'CARBON-CDM', 'PILOT-SPORT', 'AMBASS-2026'];
const TIERS = ['Aluminium', 'Titane', 'Carbone'] as const;

interface MeResp { user: { name: string; email: string; role: string } | null }
interface RewardRow { id: string; title: string; tierRequired: string; edition: string | null }
interface RewardsResp { total: number; currentTier: string; rewards: RewardRow[] }

interface DebugState {
  db: { connected: boolean; latencyMs: number | null; provider: string };
  counts: Record<string, number | string>;
  session: { name: string; role: string; sumPoints: number; tier: string } | null;
  writes: {
    PointsEntry: { id: string; at: string; who: string; type: string; amount: number; label: string }[];
    Activity: { id: string; at: string; who: string; name: string; km: number; points: number; source: string }[];
    Redemption: { id: string; at: string; who: string; reward: string }[];
  };
}

const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export default function DebugPage() {
  const { toasts, push, dismiss } = useToasts();
  const [token, setToken] = React.useState('grip');
  const [unlocked, setUnlocked] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const [me, setMe] = React.useState<MeResp['user']>(null);
  const [rewards, setRewards] = React.useState<RewardRow[]>([]);
  const [total, setTotal] = React.useState<number | null>(null);
  const [tier, setTier] = React.useState<string>('—');
  const [pointsInput, setPointsInput] = React.useState('250');
  const [kmInput, setKmInput] = React.useState('31');
  const [code, setCode] = React.useState(CODES[0]);
  const [rewardId, setRewardId] = React.useState('');
  const [log, setLog] = React.useState<string[]>([]);
  const [dbState, setDbState] = React.useState<DebugState | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      const m = await apiGet<MeResp>('/api/auth/me');
      setMe(m.user);
      const r = await apiGet<RewardsResp>('/api/rewards');
      setRewards(r.rewards);
      setTotal(r.total);
      setTier(r.currentTier);
      if (!rewardId && r.rewards[0]) setRewardId(r.rewards[0].id);
    } catch {
      /* not logged in yet */
    }
  }, [rewardId]);

  const loadState = React.useCallback(async () => {
    try {
      const s = await apiGet<DebugState>(`/api/debug/state?token=${encodeURIComponent(token)}`);
      setDbState(s);
      return true;
    } catch {
      return false;
    }
  }, [token]);

  async function unlock() {
    setChecking(true);
    const okState = await loadState();
    setChecking(false);
    if (okState) {
      setUnlocked(true);
      await refresh();
    } else {
      push({ tone: 'info', title: 'Token invalide', message: 'Vérifie DEBUG_TOKEN.' });
    }
  }

  // Live auto-refresh of the DB-proof panel while unlocked.
  React.useEffect(() => {
    if (!unlocked) return;
    const id = window.setInterval(loadState, 4000);
    return () => window.clearInterval(id);
  }, [unlocked, loadState]);

  function addLog(line: string) {
    setLog((prev) => [`${new Date().toLocaleTimeString('fr-FR')} · ${line}`, ...prev].slice(0, 12));
  }

  async function run(action: string, body: Record<string, unknown>, toast?: { title: string; tone?: 'energy' | 'prestige' | 'success' | 'info' }) {
    try {
      const res = await apiPost<Record<string, unknown>>(`/api/debug/${action}`, { token, ...body });
      const t = res.total as number | undefined;
      const tu = res.tierUp as string | null | undefined;
      if (typeof t === 'number') { setTotal(t); }
      if (res.tier) setTier(String(res.tier));
      const awarded = res.awarded as number | undefined;
      push({
        tone: tu ? 'prestige' : toast?.tone ?? 'energy',
        title: tu ? `Palier ${tu} atteint !` : toast?.title ?? 'OK',
        message: typeof t === 'number' ? `Total : ${t.toLocaleString('fr-FR')} pts` : undefined,
        points: awarded ? `+${awarded.toLocaleString('fr-FR')}` : undefined,
      });
      addLog(`${action} → ${JSON.stringify(res)}`);
      await refresh();
      await loadState();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      push({ tone: 'info', title: 'Erreur', message: msg });
      addLog(`${action} ✗ ${msg}`);
    }
  }

  if (!unlocked) {
    return (
      <main className="mch-container" style={{ minHeight: 'calc(100vh - 0px)', display: 'grid', placeItems: 'center', paddingBlock: 40 }}>
        <Card variant="hero" padding="lg" style={{ width: 'min(420px, 100%)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span className="mch-eyebrow" style={{ color: 'var(--mch-yellow)' }}>Panneau de démonstration</span>
            <h1 className="mch-title" style={{ fontSize: '1.75rem' }}>Debug · accès protégé</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '.9rem', margin: 0 }}>
              Cet espace pilote la démo et expose la preuve technique (écritures DB). Saisis le token.
            </p>
            <input
              autoFocus value={token} onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') unlock(); }}
              placeholder="DEBUG_TOKEN" style={input}
            />
            <Button variant="energy" full disabled={checking} onClick={unlock}>{checking ? '…' : 'Déverrouiller'}</Button>
          </div>
        </Card>
        <ToastStack toasts={toasts} onDismiss={dismiss} />
      </main>
    );
  }

  return (
    <main className="mch-container" style={{ paddingBlock: 40, maxWidth: 960 }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <span className="mch-eyebrow">Panneau de démonstration</span>
          <h1 className="mch-title" style={{ fontSize: 'var(--fs-display-lg)' }}>Debug · Grip</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '.875rem' }}>→ Dashboard</a>
          <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="DEBUG_TOKEN" style={input} />
        </div>
      </header>

      <Card variant="blue" padding="lg" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="mch-eyebrow">Session courante</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              {me ? `${me.name} · ${me.role}` : 'Non connecté — utilise « démo login »'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Badge tone={tier === 'Carbone' ? 'prestige' : 'energy'} dot>{tier}</Badge>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--mch-yellow)' }}>
              {total != null ? total.toLocaleString('fr-FR') : '—'} pts
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
          <Button variant="blue" size="sm" onClick={async () => { await apiPost('/api/auth/login', { email: 'lea@michelin.plus', password: 'demo1234' }); await refresh(); await loadState(); push({ title: 'Connecté · Léa', tone: 'energy' }); }}>Login Léa</Button>
          <Button variant="prestige" size="sm" onClick={async () => { await apiPost('/api/auth/login', { email: 'romain@michelin.plus', password: 'demo1234' }); await refresh(); await loadState(); push({ title: 'Connecté · Romain Bardet', tone: 'prestige' }); }}>Login Romain Bardet</Button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <Panel title="Ajouter des points">
          <input value={pointsInput} onChange={(e) => setPointsInput(e.target.value)} type="number" style={input} />
          <Button variant="energy" size="sm" full onClick={() => run('addPoints', { amount: Number(pointsInput) }, { title: 'Points ajoutés' })}>+ Points</Button>
        </Panel>

        <Panel title="Synchroniser des km (Strava mock)">
          <input value={kmInput} onChange={(e) => setKmInput(e.target.value)} type="number" style={input} />
          <Button variant="blue" size="sm" full onClick={() => run('addKm', { km: Number(kmInput) }, { title: 'Sortie synchronisée', tone: 'info' })}>+ Kilomètres</Button>
        </Panel>

        <Panel title="Activer une carte">
          <select value={code} onChange={(e) => setCode(e.target.value)} style={input}>
            {CODES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button variant="energy" size="sm" full onClick={() => run('activateCode', { code }, { title: 'Carte activée' })}>Activer</Button>
        </Panel>

        <Panel title="Forcer un palier">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TIERS.map((t) => (
              <Button key={t} variant={t === 'Carbone' ? 'prestige' : 'outline'} size="sm" onClick={() => run('setTier', { tier: t }, { title: `Palier ${t}`, tone: t === 'Carbone' ? 'prestige' : 'energy' })}>{t}</Button>
            ))}
          </div>
        </Panel>

        <Panel title="Débloquer une récompense">
          <select value={rewardId} onChange={(e) => setRewardId(e.target.value)} style={input}>
            {rewards.map((r) => <option key={r.id} value={r.id}>{r.title}{r.edition ? ` · ${r.edition}` : ''}</option>)}
          </select>
          <Button variant="prestige" size="sm" full onClick={() => run('redeem', { rewardId }, { title: 'Récompense débloquée', tone: 'prestige' })}>Débloquer</Button>
        </Panel>

        <Panel title="Toast & reset">
          <Button variant="ghost" size="sm" full onClick={() => run('triggerToast', { title: 'Test toast', points: '+250 pts' })}>Déclencher un toast</Button>
          <Button variant="outline" size="sm" full onClick={async () => { await run('reset', {}, { title: 'Démo réinitialisée', tone: 'info' }); push({ title: 'Session déconnectée', message: 'Re-login Léa/Romain', tone: 'info' }); setMe(null); }}>Reset démo</Button>
        </Panel>
      </div>

      <DbProofPanel state={dbState} />

      <Card variant="solid" padding="md" style={{ marginTop: 18 }}>
        <span className="mch-eyebrow">Journal</span>
        <pre style={{ margin: '10px 0 0', fontFamily: 'var(--font-mono)', fontSize: '.75rem', color: 'var(--text-tertiary)', whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>
          {log.length ? log.join('\n') : 'Aucune action pour l’instant.'}
        </pre>
      </Card>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </main>
  );
}

/** Live proof that the backend writes & processes real rows in Postgres. */
function DbProofPanel({ state }: { state: DebugState | null }) {
  return (
    <Card variant="glass" padding="lg" style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div>
          <span className="mch-eyebrow" style={{ color: 'var(--mch-yellow)' }}>Base de données — preuve technique</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem', margin: '4px 0 0' }}>
            Données réelles écrites &amp; traitées dans PostgreSQL. Rafraîchi en direct toutes les 4 s.
          </p>
        </div>
        {state ? (
          <Badge tone={state.db.connected ? 'success' : 'neutral'} dot>
            {state.db.connected ? `Postgres connecté · ${state.db.latencyMs ?? '—'} ms` : 'Hors ligne'}
          </Badge>
        ) : <Badge tone="neutral">Chargement…</Badge>}
      </div>

      {state ? (
        <>
          {/* COUNTS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginBottom: 18 }}>
            {Object.entries(state.counts).map(([table, n]) => (
              <div key={table} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.35rem', color: '#fff', lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '.68rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginTop: 6 }}>{table}</div>
              </div>
            ))}
          </div>

          {state.session ? (
            <div style={{ marginBottom: 16, fontFamily: 'var(--font-mono)', fontSize: '.8rem', color: 'var(--text-secondary)' }}>
              SUM(points) live · <b style={{ color: 'var(--mch-yellow)' }}>{state.session.name}</b> = {' '}
              <b style={{ color: '#fff' }}>{state.session.sumPoints?.toLocaleString('fr-FR')} pts</b> → palier {state.session.tier}
            </div>
          ) : null}

          {/* LIVE WRITES FEED */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <WriteFeed title="PointsEntry — dernières écritures" rows={state.writes.PointsEntry.map((p) => ({ id: p.id, at: p.at, main: `${p.amount >= 0 ? '+' : ''}${p.amount} · ${p.label}`, sub: `${p.who} · ${p.type}` }))} />
            <WriteFeed title="Activity — dernières sorties" rows={state.writes.Activity.map((a) => ({ id: a.id, at: a.at, main: `${a.name}`, sub: `${a.who} · ${a.km} km · +${a.points} pts` }))} />
            <WriteFeed title="Redemption — récompenses" rows={state.writes.Redemption.map((r) => ({ id: r.id, at: r.at, main: r.reward, sub: r.who }))} emptyLabel="Aucune récompense débloquée pour l’instant." />
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--text-tertiary)', fontSize: '.85rem' }}>Connexion à la base…</p>
      )}
    </Card>
  );
}

function WriteFeed({ title, rows, emptyLabel }: { title: string; rows: { id: string; at: string; main: string; sub: string }[]; emptyLabel?: string }) {
  return (
    <div style={{ borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,.025)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ padding: '10px 12px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.66rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-soft)' }}>{title}</div>
      <div style={{ maxHeight: 200, overflow: 'auto' }}>
        {rows.length ? rows.map((r) => (
          <div key={r.id} style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.82rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.main}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--mch-yellow)', flex: 'none' }}>{fmtTime(r.at)}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--text-tertiary)' }}>{r.sub}</span>
          </div>
        )) : <div style={{ padding: '14px 12px', fontFamily: 'var(--font-body)', fontSize: '.78rem', color: 'var(--text-tertiary)' }}>{emptyLabel ?? 'Aucune donnée.'}</div>}
      </div>
    </div>
  );
}

const input: React.CSSProperties = {
  height: 'var(--control-h-sm)', padding: '0 12px', borderRadius: 'var(--radius-sm)',
  background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)', fontSize: '.875rem', outline: 'none', width: '100%',
};

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card variant="glass" padding="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: '.6875rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>{title}</span>
        {children}
      </div>
    </Card>
  );
}
