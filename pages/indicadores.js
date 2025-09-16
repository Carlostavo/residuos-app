import Header from '../components/Header';
export default function Indicadores(){
  return (
    <main>
      <Header />
      <div className="container">
        <div className="hero"><h1>Dashboard de Indicadores</h1><p>Visor de métricas y KPIs.</p></div>
        <div className="cards" style={{marginTop:20}}>
          <div className="card"><div><strong>Métricas de Reciclaje</strong><p>Gráficos y tablas aquí.</p></div></div>
          <div className="card"><div><strong>Indicadores Financieros</strong><p>Costos e ingresos.</p></div></div>
        </div>
      </div>
    </main>
  );
}
