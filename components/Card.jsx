"use client"
import Link from "next/link"
import EditableElement from "./EditableElement"

export default function Card({
  title,
  desc,
  icon = "fa-file",
  color = "bg-gray-400",
  href,
  className = "",
  onClick,
  isEditMode = false,
}) {
  const cardContent = (
    <div
      className={`card p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 ${className} ${
        (href && !isEditMode) || onClick ? "cursor-pointer" : ""
      }`}
      onClick={isEditMode ? undefined : onClick}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${color} mb-4`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>

      {isEditMode ? (
        <>
          <EditableElement
            elementId={`card-title-${title.replace(/\s+/g, "-").toLowerCase()}`}
            type="h3"
            className="text-xl font-semibold text-gray-800 mb-2"
          >
            {title}
          </EditableElement>
          <EditableElement
            elementId={`card-desc-${title.replace(/\s+/g, "-").toLowerCase()}`}
            type="p"
            className="text-gray-600 mt-2 flex-grow"
          >
            {desc}
          </EditableElement>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mt-2 flex-grow">{desc}</p>
        </>
      )}

      {(href && !isEditMode) ||
        (onClick && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-green-600 font-medium flex items-center">
              {onClick ? "Seleccionar" : "Acceder"}
              <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
            </span>
          </div>
        ))}
    </div>
  )

  if (onClick || isEditMode) {
    return cardContent
  }

  return href ? (
    <Link href={href} className="h-full block">
      {cardContent}
    </Link>
  ) : (
    cardContent
  )
}
