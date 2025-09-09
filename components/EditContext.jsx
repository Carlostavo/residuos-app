import { createContext, useContext, useState } from 'react'
const EditContext = createContext()
export function EditProvider({ children }){
  const [editMode, setEditMode] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  return <EditContext.Provider value={{ editMode, setEditMode, showSidebar, setShowSidebar, showGrid, setShowGrid }}>{children}</EditContext.Provider>
}
export function useEdit(){ return useContext(EditContext) }
