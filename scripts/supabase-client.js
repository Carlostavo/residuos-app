// Configuración de Supabase
const SUPABASE_URL = "https://lhnluarfjyzheezfrexr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxobmx1YXJmanl6aGVlemZyZXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzYyOTAsImV4cCI6MjA3MDU1MjI5MH0.igYpeqlYnWW5i9NvOHSvlow3J-yDdEGgK6LRxYwvGY0";

// Crear cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funciones para interactuar con Supabase
const SupabaseService = {
  // Guardar contenido de página
  async savePageContent(pageName, htmlContent) {
    try {
      const { data, error } = await supabase
        .from('paginas')
        .upsert(
          { 
            nombre: pageName, 
            contenido_html: htmlContent,
            actualizado: new Date().toISOString()
          },
          { onConflict: 'nombre' }
        );

      if (error) throw error;
      console.log('✅ Contenido guardado en Supabase');
      return data;
    } catch (error) {
      console.error('❌ Error guardando en Supabase:', error);
      throw error;
    }
  },

  // Cargar contenido de página
  async loadPageContent(pageName) {
    try {
      const { data, error } = await supabase
        .from('paginas')
        .select('contenido_html')
        .eq('nombre', pageName)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 es "no encontrado"
      
      return data ? data.contenido_html : null;
    } catch (error) {
      console.error('❌ Error cargando desde Supabase:', error);
      throw error;
    }
  },

  // Obtener historial de cambios
  async getPageHistory(pageName) {
    try {
      const { data, error } = await supabase
        .from('historial_paginas')
        .select('*')
        .eq('pagina_nombre', pageName)
        .order('fecha_cambio', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error obteniendo historial:', error);
      throw error;
    }
  }
};