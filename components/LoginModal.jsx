import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Modal({ children, onClose }){
  useEffect(()=>{
    function onKey(e){ if(e.key==='Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  },[])
  if(typeof window==='undefined') return null
  return createPortal(
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow max-w-md w-full p-6'>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default function LoginModal({ onClose }){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState(null)
  const [loading,setLoading]=useState(false)

  async function signIn(e){
    e.preventDefault(); setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if(error) return setError(error.message)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <div className='text-center mb-4'>
        <div className='mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-xl'>PR</div>
        <h3 className='text-lg font-semibold mt-3'>Iniciar sesión</h3>
        <p className='text-sm text-gray-500'>Accede con tu cuenta administrativa</p>
      </div>
      {error && <div className='bg-red-50 text-red-700 p-2 rounded mb-3'>{error}</div>}
      <form onSubmit={signIn} className='space-y-3'>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Correo' className='w-full p-3 border rounded' />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='Contraseña' type='password' className='w-full p-3 border rounded' />
        <div className='flex justify-between items-center'>
          <a className='text-sm text-green-700 hover:underline' href='#'>¿Olvidaste tu contraseña?</a>
          <div className='flex gap-2'>
            <button type='button' onClick={onClose} className='px-3 py-1 rounded border'>Cancelar</button>
            <button className='button-primary' disabled={loading}>{loading? 'Cargando...' : 'Entrar'}</button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
