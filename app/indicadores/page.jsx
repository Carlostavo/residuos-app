"use client"
import Card from "../../components/Card"
import CanvaCanvas from "../../components/CanvaCanvas"

export default function IndicadoresPage() {
  const cards = [
    {
      title: "Métricas de Reciclaje",
      desc: "Cantidad de material reciclado por mes.",
      icon: "fa-recycle",
      color: "bg-green-600",
    },
    {
      title: "Indicadores Financieros",
      desc: "Costos de gestión y ingresos.",
      icon: "fa-dollar-sign",
      color: "bg-blue-500",
    },
  ]

  return (
    <CanvaCanvas>
      <section className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-green-700">Dashboard de Indicadores</h1>
          <p className="text-gray-600 mt-2">
            Aquí podrás ver todos los indicadores de gestión de residuos en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((c, index) => (
            <Card key={c.title} title={c.title} desc={c.desc} icon={c.icon} color={c.color} />
          ))}
        </div>
      </section>
    </CanvaCanvas>
  )
}
