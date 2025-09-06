import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Opcional: manejar cambios de sesión globales
    });
    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  return <Component {...pageProps} />;
}
