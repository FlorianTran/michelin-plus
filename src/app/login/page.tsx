'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/grip';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { apiPost } from '@/lib/client-api';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signup') {
        await apiPost('/api/auth/signup', { email, password, name });
      } else {
        await apiPost('/api/auth/login', { email, password });
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setBusy(false);
    }
  }

  async function demoLogin(who: 'lea' | 'thomas') {
    setError(null);
    setBusy(true);
    try {
      await apiPost('/api/auth/login', { email: `${who}@michelin.plus`, password: 'demo1234' });
      router.push(who === 'thomas' ? '/ambassador-dashboard' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setBusy(false);
    }
  }

  return (
    <>
      <MarketingHeader />
      <main className="mch-container" style={{ minHeight: 'calc(100vh - 72px)', display: 'grid', placeItems: 'center', paddingBlock: '48px' }}>
        <div style={{ width: 'min(440px, 100%)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <h1 className="mch-title" style={{ fontSize: 'var(--fs-display-lg)' }}>
              {mode === 'login' ? 'Bon retour.' : 'Rejoins le club.'}
            </h1>
            <p className="mch-lead" style={{ marginTop: 8 }}>
              {mode === 'login' ? 'Connecte-toi à ton espace Michelin+.' : 'Crée ton compte et commence à grimper les paliers.'}
            </p>
          </div>

          <Card variant="glass" padding="lg">
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {mode === 'signup' && (
                <Field label="Nom" value={name} onChange={setName} placeholder="Léa Moreau" autoComplete="name" />
              )}
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="toi@email.com" autoComplete="email" />
              <Field label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              {error && <p style={{ color: 'var(--danger-soft)', fontSize: '.875rem', margin: 0 }}>{error}</p>}
              <Button type="submit" variant="energy" full disabled={busy}>
                {busy ? '…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </Button>
            </form>

            <div style={{ marginTop: 16, textAlign: 'center', fontSize: '.875rem', color: 'var(--text-secondary)' }}>
              {mode === 'login' ? (
                <>Pas encore de compte ?{' '}
                  <button onClick={() => setMode('signup')} style={linkBtn}>S’inscrire</button>
                </>
              ) : (
                <>Déjà membre ?{' '}
                  <button onClick={() => setMode('login')} style={linkBtn}>Se connecter</button>
                </>
              )}
            </div>
          </Card>

          <Card variant="solid" padding="md">
            <p style={{ fontSize: '.6875rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700, margin: '0 0 12px' }}>
              Démo rapide
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="blue" size="sm" onClick={() => demoLogin('lea')} disabled={busy}>Entrer comme Léa (membre)</Button>
              <Button variant="prestige" size="sm" onClick={() => demoLogin('thomas')} disabled={busy}>Entrer comme Thomas (ambassadeur)</Button>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}

const linkBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--mch-yellow)', cursor: 'pointer', fontWeight: 700, fontSize: '.875rem', padding: 0,
};

function Field({
  label, value, onChange, type = 'text', placeholder, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: '.6875rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        style={{
          height: 'var(--control-h)', padding: '0 14px', borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,.04)', border: '1px solid var(--border)', color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)', fontSize: '.9375rem', outline: 'none',
        }}
      />
    </label>
  );
}
