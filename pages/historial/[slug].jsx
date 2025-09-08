import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
export default function HistorialPage(){
  const router = useRouter(); const { slug } = router.query
  const [history, setHistory] = useState([])
  useEffect(()=>{ if(slug) load() }, [slug])
  async function load(){
    const page = await supabase.from('pages').select('id').eq('slug', slug).maybeSingle()
    if(!page.data?.id) return setHistory([])
    const { data } = await supabase.from('page_history').select('id, editor, created_at').eq('page_id', page.data.id).order('created_at',{ascending:false})
    setHistory(data || [])
  }
  async function restore(id){ const { data } = await supabase.from('page_history').select('content').eq('id', id).maybeSingle(); if(!data) return; await supabase.from('pages').upsert({ slug, content: data.content }); alert('Restaurado'); }
  return (
    <div className='app-shell'>
      <h2 className='text-2xl font-bold mb-4'>Historial: {slug}</h2>
      {history.length===0 ? <div className='card p-4'>No hay entradas.</div> : (
        <div className='space-y-2'>
          {history.map(h=> (
            <div key={h.id} className='card p-3 flex justify-between items-center'>
              <div>
                <div className='text-sm'>Editor: {h.editor}</div>
                <div className='text-xs text-gray-500'>Fecha: {new Date(h.created_at).toLocaleString()}</div>
              </div>
              <div><button onClick={()=>restore(h.id)} className='px-3 py-1 bg-blue-600 text-white rounded'>Restaurar</button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
