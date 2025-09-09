import { useState } from 'react'
import EditorShell from '../components/EditorShell'
export default function PageEditor({ slug='home' }){
  const [blocks, setBlocks] = useState([{ id:'b1', type:'text', value:'Bienvenido', x:40, y:40, width:360 }])
  async function save(){ alert('Guardar implementa supabase upsert') }
  return <EditorShell blocks={blocks} setBlocks={setBlocks} onSave={save} />
}
