import '../styles/globals.css'
import { supabase } from '../lib/supabaseClient'
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
