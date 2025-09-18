
import { useAuth } from '../context/AuthContext';
export default function FloatingToolbar({ visible, onAdd, onStyle }) {
  const { role } = useAuth();
  if(!visible) return null;
  if(!(role==='admin' || role==='tecnico')) return null;
  return (
    <div className="toolbar-text">
      <div className="toolbar-item" onClick={()=> onAdd && onAdd('text')}>+ Añadir texto</div>
      <div className="toolbar-item" onClick={()=> onAdd && onAdd('image')}>+ Añadir imagen (URL)</div>
      <div className="toolbar-item" onClick={()=> onAdd && onAdd('video')}>+ Añadir video (embed)</div>
      <div className="toolbar-item" onClick={()=> onStyle && onStyle('classes')}>Aplicar clases</div>
      <div className="toolbar-item" onClick={()=> onStyle && onStyle('animation')}>Animaciones</div>
    </div>
  );
}
