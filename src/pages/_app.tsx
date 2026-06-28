import { AppProps } from 'next/app';
import Head from 'next/head';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Agentation } from 'agentation';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Kaprun 2026 | Turistický Průvodce & Tahák</title>
        <meta name="description" content="Interaktivní tahák a pomocník pro turistickou dovolenou v Kaprunu pro 4 dospělé." />
      </Head>
      <div className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased text-slate-900 bg-slate-50/50 min-h-screen flex flex-col`}>
        <Component {...pageProps} />
        {process.env.NODE_ENV === 'development' && (
          <Agentation endpoint="http://localhost:4747" />
        )}
      </div>
    </>
  );
}
