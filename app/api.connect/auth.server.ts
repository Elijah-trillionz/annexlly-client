import { apiUrl } from '../../utils/utils';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

export const signUserInWithGoogle = async (code: string) => {
  const res = await fetch(`${apiUrl}/users/signin`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  const jsonRes = await res.json();
  if (res.ok) return createUserSession(jsonRes.token, '/dashboard');

  return redirect('/signin?err=401');
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('No session secret. Application error');

const storage = createCookieSessionStorage({
  cookie: {
    path: '/',
    name: '__user_access__',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 86400 * 90,
    secrets: [sessionSecret],
  },
});

const createUserSession = async (serverToken: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set('access_token', serverToken);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
};

export const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'));
};

//get logged in user
export const getCurrentUser = async (request: Request) => {
  const session = await getUserSession(request);
  const serverToken = session.get('access_token');

  const res = await fetch(`${apiUrl}/users/user`, {
    method: 'get',
    headers: {
      accept: 'application/json',
      access_token: serverToken,
    },
  });

  const jsonRes = await res.json();
  if (res.ok) return jsonRes;

  return { err: true, errorMsg: jsonRes.message };
};

export const logout = async (request: Request) => {
  const session = await getUserSession(request);

  return redirect('/signin', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
};
