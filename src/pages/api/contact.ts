import type { APIRoute } from 'astro';
import { Resend } from 'resend';

/**
 * Contact enquiry handler.
 *
 * Replaces the old `data-netlify` form, which silently discarded every enquiry:
 * Netlify's form scraper is build-time infrastructure that does not exist on
 * Vercel, so the POST body went nowhere while /contact/thank-you still told the
 * sender their message had arrived.
 *
 * Follows the conventions in src/pages/api/auth/login.ts — formData parsing,
 * import.meta.env, guard clauses, and redirect-based outcomes.
 */

const DESTINATIONS = ['', 'scotland', 'ireland', 'multiple', 'unsure'];
const GROUP_SIZES = ['', '1-2', '3-4', '5-8', '9-12', '12+'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_REQUEST_BYTES = 16 * 1024;
const MAX_FIELD_LENGTHS = {
  firstName: 100,
  lastName: 100,
  email: 254,
  phone: 50,
  message: 5_000,
  destination: 20,
  travelDates: 100,
  groupSize: 10,
} as const;

async function verifyTurnstile(token: string, secret: string): Promise<boolean> {
  if (!token || token.length > 2_048) return false;

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    if (!response.ok) return false;

    const result = await response.json() as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Never put enquiry details into a URL, logs, browser history, or referrers. */
function backToForm(redirect: (path: string) => Response, reason: string) {
  return redirect(`/contact?error=${encodeURIComponent(reason)}`);
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return backToForm(redirect, 'invalid');
  }

  const formData = await request.formData();
  const get = (key: string) => String(formData.get(key) ?? '').trim();

  // Honeypot — report success so bots don't learn anything.
  if (get('bot-field')) return redirect('/contact/thank-you');

  // Once configured, Turnstile is fail-closed: a provider outage or missing
  // challenge response never turns the form into an unauthenticated mail relay.
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && !await verifyTurnstile(get('cf-turnstile-response'), turnstileSecret)) {
    return backToForm(redirect, 'invalid');
  }

  const fields = {
    firstName: get('firstName'),
    lastName: get('lastName'),
    email: get('email'),
    phone: get('phone'),
    message: get('message'),
    destination: get('destination'),
    travelDates: get('travelDates'),
    groupSize: get('groupSize'),
  };

  if (Object.entries(MAX_FIELD_LENGTHS).some(([key, maxLength]) => fields[key as keyof typeof fields].length > maxLength)) {
    return backToForm(redirect, 'invalid');
  }

  if (!fields.firstName || !fields.lastName || !fields.email || !fields.message) {
    return backToForm(redirect, 'missing');
  }
  if (!EMAIL_RE.test(fields.email)) {
    return backToForm(redirect, 'email');
  }
  if (!DESTINATIONS.includes(fields.destination) || !GROUP_SIZES.includes(fields.groupSize)) {
    return backToForm(redirect, 'invalid');
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.NOTIFICATION_EMAIL;
  const from = import.meta.env.ENQUIRY_FROM_EMAIL;

  // Never pretend an enquiry was delivered when it wasn't.
  if (!apiKey || !to || !from) {
    console.error('[contact] Missing RESEND_API_KEY, NOTIFICATION_EMAIL or ENQUIRY_FROM_EMAIL');
    return backToForm(redirect, 'server');
  }

  const rows: Array<[string, string]> = [
    ['Name', `${fields.firstName} ${fields.lastName}`],
    ['Email', fields.email],
    ['Phone', fields.phone || '—'],
    ['Destination', fields.destination || '—'],
    ['Travel dates', fields.travelDates || '—'],
    ['Group size', fields.groupSize || '—']
  ];

  const html = `
    <h2>New enquiry from celticgolftours.com</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join('')}
    </table>
    <h3>Their message</h3>
    <p style="white-space:pre-wrap">${escapeHtml(fields.message)}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: fields.email,
      subject: `Golf enquiry — ${fields.firstName} ${fields.lastName}`,
      html
    });
    if (error) {
      console.error('[contact] Resend rejected the send:', error);
      return backToForm(redirect, 'server');
    }
  } catch (err) {
    console.error('[contact] Failed to send enquiry:', err);
    return backToForm(redirect, 'server');
  }

  return redirect('/contact/thank-you');
};
