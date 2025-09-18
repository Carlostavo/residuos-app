'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/useAuth'

export default function AdvancedEditor({ isOpen, onClose, currentPage }) {
  const [selectedElement, setSelectedElement] = useState(null)
  const [originalContent, setOriginalContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
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
  }, [isOpen, role, editMode])

  const enableEditMode = () => {
    document.body.classList.add('editor-mode')
    document.body.style.cursor = getCursorStyle()
    
    // Agregar event listeners específicos por modo
    if (editMode === 'text') {
      document.addEventListener('click', handleAddTextClick)
    } else if (editMode === 'delete') {
      document.addEventListener('click', handleDeleteClick)
    } else {
      document.addEventListener('dblclick', handleEditClick)
    }
  }

  const disableEditMode = () => {
    document.body.classList.remove('editor-mode')
    document.body.style.cursor = 'default'
    
    // Remover todos los event listeners
    document.removeEventListener('click', handleAddTextClick)
    document.removeEventListener('click', handleDeleteClick)
    document.removeEventListener('dblclick', handleEditClick)
  }

  const getCursorStyle = () => {
    switch (editMode) {
      case 'text': return 'text'
      case 'delete': return 'not-allowed'
      default: return 'crosshair'
    }
  }

  const handleEditClick = (e) => {
    const element = findTextElement(e.target)
    if (element && !e.target.closest('.editor-toolbar')) {
      e.preventDefault()
      e.stopPropagation()
      openTextEditor(element, e.clientX, e.clientY)
    }
  }

  const handleAddTextClick = (e) => {
    if (!e.target.closest('.editor-toolbar')) {
      addNewTextElement(e.clientX, e.clientY)
    }
  }

  const handleDeleteClick = (e) => {
    const element = findTextElement(e.target)
    if (element && !e.target.closest('.editor-toolbar')) {
      e.preventDefault()
      e.stopPropagation()
      deleteElement(element)
    }
  }

  const findTextElement = (target) => {
    // Buscar elementos de texto editables
    return target.closest('h1, h2, h3, h4, h5, h6, p, span, div, li, td, th, figcaption, blockquote') ||
           target.closest('[data-editable]') ||
           target
  }

  const openTextEditor = (element, x, y) => {
    setSelectedElement(element)
    setOriginalContent(element.textContent || element.innerHTML)
    setIsEditing(true)
    
    // Posicionar el editor cerca del elemento
    const editor = editorRef.current
    if (editor) {
      editor.style.left = `${Math.min(x, window.innerWidth - 400)}px`
      editor.style.top = `${Math.min(y - 200, window.innerHeight - 300)}px`
    }
  }

  const addNewTextElement = (x, y) => {
    const newElementId = `new-text-${Date.now()}`
    const newElement = document.createElement('div')
    
    newElement.id = newElementId
    newElement.className = 'editable-text-element absolute bg-white p-4 rounded-lg shadow-lg border-2 border-dashed border-blue-400 z-40'
    newElement.contentEditable = true
    newElement.style.left = `${x}px`
    newElement.style.top = `${y}px`
    newElement.style.minWidth = '250px'
    newElement.style.maxWidth = '400px'
    newElement.innerHTML = 'Haz clic para editar este texto...'
    
    // Hacer el elemento arrastrable
    makeElementDraggable(newElement)
    
    document.body.appendChild(newElement)
    openTextEditor(newElement, x, y)
  }

  const makeElementDraggable = (element) => {
    let isDragging = false
    let offsetX, offsetY

    element.addEventListener('mousedown', (e) => {
      if (e.target === element || e.target.tagName !== 'TEXTAREA') {
        isDragging = true
        offsetX = e.clientX - element.getBoundingClientRect().left
        offsetY = e.clientY - element.getBoundingClientRect().top
        element.style.cursor = 'grabbing'
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        element.style.left = `${e.clientX - offsetX}px`
        element.style.top = `${e.clientY - offsetY}px`
      }
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
      element.style.cursor = 'grab'
      saveElementToStorage(element)
    })

    element.style.cursor = 'grab'
  }

  const deleteElement = (element) => {
    if (element.id && element.id.startsWith('new-text-')) {
      if (confirm('¿Eliminar este elemento?')) {
        element.remove()
        removeElementFromStorage(element.id)
      }
    } else {
      alert('Solo puedes eliminar elementos de texto agregados. Para modificar contenido existente, usa el modo edición.')
    }
  }

  const handleContentChange = (e) => {
    if (selectedElement) {
      selectedElement.innerHTML = e.target.value
    }
  }

  const saveChanges = () => {
    if (selectedElement) {
      saveElementToStorage(selectedElement)
    }
    setIsEditing(false)
    setSelectedElement(null)
  }

  const saveElementToStorage = (element) => {
    const elementData = {
      id: element.id,
      html: element.innerHTML,
      type: element.tagName.toLowerCase(),
      position: {
        left: element.style.left,
        top: element.style.top
      },
      styles: {
        fontSize: element.style.fontSize,
        color: element.style.color,
        fontWeight: element.style.fontWeight
      },
      page: currentPage
    }

    const existingData = localStorage.getItem(`page-content-${currentPage}`)
    let elements = existingData ? JSON.parse(existingData) : []
    
    const existingIndex = elements.findIndex(el => el.id === elementData.id)
    if (existingIndex >= 0) {
      elements[existingIndex] = elementData
    } else {
      elements.push(elementData)
    }
    
    localStorage.setItem(`page-content-${currentPage}`, JSON.stringify(elements))
  }

  const removeElementFromStorage = (elementId) => {
    const existingData = localStorage.getItem(`page-content-${currentPage}`)
    if (existingData) {
      let elements = JSON.parse(existingData)
      elements = elements.filter(el => el.id !== elementId)
      localStorage.setItem(`page-content-${currentPage}`, JSON.stringify(elements))
    }
  }

  const cancelEdit = () => {
    if (selectedElement && originalContent) {
      selectedElement.innerHTML = originalContent
    }
    setIsEditing(false)
    setSelectedElement(null)
  }

  const resetPage = () => {
    if (confirm('¿Restablecer toda la página? Se perderán todos los cambios.')) {
      // Eliminar elementos nuevos del DOM
      document.querySelectorAll('.editable-text-element').forEach(el => el.remove())
      
      // Limpiar localStorage
      localStorage.removeItem(`page-content-${currentPage}`)
      
      // Recargar la página
      window.location.reload()
    }
  }

  if (!isOpen || !(role === 'admin' || role === 'tecnico')) return null

  return (
    <>
      {/* Overlay de edición */}
      <div className="fixed inset-0 bg-blue-100 bg-opacity-20 z-40" style={{ cursor: getCursorStyle() }}>
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <i className="fa-solid fa-pen-to-square mr-2"></i>
          Modo Edición - {editMode === 'select' ? 'Seleccionar (doble clic)' : editMode === 'text' ? 'Agregar Texto' : 'Eliminar'}
        </div>
      </div>

      {/* Panel de herramientas */}
      <div className="editor-toolbar fixed top-20 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-64">
        <h3 className="font-bold mb-3 text-center">Herramientas de Edición</h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button 
            onClick={() => setEditMode('select')}
            className={`p-3 rounded ${editMode === 'select' ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700 transition-colors`}
            title="Modo Selección (doble clic para editar)"
          >
            <i className="fa-solid fa-mouse-pointer block text-center mb-1"></i>
            <span className="text-xs">Seleccionar</span>
          </button>
          
          <button 
            onClick={() => setEditMode('text')}
            className={`p-3 rounded ${editMode === 'text' ? 'bg-green-600' : 'bg-gray-600'} hover:bg-green-700 transition-colors`}
            title="Agregar nuevo texto"
          >
            <i className="fa-solid fa-font block text-center mb-1"></i>
            <span className="text-xs">Agregar</span>
          </button>
          
          <button 
            onClick={() => setEditMode('delete')}
            className={`p-3 rounded ${editMode === 'delete' ? 'bg-red-600' : 'bg-gray-600'} hover:bg-red-700 transition-colors`}
            title="Eliminar elementos agregados"
          >
            <i className="fa-solid fa-trash block text-center mb-1"></i>
            <span className="text-xs">Eliminar</span>
          </button>
        </div>

        <div className="space-y-2">
          <button 
            onClick={resetPage}
            className="w-full px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-700 text-sm flex items-center justify-center"
          >
            <i className="fa-solid fa-undo mr-2"></i>
            Restablecer Página
          </button>
          
          <button 
            onClick={onClose}
            className="w-full px-3 py-2 bg-green-600 rounded hover:bg-green-700 text-sm flex items-center justify-center"
          >
            <i className="fa-solid fa-check mr-2"></i>
            Guardar y Salir
          </button>
        </div>

        <div className="mt-4 p-3 bg-gray-700 rounded text-xs">
          <p className="font-bold mb-2">Instrucciones:</p>
          <ul className="space-y-1">
            <li>• <span className="font-semibold">Seleccionar:</span> Doble clic en cualquier texto para editarlo</li>
            <li>• <span className="font-semibold">Agregar:</span> Clic donde quieras agregar texto nuevo</li>
            <li>• <span className="font-semibold">Eliminar:</span> Clic en elementos agregados para borrarlos</li>
            <li>• <span className="font-semibold">Mover:</span> Arrastra los elementos nuevos para reposicionarlos</li>
          </ul>
        </div>
      </div>

      {/* Editor de texto */}
      {isEditing && selectedElement && (
        <div 
          ref={editorRef}
          className="fixed bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-96 editor-toolbar"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold">Editor de Texto</h4>
            <button 
              onClick={cancelEdit}
              className="text-gray-400 hover:text-white"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          <textarea
            value={selectedElement.innerHTML}
            onChange={handleContentChange}
            className="w-full p-3 text-black rounded mb-3 resize-none"
            rows="8"
            placeholder="Escribe tu contenido aquí..."
          />
          
          <div className="flex justify-end gap-2">
            <button 
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button 
              onClick={saveChanges}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
