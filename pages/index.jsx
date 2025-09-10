import PageEditor from './_pageEditor'
import { useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'

export default function Home(){
  const [edit,setEdit]=useState(false)
  useEffect(()=>{ if(typeof window!=='undefined' && window.location.search.includes('edit=1')) setEdit(true) },[])
  if(edit) return <PageEditor slug='home' />
  return <PageWrapper title="Inicio">Contenido público - añade ?edit=1 para probar editor</PageWrapper>
}
