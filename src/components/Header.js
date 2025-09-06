// src/components/Header.js
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { session } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">Indicadores Daule</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link href="/" className="nav-link">Dashboard</Link></li>
            {session ? (
              <>
                <li className="nav-item"><Link href="/dashboard" className="nav-link">Mi Panel</Link></li>
                <li className="nav-item"><a onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>Cerrar sesión</a></li>
              </>
            ) : (
              <li className="nav-item"><Link href="/login" className="nav-link">Iniciar Sesión</Link></li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}