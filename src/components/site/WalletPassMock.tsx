// @ds-adherence-ignore -- Apple Wallet pass facsimile (raw hex/px to mimic PassKit).
// Port of ui_kits/wallet `Pass` — titanium card, gold glint, tread band, barcode.
import React from 'react';

export interface WalletPassMockProps {
  name?: string;
  tier?: string;
  points?: number;
  /** Full member id, e.g. "M+ 0042 1180". */
  memberId?: string;
  since?: string;
}

/** WalletPassMock — the Michelin+ loyalty pass as it appears in Apple Wallet. */
export function WalletPassMock({
  name = 'Léa Moreau',
  tier = 'Titane',
  points = 12480,
  memberId = 'M+ 0042 1180',
  since = '2024',
}: WalletPassMockProps) {
  const num = memberId.replace(/^M\+\s*/, '');
  const fields: [string, string][] = [['Membre', name], ['Depuis', since], ['N°', num]];

  return (
    <div style={{
      position: 'relative', borderRadius: 16, overflow: 'hidden', width: '100%',
      background: 'repeating-linear-gradient(98deg, rgba(255,255,255,.05) 0 1px, transparent 1px 4px), linear-gradient(140deg, #767982 0%, #44474e 42%, #585b63 64%, #303338 100%)',
      boxShadow: '0 18px 40px -14px rgba(0,0,0,.7), 0 0 0 1px rgba(214,178,120,.2)',
      color: '#fff', fontFamily: 'var(--font-body)',
    }}>
      {/* gold glow + tread */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: .85, pointerEvents: 'none', background: 'radial-gradient(70% 60% at 84% 4%, rgba(214,178,120,.28), transparent 56%), linear-gradient(125deg, rgba(255,255,255,.2) 0%, transparent 26%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 38, opacity: .4, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(115deg, rgba(227,199,154,.6) 0 7px, rgba(227,199,154,.2) 7px 13px)', WebkitMask: 'linear-gradient(180deg,transparent,#000)', mask: 'linear-gradient(180deg,transparent,#000)' }} />

      {/* header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/bibendum.svg" alt="" style={{ height: 26 }} />
          <span style={{ fontFamily: 'var(--font-wordmark)', fontStyle: 'italic', fontWeight: 800, fontSize: '1.05rem', textTransform: 'uppercase', letterSpacing: '-.01em' }}>
            Michelin<span style={{ background: 'var(--gold-grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>+</span>
          </span>
        </div>
        <span style={{ fontSize: '.5rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#e8dcc6', padding: '4px 8px', borderRadius: 999, background: 'rgba(255,255,255,.14)' }}>Palier {tier}</span>
      </div>

      {/* primary field */}
      <div style={{ position: 'relative', padding: '14px 16px 4px' }}>
        <div style={{ fontSize: '.5rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Solde de points</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 3 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.9rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{points.toLocaleString('fr-FR')}</span>
          <span style={{ fontSize: '.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-secondary)' }}>pts</span>
        </div>
      </div>

      {/* secondary fields */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', gap: 10, padding: '10px 16px 16px' }}>
        {fields.map(([k, v]) => (
          <div key={k} style={{ minWidth: 0 }}>
            <div style={{ fontSize: '.45rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{k}</div>
            <div style={{ fontSize: '.78rem', fontWeight: 700, marginTop: 3, fontFamily: k === 'N°' ? 'var(--font-mono)' : 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* barcode area (white) */}
      <div style={{ position: 'relative', background: '#fff', padding: '12px 0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 1.4, height: 46, alignItems: 'stretch', padding: '0 22px' }}>
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} style={{ width: (i * 53 % 7 < 3 ? 1.4 : 3.2), background: '#0A0A0C', borderRadius: .5 }} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', letterSpacing: '.18em', color: '#0A0A0C' }}>{memberId}</span>
      </div>
    </div>
  );
}
