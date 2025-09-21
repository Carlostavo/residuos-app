'use client'
import { createContext, useContext, useState } from 'react'

const EditorContext = createContext()

export function EditorProvider({ children }) {
  const [editMode, setEditMode] = useState(false)
  
  const toggleEditMode = () => {
    setEditMode(prev => !prev)
  }

  return (
    <EditorContext.Provider value={{ editMode, toggleEditMode, setEditMode }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
