'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../lib/useAuth'
import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const { session, role, loading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)

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
    setShowEditor(false)
    disableEditMode()
    window.location.reload()
  }

  const handleEditClick = () => {
    if (!session) {
      setShowLoginModal(true)
      return
    }
    
    if (role === 'admin' || role === 'tecnico') {
      setShowEditor(!showEditor)
      if (!showEditor) {
        enableEditMode()
      } else {
        disableEditMode()
      }
    } else {
      alert('No tienes permisos para editar. Contacta al administrador.')
    }
  }

  const enableEditMode = () => {
    document.body.classList.add('edit-mode')
    document.querySelectorAll('.editable-content').forEach(el => {
      el.setAttribute('contenteditable', 'true')
      el.classList.add('editable-active')
      makeElementDraggable(el)
    })
  }

  const disableEditMode = () => {
    document.body.classList.remove('edit-mode')
    document.querySelectorAll('.editable-content').forEach(el => {
      el.setAttribute('contenteditable', 'false')
      el.classList.remove('editable-active')
    })
  }

  const makeElementDraggable = (element) => {
    let isDragging = false
    let offsetX, offsetY
    let originalPosition = {}

    element.addEventListener('mousedown', (e) => {
      if (e.target === element || !e.target.closest('button, a, input, textarea')) {
        isDragging = true
        originalPosition = {
          left: element.style.left || '0',
          top: element.style.top || '0'
        }
        offsetX = e.clientX - element.getBoundingClientRect().left
        offsetY = e.clientY - element.getBoundingClientRect().top
        element.style.cursor = 'grabbing'
        element.style.zIndex = '1000'
        element.classList.add('dragging')
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        element.style.position = 'relative'
        element.style.left = `${e.clientX - offsetX}px`
        element.style.top = `${e.clientY - offsetY}px`
      }
    })

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false
        element.style.cursor = 'grab'
        element.classList.remove('dragging')
        
        // Guardar posición en localStorage
        saveElementPosition(element.id, {
          left: element.style.left,
          top: element.style.top
        })
      }
    })

    // Cargar posición guardada si existe
    loadElementPosition(element.id, element)
    
    element.style.cursor = 'grab'
  }

  const saveElementPosition = (id, position) => {
    if (!id) return
    
    const page = pathname
    const savedData = localStorage.getItem(`editor-positions-${page}`)
    let positions = savedData ? JSON.parse(savedData) : {}
    
    positions[id] = position
    localStorage.setItem(`editor-positions-${page}`, JSON.stringify(positions))
  }

  const loadElementPosition = (id, element) => {
    if (!id) return
    
    const page = pathname
    const savedData = localStorage.getItem(`editor-positions-${page}`)
    if (savedData) {
      const positions = JSON.parse(savedData)
      if (positions[id]) {
        element.style.position = 'relative'
        element.style.left = positions[id].left
        element.style.top = positions[id].top
      }
    }
  }

  const saveAllContent = () => {
    document.querySelectorAll('.editable-content').forEach(el => {
      if (el.id) {
        const content = el.innerHTML
        const page = pathname
        const savedData = localStorage.getItem(`editor-content-${page}`)
        let contents = savedData ? JSON.parse(savedData) : {}
        
        contents[el.id] = content
        localStorage.setItem(`editor-content-${page}`, JSON.stringify(contents))
      }
    })
    alert('Contenido guardado correctamente')
  }

  const resetContent = () => {
    if (confirm('¿Restablecer todo el contenido? Se perderán todos los cambios.')) {
      const page = pathname
      localStorage.removeItem(`editor-content-${page}`)
      localStorage.removeItem(`editor-positions-${page}`)
      window.location.reload()
    }
  }

  return (
    <>
      <header className="topbar flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-40">
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
                    onClick={handleEditClick}
                    className={`ml-4 px-4 py-2 rounded-full ${
                      showEditor ? 'bg-blue-600' : 'bg-green-600'
                    } text-white hover:bg-opacity-90 flex items-center`}
                  >
                    <i className="fa-solid fa-pen mr-2"></i>
                    {showEditor ? 'Salir Edición' : 'Editar'}
                  </button>
                  
                  {showEditor && (
                    <>
                      <button
                        onClick={saveAllContent}
                        className="ml-2 px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
                      >
                        <i className="fa-solid fa-save mr-1"></i>
                        Guardar
                      </button>
                      <button
                        onClick={resetContent}
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
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                ¿No tienes cuenta? Regístrate desde Supabase Auth o pide a un admin.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
