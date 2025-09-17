import Topbar from '../components/Topbar'
import Editor from '../components/Editor'
export default function EditorPage() {
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Editor Avanzado</h1>
        <p>Modo edición: solo usuarios con rol 'tecnico' o 'admin' deben ver los controles.</p>
        <Editor pageName="home" />
      </main>
    </>
  )
}
