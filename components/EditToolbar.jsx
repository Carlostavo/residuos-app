'use client'
import { useEdit } from '../contexts/EditContext'

export default function EditToolbar() {
  const { isEditing, setIsEditing } = useEdit()

  if (!isEditing) return null

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Herramientas de Edición</h2>
        <button 
          onClick={() => setIsEditing(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Estilos de Texto</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="p-2 border rounded hover:bg-gray-50">
              <i className="fa-solid fa-bold"></i>
            </button>
            <button className="p-2 border rounded hover:bg-gray-50">
              <i className="fa-solid fa-italic"></i>
            </button>
            <button className="p-2 border rounded hover:bg-gray-50">
              <i className="fa-solid fa-underline"></i>
            </button>
            <button className="p-2 border rounded hover:bg-gray-50">
              <i className="fa-solid fa-align-left"></i>
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Tamaño de Texto</h3>
          <select className="w-full p-2 border rounded">
            <option>Pequeño</option>
            <option>Normal</option>
            <option>Grande</option>
            <option>Muy Grande</option>
          </select>
        </div>

        <div>
          <h3 className="font-medium mb-2">Color</h3>
          <div className="grid grid-cols-4 gap-2">
            <button className="w-6 h-6 bg-black rounded"></button>
            <button className="w-6 h-6 bg-red-500 rounded"></button>
            <button className="w-6 h-6 bg-blue-500 rounded"></button>
            <button className="w-6 h-6 bg-green-500 rounded"></button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Elementos</h3>
          <div className="space-y-2">
            <button className="w-full p-2 border rounded text-left hover:bg-gray-50">
              <i className="fa-solid fa-heading mr-2"></i>Agregar Título
            </button>
            <button className="w-full p-2 border rounded text-left hover:bg-gray-50">
              <i className="fa-solid fa-paragraph mr-2"></i>Agregar Párrafo
            </button>
            <button className="w-full p-2 border rounded text-left hover:bg-gray-50">
              <i className="fa-solid fa-image mr-2"></i>Agregar Imagen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
