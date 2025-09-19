"use client"
import { createContext, useState, useContext } from "react"

const EditContext = createContext()

export const EditProvider = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <EditContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
    </EditContext.Provider>
  )
}

export const useEdit = () => useContext(EditContext)
