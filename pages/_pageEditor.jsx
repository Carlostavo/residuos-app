import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import EditorShell from '../components/EditorShell'
import { useEdit } from '../components/EditContext'

export default function PageEditor({ slug='home', title='Página' , defaultContent = [{ id:'b1', type:'text', value:'Bienvenido a la plataforma', x:40, y:40, width:360 }] }){
  const { editMode } = useEdit()
  const [blocks, setBlocks] = useState([])
  const [pageId, setPageId] = useState(null)

  useEffect(()=>{ load() }, [])
  async function load(){
    const { data } = await supabase.from('pages').select('id, content').eq('slug', slug).maybeSingle()
    if(data?.content){ setBlocks(data.content); setPageId(data.id) } else setBlocks(defaultContent)
  }

  async function save(){
    const upsert = { slug, content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if(error) return console.error('save error', error)
    setPageId(data.id)
    alert('Guardado')
  }

  function preview(){ window.open('/', '_blank') }
  function history(){ window.location.href = '/historial/'+slug }

  return (
    <div>
      <EditorShell blocks={blocks} setBlocks={setBlocks} pageId={pageId} onSave={save} onPreview={preview} onHistory={history} />
    </div>
  )
}
