"use client"
import { createContext, useContext, useState, useCallback } from "react"

const EditContext = createContext()

export function EditProvider({ children }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const [editHistory, setEditHistory] = useState([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const [elements, setElements] = useState({})
  const [originalElements, setOriginalElements] = useState({})

  const enterEditMode = useCallback(() => {
    setOriginalElements({ ...elements })
    setIsEditMode(true)
  }, [elements])

  const exitEditMode = useCallback(() => {
    setIsEditMode(false)
    setSelectedElement(null)
  }, [])

  const saveChanges = useCallback(() => {
    setOriginalElements({})
    console.log("[v0] Changes saved successfully")
    setIsEditMode(false)
    setSelectedElement(null)
  }, [])

  const cancelChanges = useCallback(() => {
    setElements({ ...originalElements })
    setOriginalElements({})
    console.log("[v0] Changes canceled")
    setIsEditMode(false)
    setSelectedElement(null)
  }, [originalElements])

  const selectElement = useCallback((elementId) => {
    setSelectedElement(elementId)
  }, [])

  const updateElement = useCallback((elementId, updates) => {
    setElements((prev) => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        ...updates,
      },
    }))
  }, [])

  const addElement = useCallback((elementId, elementData) => {
    setElements((prev) => ({
      ...prev,
      [elementId]: elementData,
    }))
    setSelectedElement(elementId)
  }, [])

  const removeElement = useCallback(
    (elementId) => {
      setElements((prev) => {
        const newElements = { ...prev }
        delete newElements[elementId]
        return newElements
      })
      if (selectedElement === elementId) {
        setSelectedElement(null)
      }
    },
    [selectedElement],
  )

  const addToHistory = useCallback(
    (action) => {
      const newHistory = editHistory.slice(0, currentHistoryIndex + 1)
      newHistory.push(action)
      setEditHistory(newHistory)
      setCurrentHistoryIndex(newHistory.length - 1)
    },
    [editHistory, currentHistoryIndex],
  )

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1)
      const action = editHistory[currentHistoryIndex - 1]
      if (action && action.undo) {
        action.undo()
      }
    }
  }, [currentHistoryIndex, editHistory])

  const redo = useCallback(() => {
    if (currentHistoryIndex < editHistory.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1)
      const action = editHistory[currentHistoryIndex + 1]
      if (action && action.redo) {
        action.redo()
      }
    }
  }, [currentHistoryIndex, editHistory])

  const value = {
    isEditMode,
    selectedElement,
    elements,
    enterEditMode,
    exitEditMode,
    saveChanges,
    cancelChanges,
    selectElement,
    updateElement,
    addElement,
    removeElement,
    addToHistory,
    undo,
    redo,
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < editHistory.length - 1,
  }

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>
}

export function useEdit() {
  const context = useContext(EditContext)
  if (!context) {
    throw new Error("useEdit must be used within an EditProvider")
  }
  return context
}
