'use client'
import Card from '../../components/Card'
import { useEffect } from 'react'

export default function InicioPage() {
  useEffect(() => {
    // Cargar contenido guardado
    const savedContent = localStorage.getItem('page-content-/inicio')
    if (savedContent) {
      try {
        const elements = JSON.parse(savedContent)
        elements.forEach(item => {
          if (item.id) {
            const el = document.getElementById(item.id)
            if (el) {
              el.innerHTML = item.html
            }
          }
        })
      } catch (error) {
        console.error('Error loading saved content:', error)
      }
    }
  }, [])

  const cards = [
    { title: "Gestión de Metas", desc: "Establece y sigue tus objetivos de sostenibilidad.", icon: "fa-bullseye", color: "bg-green-600", href: "/metas" },
    { title: "Dashboard de Indicadores", desc: "Visualiza en tiempo real el rendimiento.", icon: "fa-chart-line", color: "bg-blue-500", href: "/indicadores" },
    { title: "Seguimiento de Avances", desc: "Revisa el progreso de tus proyectos.", icon: "fa-chart-area", color: "bg-yellow-400", href: "/avances" },
    { title: "Generación de Reportes", desc: "Crea y exporta informes detallados.", icon: "fa-file-lines", color: "bg-red-500", href: "/reportes" },
    { title: "Formularios de Datos", desc: "Ingresa y gestiona datos en campo.", icon: "fa-file-alt", color: "bg-purple-600", href: "/formularios" },
  ]

  return (
    <section className="space-y-6">
      <div className="hero text-center p-12 bg-gradient-to-br from-green-50 to-white rounded-lg shadow">
        <h1 className="text-4xl font-bold text-green-700 editable" id="inicio-title">
          Sistema de Gestión de Residuos Sólidos
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto editable" id="inicio-desc">
          La plataforma para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental eficiente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((c, index) => (
          <div key={c.title} className="editable" id={`card-container-${index}`}>
            <Card 
              title={c.title} 
              desc={c.desc} 
              icon={c.icon} 
              color={c.color} 
              href={c.href} 
            />
          </div>
        ))}
      </div>
    </section>
  )
}
