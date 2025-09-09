import PageEditor from './_pageEditor'
import { useState } from 'react'
export default function Page(){ const [edit,setEdit] = useState(false); return (<div style={ padding:24 }><h1 className='text-3xl font-bold mb-4'>Metas</h1><div className='card p-6'>Contenido público metas</div></div>) }
