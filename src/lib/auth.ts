// Michelin+ — Grip · hand-rolled auth (bcrypt + signed session cookie).
// No external auth provider — demo-grade but real: hashed passwords, HS256 JWT.
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';
import { prisma } from './db';

const COOKIE = 'mch_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET || 'dev-michelin-plus-session-secret-change-me-please-32b';
  return new TextEncoder().encode(s);
}

/**
 * Whether to mark the session cookie `Secure`. Defaults to on in production,
 * but can be forced off via `COOKIE_SECURE=false` for a demo served over plain
 * HTTP — browsers silently drop a `Secure` cookie over `http://`, which would
 * make every login appear to "do nothing" (the session never persists).
 */
function cookieSecure(): boolean {
  if (process.env.COOKIE_SECURE === 'false') return false;
  if (process.env.COOKIE_SECURE === 'true') return true;
  return process.env.NODE_ENV === 'production';
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

async function signToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

/** Set the session cookie for a user (after signup/login). */
export async function createSession(userId: string): Promise<void> {
  const token = await signToken(userId);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: cookieSecure(),
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Resolve the logged-in user from the session cookie, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const userId = payload.sub;
    if (!userId || typeof userId !== 'string') return null;
    return prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}

/** Like getCurrentUser but throws — use in protected route handlers. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}
