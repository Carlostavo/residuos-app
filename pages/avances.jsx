import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Table from '../components/Table'
export default function Avances(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ fetchAvances() },[])
  async function fetchAvances(){
    setLoading(true)
    const { data, error } = await supabase.from('avances').select('*').order('created_at', {ascending:false})
    if(error) console.error(error)
    else setItems(data || [])
    setLoading(false)
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Avances</h2>
        <p className="text-sm text-gray-500">Registro de avances por actividad.</p>
      </div>
      {loading ? <p>Cargando...</p> : <Table columns={['actividad','detalle','responsable','fecha']} data={items} />}
    </div>
  )
}
