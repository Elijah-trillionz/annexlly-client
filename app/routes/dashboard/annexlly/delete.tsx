import { ActionFunction } from '@remix-run/node';
import { LoaderFunction, redirect } from 'react-router';
import { deleteAnnexlly } from '~/api.connect/annexlly.server';

export const loader: LoaderFunction = async ({ request }) => {
  return redirect('/dashboard');
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const annexllyId = body.get('id') as string;

  return deleteAnnexlly(request, annexllyId);
};
