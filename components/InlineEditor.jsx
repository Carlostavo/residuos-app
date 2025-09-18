'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/useAuth'

export default function InlineEditor({ isOpen, onClose, currentPage }) {
  const [selectedElement, setSelectedElement] = useState(null)
  const [originalContent, setOriginalContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const { role } = useAuth()

  // Función para activar/desactivar el modo edición
  const toggleEditMode = useCallback((enable) => {
    const editables = document.querySelectorAll('.editable')
    editables.forEach(el => {
      if (enable) {
        el.style.outline = '2px dashed #3b82f6'
        el.style.cursor = 'pointer'
        el.setAttribute('data-editable', 'true')
      } else {
        el.style.outline = 'none'
        el.style.cursor = 'default'
        el.removeAttribute('data-editable')
      }
    })
  }, [])

  useEffect(() => {
    if (isOpen && (role === 'admin' || role === 'tecnico')) {
      toggleEditMode(true)
      
      // Agregar event listener para clics
      document.addEventListener('click', handleElementClick)
    } else {
      toggleEditMode(false)
      setIsEditing(false)
      setSelectedElement(null)
    }

    return () => {
      document.removeEventListener('click', handleElementClick)
      toggleEditMode(false)
    }
  }, [isOpen, role, toggleEditMode])

  const handleElementClick = useCallback((e) => {
    if (!isOpen) return
    
    const element = e.target.closest('[data-editable="true"]')
    if (element) {
      e.preventDefault()
      e.stopPropagation()
      setSelectedElement(element)
      setOriginalContent(element.innerHTML)
      setIsEditing(true)
    }
  }, [isOpen])

  const handleContentChange = (e) => {
    if (selectedElement) {
      selectedElement.innerHTML = e.target.value
    }
  }

  const saveChanges = () => {
    if (selectedElement && (role === 'admin' || role === 'tecnico')) {
      // Guardar cambios en localStorage
      const pageElements = Array.from(document.querySelectorAll('.editable')).map(el => ({
        id: el.id,
        html: el.innerHTML,
        selector: getSelector(el)
      }))
      
      localStorage.setItem(`page-content-${currentPage}`, JSON.stringify(pageElements))
      alert('Cambios guardados correctamente!')
    }
    setIsEditing(false)
    setSelectedElement(null)
  }

  const cancelEdit = () => {
    if (selectedElement) {
      selectedElement.innerHTML = originalContent
    }
    setIsEditing(false)
    setSelectedElement(null)
  }

  const getSelector = (el) => {
    if (el.id) return `#${el.id}`
    return ''
  }

  const resetPage = () => {
    if (role === 'admin' || role === 'tecnico') {
      if (confirm('¿Estás seguro de que quieres restablecer el contenido original? Se perderán todos los cambios.')) {
        localStorage.removeItem(`page-content-${currentPage}`)
        window.location.reload()
      }
    }
  }

  // No mostrar editor si no está abierto o no tiene permisos
  if (!isOpen || !(role === 'admin' || role === 'tecnico')) return null

  return (
    <>
      {/* Overlay de edición */}
      <div 
        className="fixed inset-0 bg-blue-100 bg-opacity-20 z-40 cursor-crosshair"
        onClick={() => setIsEditing(false)}
      >
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <i className="fa-solid fa-pen-to-square mr-2"></i>
          Modo Edición - Haz clic en cualquier elemento para editarlo
        </div>
      </div>

      {/* Panel de herramientas */}
      <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
        <h3 className="font-bold mb-2">Herramientas de Edición</h3>
        <div className="flex flex-col gap-2">
          <button 
            onClick={resetPage}
            className="px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-700 text-sm"
          >
            <i className="fa-solid fa-undo mr-1"></i> Restablecer
          </button>
          <button 
            onClick={onClose}
            className="px-3 py-2 bg-green-600 rounded hover:bg-green-700 text-sm"
          >
            <i className="fa-solid fa-check mr-1"></i> Guardar y Salir
          </button>
        </div>
      </div>

      {/* Editor de texto flotante */}
      {isEditing && selectedElement && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50 w-96">
          <h4 className="font-bold mb-2">Editar contenido</h4>
          <textarea
            value={selectedElement.innerHTML}
            onChange={handleContentChange}
            className="w-full p-2 text-black rounded mb-2"
            rows="4"
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
