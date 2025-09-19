// components/DraggableArea.jsx
'use client'
import { useEdit } from '../contexts/EditContext'
import DraggableCard from './DraggableCard'

export default function DraggableArea({ 
  children, 
  cards, 
  cardPositions, 
  onPositionChange,
  onTitleChange,
  onDescChange 
}) {
  const { isEditing } = useEdit()

  if (!isEditing) {
    return children
  }

  return (
    <div className="relative w-full min-h-screen edit-container grid-guides">
      {cards.map((card) => {
        const position = cardPositions.find(pos => pos.id === card.id) || { x: 100, y: 100 }
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
            onPositionChange={onPositionChange}
            onTitleChange={(newTitle) => onTitleChange(card.id, newTitle)}
            onDescChange={(newDesc) => onDescChange(card.id, newDesc)}
          />
        )
      })}
      {children}
    </div>
  )
}
