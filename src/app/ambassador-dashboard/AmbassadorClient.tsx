'use client';
import React from 'react';
import Link from 'next/link';
import './ambassador.css';
import { Card, Badge, Button, StatTile, MemberCard, LeaderboardRow, Avatar } from '@/components/grip';
import { AppHeader } from '@/components/site/AppHeader';
import { BottomTabBar } from '@/components/site/BottomTabBar';
import { SiteFooter } from '@/components/site/SiteFooter';
import { apiGet } from '@/lib/client-api';

interface AmbassadorData {
  user: { id: string; name: string; memberId: string | null; sinceYear: string | null };
  tier: string;
  points: number;
  profile: {
    code: string;
    commissionPct: number;
    salesCount: number;
    ytdAmount: number;
    audience: number;
  };
  clan: { id: string; name: string; size: number } | null;
  leaderboard: Array<{ rank: number; name: string; meta: string; km: number; you: boolean }>;
}

const ic = {
  shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-5z" /></svg>,
  euro: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18a6 6 0 1 1 0-12M4 10h7M4 14h7" /></svg>,
  users: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" /></svg>,
  cart: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h2l2.4 12.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 7H5" /></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
  copy: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  card: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 0 0 0 4h4v-4z" /></svg>,
};

const eur = (n: number) => n.toLocaleString('fr-FR');

