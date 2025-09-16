// pages/index.js
import Header from '../components/Header';
import FloatingToolbar from '../components/FloatingToolbar';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home(){
  const [editable, setEditable] = useState(false);
  const { role } = useAuth();

  function onToggleEdit(){ setEditable(e=>!e); }

  const cards = [
    { title: 'Indicadores', desc: 'Visualiza KPIs clave.', href: '/indicadores', icon: 'fa-chart-line' },
    { title: 'Metas', desc: 'Define y sigue metas.', href: '/metas', icon: 'fa-bullseye' },
    { title: 'Avances', desc: 'Seguimiento de proyectos.', href: '/avances', icon: 'fa-flag' },
    { title: 'Reportes', desc: 'Genera reportes descargables.', href: '/reportes', icon: 'fa-file-alt' },
    { title: 'Formularios', desc: 'Accede a formularios disponibles.', href: '/formularios', icon: 'fa-clipboard-list' }
  ];

  return (
    <div>
      <Header onToggleEdit={onToggleEdit} editable={editable} />
      <div className="container">
        <div style={{marginTop:16}}>
          <div className="hero">
            <h1>Sistema de Gestión de Residuos Sólidos</h1>
            <p>Plataforma para monitorear indicadores y gestionar metas y reportes.</p>
          </div>

          <div className="cardGrid" style={{marginTop:20}}>
            {cards.map(c=>(
              <Link key={c.title} href={c.href}>
                <a className="card" style={{display:'block', transition:'all .15s', textDecoration:'none', color:'inherit'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{fontSize:26, color:'#0ea5e9'}}><i className={`fa-solid ${c.icon}`}></i></div>
                    <div>
                      <h3 style={{margin:0}}>{c.title}</h3>
                      <p style={{margin:0, color:'var(--muted)'}}>{c.desc}</p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>

        </div>
      </div>

      <FloatingToolbar visible={editable && (role==='admin' || role==='tecnico')}
        onAdd={(type)=> window.dispatchEvent(new CustomEvent('add-element',{detail:type}))}
        onAction={(action)=> window.dispatchEvent(new CustomEvent('editor-action', {detail:{action}}))}
      />
    </div>
  );
}
