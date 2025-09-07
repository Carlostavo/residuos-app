import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function Formulario() {
  const [session, setSession] = useState(null);
  return (
    <div>
      <Navbar session={session} setSession={setSession} onToggleEdit={()=>{}} />
      <main className="container mt-4">
        <h1>Bienvenido, estás en la pantalla de Formulario</h1>
      </main>
    </div>
  );
}
