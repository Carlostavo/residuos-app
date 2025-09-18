import '../public/styles.css';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  const [editable, setEditable] = useState(false);
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.3/css/all.min.css"/>
      </Head>
      <Component {...pageProps} editable={editable} setEditable={setEditable} />
    </AuthProvider>
  );
}
