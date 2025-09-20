"use client"
import Card from "../../components/Card"
import EditableElement from "../../components/EditableElement"
import DynamicElement from "../../components/DynamicElement"
import { useEdit } from "../../lib/EditContext"

export default function AvancesPage() {
  const { elements, isEditMode } = useEdit()

  const cards = [
    {
      title: "Progreso en Proyectos",
      desc: "Seguimiento del estado de proyectos.",
      icon: "fa-tasks",
      color: "bg-green-600",
    },
    { title: "Hitos Alcanzados", desc: "Registro de logros importantes.", icon: "fa-star", color: "bg-blue-500" },
  ]

  return (
    <section
      className={`space-y-6 ${isEditMode ? "edit-mode-container" : ""}`}
      style={{ marginLeft: isEditMode ? "320px" : "0", transition: "margin-left 0.3s ease" }}
    >
      <EditableElement elementId="avances-hero" className="hero text-center p-8 bg-green-50 rounded-lg shadow">
        <EditableElement elementId="avances-title" type="h1" className="text-3xl font-bold text-green-700">
          Progreso y Avances del Proyecto
        </EditableElement>
        <EditableElement elementId="avances-desc" type="p" className="text-gray-600 mt-2">
          Visualiza el avance de tus iniciativas y proyectos.
        </EditableElement>
      </EditableElement>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c, index) => (
          <EditableElement key={c.title} elementId={`avances-card-${index}`} className="relative">
            <Card title={c.title} desc={c.desc} icon={c.icon} color={c.color} isEditMode={isEditMode} />
          </EditableElement>
        ))}
      </div>

      {Object.keys(elements).map((elementId) => (
        <DynamicElement key={elementId} elementId={elementId} />
      ))}
    </section>
  )
}
