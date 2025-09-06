import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar({ session, setSession, onToggleEdit }) {
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRole() {
      if (!session?.user) return setUserRole(null);
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).single();
      setUserRole(data?.role);
    }
    loadRole();
  }, [session]);

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setError(error.message);
    else {
      setSession(data.session);
      setShowModal(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <Link href="/" className="navbar-brand">Indicadores Daule</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link href="/" className="nav-link">Inicio</Link></li>
              <li className="nav-item"><Link href="/metas" className="nav-link">Metas</Link></li>
              <li className="nav-item"><Link href="/indicadores" className="nav-link">Indicadores</Link></li>
              <li className="nav-item"><Link href="/avances" className="nav-link">Avances</Link></li>
              <li className="nav-item"><Link href="/reportes" className="nav-link">Reportes</Link></li>
              <li className="nav-item"><Link href="/formulario" className="nav-link">Formulario</Link></li>
            </ul>
          </div>
          <div className="d-flex gap-2">
            {!session ? (
              <button className="btn btn-light" onClick={() => setShowModal(true)}>Iniciar sesión</button>
            ) : (
              <>
                {['admin','tecnico'].includes(userRole) && (
                  <button className="btn btn-warning" onClick={onToggleEdit}>Editar</button>
                )}
                <button className="btn btn-danger" onClick={logout}>Cerrar sesión</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Iniciar sesión</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label>Email</label>
                  <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label>Contraseña</label>
                  <input type="password" className="form-control" value={pass} onChange={e=>setPass(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" onClick={login}>Entrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
