// components/DraggableCard.jsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { useEdit } from '../contexts/EditContext'
import Card from './Card'

export default function DraggableCard({ 
  id,
  title, 
  desc, 
  icon, 
  color, 
  href,
  position,
  onPositionChange,
  onTitleChange,
  onDescChange
}) {
  const { isEditing, setIsDragging } = useEdit()
  const [isDraggingLocal, setIsDraggingLocal] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseDown = (e) => {
    if (!isEditing) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsDraggingLocal(true)
    setIsDragging(true)
    
    const rect = cardRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e) => {
    if (!isDraggingLocal || !isEditing) return
    
    const container = cardRef.current.parentElement
    const containerRect = container.getBoundingClientRect()
    
    const newX = e.clientX - containerRect.left - dragOffset.x
    const newY = e.clientY - containerRect.top - dragOffset.y
    
    // Limitar dentro de los bordes del contenedor
    const boundedX = Math.max(0, Math.min(newX, containerRect.width - cardRef.current.offsetWidth))
    const boundedY = Math.max(0, Math.min(newY, containerRect.height - cardRef.current.offsetHeight))
    
    onPositionChange(id, { x: boundedX, y: boundedY })
  }

  const handleMouseUp = () => {
    if (isDraggingLocal) {
      setIsDraggingLocal(false)
      setIsDragging(false)
    }
  }

  useEffect(() => {
    if (isDraggingLocal) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDraggingLocal, dragOffset])

  if (!isEditing) {
    return (
      <Card
        id={id}
        title={title}
        desc={desc}
        icon={icon}
        color={color}
        href={href}
        onTitleChange={onTitleChange}
        onDescChange={onDescChange}
      />
    )
  }

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: isDraggingLocal ? 1000 : 1,
        cursor: isDraggingLocal ? 'grabbing' : 'grab',
        transform: isDraggingLocal ? 'scale(1.05) rotate(2deg)' : 'none',
        transition: isDraggingLocal ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: isDraggingLocal 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: '300px'
      }}
      onMouseDown={handleMouseDown}
      className="draggable-card will-change-transform"
    >
      <Card
        id={id}
        title={title}
        desc={desc}
        icon={icon}
        color={color}
        href={href}
        onTitleChange={onTitleChange}
        onDescChange={onDescChange}
      />
      {isEditing && (
        <div 
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-move drag-handle"
          onMouseDown={handleMouseDown}
        >
          <i className="fa-solid fa-grip-vertical text-white text-xs"></i>
        </div>
      )}
    </div>
  )
}
