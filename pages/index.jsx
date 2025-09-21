'use client'
import Header from '../components/Header'
import EditorPanel from '../components/EditorPanel'
import EditableCard from '../components/EditableCard'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [elements, setElements] = useState([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data, error } = await supabase.from('elements').select('*').eq('page_slug', 'home')
      if (error) {
        console.error('Error fetching elements', error)
        return
      }
      if (mounted) setElements(data || [])
    }
    load()

    // realtime subscription (supabase-js v2 channel)
    const channel = supabase.channel('elements-home')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'elements', filter: "page_slug=eq.home" }, (payload) => {
        // simple handler: refetch on changes
        load()
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div>
      <Header />
      <main className="container">
        <h1 style={{marginBottom:12}}>Inicio</h1>
        <div style={{position:'relative', minHeight:400}}>
          {elements.map(el => (
            <EditableCard key={el.id} card={el} />
          ))}
        </div>
      </main>
      <EditorPanel pageSlug="home" />
    </div>
  )
}
