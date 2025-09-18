'use client'
import Card from '../../components/Card'
import { useEffect } from 'react'

export default function InicioPage() {
  useEffect(() => {
    // Cargar contenido guardado al iniciar la página
    loadSavedContent()
  }, [])

  const loadSavedContent = () => {
    const page = '/inicio'
    const savedContent = localStorage.getItem(`editor-content-${page}`)
    const savedPositions = localStorage.getItem(`editor-positions-${page}`)
    
    if (savedContent) {
      const contentData = JSON.parse(savedContent)
      Object.keys(contentData).forEach(id => {
        const element = document.getElementById(id)
        if (element) {
          element.innerHTML = contentData[id]
        }
      })
    }
    
    if (savedPositions) {
      const positionData = JSON.parse(savedPositions)
      Object.keys(positionData).forEach(id => {
        const element = document.getElementById(id)
        if (element && positionData[id]) {
          element.style.position = 'relative'
          element.style.left = positionData[id].left
          element.style.top = positionData[id].top
        }
      })
    }
  }

  const cards = [
    { title: "Gestión de Metas", desc: "Establece y sigue tus objetivos de sostenibilidad.", icon: "fa-bullseye", color: "bg-green-600", href: "/metas" },
    { title: "Dashboard de Indicadores", desc: "Visualiza en tiempo real el rendimiento.", icon: "fa-chart-line", color: "bg-blue-500", href: "/indicadores" },
    { title: "Seguimiento de Avances", desc: "Revisa el progreso de tus proyectos.", icon: "fa-chart-area", color: "bg-yellow-400", href: "/avances" },
    { title: "Generación de Reportes", desc: "Crea y exporta informes detallados.", icon: "fa-file-lines", color: "bg-red-500", href: "/reportes" },
    { title: "Formularios de Datos", desc: "Ingresa y gestiona datos en campo.", icon: "fa-file-alt", color: "bg-purple-600", href: "/formularios" },
  ]

  return (
    <div className="canvas-container">
      <div className="content-canvas">
        <div className="hero-section text-center">
          <h1 
            id="inicio-title" 
            className="text-4xl md:text-5xl font-bold text-green-800 mb-4 editable-content"
          >
            Sistema de Gestión de Residuos Sólidos
          </h1>
          <p 
            id="inicio-desc" 
            className="text-lg text-gray-700 max-w-3xl mx-auto editable-content"
          >
            La plataforma integral para monitorear indicadores, gestionar metas y generar reportes 
            para una gestión ambiental eficiente y sostenible.
          </p>
        </div>

        <div className="responsive-grid">
          {cards.map((c, index) => (
            <div key={c.title} className="h-full editable-content" id={`card-${index}`}>
              <Card 
                title={c.title} 
                desc={c.desc} 
                icon={c.icon} 
                color={c.color} 
                href={c.href} 
                className="h-full card-hover"
              />
            </div>
          ))}
        </div>

        {/* Sección adicional */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6 editable-content" id="benefits-section">
            <h2 className="text-2xl font-bold text-green-700 mb-4">¿Por qué elegirnos?</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <i className="fa-solid fa-check-circle text-green-500 mr-3"></i>
                <span>Monitoreo en tiempo real de indicadores</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check-circle text-green-500 mr-3"></i>
                <span>Reportes automatizados y personalizables</span>
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check-circle text-green-500 mr-3"></i>
                <span>Seguimiento detallado de metas y avances</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6 editable-content" id="updates-section">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Últimas actualizaciones</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">Nuevo dashboard de métricas</h3>
                <p className="text-sm text-gray-600">Ahora con más gráficos interactivos</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">Exportación de reportes mejorada</h3>
                <p className="text-sm text-gray-600">Formatos PDF, Excel y CSV disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
