import { Link } from 'react-router-dom';

const Header = ({
  name,
  title,
  userImg,
  center,
}: {
  name: string;
  title: string;
  userImg: string;
  center?: boolean;
}) => {
  return (
    <header className='px-6 md:px-10 py-7 bg-white shadow-sm'>
      <div className='max-w-[1024px] mx-auto'>
        <div
          className={`block ${
            center ? '' : 'md:flex justify-between items-center'
          }`}
        >
          <h1
            className={`text-3xl text-center ${
              center ? '' : 'md:text-left mb-7 md:mb-0'
            } font-title font-normal`}
          >
            {title}
          </h1>
          {!center && (
            <Link
              to='/dashboard/profile'
              className='min-w-[130px] float-right md:float-none flex gap-x-2 px-4 py-2 rounded-lg bg-gray-100  items-center'
            >
              <div className={`w-6 h-6`}>
                <img
                  src={userImg}
                  className='rounded-full'
                  alt='avatar'
                  referrerPolicy='no-referrer'
                />
              </div>
              <p className='basis-auto text-xs'>{name}</p>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
