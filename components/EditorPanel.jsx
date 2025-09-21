'use client'
import { useEditor } from './EditorContext'
import { supabase } from '../lib/supabaseClient'

export default function EditorPanel({ pageSlug }) {
  const { editMode } = useEditor()

  if (!editMode) return null

  const addText = async () => {
    const newCard = {
      page_slug: pageSlug,
      type: 'text',
      title: 'Nuevo texto',
      content: '<p>Edita este texto...</p>',
      x: Math.random() * 200,
      y: Math.random() * 200,
      width: 320,
      height: 160,
      maximized: false
    }
    
    const { error } = await supabase.from('elements').insert(newCard)
    if (error) {
      console.error('Error adding text:', error)
      alert('Error al agregar texto')
    }
  }

  return (
    <aside style={{
      position: 'fixed', 
      right: 16, 
      top: 96, 
      width: 220, 
      zIndex: 60,
      background: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div className='card'>
        <button 
          className='btn btn-primary' 
          onClick={addText} 
          style={{width: '100%', marginBottom: '12px'}}
        >
          + Agregar texto
        </button>
        
        <hr style={{margin: '12px 0', borderColor: '#e2e8f0'}}/>
        
        <div style={{fontSize: 14, fontWeight: 'bold', marginBottom: '8px'}}>
          Instrucciones:
        </div>
        
        <ul style={{
          margin: 0,
          paddingLeft: '16px',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#64748b'
        }}>
          <li>Arrastra para mover</li>
          <li>Esquinas para redimensionar</li>
          <li>Haz clic para editar texto</li>
          <li>Guarda automáticamente</li>
        </ul>
      </div>
    </aside>
  )
}
