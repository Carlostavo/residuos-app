import Header from '../components/Header';
import FloatingToolbar from '../components/FloatingToolbar';
import EditorCanvas from '../components/EditorCanvas';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function Home(){
  const [editable, setEditable] = useState(false);
  const { role } = useAuth();
  function onToggleEdit(){ setEditable(e=>!e); }
  return (
    <div>
      <Header onToggleEdit={onToggleEdit} editable={editable} />
      <div className="container">
        <div style={{marginTop:16}}>
          <div className="hero">
            <h1>Sistema de Gestión de Residuos Sólidos</h1>
            <p>Plataforma para monitorear indicadores y gestionar metas y reportes.</p>
          </div>
          <div className="cardGrid">
            <div className="card"><h3>Indicadores</h3><p>Visualiza KPIs clave.</p></div>
            <div className="card"><h3>Metas</h3><p>Define y sigue metas.</p></div>
            <div className="card"><h3>Avances</h3><p>Seguimiento de proyectos.</p></div>
            <div className="card"><h3>Reportes</h3><p>Genera reportes descargables.</p></div>
          </div>
        </div>
        <div style={{marginTop:18, display:'grid', gridTemplateColumns:'1fr', gap:12}}>
          <div style={{height:640}}>
            <EditorCanvas editable={editable && (role==='admin' || role==='tecnico')} pageId="index" />
          </div>
        </div>
      </div>
      <FloatingToolbar visible={editable && (role==='admin' || role==='tecnico')} onAdd={(type)=> window.dispatchEvent(new CustomEvent('add-element',{detail:type}))} onAction={(action)=> window.dispatchEvent(new CustomEvent('editor-action', {detail:{action}}))} />
    </div>
  );
}
