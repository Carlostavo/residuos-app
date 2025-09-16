import Link from 'next/link';
export default function Header({ onToggleEdit, editable }) {
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
        <button className="btn" onClick={onToggleEdit}><i className="fa-solid fa-pen-to-square"></i> {editable ? 'Salir edición' : 'Editar'}</button>
        <button className="btn secondary"><i className="fa-solid fa-arrow-up-from-bracket"></i> Publicar</button>
      </div>
    </header>
  );
}
