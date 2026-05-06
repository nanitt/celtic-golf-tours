import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('auth', { path: '/' });
  return redirect('/login');
};

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('auth', { path: '/' });
  return redirect('/login');
};
