import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Navbar({ session, setSession, onToggleEdit }) {
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRole() {
      if (!session?.user) {
        setUserRole(null);
        return;
      }
      
      try {
        // Usar una consulta directa con RLS apropiado
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (!error && data) {
          setUserRole(data.role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error loading role:', error);
        setUserRole(null);
      }
    }

    loadRole();
  }, [session]);

  async function login() {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password: pass 
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSession(data.session);
        setShowModal(false);
        setEmail('');
        setPass('');
      }
    } catch (error) {
      setError('Error inesperado al iniciar sesión');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      login();
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          <Link href="/" className="navbar-brand">Indicadores Daule</Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/" className="nav-link">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link href="/metas" className="nav-link">Metas</Link>
              </li>
              <li className="nav-item">
                <Link href="/indicadores" className="nav-link">Indicadores</Link>
              </li>
              <li className="nav-item">
                <Link href="/avances" className="nav-link">Avances</Link>
              </li>
              <li className="nav-item">
                <Link href="/reportes" className="nav-link">Reportes</Link>
              </li>
              <li className="nav-item">
                <Link href="/formulario" className="nav-link">Formulario</Link>
              </li>
            </ul>
            
            <div className="d-flex gap-2">
              {!session ? (
                <button 
                  className="btn btn-light" 
                  onClick={() => setShowModal(true)}
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
              ) : (
                <>
                  {userRole && ['admin','tecnico'].includes(userRole) && (
                    <button 
                      className="btn btn-warning" 
                      onClick={onToggleEdit}
                    >
                      Editar
                    </button>
                  )}
                  <span className="navbar-text mx-2">
                    {session.user.email} ({userRole || 'sin rol'})
                  </span>
                  <button 
                    className="btn btn-danger" 
                    onClick={logout}
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Iniciar sesión</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setEmail('');
                    setPass('');
                  }}
                  disabled={loading}
                ></button>
              </div>
              
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger">
                    <small>{error}</small>
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input 
                    className="form-control" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={pass} 
                    onChange={e => setPass(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    placeholder="Tu contraseña"
                  />
                </div>
                
                <div className="text-muted">
                  <small>
                    Usuarios de prueba:<br />
                    admin@demo.com / Admin1234!<br />
                    tecnico@demo.com / Tecnico1234!
                  </small>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
                
                <button 
                  className="btn btn-primary" 
                  onClick={login}
                  disabled={loading || !email || !pass}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Iniciando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
