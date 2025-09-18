// pages/index.js
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Canvas from '../components/Canvas'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [pageContent, setPageContent] = useState('')
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    loadPageContent()
  }, [])

  const loadPageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('paginas')
        .select('contenido_html')
        .eq('nombre', 'home')
        .single()

      if (error) throw error
      
      if (data) {
        setPageContent(data.contenido_html)
      } else {
        // Contenido por defecto
        setPageContent(`
          <div class="hero">
            <h1 class="editable-text">Sistema de Gestión de Residuos Sólidos</h1>
            <p class="editable-text">La plataforma para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental eficiente.</p>
          </div>
          <div class="cards">
            <div class="card metas disabled" data-page="metas">
              <div class="card-icon" style="background:#38a169;">
                <i class="fa-solid fa-bullseye"></i>
              </div>
              <div class="card-content">
                <div class="card-title editable-text">Gestión de Metas</div>
                <div class="card-desc editable-text">Establece y sigue tus objetivos de sostenibilidad de manera intuitiva.</div>
              </div>
            </div>
            <!-- Más tarjetas aquí -->
          </div>
        `)
      }
    } catch (error) {
      console.error('Error loading page content:', error)
    }
  }

  const savePageContent = async (content) => {
    try {
      const { error } = await supabase
        .from('paginas')
        .upsert({
          nombre: 'home',
          contenido_html: content,
          actualizado: new Date().toISOString()
        })

      if (error) throw error
      console.log('Contenido guardado exitosamente')
    } catch (error) {
      console.error('Error saving page content:', error)
    }
  }

  return (
    <Layout>
      <Canvas 
        content={pageContent} 
        onSave={savePageContent}
        editMode={editMode}
      />
    </Layout>
  )
}
