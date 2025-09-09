import { Rnd } from 'react-rnd'
export default function CanvasBlock({ block, editMode, onChange, onUpdatePos }){
  const { id, type, value, x=0, y=0, width=300, height=null, styles={} } = block
  function content(){ if(type==='text') return <div dangerouslySetInnerHTML={{ __html: value }} />; if(type==='image') return <img src={value} style={{ width:'100%', height:'auto' }} />; if(type==='video') return <iframe src={value} style={{ width:'100%', height: (height || 360) }} />; if(type==='button') return <a className='button-primary'>{value}</a>; return null }
  return (
    <Rnd size={{ width: width, height: height || 'auto' }} position={{ x,y }} bounds='parent' enableResizing={editMode} disableDragging={!editMode} onDragStop={(e,d)=> onUpdatePos(id, { x:d.x, y:d.y })} onResizeStop={(e,dir,ref,pos)=> onUpdatePos(id, { x:pos.x, y:pos.y, width: parseInt(ref.style.width), height: parseInt(ref.style.height) })}>
      <div className='card' style={{ padding:10 }}>{content()}</div>
    </Rnd>
  )
}
