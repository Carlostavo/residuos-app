import { Rnd } from 'react-rnd'
export default function CanvasBlock({ block, editMode, onChange, onUpdatePos }){
  const { id, value, x=0, y=0, width=300, height='auto' } = block
  return (
    <Rnd
      size={{ width: width, height: typeof height==='number'? height: 'auto' }}
      position={{ x: x, y: y }}
      bounds="parent"
      enableResizing={editMode}
      disableDragging={!editMode}
      onDragStop={(e, d)=> onUpdatePos(id, { x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos)=>{
        onUpdatePos(id, { x: pos.x, y: pos.y, width: parseInt(ref.style.width || 0), height: parseInt(ref.style.height || 0) })
      }}
      className={`card p-3`}>
      <div contentEditable={editMode} suppressContentEditableWarning onBlur={e=> onChange(id, e.target.innerHTML)} dangerouslySetInnerHTML={{ __html: value }} />
    </Rnd>
  )
}
