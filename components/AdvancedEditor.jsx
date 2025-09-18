'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/useAuth'

export default function AdvancedEditor({ isOpen, onClose, currentPage }) {
  const [selectedElement, setSelectedElement] = useState(null)
  const [originalContent, setOriginalContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 })
  const [editMode, setEditMode] = useState('select') // 'select', 'text', 'delete'
  const { role } = useAuth()
  const editorRef = useRef(null)

  // Efecto principal para manejar el modo edición
  useEffect(() => {
    if (isOpen && (role === 'admin' || role === 'tecnico')) {
      enableEditMode()
    } else {
      disableEditMode()
    }

    return () => disableEditMode()
  }, [isOpen, role])

  const enableEditMode = () => {
    document.addEventListener('click', handleElementClick)
    document.addEventListener('dblclick', handleDoubleClick)
    document.body.style.cursor = editMode === 'select' ? 'crosshair' : 'text'
  }

  const disableEditMode = () => {
    document.removeEventListener('click', handleElementClick)
    document.removeEventListener('dblclick', handleDoubleClick)
    document.body.style.cursor = 'default'
    document.querySelectorAll('.editable-highlight').forEach(el => {
      el.classList.remove('editable-highlight')
    })
  }

  const handleElementClick = (e) => {
    if (editMode === 'delete') {
      handleDeleteElement(e)
      return
    }

    if (editMode === 'text') {
      addNewTextElement(e)
      return
    }

    // Modo selección normal
    const element = findEditableElement(e.target)
    if (element) {
      e.preventDefault()
      e.stopPropagation()
      openEditor(element, e.clientX, e.clientY)
    }
  }

  const handleDoubleClick = (e) => {
    if (editMode === 'select') {
      const element = findEditableElement(e.target)
      if (element) {
        e.preventDefault()
        e.stopPropagation()
        openEditor(element, e.clientX, e.clientY)
      }
    }
  }

  const handleDeleteElement = (e) => {
    const element = findEditableElement(e.target)
    if (element && element.id) {
      if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
        // Eliminar de localStorage
        const saved = localStorage.getItem(`page-content-${currentPage}`)
        if (saved) {
          const elements = JSON.parse(saved)
          const updatedElements = elements.filter(el => el.id !== element.id)
          localStorage.setItem(`page-content-${currentPage}`, JSON.stringify(updatedElements))
        }
        
        // Eliminar del DOM
        element.remove()
        alert('Elemento eliminado correctamente')
      }
    }
  }

  const findEditableElement = (target) => {
    return target.closest('[data-editable]') || 
           target.closest('.editable') || 
           target.closest('h1, h2, h3, h4, h5, h6, p, span, div')
  }

  const openEditor = (element, x, y) => {
    setSelectedElement(element)
    setOriginalContent(element.innerHTML)
    setIsEditing(true)
    setEditorPosition({ x, y })
  }

  const addNewTextElement = (e) => {
    const x = e.clientX
    const y = e.clientY
    const newElementId = `new-text-${Date.now()}`
    
    const newElement = document.createElement('div')
    newElement.id = newElementId
    newElement.className = 'editable new-text-element'
    newElement.contentEditable = true
    newElement.style.position = 'absolute'
    newElement.style.left = `${x}px`
    newElement.style.top = `${y}px`
    newElement.style.minWidth = '200px'
    newElement.style.minHeight = '40px'
    newElement.style.padding = '10px'
    newElement.style.backgroundColor = 'white'
    newElement.style.border = '2px dashed #3b82f6'
    newElement.style.borderRadius = '8px'
    newElement.style.zIndex = '1000'
    newElement.innerHTML = 'Escribe tu texto aquí...'
    
    document.body.appendChild(newElement)
    
    // Guardar automáticamente
    saveElementToStorage(newElement)
    
    // Abrir editor para el nuevo elemento
    openEditor(newElement, x, y)
    
    alert('Nuevo elemento de texto agregado. Arrástralo para moverlo.')
  }

  const handleContentChange = (e) => {
    if (selectedElement) {
      selectedElement.innerHTML = e.target.value
    }
  }

  const saveChanges = () => {
    if (selectedElement) {
      saveElementToStorage(selectedElement)
      alert('Cambios guardados correctamente!')
    }
    setIsEditing(false)
    setSelectedElement(null)
  }

  const saveElementToStorage = (element) => {
    const elementData = {
      id: element.id || `element-${Date.now()}`,
      html: element.innerHTML,
      type: element.tagName.toLowerCase(),
      styles: {
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
        width: element.style.width,
        height: element.style.height,
        fontSize: element.style.fontSize,
        color: element.style.color,
        backgroundColor: element.style.backgroundColor
      },
      classes: element.className,
      page: currentPage
    }

    // Guardar en localStorage
    const existingData = localStorage.getItem(`page-content-${currentPage}`)
    let elements = existingData ? JSON.parse(existingData) : []
    
    // Actualizar o agregar elemento
    const existingIndex = elements.findIndex(el => el.id === elementData.id)
    if (existingIndex >= 0) {
      elements[existingIndex] = elementData
    } else {
      elements.push(elementData)
    }
    
    localStorage.setItem(`page-content-${currentPage}`, JSON.stringify(elements))
    
    // Asignar ID si no tenía
    if (!element.id) {
      element.id = elementData.id
    }
  }

  const cancelEdit = () => {
    if (selectedElement) {
      selectedElement.innerHTML = originalContent
    }
    setIsEditing(false)
    setSelectedElement(null)
  }

  const resetPage = () => {
    if (confirm('¿Estás seguro de que quieres restablecer toda la página a su estado original?')) {
      localStorage.removeItem(`page-content-${currentPage}`)
      window.location.reload()
    }
  }

  const makeDraggable = () => {
    if (selectedElement) {
      selectedElement.style.cursor = 'move'
      selectedElement.draggable = true
      
      selectedElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', selectedElement.id)
      })
      
      selectedElement.addEventListener('dragend', (e) => {
        const rect = selectedElement.getBoundingClientRect()
        selectedElement.style.left = `${rect.left}px`
        selectedElement.style.top = `${rect.top}px`
        selectedElement.style.position = 'absolute'
        saveElementToStorage(selectedElement)
      })
      
      alert('Elemento ahora es arrastrable. Arrástralo para moverlo.')
    }
  }

  if (!isOpen || !(role === 'admin' || role === 'tecnico')) return null

  return (
    <>
      {/* Overlay de edición */}
      <div className="fixed inset-0 bg-blue-100 bg-opacity-20 z-40 cursor-crosshair">
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <i className="fa-solid fa-pen-to-square mr-2"></i>
          Modo Edición Avanzado - {editMode === 'select' ? 'Seleccionar' : editMode === 'text' ? 'Agregar Texto' : 'Eliminar'}
        </div>
      </div>

      {/* Panel de herramientas avanzado */}
      <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-64">
        <h3 className="font-bold mb-3 text-center">Herramientas de Edición</h3>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button 
            onClick={() => setEditMode('select')}
            className={`p-2 rounded ${editMode === 'select' ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700`}
            title="Modo Selección"
          >
            <i className="fa-solid fa-mouse-pointer"></i>
          </button>
          <button 
            onClick={() => setEditMode('text')}
            className={`p-2 rounded ${editMode === 'text' ? 'bg-green-600' : 'bg-gray-600'} hover:bg-green-700`}
            title="Agregar Texto"
          >
            <i className="fa-solid fa-font"></i>
          </button>
          <button 
            onClick={() => setEditMode('delete')}
            className={`p-2 rounded ${editMode === 'delete' ? 'bg-red-600' : 'bg-gray-600'} hover:bg-red-700`}
            title="Eliminar Elemento"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
          <button 
            onClick={makeDraggable}
            className="p-2 rounded bg-purple-600 hover:bg-purple-700"
            title="Hacer Arrastrable"
          >
            <i className="fa-solid fa-arrows-up-down-left-right"></i>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={resetPage}
            className="px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-700 text-sm"
          >
            <i className="fa-solid fa-undo mr-1"></i> Restablecer Página
          </button>
          <button 
            onClick={onClose}
            className="px-3 py-2 bg-green-600 rounded hover:bg-green-700 text-sm"
          >
            <i className="fa-solid fa-check mr-1"></i> Guardar y Salir
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          <p>• Doble clic: Editar elemento</p>
          <p>• Modo texto: Agregar nuevo texto</p>
          <p>• Modo eliminar: Borrar elementos</p>
        </div>
      </div>

      {/* Editor de texto flotante */}
      {isEditing && selectedElement && (
        <div 
          ref={editorRef}
          className="fixed bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-96"
          style={{
            left: `${editorPosition.x}px`,
            top: `${editorPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <h4 className="font-bold mb-2">Editor de Contenido</h4>
          <textarea
            value={selectedElement.innerHTML}
            onChange={handleContentChange}
            className="w-full p-2 text-black rounded mb-2"
            rows="6"
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={cancelEdit}
              className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700 text-sm"
            >
              Cancelar
            </button>
            <button 
              onClick={saveChanges}
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
