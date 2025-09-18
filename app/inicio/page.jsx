'use client'
import Card from '../../components/Card'
import { useEffect } from 'react'

export default function InicioPage() {
  useEffect(() => {
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
        {/* Elementos editables del canvas */}
        <div 
          id="hero-title" 
          className="canvas-element text-element"
          style={{ position: 'absolute', left: '50px', top: '50px', fontSize: '32px', fontWeight: 'bold', color: '#166534' }}
        >
          Sistema de Gestión de Residuos Sólidos
        </div>

        <div 
          id="hero-description" 
          className="canvas-element text-element"
          style={{ position: 'absolute', left: '50px', top: '120px', fontSize: '18px', color: '#374151', maxWidth: '600px' }}
        >
          La plataforma integral para monitorear indicadores, gestionar metas y generar reportes 
          para una gestión ambiental eficiente y sostenible.
        </div>

        {/* Tarjetas como elementos del canvas */}
        {cards.map((c, index) => (
          <div 
            key={c.title} 
            id={`card-${index}`}
            className="canvas-element"
            style={{ position: 'absolute', left: `${50 + (index * 20)}px`, top: `${200 + (index * 20)}px` }}
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

        {/* Secciones adicionales */}
        <div 
          id="benefits-section"
          className="canvas-element"
          style={{ position: 'absolute', left: '50px', top: '500px', width: '400px' }}
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
