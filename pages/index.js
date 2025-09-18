import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingToolbar from '../components/FloatingToolbar';
import Link from 'next/link';

export default function Home({ editable, setEditable }) {
  const cards = [
    { title: 'Indicadores', desc: 'Visualiza KPIs clave.', href: '/indicadores', icon: 'fa-chart-line' },
    { title: 'Metas', desc: 'Define y sigue metas.', href: '/metas', icon: 'fa-bullseye' },
    { title: 'Avances', desc: 'Seguimiento de proyectos.', href: '/avances', icon: 'fa-flag' },
    { title: 'Reportes', desc: 'Genera reportes descargables.', href: '/reportes', icon: 'fa-file-alt' },
    { title: 'Formularios', desc: 'Accede a formularios disponibles.', href: '/formularios', icon: 'fa-clipboard-list' }
  ];

  return (
    <div>
      <Header editable={editable} setEditable={setEditable} />
      <main className="container">
        <section className="hero">
          <h1>Sistema de Gestión de Residuos Sólidos</h1>
          <p>Plataforma para monitorear indicadores y gestionar metas y reportes.</p>
        </section>

        <section className="cardGrid" aria-label="Accesos rápidos">
          {cards.map(c => (
            <Link key={c.title} href={c.href}>
              <a className="card" role="button" aria-pressed="false">
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{fontSize:26,color:'var(--primary)'}}><i className={`fa-solid ${c.icon}`}></i></div>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.desc}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </section>

        <Footer />
      </main>

      <FloatingToolbar visible={editable} />
    </div>
  );
}
