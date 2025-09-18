'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useState, useEffect } from 'react'

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

  useEffect(() => {
    // Verificar si había modo edición activo
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
  }

  const setupCanvasInteractions = () => {
    // Agregar event listeners para el canvas
    document.addEventListener('click', handleCanvasClick)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const cleanupCanvasInteractions = () => {
    // Remover event listeners
    document.removeEventListener('click', handleCanvasClick)
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleCanvasClick = (e) => {
    const element = e.target.closest('.canvas-element')
    if (element && !e.target.closest('.element-toolbar')) {
      selectElement(element)
    }
  }

  const handleMouseDown = (e) => {
    const element = e.target.closest('.canvas-element')
    if (element && isEditing) {
      startDragging(element, e)
    }
  }

  const handleMouseMove = (e) => {
    if (window.canvasDragging) {
      dragElement(e)
    }
  }

  const handleMouseUp = () => {
    if (window.canvasDragging) {
      stopDragging()
    }
  }

  const startDragging = (element, e) => {
    window.canvasDragging = true
    window.draggingElement = element
    window.dragStartX = e.clientX
    window.dragStartY = e.clientY
    window.startLeft = parseInt(element.style.left || 0)
    window.startTop = parseInt(element.style.top || 0)
    
    element.classList.add('dragging')
    document.body.style.cursor = 'grabbing'
  }

  const dragElement = (e) => {
    if (!window.draggingElement) return
    
    const dx = e.clientX - window.dragStartX
    const dy = e.clientY - window.dragStartY
    
    const newLeft = window.startLeft + dx
    const newTop = window.startTop + dy
    
    // Limitar al área del canvas
    const canvas = document.querySelector('.content-canvas')
    const canvasRect = canvas.getBoundingClientRect()
    const elementRect = window.draggingElement.getBoundingClientRect()
    
    window.draggingElement.style.left = `${Math.max(0, Math.min(newLeft, canvasRect.width - elementRect.width))}px`
    window.draggingElement.style.top = `${Math.max(0, newTop)}px`
  }

  const stopDragging = () => {
    if (window.draggingElement) {
      window.draggingElement.classList.remove('dragging')
      saveElementPosition(window.draggingElement.id, {
        left: window.draggingElement.style.left,
        top: window.draggingElement.style.top
      })
    }
    
    window.canvasDragging = false
    window.draggingElement = null
    document.body.style.cursor = 'default'
  }

  const selectElement = (element) => {
    document.querySelectorAll('.canvas-element').forEach(el => {
      el.classList.remove('selected')
    })
    element.classList.add('selected')
    setSelectedElement(element)
    setEditorContent(element.innerHTML)
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
    
    document.querySelector('.content-canvas').appendChild(newElement)
    selectElement(newElement)
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

      {/* Editor de Texto Flotante */}
      {isEditing && selectedElement && (
        <div className="fixed top-20 right-6 bg-white rounded-2xl shadow-xl z-50 w-80 border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Editor de Texto</h3>
            <button 
              onClick={() => setSelectedElement(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div className="p-4">
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500"
              placeholder="Escribe tu contenido aquí..."
            />
            
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedElement(null)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
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
