import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function MetaForm({ onSaved, user }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  async function save(e){
    e.preventDefault()
    if(!title) return alert('Ingresa un título')
    const owner = user?.id ?? null
    const { error } = await supabase.from('metas').insert([{ title, description, owner }])
    if(error) return alert(error.message)
    setTitle(''); setDescription(''); setOpen(false)
    if(onSaved) onSaved()
  }
  return (
    <div>
      <button onClick={()=>setOpen(true)} className="bg-blue-600 text-white px-3 py-1 rounded">Nueva Meta</button>
      {open && (
        <div className="mt-3 p-4 bg-white rounded shadow">
          <form onSubmit={save}>
            <label className="block">Título</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-2 rounded border mb-2" />
            <label className="block">Descripción</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-2 rounded border mb-2" />
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded">Guardar</button>
              <button type="button" onClick={()=>setOpen(false)} className="px-3 py-1 rounded border">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
