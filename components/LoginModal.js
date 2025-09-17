import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ open, onClose }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn({ email, password });
        alert('Sesión iniciada.');
      } else {
        await signUp({ email, password });
        alert('Cuenta creada. Revisa tu correo.');
      }
      onClose();
    } catch (err) {
      console.error('auth error', err);
      alert('Error: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modalBackdrop">
      <div className="modal" role="dialog" aria-modal="true">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <h3 style={{margin:0}}>{mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}</h3>
          <button className="btn secondary" onClick={onClose}>Cerrar</button>
        </div>
        <form onSubmit={submit} style={{display:'grid', gap:8}}>
          <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <div style={{display:'flex', gap:8}}>
            <button className="btn" type="submit" disabled={loading}>{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
            <button type="button" className="btn secondary" onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Registro' : 'Login'}</button>
          </div>
          <div style={{marginTop:6}} className="info">No se incluyen proveedores sociales en esta versión.</div>
        </form>
      </div>
    </div>
  );
}
