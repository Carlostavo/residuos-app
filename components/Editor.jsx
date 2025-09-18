'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { loadPage } from '../lib/supabaseClient'
import { useAuth } from '../lib/auth'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const DEFAULT_CONTENT = [
  { id: 1, type: 'text', data: '<h2>Bienvenido</h2><p>Contenido editable.</p>' },
  { id: 2, type: 'image', data: 'https://via.placeholder.com/600x200' },
  { id: 3, type: 'video', data: 'https://www.youtube.com/watch?v=dQw4w9WgXc' }
]

export default function Editor({ pageName='home' }){
  const { role, user } = useAuth()
  const canEdit = role === 'admin' || role === 'tecnico'
  const [blocks, setBlocks] = useState(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const page = await loadPage(pageName)
        if(page && mounted){
          setBlocks(page)
        }
      }catch(e){
        console.error('load page', e)
      }finally{
        if(mounted) setLoading(false)
      }
    })()
    return ()=> mounted=false
  },[pageName])

  function addBlock(type){
    const id = Date.now()
    const b = type === 'text' ? { id, type:'text', data: '<p>Nuevo texto</p>' } :
              type === 'image' ? { id, type:'image', data: 'https://via.placeholder.com/400' } :
              { id, type:'video', data: 'https://www.youtube.com/watch?v=' }
    setBlocks(prev => [...prev, b])
  }

  function updateBlock(id, data){
    setBlocks(prev => prev.map(b=> b.id===id ? {...b, data} : b))
  }

  function removeBlock(id){
    setBlocks(prev => prev.filter(b=> b.id!==id))
  }

  async function save(){
    try{
      // call API to save (server-side uses service role)
      const token = (await fetch('/api/getToken')).ok ? null : null
      const res = await fetch('/api/savePage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // pass access token for verification
          'Authorization': 'Bearer ' + (await (await fetch('/api/getAccessToken')).text())
        },
        body: JSON.stringify({ nombre: pageName, contenido_json: blocks })
      })
      if(!res.ok) throw new Error(await res.text())
      alert('Guardado correctamente')
    }catch(e){
      alert('Error guardando: '+ (e.message||e))
    }
  }

  return (
    <section className="editor">
      <div className="editor-header">
        <div>
          {canEdit ? (
            <>
              <button onClick={()=>addBlock('text')}>+ Texto</button>
              <button onClick={()=>addBlock('image')}>+ Imagen</button>
              <button onClick={()=>addBlock('video')}>+ Video</button>
              <button onClick={save}>Guardar</button>
            </>
          ) : <div className="no-perm">Solo lectura</div>}
        </div>
        <div>Status: {loading ? 'Cargando...' : 'Listo'}</div>
      </div>

      <div className="blocks">
        {blocks.map(block => (
          <div key={block.id} className="block">
            {block.type==='text' && (
              <div className="block-text">
                {canEdit ? (
                  <ReactQuill theme="snow" value={block.data} onChange={(v)=>updateBlock(block.id, v)} modules={{
                    toolbar: [
                      [{ 'font': [] }, { 'size': [] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'script': 'sub'}, { 'script': 'super' }],
                      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                      [{ 'direction': 'rtl' }, { 'align': [] }],
                      ['link', 'image', 'video'],
                      ['clean']
                    ]
                  }} formats={[
                    'header','font','size','bold','italic','underline','strike','color','background',
                    'list','bullet','indent','link','image','video','align','script','blockquote','code-block'
                  ]}/>
                ) : (
                  <div dangerouslySetInnerHTML={{__html: block.data}} />
                )}
                {canEdit && <div className="block-actions"><button onClick={()=>removeBlock(block.id)}>Eliminar</button></div>}
              </div>
            )}

            {block.type==='image' && (
              <div className="block-image">
                {canEdit ? (
                  <>
                    <label>Image URL</label>
                    <input type="text" value={block.data} onChange={(e)=>updateBlock(block.id, e.target.value)} />
                    <div className="preview"><img src={block.data} alt="preview" /></div>
                  </>
                ) : <img src={block.data} alt="image" />}
                {canEdit && <div className="block-actions"><button onClick={()=>removeBlock(block.id)}>Eliminar</button></div>}
              </div>
            )}

            {block.type==='video' && (
              <div className="block-video">
                {canEdit ? (
                  <>
                    <label>Video URL (YouTube/Vimeo or MP4)</label>
                    <input type="text" value={block.data} onChange={(e)=>updateBlock(block.id, e.target.value)} />
                    <div className="preview">
                      {/* simple embed handling for YouTube */}
                      {block.data.includes('youtube') || block.data.includes('youtu.be') ? (
                        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${(block.data.includes('v=')? block.data.split('v=')[1] : block.data.split('/').pop())}`} frameBorder="0" allowFullScreen></iframe>
                      ) : (
                        <video controls src={block.data} style={{maxWidth:'100%'}} />
                      )}
                    </div>
                  </>
                ) : (
                  block.data.includes('youtube') || block.data.includes('youtu.be') ? (
                    <iframe width="560" height="315" src={`https://www.youtube.com/embed/${(block.data.includes('v=')? block.data.split('v=')[1] : block.data.split('/').pop())}`} frameBorder="0" allowFullScreen></iframe>
                  ) : (
                    <video controls src={block.data} style={{maxWidth:'100%'}} />
                  )
                )}
                {canEdit && <div className="block-actions"><button onClick={()=>removeBlock(block.id)}>Eliminar</button></div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
