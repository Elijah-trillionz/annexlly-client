import { LoaderFunction, redirect } from '@remix-run/node';
import { getCurrentUser } from '~/api.connect/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (!user.err) return redirect('/dashboard');

  return '';
};

export default function Index() {
  return (
    <div>
      <h1>Welcome to Annexlly</h1>
      <a href='https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=258549199436-odp519uffrsvguv7aavngp4q92nivatp.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&access_type=offline&scope=profile%20email&service=lso&o2v=2&flowName=GeneralOAuthFlow'>
        Login via Google
      </a>
    </div>
  );
}
