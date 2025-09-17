import Topbar from '../components/Topbar'
import EditorShell from '../components/EditorShell'
import { useEdit } from '../components/EditContext'
export default function Formularios(){
  const [editable, setEditable] = useState(false);
  const { role } = useAuth();
  function onToggleEdit(){ setEditable(e=>!e); }
  return (
    <div>
      <Header onToggleEdit={onToggleEdit} editable={editable} />
      <div className="container">
        <div style={{marginTop:16}}>
          <div className="hero"><h2>Formularios</h2><p>Formularios para recolección de datos.</p></div>
          <div className="cardGrid">
            <div className="card"><h3>Reporte de incidente</h3><p>Formulario para reportar incidentes.</p></div>
            <div className="card"><h3>Solicitud de recolección</h3><p>Solicita recolección especial.</p></div>
          </div>
        </div>
        <div style={{marginTop:18, height:640}}>
          <EditorCanvas editable={editable && (role==='admin' || role==='tecnico')} pageId="formularios" />
        </div>
      </div>
      <FloatingToolbar visible={editable && (role==='admin' || role==='tecnico')} onAdd={(type)=> window.dispatchEvent(new CustomEvent('add-element',{detail:type}))} onAction={(action)=> window.dispatchEvent(new CustomEvent('editor-action', {detail:{action}}))} />
    </div>
  );
}
