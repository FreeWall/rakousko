import { Agentation } from 'agentation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import Layout from '@/components/Layout';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minut
      },
    },
  }));

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
          .catch((err) => console.error('Service Worker registration failed:', err));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
        <title>Rakousko 2026 | Turistický Průvodce & Tahák</title>
        <meta
          name="description"
          content="Interaktivní tahák a pomocník pro turistickou dovolenou v Kaprunu pro 4 dospělé."
        />
      </Head>
      <div className={`${inter.variable} font-sans antialiased`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {process.env.NODE_ENV === 'development' && <Agentation endpoint="http://localhost:4747" />}
      </div>
    </QueryClientProvider>
  );
}
