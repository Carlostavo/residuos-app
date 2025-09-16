import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EditorCanvas from '../components/EditorCanvas';
import { useState } from 'react';

export default function Home(){
  const [editable, setEditable] = useState(false);
  return (
    <div>
      <Header onToggleEdit={()=>setEditable(e=>!e)} editable={editable} />
      <div className="container">
        <div className="layout">
          <Sidebar onAdd={(type)=>{ /* forwarded */ window.dispatchEvent(new CustomEvent('add-element',{detail:type})) }} />
          <main className="canvasArea">
            <div className="toolbar">
              <div style={{fontWeight:800}}>Página Principal</div>
            </div>
            <div style={{flex:1}}>
              <EditorCanvas editable={editable} initialElements={[]} pageId="index" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
