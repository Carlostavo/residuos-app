import Topbar from '../components/Topbar'
import Editor from '../components/Editor'
import CardsGrid from '../components/CardsGrid'
export default function Home() {
  return (
    <>
      <Topbar />
      <main className="container">
        <section className="hero">
          <h1>Inicio - Gestión de Residuos</h1>
          <p>Bienvenido. Esta página se migró desde tu HTML original y mantiene el diseño principal.</p>
        </section>
        <CardsGrid />
        <Editor pageName="home" />
      </main>
    </>
  )
}
