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

export default function DebugPage() {
  const { toasts, push, dismiss } = useToasts();
  const [token, setToken] = React.useState('grip');
  const [me, setMe] = React.useState<MeResp['user']>(null);
  const [rewards, setRewards] = React.useState<RewardRow[]>([]);
  const [total, setTotal] = React.useState<number | null>(null);
  const [tier, setTier] = React.useState<string>('—');
  const [pointsInput, setPointsInput] = React.useState('250');
  const [kmInput, setKmInput] = React.useState('31');
  const [code, setCode] = React.useState(CODES[0]);
  const [rewardId, setRewardId] = React.useState('');
  const [log, setLog] = React.useState<string[]>([]);

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

  React.useEffect(() => { refresh(); }, [refresh]);

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
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      push({ tone: 'info', title: 'Erreur', message: msg });
      addLog(`${action} ✗ ${msg}`);
    }
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
          <Button variant="blue" size="sm" onClick={async () => { await apiPost('/api/auth/login', { email: 'lea@michelin.plus', password: 'demo1234' }); await refresh(); push({ title: 'Connecté · Léa', tone: 'energy' }); }}>Login Léa</Button>
          <Button variant="prestige" size="sm" onClick={async () => { await apiPost('/api/auth/login', { email: 'thomas@michelin.plus', password: 'demo1234' }); await refresh(); push({ title: 'Connecté · Thomas', tone: 'prestige' }); }}>Login Thomas</Button>
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
          <Button variant="outline" size="sm" full onClick={async () => { await run('reset', {}, { title: 'Démo réinitialisée', tone: 'info' }); push({ title: 'Session déconnectée', message: 'Re-login Léa/Thomas', tone: 'info' }); setMe(null); }}>Reset démo</Button>
        </Panel>
      </div>

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
