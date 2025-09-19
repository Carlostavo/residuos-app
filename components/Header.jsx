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
  const [activeTool, setActiveTool] = useState('select')
  const [showStylePanel, setShowStylePanel] = useState(true)
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
    } else if (e.target.closest('.content-canvas') && !e.target.closest('.canvas-element')) {
      setSelectedElement(null)
    }
  }

  const handleMouseDown = (e) => {
    if (!isEditing || activeTool !== 'select') return
    
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
    
    const style = window.getComputedStyle(element)
    setElementStyle({
      fontSize: style.fontSize,
      color: style.color,
      fontWeight: style.fontWeight,
      textAlign: style.textAlign,
      backgroundColor: style.backgroundColor,
      fontStyle: style.fontStyle,
      textDecoration: style.textDecoration
    })
    
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

  const toggleTextStyle = (property, value) => {
    if (selectedElement) {
      const currentValue = selectedElement.style[property]
      selectedElement.style[property] = currentValue === value ? '' : value
      setElementStyle(prev => ({ ...prev, [property]: currentValue === value ? '' : value }))
      saveElementData()
    }
  }

  const applyLink = () => {
    if (selectedElement && linkUrl) {
      let link = selectedElement.querySelector('a')
      if (link) {
        link.href = linkUrl
      } else {
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
        backgroundColor: selectedElement.style.backgroundColor,
        fontStyle: selectedElement.style.fontStyle,
        textDecoration: selectedElement.style.textDecoration
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
      const page = pathname
      const savedData = localStorage.getItem(`canvas-data-${page}`)
      let elementsData = savedData ? JSON.parse(savedData) : {}
      
      elementsData[element.id] = {
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
          backgroundColor: element.style.backgroundColor,
          fontStyle: element.style.fontStyle,
          textDecoration: element.style.textDecoration
        }
      }
      
      localStorage.setItem(`canvas-data-${page}`, JSON.stringify(elementsData))
    })
    
    // Mostrar notificación de éxito
    showNotification('Cambios guardados exitosamente', 'success')
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
    newElement.style.padding = '16px'
    newElement.style.backgroundColor = '#ffffff'
    newElement.style.borderRadius = '8px'
    newElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
    newElement.style.fontSize = '16px'
    newElement.style.color = '#374151'
    
    document.querySelector('.content-canvas').appendChild(newElement)
    selectElement(newElement)
    setActiveTool('select')
  }

  const addNewCardElement = () => {
    const newId = `card-element-${Date.now()}`
    const newElement = document.createElement('div')
    newElement.id = newId
    newElement.className = 'canvas-element'
    newElement.innerHTML = `
      <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <i class="fa-solid fa-star text-blue-600"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800">Nueva Tarjeta</h3>
        <p class="text-gray-600 mt-2">Descripción de la tarjeta personalizable</p>
      </div>
    `
    newElement.style.position = 'absolute'
    newElement.style.left = '150px'
    newElement.style.top = '150px'
    newElement.style.width = '300px'
    
    document.querySelector('.content-canvas').appendChild(newElement)
    selectElement(newElement)
    setActiveTool('select')
  }

  const duplicateElement = () => {
    if (selectedElement) {
      const newId = `${selectedElement.id}-copy-${Date.now()}`
      const newElement = selectedElement.cloneNode(true)
      newElement.id = newId
      newElement.style.left = `${parseInt(selectedElement.style.left || 0) + 30}px`
      newElement.style.top = `${parseInt(selectedElement.style.top || 0) + 30}px`
      
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
      showNotification('Elemento eliminado', 'info')
    }
  }

  const showNotification = (message, type = 'info') => {
    // Crear notificación
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-60 transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-600 text-white' :
      type === 'error' ? 'bg-red-600 text-white' :
      'bg-blue-600 text-white'
    }`
    notification.textContent = message
    notification.style.transform = 'translateX(100%)'
    
    document.body.appendChild(notification)
    
    // Animación de entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 10)
    
    // Animación de salida después de 3 segundos
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  const exportDesign = () => {
    const page = pathname
    const savedData = localStorage.getItem(`canvas-data-${page}`)
    if (savedData) {
      const dataStr = JSON.stringify(JSON.parse(savedData), null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `design-${page.replace('/', '')}-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      
      showNotification('Diseño exportado exitosamente', 'success')
    }
  }

  const importDesign = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const designData = JSON.parse(e.target.result)
          const page = pathname
          localStorage.setItem(`canvas-data-${page}`, JSON.stringify(designData))
          window.location.reload()
          showNotification('Diseño importado exitosamente', 'success')
        } catch (error) {
          showNotification('Error al importar el diseño', 'error')
        }
      }
      reader.readAsText(file)
    }
    // Reset input
    event.target.value = ''
  }

  return (
    <>
      <header className="topbar flex justify-between items-center p-4 bg-white shadow-md sticky top-0 z-50">
        <div className="brand flex items-center gap-2 text-green-700 font-bold">
          <i className="fa-solid fa-recycle text-xl"></i>
          <span className="text-lg">Gestión RS</span>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/inicio" className="hover:text-green-600 transition-colors">Inicio</Link>
          <Link href="/indicadores" className="hover:text-green-600 transition-colors">Indicadores</Link>
          <Link href="/metas" className="hover:text-green-600 transition-colors">Metas</Link>
          <Link href="/avances" className="hover:text-green-600 transition-colors">Avances</Link>
          <Link href="/reportes" className="hover:text-green-600 transition-colors">Reportes</Link>
          <Link href="/formularios" className="hover:text-green-600 transition-colors">Formularios</Link>

          {loading ? (
            <div className="ml-4 px-4 py-2 bg-gray-200 text-gray-600 rounded-full animate-pulse">
              Cargando...
            </div>
          ) : session ? (
            <>
              {(role === 'admin' || role === 'tecnico') && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleEditMode}
                    className={`ml-4 px-5 py-2.5 rounded-full transition-all duration-300 ${
                      isEditing ? 'bg-blue-600 shadow-lg' : 'bg-green-600 hover:bg-green-700'
                    } text-white flex items-center shadow-md hover:shadow-lg`}
                  >
                    <i className={`fa-solid ${isEditing ? 'fa-xmark' : 'fa-pen'} mr-2`}></i>
                    {isEditing ? 'Salir Editor' : 'Modo Edición'}
                  </button>
                  
                  {isEditing && (
                    <>
                      <button
                        onClick={saveAllChanges}
                        className="px-4 py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                        title="Guardar todo"
                      >
                        <i className="fa-solid fa-floppy-disk mr-2"></i>
                        Guardar
                      </button>
                      
                      <div className="relative group">
                        <button className="px-4 py-2.5 bg-gray-600 text-white rounded-full hover:bg-gray-700 flex items-center shadow-md hover:shadow-lg transition-all duration-300">
                          <i className="fa-solid fa-download mr-2"></i>
                          Exportar/Importar
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                          <button
                            onClick={exportDesign}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg flex items-center"
                          >
                            <i className="fa-solid fa-file-export mr-3 text-blue-600"></i>
                            Exportar diseño
                          </button>
                          <label className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-lg flex items-center cursor-pointer">
                            <i className="fa-solid fa-file-import mr-3 text-green-600"></i>
                            Importar diseño
                            <input
                              type="file"
                              accept=".json"
                              onChange={importDesign}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 flex items-center shadow-md hover:shadow-lg transition-all duration-300"
              >
                <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="ml-4 px-4 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center shadow-md hover:shadow-lg transition-all duration-300"
            >
              <i className="fa-solid fa-right-to-bracket mr-2"></i>
              Iniciar sesión
            </button>
          )}
        </nav>
      </header>

      {/* Barra de herramientas profesional fija */}
      {isEditing && (
        <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl z-40 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-semibold text-gray-200 flex items-center">
                <i className="fa-solid fa-palette mr-2 text-blue-400"></i>
                Editor de Diseño
              </span>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveTool('select')}
                  className={`toolbar-btn ${activeTool === 'select' ? 'bg-blue-600 shadow-inner' : 'bg-gray-700 hover:bg-gray-600'}`}
                  title="Seleccionar y mover"
                >
                  <i className="fa-solid fa-mouse-pointer"></i>
                  <span>Seleccionar</span>
                </button>
                
                <button
                  onClick={addNewTextElement}
                  className="toolbar-btn bg-gray-700 hover:bg-gray-600"
                  title="Agregar texto"
                >
                  <i className="fa-solid fa-font"></i>
                  <span>Texto</span>
                </button>
                
                <button
                  onClick={addNewCardElement}
                  className="toolbar-btn bg-gray-700 hover:bg-gray-600"
                  title="Agregar tarjeta"
                >
                  <i className="fa-solid fa-square"></i>
                  <span>Tarjeta</span>
                </button>
                
                <button
                  onClick={duplicateElement}
                  className="toolbar-btn bg-gray-700 hover:bg-gray-600"
                  title="Duplicar elemento"
                  disabled={!selectedElement}
                >
                  <i className="fa-solid fa-copy"></i>
                  <span>Duplicar</span>
                </button>
                
                <button
                  onClick={deleteElement}
                  className="toolbar-btn bg-red-600 hover:bg-red-700"
                  title="Eliminar elemento"
                  disabled={!selectedElement}
                >
                  <i className="fa-solid fa-trash"></i>
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full">
                {selectedElement ? `Editando: ${selectedElement.id.replace(/-/g, ' ')}` : 'Selecciona un elemento'}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStylePanel(!showStylePanel)}
                  className="toolbar-btn bg-gray-700 hover:bg-gray-600"
                  title="Alternar panel de estilos"
                >
                  <i className={`fa-solid ${showStylePanel ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  <span>Estilos</span>
                </button>
                
                <button
                  onClick={resetCanvas}
                  className="toolbar-btn bg-amber-600 hover:bg-amber-700"
                  title="Restablecer diseño"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                  <span>Resetear</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel Editor Lateral Avanzado */}
      {isEditing && selectedElement && showStylePanel && (
        <div className="fixed right-6 top-28 bg-white rounded-2xl shadow-2xl z-50 w-88 border border-gray-200 transform transition-all duration-300">
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 text-lg">
                <i className="fa-solid fa-sliders mr-2 text-blue-600"></i>
                Editor de Estilos
              </h3>
              <button 
                onClick={() => setSelectedElement(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Personaliza tu elemento seleccionado</p>
          </div>
          
          <div className="p-5 max-h-96 overflow-y-auto">
            {/* Contenido */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 uppercase text-xs tracking-wide">Contenido:</label>
              <textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                onBlur={applyElementContent}
                className="w-full h-28 p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Escribe tu contenido aquí..."
              />
            </div>
            
            {/* Enlaces */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 uppercase text-xs tracking-wide">Enlace:</label>
              <div className="flex gap-2 items-center">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onBlur={applyLink}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://ejemplo.com"
                />
                <button
                  onClick={removeLink}
                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                  title="Quitar enlace"
                >
                  <i className="fa-solid fa-unlink text-lg"></i>
                </button>
              </div>
            </div>

            {/* Posición */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase text-xs tracking-wide">Posición X:</label>
                <div className="relative">
                  <input
                    type="number"
                    value={parseInt(selectedElement.style.left || 0)}
                    onChange={(e) => {
                      selectedElement.style.left = `${e.target.value}px`
                      saveElementData()
                    }}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all duration-200"
                  />
                  <span className="absolute right-3 top-3 text-gray-400">px</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 uppercase text-xs tracking-wide">Posición Y:</label>
                <div className="relative">
                  <input
                    type="number"
                    value={parseInt(selectedElement.style.top || 0)}
                    onChange={(e) => {
                      selectedElement.style.top = `${e.target.value}px`
                      saveElementData()
                    }}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all duration-200"
                  />
                  <span className="absolute right-3 top-3 text-gray-400">px</span>
                </div>
              </div>
            </div>

            {/* Grupo de estilos de texto */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 uppercase text-xs tracking-wide">Tamaño de texto:</label>
                <select 
                  onChange={(e) => applyElementStyle('fontSize', e.target.value)}
                  value={elementStyle.fontSize || '16px'}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="12px">Pequeño (12px)</option>
                  <option value="14px">Normal (14px)</option>
                  <option value="16px">Mediano (16px)</option>
                  <option value="18px">Largo (18px)</option>
                  <option value="20px">Subtítulo (20px)</option>
                  <option value="24px">Título (24px)</option>
                  <option value="32px">Principal (32px)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 uppercase text-xs tracking-wide">Color de texto:</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    onChange={(e) => applyElementStyle('color', e.target.value)}
                    value={elementStyle.color || '#000000'}
                    className="w-12 h-12 border-2 border-gray-200 rounded-xl cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    value={elementStyle.color || '#000000'}
                    onChange={(e) => applyElementStyle('color', e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            {/* Estilos de texto */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 uppercase text-xs tracking-wide">Estilo de texto:</label>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => toggleTextStyle('fontWeight', 'bold')}
                  className={`p-3 border-2 rounded-xl transition-all duration-200 ${
                    elementStyle.fontWeight === 'bold' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Negrita"
                >
                  <i className="fa-solid fa-bold text-lg"></i>
                </button>
                
                <button
                  onClick={() => toggleTextStyle('fontStyle', 'italic')}
                  className={`p-3 border-2 rounded-xl transition-all duration-200 ${
                    elementStyle.fontStyle === 'italic' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Cursiva"
                >
                  <i className="fa-solid fa-italic text-lg"></i>
                </button>
                
                <button
                  onClick={() => toggleTextStyle('textDecoration', 'underline')}
                  className={`p-3 border-2 rounded-xl transition-all duration-200 ${
                    elementStyle.textDecoration === 'underline' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Subrayado"
                >
                  <i className="fa-solid fa-underline text-lg"></i>
                </button>
                
                <button
                  onClick={() => {
                    const align = elementStyle.textAlign === 'left' ? 'center' : 
                                 elementStyle.textAlign === 'center' ? 'right' : 'left'
                    applyElementStyle('textAlign', align)
                  }}
                  className={`p-3 border-2 rounded-xl transition-all duration-200 ${
                    elementStyle.textAlign === 'left' ? 'border-gray-200' :
                    elementStyle.textAlign === 'center' ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-md' :
                    'bg-blue-100 border-blue-500 text-blue-700 shadow-md'
                  }`}
                  title="Alineación"
                >
                  <i className={`fa-solid fa-align-${elementStyle.textAlign || 'left'} text-lg`}></i>
                </button>
              </div>
            </div>

            {/* Fondo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 uppercase text-xs tracking-wide">Color de fondo:</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  onChange={(e) => applyElementStyle('backgroundColor', e.target.value)}
                  value={elementStyle.backgroundColor || '#ffffff'}
                  className="w-12 h-12 border-2 border-gray-200 rounded-xl cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  value={elementStyle.backgroundColor || '#ffffff'}
                  onChange={(e) => applyElementStyle('backgroundColor', e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedElement(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cerrar
              </button>
              <button
                onClick={saveElementContent}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                Aplicar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-95 animate-in fade-in-90">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-2xl font-bold text-gray-800">
                <i className="fa-solid fa-key mr-3 text-blue-600"></i>
                Iniciar sesión
              </h2>
              <button 
                onClick={() => {
                  setShowLoginModal(false)
                  setError(null)
                  setEmail('')
                  setPassword('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
                  <i className="fa-solid fa-circle-exclamation mr-3 text-red-600"></i>
                  {error}
                </div>
              )}
              
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fa-solid fa-envelope mr-2 text-blue-600"></i>
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fa-solid fa-lock mr-2 text-blue-600"></i>
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-70 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loginLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket mr-2"></i>
                    Entrar
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
