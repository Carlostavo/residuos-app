import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState(null)
  const router = useRouter()
  const signIn = async e=>{ e.preventDefault(); const { error } = await supabase.auth.signInWithPassword({ email, password}); if(error) return setError(error.message); router.push('/') }
  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      {error && <div className="bg-red-50 text-red-700 p-2 rounded mb-3">{error}</div>}
      <form onSubmit={signIn}>
        <label className="block mb-2">Correo</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 rounded border" />
        <label className="block mt-4 mb-2">Contraseña</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full p-2 rounded border" />
        <button className="mt-4 w-full bg-green-600 text-white p-2 rounded">Entrar</button>
      </form>
    </div>
  )
}
