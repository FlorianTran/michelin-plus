import type { Metadata } from 'next';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Badge } from '@/components/grip';

export const metadata: Metadata = {
  title: 'Confidentialité & cookies — Michelin+',
  description:
    'Politique de confidentialité de la démo Michelin+ : données Strava, profilage fidélité, cookies. Document de démonstration.',
};

const SECTIONS = [
  {
    h: 'Qui sommes-nous',
    p: 'Michelin+ est un prototype de programme de fidélité réalisé dans le cadre du hackathon ESGI × Skolae × Michelin. Cette page décrit, à titre démonstratif, le traitement des données qu’une version réelle du service impliquerait. Aucune donnée personnelle réelle n’est collectée par la démo en dehors des comptes de test que vous créez.',
  },
  {
    h: 'Données Strava',
    p: 'Avec votre accord explicite, le service se connecterait à Strava pour importer vos activités (distance, dénivelé, date) afin de convertir vos kilomètres en points. Dans la démo, ces activités sont simulées — aucun compte Strava réel n’est appelé. La connexion serait révocable à tout moment et les données d’activité supprimables sur demande.',
  },
  {
    h: 'Profilage & fidélité',
    p: 'Le calcul des paliers (Aluminium, Titane, Carbone), des récompenses et des classements d’équipe repose sur l’agrégation de vos points (achats activés + kilomètres). Ce traitement constitue un profilage de fidélité au sens du RGPD. Il sert uniquement à attribuer statuts et récompenses, jamais à une décision produisant des effets juridiques sans intervention humaine.',
  },
  {
    h: 'Vos droits',
    p: 'Accès, rectification, effacement, portabilité, opposition et limitation : dans une version réelle, ces droits s’exerceraient via un canal dédié, avec réponse sous un mois. Le consentement au suivi d’activité et aux cookies non essentiels serait toujours libre, spécifique et révocable.',
  },
  {
    h: 'Cookies',
    anchor: 'cookies',
    p: 'La démo n’utilise qu’un cookie de session strictement nécessaire (authentification). Les cookies de mesure d’audience et de personnalisation sont refusés par défaut : ils ne seraient déposés qu’après un consentement explicite via la bannière. Vous pouvez modifier votre choix à tout moment en effaçant les cookies du site.',
  },
];

export default function ConfidentialitePage() {
  return (
    <div style={{ background: 'var(--canvas)', minHeight: '100vh', overflowX: 'clip' }}>
      <MarketingHeader />
      <main className="mch-container" style={{ maxWidth: 760, paddingBlock: 'clamp(40px, 6vw, 80px)' }}>
        <Badge tone="neutral" dot>Document de démonstration</Badge>
        <h1 className="mch-title" style={{ fontSize: 'var(--fs-display-lg)', margin: '16px 0 12px' }}>
          Confidentialité &amp; cookies
        </h1>
        <p className="mch-lead" style={{ marginBottom: 40 }}>
          Comment Michelin+ traiterait vos données dans une version réelle du programme. Cette page
          est un exemple illustratif rédigé pour le jury — elle ne remplace pas un avis juridique.
        </p>

        {SECTIONS.map((s) => (
          <section key={s.h} id={s.anchor} style={{ marginBottom: 28, scrollMarginTop: 90 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '-.01em', color: '#fff', marginBottom: 10 }}>
              {s.h}
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
              {s.p}
            </p>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}
