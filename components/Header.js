import Link from 'next/link';
export default function Header({ user, onToggleEdit }) {
  return (
    <header className="topbar">
      <div className="brand"><i className="fa-solid fa-recycle fa-xl"></i>&nbsp;Gestión RS</div>
      <nav className="nav">
        <Link href="/"><a className="nav-link">Inicio</a></Link>
        <Link href="/indicadores"><a className="nav-link">Indicadores</a></Link>
        <Link href="/metas"><a className="nav-link">Metas</a></Link>
        <Link href="/avances"><a className="nav-link">Avances</a></Link>
        <Link href="/reportes"><a className="nav-link">Reportes</a></Link>
        <Link href="/formularios"><a className="nav-link">Formularios</a></Link>
      </nav>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <button className="btn" onClick={onToggleEdit}><i className="fa-solid fa-pen-to-square"></i>&nbsp;Editar</button>
        {user ? <span style={{fontWeight:700}}>{user.email}</span> : <a className="btn" href="#" onClick={e=>e.preventDefault()}>Iniciar sesión</a>}
      </div>
    </header>
  );
}
