import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Home(){
  const [page, setPage] = useState([])
  useEffect(()=>{ async function load(){ const { data } = await supabase.from('pages').select('content').eq('slug','home').maybeSingle(); if(data?.content) setPage(data.content); else setPage([{ id:'b1', type:'text', value:'<p>Bienvenido a la plataforma</p>', x:40, y:40, width:360 }]) } load() }, [])
  return (
    <div style={{padding:24}}>
      <h1 style={{fontSize:28}}>Inicio</h1>
      <div style={{marginTop:12}}>
        {page.map(b=> (
          <div key={b.id} style={{marginBottom:12}}>
            {b.type==='text' && <div style={{fontFamily: b.styles?.fontFamily||'Inter', fontSize: b.styles?.fontSize||'16px', color: b.styles?.color||'#111827'}} dangerouslySetInnerHTML={{__html:b.value}} />}
            {b.type==='image' && <img src={b.value} style={{maxWidth:'100%'}} alt='' />}
            {b.type==='video' && <div style={{width:'100%'}}><iframe src={b.value} style={{width:'100%',height:360}} frameBorder='0' allowFullScreen /></div>}
            {b.type==='button' && <a href={b.link||'#'} className='button-primary'>{b.value}</a>}
          </div>
        ))}
      </div>
    </div>
  )
}
