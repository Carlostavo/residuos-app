"use client"
import { useCanvaEdit } from "@/lib/CanvaEditContext"

export default function CanvaAddMenu() {
  const { showAddMenu, addMenuPosition, addElement, setShowAddMenu } = useCanvaEdit()

  if (!showAddMenu) return null

  const handleAddElement = (type) => {
    addElement(type, addMenuPosition)
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />

      <div
        className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50 p-2"
        style={{
          left: `${addMenuPosition.x}px`,
          top: `${addMenuPosition.y}px`,
        }}
      >
        <div className="grid grid-cols-2 gap-2 min-w-48">
          <button
            onClick={() => handleAddElement("text")}
            className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50 text-left"
          >
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">T</span>
            </div>
            <span className="text-sm font-medium">Texto</span>
          </button>

          <button
            onClick={() => handleAddElement("image")}
            className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50 text-left"
          >
            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
              <span className="text-green-600 text-sm">🖼️</span>
            </div>
            <span className="text-sm font-medium">Imagen</span>
          </button>

          <button
            onClick={() => handleAddElement("video")}
            className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50 text-left"
          >
            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
              <span className="text-purple-600 text-sm">▶️</span>
            </div>
            <span className="text-sm font-medium">Video</span>
          </button>

          <button
            onClick={() => handleAddElement("card")}
            className="flex items-center space-x-2 p-3 rounded hover:bg-gray-50 text-left"
          >
            <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
              <span className="text-orange-600 text-sm">📄</span>
            </div>
            <span className="text-sm font-medium">Tarjeta</span>
          </button>
        </div>
      </div>
    </>
  )
}
