// app/indicadores/page.jsx
'use client'
import Card from '../../components/Card'
import Editable from '../../components/Editable'
import { useEdit } from '../../contexts/EditContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function IndicadoresPage() {
  const { isEditing } = useEdit()
  const [pageTitle, setPageTitle] = useLocalStorage('indicadoresTitle', 'Dashboard de Indicadores')
  const [pageDescription, setPageDescription] = useLocalStorage('indicadoresDescription', 'Aquí podrás ver todos los indicadores de gestión de residuos en tiempo real.')
  
  const [cards, setCards] = useLocalStorage('indicadoresCards', [
    { 
      id: 1, 
      title: "Métricas de Reciclaje", 
      desc: "Cantidad de material reciclado por mes.", 
      icon: "fa-recycle", 
      color: "bg-green-600",
      href: "/indicadores/reciclaje"
    },
    { 
      id: 2, 
      title: "Indicadores Financieros", 
      desc: "Costos de gestión y ingresos.", 
      icon: "fa-dollar-sign", 
      color: "bg-blue-500",
      href: "/indicadores/financieros"
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
      <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
        {isEditing ? (
          <>
            <Editable
              tag="h1"
              value={pageTitle}
              onChange={setPageTitle}
              className="text-3xl font-bold text-green-700"
              placeholder="Título de la página"
            />
            <Editable
              tag="p"
              value={pageDescription}
              onChange={setPageDescription}
              className="text-gray-600 mt-2"
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => (
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
