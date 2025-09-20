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

  const getNextPosition = () => {
    const existingElements = Object.values(elements)
    const maxY = Math.max(0, ...existingElements.map((el) => el.y || 0))
    return { x: 50, y: maxY + 150 }
  }

  const insertTextBox = () => {
    const id = `text-${Date.now()}`
    const position = getNextPosition()
    addElement(id, {
      type: "text",
      content: textContent || "Nuevo texto",
      ...position,
      style: {
        fontSize: "16px",
        color: "#000000",
        backgroundColor: "transparent",
        padding: "10px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        minWidth: "200px",
      },
    })
    setTextContent("")
  }

  const insertImage = () => {
    if (!imageUrl) return
    const id = `image-${Date.now()}`
    const position = getNextPosition()
    addElement(id, {
      type: "image",
      src: imageUrl,
      alt: "Imagen insertada",
      ...position,
      style: {
        maxWidth: "300px",
        height: "auto",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    })
    setImageUrl("")
  }

  const insertVideo = () => {
    if (!videoUrl) return
    const id = `video-${Date.now()}`
    const position = getNextPosition()
    addElement(id, {
      type: "video",
      src: videoUrl,
      ...position,
      style: {
        width: "400px",
        height: "225px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    })
    setVideoUrl("")
  }

  const insertCard = () => {
    const id = `card-${Date.now()}`
    const position = getNextPosition()
    addElement(id, {
      type: "card",
      title: cardTitle || "Nueva Tarjeta",
      description: cardDescription || "Descripción de la tarjeta",
      link: cardLink || "#",
      icon: cardIcon,
      ...position,
      style: {
        width: "300px",
        minHeight: "200px",
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
    const position = getNextPosition()
    addElement(id, {
      type: "link",
      text: linkText,
      href: linkUrl,
      ...position,
      style: {
        display: "inline-block",
        padding: "8px 16px",
        borderRadius: "6px",
      },
    })
    setLinkText("")
    setLinkUrl("")
  }

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-2xl border-r border-gray-200 z-40 flex flex-col">
      {/* Header del panel */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <i className="fa-solid fa-edit text-blue-600"></i>
          Panel de Edición
        </h3>

        {/* Controles de historial */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-all ${
              canUndo
                ? "bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <i className="fa-solid fa-undo text-xs"></i>
            Deshacer
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-all ${
              canRedo
                ? "bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <i className="fa-solid fa-redo text-xs"></i>
            Rehacer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-3 text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              activeTab === tab.id
                ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xs`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido del panel */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "elements" && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-plus text-blue-600"></i>
                Insertar Elementos
              </h4>

              {/* Text Box */}
              <div className="space-y-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-sm text-blue-800">Cuadro de Texto</h5>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Escribe tu texto aquí..."
                />
                <button
                  onClick={insertTextBox}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-font"></i>
                  Insertar Texto
                </button>
              </div>

              {/* Image */}
              <div className="space-y-2 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-sm text-green-800">Imagen</h5>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {imageUrl && (
                  <div className="mt-2">
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                )}
                <button
                  onClick={insertImage}
                  disabled={!imageUrl}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-image"></i>
                  Insertar Imagen
                </button>
              </div>

              {/* Video */}
              <div className="space-y-2 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <h5 className="font-medium text-sm text-red-800">Video</h5>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="YouTube, Vimeo o enlace directo"
                />
                <button
                  onClick={insertVideo}
                  disabled={!videoUrl}
                  className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-video"></i>
                  Insertar Video
                </button>
              </div>

              {/* Card */}
              <div className="space-y-2 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="font-medium text-sm text-purple-800">Tarjeta</h5>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Título de la tarjeta"
                />
                <textarea
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-16 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Descripción"
                />
                <input
                  type="url"
                  value={cardLink}
                  onChange={(e) => setCardLink(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enlace (opcional)"
                />
                <select
                  value={cardIcon}
                  onChange={(e) => setCardIcon(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="fa-circle">Círculo</option>
                  <option value="fa-star">Estrella</option>
                  <option value="fa-heart">Corazón</option>
                  <option value="fa-check">Check</option>
                  <option value="fa-info">Info</option>
                  <option value="fa-cog">Configuración</option>
                  <option value="fa-user">Usuario</option>
                  <option value="fa-home">Casa</option>
                  <option value="fa-chart-bar">Gráfico</option>
                  <option value="fa-leaf">Hoja</option>
                  <option value="fa-recycle">Reciclar</option>
                </select>
                <button
                  onClick={insertCard}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <i className="fa-solid fa-th-large"></i>
                  Insertar Tarjeta
                </button>
              </div>

              {/* Link */}
              <div className="space-y-2 mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <h5 className="font-medium text-sm text-indigo-800">Enlace</h5>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Texto del enlace"
                />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://ejemplo.com"
                />
                <button
                  onClick={insertLink}
                  disabled={!linkUrl || !linkText}
                  className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 text-sm flex items-center justify-center gap-2 transition-colors"
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
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-cog text-blue-600"></i>
                  Editando: <span className="text-blue-600">{selectedElement}</span>
                </h4>

                {currentElement.type === "text" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                      <textarea
                        value={textContent}
                        onChange={(e) => handleTextChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Escribe tu contenido aquí..."
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
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                      <textarea
                        value={cardDescription}
                        onChange={(e) => handleCardPropertyChange("description", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enlace</label>
                      <input
                        type="url"
                        value={cardLink}
                        onChange={(e) => handleCardPropertyChange("link", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icono</label>
                      <select
                        value={cardIcon}
                        onChange={(e) => handleCardPropertyChange("icon", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="fa-circle">Círculo</option>
                        <option value="fa-star">Estrella</option>
                        <option value="fa-heart">Corazón</option>
                        <option value="fa-check">Check</option>
                        <option value="fa-info">Info</option>
                        <option value="fa-cog">Configuración</option>
                        <option value="fa-user">Usuario</option>
                        <option value="fa-home">Casa</option>
                        <option value="fa-chart-bar">Gráfico</option>
                        <option value="fa-leaf">Hoja</option>
                        <option value="fa-recycle">Reciclar</option>
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
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texto alternativo</label>
                      <input
                        type="text"
                        value={currentElement.alt || ""}
                        onChange={(e) => updateElement(selectedElement, { alt: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {currentElement.type === "video" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL del video</label>
                      <input
                        type="url"
                        value={currentElement.src || ""}
                        onChange={(e) => updateElement(selectedElement, { src: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="YouTube, Vimeo o enlace directo"
                      />
                    </div>
                  </div>
                )}

                {currentElement.type === "link" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texto del enlace</label>
                      <input
                        type="text"
                        value={currentElement.text || ""}
                        onChange={(e) => updateElement(selectedElement, { text: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        value={currentElement.href || ""}
                        onChange={(e) => updateElement(selectedElement, { href: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <i className="fa-solid fa-mouse-pointer text-4xl mb-4 text-gray-300"></i>
                <p className="text-lg font-medium">Selecciona un elemento</p>
                <p className="text-sm">Haz clic en cualquier elemento para editarlo</p>
              </div>
            )}
          </div>
        )}

        {/* Style tab - enhanced */}
        {activeTab === "style" && (
          <div className="space-y-4">
            {selectedElement && currentElement ? (
              <div>
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-palette text-blue-600"></i>
                  Estilos
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño de fuente</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <option value="48px">48px</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Peso de fuente</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={currentElement.style?.fontWeight || "normal"}
                        onChange={(e) =>
                          updateElement(selectedElement, {
                            style: { ...currentElement.style, fontWeight: e.target.value },
                          })
                        }
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Negrita</option>
                        <option value="lighter">Ligera</option>
                        <option value="bolder">Más negrita</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color de texto</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          value={currentElement.style?.color || "#000000"}
                          onChange={(e) =>
                            updateElement(selectedElement, {
                              style: { ...currentElement.style, color: e.target.value },
                            })
                          }
                        />
                        <input
                          type="text"
                          className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={currentElement.style?.color || "#000000"}
                          onChange={(e) =>
                            updateElement(selectedElement, {
                              style: { ...currentElement.style, color: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color de fondo</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          value={currentElement.style?.backgroundColor || "#ffffff"}
                          onChange={(e) =>
                            updateElement(selectedElement, {
                              style: { ...currentElement.style, backgroundColor: e.target.value },
                            })
                          }
                        />
                        <input
                          type="text"
                          className="flex-1 p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={currentElement.style?.backgroundColor || "#ffffff"}
                          onChange={(e) =>
                            updateElement(selectedElement, {
                              style: { ...currentElement.style, backgroundColor: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Borde</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="8px"
                      value={currentElement.style?.borderRadius || ""}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, borderRadius: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sombra</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={currentElement.style?.boxShadow || "none"}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, boxShadow: e.target.value },
                        })
                      }
                    >
                      <option value="none">Sin sombra</option>
                      <option value="0 1px 3px rgba(0,0,0,0.1)">Sombra ligera</option>
                      <option value="0 4px 6px rgba(0,0,0,0.1)">Sombra media</option>
                      <option value="0 10px 15px rgba(0,0,0,0.1)">Sombra fuerte</option>
                      <option value="0 20px 25px rgba(0,0,0,0.15)">Sombra muy fuerte</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <i className="fa-solid fa-palette text-4xl mb-4 text-gray-300"></i>
                <p className="text-lg font-medium">Selecciona un elemento</p>
                <p className="text-sm">Haz clic en cualquier elemento para editarlo</p>
              </div>
            )}
          </div>
        )}

        {/* Layout tab - enhanced */}
        {activeTab === "layout" && (
          <div className="space-y-4">
            {selectedElement && currentElement ? (
              <div>
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-th-large text-blue-600"></i>
                  Diseño y Posición
                </h4>

                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-sm text-gray-700 mb-3">Posición</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Posición X (px)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={currentElement.x || 0}
                          onChange={(e) => updateElement(selectedElement, { x: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Posición Y (px)</label>
                        <input
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={currentElement.y || 0}
                          onChange={(e) => updateElement(selectedElement, { y: Number.parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-sm text-gray-700 mb-3">Dimensiones</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Ancho</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="auto, 300px, 100%"
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
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="auto, 200px, 100%"
                          value={currentElement.style?.height || ""}
                          onChange={(e) =>
                            updateElement(selectedElement, {
                              style: { ...currentElement.style, height: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-sm text-gray-700 mb-3">Alineación de texto</h5>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`px-3 py-2 border rounded text-sm transition-colors ${
                          currentElement.style?.textAlign === "left"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          updateElement(selectedElement, {
                            style: { ...currentElement.style, textAlign: "left" },
                          })
                        }
                      >
                        <i className="fa-solid fa-align-left"></i>
                      </button>
                      <button
                        className={`px-3 py-2 border rounded text-sm transition-colors ${
                          currentElement.style?.textAlign === "center"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          updateElement(selectedElement, {
                            style: { ...currentElement.style, textAlign: "center" },
                          })
                        }
                      >
                        <i className="fa-solid fa-align-center"></i>
                      </button>
                      <button
                        className={`px-3 py-2 border rounded text-sm transition-colors ${
                          currentElement.style?.textAlign === "right"
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
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

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-sm text-gray-700 mb-3">Espaciado</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Padding interno</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10px, 10px 20px, etc."
                          value={currentElement.style?.padding || ""}
                          onChange={(e) =>
                            updateElement(selectedElement, {
                              style: { ...currentElement.style, padding: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Margin externo</label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0px, 10px 20px, etc."
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

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-sm text-gray-700 mb-3">Z-Index (Capa)</h5>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      value={currentElement.style?.zIndex || ""}
                      onChange={(e) =>
                        updateElement(selectedElement, {
                          style: { ...currentElement.style, zIndex: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <i className="fa-solid fa-th-large text-4xl mb-4 text-gray-300"></i>
                <p className="text-lg font-medium">Selecciona un elemento</p>
                <p className="text-sm">Haz clic en cualquier elemento para editarlo</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
