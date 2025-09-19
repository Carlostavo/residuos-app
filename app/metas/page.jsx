// app/metas/page.jsx
'use client'
import Card from '../../components/Card'
import Editable from '../../components/Editable'
import { useEdit } from '../../contexts/EditContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useState } from 'react'

export default function MetasPage() {
  const { isEditing } = useEdit()
  const [pageTitle, setPageTitle] = useLocalStorage('metasTitle', 'Gestión de Metas de Sostenibilidad')
  const [pageDescription, setPageDescription] = useLocalStorage('metasDescription', 'Define, monitorea y ajusta tus metas ambientales.')
  
  const [cards, setCards] = useLocalStorage('metasCards', [
    { 
      id: 1, 
      title: "Metas de Reducción", 
      desc: "Objetivos para reducir el volumen de residuos.", 
      icon: "fa-minimize", 
      color: "bg-green-600",
      href: "/metas/reduccion"
    },
    { 
      id: 2, 
      title: "Metas de Reciclaje", 
      desc: "Aumentar la tasa de reciclaje.", 
      icon: "fa-trash-arrow-up", 
      color: "bg-blue-500",
      href: "/metas/reciclaje"
    },
  ])

  const [draggingId, setDraggingId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

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

  const handleDragStart = (id) => {
    setDraggingId(id)
  }

  const handleDragOver = (id) => {
    setDragOverId(id)
  }

  const handleDrop = (draggedId, droppedId) => {
    if (draggedId === droppedId) return
    
    const draggedIndex = cards.findIndex(card => card.id === draggedId)
    const droppedIndex = cards.findIndex(card => card.id === droppedId)
    
    if (draggedIndex === -1 || droppedIndex === -1) return
    
    const newCards = [...cards]
    const [draggedItem] = newCards.splice(draggedIndex, 1)
    newCards.splice(droppedIndex, 0, draggedItem)
    
    setCards(newCards)
    setDraggingId(null)
    setDragOverId(null)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverId(null)
  }

  return (
    <section className="space-y-6">
      <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
        {isEditing ? (
          <>
            <Editable
              tag="h1"
              value={pageTitle}
              onChange={setPageTitle}
              className="text-3xl font-bold text-green-700 editable"
              placeholder="Título de la página"
            />
            <Editable
              tag="p"
              value={pageDescription}
              onChange={setPageDescription}
              className="text-gray-600 mt-2 editable"
              placeholder="Descripción de la página"
            />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-green-700">{pageTitle}</h1>
            <p className="text-gray-600 mt-2">{pageDescription}</p>
          </>
        )}
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isEditing ? 'edit-scrollbar' : ''}`}>
        {cards.map(card => (
          <div 
            key={card.id} 
            className={`drag-transition layout-transition ${
              draggingId === card.id ? 'dragging dragging-element' : ''
            } ${
              dragOverId === card.id ? 'drag-over drop-indicator' : ''
            }`}
          >
            <Card 
              id={card.id}
              title={card.title}
              desc={card.desc}
              icon={card.icon}
              color={card.color}
              href={card.href}
              onTitleChange={(newTitle) => updateCardTitle(card.id, newTitle)}
              onDescChange={(newDesc) => updateCardDesc(card.id, newDesc)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border">
          <p className="text-sm text-gray-600">
            <i className="fa-solid fa-pen mr-2"></i>
            <strong>Modo edición activado</strong>
            <br />
            • Haz clic en cualquier texto para editarlo
            <br />
            • Arrastra las cards para reorganizarlas
          </p>
        </div>
      )}
    </section>
  )
}
