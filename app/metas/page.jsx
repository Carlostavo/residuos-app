'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/useAuth'

export default function MetasPage() {
  const { session } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const key = "contenido_metas"

  const [title, setTitle] = useState("Gestión de Metas")
  const [desc, setDesc] = useState("Define y monitorea objetivos y metas ambientales.")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsed = JSON.parse(saved)
        setTitle(parsed.title || title)
        setDesc(parsed.desc || desc)
      }
    } catch(e) { console.error("Error loading content:", e) }

    const handler = () => setEditMode((v) => !v)
    window.addEventListener('toggle-edit', handler)
    return () => window.removeEventListener('toggle-edit', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem(key, JSON.stringify({ title, desc }))
      setEditMode(false)
      alert("✅ Cambios guardados (localStorage)")
    } catch(e) { console.error("Error saving content:", e); alert("Error guardando contenido") }
  }

  return (
    <section className="p-6 space-y-6">
      {session && (
        <div className="flex justify-end gap-2">
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">✏️ Editar</button>
          ) : (
            <>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg">Guardar</button>
              <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancelar</button>
            </>
          )}
        </div>
      )}

      {editMode ? (
        <div className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full p-2 border rounded" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-700">{title}</h1>
          <p className="text-gray-600">{desc}</p>
        </>
      )}
    </section>
  )
}
