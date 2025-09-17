import Topbar from '../components/Topbar'
import EditorShell from '../components/EditorShell'
import { useEdit } from '../components/EditContext'
export default function Indicadores(){
  const [editable, setEditable] = useState(false);
  const { role } = useAuth();
  function onToggleEdit(){ setEditable(e=>!e); }
  return (
    <div>
      <Header onToggleEdit={onToggleEdit} editable={editable} />
      <div className="container">
        <div style={{marginTop:16}}>
          <div className="hero"><h2>Indicadores</h2><p>Panel con métricas principales.</p></div>
          <div className="cardGrid">
            <div className="card"><h3>% Reciclaje</h3><p>65%</p></div>
            <div className="card"><h3>Toneladas recolectadas</h3><p>1,240 t</p></div>
            <div className="card"><h3>Índice de cobertura</h3><p>92%</p></div>
          </div>
        </div>
        <div style={{marginTop:18, height:640}}>
          <EditorCanvas editable={editable && (role==='admin' || role==='tecnico')} pageId="indicadores" />
        </div>
      </div>
      <FloatingToolbar visible={editable && (role==='admin' || role==='tecnico')} onAdd={(type)=> window.dispatchEvent(new CustomEvent('add-element',{detail:type}))} onAction={(action)=> window.dispatchEvent(new CustomEvent('editor-action', {detail:{action}}))} />
    </div>
  );
}
