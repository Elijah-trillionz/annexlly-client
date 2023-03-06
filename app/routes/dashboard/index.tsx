import { LoaderFunction, MetaFunction, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { abbreviateNumber, Annexlly, dummyUser, User } from 'utils/utils';
import { getCurrentUserAnnexlly } from '~/api.connect/annexlly.server';
import { getCurrentUser } from '~/api.connect/auth.server';
import AnnexllyItem from '~/components/dashboard/AnnexllyItem';
export const meta: MetaFunction = () => {
  return { title: 'Dashboard - Annexlly' };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getCurrentUser(request);
  if (user.err) return redirect('/signin?err=401');

  const annexlly = await getCurrentUserAnnexlly(request);

  return { annexlly, user };
};

const Index = () => {
  const loaderData = useLoaderData();
  const [annexlly, setAnnexlly] = useState<Annexlly[]>([]);
  const [user, setUser] = useState<User>(dummyUser);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    if (loaderData?.annexlly) setAnnexlly(loaderData.annexlly);
  }, [loaderData?.annexlly]);

  useEffect(() => {
    if (loaderData?.user) setUser(loaderData.user);
  }, [loaderData?.user]);

  const overviewStats = [
    {
      title: 'affiliate links',
      stats: annexlly.length,
    },
    {
      title: 'total clicks',
      stats: totalClicks,
    },
  ];

  useEffect(() => {
    const totalClicks = annexlly.map((annexlly) => annexlly.numOfClicks);
    if (totalClicks.length >= 1) {
      setTotalClicks(
        totalClicks.reduce((prevValue, currentVal) => prevValue + currentVal)
      );
    }
  }, [annexlly]);

  annexlly.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    else if (b.createdAt > a.createdAt) return 1;

    return 0;
  });

  return (
    <div>
      <header className='px-6 md:px-10 py-7 bg-white shadow-sm'>
        <div className='max-w-[1024px] mx-auto'>
          <div className='block md:flex justify-between items-center'>
            <h1 className='text-3xl text-center md:text-left font-title font-normal mb-7 md:mb-0'>
              Annexlly Dashboard
            </h1>
            <Link
              to='/dashboard/profile'
              className='min-w-[130px] float-right md:float-none flex gap-x-2 px-4 py-2 rounded-lg bg-gray-100  items-center'
            >
              <div className={`w-6 h-6`}>
                <img
                  src={user.picture}
                  className='rounded-full'
                  alt='avatar'
                  referrerPolicy='no-referrer'
                />
              </div>
              <p className='basis-auto text-xs'>{user.name}</p>
            </Link>
          </div>
          <div className='hidden mt-10 md:grid grid-cols-3 max-w-[70%]'>
            {overviewStats.map((stat, index) => (
              <div key={index}>
                <span className='font-title text-3xl block mb-2 font-bold'>
                  {abbreviateNumber(stat.stats)}
                </span>
                <span className='font-light capitalize'>{stat.title}</span>
              </div>
            ))}
          </div>
        </div>
      </header>
      <main>
        <div className='px-6 md:px-10 block my-10 md:hidden'>
          {overviewStats.map((stat, index) => (
            <div
              key={index}
              className='bg-secondary text-white flex justify-between items-center px-4 py-2 rounded-md mb-5'
            >
              <span className='font-light text-xs capitalize'>
                {stat.title}
              </span>
              <span className='font-title text-xl block font-bold'>
                {abbreviateNumber(stat.stats)}
              </span>
            </div>
          ))}
        </div>
        <div className='px-6 md:px-14 md:border-none md:py-12 border-t border-gray-400 py-7'>
          {annexlly.length > 0 ? (
            <div className='max-w-[1024px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-x-5 gap-y-8'>
              {annexlly.map((annexllyItem) => (
                <AnnexllyItem
                  name={annexllyItem.name}
                  date={annexllyItem.createdAt}
                  id={annexllyItem.id}
                  key={annexllyItem.id}
                />
              ))}
            </div>
          ) : (
            <p className='text-2xl text-center text-gray-600'>
              You have no annexlly yet
            </p>
          )}
        </div>
        {annexlly.length >= 3 ? (
          <div className='px-6 md:px-14 text-center'>
            <p className='text-gray-600 mb-2'>
              You have reached the maximum number of free Annexlly.
            </p>
            <p className='text-gray-600 mb-2'>
              You cannot create any more Annexlly.
            </p>
            <p className='text-gray-600 mb-2'>
              Consider{' '}
              <Link to='/support' className='underline'>
                supporting us
              </Link>{' '}
              to scale.
            </p>
          </div>
        ) : (
          <div className='md:max-w-[280px] mx-auto my-10 px-6 md:px-0'>
            <Link
              to='/dashboard/annexlly/new'
              className='bg-secondary flex justify-center items-center text-sm md:text-base text-white h-10 md:h-14 w-full rounded-lg'
            >
              Create {annexlly.length >= 1 ? 'New' : ''} Annexlly
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
