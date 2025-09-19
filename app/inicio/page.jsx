// app/inicio/page.jsx
'use client'
import Card from '../../components/Card'
import Editable from '../../components/Editable'
import { useEdit } from '../../contexts/EditContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function InicioPage() {
  const { isEditing } = useEdit()
  const [pageTitle, setPageTitle] = useLocalStorage('inicioTitle', 'Sistema de Gestión de Residuos Sólidos')
  const [pageDescription, setPageDescription] = useLocalStorage('inicioDescription', 'La plataforma para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental eficiente.')
  
  const [cards, setCards] = useLocalStorage('inicioCards', [
    { 
      id: 1, 
      title: "Gestión de Metas", 
      desc: "Establece y sigue tus objetivos de sostenibilidad.", 
      icon: "fa-bullseye", 
      color: "bg-green-600", 
      href: "/metas" 
    },
    { 
      id: 2, 
      title: "Dashboard de Indicadores", 
      desc: "Visualiza en tiempo real el rendimiento.", 
      icon: "fa-chart-line", 
      color: "bg-blue-500", 
      href: "/indicadores" 
    },
    { 
      id: 3, 
      title: "Seguimiento de Avances", 
      desc: "Revisa el progreso de tus proyectos.", 
      icon: "fa-chart-area", 
      color: "bg-yellow-400", 
      href: "/avances" 
    },
    { 
      id: 4, 
      title: "Generación de Reportes", 
      desc: "Crea y exporta informes detallados.", 
      icon: "fa-file-lines", 
      color: "bg-red-500", 
      href: "/reportes" 
    },
    { 
      id: 5, 
      title: "Formularios de Datos", 
      desc: "Ingresa y gestiona datos en campo.", 
      icon: "fa-file-alt", 
      color: "bg-purple-600", 
      href: "/formularios" 
    },
  ])

  const updateCardTitle = (id, newTitle) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, title: newTitle } : card
    ))
  }

  const updateCardDesc = (id, newDesc) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, desc: newDesc } : card
    ))
  }

  return (
    <section className="space-y-6">
      <div className="hero text-center p-12 bg-gradient-to-br from-green-50 to-white rounded-lg shadow">
        {isEditing ? (
          <>
            <Editable
              tag="h1"
              value={pageTitle}
              onChange={setPageTitle}
              className="text-4xl font-bold text-green-700 mb-4"
              placeholder="Título de la página"
            />
            <Editable
              tag="p"
              value={pageDescription}
              onChange={setPageDescription}
              className="text-gray-600 max-w-2xl mx-auto"
              placeholder="Descripción de la página"
            />
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-green-700">{pageTitle}</h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{pageDescription}</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card 
            key={card.id}
            title={card.title}
            desc={card.desc}
            icon={card.icon}
            color={card.color}
            href={card.href}
            onTitleChange={(newTitle) => updateCardTitle(card.id, newTitle)}
            onDescChange={(newDesc) => updateCardDesc(card.id, newDesc)}
          />
        ))}
      </div>

      {isEditing && (
        <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border">
          <p className="text-sm text-gray-600">
            <i className="fa-solid fa-pen mr-2"></i>
            Modo edición activado. Haz clic en cualquier texto para editarlo.
          </p>
        </div>
      )}
    </section>
  )
}
