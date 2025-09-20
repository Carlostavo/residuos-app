"use client"
import Card from "../../components/Card"
import EditableElement from "../../components/EditableElement"
import DynamicElement from "../../components/DynamicElement"
import { useEdit } from "../../lib/EditContext"

export default function InicioPage() {
  const { elements, isEditMode } = useEdit()

  const cards = [
    {
      title: "Gestión de Metas",
      desc: "Establece y sigue tus objetivos de sostenibilidad.",
      icon: "fa-bullseye",
      color: "bg-green-600",
      href: "/metas",
    },
    {
      title: "Dashboard de Indicadores",
      desc: "Visualiza en tiempo real el rendimiento.",
      icon: "fa-chart-line",
      color: "bg-blue-500",
      href: "/indicadores",
    },
    {
      title: "Seguimiento de Avances",
      desc: "Revisa el progreso de tus proyectos.",
      icon: "fa-chart-area",
      color: "bg-yellow-400",
      href: "/avances",
    },
    {
      title: "Generación de Reportes",
      desc: "Crea y exporta informes detallados.",
      icon: "fa-file-lines",
      color: "bg-red-500",
      href: "/reportes",
    },
    {
      title: "Formularios de Datos",
      desc: "Ingresa y gestiona datos en campo.",
      icon: "fa-file-alt",
      color: "bg-purple-600",
      href: "/formularios",
    },
  ]

  return (
    <section
      className={`space-y-6 ${isEditMode ? "edit-mode-container" : ""}`}
      style={{ marginLeft: isEditMode ? "320px" : "0", transition: "margin-left 0.3s ease" }}
    >
      <EditableElement
        elementId="hero-section"
        className="hero text-center p-12 bg-gradient-to-br from-green-50 to-white rounded-lg shadow"
      >
        <EditableElement elementId="hero-title" type="h1" className="text-4xl font-bold text-green-700">
          Sistema de Gestión de Residuos Sólidos
        </EditableElement>
        <EditableElement elementId="hero-description" type="p" className="text-gray-600 mt-4 max-w-2xl mx-auto">
          La plataforma para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental
          eficiente.
        </EditableElement>
      </EditableElement>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((c, index) => (
          <EditableElement key={c.title} elementId={`card-${index}`} className="relative">
            <Card
              title={c.title}
              desc={c.desc}
              icon={c.icon}
              color={c.color}
              href={isEditMode ? null : c.href}
              isEditMode={isEditMode}
            />
          </EditableElement>
        ))}
      </div>

      {Object.keys(elements).map((elementId) => (
        <DynamicElement key={elementId} elementId={elementId} />
      ))}
    </section>
  )
}
