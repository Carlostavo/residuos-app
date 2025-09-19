'use client'
import { createContext, useContext, useState } from 'react'

const EditContext = createContext()

export function EditProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)

  return (
    <EditContext.Provider value={{ isEditing, setIsEditing, selectedElement, setSelectedElement }}>
      {children}
    </EditContext.Provider>
  )
}

export const useEdit = () => {
  const context = useContext(EditContext)
  if (!context) {
    throw new Error('useEdit debe ser usado dentro de un EditProvider')
  }
  return context
}