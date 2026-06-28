import { Agentation } from 'agentation';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <title>Kaprun 2026 | Turistický Průvodce & Tahák</title>
        <meta
          name="description"
          content="Interaktivní tahák a pomocník pro turistickou dovolenou v Kaprunu pro 4 dospělé."
        />
      </Head>
      <div
        className={`${inter.variable} flex min-h-screen flex-col bg-slate-50/50 font-sans text-slate-900 antialiased`}
      >
        <Component {...pageProps} />
        {process.env.NODE_ENV === 'development' && <Agentation endpoint="http://localhost:4747" />}
      </div>
    </>
  );
}
