'use client'

export function loadSavedContent(page) {
  if (typeof window === 'undefined') return
  
  const savedContent = localStorage.getItem(`page-content-${page}`)
  if (savedContent) {
    try {
      const elements = JSON.parse(savedContent)
      
      elements.forEach(item => {
        // Buscar elemento existente
        let element = document.getElementById(item.id)
        
        // Si no existe y es un elemento nuevo, crearlo
        if (!element && item.id && item.id.startsWith('new-text-')) {
          element = document.createElement('div')
          element.id = item.id
          element.className = 'editable-text-element'
          element.setAttribute('data-editable', 'true')
          element.style.left = item.position?.left || '100px'
          element.style.top = item.position?.top || '100px'
          element.style.minWidth = '250px'
          element.style.maxWidth = '400px'
          
          document.body.appendChild(element)
        }
        
        // Aplicar contenido y estilos
        if (element) {
          element.innerHTML = item.html
          
          // Aplicar estilos
          if (item.styles) {
            Object.assign(element.style, item.styles)
          }
        }
      })
    } catch (error) {
      console.error('Error loading saved content:', error)
    }
  }
}
