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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Preserve what the visitor typed so a failed submit doesn't wipe the form. */
function backToForm(redirect: (path: string) => Response, reason: string, fields: Record<string, string>) {
  const params = new URLSearchParams({ error: reason });
  for (const [key, value] of Object.entries(fields)) {
    if (value) params.set(key, value);
  }
  return redirect(`/contact?${params.toString()}`);
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const get = (key: string) => String(formData.get(key) ?? '').trim();

  // Honeypot — report success so bots don't learn anything.
  if (get('bot-field')) return redirect('/contact/thank-you');

  const fields = {
    firstName: get('firstName'),
    lastName: get('lastName'),
    email: get('email'),
    phone: get('phone'),
    message: get('message'),
    destination: get('destination'),
    travelDates: get('travelDates'),
    groupSize: get('groupSize')
  };

  if (!fields.firstName || !fields.lastName || !fields.email || !fields.message) {
    return backToForm(redirect, 'missing', fields);
  }
  if (!EMAIL_RE.test(fields.email)) {
    return backToForm(redirect, 'email', fields);
  }
  if (!DESTINATIONS.includes(fields.destination) || !GROUP_SIZES.includes(fields.groupSize)) {
    return backToForm(redirect, 'invalid', fields);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.NOTIFICATION_EMAIL;
  const from = import.meta.env.ENQUIRY_FROM_EMAIL;

  // Never pretend an enquiry was delivered when it wasn't.
  if (!apiKey || !to || !from) {
    console.error('[contact] Missing RESEND_API_KEY, NOTIFICATION_EMAIL or ENQUIRY_FROM_EMAIL');
    return backToForm(redirect, 'server', fields);
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
      return backToForm(redirect, 'server', fields);
    }
  } catch (err) {
    console.error('[contact] Failed to send enquiry:', err);
    return backToForm(redirect, 'server', fields);
  }

  return redirect('/contact/thank-you');
};
