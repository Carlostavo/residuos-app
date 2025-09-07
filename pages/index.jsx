import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import EditorPanel from '../components/EditorPanel';
import EditableElement from '../components/EditableElement';

export default function Home() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data?.session || null);
        await fetchPage();
      } catch (error) {
        console.error('Error initializing:', error);
      } finally {
        setLoading(false);
      }
    }
    init();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchPage() {
    try {
      // Primero intentar obtener la página
      const { data, error } = await supabase
        .from('pages')
        .select('*, elements(*)')
        .eq('slug', 'home')
        .single();

      if (error && error.code === 'PGRST116') {
        // Página no existe, crearla
        const { error: insertError } = await supabase
          .from('pages')
          .insert([{ slug: 'home', title: 'Inicio' }]);
        
        if (insertError) {
          console.error('Error creating page:', insertError);
          return;
        }
        
        // Volver a obtener la página recién creada
        const { data: newData, error: newError } = await supabase
          .from('pages')
          .select('*, elements(*)')
          .eq('slug', 'home')
          .single();
        
        if (newError) {
          console.error('Error fetching new page:', newError);
          return;
        }
        
        setPage(newData);
      } else if (error) {
        console.error('Error fetching page:', error);
      } else {
        setPage(data);
      }
    } catch (err) {
      console.error('Unexpected error in fetchPage:', err);
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar session={session} setSession={setSession} onToggleEdit={() => setEditing(v => !v)} />
      <main className="container mt-4">
        <h1>Bienvenido, estás en la pantalla de Inicio</h1>
        
        {page ? (
          <>
            <div 
              id="canvas" 
              style={{
                position: 'relative', 
                minHeight: 400, 
                border: '1px solid #ddd', 
                padding: 20,
                backgroundColor: '#f8f9fa'
              }}
            >
              {page.elements && page.elements.length > 0 ? (
                page.elements.map(el => (
                  <div key={el.id} style={{ position: 'absolute', left: el.x || 0, top: el.y || 0 }}>
                    <EditableElement el={el} editing={editing} />
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-5">
                  <p>No hay elementos en esta página.</p>
                  {session && (
                    <p>Haz clic en "Editar" para agregar contenido.</p>
                  )}
                </div>
              )}
            </div>

            {editing && (
              <EditorPanel page={page} refresh={fetchPage} />
            )}
          </>
        ) : (
          <div className="alert alert-warning">
            No se pudo cargar la página. Por favor, recarga la página.
          </div>
        )}

        {/* Información de depuración (opcional) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-light border rounded">
            <small className="text-muted">
              <strong>Debug info:</strong><br />
              Session: {session ? 'Authenticated' : 'Not authenticated'}<br />
              Page loaded: {page ? 'Yes' : 'No'}<br />
              Elements: {page?.elements?.length || 0}
            </small>
          </div>
        )}
      </main>
    </div>
  );
}
