import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { Link, useLoaderData, Form, useActionData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import Header from '~/components/dashboard/Header';
import { badRequest } from 'utils/utils';
import { createNewAnnexlly } from '~/api.connect/annexlly.server';
import { getCurrentUser } from '~/api.connect/auth.server';
import Inloader from '~/components/Inloader';

export const meta: MetaFunction = () => {
  return { title: 'Create New Annexlly' };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (user.err) return redirect('/signin?err=401');

  return user;
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const name = body.get('name');
  const url = body.get('url');

  const fieldErrors = {
    name: !name,
    url: !url,
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors });
  }

  const validatedFields = {
    name: name as string,
    url: url as string,
  };

  return createNewAnnexlly(validatedFields.name, validatedFields.url, request);
};

const NewAnnexlly = () => {
  const loaderData = useLoaderData();
  const [name, setName] = useState('');
  const actionData = useActionData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actionData?.fieldErrors || actionData?.error) setLoading(false);
  }, [actionData?.fieldErrors, actionData?.error]);

  return (
    <div>
      <Header
        title='Create New Annexlly'
        userImg={loaderData.picture}
        name={loaderData.name}
      />
      <div className='max-w-[1024px] mx-6 md:mx-auto'>
        <Form
          method='post'
          className='bg-white my-10 mx-6 md:mx-10 p-10 rounded-lg'
          onSubmit={() => setLoading(true)}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-8'>
            <div>
              <label htmlFor='name' className='block mb-2'>
                Name
              </label>
              <input
                type='text'
                placeholder='Enter name of annexlly'
                name='name'
                onChange={(e) => setName(e.target.value)}
                required
                className='border-2 border-gray-400 text-sm block w-full rounded-md px-4 py-2'
              />
              <p className='text-red-500 text-xs mt-1'>
                {actionData?.fieldErrors?.name && 'This field is required'}
              </p>
            </div>
            <div>
              <label htmlFor='url' className='block mb-2'>
                URL
              </label>
              <input
                type='url'
                placeholder='Enter url to customise'
                name='url'
                required
                className='border-2 border-gray-400 text-sm block w-full rounded-md px-4 py-2'
              />

              <p className='text-red-500 text-xs mt-1'>
                {actionData?.fieldErrors?.url && 'This field is required'}
              </p>
            </div>
          </div>
          <div className='my-8'>
            <label htmlFor='newUrl' className='block mb-2'>
              Your Annexlly:
            </label>
            <input
              type='url'
              value={`annexlly.com/${loaderData.username}/${name
                .replaceAll(' ', '-')
                .toLowerCase()}`}
              name='newUrl'
              disabled
              title='your display url'
              className='border-2 border-gray-400 cursor-not-allowed text-sm block w-full rounded-md px-4 py-2'
            />
          </div>

          <p className='text-red-500 text-xs mt-1 mb-2'>
            {actionData?.error && actionData.error}
          </p>
          <button
            type='submit'
            className='bg-secondary flex justify-center items-center text-sm md:text-base text-white h-10 w-full rounded-lg'
          >
            {loading ? <Inloader /> : 'Create'}
          </button>
        </Form>
        <div className='my-7 mx-6 md:mx-10'>
          <Link
            to='/dashboard'
            className='py-3 text-sm block text-center w-[140px] px-4 rounded-md bg-blue-100'
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewAnnexlly;
