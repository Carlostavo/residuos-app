import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import EditorShell from '../components/EditorShell'
import debounce from 'lodash.debounce'

export default function PageEditor({ slug='home' }){
  const [blocks, setBlocks] = useState([])
  const autosave = useRef(debounce(async (snapshot)=>{
    if(!snapshot) return
    const upsert = { slug, content: snapshot, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('pages').upsert(upsert).select('id').maybeSingle()
    if(error) console.error(error)
    else {
      await supabase.from('page_history').insert({ page_id: data.id, content: snapshot })
    }
  }, 700)).current

  useEffect(()=>{ load() }, [])
  async function load(){
    const { data } = await supabase.from('pages').select('id, content').eq('slug', slug).maybeSingle()
    if(data?.content){
      setBlocks(data.content)
    } else {
      setBlocks([{ id:'b'+Date.now(), type:'text', value:'Bienvenido a la plataforma', x:40, y:40, width:480 }])
    }
  }

  useEffect(()=>{ autosave(blocks) }, [blocks])

  function updateBlock(id, patch){
    setBlocks(prev=> prev.map(b=> b.id===id? {...b, ...patch} : b))
  }

  return <EditorShell blocks={blocks} setBlocks={setBlocks} updateBlock={updateBlock} />
}
