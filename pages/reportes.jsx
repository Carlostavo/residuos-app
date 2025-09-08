import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
export default function Reportes(){
  const [reports, setReports] = useState([])
  useEffect(()=>{ fetchReports() },[])
  async function fetchReports(){
    const { data, error } = await supabase.from('reportes').select('*').order('created_at',{ascending:false})
    if(error) console.error(error)
    else setReports(data || [])
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reportes</h2>
        <p className="text-sm text-gray-500">Generar y descargar reportes.</p>
      </div>
      <div className="space-y-3">
        {reports.length===0 && <div className="p-4 bg-white rounded shadow">No hay reportes aún.</div>}
        {reports.map(r => (
          <div key={r.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-gray-600">{r.summary}</p>
              <p className="text-xs text-gray-400">Creado: {new Date(r.created_at).toLocaleString()}</p>
            </div>
            <div>
              <a className="text-green-600 hover:underline" href={r.file_url || '#'} target="_blank" rel="noreferrer">Descargar</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
