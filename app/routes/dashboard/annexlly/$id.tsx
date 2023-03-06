import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from '@remix-run/node';
import { Link, useLoaderData, Form, useActionData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import Header from '~/components/dashboard/Header';
import {
  Annexlly,
  badRequest,
  dummyAnnexlly,
  dummyUser,
  User,
} from 'utils/utils';
import { getAnnexllyById, updateAnnexlly } from '~/api.connect/annexlly.server';
import { getCurrentUser } from '~/api.connect/auth.server';
import Inloader from '~/components/Inloader';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data?.annexlly) {
    return {
      title: `Update ${
        data.annexlly.name.substring(0, 1).toUpperCase() +
        data.annexlly.name.substring(1)
      } Annexlly`,
    };
  } else if (data?.notFoundErr) {
    return {
      title: '404 Not Found - Annexlly',
    };
  }

  return { title: 'Update Annexlly' };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getCurrentUser(request);
  if (user.err) return redirect('/signin?err=401');

  const id = params.id as string;
  const annexlly = await getAnnexllyById(request, id);
  if (annexlly.status === 404) return { user, notFoundErr: true };

  return { user, annexlly };
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = params.id as string;
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

  return updateAnnexlly(validatedFields.name, validatedFields.url, request, id);
};

const NewAnnexlly = () => {
  const loaderData = useLoaderData();
  const [name, setName] = useState(loaderData?.annexlly?.name);
  const [defaultUrl, setDefaultUrl] = useState(
    loaderData?.annexlly?.defaultUrl
  );
  const actionData = useActionData();
  const [annexllyToUpdate, setAnnexllyToUpdate] =
    useState<Annexlly>(dummyAnnexlly);
  const [user, setUser] = useState<User>(dummyUser);
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  useEffect(() => {
    if (loaderData?.annexlly) setAnnexllyToUpdate(loaderData.annexlly);
  }, [loaderData?.annexlly]);

  useEffect(() => {
    if (loaderData?.user) setUser(loaderData.user);
  }, [loaderData?.user]);

  useEffect(() => {
    if (actionData?.fieldErrors || actionData?.error) setLoading(false);
  }, [actionData?.fieldErrors, actionData?.error]);

  return (
    <div>
      <Header
        title={`${
          loaderData?.notFoundErr
            ? 'Annexlly Not Found'
            : `Update ${
                annexllyToUpdate.name.substring(0, 1).toUpperCase() +
                annexllyToUpdate.name.substring(1)
              } Annexlly`
        }`}
        userImg={user.picture}
        name={user.name}
      />
      <div className='max-w-[1024px] mx-6 md:mx-auto'>
        {loaderData?.notFoundErr ? (
          <div className='bg-white my-10 text-center mx-6 md:mx-10 p-10 rounded-lg'>
            <h2 className='text-7xl md:text-9xl font-title mb-12'>404</h2>
            <p className='text-sm md:text-lg my-2'>
              This Annexlly does not exist.
            </p>
            <p className='text-sm md:text-lg my-2'>
              Please check the link isn't broken and try again
            </p>
          </div>
        ) : (
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
                  placeholder={annexllyToUpdate.name}
                  name='name'
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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
                  placeholder={annexllyToUpdate.defaultUrl}
                  name='url'
                  required
                  value={defaultUrl}
                  onChange={(e) => setDefaultUrl(e.target.value)}
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
                value={`annexlly.com${
                  name
                    ? `/${user.username}` +
                      `/${name.replaceAll(' ', '-').toLowerCase()}`
                    : annexllyToUpdate.newPath
                }`}
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
              {loading ? <Inloader /> : 'Update'}
            </button>
          </Form>
        )}
        <div className='my-7 mx-6 md:mx-10'>
          <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
            <Link
              to='/dashboard'
              className='py-3 text-sm block text-center w-full md:w-[140px] px-4 rounded-md bg-blue-100 md:order-none order-1'
            >
              Go back
            </Link>
            <Form
              method='delete'
              action='/dashboard/annexlly/delete'
              onSubmit={() => setDelLoading(true)}
            >
              <input
                type='text'
                name='id'
                value={annexllyToUpdate.id}
                className='hidden'
                readOnly
              />
              <button
                type='submit'
                className='bg-[tomato] flex justify-center items-center text-sm md:text-base text-white h-10 py-3 w-full md:w-[140px] mb-7 md:mb-0 px-4 rounded-md'
              >
                {delLoading ? <Inloader del={true} /> : 'Delete'}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAnnexlly;
