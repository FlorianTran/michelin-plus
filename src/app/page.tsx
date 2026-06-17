import Link from 'next/link';
import { MarketingHeader } from '@/components/site/MarketingHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

// NOTE: Phase A placeholder landing. Phase B replaces this with the full
// "Grip" landing (animated B&W hero, narrative, tiers showcase, ambassador…).
export default function Home() {
  return (
    <>
      <MarketingHeader />
      <main className="mch-container" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBlock: 80 }}>
        <span className="mch-eyebrow" style={{ marginBottom: 16 }}>Club premium · By Michelin LB 2 Wheels</span>
        <h1 className="mch-title" style={{ fontSize: 'var(--fs-display-2xl)', maxWidth: '16ch' }}>
          Chaque kilomètre te rapproche de l’<em style={{ fontStyle: 'normal', color: 'var(--mch-yellow)' }}>exception</em>.
        </h1>
        <p className="mch-lead" style={{ maxWidth: '50ch', marginTop: 22 }}>
          Roule, gagne des points — en magasin ou en ligne — grimpe les paliers et débloque récompenses,
          éditions limitées numérotées et l’accès à la communauté.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
          <Link href="/login" style={cta('blue')}>Rejoindre le club</Link>
          <Link href="/dashboard" style={cta('outline')}>Voir le tableau de bord</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function cta(kind: 'blue' | 'outline'): React.CSSProperties {
  return {
    height: 'var(--control-h-lg)', display: 'inline-flex', alignItems: 'center', padding: '0 28px',
    borderRadius: 'var(--radius-pill)', fontWeight: 700, fontFamily: 'var(--font-body)',
    ...(kind === 'blue'
      ? { background: 'var(--gloss-blue)', color: '#fff', boxShadow: 'var(--gloss-shadow-blue)' }
      : { background: 'transparent', color: '#fff', border: '1px solid var(--border-bright)' }),
  };
}
