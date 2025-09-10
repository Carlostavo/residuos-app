import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import EditorShell from '../components/EditorShell'
import debounce from 'lodash.debounce'
export default function PageEditor({ slug='home' }){
  const [blocks, setBlocks] = useState([])
  const [pageId, setPageId] = useState(null)
  const channelRef = useRef(null)
  useEffect(()=>{ load(); window.addEventListener('editor:add', onAdd); window.addEventListener('editor:delete', onDelete); return ()=>{ window.removeEventListener('editor:add', onAdd); window.removeEventListener('editor:delete', onDelete); if(channelRef.current) channelRef.current.unsubscribe() } }, [])
  async function load(){ const { data } = await supabase.from('pages').select('id,content').eq('slug', slug).maybeSingle(); if(data?.content){ setBlocks(data.content); setPageId(data.id) } else { const initial = [{ id:'b'+Date.now(), type:'text', value:'Bienvenido a la plataforma', x:40, y:40, width:480 }]; setBlocks(initial) }
    // subscribe realtime changes for this slug
    channelRef.current = supabase.channel('realtime-pages').on('postgres_changes', { event: '*', schema: 'public', table: 'pages', filter: `slug=eq.${slug}` }, payload=>{ if(payload.eventType==='UPDATE' || payload.eventType==='INSERT'){ const newC = payload.new.content; if(newC) setBlocks(newC) } }).subscribe()
  }
  const autosave = useRef(debounce(async (snapshot)=>{ if(!snapshot) return; const upsert = { slug, content: snapshot, updated_at: new Date().toISOString() }; const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle(); if(error) console.error('autosave error', error); else { await supabase.from('page_history').insert({ page_id: data.id, content: snapshot }) } }, 800)).current
  useEffect(()=>{ window.dispatchEvent(new CustomEvent('editor:blocks',{ detail: blocks })); autosave(blocks) }, [blocks])
  function onAdd(e){ const type = e.detail.type; const id='b'+Date.now(); const b = { id, type, value: type==='text'? 'Nuevo texto' : type==='image'? 'https://via.placeholder.com/600x360' : type==='video'? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : 'Botón', x:60, y:60, width:360, styles:{} }; setBlocks(p=> [...p,b]) }
  function onDelete(e){ const id = e.detail; setBlocks(p=> p.filter(b=> b.id!==id)) }
  function updateBlock(id, patch){ setBlocks(p=> p.map(b=> b.id===id? {...b, ...patch} : b)) }
  return <EditorShell blocks={blocks} setBlocks={setBlocks} updateBlock={updateBlock} pageId={pageId} />
}
