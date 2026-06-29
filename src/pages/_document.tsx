import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="cs">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/icon-192.webp" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kaprun 2026" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

