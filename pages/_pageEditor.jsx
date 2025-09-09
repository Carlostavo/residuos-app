import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import EditorShell from '../components/EditorShell'
export default function PageEditor(){
  const [blocks, setBlocks] = useState([])
  useEffect(()=>{ async function load(){ const { data } = await supabase.from('pages').select('content').eq('slug','home').maybeSingle(); if(data?.content) setBlocks(data.content); else setBlocks([{ id:'b1', type:'text', value:'<p>Bienvenido a la plataforma</p>', x:40, y:40, width:360 }]) } load() }, [])
  return (<EditorShell blocks={blocks} setBlocks={setBlocks} pageId={null} />)
}
