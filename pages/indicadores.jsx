import Topbar from '../components/Topbar'
import Editor from '../components/Editor'
export default function Indicadores() {
  return (
    <>
      <Topbar />
      <main className="container">
        <h1>Indicadores</h1>
        <p>Página de indicadores — aquí se muestran métricas y gráficos.</p>
        <Editor pageName="indicadores" />
      </main>
    </>
  )
}
