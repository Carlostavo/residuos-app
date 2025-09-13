import { createContext, useContext, useState, useRef } from 'react'

const EditContext = createContext()

export function EditProvider({ children }){
  const [editMode, setEditMode] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  // page-level save handler: PageEditor sets this to its save+exit function
  const onExitRef = useRef(null)

  function registerOnExit(fn){ onExitRef.current = fn }
  async function exitAndSave(){ if(onExitRef.current){ try{ await onExitRef.current() }catch(e){ console.error('save failed', e); throw e } } setEditMode(false); setShowSidebar(false); setSelectedId(null) }

  return (
    <EditContext.Provider value={{ editMode, setEditMode, showSidebar, setShowSidebar, selectedId, setSelectedId, registerOnExit, exitAndSave }}>
      {children}
    </EditContext.Provider>
  )
}

export function useEdit(){ return useContext(EditContext) }
