import { LoaderFunction, MetaFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getCurrentUser } from '~/api.connect/auth.server';
import LinkShortener from '~/components/svgs/LinkShortener';

export const meta: MetaFunction = () => {
  return {
    title: 'Sign in - Annexlly',
    description: 'Sign in to annexlly through the available options',
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (!user.err) return redirect('/dashboard');

  const url = new URL(request.url);
  const err = url.searchParams.get('err');
  if (err) return { err: 'You are not authenticated. Please sign in' };

  return '';
};

const Signin = () => {
  const loaderData = useLoaderData();

  return (
    <div className='block md:flex'>
      <section
        className={
          'bg-blue-100 min-h-screen md:min-w-[350px] md:max-w-[350px] px-5'
        }
      >
        <h1 className='text-4xl font-title pt-6 text-center md:text-left'>
          <a href='/'>Sign in - Annexlly</a>
        </h1>
        <div className='mt-20'>
          <a
            href='https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=258549199436-odp519uffrsvguv7aavngp4q92nivatp.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&access_type=offline&scope=profile%20email&service=lso&o2v=2&flowName=GeneralOAuthFlow'
            className='flex items-center justify-center bg-white rounded-lg h-12 py-1 shadow'
          >
            <span className='basis-4/5 items-center flex justify-center'>
              <span className='block mr-4'>
                <img
                  src='/svgs/google.svg'
                  alt='google logo'
                  width={30}
                  height={30}
                />
              </span>
              <span className='basis-auto block'>Sign in with Google</span>
            </span>
          </a>
        </div>
        {loaderData?.err && (
          <div className='mt-8'>
            <p className='text-sm text-red-400'>
              Sign in failed. Please try again!
            </p>
          </div>
        )}
      </section>
      <section className='basis-auto hidden md:block'>
        <LinkShortener className={'block max-w-[80%] w-[80%] mx-auto'} />
      </section>
    </div>
  );
};

export default Signin;
