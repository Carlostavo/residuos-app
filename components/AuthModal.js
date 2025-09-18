// components/AuthModal.js
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Para simplificar, usamos un sistema básico como en el HTML original
      if (password !== '1234') {
        throw new Error('Contraseña incorrecta')
      }

      let email
      if (username === 'admin') email = 'admin@example.com'
      else if (username === 'tecnico') email = 'tecnico@example.com'
      else if (username === 'viewer') email = 'viewer@example.com'
      else {
        throw new Error('Usuario no reconocido')
      }

      // Intentar autenticar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: '1234' // Contraseña por defecto
      })

      if (error) throw error

      onLoginSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="modal" id="auth">
      <div className="sheet">
        <button className="close-x" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        <h2>Iniciar sesión</h2>
        
        <div className="sheet-body">
          {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          
          <div className="field">
            <label htmlFor="login-user">Usuario</label>
            <input 
              id="login-user" 
              placeholder="admin / tecnico / viewer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="field">
            <label htmlFor="login-pass">Contraseña</label>
            <input 
              id="login-pass" 
              type="password" 
              placeholder="1234"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button className="submit" onClick={handleLogin}>
            Entrar
          </button>
          
          <button className="close-modal" onClick={onClose}>
            Salir
          </button>
        </div>
      </div>
    </div>
  )
}
