// components/EditableSection.jsx
'use client'
import Editable from './Editable'
import Draggable from './Draggable'

export default function EditableSection({ 
  id,
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  children 
}) {
  const sectionContent = (
    <div className="hero text-center p-8 bg-green-50 rounded-lg shadow">
      {onTitleChange ? (
        <Editable
          tag="h1"
          value={title}
          onChange={onTitleChange}
          className="text-3xl font-bold text-green-700"
          placeholder="Título de la página"
        />
      ) : (
        <h1 className="text-3xl font-bold text-green-700">{title}</h1>
      )}
      
      {onDescriptionChange ? (
        <Editable
          tag="p"
          value={description}
          onChange={onDescriptionChange}
          className="text-gray-600 mt-2"
          placeholder="Descripción de la página"
        />
      ) : (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {id ? (
        <Draggable
          id={id}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
        >
          {sectionContent}
        </Draggable>
      ) : (
        sectionContent
      )}
      {children}
    </div>
  )
}
