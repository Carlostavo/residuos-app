'use client'
import Card from '@/components/Card'

export default function AvancesPage(){
  const cards = [
    { title: "Progreso en Proyectos", desc: "Seguimiento del estado de proyectos.", icon: "fa-tasks", color: "bg-green-600" },
    { title: "Hitos Alcanzados", desc: "Registro de logros importantes.", icon: "fa-star", color: "bg-blue-500" },
  ]
  return (
    <section className="space-y-6">
      <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-green-700">Progreso y Avances del Proyecto</h1>
        <p className="text-gray-600 mt-2">Visualiza el avance de tus iniciativas y proyectos.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(c => <Card key={c.title} {...c} />)}
      </div>
    </section>
  )
}
