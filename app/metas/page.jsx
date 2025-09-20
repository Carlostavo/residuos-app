"use client"
import Card from "../../components/Card"
import EditableElement from "../../components/EditableElement"
import DynamicElement from "../../components/DynamicElement"
import { useEdit } from "../../lib/EditContext"

export default function MetasPage() {
  const { elements, isEditMode } = useEdit()

  const cards = [
    {
      title: "Metas de Reducción",
      desc: "Objetivos para reducir el volumen de residuos.",
      icon: "fa-minimize",
      color: "bg-green-600",
    },
    {
      title: "Metas de Reciclaje",
      desc: "Aumentar la tasa de reciclaje.",
      icon: "fa-trash-arrow-up",
      color: "bg-blue-500",
    },
  ]

  return (
    <section
      className={`space-y-6 ${isEditMode ? "edit-mode-container" : ""}`}
      style={{ marginLeft: isEditMode ? "320px" : "0", transition: "margin-left 0.3s ease" }}
    >
      <EditableElement elementId="metas-hero" className="hero text-center p-8 bg-green-50 rounded-lg shadow">
        <EditableElement elementId="metas-title" type="h1" className="text-3xl font-bold text-green-700">
          Gestión de Metas de Sostenibilidad
        </EditableElement>
        <EditableElement elementId="metas-desc" type="p" className="text-gray-600 mt-2">
          Define, monitorea y ajusta tus metas ambientales.
        </EditableElement>
      </EditableElement>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c, index) => (
          <EditableElement key={c.title} elementId={`metas-card-${index}`} className="relative">
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
