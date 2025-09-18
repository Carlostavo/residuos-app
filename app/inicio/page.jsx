'use client'
import Card from '../../components/Card'
import { useEffect } from 'react'

export default function InicioPage() {
  useEffect(() => {
    // Cargar contenido del canvas si existe
    loadCanvasContent()
  }, [])

  const loadCanvasContent = () => {
    const page = '/inicio'
    const savedData = localStorage.getItem(`canvas-data-${page}`)
    
    if (savedData) {
      const elementsData = JSON.parse(savedData)
      Object.keys(elementsData).forEach(id => {
        const element = document.getElementById(id)
        if (element) {
          if (elementsData[id].content) {
            element.innerHTML = elementsData[id].content
          }
          if (elementsData[id].position) {
            element.style.position = 'absolute'
            element.style.left = elementsData[id].position.left
            element.style.top = elementsData[id].position.top
          }
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
        {/* Elementos del canvas */}
        <div 
          id="hero-title" 
          className="canvas-element text-element"
          style={{ position: 'relative', left: '0', top: '0' }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Sistema de Gestión de Residuos Sólidos
          </h1>
        </div>

        <div 
          id="hero-description" 
          className="canvas-element text-element"
          style={{ position: 'relative', left: '0', top: '0' }}
        >
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            La plataforma integral para monitorear indicadores, gestionar metas y generar reportes 
            para una gestión ambiental eficiente y sostenible.
          </p>
        </div>

        {/* Tarjetas como elementos del canvas */}
        <div className="responsive-grid mt-8">
          {cards.map((c, index) => (
            <div 
              key={c.title} 
              id={`card-${index}`}
              className="canvas-element"
              style={{ position: 'relative', left: '0', top: '0' }}
            >
              <Card 
                title={c.title} 
                desc={c.desc} 
                icon={c.icon} 
                color={c.color} 
                href={c.href} 
                className="h-full"
              />
            </div>
          ))}
        </div>

        {/* Secciones adicionales como elementos del canvas */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div 
            id="benefits-section"
            className="canvas-element"
            style={{ position: 'relative', left: '0', top: '0' }}
          >
            <div className="bg-white rounded-2xl shadow-md p-6">
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
          </div>
          
          <div 
            id="updates-section"
            className="canvas-element"
            style={{ position: 'relative', left: '0', top: '0' }}
          >
            <div className="bg-white rounded-2xl shadow-md p-6">
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
    </div>
  )
}
