// contexts/EditContext.jsx
'use client'
import { createContext, useContext, useState } from 'react'

const EditContext = createContext()

export function EditProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draggedElement, setDraggedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  
  return (
    <EditContext.Provider value={{ 
      isEditing, 
      setIsEditing,
      draggedElement,
      setDraggedElement,
      isDragging,
      setIsDragging
    }}>
      {children}
    </EditContext.Provider>
  )
}

export const useEdit = () => useContext(EditContext)
