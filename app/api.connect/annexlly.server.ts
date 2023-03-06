import { json, redirect } from '@remix-run/node';
import { apiUrl, badRequest, connectionError } from '../../utils/utils';
import { getUserSession } from './auth.server';

export const getCurrentUserAnnexlly = async (request: Request) => {
  try {
    const session = await getUserSession(request);
    const serverToken = session.get('access_token');

    const res = await fetch(`${apiUrl}/annexlly`, {
      method: 'get',
      headers: {
        accept: 'application/json',
        access_token: serverToken,
      },
    });

    const jsonRes = await res.json();
    if (res.ok) return jsonRes;

    return { error: jsonRes.message, status: jsonRes.statusCode };
  } catch (err) {
    return connectionError();
  }
};

export const getAnnexllyById = async (request: Request, id: string) => {
  try {
    const session = await getUserSession(request);
    const serverToken = session.get('access_token');

    const res = await fetch(`${apiUrl}/annexlly/${id}`, {
      method: 'get',
      headers: {
        accept: 'application/json',
        access_token: serverToken,
      },
    });

    const jsonRes = await res.json();
    if (res.ok) return jsonRes;

    return { error: jsonRes.message, status: jsonRes.statusCode };
  } catch (err) {
    return connectionError();
  }
};

export const createNewAnnexlly = async (
  name: string,
  url: string,
  request: Request
) => {
  try {
    const session = await getUserSession(request);
    const serverToken = session.get('access_token');

    const res = await fetch(`${apiUrl}/annexlly/new`, {
      method: 'post',
      headers: {
        accept: 'application/json',
        access_token: serverToken,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name, defaultUrl: url }),
    });

    const jsonRes = await res.json();
    if (res.ok) return redirect('/dashboard');

    return badRequest({ error: jsonRes.message });
  } catch (err) {
    return connectionError();
  }
};

export const updateAnnexlly = async (
  name: string,
  url: string,
  request: Request,
  id: string
) => {
  try {
    const session = await getUserSession(request);
    const serverToken = session.get('access_token');

    const res = await fetch(`${apiUrl}/annexlly/${id}`, {
      method: 'put',
      headers: {
        accept: 'application/json',
        access_token: serverToken,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name, defaultUrl: url }),
    });

    const jsonRes = await res.json();
    if (res.ok) return redirect('/dashboard');

    return badRequest({ error: jsonRes.message });
  } catch (err) {
    return connectionError();
  }
};

export const deleteAnnexlly = async (request: Request, id: string) => {
  try {
    const session = await getUserSession(request);
    const serverToken = session.get('access_token');

    const res = await fetch(`${apiUrl}/annexlly/${id}`, {
      method: 'delete',
      headers: {
        accept: 'application/json',
        access_token: serverToken,
        'content-type': 'application/json',
      },
    });

    const jsonRes = await res.json();
    if (res.ok) return redirect('/dashboard');

    return badRequest({ error: jsonRes.message });
  } catch (err) {
    return connectionError();
  }
};
