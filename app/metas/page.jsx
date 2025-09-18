'use client'
import Card from '../../components/Card'

export default function MetasPage() {
  const cards = [
    { title: "Metas de Reducción", desc: "Objetivos para reducir el volumen de residuos.", icon: "fa-minimize", color: "bg-green-600" },
    { title: "Metas de Reciclaje", desc: "Aumentar la tasa de reciclaje.", icon: "fa-trash-arrow-up", color: "bg-blue-500" },
    { title: "Metas de Concienciación", desc: "Programas educativos y de sensibilización.", icon: "fa-chalkboard-user", color: "bg-purple-500" },
    { title: "Metas de Eficiencia", desc: "Optimización de procesos y recursos.", icon: "fa-gears", color: "bg-orange-500" },
  ]
  
  return (
    <div className="canvas-container">
      <div className="content-canvas">
        <div className="hero-section text-center">
          <h1 className="text-4xl font-bold text-green-700">Gestión de Metas de Sostenibilidad</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Define, monitorea y ajusta tus metas ambientales con nuestras herramientas de planificación y seguimiento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">15</div>
            <div className="text-gray-600">Metas activas</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
            <div className="text-gray-600">Metas completadas</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">72%</div>
            <div className="text-gray-600">Tasa de éxito</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Categorías de Metas</h2>
        <div className="responsive-grid">
          {cards.map(c => (
            <div key={c.title} className="h-full">
              <Card {...c} className="h-full card-hover" />
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Progreso General</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Reducción de residuos</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{width: '65%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Tasa de reciclaje</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Concienciación</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{width: '80%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
