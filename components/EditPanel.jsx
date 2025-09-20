"use client"
import { useState, useEffect } from "react"
import { useEdit } from "../lib/EditContext"

export default function EditPanel() {
  const { isEditMode, selectedElement, undo, redo, canUndo, canRedo, updateElement, addElement, elements } = useEdit()

  const [activeTab, setActiveTab] = useState("elements")
  const [textContent, setTextContent] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [cardTitle, setCardTitle] = useState("")
  const [cardDescription, setCardDescription] = useState("")
  const [cardLink, setCardLink] = useState("")
  const [cardIcon, setCardIcon] = useState("fa-circle")

  const currentElement = selectedElement ? elements[selectedElement] : null

  useEffect(() => {
    if (currentElement) {
      setTextContent(currentElement.content || "")
      setCardTitle(currentElement.title || "")
      setCardDescription(currentElement.description || "")
      setCardLink(currentElement.link || "")
      setCardIcon(currentElement.icon || "fa-circle")
    }
  }, [currentElement])

  if (!isEditMode) return null

  const tabs = [
    { id: "elements", label: "Elementos", icon: "fa-plus-circle" },
    { id: "properties", label: "Propiedades", icon: "fa-cog" },
    { id: "style", label: "Estilo", icon: "fa-palette" },
    { id: "layout", label: "Diseño", icon: "fa-th-large" },
  ]

  const handleTextChange = (value) => {
    setTextContent(value)
    if (selectedElement) {
      updateElement(selectedElement, { content: value })
    }
  }

  const handleCardPropertyChange = (property, value) => {
    const setters = {
      title: setCardTitle,
      description: setCardDescription,
      link: setCardLink,
      icon: setCardIcon,
    }

    setters[property]?.(value)

    if (selectedElement) {
      updateElement(selectedElement, { [property]: value })
    }
  }

  const insertTextBox = () => {
    const id = `text-${Date.now()}`
    addElement(id, {
      type: "text",
      content: textContent || "Nuevo texto",
      x: 100,
      y: 100,
      style: {
        fontSize: "16px",
        color: "#000000",
        backgroundColor: "transparent",
        padding: "10px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      },
    })
    setTextContent("")
  }

  const insertImage = () => {
    if (!imageUrl) return
    const id = `image-${Date.now()}`
    addElement(id, {
      type: "image",
      src: imageUrl,
      alt: "Imagen insertada",
      x: 100,
      y: 100,
      style: {
        maxWidth: "300px",
        height: "auto",
        borderRadius: "8px",
      },
    })
    setImageUrl("")
  }

  const insertVideo = () => {
    if (!videoUrl) return
    const id = `video-${Date.now()}`
    addElement(id, {
      type: "video",
      src: videoUrl,
      x: 100,
      y: 100,
      style: {
        width: "400px",
        height: "225px",
        borderRadius: "8px",
      },
    })
    setVideoUrl("")
  }

  const insertCard = () => {
    const id = `card-${Date.now()}`
    addElement(id, {
      type: "card",
      title: cardTitle || "Nueva Tarjeta",
      description: cardDescription || "Descripción de la tarjeta",
      link: cardLink || "#",
      icon: cardIcon,
      x: 100,
      y: 100,
      style: {
        width: "300px",
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    })
    setCardTitle("")
    setCardDescription("")
    setCardLink("")
    setCardIcon("fa-circle")
  }

  const insertLink = () => {
    if (!linkUrl || !linkText) return
    const id = `link-${Date.now()}`
    addElement(id, {
      type: "link",
      text: linkText,
      href: linkUrl,
      x: 100,
      y: 100,
      style: {
        color: "#3b82f6",
        textDecoration: "underline",
        fontSize: "16px",
        padding: "5px",
      },
    })
    setLinkText("")
    setLinkUrl("")
  }

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-2xl border-r border-gray-200 z-40 flex flex-col">
      {/* Header del panel */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <i className="fa-solid fa-edit text-blue-600"></i>
          Panel de Edición
        </h3>

        {/* Controles de historial */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
              canUndo ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <i className="fa-solid fa-undo text-xs"></i>
            Deshacer
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
              canRedo ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <i className="fa-solid fa-redo text-xs"></i>
            Rehacer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-2 text-xs font-medium flex items-center justify-center gap-1 ${
              activeTab === tab.id
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xs`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido del panel */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "elements" && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Insertar Elementos</h4>

              {/* Text Box */}
              <div className="space-y-2 mb-4">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-20"
                  placeholder="Contenido del texto..."
                />
                <button
                  onClick={insertTextBox}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-font"></i>
                  Insertar Texto
                </button>
              </div>

              {/* Image */}
              <div className="space-y-2 mb-4">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="URL de la imagen..."
                />
                <button
                  onClick={insertImage}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-image"></i>
                  Insertar Imagen
                </button>
              </div>

              {/* Video */}
              <div className="space-y-2 mb-4">
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="URL del video (YouTube, Vimeo, etc.)..."
                />
                <button
                  onClick={insertVideo}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-video"></i>
                  Insertar Video
                </button>
              </div>

              {/* Card */}
              <div className="space-y-2 mb-4 p-3 border border-gray-200 rounded">
                <h5 className="font-medium text-sm">Nueva Tarjeta</h5>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Título de la tarjeta..."
                />
                <textarea
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-16"
                  placeholder="Descripción..."
                />
                <input
                  type="url"
                  value={cardLink}
                  onChange={(e) => setCardLink(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Enlace (opcional)..."
                />
                <select
                  value={cardIcon}
                  onChange={(e) => setCardIcon(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="fa-circle">Círculo</option>
                  <option value="fa-star">Estrella</option>
                  <option value="fa-heart">Corazón</option>
                  <option value="fa-check">Check</option>
                  <option value="fa-info">Info</option>
                  <option value="fa-cog">Configuración</option>
                  <option value="fa-user">Usuario</option>
                  <option value="fa-home">Casa</option>
                </select>
                <button
                  onClick={insertCard}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-th-large"></i>
                  Insertar Tarjeta
                </button>
              </div>

              {/* Link */}
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Texto del enlace..."
                />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="URL del enlace..."
                />
                <button
                  onClick={insertLink}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-link"></i>
                  Insertar Enlace
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "properties" && (
          <div className="space-y-4">
            {selectedElement && currentElement ? (
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Editando: {selectedElement}</h4>

                {currentElement.type === "text" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                      <textarea
                        value={textContent}
                        onChange={(e) => handleTextChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-20"
                      />
                    </div>
                  </div>
                )}

                {currentElement.type === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        value={cardTitle}
                        onChange={(e) => handleCardPropertyChange("title", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        value={cardDescription}
                        onChange={(e) => handleCardPropertyChange("description", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-16"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enlace</label>
                      <input
                        type="url"
                        value={cardLink}
                        onChange={(e) => handleCardPropertyChange("link", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
                      <select
                        value={cardIcon}
                        onChange={(e) => handleCardPropertyChange("icon", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="fa-circle">Círculo</option>
                        <option value="fa-star">Estrella</option>
                        <option value="fa-heart">Corazón</option>
                        <option value="fa-check">Check</option>
                        <option value="fa-info">Info</option>
                        <option value="fa-cog">Configuración</option>
                        <option value="fa-user">Usuario</option>
                        <option value="fa-home">Casa</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentElement.type === "image" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
                      <input
                        type="url"
                        value={currentElement.src || ""}
                        onChange={(e) => updateElement(selectedElement, { src: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texto alternativo</label>
                      <input
                        type="text"
                        value={currentElement.alt || ""}
                        onChange={(e) => updateElement(selectedElement, { alt: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <i className="fa-solid fa-mouse-pointer text-3xl mb-2"></i>
                <p>Selecciona un elemento para editarlo</p>
              </div>
            )}
          </div>
        )}

        {/* Style tab - enhanced */}
        {activeTab === "style" && (
          <div className="space-y-4">
            {selectedElement && currentElement ? (
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Estilos</h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño de fuente</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      value={currentElement.style?.fontSize || "16px"}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, fontSize: e.target.value },
                        })
                      }
                    >
                      <option value="12px">12px</option>
                      <option value="14px">14px</option>
                      <option value="16px">16px</option>
                      <option value="18px">18px</option>
                      <option value="20px">20px</option>
                      <option value="24px">24px</option>
                      <option value="32px">32px</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color de texto</label>
                    <input
                      type="color"
                      className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                      value={currentElement.style?.color || "#000000"}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, color: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color de fondo</label>
                    <input
                      type="color"
                      className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                      value={currentElement.style?.backgroundColor || "#ffffff"}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, backgroundColor: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Borde</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="1px solid #000"
                      value={currentElement.style?.border || ""}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, border: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="8px"
                      value={currentElement.style?.borderRadius || ""}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, borderRadius: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <i className="fa-solid fa-palette text-3xl mb-2"></i>
                <p>Selecciona un elemento para editarlo</p>
              </div>
            )}
          </div>
        )}

        {/* Layout tab - enhanced */}
        {activeTab === "layout" && (
          <div className="space-y-4">
            {selectedElement && currentElement ? (
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Diseño</h4>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Posición X</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={currentElement.x || 0}
                        onChange={(e) => updateElement(selectedElement, { x: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Posición Y</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={currentElement.y || 0}
                        onChange={(e) => updateElement(selectedElement, { y: Number.parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Ancho</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="auto"
                        value={currentElement.style?.width || ""}
                        onChange={(e) =>
                          updateElement(selectedElement, {
                            style: { ...currentElement.style, width: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Alto</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        placeholder="auto"
                        value={currentElement.style?.height || ""}
                        onChange={(e) =>
                          updateElement(selectedElement, {
                            style: { ...currentElement.style, height: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alineación</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                        onClick={() =>
                          updateElement(selectedElement, {
                            style: { ...currentElement.style, textAlign: "left" },
                          })
                        }
                      >
                        <i className="fa-solid fa-align-left"></i>
                      </button>
                      <button
                        className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                        onClick={() =>
                          updateElement(selectedElement, {
                            style: { ...currentElement.style, textAlign: "center" },
                          })
                        }
                      >
                        <i className="fa-solid fa-align-center"></i>
                      </button>
                      <button
                        className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                        onClick={() =>
                          updateElement(selectedElement, {
                            style: { ...currentElement.style, textAlign: "right" },
                          })
                        }
                      >
                        <i className="fa-solid fa-align-right"></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="10px"
                      value={currentElement.style?.padding || ""}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, padding: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      placeholder="0px"
                      value={currentElement.style?.margin || ""}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, margin: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <i className="fa-solid fa-th-large text-3xl mb-2"></i>
                <p>Selecciona un elemento para editarlo</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
