'use client'
import Header from '../components/Header'
import { useAuth, hasRole } from '../lib/useAuth'

export default function Reportes() {
  const { user, loading } = useAuth()
  if (!loading && !hasRole(user, ['admin','tecnico'])) {
    return <div className='container card' style={{padding:20}}>No autorizado</div>
  }
  return (
    <div>
      <Header />
      <main className='container'>
        <h1>Reportes (solo para admin/tecnico)</h1>
        <p className='card'>Contenido de reportes...</p>
      </main>
    </div>
  )
}
