import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from '../components/EditContext'
import Toolbar from '../components/Toolbar'

export default function PageEditor({ slug, title, defaultContent }){
  const { editMode } = useEdit()
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const autosaveRef = useRef(null)

  useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    const { data } = await supabase.from('pages').select('id, content').eq('slug', slug).maybeSingle()
    if(data?.content) setBlocks(data.content)
    else setBlocks(defaultContent)
    setLoading(false)
  }

  function updateBlock(id, html){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, value: html} : b)) }
  function addBlock(){ setBlocks(prev=> [...prev, { id:'b'+Date.now(), value: '<p>Nuevo bloque</p>' }]) }

  async function save(auto=false){
    const upsert = { slug, content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if(error) return console.error('save error', error)
    if(!auto){
      try{ await supabase.from('page_history').insert({ page_id: data.id, editor: (await supabase.auth.getUser()).data.user.id, content: blocks }) }catch(err){ console.error(err) }
      alert('Guardado')
    }
  }

  useEffect(()=>{
    if(editMode){ autosaveRef.current = setInterval(()=> save(true), 10000) }
    else { if(autosaveRef.current) clearInterval(autosaveRef.current) }
    return ()=> autosaveRef.current && clearInterval(autosaveRef.current)
  }, [editMode, blocks])

  async function onImageUpload(e){
    const file = e.target.files?.[0]
    if(!file) return
    const path = `images/blocks/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('images').upload(path, file)
    if(error) return alert(error.message)
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/images/${data.path}`
    document.execCommand('insertImage', false, publicUrl)
  }

  function exec(cmd,arg=null){ document.execCommand(cmd, false, arg) }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {editMode && <div className="flex gap-2"><button onClick={addBlock} className="px-3 py-1 bg-purple-600 text-white rounded">+ Agregar</button><button onClick={()=>save(false)} className="px-3 py-1 bg-green-600 text-white rounded">Guardar</button></div>}
      </div>
      {loading ? <p>Cargando...</p> : (
        <div>
          {blocks.map(b=> (
            <div key={b.id} className={`p-4 bg-white rounded shadow mb-3 ${editMode? 'border border-blue-300':''}`}>
              <div contentEditable={editMode} suppressContentEditableWarning onBlur={e=>updateBlock(b.id, e.target.innerHTML)} dangerouslySetInnerHTML={{ __html: b.value }} />
            </div>
          ))}
        </div>
      )}
      {editMode && <Toolbar onExec={exec} onImageUpload={onImageUpload} />}
    </div>
  )
}
