// src/components/EditModeButton.js
'use client' // Importante en Next.js 13+

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function EditModeButton() {
  const [isEditing, setIsEditing] = useState(false)
  const [userRole, setUserRole] = useState(null)
  
  // 1. Obtener el Rol del Usuario
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // En un proyecto real, consultarías una tabla 'perfiles' por el rol
        // Ejemplo simplificado:
        const { data: profile } = await supabase
          .from('perfiles') // Asegúrate de tener esta tabla en Supabase
          .select('rol')
          .eq('id', user.id)
          .single()
        
        setUserRole(profile?.rol)
      } else {
        setUserRole(null)
      }
    }
    fetchUserRole()
  }, [])

  // Si no es admin ni técnico, no mostrar nada
  if (userRole !== 'admin' && userRole !== 'tecnico') {
    return null
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
    // Aquí puedes emitir un evento global o usar un Context/Redux 
    // para notificar a otros componentes que el modo de edición ha cambiado.
    console.log(`Modo Edición: ${isEditing ? 'Desactivado' : 'Activado'}`)
  }

  return (
    <button 
      onClick={toggleEditMode}
      className={`btn ms-2 ${isEditing ? 'btn-danger' : 'btn-warning'}`}
    >
      {isEditing ? 'Guardar y Desactivar' : 'Modo Edición'}
    </button>
  )
}