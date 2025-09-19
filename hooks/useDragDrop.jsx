'use client'
import { useState } from 'react'

export function useDragDrop() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleDragStart = (e, id) => {
    if (!e.target.dataset.draggable) return
    
    const rect = e.target.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, containerId) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    const element = document.getElementById(id)
    
    if (element && containerId === 'content-canvas') {
      const container = document.getElementById(containerId)
      const containerRect = container.getBoundingClientRect()
      
      // Calcular nueva posición
      const newX = e.clientX - containerRect.left - dragOffset.x
      const newY = e.clientY - containerRect.top - dragOffset.y
      
      // Aplicar límites para que no salga de los bordes
      const maxX = containerRect.width - element.offsetWidth
      const maxY = containerRect.height - element.offsetHeight
      
      element.style.position = 'absolute'
      element.style.left = `${Math.max(0, Math.min(newX, maxX))}px`
      element.style.top = `${Math.max(0, Math.min(newY, maxY))}px`
    }
    
    setIsDragging(false)
  }

  return {
    isDragging,
    handleDragStart,
    handleDragOver,
    handleDrop
  }
}