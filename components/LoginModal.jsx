import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Modal({ children, onClose }){
  useEffect(()=>{
    function onKey(e){ if(e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return ()=> document.removeEventListener('keydown', onKey)
  },[onClose])
  if (typeof window === 'undefined') return null
  return createPortal(
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }}>
      <div style={{ background:'#fff', padding:20, borderRadius:8, width:'100%', maxWidth:420 }}>{children}</div>
    </div>,
    document.body
  )
}

export default function LoginModal({ onClose }){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)

  async function signIn(e){
    e.preventDefault()
    setLoading(true); setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:'center', marginBottom:12 }}>
        <div style={{ width:56, height:56, borderRadius:999, background:'#ecfdf5', color:'#065f46', display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>PR</div>
        <h3 style={{ marginTop:8 }}>Iniciar sesión</h3>
        <p style={{ color:'#64748b' }}>Usa tu cuenta administrativa</p>
      </div>
      {error && <div style={{ background:'#fff1f2', color:'#b91c1c', padding:8, borderRadius:6, marginBottom:8 }}>{error}</div>}
      <form onSubmit={signIn}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo" className="w-full p-3 border rounded mb-2" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Contraseña" className="w-full p-3 border rounded mb-2" />
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
          <button type="button" onClick={onClose} className="px-3 py-1 rounded border">Cancelar</button>
          <button className="button-primary" disabled={loading}>{loading ? 'Cargando...' : 'Entrar'}</button>
        </div>
      </form>
    </Modal>
  )
}
