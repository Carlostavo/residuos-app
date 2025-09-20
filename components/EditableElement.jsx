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
  const { isEditMode, selectedElement, selectElement, updateElement, elements, removeElement } = useEdit()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isEditing, setIsEditing] = useState(false)
  const elementRef = useRef(null)

  const isSelected = selectedElement === elementId
  const Component = type
  const elementData = elements[elementId]

  const handleClick = (e) => {
    if (!isEditMode) return

    e.preventDefault()
    e.stopPropagation()
    selectElement(elementId)

    if (e.detail === 2 && elementData?.type === "text") {
      setIsEditing(true)
    }
  }

  const handleMouseDown = (e) => {
    if (!isEditMode || isEditing) return

    e.preventDefault()
    e.stopPropagation()
    selectElement(elementId)

    if (draggable && e.button === 0) {
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

    const container = document.body
    const containerRect = container.getBoundingClientRect()

    const newX = Math.max(0, e.clientX - containerRect.left - dragStart.x)
    const newY = Math.max(0, e.clientY - containerRect.top - dragStart.y)

    updateElement(elementId, { x: newX, y: newY })
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  const handleTextEdit = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      setIsEditing(false)
      updateElement(elementId, { content: e.target.textContent })
    } else if (e.key === "Escape") {
      setIsEditing(false)
    }
  }

  const handleDeleteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    removeElement(elementId)
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
    ${isEditMode ? "editable-element" : ""}
    ${isSelected ? "editable-selected" : ""}
    ${isDragging ? "editable-dragging" : ""}
    ${isEditMode && draggable ? "cursor-move" : ""}
  `.trim()

  const style = {
    ...props.style,
    outline: "none",
    ...(elementData &&
      isEditMode && {
        position: "absolute",
        left: `${elementData.x || 0}px`,
        top: `${elementData.y || 0}px`,
        zIndex: isDragging ? 1000 : isSelected ? 100 : 10,
        ...elementData.style,
      }),
  }

  return (
    <Component
      ref={elementRef}
      className={editableClassName}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      contentEditable={isEditMode && isEditing && elementData?.type === "text"}
      onKeyDown={isEditing ? handleTextEdit : undefined}
      suppressContentEditableWarning={true}
      data-element-id={elementId}
      {...props}
    >
      {elementData?.content || children}
      {isEditMode && isSelected && (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-blue-500 pointer-events-none rounded">
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-2 pointer-events-auto">
            <span>{elementId}</span>
            <button
              onClick={handleDeleteClick}
              className="text-white hover:text-red-200 ml-1"
              title="Eliminar elemento (Delete)"
            >
              <i className="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize"></div>
        </div>
      )}
    </Component>
  )
}
