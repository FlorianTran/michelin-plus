'use client';
import React from 'react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Badge, Button } from '@/components/grip';
import './revendeurs.css';

interface Shop {
  name: string;
  city: string;
  zip: string;
  address: string;
  tags: string[];
  km: number;
}

// Mock partner network — materialises the online→store (ROPO) bridge for the demo.
const SHOPS: Shop[] = [
  { name: 'Cycles Lyon Presqu’île', city: 'Lyon', zip: '69002', address: '14 rue de la République', tags: ['Carte physique', 'Activation en magasin'], km: 1.2 },
  { name: 'Vélo Atelier Croix-Rousse', city: 'Lyon', zip: '69004', address: '8 bd des Canuts', tags: ['Atelier', 'Conseil pneus'], km: 3.4 },
  { name: 'Gravel Store Villeurbanne', city: 'Villeurbanne', zip: '69100', address: '52 cours Émile Zola', tags: ['Activation en magasin'], km: 5.1 },
  { name: 'Paris Roule — Bastille', city: 'Paris', zip: '75011', address: '23 rue de la Roquette', tags: ['Carte physique', 'Atelier'], km: 391 },
  { name: 'Cyclo Sud Marseille', city: 'Marseille', zip: '13006', address: '5 rue Breteuil', tags: ['Conseil pneus'], km: 314 },
  { name: 'Toulouse Bike Lab', city: 'Toulouse', zip: '31000', address: '11 allées Jean Jaurès', tags: ['Activation en magasin', 'Atelier'], km: 537 },
];

export default function RevendeursPage() {
  const [q, setQ] = React.useState('');
  const shops = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return SHOPS;
    return SHOPS.filter((s) => `${s.city} ${s.zip} ${s.name}`.toLowerCase().includes(needle));
  }, [q]);

  return (
    <div className="rev">
      <MarketingHeader />
      <main className="rev__main mch-container">
        <header className="rev__head">
          <Badge tone="neutral" dot>Réseau partenaire · démo</Badge>
          <h1 className="mch-title">Trouve un revendeur Michelin+</h1>
          <p className="mch-lead">
            Achète en ligne ou repars en magasin : ton compte se crédite dans les deux cas. Active ta
            carte, récupère ta carte physique premium et profite des conseils en boutique partenaire.
          </p>
          <input
            className="rev__search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ville ou code postal (ex. Lyon, 69002)"
            aria-label="Rechercher un revendeur"
          />
        </header>

        <div className="rev__grid">
          <section className="rev__list">
            {shops.map((s) => (
              <article className="rev__shop" key={s.name}>
                <div className="rev__shop-main">
                  <h3>{s.name}</h3>
                  <span className="rev__shop-addr">{s.address} · {s.zip} {s.city}</span>
                  <div className="rev__shop-tags">
                    {s.tags.map((t) => <span key={t} className="rev__tag">{t}</span>)}
                  </div>
                </div>
                <div className="rev__shop-side">
                  <span className="rev__dist">{s.km} km</span>
                  <span className="rev__open">Ouvert</span>
                </div>
              </article>
            ))}
            {shops.length === 0 ? <p className="rev__empty">Aucun revendeur trouvé pour « {q} ».</p> : null}
          </section>

          <aside className="rev__map" aria-hidden="true">
            <div className="rev__map-grid" />
            <div className="rev__map-pins">
              {shops.slice(0, 5).map((s, i) => (
                <span key={s.name} className="rev__pin" style={{ left: `${18 + i * 16}%`, top: `${28 + (i % 3) * 18}%` }} />
              ))}
            </div>
            <span className="rev__map-note">Carte indicative · intégration cartographique à venir</span>
          </aside>
        </div>

        <div className="rev__cta">
          <p>Pas encore membre ? Active ta première carte et commence à cumuler des points.</p>
          <Link href="/login"><Button variant="energy" size="lg">Rejoindre le club</Button></Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
