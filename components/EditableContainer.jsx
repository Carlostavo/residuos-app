"use client"
import { useEdit } from "../lib/EditContext"
import DynamicElement from "./DynamicElement"

export default function EditableContainer({ children, className = "" }) {
  const { elements, isEditMode } = useEdit()

  return (
    <div className={`${className} ${isEditMode ? "edit-mode-container" : ""}`}>
      {children}

      {/* Render all dynamic elements */}
      {Object.keys(elements).map((elementId) => (
        <DynamicElement key={elementId} elementId={elementId} />
      ))}

      {/* Edit mode overlay */}
      {isEditMode && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm">
            <i className="fa-solid fa-edit mr-2"></i>
            Modo Edición Activo
          </div>
        </div>
      )}
    </div>
  )
}
