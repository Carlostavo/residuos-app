import Topbar from '../components/Topbar'
import EditorShell from '../components/EditorShell'
import { useEdit } from '../components/EditContext'
export default function Reportes(){
  const [editable, setEditable] = useState(false);
  const { role } = useAuth();
  function onToggleEdit(){ setEditable(e=>!e); }
  return (
    <div>
      <Header onToggleEdit={onToggleEdit} editable={editable} />
      <div className="container">
        <div style={{marginTop:16}}>
          <div className="hero"><h2>Reportes</h2><p>Genera reportes y exporta en PDF/Excel.</p></div>
          <div className="cardGrid">
            <div className="card"><h3>Reporte mensual</h3><p>Resumen de actividad mensual.</p></div>
            <div className="card"><h3>Reporte por zona</h3><p>Indicadores por sector.</p></div>
          </div>
        </div>
        <div style={{marginTop:18, height:640}}>
          <EditorCanvas editable={editable && (role==='admin' || role==='tecnico')} pageId="reportes" />
        </div>
      </div>
      <FloatingToolbar visible={editable && (role==='admin' || role==='tecnico')} onAdd={(type)=> window.dispatchEvent(new CustomEvent('add-element',{detail:type}))} onAction={(action)=> window.dispatchEvent(new CustomEvent('editor-action', {detail:{action}}))} />
    </div>
  );
}
