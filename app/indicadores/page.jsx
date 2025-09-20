"use client"
import Card from "../../components/Card"
import EditableElement from "../../components/EditableElement"
import DynamicElement from "../../components/DynamicElement"
import { useEdit } from "../../lib/EditContext"

export default function IndicadoresPage() {
  const { elements, isEditMode } = useEdit()

  const cards = [
    {
      title: "Métricas de Reciclaje",
      desc: "Cantidad de material reciclado por mes.",
      icon: "fa-recycle",
      color: "bg-green-600",
    },
    {
      title: "Indicadores Financieros",
      desc: "Costos de gestión y ingresos.",
      icon: "fa-dollar-sign",
      color: "bg-blue-500",
    },
  ]

  return (
    <section
      className={`space-y-6 ${isEditMode ? "edit-mode-container" : ""}`}
      style={{ marginLeft: isEditMode ? "320px" : "0", transition: "margin-left 0.3s ease" }}
    >
      <EditableElement elementId="indicadores-hero" className="hero text-center p-8 bg-green-50 rounded-lg shadow">
        <EditableElement elementId="indicadores-title" type="h1" className="text-3xl font-bold text-green-700">
          Dashboard de Indicadores
        </EditableElement>
        <EditableElement elementId="indicadores-desc" type="p" className="text-gray-600 mt-2">
          Aquí podrás ver todos los indicadores de gestión de residuos en tiempo real.
        </EditableElement>
      </EditableElement>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c, index) => (
          <EditableElement key={c.title} elementId={`indicadores-card-${index}`} className="relative">
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
