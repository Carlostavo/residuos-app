import Topbar from '../components/Topbar'
import Editor from '../components/Editor'
export default function Formularios(){
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Formularios</h1>
        <p>Aquí se muestran y enlazan los formularios (p. ej. encuestas Tally u otros).</p>
        <Editor pageName="formularios" />
      </main>
    </>
  )
}
