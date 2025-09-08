import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from '../components/EditContext'
import Toolbar from '../components/Toolbar'
import CanvasBlock from '../components/CanvasBlock'

export default function PageEditor({ slug, title, defaultContent }){
  const { editMode } = useEdit()
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageId, setPageId] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    const { data } = await supabase.from('pages').select('id, content').eq('slug', slug).maybeSingle()
    if(data?.content){ setBlocks(data.content); setPageId(data.id) }
    else setBlocks(defaultContent)
    setLoading(false)
  }

  function updateBlock(id, html){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, value: html} : b)) }
  function addBlock(){ setBlocks(prev=> [...prev, { id:'b'+Date.now(), value: '<p>Nuevo bloque</p>', x:20, y:20, width:320 }]) }
  function onUpdatePos(id, pos){ setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...pos} : b)) }

  async function save(auto=false){
    const upsert = { slug, content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if(error) return console.error('save error', error)
    setPageId(data.id)
    if(!auto){ try{ const user = (await supabase.auth.getUser()).data.user; await supabase.from('page_history').insert({ page_id: data.id, editor: user.id, content: blocks }) }catch(err){ console.error(err) } }
  }

  useEffect(()=>{
    if(editMode){ const t = setInterval(()=> save(true), 10000); return ()=> clearInterval(t) }
  }, [editMode, blocks])

  async function onImageUpload(e){ const file = e.target.files?.[0]; if(!file) return; const path = `images/blocks/${Date.now()}-${file.name}`; const { data, error } = await supabase.storage.from('images').upload(path, file); if(error) return alert(error.message); const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/,'')}/storage/v1/object/public/images/${data.path}`; document.execCommand('insertImage', false, publicUrl) }
  function exec(cmd,arg=null){ document.execCommand(cmd, false, arg) }

  async function openHistory(){ if(!pageId) return alert('Guarda la página primero'); const { data } = await supabase.from('page_history').select('id, editor, created_at').eq('page_id', pageId).order('created_at',{ascending:false}); setHistory(data || []); setShowHistory(true) }
  async function restore(id){ const { data } = await supabase.from('page_history').select('content').eq('id', id).maybeSingle(); if(!data) return; setBlocks(data.content); await save(false); setShowHistory(false); alert('Restaurado') }

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <div className='flex gap-2'>
          {editMode && <button onClick={addBlock} className='px-3 py-1 bg-purple-600 text-white rounded'>+ Bloque</button>}
          {editMode && <button onClick={()=>save(false)} className='px-3 py-1 bg-green-600 text-white rounded'>Guardar</button>}
          {editMode && <button onClick={openHistory} className='px-3 py-1 bg-gray-100 rounded'>Historial</button>}
        </div>
      </div>
      {loading ? <p>Cargando...</p> : (
        <div className='relative' style={{ height: '70vh', border: '1px dashed rgba(15,23,42,0.06)', borderRadius:12, padding:12, background:'linear-gradient(180deg,#fff,#f8fafc)'}}>
          {blocks.map(b=> <CanvasBlock key={b.id} block={b} editMode={editMode} onChange={updateBlock} onUpdatePos={onUpdatePos} />)}
        </div>
      )}

      {editMode && <Toolbar onExec={exec} onImageUpload={onImageUpload} />}

      {showHistory && (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded max-w-2xl w-full'>
            <h3 className='text-lg font-semibold mb-3'>Historial de la página</h3>
            <div className='space-y-2 max-h-80 overflow-auto'>
              {history.map(h=> (
                <div key={h.id} className='p-3 border rounded flex justify-between items-center'>
                  <div>
                    <div className='text-sm text-gray-600'>Editor: {h.editor}</div>
                    <div className='text-xs text-gray-400'>Fecha: {new Date(h.created_at).toLocaleString()}</div>
                  </div>
                  <div className='flex gap-2'>
                    <button onClick={()=>restore(h.id)} className='px-3 py-1 bg-blue-600 text-white rounded'>Restaurar</button>
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4 text-right'><button onClick={()=>setShowHistory(false)} className='px-3 py-1 rounded bg-gray-200'>Cerrar</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
