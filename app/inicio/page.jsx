'use client'
import { useState, useEffect } from 'react'
import Card from '../../components/Card'
import { useAuth } from '../../lib/useAuth'

export default function InicioPage() {
  const { session } = useAuth()
  const [editMode, setEditMode] = useState(false)
  
  // Estado inicial del contenido
  const [heroTitle, setHeroTitle] = useState("Sistema de Gestión de Residuos Sólidos")
  const [heroDesc, setHeroDesc] = useState("La plataforma para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental eficiente.")
  
  const [cards, setCards] = useState([
    { title: "Gestión de Metas", desc: "Establece y sigue tus objetivos de sostenibilidad.", icon: "fa-bullseye", color: "bg-green-600", href: "/metas" },
    { title: "Dashboard de Indicadores", desc: "Visualiza en tiempo real el rendimiento.", icon: "fa-chart-line", color: "bg-blue-500", href: "/indicadores" },
    { title: "Seguimiento de Avances", desc: "Revisa el progreso de tus proyectos.", icon: "fa-chart-area", color: "bg-yellow-400", href: "/avances" },
    { title: "Generación de Reportes", desc: "Crea y exporta informes detallados.", icon: "fa-file-lines", color: "bg-red-500", href: "/reportes" },
    { title: "Formularios de Datos", desc: "Ingresa y gestiona datos en campo.", icon: "fa-file-alt", color: "bg-purple-600", href: "/formularios" },
  ])

  // Load saved content from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("contenido_inicio")
      if (saved) {
        const parsed = JSON.parse(saved)
        setHeroTitle(parsed.heroTitle || heroTitle)
        setHeroDesc(parsed.heroDesc || heroDesc)
        setCards(parsed.cards || cards)
      }
    } catch (e) {
      console.error("Error loading saved inicio content:", e)
    }

    const handler = () => setEditMode((v) => !v)
    window.addEventListener('toggle-edit', handler)
    return () => window.removeEventListener('toggle-edit', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Guardar cambios en localStorage
  const handleSave = () => {
    const data = { heroTitle, heroDesc, cards }
    try {
      localStorage.setItem("contenido_inicio", JSON.stringify(data))
      setEditMode(false)
      alert("✅ Cambios guardados (localStorage)")
    } catch (e) {
      console.error("Error saving inicio content:", e)
      alert("Error guardando contenido en localStorage")
    }
  }

  const handleAddCard = () => {
    setCards([
      ...cards,
      { title: "Nueva sección", desc: "Descripción editable...", icon: "fa-star", color: "bg-gray-500", href: "#" }
    ])
  }

  return (
    <section className="space-y-6">
      {/* Botones de edición (solo si hay sesión) */}
      {session && (
        <div className="flex justify-end gap-2 mb-2">
          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-2"
            >
              <i className="fa-solid fa-pen"></i> Editar
            </button>
          ) : (
            <>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Guardar
              </button>
              <button 
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      )}

      {/* Hero */}
      <div className="hero text-center p-12 bg-gradient-to-br from-green-50 to-white rounded-lg shadow">
        {editMode ? (
          <>
            <input 
              type="text" 
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="text-4xl font-bold text-green-700 text-center w-full bg-gray-100 rounded p-2"
            />
            <textarea 
              value={heroDesc}
              onChange={(e) => setHeroDesc(e.target.value)}
              className="text-gray-600 mt-4 w-full p-3 bg-gray-100 rounded"
            />
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-green-700">{heroTitle}</h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{heroDesc}</p>
          </>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="relative">
            {editMode ? (
              <div className="p-4 border rounded-lg bg-white shadow">
                <input 
                  type="text" 
                  value={c.title}
                  onChange={(e) => {
                    const newCards = [...cards]
                    newCards[i].title = e.target.value
                    setCards(newCards)
                  }}
                  className="w-full mb-2 font-bold text-lg bg-gray-100 rounded p-2"
                />
                <textarea 
                  value={c.desc}
                  onChange={(e) => {
                    const newCards = [...cards]
                    newCards[i].desc = e.target.value
                    setCards(newCards)
                  }}
                  className="w-full text-sm bg-gray-100 rounded p-2"
                />
              </div>
            ) : (
              <Card {...c} />
            )}
          </div>
        ))}
      </div>

      {/* Floating edit panel when in edit mode (mobile friendly) */}
      {editMode && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-xl p-4 flex gap-3 border z-50">
          <button 
            onClick={handleAddCard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Agregar card
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Guardar
          </button>
          <button 
            onClick={() => setEditMode(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      )}
    </section>
  )
}
