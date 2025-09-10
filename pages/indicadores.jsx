import PageEditor from './_pageEditor'
import { useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'

export default function Page(){
  const [edit,setEdit]=useState(false)
  useEffect(()=>{ if(typeof window!=='undefined' && window.location.search.includes('edit=1')) setEdit(true) },[])
  if(edit) return <PageEditor slug='indicadores' />
  return <PageWrapper title="Indicadores">Contenido público indicadores</PageWrapper>
}
