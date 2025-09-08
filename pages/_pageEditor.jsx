import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from '../components/EditContext'
import EditorShell from '../components/EditorShell'

export default function PageEditor({ slug, title, defaultContent }){
  const { editMode } = useEdit()
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageId, setPageId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    const { data } = await supabase.from('pages').select('id, content').eq('slug', slug).maybeSingle()
    if(data?.content){ setBlocks(data.content); setPageId(data.id) }
    else setBlocks(defaultContent)
    setLoading(false)
  }

  async function save(auto=false){
    const upsert = { slug, content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if(error) return console.error('save error', error)
    setPageId(data.id)
    if(!auto){ try{ const user = (await supabase.auth.getUser()).data.user; await supabase.from('page_history').insert({ page_id: data.id, editor: user.id, content: blocks }) }catch(err){ console.error(err) } }
    alert('Guardado')
  }

  function onPreview(){ window.open('/api/preview?slug='+slug, '_blank') }
  function onHistory(){ window.location.href = '/historial/'+slug }

  async function onImageUpload(e){ const file = e.target.files?.[0]; if(!file) return; const path = `images/blocks/${Date.now()}-${file.name}`; const { data, error } = await supabase.storage.from('images').upload(path, file); if(error) return alert(error.message); const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/images/${data.path}`; setBlocks(prev => [...prev, { id:'b'+Date.now(), type:'image', value: publicUrl, x:20, y:20, width:400 }]) }

  useEffect(()=>{
    if(editMode){ const t = setInterval(()=> save(true), 10000); return ()=> clearInterval(t) }
  }, [editMode, blocks])

  return (
    <div className='app-shell'>
      <h1 className='text-2xl font-bold mb-4'>{title}</h1>
      <EditorShell blocks={blocks} setBlocks={setBlocks} pageId={pageId} onSave={()=>save(false)} onPreview={onPreview} onHistory={onHistory} selectedId={selectedId} setSelectedId={setSelectedId} />
    </div>
  )
}
