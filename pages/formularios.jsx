import Topbar from '../components/Topbar'
import Editor from '../components/Editor'

export default function Formularios(){
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Formularios</h1>
        <Editor pageName="formularios" />
      </main>
    </>
  )
}
