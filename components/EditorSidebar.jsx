import { useEdit } from './EditContext'
export default function EditorSidebar({ blocks, setBlocks }){
  const { showSidebar } = useEdit()
  if(!showSidebar) return null
  return (<aside className='editor-sidebar'><div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}><div><strong>Editor</strong></div><div><button onClick={()=>{}}>Cerrar</button></div></div><div style={{ marginTop:12 }}>Panel de edición — Bloques / Propiedades</div></aside>)
}
