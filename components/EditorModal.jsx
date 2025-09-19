// components/EditorModal.jsx
'use client'
import { useState, useEffect } from 'react'

export default function EditorModal({ 
  isOpen, 
  onClose, 
  content, 
  onSave 
}) {
  const [editedContent, setEditedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (content) {
      setEditedContent(content)
    }
  }, [content])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(editedContent)
      onClose()
    } catch (error) {
      console.error('Error saving content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Editor de Contenido</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 p-4 border-r overflow-auto">
            <h3 className="text-lg font-medium mb-2">Editor HTML</h3>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg font-mono text-sm"
              placeholder="Escribe tu contenido HTML aquí..."
            />
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Atajos útiles:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <button 
                  onClick={() => setEditedContent(prev => prev + '<strong>Texto en negrita</strong>')}
                  className="p-2 bg-gray-100 rounded text-left"
                >
                  <strong>Negrita</strong>
                </button>
                <button 
                  onClick={() => setEditedContent(prev => prev + '<em>Texto en cursiva</em>')}
                  className="p-2 bg-gray-100 rounded text-left"
                >
                  <em>Cursiva</em>
                </button>
                <button 
                  onClick={() => setEditedContent(prev => prev + '<a href="#" class="text-green-600 hover:underline">Enlace</a>')}
                  className="p-2 bg-gray-100 rounded text-left"
                >
                  Enlace
                </button>
                <button 
                  onClick={() => setEditedContent(prev => prev + '<ul><li>Elemento de lista</li></ul>')}
                  className="p-2 bg-gray-100 rounded text-left"
                >
                  Lista
                </button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 p-4 overflow-auto">
            <h3 className="text-lg font-medium mb-2">Vista previa</h3>
            <div 
              className="border rounded-lg p-4 bg-gray-50 min-h-[300px]"
              dangerouslySetInnerHTML={{ __html: editedContent }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
