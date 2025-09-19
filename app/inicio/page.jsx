// app/inicio/page.jsx
'use client'
import DraggableCard from '../../components/DraggableCard'
import Editable from '../../components/Editable'
import { useEdit } from '../../contexts/EditContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useState, useEffect } from 'react'

export default function InicioPage() {
  const { isEditing } = useEdit()
  const [pageTitle, setPageTitle] = useLocalStorage('inicioTitle', 'Sistema de Gestión de Residuos Sólidos')
  const [pageDescription, setPageDescription] = useLocalStorage('inicioDescription', 'La plataforma para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental eficiente.')
  
  // Posiciones iniciales para las cards
  const getInitialPositions = () => [
    { id: 1, x: 50, y: 200 },
    { id: 2, x: 350, y: 200 },
    { id: 3, x: 650, y: 200 },
    { id: 4, x: 200, y: 450 },
    { id: 5, x: 500, y: 450 }
  ]

  const [cardPositions, setCardPositions] = useLocalStorage('inicioCardPositions', getInitialPositions())
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

  const updateCardPosition = (id, newPosition) => {
    setCardPositions(positions => 
      positions.map(pos => 
        pos.id === id ? { ...pos, x: newPosition.x, y: newPosition.y } : pos
      )
    )
  }

  const resetPositions = () => {
    setCardPositions(getInitialPositions())
  }

  return (
    <section className="space-y-6 relative min-h-screen">
      <div className="hero text-center p-12 bg-gradient-to-br from-green-50 to-white rounded-lg shadow">
        {isEditing ? (
          <>
            <Editable
              tag="h1"
              value={pageTitle}
              onChange={setPageTitle}
              className="text-4xl font-bold text-green-700 mb-4 editable"
              placeholder="Título de la página"
            />
            <Editable
              tag="p"
              value={pageDescription}
              onChange={setPageDescription}
              className="text-gray-600 max-w-2xl mx-auto editable"
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

      {/* Contenedor para las cards con posicionamiento absoluto */}
      <div className="relative w-full min-h-[600px]">
        {cards.map((card) => {
          const position = cardPositions.find(pos => pos.id === card.id) || { x: 0, y: 0 }
          return (
            <DraggableCard
              key={card.id}
              id={card.id}
              title={card.title}
              desc={card.desc}
              icon={card.icon}
              color={card.color}
              href={card.href}
              position={position}
              onPositionChange={updateCardPosition}
              onTitleChange={(newTitle) => updateCardTitle(card.id, newTitle)}
              onDescChange={(newDesc) => updateCardDesc(card.id, newDesc)}
            />
          )
        })}
      </div>

      {isEditing && (
        <>
          <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border z-50">
            <p className="text-sm text-gray-600 mb-3">
              <i className="fa-solid fa-pen mr-2"></i>
              <strong>Modo edición avanzado</strong>
              <br />
              • Haz clic en cualquier texto para editarlo
              <br />
              • Arrastra las cards a cualquier posición
              <br />
              • Los cambios se guardan automáticamente
            </p>
            <button
              onClick={resetPositions}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
            >
              <i className="fa-solid fa-undo mr-2"></i>
              Restablecer posiciones
            </button>
          </div>

          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center">
            <i className="fa-solid fa-grip-horizontal mr-2"></i>
            Modo arrastre activado - Mueve las cards libremente
          </div>
        </>
      )}
    </section>
  )
}
