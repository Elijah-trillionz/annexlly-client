import { ActionFunction } from '@remix-run/node';
import { LoaderFunction, redirect } from 'react-router';
import { logout } from '~/api.connect/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  return redirect('/signin');
};

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};
