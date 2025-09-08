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
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-md w-full bg-white p-8 rounded-lg shadow'>
        <div className='text-center mb-6'>
          <div className='mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-xl'>PR</div>
          <h2 className='text-2xl font-semibold mt-3'>Iniciar sesión</h2>
          <p className='text-sm text-gray-500'>Accede con tu cuenta administrativa</p>
        </div>
        {error && <div className='bg-red-50 text-red-700 p-2 rounded mb-3'>{error}</div>}
        <form onSubmit={signIn} className='space-y-4'>
          <div>
            <label className='text-sm block mb-1'>Correo</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className='w-full p-3 border rounded' />
          </div>
          <div>
            <label className='text-sm block mb-1'>Contraseña</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type='password' className='w-full p-3 border rounded' />
          </div>
          <div className='flex items-center justify-between'>
            <a className='text-sm text-green-700 hover:underline' href='#'>¿Olvidaste tu contraseña?</a>
            <button className='button-primary'>Entrar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
