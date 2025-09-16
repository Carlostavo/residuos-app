import { Rnd } from 'react-rnd'
import React from 'react'

function toEmbed(url){
  if (!url) return url
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.','')
    if (host.includes('youtube.com')){
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
    }
    if (host.includes('youtu.be')){
      const id = u.pathname.slice(1)
      if (id) return `https://www.youtube.com/embed/${id}`
    }
    if (host.includes('vimeo.com')){
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}`
    }
  } catch(e){}
  return url
}

export default function CanvasBlock({ block, editMode, onChange, onUpdatePos, onSelect, selected }){
  const { id, type, value, x=0, y=0, width=300, height=null, styles={}, zIndex=0 } = block
  const styleObj = { fontSize: styles.fontSize || '16px', color: styles.color || '#111827', textAlign: styles.align || 'left', fontFamily: styles.fontFamily || 'Inter' }

  function content(){
    if (type === 'text') return <div>{typeof value === 'string' ? <div dangerouslySetInnerHTML={{ __html: value }} /> : null}</div>
    if (type === 'image') return <img src={value} alt="" style={{ width:'100%', height:'auto', display:'block' }} />
    if (type === 'video'){
      const embed = toEmbed(value)
      return <div style={{ width:'100%', height:'100%', position:'relative', paddingTop:'56.25%' }}><iframe src={embed} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }} frameBorder="0" allowFullScreen></iframe></div>
    }
    if (type === 'button') return <a href={block.link||'#'} className="button-primary block text-center" target="_blank" rel="noreferrer">{value}</a>
    return <div dangerouslySetInnerHTML={{ __html: value }} />
  }

  function snap(n){ return Math.round(n/10)*10 }

  return (
    <Rnd
      style={{ zIndex }}
      size={{ width: width, height: height || 'auto' }}
      position={{ x: x, y: y }}
      bounds="parent"
      enableResizing={editMode}
      disableDragging={!editMode}
      onDragStop={(e,d)=> onUpdatePos(id, { x: snap(d.x), y: snap(d.y) })}
      onResizeStop={(e,dir,ref,delta,pos)=>{
        const w = parseInt(ref.style.width || 0)
        const h = parseInt(ref.style.height || 0) || null
        onUpdatePos(id, { x: snap(pos.x), y: snap(pos.y), width: w, height: h })
      }}
      onClick={()=> onSelect(id)}
      className={`canvas-block ${selected ? 'ring-2 ring-green-300' : ''}`}>
      <div className="card" style={styleObj}>
        {type === 'text' ? (
          <div contentEditable={editMode} suppressContentEditableWarning onBlur={e=> onChange(id, e.target.innerText)} style={{ minWidth:50 }}>
            {typeof value === 'string' ? value.replace(/\n/g, '<br/>') : ''}
          </div>
        ) : content()}
      </div>
    </Rnd>
  )
}
