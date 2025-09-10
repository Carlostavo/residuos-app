import PageEditor from './_pageEditor'
import { useEffect, useState } from 'react'
import PageWrapper from '../components/PageWrapper'

export default function Page(){
  const [edit,setEdit]=useState(false)
  useEffect(()=>{ if(typeof window!=='undefined' && window.location.search.includes('edit=1')) setEdit(true) },[])
  if(edit) return <PageEditor slug='formulario' />
  return <PageWrapper title="Formulario">Contenido público formulario</PageWrapper>
}
