import Topbar from '../components/Topbar'
import EditorShell from '../components/EditorShell'
import { useEdit } from '../components/EditContext'
export default function Metas(){
  const [editable, setEditable] = useState(false);
  const { role } = useAuth();
  function onToggleEdit(){ setEditable(e=>!e); }
  return (
    <div>
      <Header onToggleEdit={onToggleEdit} editable={editable} />
      <div className="container">
        <div style={{marginTop:16}}>
          <div className="hero"><h2>Metas</h2><p>Define metas y su progreso.</p></div>
          <div className="cardGrid">
            <div className="card"><h3>Meta 1</h3><p>Implementar puntos de reciclaje - 80%</p></div>
            <div className="card"><h3>Meta 2</h3><p>Campaña de educación - 60%</p></div>
          </div>
        </div>
        <div style={{marginTop:18, height:640}}>
          <EditorCanvas editable={editable && (role==='admin' || role==='tecnico')} pageId="metas" />
        </div>
      </div>
      <FloatingToolbar visible={editable && (role==='admin' || role==='tecnico')} onAdd={(type)=> window.dispatchEvent(new CustomEvent('add-element',{detail:type}))} onAction={(action)=> window.dispatchEvent(new CustomEvent('editor-action', {detail:{action}}))} />
    </div>
  );
}
