
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
export default function Layout({children}){
  const [user,setUser]=useState(null);
  useEffect(()=>{ supabase.auth.getSession().then(r=>setUser(r.data.session?.user??null)); const s=supabase.auth.onAuthStateChange((_,session)=>setUser(session?.user??null)); return ()=>s.data?.subscription?.unsubscribe(); },[]);
  async function logout(){ await supabase.auth.signOut(); window.location.href='/'; }
  return (<><header className="topbar"><div className="brand">♻️ Gestión RS</div><nav className="nav"><Link href='/'><a>Inicio</a></Link><Link href='/indicadores'><a>Indicadores</a></Link><Link href='/formularios'><a>Formularios</a></Link>{!user?(<Link href='/login'><button className='btn btn-primary'>Iniciar sesión</button></Link>):(<><span style={{fontWeight:700}}>{user.email}</span><button className='btn' onClick={logout}>Cerrar sesión</button></>)}</nav></header><main className='container'>{children}</main></>);
}
