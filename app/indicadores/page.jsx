'use client'
import Card from '../../components/Card'

export default function IndicadoresPage() {
  const cards = [
    { title: "Métricas de Reciclaje", desc: "Cantidad de material reciclado por mes.", icon: "fa-recycle", color: "bg-green-600" },
    { title: "Indicadores Financieros", desc: "Costos de gestión y ingresos.", icon: "fa-dollar-sign", color: "bg-blue-500" },
    { title: "Impacto Ambiental", desc: "Reducción de huella de carbono.", icon: "fa-leaf", color: "bg-emerald-500" },
    { title: "Eficiencia Operativa", desc: "Tiempos de procesamiento y productividad.", icon: "fa-gauge-high", color: "bg-orange-500" },
  ]
  
  return (
    <div className="canvas-container">
      <div className="content-canvas">
        <div className="hero-section text-center">
          <h1 className="text-4xl font-bold text-green-700">Dashboard de Indicadores</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Monitorea en tiempo real todos los indicadores de gestión de residuos con nuestras herramientas visuales interactivas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Resumen Mensual</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Material reciclado</span>
                <span className="font-bold text-green-600">+15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Costos operativos</span>
                <span className="font-bold text-red-600">-8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Eficiencia general</span>
                <span className="font-bold text-blue-600">+12%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Próximas metas</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span>Alcanzar 40% de reciclaje</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span>Reducir costos en 15%</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span>Implementar 2 nuevos puntos</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Módulos de Indicadores</h2>
        <div className="responsive-grid">
          {cards.map(c => (
            <div key={c.title} className="h-full">
              <Card {...c} className="h-full card-hover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
