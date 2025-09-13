import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import PageEditor from './_pageEditor'
import { useEdit } from '../components/EditContext'

export default function Page(){
  const { editMode } = useEdit()
  const [page, setPage] = useState(null)
  const slug = "indicadores"

  useEffect(() => { load() }, [])
  async function load(){
    const { data } = await supabase.from('pages').select('content').eq('slug', slug).maybeSingle()
    if(data?.content) setPage(data.content)
    else setPage([{ id: "indicadores1", type: "text", value: "Contenido indicadores", x:40, y:40, width:360 }])
  }

  if(editMode) return <PageEditor slug={'indicadores'} defaultContent={page} />

  return (
    <div className='app-shell' style={{ paddingTop:24 }}>
      <h1 className='text-3xl font-bold mb-4'>Indicadores</h1>
      <div className='card p-6'>
        {page && page.map(b => (
          <div key={b.id} style={{ marginBottom:12 }}>
            {b.type==='text' && <div style={{ fontFamily: b.styles?.fontFamily || 'Inter', fontSize: b.styles?.fontSize || '16px', color: b.styles?.color || '#111827' }} dangerouslySetInnerHTML={{ __html: b.value }} />}
            {b.type==='image' && <img src={b.value} style={{ maxWidth:'100%' }} alt='' />}
            {b.type==='video' && <iframe src={b.value} style={{ width:'100%', height:360 }} frameBorder='0' allowFullScreen />}
            {b.type==='button' && <a href={b.link||'#'} className='button-primary'>{b.value}</a>}
          </div>
        ))}
      </div>
    </div>
  )
}
