'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useEditableContent(pagePath) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContent()
  }, [pagePath])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('page_content')
        .select('content')
        .eq('page_path', pagePath)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setContent(data?.content || '<p>Contenido por defecto</p>')
    } catch (err) {
      console.error('Error fetching content:', err)
      setError(err.message)
      setContent('<p>Error cargando contenido</p>')
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async (newContent) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_path: pagePath,
          content: newContent,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setContent(newContent)
      return true
    } catch (err) {
      console.error('Error saving content:', err)
      setError(err.message)
      throw err
    }
  }

  return { content, loading, error, saveContent }
}
