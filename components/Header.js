import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
export default function Header({ onToggleEdit, editable }) {
  const { user, role, signOut } = useAuth();
  return (
    <header className="topbar">
      <div className="brand"><i className="fa-solid fa-recycle"></i>&nbsp;PAE</div>
      <nav className="nav">
        <Link href="/"><a>Inicio</a></Link>
        <Link href="/indicadores"><a>Indicadores</a></Link>
        <Link href="/metas"><a>Metas</a></Link>
        <Link href="/avances"><a>Avances</a></Link>
        <Link href="/reportes"><a>Reportes</a></Link>
        <Link href="/formularios"><a>Formularios</a></Link>
      </nav>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        {user ? (
          <>
            {(role==='admin' || role==='tecnico') && <button className="btn" onClick={onToggleEdit}>{editable ? 'Salir edición' : 'Editar'}</button>}
            <span style={{fontWeight:700}}>{user.email}</span>
            <button className="btn secondary" onClick={signOut}>Cerrar</button>
          </>
        ) : (
          <Link href="/login"><a className="btn">Iniciar sesión</a></Link>
        )}
      </div>
    </header>
  );
}
