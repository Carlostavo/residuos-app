import Topbar from '../components/Topbar'
import Editor from '../components/Editor'

export default function Avances(){
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Avances</h1>
        <Editor pageName="avances" />
      </main>
    </>
  )
}
