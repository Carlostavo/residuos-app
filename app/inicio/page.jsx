'use client'
import Card from '../../components/Card'

export default function InicioPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Sistema de Gestión de Residuos Sólidos
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            La plataforma integral para monitorear indicadores, gestionar metas y generar reportes 
            para una gestión ambiental eficiente y sostenible.
          </p>
        </div>

        <div className="responsive-grid">
          {cards.map((c) => (
            <div key={c.title} className="h-full">
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


          
          
        
      </div>
    </div>
  )
}
