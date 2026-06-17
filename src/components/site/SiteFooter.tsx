'use client';
import { Footer } from '@/components/grip';
import { FOOTER_COLUMNS } from '@/lib/nav';

export function SiteFooter() {
  return <Footer bibendumSrc="/brand/bibendum.svg" columns={FOOTER_COLUMNS} />;
}
