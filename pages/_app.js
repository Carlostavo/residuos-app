// pages/_app.js
import '../public/styles.css'
import Head from 'next/head'
import { AuthProvider } from '../context/AuthContext'
import { useState } from 'react'

export default function App({ Component, pageProps }) {
  const [editable, setEditable] = useState(false)

  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} editable={editable} setEditable={setEditable} />
    </AuthProvider>
  )
}
