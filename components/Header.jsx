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
  const [showEditorPanel, setShowEditorPanel] = useState(false)
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
    setShowEditorPanel(false)
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
    } else if (e.target.closest('.content-canvas') && !e.target.closest('.canvas-element')) {
      // Click en el canvas vacío - deseleccionar
      setSelectedElement(null)
      setShowEditorPanel(false)
    }
  }

  const handleMouseDown = (e) => {
    if (!isEditing) return
    
    const element = e.target.closest('.canvas-element')
    if (element && e.button === 0) { // Solo botón izquierdo
      // No iniciar drag si se hace clic en un enlace o botón
      if (e.target.closest('a, button')) return
      
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
    
    // Aplicar movimiento con precisión
    dragInfo.current.element.style.left = `${newLeft}px`
    dragInfo.current.element.style.top = `${newTop}px`
  }

  const handleMouseUp = () => {
    if (dragInfo.current.isDragging) {
      dragInfo.current.element.classList.remove('dragging')
      document.body.style.cursor = 'default'
      
      // Guardar posición
      saveElementPosition(dragInfo.current.element.id, {
        left: dragInfo.current.element.style.left,
        top: dragInfo.current.element.style.top
      })
      
      dragInfo.current = { isDragging: false, element: null, startX: 0, startY: 0, startLeft: 0, startTop: 0 }
    }
  }

  const selectElement = (element) => {
    // Deseleccionar elemento actual
    document.querySelectorAll('.canvas-element').forEach(el => {
      el.classList.remove('selected')
    })
    
    // Seleccionar nuevo elemento
    element.classList.add('selected')
    setSelectedElement(element)
    setEditorContent(element.textContent || element.innerHTML)
    setShowEditorPanel(true)
  }

  const saveElementContent = () => {
    if (selectedElement) {
      selectedElement.innerHTML = editorContent
      saveElementData(selectedElement.id, {
        content: editorContent,
        position: {
          left: selectedElement.style.left,
          top: selectedElement.style.top
        }
      })
    }
  }

  const saveElementData = (id, data) => {
    const page = pathname
    const savedData = localStorage.getItem(`canvas-data-${page}`)
    let elementsData = savedData ? JSON.parse(savedData) : {}
    
    elementsData[id] = data
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
        }
      })
    }
  }

  const saveAllChanges = () => {
    document.querySelectorAll('.canvas-element').forEach(element => {
      saveElementData(element.id, {
        content: element.innerHTML,
        position: {
          left: element.style.left,
          top: element.style.top
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
    
    document.querySelector('.content-canvas').appendChild(newElement)
    selectElement(newElement)
  }

  const updateElementStyle = (property, value) => {
    if (selectedElement) {
      selectedElement.style[property] = value
      saveElementData(selectedElement.id, {
        content: selectedElement.innerHTML,
        position: {
          left: selectedElement.style.left,
          top: selectedElement.style.top
        }
      })
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
                        onClick={addNewTextElement}
                        className="ml-2 px-3 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 text-sm"
                      >
                        <i className="fa-solid fa-plus mr-1"></i>
                        Nuevo Texto
                      </button>
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

      {/* Panel Editor Lateral (tipo Canva) */}
      {isEditing && showEditorPanel && selectedElement && (
        <div className="fixed left-4 top-20 bg-white rounded-2xl shadow-xl z-50 w-80 border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Editor de Elemento</h3>
            <button 
              onClick={() => setShowEditorPanel(false)}
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
                className="w-full h-24 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500"
                placeholder="Escribe tu contenido aquí..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Posición:</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">X (px):</label>
                  <input
                    type="number"
                    value={parseInt(selectedElement.style.left || 0)}
                    onChange={(e) => updateElementStyle('left', `${e.target.value}px`)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Y (px):</label>
                  <input
                    type="number"
                    value={parseInt(selectedElement.style.top || 0)}
                    onChange={(e) => updateElementStyle('top', `${e.target.value}px`)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño de texto:</label>
              <select 
                onChange={(e) => updateElementStyle('fontSize', e.target.value)}
                className="w-full p-2 border rounded"
                value={selectedElement.style.fontSize || '16px'}
              >
                <option value="12px">Pequeño (12px)</option>
                <option value="14px">Normal (14px)</option>
                <option value="16px">Mediano (16px)</option>
                <option value="20px">Grande (20px)</option>
                <option value="24px">Muy Grande (24px)</option>
                <option value="32px">Título (32px)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Color de texto:</label>
              <input
                type="color"
                onChange={(e) => updateElementStyle('color', e.target.value)}
                value={selectedElement.style.color || '#000000'}
                className="w-full h-10 border rounded"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditorPanel(false)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={saveElementContent}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar de Canvas */}
      {isEditing && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-40 flex gap-2">
          <span className="flex items-center px-2">
            <i className="fa-solid fa-mouse-pointer mr-2"></i>
            Modo Edición Activo
          </span>
          <div className="h-4 w-px bg-gray-600 mx-2"></div>
          <span className="text-sm flex items-center text-gray-300">
            <i className="fa-solid fa-arrows-up-down-left-right mr-1"></i>
            Arrastra para mover
          </span>
          <span className="text-sm flex items-center text-gray-300 ml-2">
            <i className="fa-solid fa-pen mr-1"></i>
            Haz clic para editar
          </span>
        </div>
      )}
    </>
  )
}
