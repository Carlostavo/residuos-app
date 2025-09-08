import { Rnd } from 'react-rnd'
import React from 'react'

export default function CanvasBlock({ block, editMode, onChange, onUpdatePos, onSelect, selected }){
  const { id, type, value, x=0, y=0, width=300, height='auto', styles={} } = block
  const styleObj = { fontSize: styles.fontSize || '16px', color: styles.color || '#111827', textAlign: styles.align || 'left' }

  function content(){
    if(type==='text') return <div dangerouslySetInnerHTML={{ __html: value }} />
    if(type==='image') return <img src={value} alt='' style={{ width: '100%', height: 'auto', display:'block' }} />
    if(type==='video') return <div className='video-wrap'><iframe src={value} style={{ width:'100%', height:'100%' }} frameBorder='0' allowFullScreen></iframe></div>
    if(type==='button') return <button className='button-primary'>{value}</button>
    return <div dangerouslySetInnerHTML={{ __html: value }} />
  }

  return (
    <Rnd
      size={{ width: width, height: typeof height==='number'? height: 'auto' }}
      position={{ x: x, y: y }}
      bounds="parent"
      enableResizing={editMode}
      disableDragging={!editMode}
      onDragStop={(e, d)=> onUpdatePos(id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos)=>{
        onUpdatePos(id, { x: pos.x, y: pos.y, width: parseInt(ref.style.width||0), height: parseInt(ref.style.height||0) })
      }}
      onClick={()=> onSelect(id)}
      className={`card p-2 ${selected? 'ring-2 ring-green-300':''}`}>
      <div contentEditable={editMode && type==='text'} suppressContentEditableWarning={true} onBlur={e=> onChange(id, e.target.innerHTML)} style={styleObj}>
        {content()}
      </div>
    </Rnd>
  )
}
