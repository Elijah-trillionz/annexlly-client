import { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useTransition,
} from '@remix-run/react';
import LoadingProgressBar from './components/LoadingProgressBar';
import styles from './styles/app.css';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Annexlly',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  const transition = useTransition();
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='font-body bg-gray-100'>
        {transition.state === 'loading' ? (
          <LoadingProgressBar display={true} />
        ) : (
          <LoadingProgressBar display={false} />
        )}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
