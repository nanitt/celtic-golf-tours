import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const password = formData.get('password');

  const sitePassword = import.meta.env.SITE_PASSWORD;

  if (!sitePassword) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (password === sitePassword) {
    cookies.set('auth', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return redirect('/');
  }

  // Wrong password - redirect back with error
  return redirect('/login?error=invalid');
};
