import Topbar from '../components/Topbar'
import EditorShell from '../components/EditorShell'
import { useEdit } from '../components/EditContext'
export default function Avances(){
  const [editable, setEditable] = useState(false);
  const { role } = useAuth();
  function onToggleEdit(){ setEditable(e=>!e); }
  return (
    <div>
      <Header onToggleEdit={onToggleEdit} editable={editable} />
      <div className="container">
        <div style={{marginTop:16}}>
          <div className="hero"><h2>Avances</h2><p>Seguimiento de proyectos y obras.</p></div>
          <div className="cardGrid">
            <div className="card"><h3>Proyecto A</h3><p>Construcción de planta - 45%</p></div>
            <div className="card"><h3>Proyecto B</h3><p>Recolección selectiva - 70%</p></div>
          </div>
        </div>
        <div style={{marginTop:18, height:640}}>
          <EditorCanvas editable={editable && (role==='admin' || role==='tecnico')} pageId="avances" />
        </div>
      </div>
      <FloatingToolbar visible={editable && (role==='admin' || role==='tecnico')} onAdd={(type)=> window.dispatchEvent(new CustomEvent('add-element',{detail:type}))} onAction={(action)=> window.dispatchEvent(new CustomEvent('editor-action', {detail:{action}}))} />
    </div>
  );
}
