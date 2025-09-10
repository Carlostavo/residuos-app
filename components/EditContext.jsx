import { createContext, useContext, useState } from 'react'
const EditContext = createContext()
export function EditProvider({ children }){
  const [editMode, setEditMode] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)
  return <EditContext.Provider value={{ editMode, setEditMode, selectedId, setSelectedId, showSidebar, setShowSidebar }}>{children}</EditContext.Provider>
}
export function useEdit(){ return useContext(EditContext) }
