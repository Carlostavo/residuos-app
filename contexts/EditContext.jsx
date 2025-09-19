// contexts/EditContext.jsx
'use client'
import { createContext, useContext, useState } from 'react'

const EditContext = createContext()

export function EditProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draggedElement, setDraggedElement] = useState(null)
  const [dragOverElement, setDragOverElement] = useState(null)
  
  return (
    <EditContext.Provider value={{ 
      isEditing, 
      setIsEditing,
      draggedElement,
      setDraggedElement,
      dragOverElement,
      setDragOverElement
    }}>
      {children}
    </EditContext.Provider>
  )
}

export const useEdit = () => useContext(EditContext)
