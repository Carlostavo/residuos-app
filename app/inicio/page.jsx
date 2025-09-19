'use client'
import { useState } from 'react'
import Card from '../../components/Card'

export default function InicioPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [cards, setCards] = useState([
    { title: "Gestión de Metas", desc: "Establece y sigue tus objetivos de sostenibilidad.", icon: "fa-bullseye", color: "bg-green-600", href: "/metas" },
    { title: "Dashboard de Indicadores", desc: "Visualiza en tiempo real el rendimiento.", icon: "fa-chart-line", color: "bg-blue-500", href: "/indicadores" },
    { title: "Seguimiento de Avances", desc: "Revisa el progreso de tus proyectos.", icon: "fa-chart-area", color: "bg-yellow-400", href: "/avances" },
    { title: "Generación de Reportes", desc: "Crea y exporta informes detallados.", icon: "fa-file-lines", color: "bg-red-500", href: "/reportes" },
    { title: "Formularios de Datos", desc: "Ingresa y gestiona datos en campo.", icon: "fa-file-alt", color: "bg-purple-600", href: "/formularios" },
  ])

  // Guardar cambios
  const handleSave = () => {
    setIsEditing(false)
    alert('✅ Cambios guardados (luego puedes conectarlo a Supabase)')
  }

  // Cancelar edición
  const handleCancel = () => {
    setIsEditing(false)
  }

  // Agregar nueva card
  const handleAddCard = () => {
    setCards([
      ...cards,
      { title: "Nueva sección", desc: "Descripción editable...", icon: "fa-star", color: "bg-gray-500", href: "#" }
    ])
  }

  return (
    <section className="space-y-6 relative">
      <div className="hero text-center p-12 bg-gradient-to-br from-green-50 to-white rounded-lg shadow">
        <h1 
          className={`text-4xl font-bold text-green-700 ${isEditing ? 'outline outline-2 outline-green-400 p-1 rounded' : ''}`}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
        >
          Sistema de Gestión de Residuos Sólidos
        </h1>
        <p 
          className={`text-gray-600 mt-4 max-w-2xl mx-auto ${isEditing ? 'outline outline-2 outline-green-400 p-1 rounded' : ''}`}
          contentEditable={isEditing}
          suppressContentEditableWarning={true}
        >
          La plataforma para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental eficiente.
        </p>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((c, idx) => (
          <div key={idx} className="relative">
            <Card title={c.title} desc={c.desc} icon={c.icon} color={c.color} href={c.href} />
            {isEditing && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center p-3 rounded-lg">
                <input
                  type="text"
                  value={c.title}
                  onChange={(e) => {
                    const newCards = [...cards]
                    newCards[idx].title = e.target.value
                    setCards(newCards)
                  }}
                  className="mb-2 w-full p-2 border rounded-lg"
                />
                <textarea
                  value={c.desc}
                  onChange={(e) => {
                    const newCards = [...cards]
                    newCards[idx].desc = e.target.value
                    setCards(newCards)
                  }}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Panel de edición flotante */}
      {isEditing && (
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
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Botón de activar edición */}
      {!isEditing && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setIsEditing(true)}
            className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700"
            title="Editar página"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
        </div>
      )}
    </section>
  )
}
