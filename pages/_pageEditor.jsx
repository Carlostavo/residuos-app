import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useEdit } from '../components/EditContext'
import EditorShell from '../components/EditorShell'

function debounce(fn, wait){ let t; return (...a)=>{ clearTimeout(t); t = setTimeout(()=> fn(...a), wait) } }

export default function PageEditor({ slug, title, defaultContent }){
  const { editMode } = useEdit()
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageId, setPageId] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const localVersion = useRef(Date.now())
  const saveDebounced = useRef(null)
  const channelRef = useRef(null)

  useEffect(()=>{ load(); return ()=> { if(channelRef.current) channelRef.current.unsubscribe() } }, [])

  async function load(){
    setLoading(true)
    const { data } = await supabase.from('pages').select('id, content, updated_at, slug').eq('slug', slug).maybeSingle()
    if(data?.content){ setBlocks(data.content); setPageId(data.id) }
    else setBlocks(defaultContent)
    setLoading(false)
    subscribeRealtime()
  }

  function applyRemote(newContent, sourceUpdatedAt){
    // if remote update is newer than our last local change, apply
    if(!sourceUpdatedAt) return
    const remoteTs = new Date(sourceUpdatedAt).getTime()
    if(remoteTs > (localVersion.current||0)){
      setBlocks(newContent)
    }
  }

  function subscribeRealtime(){
    if(channelRef.current) channelRef.current.unsubscribe()
    const ch = supabase.channel('realtime-pages-'+slug)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pages', filter: `slug=eq.${slug}` }, payload => {
        const ev = payload.eventType
        if(ev === 'UPDATE' || ev === 'INSERT'){
          const newRow = payload.new
          applyRemote(newRow.content, newRow.updated_at)
        }
      })
      .subscribe()
    channelRef.current = ch
  }

  async function doSave(auto=false){
    // optimistic local save marker
    localVersion.current = Date.now()
    const upsert = { slug, content: blocks, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id, updated_at').maybeSingle()
    if(error) return console.error('save error', error)
    setPageId(data.id)
    if(!auto){ try{ const u = await supabase.auth.getUser(); await supabase.from('page_history').insert({ page_id: data.id, editor: u.data.user.id, content: blocks }) }catch(err){ console.error(err) } }
  }

  // debounced save on blocks change
  useEffect(()=>{
    if(!saveDebounced.current) saveDebounced.current = debounce(()=> doSave(true), 700)
    // only autosave when editMode
    if(editMode){ saveDebounced.current() }
  }, [blocks])

  // manual save handler
  async function saveManual(){ await doSave(false); alert('Guardado manual') }

  function onPreview(){ window.open('/api/preview?slug='+slug, '_blank') }
  function onHistory(){ window.location.href = '/historial/'+slug }

  return (
    <div className='app-shell'>
      <h1 className='text-2xl font-bold mb-4'>{title}</h1>
      <EditorShell blocks={blocks} setBlocks={setBlocks} pageId={pageId} onSave={saveManual} onPreview={onPreview} onHistory={onHistory} selectedId={selectedId} setSelectedId={setSelectedId} />
    </div>
  )
}
