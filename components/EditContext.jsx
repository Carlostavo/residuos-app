import { createContext, useContext, useState } from 'react'

const EditContext = createContext()

export function EditProvider({ children }){
  const [editMode, setEditMode] = useState(false)
  return (
    <EditContext.Provider value={{ editMode, setEditMode }}>
      {children}
    </EditContext.Provider>
  )
}

export function useEdit(){ return useContext(EditContext) }
