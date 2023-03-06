import { redirect } from '@remix-run/node';
import { apiUrl, badRequest, connectionError } from '../../utils/utils';
import { getUserSession } from './auth.server';

export const updateUsername = async (username: string, request: Request) => {
  try {
    const session = await getUserSession(request);
    const serverToken = session.get('access_token');

    const res = await fetch(`${apiUrl}/users/update-username`, {
      method: 'put',
      headers: {
        accept: 'application/json',
        access_token: serverToken,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const jsonRes = await res.json();
    if (res.ok) return redirect('/dashboard');

    return badRequest({ error: jsonRes.message });
  } catch (err) {
    return connectionError();
  }
};
