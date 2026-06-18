import type { Metadata } from 'next';
import '../styles/globals.css';
import { CookieBanner } from '@/components/site/CookieBanner';

const SITE_TITLE = 'Michelin+ — Le club des cyclistes premium';
const SITE_DESCRIPTION =
  'Chaque kilomètre te rapproche de l’exception. Points, paliers, éditions numérotées, équipes — le programme communautaire Michelin+ (démo hackathon).';
const OG_IMAGE = '/cards/card-carbon-premium.png';

export const metadata: Metadata = {
  metadataBase: new URL('https://michelin.plus'),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: { icon: '/brand/logo-michelin-plus.svg' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Michelin+',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1332, height: 800, alt: 'Carte Michelin+ carbone, liseré or' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Display: Archivo (Michelin Unit Titling substitute) · Wordmark: Saira italic ·
            Body: Noto Sans (charte) · Mono: JetBrains Mono. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Saira:ital,wght@1,600;1,700;1,800;1,900&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,700&family=JetBrains+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
