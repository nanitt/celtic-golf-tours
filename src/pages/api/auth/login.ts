import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'crypto';
import { createPreviewSession } from '../../../lib/preview-session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const password = String(formData.get('password') ?? '');

  const sitePassword = import.meta.env.SITE_PASSWORD;

  if (!sitePassword) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const passwordMatch =
    password.length === sitePassword.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(sitePassword));

  if (passwordMatch) {
    cookies.set('preview_session', await createPreviewSession(sitePassword), {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return redirect('/');
  }

  // Wrong password - redirect back with error
  return redirect('/login?error=invalid');
};
