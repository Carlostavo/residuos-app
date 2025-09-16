
import { useState } from 'react'; import { supabase } from '../lib/supabaseClient'; import { useRouter } from 'next/router';
export default function Login(){ const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const router=useRouter();
  async function handleLogin(e){ e.preventDefault(); const { error } = await supabase.auth.signInWithPassword({ email, password }); if(error){ alert(error.message); return; } router.push('/'); }
  return (<div className="login-page"><form onSubmit={handleLogin} className="login-form"><h2>Iniciar sesión</h2><input placeholder='Correo' value={email} onChange={e=>setEmail(e.target.value)} /><input type='password' placeholder='Contraseña' value={password} onChange={e=>setPassword(e.target.value)} /><button className='btn-primary' type='submit'>Entrar</button></form></div>); }
