'use client'

export function loadSavedContent(page) {
  if (typeof window === 'undefined') return
  
  const savedContent = localStorage.getItem(`page-content-${page}`)
  if (savedContent) {
    try {
      const elements = JSON.parse(savedContent)
      elements.forEach(item => {
        let element = document.getElementById(item.id)
        
        if (!element && item.styles?.position === 'absolute') {
          // Crear elemento si no existe (para elementos nuevos)
          element = document.createElement(item.type || 'div')
          element.id = item.id
          element.className = item.classes || ''
          Object.assign(element.style, item.styles)
          document.body.appendChild(element)
        }
        
        if (element) {
          element.innerHTML = item.html
          Object.assign(element.style, item.styles || {})
        }
      })
    } catch (error) {
      console.error('Error loading saved content:', error)
    }
  }
}
