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
      content: '<p>Editar texto...</p>',
      x: 20,
      y: 20,
      width: 320,
      height: 160
    }
    const { error } = await supabase.from('elements').insert(newCard)
    if (error) console.error('insert error', error)
  }

  return (
    <aside style={{position:'fixed', right:16, top:96, width:220, zIndex:60}}>
      <div className='card'>
        <button className='btn btn-primary' onClick={addText} style={{width:'100%'}}>Agregar texto</button>
        <hr style={{margin:'12px 0'}}/>
        <div style={{fontSize:13}}>Herramientas:</div>
        <ul style={{marginTop:8}}>
          <li>Arrastrar y redimensionar</li>
          <li>Maximizar / Minimizar</li>
          <li>Editar texto en sitio</li>
          <li>Persistencia automática</li>
        </ul>
      </div>
    </aside>
  )
}
