'use client'
import Card from '../../components/Card'

export default function ReportesPage(){
  const cards = [
    { title: "Reportes Mensuales", desc: "Genera informes automáticos.", icon: "fa-calendar-alt", color: "bg-green-600" },
    { title: "Reportes Financieros", desc: "Informes de ingresos y gastos.", icon: "fa-chart-pie", color: "bg-blue-500" },
    { title: "Reportes de Impacto", desc: "Análisis de resultados ambientales.", icon: "fa-chart-column", color: "bg-teal-500" },
    { title: "Reportes Personalizados", desc: "Crea reportes a medida.", icon: "fa-pen-to-square", color: "bg-purple-500" },
  ]
  
  return (
    <div className="canvas-container">
      <div className="content-canvas">
        <div className="hero-section text-center">
          <h1 className="text-4xl font-bold text-green-700">Generación y Descarga de Reportes</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Crea informes personalizados para tus stakeholders con datos actualizados y visualizaciones profesionales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Reportes Recientes</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Reporte Mensual Octubre</div>
                  <div className="text-sm text-gray-500">Generado: 01/11/2023</div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Análisis Financiero Q3</div>
                  <div className="text-sm text-gray-500">Generado: 15/10/2023</div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <i className="fa-solid fa-download"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Próximos Reportes</h2>
            <div className="space-y-4">
              <div>
                <div className="font-medium">Reporte Mensual Noviembre</div>
                <div className="text-sm text-gray-500">Programado: 01/12/2023</div>
              </div>
              <div>
                <div className="font-medium">Evaluación Anual 2023</div>
                <div className="text-sm text-gray-500">Programado: 15/01/2024</div>
              </div>
              <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
                <i className="fa-solid fa-plus mr-2"></i>
                Programar Nuevo Reporte
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tipos de Reportes Disponibles</h2>
        <div className="responsive-grid">
          {cards.map(c => (
            <div key={c.title} className="h-full">
              <Card {...c} className="h-full card-hover" />
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Personaliza tu Reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition">
              <i className="fa-solid fa-table text-3xl text-gray-400 mb-2"></i>
              <div>Formato Tabla</div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition">
              <i className="fa-solid fa-chart-simple text-3xl text-gray-400 mb-2"></i>
              <div>Formato Gráfico</div>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition">
              <i className="fa-solid fa-file-lines text-3xl text-gray-400 mb-2"></i>
              <div>Formato Documento</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
