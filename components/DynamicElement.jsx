"use client"
import { useEdit } from "../lib/EditContext"
import EditableElement from "./EditableElement"

export default function DynamicElement({ elementId }) {
  const { elements, isEditMode } = useEdit()
  const element = elements[elementId]

  if (!element) return null

  const renderContent = () => {
    switch (element.type) {
      case "text":
        return <div className="p-2 bg-white rounded border shadow-sm">{element.content}</div>

      case "image":
        return (
          <img
            src={element.src || "/placeholder.svg"}
            alt={element.alt || "Imagen"}
            className="max-w-full h-auto rounded shadow-sm"
            style={{ maxWidth: element.style?.maxWidth || "300px" }}
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
            className="rounded shadow-sm"
            style={{
              width: element.style?.width || "400px",
              height: element.style?.height || "225px",
            }}
            frameBorder="0"
            allowFullScreen
          />
        )

      case "link":
        return (
          <a
            href={isEditMode ? "#" : element.href}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            target={isEditMode ? "_self" : "_blank"}
            rel="noopener noreferrer"
            onClick={(e) => isEditMode && e.preventDefault()}
          >
            {element.text}
          </a>
        )

      case "card":
        return (
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className={`fa-solid ${element.icon} text-blue-600 text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{element.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{element.description}</p>
            {element.link && element.link !== "#" && (
              <a
                href={isEditMode ? "#" : element.link}
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

  return (
    <div
      className="dynamic-element"
      style={{
        position: isEditMode ? "absolute" : "static",
        left: isEditMode ? `${element.x || 0}px` : "auto",
        top: isEditMode ? `${element.y || 0}px` : "auto",
        zIndex: isEditMode ? 10 : "auto",
        ...element.style,
      }}
    >
      <EditableElement elementId={elementId} draggable={true}>
        {renderContent()}
      </EditableElement>
    </div>
  )
}
