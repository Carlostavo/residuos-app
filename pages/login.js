import Header from '../components/Header';
import AuthForm from '../components/AuthForm';
export default function Login(){
  return (
    <div>
      <Header onToggleEdit={()=>{}} editable={false} />
      <div className="container">
        <div style={{maxWidth:900,margin:'24px auto',display:'grid',gridTemplateColumns:'1fr 420px',gap:20}}>
          <div className="hero">
            <h1>Accede al panel de edición</h1>
            <p>Inicia sesión como admin o técnico para editar el contenido.</p>
          </div>
          <div style={{background:'#fff',padding:18,borderRadius:12,border:'1px solid #e6edf3'}}>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