export function AmbassadorClient() {
  const [data, setData] = React.useState<AmbassadorData | null>(null);
  const [forbidden, setForbidden] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    apiGet<AmbassadorData>('/api/ambassador/me')
      .then((d) => { if (alive) setData(d); })
      .catch((e: unknown) => {
        if (!alive) return;
        const msg = e instanceof Error ? e.message : '';
        if (/403/.test(msg) || /ambassadeur/i.test(msg)) setForbidden(true);
        else setError(msg || 'Erreur de chargement');
      });
    return () => { alive = false; };
  }, []);

  async function copyCode() {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.profile.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  if (forbidden) {
    return (
      <div className="amb">
        <div className="amb__aurora" />
        <AppHeader accent="prestige" />
        <main className="amb-empty">
          <div className="amb-empty__seal">{ic.shield}</div>
          <span className="mch-eyebrow" style={{ color: 'var(--gold-400)' }}>Programme Créateur</span>
          <h1>Deviens <em>Créateur Michelin</em>.</h1>
          <p>
            Anime ton équipe, façonne tes éditions numérotées et touche une commission sur chaque vente
            générée par ton code. Le cercle des ambassadeurs Michelin+ est sur invitation.
          </p>
          <Link href="/programme-ambassadeur"><Button variant="prestige">Rejoindre le programme</Button></Link>
        </main>
        <SiteFooter />
        <BottomTabBar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="amb">
        <div className="amb__aurora" />
        <AppHeader accent="prestige" />
        <main className="amb-empty">
          <h1>Indisponible</h1>
          <p>{error}</p>
        </main>
        <SiteFooter />
        <BottomTabBar />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="amb">
        <div className="amb__aurora" />
        <AppHeader accent="prestige" />
        <main className="amb__main"><p style={{ color: 'var(--text-tertiary)' }}>Chargement…</p></main>
        <BottomTabBar />
      </div>
    );
  }

  const { user, tier, points, profile, clan, leaderboard } = data;
  const firstName = user.name.split(' ')[0];

  return (
    <div className="amb">
      <div className="amb__aurora" />
      <AppHeader points={points} name={user.name} accent="prestige" />

      <main className="amb__main">
        {/* HERO */}
        <section className="amb__hero">
          <div className="amb__hero-av">
            <Avatar name={user.name} size="xl" ring="prestige" />
            <span className="amb__seal">{ic.shield}</span>
          </div>
          <div className="amb__hero-txt">
            <span className="amb__role"><span className="amb__role-dot" />Créateur Michelin · Ambassadeur</span>
            <h1 className="amb__name">{user.name}</h1>
            <p className="amb__bio">
              {clan
                ? `J'anime ${clan.name} et je façonne des éditions numérotées avec Michelin+. Mon cercle roule, ma communauté grandit.`
                : `Je façonne des éditions numérotées avec Michelin+ et je fais grandir ma communauté de passionnés.`}
            </p>
            <div className="amb__since">
              Palier {tier}
              {user.sinceYear ? ` · Ambassadeur depuis ${user.sinceYear}` : ''}
              {clan ? ` · ${clan.size} membres` : ''}
            </div>
          </div>
          <div className="amb__hero-actions">
            <Button variant="prestige" size="sm" onClick={copyCode}>Partager mon code</Button>
            <Link href="/programme-ambassadeur"><Button variant="ghost" size="sm">Proposer une édition</Button></Link>
          </div>
        </section>

        <div className="amb-bento">
          {/* COMMISSION (gold hero) */}
          <Card variant="gold" padding="lg" className="commission-tile ab-commission">
            <div className="commission-tile__top">
              <span className="tile__label">{ic.euro} Reversés cette année</span>
              <Badge tone="prestige" size="sm">{profile.commissionPct}% / vente</Badge>
            </div>
            <div className="commission-tile__big">
              <span className="commission-tile__amt">{eur(profile.ytdAmount)}</span>
              <span className="commission-tile__cur">€</span>
            </div>
            <div className="commission-tile__tread" />
            <div className="commission-tile__row">
              <div><div className="l">Ventes générées</div><div className="v">{profile.salesCount}</div></div>
              <div><div className="l">Commission</div><div className="v">{profile.commissionPct}%</div></div>
              <div><div className="l">Audience</div><div className="v">{eur(profile.audience)}</div></div>
            </div>
          </Card>

          {/* CODE (copy-able pill) */}
          <Card variant="solid" padding="lg" className="code-tile ab-code">
            <span className="tile__label">{ic.shield} Code ambassadeur</span>
            <div className="code-tile__box">
              <span className="code-tile__val">{profile.code}</span>
              <button type="button" className="code-tile__copy" onClick={copyCode} disabled={copied}>
                {copied ? 'Copié' : 'Copier'}
              </button>
            </div>
            <div className="code-tile__stats">
              <div><div className="l">Ventes</div><div className="v">{profile.salesCount}</div></div>
              <div><div className="l">Audience</div><div className="v">{eur(profile.audience)}</div></div>
              <div><div className="l">Commission</div><div className="v">{profile.commissionPct}%</div></div>
            </div>
          </Card>

          {/* STATS */}
          <Card variant="solid" padding="lg" className="ab-stat"><StatTile label="Reversés 2026" value={eur(profile.ytdAmount)} unit="€" delta="+12%" tone="prestige" icon={ic.euro} /></Card>
          <Card variant="solid" padding="lg" className="ab-stat"><StatTile label="Ventes générées" value={profile.salesCount} delta="+6" tone="prestige" icon={ic.cart} /></Card>
          <Card variant="solid" padding="lg" className="ab-stat"><StatTile label="Audience" value={eur(profile.audience)} delta="+180" tone="prestige" icon={ic.users} /></Card>

          {/* CLAN LEADERBOARD */}
          <Card variant="glass" padding="lg" className="clan-tile ab-clan">
            <div className="clan-head">
              <h3>Mon équipe{clan ? ` · ${clan.name}` : ''}</h3>
              {clan ? <Badge tone="blue">{clan.size} membres</Badge> : null}
            </div>
            {leaderboard.length ? (
              <div>
                {leaderboard.map((m) => (
                  <LeaderboardRow key={m.rank} rank={m.rank} name={m.name} meta={m.meta} value={eur(m.km)} unit="km" you={m.you} />
                ))}
              </div>
            ) : (
              <p className="clan-empty">Tu n&apos;animes pas encore d&apos;équipe. Invite tes premiers filleuls avec ton code.</p>
            )}
          </Card>

          {/* MEMBER CARD */}
          <Card variant="glass" padding="lg" accent="prestige" className="ab-card">
            <div className="ab-card-inner">
              <MemberCard name={user.name} tier={tier} memberId={user.memberId ?? 'M+ ——'} points={points} since={user.sinceYear ?? '2024'} variant="prestige" />
              <div className="wallet-row">
                <Button variant="ghost" size="sm" disabled iconLeft={ic.card} style={{ opacity: 0.55 }}>Ajouter au wallet</Button>
                <Badge tone="neutral">Bientôt</Badge>
              </div>
            </div>
          </Card>

          {/* NEXT EVENT */}
          <Card variant="glass" padding="none" className="next-tile ab-next">
            <img src="https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?auto=format&fit=crop&w=700&q=70&sat=-100" alt="" />
            <div className="next-tile__b" style={{ padding: 22 }}>
              <Badge tone="prestige" size="sm" dot>Événement ambassadeur</Badge>
              <h4>Sortie officielle · Col du Galibier</h4>
              <p>Anime ton équipe en conditions réelles, {firstName}. 14 places VIP à attribuer.</p>
            </div>
          </Card>
        </div>
      </main>

      <SiteFooter />
      <BottomTabBar />
    </div>
  );
}
