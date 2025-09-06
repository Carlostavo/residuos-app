import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function Reportes() {
  const [session, setSession] = useState(null);
  return (
    <div>
      <Navbar session={session} setSession={setSession} onToggleEdit={()=>{}} />
      <main className="container mt-4">
        <h1>Bienvenido, estás en la pantalla de Reportes</h1>
      </main>
    </div>
  );
}
