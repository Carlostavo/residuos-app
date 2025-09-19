// contexts/EditContext.jsx
'use client'
import { createContext, useContext, useState } from 'react'

const EditContext = createContext()

export function EditProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragData, setDragData] = useState(null)
  
  return (
    <EditContext.Provider value={{ 
      isEditing, 
      setIsEditing,
      isDragging,
      setIsDragging,
      dragData,
      setDragData
    }}>
      {children}
    </EditContext.Provider>
  )
}

export const useEdit = () => useContext(EditContext)
