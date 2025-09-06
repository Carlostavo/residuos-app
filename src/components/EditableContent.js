 srccomponentsEditableContent.js
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@libsupabase'

 Propiedades identifier (para saber qué contenido guardar), elementType (ej 'h2', 'p')
export function EditableContent({ identifier, elementType Element, initialText }) {
  const [content, setContent] = useState(initialText)
  const [isEditing, setIsEditing] = useState(false)  Recibir del contextoprop
  
   Aquí faltaría la lógica más compleja
   1. Cargar el contenido de la DB (supabase) en el useEffect inicial.
   2. Usar un Context para saber si el EditModeButton está activo.
  
  const handleInput = (e) = {
    setContent(e.target.innerText)
  }

  const handleBlur = async () = {
     Lógica para guardar en Supabase cuando el usuario hace blur (sale del campo)
     Esto es cuando el modo edición está activo.
    if (isEditing) {
      console.log(`Guardando ${identifier} ${content}`)
       Ejemplo de guardado
       await supabase.from('pagina_contenido').update({ texto content }).eq('key', identifier)
    }
  }

  return (
    Element
      contentEditable={isEditing}  Permite la edición si el modo está activo
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html content }}  Usar innerHTML para el contenido
      style={{ border isEditing  '1px dashed red'  'none' }}
    
  )
}