import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
export default function AuthForm(){
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      if(mode==='login') await signIn({ email, password });
      else await signUp({ email, password });
      alert('Revisa tu correo si es registro o ya estás logueado.');
    }catch(err){ alert('Error: ' + err.message); }finally{ setLoading(false); }
  }
  return (
    <form onSubmit={submit} style={{maxWidth:420,margin:'0 auto',display:'grid',gap:10}}>
      <h2>{mode==='login' ? 'Iniciar sesión' : 'Registrarse'}</h2>
      <input placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{display:'flex',gap:8}}>
        <button className="btn" type="submit" disabled={loading}>{mode==='login' ? 'Entrar' : 'Crear cuenta'}</button>
        <button className="btn secondary" type="button" onClick={()=>setMode(m=> m==='login' ? 'register' : 'login')}>{mode==='login' ? 'Registro' : 'Login'}</button>
      </div>
      <div style={{marginTop:8}} className="info">También puedes iniciar con Google (si lo configuras en Supabase).</div>
    </form>
  );
}
