'use client';
import React from 'react';
import './season.css';
import { Card, Badge, Button, TierGauge } from '@/components/grip';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { apiGet } from '@/lib/client-api';

// ---- API contract ----
interface SeasonInfo { id: string; name: string; maxPoints: number }
interface SeasonProgress { seasonPoints: number; currentStage: number; totalStages: number; pct: number }
interface SeasonReward { stage: number; title: string; image: string | null; threshold: number; epic: boolean; claimed: boolean }
interface SeasonMission { id: string; title: string; reward: string; points: number }
interface SeasonResponse {
  season: SeasonInfo;
  progress: SeasonProgress;
  rewards: SeasonReward[];
  missions: SeasonMission[];
}

const ic = {
  gift: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18M7.5 8a2.5 2.5 0 1 1 4.5-1.5C12 4 16 4 16.5 6.5A2.5 2.5 0 1 1 16.5 8" /></svg>,
  trophy: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8M12 17v4M6 4h12v4a6 6 0 0 1-12 0zM6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
  lock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  bolt: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" /></svg>,
};

const fmt = (n: number) => n.toLocaleString('fr-FR');

function isMilestone(stage: number, total: number, epic: boolean): boolean {
  return epic || stage === total || stage % 10 === 0;
}

function StageRow({ reward, currentStage, totalStages }: { reward: SeasonReward; currentStage: number; totalStages: number }) {
  const done = reward.claimed;
  const current = !done && reward.stage <= currentStage;
  const milestone = isMilestone(reward.stage, totalStages, reward.epic);

  const nodeCls = ['node'];
  if (milestone) nodeCls.push('node--milestone');
  if (done) nodeCls.push('node--done');
  else if (current) nodeCls.push('node--current');

  const rowCls = ['prow'];
  if (reward.epic) rowCls.push('prow--epic');
  if (done) rowCls.push('prow--claimed');
  else if (current) rowCls.push('prow--current');

  return (
    <div className={rowCls.join(' ')}>
      <div className={nodeCls.join(' ')}>{reward.stage}</div>
      <div className="prow__reward">
        <div className="prow__media">
          {reward.image ? <img src={reward.image} alt="" /> : <span className="ic">{ic.gift}</span>}
        </div>
        <div className="prow__text">
          <span className="prow__type">{reward.epic ? 'Édition épique' : 'Récompense'}</span>
          <span className="prow__name">{reward.title}</span>
          <span className="prow__thr">{fmt(reward.threshold)} pts</span>
          {reward.epic ? (
            <span className="prow__flag"><Badge tone="prestige" size="sm" dot>Numérotée</Badge></span>
          ) : null}
        </div>
      </div>
      <div className="prow__state">
        {done ? (
          <Badge tone="success" size="sm">{ic.check} Réclamé</Badge>
        ) : current ? (
          <Badge tone="prestige" size="sm" dot>À réclamer</Badge>
        ) : (
          <Badge tone="neutral" size="sm">{ic.lock} Verrouillé</Badge>
        )}
      </div>
    </div>
  );
}

export function SeasonClient() {
  const [data, setData] = React.useState<SeasonResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    apiGet<SeasonResponse>('/api/season/current')
      .then((d) => { if (alive) setData(d); })
      .catch((e: unknown) => { if (alive) setError(e instanceof Error ? e.message : 'Erreur'); });
    return () => { alive = false; };
  }, []);

  const grandPrix = React.useMemo(() => {
    if (!data) return null;
    return data.rewards.reduce<SeasonReward | null>((best, r) => {
      if (r.stage === data.progress.totalStages) return r;
      if (!best && (r.epic || r.stage === Math.max(...data.rewards.map((x) => x.stage)))) return r;
      return best;
    }, null);
  }, [data]);

  return (
    <div className="pass">
      <div className="pass__aurora" />
      <MarketingHeader active="/passe-saison" />

      <main className="pass__main">
        {error ? (
          <p className="season__empty">{error}</p>
        ) : !data ? (
          <p className="season__empty">Chargement…</p>
        ) : (
          <>
            {/* SEASON HERO */}
            <section className="season">
              <div className="season__info">
                <Badge tone="prestige" dot>Étapes</Badge>
                <h1 className="season__title">
                  <em>{data.season.name}</em>
                </h1>
                <div className="season__meta">
                  <div className="season__stat">
                    <div className="l">Étape actuelle</div>
                    <div className="v"><b>{data.progress.currentStage}</b> / {data.progress.totalStages}</div>
                  </div>
                  <div className="season__stat">
                    <div className="l">Points</div>
                    <div className="v">{fmt(data.progress.seasonPoints)}</div>
                  </div>
                </div>
                <div className="season__gauge">
                  <TierGauge
                    value={data.progress.seasonPoints}
                    max={data.season.maxPoints}
                    current={`${data.progress.currentStage}`}
                    next={data.progress.currentStage < data.progress.totalStages ? `${data.progress.currentStage + 1}` : 'Max'}
                    unit="pts"
                    tone="prestige"
                  />
                </div>
                <div>
                  <Button variant="prestige" size="md">Voir mes récompenses</Button>
                </div>
              </div>

              {grandPrix ? (
                <div className="grand">
                  {grandPrix.image ? <img src={grandPrix.image} alt="" /> : null}
                  <div className="grand__body">
                    <span className="pill-tier"><span className="dot" />Étape {grandPrix.stage} · Grand Prix</span>
                    <div className="grand__name">{grandPrix.title}</div>
                    <div className="grand__desc">
                      Atteins l&rsquo;étape {grandPrix.stage}{' '}du parcours pour décrocher cette récompense d&rsquo;exception, réservée aux pilotes les plus assidus.
                    </div>
                  </div>
                </div>
              ) : null}
            </section>

            {/* LADDER */}
            <div className="pass__head">
              <h2>Étapes &amp; récompenses</h2>
              <Badge tone="prestige" dot>{data.rewards.filter((r) => r.claimed).length} / {data.rewards.length} réclamés</Badge>
            </div>
            <div className="ladder">
              {data.rewards.map((r) => (
                <StageRow key={r.stage} reward={r} currentStage={data.progress.currentStage} totalStages={data.progress.totalStages} />
              ))}
              {data.rewards.length === 0 ? <p className="season__empty">Aucune récompense pour ce parcours.</p> : null}
            </div>

            {/* MISSIONS */}
            <section className="missions">
              <h2>Gagne des points</h2>
              <div className="mgrid">
                {data.missions.map((m) => (
                  <Card key={m.id} variant="solid" padding="none" className="mcardx">
                    <div className="mcardx__ic">{ic.bolt}</div>
                    <h4>{m.title}</h4>
                    <p>{m.reward}</p>
                    <div className="mfoot">
                      <span>Mission</span>
                      <b>+{fmt(m.points)} pts</b>
                    </div>
                  </Card>
                ))}
                {data.missions.length === 0 ? <p className="season__empty">Aucune mission active.</p> : null}
              </div>
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
