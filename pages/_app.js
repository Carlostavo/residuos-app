import '../public/styles.css';
import Head from 'next/head';
export default function App({ Component, pageProps }) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.3/css/all.min.css"/>
    </Head>
    <Component {...pageProps} />
  </>;
}
