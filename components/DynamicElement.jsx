"use client"
import { useEdit } from "../lib/EditContext"

export default function DynamicElement({ elementId }) {
  const { elements, isEditMode, selectedElement, selectElement } = useEdit()
  const element = elements[elementId]

  if (!element) return null

  const isSelected = selectedElement === elementId

  const handleClick = (e) => {
    if (isEditMode) {
      e.preventDefault()
      e.stopPropagation()
      selectElement(elementId)
    }
  }

  const baseStyle = {
    position: isEditMode ? "absolute" : "relative",
    left: isEditMode ? `${element.x || 0}px` : "auto",
    top: isEditMode ? `${element.y || 0}px` : "auto",
    zIndex: isEditMode ? 10 : "auto",
    cursor: isEditMode ? "move" : "default",
    ...element.style,
  }

  const wrapperStyle = {
    ...baseStyle,
    ...(isSelected &&
      isEditMode && {
        outline: "2px solid #3b82f6",
        outlineOffset: "2px",
      }),
  }

  // Render different element types
  switch (element.type) {
    case "text":
      return (
        <div style={wrapperStyle} onClick={handleClick} className={`${isEditMode ? "editable-element" : ""}`}>
          {element.content}
        </div>
      )

    case "image":
      return (
        <img
          src={element.src || "/placeholder.svg"}
          alt={element.alt || "Imagen"}
          style={wrapperStyle}
          onClick={handleClick}
          className={`${isEditMode ? "editable-element" : ""}`}
        />
      )

    case "video":
      const getVideoEmbedUrl = (url) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          const videoId = url.includes("youtu.be") ? url.split("/").pop() : url.split("v=")[1]?.split("&")[0]
          return `https://www.youtube.com/embed/${videoId}`
        }
        if (url.includes("vimeo.com")) {
          const videoId = url.split("/").pop()
          return `https://player.vimeo.com/video/${videoId}`
        }
        return url
      }

      return (
        <iframe
          src={getVideoEmbedUrl(element.src)}
          style={wrapperStyle}
          onClick={handleClick}
          className={`${isEditMode ? "editable-element" : ""}`}
          frameBorder="0"
          allowFullScreen
        />
      )

    case "link":
      return (
        <a
          href={element.href}
          style={wrapperStyle}
          onClick={isEditMode ? handleClick : undefined}
          className={`${isEditMode ? "editable-element" : ""}`}
          target={isEditMode ? "_self" : "_blank"}
          rel="noopener noreferrer"
        >
          {element.text}
        </a>
      )

    case "card":
      return (
        <div
          style={wrapperStyle}
          onClick={handleClick}
          className={`${isEditMode ? "editable-element" : ""} bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className={`fa-solid ${element.icon} text-blue-600 text-xl`}></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{element.title}</h3>
          </div>
          <p className="text-gray-600 mb-4">{element.description}</p>
          {element.link && element.link !== "#" && (
            <a
              href={element.link}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              onClick={(e) => isEditMode && e.preventDefault()}
            >
              Acceder
              <i className="fa-solid fa-arrow-right text-sm"></i>
            </a>
          )}
        </div>
      )

    default:
      return null
  }
}
