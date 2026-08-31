const encoder = new TextEncoder();
const SESSION_LIFETIME_SECONDS = 60 * 60 * 24 * 7;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;

  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
    return Uint8Array.from(atob(padded), char => char.charCodeAt(0));
  } catch {
    return null;
  }
}

async function signingKey(password: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(password), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(payload: string, password: string): Promise<string> {
  const signature = await crypto.subtle.sign('HMAC', await signingKey(password), encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

/** Creates an opaque, tamper-evident preview session with a server-checked expiry. */
export async function createPreviewSession(password: string, now = Date.now()): Promise<string> {
  const expiresAt = Math.floor(now / 1000) + SESSION_LIFETIME_SECONDS;
  const payload = String(expiresAt);
  return `${payload}.${await sign(payload, password)}`;
}

/** Verifies both the session signature and its expiry. */
export async function isValidPreviewSession(
  session: string | undefined,
  password: string,
  now = Date.now(),
): Promise<boolean> {
  if (!session) return false;

  const [expiresAtText, signature, ...extra] = session.split('.');
  if (extra.length || !/^\d{10,}$/.test(expiresAtText) || !signature) return false;

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;

  const signatureBytes = fromBase64Url(signature);
  if (!signatureBytes) return false;

  return crypto.subtle.verify(
    'HMAC',
    await signingKey(password),
    // TS types BufferSource as ArrayBuffer-backed; a Uint8Array from a
    // possibly-shared buffer does not narrow. The bytes are ours and plain.
    signatureBytes as unknown as BufferSource,
    encoder.encode(expiresAtText),
  );
}
