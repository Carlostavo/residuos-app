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
  onDescChange,
  ...props 
}) {
  const { isEditing, isDragging } = useEdit()
  const [isDraggingLocal, setIsDraggingLocal] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseDown = (e) => {
    if (!isEditing) return
    
    e.preventDefault()
    setIsDraggingLocal(true)
    
    const rect = cardRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e) => {
    if (!isDraggingLocal || !isEditing) return
    
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    onPositionChange(id, { x: newX, y: newY })
  }

  const handleMouseUp = () => {
    if (isDraggingLocal) {
      setIsDraggingLocal(false)
    }
  }

  useEffect(() => {
    if (isDraggingLocal) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingLocal, dragOffset])

  if (!isEditing) {
    return (
      <div style={{ position: 'relative' }}>
        <Card
          id={id}
          title={title}
          desc={desc}
          icon={icon}
          color={color}
          href={href}
          onTitleChange={onTitleChange}
          onDescChange={onDescChange}
          {...props}
        />
      </div>
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
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onMouseDown={handleMouseDown}
      className="draggable-card"
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
        {...props}
      />
      {isEditing && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-move">
          <i className="fa-solid fa-grip-vertical text-white text-xs"></i>
        </div>
      )}
    </div>
  )
}
