"use client"
import Card from "../../components/Card"
import CanvaCanvas from "../../components/CanvaCanvas"

export default function MetasPage() {
  const cards = [
    {
      title: "Metas de Reducción",
      desc: "Objetivos para reducir el volumen de residuos.",
      icon: "fa-minimize",
      color: "bg-green-600",
    },
    {
      title: "Metas de Reciclaje",
      desc: "Aumentar la tasa de reciclaje.",
      icon: "fa-trash-arrow-up",
      color: "bg-blue-500",
    },
  ]

  return (
    <CanvaCanvas>
      <section className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-green-700">Gestión de Metas de Sostenibilidad</h1>
          <p className="text-gray-600 mt-2">Define, monitorea y ajusta tus metas ambientales.</p>
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
