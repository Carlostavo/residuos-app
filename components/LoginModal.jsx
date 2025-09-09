import { createPortal } from 'react-dom'
import { useEffect } from 'react'
export default function LoginModal({ onClose }){
  useEffect(()=>{ function k(e){ if(e.key==='Escape') onClose() } document.addEventListener('keydown',k); return ()=> document.removeEventListener('keydown',k) },[])
  if(typeof window==='undefined') return null
  return createPortal(<div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ background:'#fff', padding:20, borderRadius:8, width:420 }}>Login modal (implement supabase auth)</div></div>, document.body)
}
