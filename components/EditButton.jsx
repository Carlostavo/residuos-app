'use client'
import { useEdit } from '../contexts/EditContext'
import { useAuth } from '../lib/useAuth'

export default function EditButton() {
  const { isEditing, setIsEditing } = useEdit()
  const { session, role } = useAuth()

  // Solo mostrar si el usuario está autenticado y es admin o técnico
  if (!session || !['admin', 'tecnico'].includes(role)) {
    return null
  }

  return (
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="fixed bottom-6 right-6 z-40 p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
      title="Modo edición"
    >
      <i className={`fa-solid ${isEditing ? 'fa-check' : 'fa-pencil'} text-xl`}></i>
    </button>
  )
}
