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
      <a href='/signin'>Login via Google</a>
    </div>
  );
}
