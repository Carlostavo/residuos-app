'use client'
import Card from '../../components/Card'

export default function AvancesPage(){
  const cards = [
    { title: "Progreso en Proyectos", desc: "Seguimiento del estado de proyectos.", icon: "fa-tasks", color: "bg-green-600" },
    { title: "Hitos Alcanzados", desc: "Registro de logros importantes.", icon: "fa-star", color: "bg-blue-500" },
    { title: "Lecciones Aprendidas", desc: "Documentación de experiencias y mejoras.", icon: "fa-book", color: "bg-yellow-500" },
    { title: "Próximos Desafíos", desc: "Identificación de obstáculos y soluciones.", icon: "fa-mountain", color: "bg-red-500" },
  ]
  
  return (
    <div className="canvas-container">
      <div className="content-canvas">
        <div className="hero-section text-center">
          <h1 className="text-4xl font-bold text-green-700">Progreso y Avances del Proyecto</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Visualiza el avance de tus iniciativas y proyectos con nuestras herramientas de seguimiento y reporte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Resumen de Proyectos</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Proyectos activos</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Completados este mes</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between">
                <span>Próximos a completar</span>
                <span className="font-bold">5</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Últimos Logros</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="fa-solid fa-trophy text-yellow-500 mr-3"></i>
                <span>Meta de reciclaje superada</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-trophy text-yellow-500 mr-3"></i>
                <span>Nuevo punto de recolección</span>
              </div>
              <div className="flex items-center">
                <i className="fa-solid fa-trophy text-yellow-500 mr-3"></i>
                <span>Reducción de costos del 12%</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Seguimiento de Avances</h2>
        <div className="responsive-grid">
          {cards.map(c => (
            <div key={c.title} className="h-full">
              <Card {...c} className="h-full card-hover" />
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-6">Línea de Tiempo de Proyectos</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 text-green-800 rounded-full p-2 mr-4">
                <i className="fa-solid fa-check"></i>
              </div>
              <div>
                <h3 className="font-semibold">Sistema de clasificación implementado</h3>
                <p className="text-sm text-gray-600">Completado - 15 Oct 2023</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full p-2 mr-4">
                <i className="fa-solid fa-spinner"></i>
              </div>
              <div>
                <h3 className="font-semibold">Campaña de concienciación comunitaria</h3>
                <p className="text-sm text-gray-600">En progreso - 70% completado</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-gray-100 text-gray-800 rounded-full p-2 mr-4">
                <i className="fa-solid fa-clock"></i>
              </div>
              <div>
                <h3 className="font-semibold">Expansión a nueva zona</h3>
                <p className="text-sm text-gray-600">Planificado - Inicio Ene 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
