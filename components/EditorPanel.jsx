"use client"
import { useEdit } from "../lib/EditContext"

export default function EditorPanel() {
  const { isEditing } = useEdit()

  if (!isEditing) return null

  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 shadow-lg fixed left-0 top-0 z-50">
      <h2 className="font-bold text-lg mb-4">Panel de edición</h2>
      <button className="w-full mb-2 p-2 bg-blue-600 text-white rounded">
        Texto en negrita
      </button>
      <button className="w-full mb-2 p-2 bg-green-600 text-white rounded">
        Insertar Imagen
      </button>
      <button className="w-full mb-2 p-2 bg-purple-600 text-white rounded">
        Insertar Video
      </button>
    </aside>
  )
}
