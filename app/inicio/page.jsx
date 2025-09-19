// app/inicio/page.jsx - Actualizado
'use client'
import Card from '../../components/Card'
import { useEditableContent } from '../../hooks/useEditableContent'
import { useAuth } from '../../lib/useAuth'

export default function InicioPage() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { content } = useEditableContent('/inicio')
  
  const cards = [
    { title: "Gestión de Metas", desc: "Establece y sigue tus objetivos de sostenibilidad.", icon: "fa-bullseye", color: "bg-green-600", href: "/metas" },
    { title: "Dashboard de Indicadores", desc: "Visualiza en tiempo real el rendimiento.", icon: "fa-chart-line", color: "bg-blue-500", href: "/indicadores" },
    { title: "Seguimiento de Avances", desc: "Revisa el progreso de tus proyectos.", icon: "fa-chart-area", color: "bg-yellow-400", href: "/avances" },
    { title: "Generación de Reportes", desc: "Crea y exporta informes detallados.", icon: "fa-file-lines", color: "bg-red-500", href: "/reportes" },
    { title: "Formularios de Datos", desc: "Ingresa y gestiona datos en campo.", icon: "fa-file-alt", color: "bg-purple-600", href: "/formularios" },
  ]

  return (
    <section className="space-y-6">
      {/* Contenido editable */}
      <div 
        className="hero text-center p-12 bg-gradient-to-br from-green-50 to-white rounded-lg shadow"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {/* El resto del contenido (no editable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Card key={c.title} title={c.title} desc={c.desc} icon={c.icon} color={c.color} href={c.href} />
        ))}
      </div>
    </section>
  )
}
