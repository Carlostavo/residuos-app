import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { useState, useEffect } from 'react';

export default function Navbar({ session, onToggleEdit }){
  const [userRole, setUserRole] = useState(null);

  useEffect(()=>{
    async function loadRole(){
      if(!session?.user) return setUserRole(null);
      const user = session.user;
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();
      setUserRole(data?.role);
    }
    loadRole();
  }, [session]);

  async function logout(){
    await supabase.auth.signOut();
    location.href = '/';
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <Link href="/"><a className="navbar-brand">Indicadores Daule</a></Link>
        <div className="d-flex gap-2">
          {!session?.user ? <Link href="/login"><a className="btn btn-light">Entrar</a></Link> : <>
            {['admin','tecnico'].includes(userRole) && <button className="btn btn-warning" onClick={onToggleEdit}>Editar</button>}
            <button className="btn btn-danger" onClick={logout}>Salir</button>
          </>}
        </div>
      </div>
    </nav>
  );
}
