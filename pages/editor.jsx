import Topbar from '../components/Topbar'
import Editor from '../components/Editor'
export default function EditorPage(){
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Editor Avanzado</h1>
        <Editor pageName="home" />
      </main>
    </>
  )
}
