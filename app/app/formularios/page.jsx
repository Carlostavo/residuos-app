'use client'
import Card from '../../components/Card'

export default function FormulariosPage(){
  const cards = [
    { title: "Formularios de Inspección", desc: "Crea formularios para inspecciones.", icon: "fa-clipboard-check", color: "bg-purple-600" },
    { title: "Registro de Recolección", desc: "Registro rápido de residuos recolectados.", icon: "fa-truck-loading", color: "bg-green-600" },
    { title: "Encuestas de Satisfacción", desc: "Evalúa la satisfacción de usuarios.", icon: "fa-star-half-stroke", color: "bg-yellow-500" },
    { title: "Formularios de Incidentes", desc: "Reporta y sigue incidentes.", icon: "fa-triangle-exclamation", color: "bg-red-500" },
  ]
  
  return (
    <div className="canvas-container">
      <div className="content-canvas">
        <div className="hero-section text-center">
          <h1 className="text-4xl font-bold text-green-700">Gestión y Creación de Formularios</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Diseña, despliega y administra formularios para la recolección de datos en campo con nuestra herramienta intuitiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Formularios Activos</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Inspección Semanal</div>
                  <div className="text-sm text-gray-500">15 respuestas esta semana</div>
                </div>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Activo
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Registro Diario</div>
                  <div className="text-sm text-gray-500">28 respuestas hoy</div>
                </div>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Activo
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Crear Nuevo Formulario</h2>
            <p className="text-gray-600 mb-4">Selecciona el tipo de formulario que deseas crear:</p>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition mb-3">
              <i className="fa-solid fa-plus mr-2"></i>
              Formulario desde cero
            </button>
            <button className="w-full border border-green-600 text-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition">
              <i className="fa-solid fa-copy mr-2"></i>
              Usar plantilla
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tipos de Formularios</h2>
        <div className="responsive-grid">
          {cards.map(c => (
            <div key={c.title} className="h-full">
              <Card {...c} className="h-full card-hover" />
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Estadísticas de Formularios</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">42</div>
              <div className="text-sm text-gray-600">Formularios activos</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">1,248</div>
              <div className="text-sm text-gray-600">Respuestas este mes</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">92%</div>
              <div className="text-sm text-gray-600">Tasa de completitud</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">15</div>
              <div className="text-sm text-gray-600">Plantillas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
