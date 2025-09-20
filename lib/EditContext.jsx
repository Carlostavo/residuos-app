"use client"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"

const EditContext = createContext()

export function EditProvider({ children }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedElement, setSelectedElement] = useState(null)
  const [editHistory, setEditHistory] = useState([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const [elements, setElements] = useState({})
  const [originalElements, setOriginalElements] = useState({})
  const [selectedText, setSelectedText] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      loadPageContent(pathname)
    }
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEditMode) return

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "s":
            e.preventDefault()
            saveChanges()
            break
          case "Delete":
          case "Backspace":
            if (selectedElement) {
              e.preventDefault()
              removeElement(selectedElement)
            }
            break
        }
      }

      if (e.key === "Delete" && selectedElement) {
        e.preventDefault()
        removeElement(selectedElement)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isEditMode, selectedElement])

  const loadPageContent = async (pagePath) => {
    try {
      const pageSlug = pagePath.replace("/", "") || "inicio"
      const response = await fetch(`/api/page-content/${pageSlug}`)
      if (response.ok) {
        const data = await response.json()
        setElements(data.elements || {})
      }
    } catch (error) {
      console.error("[v0] Error loading page content:", error)
    }
  }

  const savePageContent = async () => {
    try {
      const pageSlug = pathname.replace("/", "") || "inicio"
      const response = await fetch(`/api/page-content/${pageSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ elements }),
      })

      if (response.ok) {
        console.log("[v0] Page content saved successfully")
        return true
      }
    } catch (error) {
      console.error("[v0] Error saving page content:", error)
    }
    return false
  }

  const enterEditMode = useCallback(() => {
    setOriginalElements({ ...elements })
    setIsEditMode(true)
  }, [elements])

  const exitEditMode = useCallback(() => {
    setIsEditMode(false)
    setSelectedElement(null)
    setSelectedText(null)
  }, [])

  const saveChanges = useCallback(async () => {
    const success = await savePageContent()
    if (success) {
      setOriginalElements({})
      setIsEditMode(false)
      setSelectedElement(null)
      setSelectedText(null)
    }
  }, [elements, pathname])

  const cancelChanges = useCallback(() => {
    setElements({ ...originalElements })
    setOriginalElements({})
    setIsEditMode(false)
    setSelectedElement(null)
    setSelectedText(null)
  }, [originalElements])

  const selectElement = useCallback((elementId) => {
    setSelectedElement(elementId)
    setSelectedText(null)
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
      [elementId]: {
        ...elementData,
        x: elementData.x || 50,
        y: elementData.y || 50,
      },
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

  const selectText = useCallback((elementId, selection) => {
    setSelectedText({ elementId, selection })
  }, [])

  const formatText = useCallback(
    (elementId, format, value) => {
      const element = elements[elementId]
      if (!element) return

      let newContent = element.content
      if (selectedText && selectedText.elementId === elementId) {
        const { start, end } = selectedText.selection
        const beforeText = newContent.substring(0, start)
        const selectedTextContent = newContent.substring(start, end)
        const afterText = newContent.substring(end)

        switch (format) {
          case "bold":
            newContent = beforeText + `<strong>${selectedTextContent}</strong>` + afterText
            break
          case "italic":
            newContent = beforeText + `<em>${selectedTextContent}</em>` + afterText
            break
          case "underline":
            newContent = beforeText + `<u>${selectedTextContent}</u>` + afterText
            break
        }
      }

      updateElement(elementId, { content: newContent })
    },
    [elements, selectedText, updateElement],
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
    selectedText,
    elements,
    enterEditMode,
    exitEditMode,
    saveChanges,
    cancelChanges,
    selectElement,
    selectText,
    updateElement,
    addElement,
    removeElement,
    formatText,
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
