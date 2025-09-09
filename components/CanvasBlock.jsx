import { Rnd } from 'react-rnd'
import React from 'react'

function toEmbedUrl(url){
  if(!url) return url
  try{
    const u = new URL(url)
    if(u.hostname.includes('youtube.com')){
      const id = u.searchParams.get('v')
      if(id) return `https://www.youtube.com/embed/${id}`
    }
    if(u.hostname.includes('youtu.be')){
      const id = u.pathname.slice(1)
      return `https://www.youtube.com/embed/${id}`
    }
    if(u.hostname.includes('vimeo.com')){
      const id = u.pathname.split('/').pop()
      return `https://player.vimeo.com/video/${id}`
    }
  }catch(e){ return url }
  return url
}

export default function CanvasBlock({ block, editMode, onChange, onUpdatePos, onSelect, selected }){
  const { id, type, value, x=0, y=0, width=300, height=null, styles={}, zIndex=0 } = block
  const styleObj = { fontSize: styles.fontSize || '16px', color: styles.color || '#111827', textAlign: styles.align || 'left', fontFamily: styles.fontFamily || 'Inter' }

  function content(){
    if(type==='text') return <div dangerouslySetInnerHTML={{ __html: value }} />
    if(type==='image') return <img src={value} alt='' style={{ width:'100%', height:'auto', display:'block' }} />
    if(type==='video'){ const embed = toEmbedUrl(value); return (<div className='video-wrap'><iframe src={embed} frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen></iframe></div>) }
    if(type==='button') return <a href={block.link||'#'} className='button-primary' target='_blank' rel='noreferrer' style={{ background: styles.color || undefined }}>{value}</a>
    return <div dangerouslySetInnerHTML={{ __html: value }} />
  }

  function snap(n){ return Math.round(n/10)*10 }

  return (
    <Rnd
      style={{ zIndex }}
      size={{ width: width, height: height || 'auto' }}
      position={{ x: x, y: y }}
      bounds='parent'
      enableResizing={editMode}
      disableDragging={!editMode}
      onDragStop={(e,d)=> onUpdatePos(id, { x: snap(d.x), y: snap(d.y) })}
      onResizeStop={(e,dir,ref,delta,pos)=>{ const newW = parseInt(ref.style.width||0); const newH = parseInt(ref.style.height||0) || null; onUpdatePos(id, { x: snap(pos.x), y: snap(pos.y), width: newW, height: newH }) }}
      onClick={()=> onSelect(id)}
      className={`canvas-block ${selected? 'ring-2 ring-green-300':''}`}>
      <div className='card' style={styleObj}>
        {type==='text' ? (
          <div contentEditable={editMode} suppressContentEditableWarning onBlur={e=>{ const txt = e.target.innerText || ''; const clean = txt.split('\n').map(t=> `<p>${t.replace(/</g,'&lt;')}</p>`).join(''); onChange(id, clean) }} style={{ minWidth:40, whiteSpace:'pre-wrap' }}>
            <div dangerouslySetInnerHTML={{ __html: value }} />
          </div>
        ) : content()}
      </div>
    </Rnd>
  )
}
