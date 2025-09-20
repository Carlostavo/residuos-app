"use client"
import { useCanvaEdit } from "@/lib/CanvaEditContext"
import { useState } from "react"

export default function CanvaToolbar() {
  const {
    selectedElement,
    elements,
    showToolbar,
    toolbarPosition,
    updateElement,
    removeElement,
    duplicateElement,
    deselectElement,
  } = useCanvaEdit()

  const [activeTab, setActiveTab] = useState("style")

  if (!showToolbar || !selectedElement) return null

  const element = elements[selectedElement]
  if (!element) return null

  const handleStyleChange = (property, value) => {
    updateElement(selectedElement, {
      style: { ...element.style, [property]: value },
    })
  }

  const handleContentChange = (content) => {
    updateElement(selectedElement, { content })
  }

  const handleSizeChange = (property, value) => {
    updateElement(selectedElement, { [property]: Number.parseInt(value) })
  }

  return (
    <div
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50 min-w-80"
      style={{
        left: `${toolbarPosition.x - 160}px`,
        top: `${toolbarPosition.y}px`,
        transform: toolbarPosition.y < 100 ? "translateY(60px)" : "none",
      }}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("style")}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === "style" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Estilo
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === "content" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Contenido
          </button>
          <button
            onClick={() => setActiveTab("position")}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === "position" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Posición
          </button>
        </div>
        <button onClick={deselectElement} className="text-gray-400 hover:text-gray-600 text-lg">
          ×
        </button>
      </div>

      <div className="p-4">
        {activeTab === "style" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={element.style?.color || "#000000"}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                  className="w-full h-8 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fondo</label>
                <input
                  type="color"
                  value={element.style?.backgroundColor || "#ffffff"}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="w-full h-8 rounded border border-gray-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tamaño de fuente</label>
              <input
                type="range"
                min="10"
                max="48"
                value={Number.parseInt(element.style?.fontSize) || 16}
                onChange={(e) => handleStyleChange("fontSize", `${e.target.value}px`)}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{element.style?.fontSize || "16px"}</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() =>
                  handleStyleChange("fontWeight", element.style?.fontWeight === "bold" ? "normal" : "bold")
                }
                className={`px-3 py-1 text-sm rounded border ${
                  element.style?.fontWeight === "bold" ? "bg-blue-100 border-blue-300" : "border-gray-300"
                }`}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() =>
                  handleStyleChange("fontStyle", element.style?.fontStyle === "italic" ? "normal" : "italic")
                }
                className={`px-3 py-1 text-sm rounded border ${
                  element.style?.fontStyle === "italic" ? "bg-blue-100 border-blue-300" : "border-gray-300"
                }`}
              >
                <em>I</em>
              </button>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-3">
            {element.type === "text" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Texto</label>
                <textarea
                  value={element.content || ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                  rows="3"
                />
              </div>
            )}

            {element.type === "image" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">URL de imagen</label>
                <input
                  type="url"
                  value={element.content || ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            )}

            {element.type === "video" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">URL de video</label>
                <input
                  type="url"
                  value={element.content || ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "position" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ancho</label>
                <input
                  type="number"
                  value={element.width || 200}
                  onChange={(e) => handleSizeChange("width", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Alto</label>
                <input
                  type="number"
                  value={element.height || 40}
                  onChange={(e) => handleSizeChange("height", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
                <input
                  type="number"
                  value={element.x || 0}
                  onChange={(e) => handleSizeChange("x", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
                <input
                  type="number"
                  value={element.y || 0}
                  onChange={(e) => handleSizeChange("y", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => duplicateElement(selectedElement)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Duplicar
          </button>
          <button
            onClick={() => removeElement(selectedElement)}
            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
