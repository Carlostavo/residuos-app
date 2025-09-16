
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(r => setUser(r.data.session?.user ?? null));
    const s = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => s.data?.subscription?.unsubscribe();
  }, []);
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
  return (
    <>
      <header className="topbar">
        <div className="brand">♻️ Gestión RS</div>
        <nav className="nav">
          <Link href="/"><span>Inicio</span></Link>
          <Link href="/indicadores"><span>Indicadores</span></Link>
          <Link href="/metas"><span>Metas</span></Link>
          <Link href="/avances"><span>Avances</span></Link>
          <Link href="/reportes"><span>Reportes</span></Link>
          <Link href="/formularios"><span>Formularios</span></Link>
        </nav>
        <div className="auth">
          {!user ? (
            <Link href="/login"><button className="btn-primary">Iniciar sesión</button></Link>
          ) : (
            <>
              <span className="user">{user.email}</span>
              <button className="btn" onClick={logout}>Cerrar sesión</button>
            </>
          )}
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  );
}
