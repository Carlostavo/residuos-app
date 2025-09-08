import Card from '../components/Card'
export default function Home() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Indicadores</h1>
        <p className="text-gray-600">Bienvenido — monitoree metas, indicadores y avances.</p>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Metas" description="Gestionar metas del proyecto." link="/metas" />
        <Card title="Indicadores" description="Visualizar y editar indicadores." />
        <Card title="Avances" description="Registrar progreso por indicador." />
        <Card title="Reportes" description="Generar reportes automáticos." />
      </section>
    </>
  )
}
