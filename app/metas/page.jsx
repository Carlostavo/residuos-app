'use client'
import Card from '../../components/Card'

export default function MetasPage() {
  const cards = [
    { title: "Metas de Reducción", desc: "Objetivos para reducir el volumen de residuos.", icon: "fa-minimize", color: "bg-green-600" },
    { title: "Metas de Reciclaje", desc: "Aumentar la tasa de reciclaje.", icon: "fa-trash-arrow-up", color: "bg-blue-500" },
  ]
  return (
    <section className="space-y-6">
      <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-green-700">Gestión de Metas de Sostenibilidad</h1>
        <p className="text-gray-600 mt-2">Define, monitorea y ajusta tus metas ambientales.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(c => <Card key={c.title} {...c} />)}
      </div>
    </section>
  )
}
