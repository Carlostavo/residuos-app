import { useAuth } from '../context/AuthContext';

export default function FloatingToolbar({ visible }) {
  const { role } = useAuth();
  if(!visible) return null;
  if(!(role === 'admin' || role === 'tecnico')) return null;

  return (
    <div className="floatingTextTool" role="toolbar" aria-label="Herramientas de edición">
      <div className="item">Añadir Texto</div>
      <div className="item">Añadir Imagen</div>
      <div className="item">Añadir Video</div>
      <div className="item">Añadir Botón</div>
      <div className="item">Deshacer</div>
      <div className="item">Rehacer</div>
      <div className="item">Guardar</div>
    </div>
  );
}
