import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ open, onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
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
      alert('Error: ' + (err.message || JSON.stringify(err)));
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="modalBackdrop">
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{margin:0}}>{mode==='login' ? 'Iniciar sesión' : 'Registrarse'}</h3>
          <button className="btn secondary" onClick={onClose}>Cerrar</button>
        </div>
        <form onSubmit={submit}>
          <input placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn" type="submit" disabled={loading}>{mode==='login' ? 'Entrar' : 'Crear cuenta'}</button>
            <button type="button" className="btn secondary" onClick={()=>setMode(m=> m==='login' ? 'register' : 'login')}>{mode==='login' ? 'Registro' : 'Login'}</button>
          </div>
          <div style={{marginTop:8,fontSize:13,color:'var(--muted)'}}>No incluye proveedores sociales.</div>
        </form>
      </div>
    </div>
  );
}
