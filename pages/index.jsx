import Topbar from '../components/Topbar'
import Editor from '../components/Editor'

export default function Inicio(){
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Inicio</h1>
        <Editor pageName="home" />
      </main>
    </>
  )
}
