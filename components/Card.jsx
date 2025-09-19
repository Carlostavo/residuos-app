// components/Card.jsx (versión simplificada)
'use client'
import Link from 'next/link'
import { useEdit } from '../contexts/EditContext'
import Editable from './Editable'

export default function Card({ 
  id,
  title, 
  desc, 
  icon = 'fa-file', 
  color = 'bg-gray-400', 
  href, 
  className = '',
  onTitleChange,
  onDescChange,
  ...props 
}) {
  const { isEditing } = useEdit()

  const cardContent = (
    <div 
      className={`card p-6 rounded-2xl bg-white shadow-lg transition-all duration-300 h-full flex flex-col ${className} ${
        (href && !isEditing) ? 'cursor-pointer hover:scale-105 hover:shadow-xl' : ''
      } ${isEditing ? 'editable-highlight' : ''}`}
      {...props}
    >
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${color} mb-4`}>
        <i className={`fa-solid ${icon} text-xl`}></i>
      </div>
      
      {isEditing && onTitleChange ? (
        <Editable
          tag="h3"
          value={title}
          onChange={onTitleChange}
          className="text-xl font-semibold text-gray-800 mb-2"
          placeholder="Título de la tarjeta"
        />
      ) : (
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      )}
      
      {isEditing && onDescChange ? (
        <Editable
          tag="p"
          value={desc}
          onChange={onDescChange}
          className="text-gray-600 mt-2 flex-grow"
          placeholder="Descripción de la tarjeta"
        />
      ) : (
        <p className="text-gray-600 mt-2 flex-grow">{desc}</p>
      )}
      
      {(href && !isEditing) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-green-600 font-medium flex items-center">
            Acceder
            <i className="fa-solid fa-arrow-right ml-2 text-sm"></i>
          </span>
        </div>
      )}
    </div>
  )

  if (href && !isEditing) {
    return (
      <Link href={href} className="h-full block">
        {cardContent}
      </Link>
    )
  }
  
  return cardContent
}
