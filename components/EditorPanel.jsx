"use client"
import { useEdit } from "../lib/EditContext"

export default function EditorPanel() {
  const { isEditing } = useEdit()

  if (!isEditing) return null

  return (
    <aside className="w-64 bg-gray-100 h-[calc(100vh-64px)] p-4 shadow-lg fixed left-0 top-16 z-40 overflow-y-auto">
      <h2 className="font-bold text-lg mb-4">Herramientas</h2>

      <button className="w-full mb-2 p-2 bg-blue-600 text-white rounded">
        Agregar Texto
      </button>
      <button className="w-full mb-2 p-2 bg-green-600 text-white rounded">
        Negrita
      </button>
      <button className="w-full mb-2 p-2 bg-purple-600 text-white rounded">
        Color
      </button>
      <button className="w-full mb-2 p-2 bg-orange-600 text-white rounded">
        Tamaño
      </button>
      <button className="w-full mt-4 p-2 bg-red-600 text-white rounded">
        Guardar Cambios
      </button>
    </aside>
  )
}
