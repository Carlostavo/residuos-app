import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import MetaForm from '../components/MetaForm'
export default function Metas(){
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  useEffect(()=> {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const sub = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    fetchMetas()
    return () => sub.subscription.unsubscribe()
  },[])
  async function fetchMetas(){
    setLoading(true)
    // select metas with owner name from profiles
    const { data, error } = await supabase
      .from('metas')
      .select('id, title, description, owner, created_at')
      .order('created_at', { ascending: false })
    if (error) console.error(error)
    else setMetas(data || [])
    setLoading(false)
  }
  async function removeMeta(id){
    const { error } = await supabase.from('metas').delete().eq('id', id)
    if (error) return alert(error.message)
    fetchMetas()
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Metas</h2>
        <MetaForm onSaved={fetchMetas} user={user} />
      </div>
      {loading ? <p>Cargando...</p> : (
        <div className="space-y-3">
          {metas.length===0 && <div className="p-4 bg-white rounded shadow">No hay metas aún.</div>}
          {metas.map(m => (
            <div key={m.id} className="p-4 bg-white rounded shadow flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-gray-600">{m.description}</p>
                <p className="text-xs text-gray-400 mt-2">Creada: {new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={()=>removeMeta(m.id)} className="text-red-600 text-sm">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
