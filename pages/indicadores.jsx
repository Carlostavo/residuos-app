import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Table from '../components/Table'
export default function Indicadores(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ fetchIndicadores() },[])
  async function fetchIndicadores(){
    setLoading(true)
    const { data, error } = await supabase.from('indicadores').select('*').order('created_at', {ascending:false})
    if(error) console.error(error)
    else setItems(data || [])
    setLoading(false)
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Indicadores</h2>
        <p className="text-sm text-gray-500">Listado de indicadores del proyecto.</p>
      </div>
      {loading ? <p>Cargando...</p> : <Table columns={['nombre','descripcion','valor','fecha']} data={items} />}
    </div>
  )
}
