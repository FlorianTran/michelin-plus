'use client';
import { Footer } from '@/components/grip';
import { FOOTER_COLUMNS } from '@/lib/nav';

export function SiteFooter() {
  return <Footer columns={FOOTER_COLUMNS} />;
}
