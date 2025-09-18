import Topbar from '../components/Topbar'
import Editor from '../components/Editor'

export default function Reportes(){
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Reportes</h1>
        <Editor pageName="reportes" />
      </main>
    </>
  )
}
