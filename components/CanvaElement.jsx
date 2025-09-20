"use client"
import { useCanvaEdit } from "@/lib/CanvaEditContext"
import { useState, useRef, useEffect } from "react"

export default function CanvaElement({ elementId }) {
  const {
    elements,
    selectedElement,
    selectElement,
    updateElement,
    isDragging,
    setIsDragging,
    dragOffset,
    setDragOffset,
  } = useCanvaEdit()

  const [isLocalDragging, setIsLocalDragging] = useState(false)
  const elementRef = useRef(null)
  const element = elements[elementId]

  const isSelected = selectedElement === elementId

  const handleMouseDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return

    e.preventDefault()
    e.stopPropagation()

    selectElement(elementId, e)
    setIsLocalDragging(true)
    setIsDragging(true)

    const rect = elementRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isLocalDragging || !isDragging) return

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      updateElement(elementId, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsLocalDragging(false)
      setIsDragging(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isLocalDragging, isDragging, dragOffset, elementId, updateElement])

  const renderContent = () => {
    switch (element.type) {
      case "text":
        return (
          <div
            style={{
              ...element.style,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {element.content || "Nuevo texto"}
          </div>
        )

      case "image":
        return element.content ? (
          <img
            src={element.content || "/placeholder.svg"}
            alt="Imagen"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: element.style?.borderRadius || "0px",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          />
        ) : (
          <div
            style={{
              ...element.style,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f3f4f6",
              border: "2px dashed #d1d5db",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <span className="text-gray-500 text-sm">Imagen</span>
          </div>
        )

      case "video":
        return element.content ? (
          <iframe
            src={
              element.content.includes("youtube.com") ? element.content.replace("watch?v=", "embed/") : element.content
            }
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: element.style?.borderRadius || "0px",
            }}
            allowFullScreen
          />
        ) : (
          <div
            style={{
              ...element.style,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f3f4f6",
              border: "2px dashed #d1d5db",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <span className="text-gray-500 text-sm">Video</span>
          </div>
        )

      case "card":
        return (
          <div
            style={{
              ...element.style,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {element.content || "Nueva tarjeta"}
          </div>
        )

      default:
        return <div>Elemento desconocido</div>
    }
  }

  return (
    <div
      ref={elementRef}
      className={`absolute select-none ${isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: isSelected ? 1000 : 1,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderContent()}

      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
        </>
      )}
    </div>
  )
}
