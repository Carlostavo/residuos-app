import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingToolbar from '../components/FloatingToolbar';

export default function Page({ editable, setEditable }) {
  return (
    <div>
      <Header editable={editable} setEditable={setEditable} />
      <main className="container" style={{marginTop:16}}>
        <section className="hero">
          <h2>Metas</h2>
          <p>Define metas y su progreso.</p>
        </section>
        <Footer />
      </main>
      <FloatingToolbar visible={editable} />
    </div>
  );
}
