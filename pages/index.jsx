'use client'
import Header from '../components/Header'
import EditorPanel from '../components/EditorPanel'
import EditableCard from '../components/EditableCard'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [elements, setElements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadElements = async () => {
      try {
        const { data, error } = await supabase
          .from('elements')
          .select('*')
          .eq('page_slug', 'home')
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Error fetching elements:', error)
          return
        }

        if (mounted) {
          setElements(data || [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading elements:', error)
        if (mounted) setLoading(false)
      }
    }

    loadElements()

    const channel = supabase
      .channel('elements-home')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'elements',
          filter: 'page_slug=eq.home'
        }, 
        (payload) => {
          loadElements()
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div>
        <Header />
        <main className="container">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            Cargando...
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <main className="container">
        <h1 style={{ marginBottom: '24px', color: '#1e293b' }}>Sistema de Gestión de Residuos</h1>
        
        <div style={{
          position: 'relative',
          minHeight: '600px',
          border: '2px dashed #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          background: '#f8fafc'
        }}>
          {elements.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#64748b'
            }}>
              <p>No hay elementos para mostrar.</p>
              <p>Inicia sesión como admin/tecnico y activa el modo edición para agregar contenido.</p>
            </div>
          ) : (
            elements.map(el => (
              <EditableCard key={el.id} card={el} />
            ))
          )}
        </div>
      </main>
      
      <EditorPanel pageSlug="home" />
    </div>
  )
}
