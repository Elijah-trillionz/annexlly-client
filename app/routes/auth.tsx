import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { signUserInWithGoogle } from '~/api.connect/auth.server';

export const meta: MetaFunction = () => {
  return {
    title: 'Signing in - Annexlly ',
    description: 'This page is a loading screen that signs you in',
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return redirect('/signin');

  return await signUserInWithGoogle(code as string);
};
