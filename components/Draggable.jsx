// components/Draggable.jsx
'use client'
import { useEdit } from '../contexts/EditContext'

export default function Draggable({ 
  id, 
  children, 
  className = '', 
  onDragStart, 
  onDragOver, 
  onDrop,
  onDragEnd 
}) {
  const { isEditing } = useEdit()

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', id)
    if (onDragStart) onDragStart(id)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (onDragOver) onDragOver(id)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain')
    if (onDrop && draggedId !== id) onDrop(draggedId, id)
  }

  const handleDragEnd = () => {
    if (onDragEnd) onDragEnd()
  }

  if (!isEditing) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`${className} relative cursor-move transition-transform duration-200`}
    >
      {children}
      <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
        <i className="fa-solid fa-grip-vertical text-white text-xs"></i>
      </div>
    </div>
  )
}
