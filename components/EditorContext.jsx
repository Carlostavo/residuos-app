'use client'
import { createContext, useContext, useState } from 'react'

const EditorContext = createContext()
export function EditorProvider({ children }) {
  const [editMode, setEditMode] = useState(false)
  const toggleEditMode = () => setEditMode(v => !v)
  return <EditorContext.Provider value={{ editMode, toggleEditMode, setEditMode }}>{children}</EditorContext.Provider>
}
export const useEditor = () => useContext(EditorContext)
