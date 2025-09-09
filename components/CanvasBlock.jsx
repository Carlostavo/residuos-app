import { Rnd } from 'react-rnd'
import React from 'react'

export default function CanvasBlock({ block, editMode, onChange, onUpdatePos, onSelect, selected }){
  const { id, type, value, x=0, y=0, width=300, height='auto', styles={}, zIndex=0 } = block
  const styleObj = { fontSize: styles.fontSize || '16px', color: styles.color || '#111827', textAlign: styles.align || 'left', fontFamily: styles.fontFamily || 'Inter' }

  function content(){
    if(type==='text') return <div>{typeof value==='string' ? <div dangerouslySetInnerHTML={{ __html: value }} /> : null}</div>
    if(type==='image') return <img src={value} alt='' style={{ width: '100%', height: 'auto', display:'block' }} />
    if(type==='video') return <div className='video-wrap'><iframe src={value} style={{ width:'100%', height:'100%' }} frameBorder='0' allowFullScreen></iframe></div>
    if(type==='button') return <a href={block.link||'#'} className='button-primary block text-center' target='_blank' rel='noreferrer'>{value}</a>
    return <div dangerouslySetInnerHTML={{ __html: value }} />
  }

  function snap(n){ return Math.round(n/10)*10 }

  return (
    <Rnd
      style={{ zIndex }}
      size={{ width: width, height: typeof height==='number'? height: 'auto' }}
      position={{ x: x, y: y }}
      bounds="parent"
      enableResizing={editMode}
      disableDragging={!editMode}
      onDragStop={(e, d)=> onUpdatePos(id, { x: snap(d.x), y: snap(d.y) })}
      onResizeStop={(e, dir, ref, delta, pos)=>{
        onUpdatePos(id, { x: snap(pos.x), y: snap(pos.y), width: parseInt(ref.style.width||0), height: parseInt(ref.style.height||0) })
      }}
      onClick={()=> onSelect(id)}
      className={`canvas-block ${selected? 'ring-2 ring-green-300':''}`}>
      <div className='card' style={styleObj}>
        {type==='text' ? (
          <div contentEditable={editMode} suppressContentEditableWarning onBlur={e=> onChange(id, e.target.innerText)} style={{ minWidth:50 }}>
            {typeof value==='string' ? value.replace(/\n/g, '<br/>') : ''}
          </div>
        ) : content()}
      </div>
    </Rnd>
  )
}
