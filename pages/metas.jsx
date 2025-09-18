import Topbar from '../components/Topbar'
import Editor from '../components/Editor'

export default function Metas(){
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Metas</h1>
        <Editor pageName="metas" />
      </main>
    </>
  )
}
