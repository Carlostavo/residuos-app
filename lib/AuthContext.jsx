// lib/AuthContext.jsx - Nuevo contexto
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './useAuth'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const auth = useAuth()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
