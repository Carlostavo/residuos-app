"use client"
import Card from "../../components/Card"
import CanvaCanvas from "../../components/CanvaCanvas"

export default function ReportesPage() {
  const cards = [
    {
      title: "Reportes Mensuales",
      desc: "Genera informes automáticos.",
      icon: "fa-calendar-alt",
      color: "bg-green-600",
    },
    {
      title: "Reportes Financieros",
      desc: "Informes de ingresos y gastos.",
      icon: "fa-chart-pie",
      color: "bg-blue-500",
    },
  ]

  return (
    <CanvaCanvas>
      <section className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-green-700">Generación y Descarga de Reportes</h1>
          <p className="text-gray-600 mt-2">Crea informes personalizados para tus stakeholders.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((c) => (
            <Card key={c.title} {...c} />
          ))}
        </div>
      </section>
    </CanvaCanvas>
  )
}
