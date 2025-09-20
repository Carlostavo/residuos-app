"use client"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"

const CanvaEditContext = createContext()

export function CanvaEditProvider({ children }) {
  const [selectedElement, setSelectedElement] = useState(null)
  const [elements, setElements] = useState({})
  const [showToolbar, setShowToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [addMenuPosition, setAddMenuPosition] = useState({ x: 0, y: 0 })
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      loadPageContent(pathname)
    }
  }, [pathname])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(elements).length > 0) {
        savePageContent()
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [elements])

  const loadPageContent = async (pagePath) => {
    try {
      const pageSlug = pagePath.replace("/", "") || "inicio"
      const response = await fetch(`/api/page-content/${pageSlug}`)
      if (response.ok) {
        const data = await response.json()
        setElements(data.elements || {})
      }
    } catch (error) {
      console.error("Error loading page content:", error)
    }
  }

  const savePageContent = async () => {
    try {
      const pageSlug = pathname.replace("/", "") || "inicio"
      await fetch(`/api/page-content/${pageSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elements }),
      })
    } catch (error) {
      console.error("Error saving page content:", error)
    }
  }

  const selectElement = useCallback((elementId, event) => {
    if (event) {
      event.stopPropagation()
      const rect = event.currentTarget.getBoundingClientRect()
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 60,
      })
    }
    setSelectedElement(elementId)
    setShowToolbar(true)
    setShowAddMenu(false)
  }, [])

  const deselectElement = useCallback(() => {
    setSelectedElement(null)
    setShowToolbar(false)
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  const updateElement = useCallback((elementId, updates) => {
    setElements((prev) => ({
      ...prev,
      [elementId]: { ...prev[elementId], ...updates },
    }))
  }, [])

  const addElement = useCallback((type, position) => {
    const elementId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newElement = {
      id: elementId,
      type,
      x: position.x,
      y: position.y,
      width: type === "text" ? 200 : type === "image" ? 300 : 250,
      height: type === "text" ? 40 : type === "image" ? 200 : 150,
      content: type === "text" ? "Nuevo texto" : type === "image" ? "" : "Nuevo elemento",
      style: {
        fontSize: type === "text" ? "16px" : "14px",
        fontWeight: "normal",
        color: "#000000",
        backgroundColor: type === "card" ? "#ffffff" : "transparent",
        borderRadius: type === "card" ? "8px" : "0px",
        border: type === "card" ? "1px solid #e5e7eb" : "none",
        padding: type === "card" ? "16px" : "0px",
      },
    }

    setElements((prev) => ({ ...prev, [elementId]: newElement }))
    setSelectedElement(elementId)
    setShowAddMenu(false)
    setShowToolbar(true)
  }, [])

  const removeElement = useCallback(
    (elementId) => {
      setElements((prev) => {
        const newElements = { ...prev }
        delete newElements[elementId]
        return newElements
      })
      deselectElement()
    },
    [deselectElement],
  )

  const duplicateElement = useCallback(
    (elementId) => {
      const element = elements[elementId]
      if (element) {
        const newId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const duplicated = {
          ...element,
          id: newId,
          x: element.x + 20,
          y: element.y + 20,
        }
        setElements((prev) => ({ ...prev, [newId]: duplicated }))
        setSelectedElement(newId)
      }
    },
    [elements],
  )

  const showAddElementMenu = useCallback((event) => {
    event.preventDefault()
    setAddMenuPosition({ x: event.clientX, y: event.clientY })
    setShowAddMenu(true)
    setShowToolbar(false)
    setSelectedElement(null)
  }, [])

  const value = {
    selectedElement,
    elements,
    showToolbar,
    toolbarPosition,
    isDragging,
    dragOffset,
    isResizing,
    showAddMenu,
    addMenuPosition,
    selectElement,
    deselectElement,
    updateElement,
    addElement,
    removeElement,
    duplicateElement,
    showAddElementMenu,
    setIsDragging,
    setDragOffset,
    setIsResizing,
    setShowAddMenu,
    setToolbarPosition,
  }

  return <CanvaEditContext.Provider value={value}>{children}</CanvaEditContext.Provider>
}

export function useCanvaEdit() {
  const context = useContext(CanvaEditContext)
  if (!context) {
    throw new Error("useCanvaEdit must be used within a CanvaEditProvider")
  }
  return context
}
