import { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getUserRole } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function init(){
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if(session && session.user){
        setUser(session.user);
        const r = await getUserRole(session.user.id);
        setRole(r);
      } else {
        setUser(null); setRole(null);
      }
      setLoading(false);
    }
    init();
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if(session?.user){
        setUser(session.user);
        const r = await getUserRole(session.user.id);
        setRole(r);
      } else {
        setUser(null); setRole(null);
      }
    });
    return ()=> sub.subscription.unsubscribe();
  },[]);

  const signIn = async ({ email, password })=>{
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) throw error;
    return data;
  };
  const signUp = async ({ email, password })=>{
    const { data, error } = await supabase.auth.signUp({ email, password });
    if(error) throw error;
    return data;
  };
  const signOut = async ()=> {
    await supabase.auth.signOut();
    setUser(null); setRole(null);
  };

  return <AuthContext.Provider value={{user, role, loading, signIn, signUp, signOut}}>{children}</AuthContext.Provider>;
}

export const useAuth = ()=> useContext(AuthContext);
