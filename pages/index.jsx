import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from '../components/EditContext'
import Toolbar from '../components/Toolbar'

export default function Home(){
  const { editMode } = useEdit()
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [dragId, setDragId] = useState(null)
  const autosaveRef = useRef(null)

  useEffect(()=>{ load() }, [])

  async function load(){
    setLoading(true)
    const { data } = await supabase.from('pages').select('id, content').eq('slug','home').maybeSingle()
    if(data?.content) setBlocks(data.content)
    else setBlocks([{ id: 'b1', value: '<h2>Bienvenido</h2><p>Panel editable por admins</p>' }])
    setLoading(false)
  }

  function updateBlock(id, html){ setBlocks(prev => prev.map(b=> b.id===id ? {...b, value: html} : b)) }
  function addBlock(){ setBlocks(prev => [...prev, { id: 'b'+Date.now(), value: '<p>Nuevo bloque</p>' }]) }

  function onDragStart(e, id){ setDragId(id) }
  function onDragOver(e){ e.preventDefault() }
  function onDrop(e, targetId){ e.preventDefault(); if(!dragId) return; const from = blocks.findIndex(b=>b.id===dragId); const to = blocks.findIndex(b=>b.id===targetId); if(from===-1||to===-1) return; const arr = [...blocks]; const [it] = arr.splice(from,1); arr.splice(to,0,it); setBlocks(arr); setDragId(null) }

  async function save(auto=false){
    const upsert = { slug: 'home', content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if(error) return console.error('save error', error)
    // insert history only on manual save
    if(!auto){
      try{
        await supabase.from('page_history').insert({ page_id: data.id, editor: (await supabase.auth.getUser()).data.user.id, content: blocks })
      }catch(err){ console.error(err) }
      alert('Guardado')
    }
  }

  // autosave when editMode is on
  useEffect(()=>{
    if(editMode){
      autosaveRef.current = setInterval(()=> save(true), 10000)
    } else {
      if(autosaveRef.current) clearInterval(autosaveRef.current)
    }
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

  function exec(cmd, arg=null){ document.execCommand(cmd, false, arg) }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Inicio</h1>
        {editMode && (
          <div className="flex gap-2">
            <button onClick={addBlock} className="px-3 py-1 bg-purple-600 text-white rounded">+ Agregar</button>
            <button onClick={()=>save(false)} className="px-3 py-1 bg-green-600 text-white rounded">Guardar</button>
          </div>
        )}
      </div>

      {loading ? <p>Cargando...</p> : (
        <div className="relative">
          {blocks.map(b=> (
            <div key={b.id} draggable={editMode} onDragStart={e=>onDragStart(e,b.id)} onDrop={e=>onDrop(e,b.id)} onDragOver={onDragOver} className={`p-4 bg-white rounded shadow mb-3 ${editMode? 'border border-blue-300':''}`}>
              <div contentEditable={editMode} suppressContentEditableWarning onBlur={e=>updateBlock(b.id, e.target.innerHTML)} dangerouslySetInnerHTML={{ __html: b.value }} />
            </div>
          ))}
        </div>
      )}

      {editMode && <Toolbar onExec={exec} onImageUpload={onImageUpload} />}
    </div>
  )
}
