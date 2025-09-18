import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingToolbar from '../components/FloatingToolbar';

export default function Page({ editable, setEditable }) {
  return (
    <div>
      <Header editable={editable} setEditable={setEditable} />
      <main className="container" style={{marginTop:16}}>
        <section className="hero">
          <h2>Avances</h2>
          <p>Seguimiento de proyectos y obras.</p>
        </section>
        <Footer />
      </main>
      <FloatingToolbar visible={editable} />
    </div>
  );
}
