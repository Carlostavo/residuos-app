// components/Topbar.js
export default function Topbar({ user, role, editMode, onLogin, onLogout, onToggleEdit }) {
  return (
    <header className="topbar">
      <div className="brand">
        <i className="fa-solid fa-recycle fa-xl"></i> Gestión RS
      </div>
      
      <nav className="nav">
        <a href="/" className="nav-link active">Inicio</a>
        <a href="/indicadores" className="nav-link">Indicadores</a>
        <a href="/metas" className={`nav-link ${role !== 'admin' && role !== 'tecnico' ? 'disabled' : ''}`}>Metas</a>
        <a href="/avances" className={`nav-link ${role !== 'admin' && role !== 'tecnico' ? 'disabled' : ''}`}>Avances</a>
        <a href="/reportes" className={`nav-link ${role !== 'admin' && role !== 'tecnico' ? 'disabled' : ''}`}>Reportes</a>
        <a href="/formularios" className="nav-link">Formularios</a>
        
        {(role === 'admin' || role === 'tecnico') && (
          <button 
            id="toggle-edit" 
            className={editMode ? 'active' : ''}
            onClick={onToggleEdit}
          >
            <i className="fa-solid fa-pen-to-square"></i> Modo edición
          </button>
        )}
        
        {!user ? (
          <button id="open-auth" onClick={onLogin}>
            <i className="fa-solid fa-right-to-bracket"></i> Iniciar sesión
          </button>
        ) : (
          <>
            <span id="whoami" style={{fontWeight: '700'}}>
              Hola, {user.email}
            </span>
            <button id="logout-btn" onClick={onLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
            </button>
          </>
        )}
      </nav>
    </header>
  )
}
