export default function Sidebar({ onAdd }) {
  return (
    <aside className="sidebar">
      <div className="panelTitle">Agregar elemento</div>
      <div style={{display:'grid',gap:8}}>
        <button className="elem" onClick={()=>onAdd('text')}>+ Texto</button>
        <button className="elem" onClick={()=>onAdd('image')}>+ Imagen</button>
        <button className="elem" onClick={()=>onAdd('video')}>+ Video</button>
        <button className="elem" onClick={()=>onAdd('button')}>+ Botón</button>
      </div>
      <div className="info">Arrastra los elementos dentro del lienzo. Usa los controles para ajustar tamaño y posición.</div>
    </aside>
  );
}
