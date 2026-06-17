// Michelin+ — Grip · parrainage (referral) helpers.
import type { Prisma, PrismaClient } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;

/** Points credited to the referrer when a filleul signs up via their link. */
export const REFERRAL_BONUS = 1000;

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars

function randomSuffix(len = 4): string {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/** A readable code candidate from the member's name, e.g. "LEA-7QK2". */
export function referralCodeCandidate(name: string): string {
  const base = (name.split(' ')[0] || 'MICH')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 4) || 'MICH';
  return `${base}-${randomSuffix()}`;
}

/** Generate a referral code guaranteed unique against the DB. */
export async function uniqueReferralCode(db: Db, name: string): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = referralCodeCandidate(name);
    const clash = await db.user.findUnique({ where: { referralCode: code } });
    if (!clash) return code;
  }
  // extremely unlikely fallback
  return `MICH-${randomSuffix(6)}`;
}

/** Build the absolute share link for a referral code. */
export function referralLink(code: string, origin: string): string {
  return `${origin.replace(/\/$/, '')}/parrainage/${code}`;
}
