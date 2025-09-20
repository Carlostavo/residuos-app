"use client"
import { useState, useRef } from "react"
import { useEdit } from "../lib/EditContext"

export default function TextEditor({ elementId, content, onContentChange }) {
  const { isEditMode, selectText } = useEdit()
  const [isEditing, setIsEditing] = useState(false)
  const textRef = useRef(null)

  const handleMouseUp = () => {
    if (!isEditMode || !textRef.current) return

    const selection = window.getSelection()
    if (selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0)
      const selectedText = selection.toString()

      if (selectedText.trim()) {
        selectText(elementId, {
          text: selectedText,
          start: range.startOffset,
          end: range.endOffset,
        })
      }
    }
  }

  const handleDoubleClick = () => {
    if (isEditMode) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (textRef.current && onContentChange) {
      onContentChange(textRef.current.innerHTML)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      textRef.current?.blur()
    } else if (e.key === "Escape") {
      textRef.current?.blur()
    }
  }

  return (
    <div
      ref={textRef}
      className={`min-h-[40px] ${isEditing ? "ring-2 ring-blue-500" : ""}`}
      contentEditable={isEditMode && isEditing}
      suppressContentEditableWarning={true}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
