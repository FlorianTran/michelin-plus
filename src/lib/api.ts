// Michelin+ — Grip · API route helpers.
import { NextResponse } from 'next/server';
import { UnauthorizedError } from './auth';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Wrap a handler so thrown UnauthorizedError → 401 and other errors → 500. */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof UnauthorizedError) return fail('Non authentifié', 401);
    console.error('[api]', err);
    return fail('Erreur serveur', 500);
  }
}

/** Debug endpoints are gated by a shared token (header or body), demo-grade. */
export function checkDebugToken(provided: string | null | undefined): boolean {
  const expected = process.env.DEBUG_TOKEN || 'grip';
  return provided === expected;
}
