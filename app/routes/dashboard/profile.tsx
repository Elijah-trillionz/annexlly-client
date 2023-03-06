import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { Link, useLoaderData, Form, useActionData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import Header from '~/components/dashboard/Header';
import { getCurrentUser } from '~/api.connect/auth.server';
import Inloader from '~/components/Inloader';
import { EditSvg } from '~/components/svgs/EditSvg';
import { updateUsername } from '~/api.connect/user.server';
import { dummyUser } from 'utils/utils';

export const meta: MetaFunction = () => {
  return { title: 'Your Profile - Annexlly' };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (user.err) return redirect('/signin?err=401');

  return user;
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const username = body.get('username');

  if (!username) return { formError: true };

  return await updateUsername(username as string, request);
};

const Profile = () => {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [updateUsername, setUpdateUsername] = useState(false);

  return (
    <div>
      <Header
        title={`Your Profile`}
        userImg={loaderData.picture}
        name={loaderData.name}
        center={true}
      />
      <div className='max-w-[1024px] mx-6 md:mx-auto'>
        <div className='bg-white my-10 mx-6 md:mx-10 p-10 rounded-lg'>
          <div
            className={`max-w-[144px] flex justify-center items-center mx-auto h-36`}
          >
            <img
              src={loaderData.picture}
              className='rounded-full'
              alt='avatar'
              referrerPolicy='no-referrer'
            />
          </div>
          <p className='text-lg md:text-2xl mb-2 text-center font-bold'>
            {loaderData.name}
          </p>
          <p
            className='text-sm md:text-lg my-2 flex justify-center cursor-pointer'
            onClick={() => setUpdateUsername(true)}
          >
            <span className='pr-1'>@{loaderData.username}</span> <EditSvg />
          </p>
          <div className='flex flex-col md:flex-row justify-between items-center mt-10 pt-10 border-t border-t-gray-200'>
            <p className='text-xs  md:text-sm mb-6 md:mb-0 text-center'>
              {loaderData.email}
            </p>
            <p className='text-xs md:text-sm mb-0 text-center'>
              Joined on {new Date(loaderData.createdAt).toDateString()}
            </p>
          </div>
        </div>
        <div className='my-7 mx-6 md:mx-10'>
          <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
            <Link
              to='/dashboard'
              className='py-3 text-sm block text-center w-full md:w-[140px] px-4 rounded-md bg-blue-100 md:order-none order-1'
            >
              To dashboard
            </Link>
            <Form method='delete' action='/dashboard/signout'>
              <input type='text' name='id' className='hidden' readOnly />
              <button
                type='submit'
                className='bg-[tomato] flex justify-center items-center text-sm md:text-base text-white h-10 py-3 w-full md:w-[140px] mb-7 md:mb-0 px-4 rounded-md'
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 left-0 bottom-0 ${
          updateUsername ? 'translate-y-0' : '-translate-y-full'
        } transition-transform`}
      >
        <UpdateUsernameForm
          currentUsername={loaderData.username}
          formError={actionData?.formError}
          apiError={actionData?.error}
        />
        <div
          className={`bg-[rgba(0,0,0,.2)] absolute top-0 left-0 right-0 bottom-0 ${
            updateUsername ? 'scale-100' : 'scale-0'
          }`}
          onClick={() => setUpdateUsername(false)}
        ></div>
      </div>
    </div>
  );
};

export default Profile;

const UpdateUsernameForm = ({
  currentUsername,
  formError,
  apiError,
}: {
  currentUsername: string;
  apiError: string;
  formError: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formError || apiError) setLoading(false);
  }, [formError, apiError]);

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
      <Form
        method='post'
        onSubmit={() => setLoading(true)}
        className='bg-white mx-auto md:mx-auto py-10 px-6 rounded-lg shadow-md max-w-[240px] min-w-[240px] md:max-w-[300px] md:min-w-[300px]'
      >
        <div>
          <label htmlFor='username' className='block mb-2'>
            Username
          </label>
          <input
            type='text'
            placeholder={currentUsername ? currentUsername : 'Enter username'}
            name='username'
            required
            className='border-2 border-gray-400 text-sm block w-full rounded-md px-4 py-2'
          />
          <p className='text-red-500 text-xs mt-1'>
            {formError && 'This field is required'}
          </p>
          <p className='text-red-500 text-xs mt-2'>{apiError && apiError}</p>
        </div>
        <button
          type='submit'
          className='bg-secondary flex justify-center items-center text-sm md:text-base text-white h-10 w-full rounded-lg mt-7'
        >
          {loading ? <Inloader /> : 'Update'}
        </button>
      </Form>
    </div>
  );
};
