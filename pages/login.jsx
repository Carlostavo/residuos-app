import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function LoginPage(){
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  async function signIn(){
    setLoading(true); setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if(error) return setError(error.message);
    router.push('/');
  }

  return (
    <div className="container py-5">
      <h2>Iniciar sesión</h2>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input type="password" className="form-control" value={pass} onChange={e=>setPass(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={signIn} disabled={loading}>{loading? 'Entrando...' : 'Entrar'}</button>
      {error && <div className="mt-3 text-danger">{error}</div>}
    </div>
  );
}
