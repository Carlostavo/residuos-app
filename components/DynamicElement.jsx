"use client"
import { useEdit } from "../lib/EditContext"
import EditableElement from "./EditableElement"

export default function DynamicElement({ elementId }) {
  const { elements, isEditMode, selectedElement, removeElement } = useEdit()
  const element = elements[elementId]

  if (!element) return null

  const renderContent = () => {
    switch (element.type) {
      case "text":
        return (
          <div
            className="p-3 bg-white rounded-lg border-2 border-transparent hover:border-blue-200 transition-all duration-200 min-h-[40px] cursor-text"
            style={{
              boxShadow:
                isEditMode && selectedElement === elementId ? "0 0 0 2px #3b82f6" : "0 1px 3px rgba(0,0,0,0.1)",
              outline: "none",
            }}
            contentEditable={isEditMode}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        )

      case "image":
        return (
          <div className="relative group">
            <img
              src={element.src || "/placeholder.svg"}
              alt={element.alt || "Imagen"}
              className="max-w-full h-auto rounded-lg shadow-sm"
              style={{ maxWidth: element.style?.maxWidth || "300px" }}
            />
            {isEditMode && selectedElement === elementId && (
              <button
                onClick={() => removeElement(elementId)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
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
          <div className="relative group">
            <iframe
              src={getVideoEmbedUrl(element.src)}
              className="rounded-lg shadow-sm"
              style={{
                width: element.style?.width || "400px",
                height: element.style?.height || "225px",
              }}
              frameBorder="0"
              allowFullScreen
            />
            {isEditMode && selectedElement === elementId && (
              <button
                onClick={() => removeElement(elementId)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        )

      case "link":
        return (
          <a
            href={isEditMode ? "#" : element.href}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            target={isEditMode ? "_self" : "_blank"}
            rel="noopener noreferrer"
            onClick={(e) => isEditMode && e.preventDefault()}
            contentEditable={isEditMode}
            suppressContentEditableWarning={true}
          >
            {element.text}
          </a>
        )

      case "card":
        return (
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border relative group">
            {isEditMode && selectedElement === elementId && (
              <button
                onClick={() => removeElement(elementId)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
              >
                ×
              </button>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className={`fa-solid ${element.icon} text-blue-600 text-xl`}></i>
              </div>
              <h3
                className="text-xl font-semibold text-gray-800"
                contentEditable={isEditMode}
                suppressContentEditableWarning={true}
              >
                {element.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4" contentEditable={isEditMode} suppressContentEditableWarning={true}>
              {element.description}
            </p>
            {element.link && element.link !== "#" && (
              <a
                href={isEditMode ? "#" : element.link}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                onClick={(e) => isEditMode && e.preventDefault()}
                contentEditable={isEditMode}
                suppressContentEditableWarning={true}
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

  return (
    <div
      className="dynamic-element"
      style={{
        position: isEditMode ? "absolute" : "static",
        left: isEditMode ? `${element.x || 0}px` : "auto",
        top: isEditMode ? `${element.y || 0}px` : "auto",
        zIndex: isEditMode ? 10 : "auto",
        outline: "none",
        ...element.style,
      }}
    >
      <EditableElement elementId={elementId} draggable={isEditMode}>
        {renderContent()}
      </EditableElement>
    </div>
  )
}
