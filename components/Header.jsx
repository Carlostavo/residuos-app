'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useState, useEffect, useRef } from 'react'

export default function Header() {
  const pathname = usePathname()
  const { session, role, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const [editorContent, setEditorContent] = useState('')
  const [elementStyle, setElementStyle] = useState({})
  const [linkUrl, setLinkUrl] = useState('')
  const dragInfo = useRef({ isDragging: false, element: null, startX: 0, startY: 0, startLeft: 0, startTop: 0 })

  useEffect(() => {
    const savedEditState = localStorage.getItem('canvas-editor-active')
    if (savedEditState === 'true' && (role === 'admin' || role === 'tecnico')) {
      setIsEditing(true)
      setTimeout(initCanvasEditor, 100)
    }
  }, [role])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      setShowLoginModal(false)
      setEmail('')
      setPassword('')
      window.location.reload()
    }
    setLoginLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    disableCanvasEditor()
    window.location.reload()
  }

  const toggleEditMode = () => {
    if (!session) {
      setShowLoginModal(true)
      return
    }
    
    if (role === 'admin' || role === 'tecnico') {
      const newEditState = !isEditing
      setIsEditing(newEditState)
      localStorage.setItem('canvas-editor-active', newEditState.toString())
      
      if (newEditState) {
        setTimeout(initCanvasEditor, 100)
      } else {
        disableCanvasEditor()
      }
    } else {
      alert('No tienes permisos para editar. Contacta al administrador.')
    }
  }

  const initCanvasEditor = () => {
    document.body.classList.add('canvas-edit-mode')
    setupCanvasInteractions()
    loadSavedCanvas()
  }

  const disableCanvasEditor = () => {
    document.body.classList.remove('canvas-edit-mode')
    cleanupCanvasInteractions()
    setSelectedElement(null)
  }

  const setupCanvasInteractions = () => {
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('click', handleCanvasClick)
  }

  const cleanupCanvasInteractions = () => {
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('click', handleCanvasClick)
  }

  const handleCanvasClick = (e) => {
    if (!isEditing) return
    
    const element = e.target.closest('.canvas-element')
    if (element) {
      selectElement(element)
      e.stopPropagation()
    }
  }

  const handleMouseDown = (e) => {
    if (!isEditing) return
    
    const element = e.target.closest('.canvas-element')
    if (element && e.button === 0) {
      if (e.target.closest('a, button, input, textarea')) return
      
      dragInfo.current = {
        isDragging: true,
        element: element,
        startX: e.clientX,
        startY: e.clientY,
        startLeft: parseInt(element.style.left || 0),
        startTop: parseInt(element.style.top || 0)
      }
      
      element.classList.add('dragging')
      document.body.style.cursor = 'grabbing'
      e.preventDefault()
    }
  }

  const handleMouseMove = (e) => {
    if (!isEditing || !dragInfo.current.isDragging) return
    
    const dx = e.clientX - dragInfo.current.startX
    const dy = e.clientY - dragInfo.current.startY
    
    const newLeft = dragInfo.current.startLeft + dx
    const newTop = dragInfo.current.startTop + dy
    
    dragInfo.current.element.style.left = `${newLeft}px`
    dragInfo.current.element.style.top = `${newTop}px`
  }

  const handleMouseUp = () => {
    if (dragInfo.current.isDragging) {
      dragInfo.current.element.classList.remove('dragging')
      document.body.style.cursor = 'default'
      
      saveElementPosition(dragInfo.current.element.id, {
        left: dragInfo.current.element.style.left,
        top: dragInfo.current.element.style.top
      })
      
      dragInfo.current = { isDragging: false, element: null, startX: 0, startY: 0, startLeft: 0, startTop: 0 }
    }
  }

  const selectElement = (element) => {
    document.querySelectorAll('.canvas-element').forEach(el => {
      el.classList.remove('selected')
    })
    
    element.classList.add('selected')
    setSelectedElement(element)
    setEditorContent(element.textContent || element.innerHTML)
    
    // Capturar estilos actuales
    const style = window.getComputedStyle(element)
    setElementStyle({
      fontSize: style.fontSize,
      color: style.color,
      fontWeight: style.fontWeight,
      textAlign: style.textAlign,
      backgroundColor: style.backgroundColor
    })
    
    // Verificar si tiene enlace
    const link = element.querySelector('a')
    setLinkUrl(link ? link.href : '')
  }

  const applyElementContent = () => {
    if (selectedElement) {
      selectedElement.innerHTML = editorContent
      saveElementData()
    }
  }

  const applyElementStyle = (property, value) => {
    if (selectedElement) {
      selectedElement.style[property] = value
      setElementStyle(prev => ({ ...prev, [property]: value }))
      saveElementData()
    }
  }

  const applyLink = () => {
    if (selectedElement && linkUrl) {
      // Si ya tiene un enlace, actualizarlo
      let link = selectedElement.querySelector('a')
      if (link) {
        link.href = linkUrl
      } else {
        // Crear nuevo enlace
        const content = selectedElement.innerHTML
        selectedElement.innerHTML = `<a href="${linkUrl}" style="color: inherit; text-decoration: inherit;">${content}</a>`
      }
      saveElementData()
    }
  }

  const removeLink = () => {
    if (selectedElement) {
      const link = selectedElement.querySelector('a')
      if (link) {
        selectedElement.innerHTML = link.innerHTML
      }
      setLinkUrl('')
      saveElementData()
    }
  }

  const saveElementData = () => {
    if (!selectedElement) return
    
    const page = pathname
    const savedData = localStorage.getItem(`canvas-data-${page}`)
    let elementsData = savedData ? JSON.parse(savedData) : {}
    
    elementsData[selectedElement.id] = {
      content: selectedElement.innerHTML,
      position: {
        left: selectedElement.style.left,
        top: selectedElement.style.top
      },
      styles: {
        fontSize: selectedElement.style.fontSize,
        color: selectedElement.style.color,
        fontWeight: selectedElement.style.fontWeight,
        textAlign: selectedElement.style.textAlign,
        backgroundColor: selectedElement.style.backgroundColor
      }
    }
    
    localStorage.setItem(`canvas-data-${page}`, JSON.stringify(elementsData))
  }

  const saveElementPosition = (id, position) => {
    const page = pathname
    const savedData = localStorage.getItem(`canvas-data-${page}`)
    let elementsData = savedData ? JSON.parse(savedData) : {}
    
    if (!elementsData[id]) {
      elementsData[id] = { content: document.getElementById(id)?.innerHTML || '' }
    }
    elementsData[id].position = position
    
    localStorage.setItem(`canvas-data-${page}`, JSON.stringify(elementsData))
  }

  const loadSavedCanvas = () => {
    const page = pathname
    const savedData = localStorage.getItem(`canvas-data-${page}`)
    if (savedData) {
      const elementsData = JSON.parse(savedData)
      Object.keys(elementsData).forEach(id => {
        const element = document.getElementById(id)
        if (element) {
          if (elementsData[id].content) {
            element.innerHTML = elementsData[id].content
          }
          if (elementsData[id].position) {
            element.style.position = 'absolute'
            element.style.left = elementsData[id].position.left
            element.style.top = elementsData[id].position.top
          }
          if (elementsData[id].styles) {
            Object.assign(element.style, elementsData[id].styles)
          }
        }
      })
    }
  }

  const saveAllChanges = () => {
    document.querySelectorAll('.canvas-element').forEach(element => {
      const style = window.getComputedStyle(element)
      saveElementData(element.id, {
        content: element.innerHTML,
        position: {
          left: element.style.left,
          top: element.style.top
        },
        styles: {
          fontSize: element.style.fontSize,
          color: element.style.color,
          fontWeight: element.style.fontWeight,
          textAlign: element.style.textAlign,
          backgroundColor: element.style.backgroundColor
        }
      })
    })
    alert('Todos los cambios han sido guardados')
  }

  const resetCanvas = () => {
    if (confirm('¿Restablecer todo el contenido? Se perderán todos los cambios.')) {
      const page = pathname
      localStorage.removeItem(`canvas-data-${page}`)
      window.location.reload()
    }
  }

  const addNewTextElement = () => {
    const newId = `text-element-${Date.now()}`
    const newElement = document.createElement('div')
    newElement.id = newId
    newElement.className = 'canvas-element text-element'
    newElement.innerHTML = 'Haz clic para editar este texto'
    newElement.style.position = 'absolute'
    newElement.style.left = '100px'
    newElement.style.top = '100px'
    newElement.style.minWidth = '200px'
    newElement.style.minHeight = '40px'
    newElement.style.padding = '12px'
    newElement.style.backgroundColor = '#ffffff'
    newElement.style.borderRadius = '8px'
    newElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
    
    document.querySelector('.content-canvas').appendChild(newElement)
    selectElement(newElement)
  }

  const addNewCardElement = () => {
    const newId = `card-element-${Date.now()}`
    const newElement = document.createElement('div')
    newElement.id = newId
    newElement.className = 'canvas-element'
    newElement.innerHTML = `
      <div class="bg-white rounded-2xl shadow-md p-6">
        <h3 class="text-lg font-semibold">Nueva Tarjeta</h3>
        <p class="text-gray-600 mt-2">Descripción de la tarjeta</p>
      </div>
    `
    newElement.style.position = 'absolute'
    newElement.style.left = '150px'
    newElement.style.top = '150px'
    newElement.style.width = '300px'
    
    document.querySelector('.content-canvas').appendChild(newElement)
    selectElement(newElement)
  }

  const duplicateElement = () => {
    if (selectedElement) {
      const newId = `${selectedElement.id}-copy-${Date.now()}`
      const newElement = selectedElement.cloneNode(true)
      newElement.id = newId
      newElement.style.left = `${parseInt(selectedElement.style.left || 0) + 20}px`
      newElement.style.top = `${parseInt(selectedElement.style.top || 0) + 20}px`
      
      document.querySelector('.content-canvas').appendChild(newElement)
      selectElement(newElement)
    }
  }

  const deleteElement = () => {
    if (selectedElement && confirm('¿Eliminar este elemento?')) {
      const page = pathname
      const savedData = localStorage.getItem(`canvas-data-${page}`)
      if (savedData) {
        const elementsData = JSON.parse(savedData)
        delete elementsData[selectedElement.id]
        localStorage.setItem(`canvas-data-${page}`, JSON.stringify(elementsData))
      }
      
      selectedElement.remove()
      setSelectedElement(null)
    }
  }

  return (
    <>
      <header className="topbar flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        <div className="brand flex items-center gap-2 text-green-700 font-bold">
          <i className="fa-solid fa-recycle"></i>
          <span>Gestión RS</span>
        </div>
        <nav className="flex gap-3 items-center">
          <Link href="/inicio">Inicio</Link>
          <Link href="/indicadores">Indicadores</Link>
          <Link href="/metas">Metas</Link>
          <Link href="/avances">Avances</Link>
          <Link href="/reportes">Reportes</Link>
          <Link href="/formularios">Formularios</Link>

          {loading ? (
            <div className="ml-4 px-4 py-2 bg-gray-300 text-gray-600 rounded-full animate-pulse">
              Cargando...
            </div>
          ) : session ? (
            <>
              {(role === 'admin' || role === 'tecnico') && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleEditMode}
                    className={`ml-4 px-4 py-2 rounded-full ${
                      isEditing ? 'bg-blue-600' : 'bg-green-600'
                    } text-white hover:bg-opacity-90 flex items-center`}
                  >
                    <i className="fa-solid fa-pen mr-2"></i>
                    {isEditing ? 'Salir Editor' : 'Modo Edición'}
                  </button>
                  
                  {isEditing && (
                    <>
                      <button
                        onClick={saveAllChanges}
                        className="ml-2 px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
                      >
                        <i className="fa-solid fa-save mr-1"></i>
                        Guardar
                      </button>
                      <button
                        onClick={resetCanvas}
                        className="ml-2 px-3 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 text-sm"
                      >
                        <i className="fa-solid fa-undo mr-1"></i>
                        Resetear
                      </button>
                    </>
                  )}
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Iniciar sesión
            </button>
          )}
        </nav>
      </header>

      {/* Barra de herramientas fija */}
      {isEditing && (
        <div className="fixed top-16 left-0 right-0 bg-gray-800 text-white shadow-lg z-40 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">Editor Activo</span>
              
              <div className="flex gap-2">
                <button
                  onClick={addNewTextElement}
                  className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 text-sm flex items-center"
                  title="Agregar texto"
                >
                  <i className="fa-solid fa-font mr-1"></i>
                  Texto
                </button>
                
                <button
                  onClick={addNewCardElement}
                  className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700 text-sm flex items-center"
                  title="Agregar tarjeta"
                >
                  <i className="fa-solid fa-square mr-1"></i>
                  Tarjeta
                </button>
                
                <button
                  onClick={duplicateElement}
                  className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700 text-sm flex items-center"
                  title="Duplicar elemento"
                  disabled={!selectedElement}
                >
                  <i className="fa-solid fa-copy mr-1"></i>
                  Duplicar
                </button>
                
                <button
                  onClick={deleteElement}
                  className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm flex items-center"
                  title="Eliminar elemento"
                  disabled={!selectedElement}
                >
                  <i className="fa-solid fa-trash mr-1"></i>
                  Eliminar
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                {selectedElement ? `Seleccionado: ${selectedElement.id}` : 'Haz clic en un elemento para editarlo'}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={saveAllChanges}
                  className="px-3 py-1 bg-green-600 rounded hover:bg-green-700 text-sm flex items-center"
                  title="Guardar todo"
                >
                  <i className="fa-solid fa-save mr-1"></i>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel Editor Lateral */}
      {isEditing && selectedElement && (
        <div className="fixed right-4 top-24 bg-white rounded-2xl shadow-xl z-50 w-80 border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Editor de Elemento</h3>
            <button 
              onClick={() => setSelectedElement(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenido:</label>
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                onBlur={applyElementContent}
                className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500"
                placeholder="Escribe tu contenido aquí..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enlace:</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onBlur={applyLink}
                  className="flex-1 p-2 border rounded"
                  placeholder="https://..."
                />
                <button
                  onClick={removeLink}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Quitar enlace"
                >
                  <i className="fa-solid fa-unlink"></i>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posición X:</label>
                <input
                  type="number"
                  value={parseInt(selectedElement.style.left || 0)}
                  onChange={(e) => {
                    selectedElement.style.left = `${e.target.value}px`
                    saveElementData()
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posición Y:</label>
                <input
                  type="number"
                  value={parseInt(selectedElement.style.top || 0)}
                  onChange={(e) => {
                    selectedElement.style.top = `${e.target.value}px`
                    saveElementData()
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño de texto:</label>
              <select 
                onChange={(e) => applyElementStyle('fontSize', e.target.value)}
                value={elementStyle.fontSize || '16px'}
                className="w-full p-2 border rounded"
              >
                <option value="12px">Pequeño (12px)</option>
                <option value="14px">Normal (14px)</option>
                <option value="16px">Mediano (16px)</option>
                <option value="18px">Largo (18px)</option>
                <option value="24px">Grande (24px)</option>
                <option value="32px">Título (32px)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Color de texto:</label>
              <input
                type="color"
                onChange={(e) => applyElementStyle('color', e.target.value)}
                value={elementStyle.color || '#000000'}
                className="w-full h-10 border rounded"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alineación:</label>
              <div className="flex gap-2">
                {['left', 'center', 'right', 'justify'].map(align => (
                  <button
                    key={align}
                    onClick={() => applyElementStyle('textAlign', align)}
                    className={`p-2 border rounded ${
                      elementStyle.textAlign === align ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                    }`}
                    title={`Alinear ${align}`}
                  >
                    <i className={`fa-solid fa-align-${align}`}></i>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Estilo de texto:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => applyElementStyle('fontWeight', elementStyle.fontWeight === 'bold' ? 'normal' : 'bold')}
                  className={`p-2 border rounded ${
                    elementStyle.fontWeight === 'bold' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                  }`}
                  title="Negrita"
                >
                  <i className="fa-solid fa-bold"></i>
                </button>
                <button
                  onClick={() => applyElementStyle('fontStyle', elementStyle.fontStyle === 'italic' ? 'normal' : 'italic')}
                  className={`p-2 border rounded ${
                    elementStyle.fontStyle === 'italic' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                  }`}
                  title="Cursiva"
                >
                  <i className="fa-solid fa-italic"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Iniciar sesión</h2>
              <button 
                onClick={() => {
                  setShowLoginModal(false)
                  setError(null)
                  setEmail('')
                  setPassword('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="p-6">
              {error && <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">{error}</div>}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loginLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-70"
              >
                {loginLoading ? 'Iniciando sesión...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
