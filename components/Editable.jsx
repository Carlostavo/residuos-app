// components/Editable.jsx
'use client'
import { useState } from 'react'
import { useEdit } from '../contexts/EditContext'

export default function Editable({ 
  tag: Tag = 'span', 
  value, 
  onChange, 
  className = '',
  placeholder = 'Escribe aquí...',
  ...props 
}) {
  const { isEditing } = useEdit()
  const [isEditingLocal, setIsEditingLocal] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)

  const handleSave = () => {
    onChange(currentValue)
    setIsEditingLocal(false)
  }

  const handleCancel = () => {
    setCurrentValue(value)
    setIsEditingLocal(false)
  }

  if (isEditing && isEditingLocal) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          className={`border border-gray-300 rounded px-2 py-1 ${className}`}
          autoFocus
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          {...props}
        />
      </div>
    )
  }

  return (
    <div className="relative group">
      <Tag 
        className={`${className} ${isEditing ? 'cursor-pointer border-dashed border-transparent hover:border-gray-300' : ''}`}
        onClick={() => isEditing && setIsEditingLocal(true)}
      >
        {value || placeholder}
      </Tag>
      {isEditing && (
        <button
          onClick={() => setIsEditingLocal(true)}
          className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <i className="fa-solid fa-pen text-xs text-gray-500"></i>
        </button>
      )}
    </div>
  )
}
