// components/LoginModal.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ open, onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if(!open) return null;

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      if(mode==='login'){
        await signIn({ email, password });
        alert('Sesión iniciada.');
        onClose();
      } else {
        await signUp({ email, password });
        alert('Cuenta creada. Revisa tu correo.');
        onClose();
      }
    }catch(err){
      alert('Error: ' + (err.message || err.error_description || JSON.stringify(err)));
    }finally{
      setLoading(false);
    }
  }

  return (
    <div style={{
      position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(2,6,23,0.45)', zIndex:200
    }}>
      <div style={{width:420, background:'#fff', borderRadius:12, padding:18, boxShadow:'0 12px 40px rgba(2,6,23,0.2)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', marginBottom:8}}>
          <h3 style={{margin:0}}>{mode==='login' ? 'Iniciar sesión' : 'Registrarse'}</h3>
          <button onClick={onClose} className="btn secondary">Cerrar</button>
        </div>
        <form onSubmit={submit} style={{display:'grid', gap:8}}>
          <input placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{display:'flex', gap:8}}>
            <button className="btn" type="submit" disabled={loading}>{mode==='login' ? 'Entrar' : 'Crear cuenta'}</button>
            <button type="button" className="btn secondary" onClick={()=>setMode(m=> m==='login' ? 'register' : 'login')}>{mode==='login' ? 'Registro' : 'Login'}</button>
          </div>
          <div style={{marginTop:6}} className="info">También puedes iniciar con proveedores sociales si los configuras en Supabase.</div>
        </form>
      </div>
    </div>
  );
}
