
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ open, onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ if(!open){ setMode('login'); setEmail(''); setPassword(''); } },[open]);

  if(!open) return null;

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    try{
      if(mode==='login'){ await signIn({ email, password }); onClose(); }
      else { await signUp({ email, password }); onClose(); }
    }catch(err){ alert('Error: ' + (err.message || JSON.stringify(err))); }
    finally{ setLoading(false); }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{mode==='login' ? 'Iniciar sesión' : 'Registrarse'}</h3>
          <button className="px-2 py-1 border rounded" onClick={onClose}>Cerrar</button>
        </div>
        <form onSubmit={submit} className="grid gap-3">
          <input className="border rounded px-3 py-2" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border rounded px-3 py-2" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="flex gap-2">
            <button className="bg-sky-500 text-white px-3 py-1 rounded" type="submit" disabled={loading}>{mode==='login' ? 'Entrar' : 'Crear cuenta'}</button>
            <button type="button" className="px-3 py-1 border rounded" onClick={()=>setMode(m=> m==='login' ? 'register' : 'login')}>{mode==='login' ? 'Registro' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
