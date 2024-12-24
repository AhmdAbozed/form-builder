import '../css/globals.css';
import RootLayout from '../components/RootLayout';

//@ts-ignore
export default function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}