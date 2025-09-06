// src/context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    async function fetchUserRole(userId) {
      const { data: profile } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', userId)
        .single();
      setUserRole(profile?.rol);
    }
    
    // Función de limpieza para el listener
    return () => authListener.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);