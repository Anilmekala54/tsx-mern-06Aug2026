// A self-contained, fake JWT implementation for demo purposes.
//
// The assignment's API (swapi.info) does not require authentication, so this
// module mocks a login/token-issuing backend entirely on the client: it
// signs tokens with an HMAC-like digest (SubtleCrypto not required, this is
// NOT for production use) purely so the app can demonstrate a realistic
// login -> access token -> silent refresh -> logout flow.

export interface JwtPayload {
  sub: string;
  name: string;
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

const FAKE_SECRET = 'demo-only-not-a-real-secret';

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return atob(input.replace(/-/g, '+').replace(/_/g, '/') + pad);
}

// Deterministic, non-cryptographic checksum used to mimic a signature. This
// is only meant to prove the round trip works, not to provide real security.
function fakeSign(data: string): string {
  let hash = 0;
  const combined = data + FAKE_SECRET;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
}

export function issueToken(payload: Omit<JwtPayload, 'iat' | 'exp'>, ttlSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const header = base64UrlEncode(JSON.stringify({ alg: 'FAKE256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = fakeSign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;
    if (fakeSign(`${header}.${body}`) !== signature) return null;
    return JSON.parse(base64UrlDecode(body)) as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(payload: JwtPayload): boolean {
  return Math.floor(Date.now() / 1000) >= payload.exp;
}

// Hardcoded demo credentials (mocked backend, per assignment instructions).
export const DEMO_USERNAME = 'jedi_candidate';
export const DEMO_PASSWORD = 'UseTheForce123';

export function mockLogin(username: string, password: string): { access: string; refresh: string } | null {
  if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) return null;
  const access = issueToken({ sub: username, name: username, type: 'access' }, 60); // 60s for demo visibility
  const refresh = issueToken({ sub: username, name: username, type: 'refresh' }, 60 * 60 * 8);
  return { access, refresh };
}

export function mockRefresh(refreshToken: string): { access: string; refresh: string } | null {
  const payload = decodeToken(refreshToken);
  if (!payload || payload.type !== 'refresh' || isExpired(payload)) return null;
  const access = issueToken({ sub: payload.sub, name: payload.name, type: 'access' }, 60);
  const refresh = issueToken({ sub: payload.sub, name: payload.name, type: 'refresh' }, 60 * 60 * 8);
  return { access, refresh };
}
