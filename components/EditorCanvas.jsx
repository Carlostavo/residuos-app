'use client'
import { useState, useEffect } from 'react'

export default function EditorCanvas({ isOpen, onClose, currentPage }) {
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Cargar elementos guardados al abrir el editor
  useEffect(() => {
    if (isOpen) {
      const savedElements = localStorage.getItem(`editor-elements-${currentPage}`)
      if (savedElements) {
        setElements(JSON.parse(savedElements))
      } else {
        // Elementos por defecto según la página
        setElements(getDefaultElements(currentPage))
      }
    }
  }, [isOpen, currentPage])

  const getDefaultElements = (page) => {
    const defaults = {
      '/inicio': [
        { id: 1, type: 'hero', content: 'Sistema de Gestión de Residuos Sólidos', x: 50, y: 50, width: 800, height: 150 },
        { id: 2, type: 'text', content: 'La plataforma para monitorear indicadores...', x: 100, y: 120, width: 600, height: 40 }
      ],
      '/indicadores': [
        { id: 1, type: 'hero', content: 'Dashboard de Indicadores', x: 50, y: 50, width: 800, height: 120 },
        { id: 2, type: 'text', content: 'Aquí podrás ver todos los indicadores...', x: 100, y: 100, width: 600, height: 40 }
      ],
      '/metas': [
        { id: 1, type: 'hero', content: 'Gestión de Metas de Sostenibilidad', x: 50, y: 50, width: 800, height: 120 },
        { id: 2, type: 'text', content: 'Define, monitorea y ajusta tus metas ambientales.', x: 100, y: 100, width: 600, height: 40 }
      ],
      '/avances': [
        { id: 1, type: 'hero', content: 'Progreso y Avances del Proyecto', x: 50, y: 50, width: 800, height: 120 },
        { id: 2, type: 'text', content: 'Visualiza el avance de tus iniciativas y proyectos.', x: 100, y: 100, width: 600, height: 40 }
      ],
      '/reportes': [
        { id: 1, type: 'hero', content: 'Generación y Descarga de Reportes', x: 50, y: 50, width: 800, height: 120 },
        { id: 2, type: 'text', content: 'Crea informes personalizados para tus stakeholders.', x: 100, y: 100, width: 600, height: 40 }
      ],
      '/formularios': [
        { id: 1, type: 'hero', content: 'Gestión y Creación de Formularios', x: 50, y: 50, width: 800, height: 120 },
        { id: 2, type: 'text', content: 'Diseña, despliega y administra formularios...', x: 100, y: 100, width: 600, height: 40 }
      ]
    }
    return defaults[page] || []
  }

  const handleMouseDown = (e, element) => {
    e.stopPropagation()
    setSelectedElement(element)
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - element.x,
      y: e.clientY - element.y
    })
  }

  const handleMouseMove = (e) => {
    if (isDragging && selectedElement) {
      const updatedElements = elements.map(el => 
        el.id === selectedElement.id 
          ? { ...el, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }
          : el
      )
      setElements(updatedElements)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'Nuevo texto' : 'Título',
      x: 100,
      y: 100,
      width: type === 'hero' ? 800 : 300,
      height: type === 'hero' ? 120 : 40
    }
    setElements([...elements, newElement])
  }

  const updateElementContent = (id, content) => {
    const updatedElements = elements.map(el => 
      el.id === id ? { ...el, content } : el
    )
    setElements(updatedElements)
  }

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedElement?.id === id) {
      setSelectedElement(null)
    }
  }

  const saveChanges = () => {
    localStorage.setItem(`editor-elements-${currentPage}`, JSON.stringify(elements))
    alert('Cambios guardados correctamente!')
    onClose()
  }

  const discardChanges = () => {
    setElements(getDefaultElements(currentPage))
    localStorage.removeItem(`editor-elements-${currentPage}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col z-50">
      {/* Barra de herramientas superior */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Modo Edición - {currentPage}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => addElement('text')} 
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            <i className="fa-solid fa-font mr-2"></i>Agregar Texto
          </button>
          <button 
            onClick={() => addElement('hero')} 
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            <i className="fa-solid fa-heading mr-2"></i>Agregar Título
          </button>
          <button 
            onClick={saveChanges} 
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            <i className="fa-solid fa-save mr-2"></i>Guardar
          </button>
          <button 
            onClick={discardChanges} 
            className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
          >
            <i className="fa-solid fa-undo mr-2"></i>Restablecer
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            <i className="fa-solid fa-times mr-2"></i>Salir
          </button>
        </div>
      </div>

      {/* Área de canvas */}
      <div 
        className="flex-1 relative overflow-auto bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="p-8 min-h-full">
          {/* Renderizar elementos editables */}
          {elements.map(element => (
            <div
              key={element.id}
              className={`absolute border-2 ${selectedElement?.id === element.id ? 'border-blue-500' : 'border-transparent'} cursor-move`}
              style={{
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`
              }}
              onMouseDown={(e) => handleMouseDown(e, element)}
            >
              {element.type === 'hero' ? (
                <div className="bg-green-50 p-4 rounded-lg shadow h-full flex items-center justify-center">
                  <h1 className="text-3xl font-bold text-green-700 text-center">{element.content}</h1>
                  <button 
                    onClick={() => deleteElement(element.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <i className="fa-solid fa-times text-xs"></i>
                  </button>
                </div>
              ) : (
                <div className="bg-white p-3 rounded shadow h-full">
                  <input
                    type="text"
                    value={element.content}
                    onChange={(e) => updateElementContent(element.id, e.target.value)}
                    className="w-full p-1 border rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button 
                    onClick={() => deleteElement(element.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <i className="fa-solid fa-times text-xs"></i>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Panel de propiedades (si hay elemento seleccionado) */}
      {selectedElement && (
        <div className="bg-gray-800 text-white p-4 w-80">
          <h3 className="font-bold mb-2">Propiedades</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm">Contenido:</label>
              <input
                type="text"
                value={selectedElement.content}
                onChange={(e) => updateElementContent(selectedElement.id, e.target.value)}
                className="w-full p-1 text-black rounded"
              />
            </div>
            <div>
              <label className="block text-sm">Posición X: {selectedElement.x}px</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={selectedElement.x}
                onChange={(e) => {
                  const updatedElements = elements.map(el => 
                    el.id === selectedElement.id ? { ...el, x: parseInt(e.target.value) } : el
                  )
                  setElements(updatedElements)
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm">Posición Y: {selectedElement.y}px</label>
              <input
                type="range"
                min="0"
                max="800"
                value={selectedElement.y}
                onChange={(e) => {
                  const updatedElements = elements.map(el => 
                    el.id === selectedElement.id ? { ...el, y: parseInt(e.target.value) } : el
                  )
                  setElements(updatedElements)
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
