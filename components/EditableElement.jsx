"use client"
import { useState, useRef, useEffect } from "react"
import { useEdit } from "../lib/EditContext"

export default function EditableElement({
  children,
  elementId,
  type = "div",
  className = "",
  draggable = true,
  ...props
}) {
  const { isEditMode, selectedElement, selectElement, updateElement, elements } = useEdit()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const elementRef = useRef(null)

  const isSelected = selectedElement === elementId
  const Component = type
  const elementData = elements[elementId]

  const handleMouseDown = (e) => {
    if (!isEditMode) return

    e.preventDefault()
    e.stopPropagation()
    selectElement(elementId)

    if (draggable) {
      setIsDragging(true)
      const rect = elementRef.current.getBoundingClientRect()
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !isEditMode) return

    e.preventDefault()

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    // Update element position in real-time
    updateElement(elementId, { x: newX, y: newY })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragStart, elementId])

  const editableClassName = `
    ${className}
    ${isEditMode ? "editable-element cursor-move" : ""}
    ${isSelected ? "editable-selected" : ""}
    ${isDragging ? "editable-dragging" : ""}
  `.trim()

  const style = {
    ...props.style,
    ...(elementData && {
      position: isEditMode ? "absolute" : "relative",
      left: isEditMode ? `${elementData.x || 0}px` : "auto",
      top: isEditMode ? `${elementData.y || 0}px` : "auto",
      zIndex: isDragging ? 1000 : isEditMode ? 10 : "auto",
      ...elementData.style,
    }),
  }

  return (
    <Component
      ref={elementRef}
      className={editableClassName}
      style={style}
      onMouseDown={handleMouseDown}
      data-element-id={elementId}
      {...props}
    >
      {children}
      {isEditMode && isSelected && (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-blue-500 pointer-events-none rounded">
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">{elementId}</div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"></div>
        </div>
      )}
    </Component>
  )
}
