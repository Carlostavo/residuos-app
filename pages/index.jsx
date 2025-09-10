import PageEditor from './_pageEditor'
import { useEffect, useState } from 'react'
export default function Home(){ const [edit,setEdit]=useState(false); useEffect(()=>{ if(typeof window!=='undefined' && window.location.search.includes('edit=1')) setEdit(true) },[]); if(edit) return <PageEditor slug='home' />; return (<div style={{ padding:24 }}><h1 className='text-3xl font-bold mb-4'>Inicio</h1><div className='card p-6'>Contenido público - use ?edit=1 to test editor</div></div>) }
