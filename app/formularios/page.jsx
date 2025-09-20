"use client"
import Card from "../../components/Card"
import CanvaCanvas from "../../components/CanvaCanvas"

export default function FormulariosPage() {
  const cards = [
    {
      title: "Formularios de Inspección",
      desc: "Crea formularios para inspecciones.",
      icon: "fa-clipboard-check",
      color: "bg-purple-600",
    },
    {
      title: "Registro de Recolección",
      desc: "Registro rápido de residuos recolectados.",
      icon: "fa-truck-loading",
      color: "bg-green-600",
    },
  ]

  return (
    <CanvaCanvas>
      <section className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-green-700">Gestión y Creación de Formularios</h1>
          <p className="text-gray-600 mt-2">Diseña, despliega y administra formularios para la recolección de datos.</p>
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
