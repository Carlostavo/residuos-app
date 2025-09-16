
export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Sistema de Gestión de Residuos Sólidos</h1>
        <p>La plataforma para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental eficiente.</p>
      </section>
      <section className="features">
        <div className="card">
          <div className="icon blue"></div>
          <h3>Dashboard de Indicadores</h3>
          <p>Visualiza en tiempo real el rendimiento del sistema de gestión.</p>
        </div>
        <div className="card">
          <div className="icon yellow"></div>
          <h3>Seguimiento de Avances</h3>
          <p>Revisa el progreso de tus proyectos de reciclaje y reducción de residuos.</p>
        </div>
        <div className="card">
          <div className="icon red"></div>
          <h3>Generación de Reportes</h3>
          <p>Crea y exporta informes detallados para auditorías o análisis.</p>
        </div>
        <div className="card">
          <div className="icon purple"></div>
          <h3>Formularios de Datos</h3>
          <p>Ingresa y gestiona datos a través de formularios personalizados.</p>
        </div>
      </section>
    </div>
  );
}
