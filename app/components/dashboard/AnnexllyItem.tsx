import { Link } from '@remix-run/react';

const AnnexllyItem = ({
  name,
  date,
  id,
}: {
  name: string;
  date: string;
  id: string;
}) => {
  return (
    <Link
      to={`/dashboard/annexlly/${id}`}
      className='bg-white md:py-5 px-4 shadow py-3 md:shadow rounded-lg'
    >
      <p className='capitalize mb-4 text-2xl font-bold'>{name}</p>
      <span className='text-xs text-gray-600'>
        {new Date(date).toDateString()}
      </span>
    </Link>
  );
};

export default AnnexllyItem;
