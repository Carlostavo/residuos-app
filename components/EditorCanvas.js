// components/EditorCanvas.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { savePageContent, getPageContent } from '../lib/supabaseClient';

const uid = () => Math.random().toString(36).slice(2, 9);

export default function EditorCanvas({ editable = false, pageId = 'index', initialContent = null }) {
  const [elements, setElements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const pointer = useRef({ mode: null, id: null, startX: 0, startY: 0, orig: {} });

  // Cargar contenido inicial
  useEffect(() => {
    async function load() {
      try {
        let contentToLoad = initialContent;
        
        if (!contentToLoad) {
          const saved = await getPageContent(pageId);
          contentToLoad = saved;
        }
        
        if (contentToLoad) {
          try {
            const parsed = JSON.parse(contentToLoad);
            setElements(parsed);
            setHistory([JSON.stringify(parsed)]);
            return;
          } catch (e) {
            console.error('Error parsing content:', e);
          }
        }
        
        // Contenido por defecto
        const defaultContent = [
          { id: uid(), type: 'text', x: 20, y: 20, w: 420, h: 120, html: '<h2>Bienvenido al PAE</h2><p>Contenido público editable.</p>' }
        ];
        setElements(defaultContent);
        setHistory([JSON.stringify(defaultContent)]);
      } catch (err) {
        console.error('Error loading content:', err);
      }
    }
    
    load();
  }, [pageId, initialContent]);

  // Guardar historial cuando cambian los elementos
  useEffect(() => {
    const currentState = JSON.stringify(elements);
    if (history.length === 0 || history[history.length - 1] !== currentState) {
      setHistory(prev => [...prev, currentState].slice(-60));
      setFuture([]);
    }
  }, [elements, history]);

  // Funciones para manipular elementos
  const addElement = useCallback((type) => {
    const id = uid();
    const newElement = { 
      id, 
      type, 
      x: 40, 
      y: 40, 
      w: type === 'text' ? 240 : 320, 
      h: type === 'text' ? 80 : type === 'button' ? 40 : 180, 
      html: type === 'text' ? '<p>Nuevo texto</p>' : (type === 'button' ? 'Click' : ''), 
      src: type === 'image' ? '/example.png' : (type === 'video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : '') 
    };
    
    setElements(prev => [...prev, newElement]);
    setSelected(id);
  }, []);

  const updateHtml = useCallback((id, html) => {
    setElements(prev => prev.map(item => item.id === id ? { ...item, html } : item));
  }, []);

  const startDrag = useCallback((e, id, mode) => {
    e.stopPropagation();
    const p = pointer.current;
    p.mode = mode; 
    p.id = id; 
    p.startX = e.clientX; 
    p.startY = e.clientY;
    
    const element = elements.find(x => x.id === id);
    if (element) {
      p.orig = { ...element };
    }
    
    const onMove = (e) => {
      if (!p.mode || !p.id) return;
      const dx = e.clientX - p.startX;
      const dy = e.clientY - p.startY;
      
      setElements(prev => prev.map(item => {
        if (item.id !== p.id) return item;
        
        if (p.mode === 'move') {
          return { ...item, x: p.orig.x + dx, y: p.orig.y + dy };
        }
        
        if (p.mode === 'resize') {
          return { 
            ...item, 
            w: Math.max(40, p.orig.w + dx), 
            h: Math.max(24, p.orig.h + dy) 
          };
        }
        
        return item;
      }));
    };
    
    const onUp = () => {
      pointer.current.mode = null;
      pointer.current.id = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [elements]);

  const undo = useCallback(() => {
    if (history.length < 2) return;
    
    const lastState = history[history.length - 1];
    const previousState = history[history.length - 2];
    
    setElements(JSON.parse(previousState));
    setFuture(prev => [lastState, ...prev]);
    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    
    const nextState = future[0];
    setElements(JSON.parse(nextState));
    setHistory(prev => [...prev, nextState]);
    setFuture(prev => prev.slice(1));
  }, [future]);

  const clearAll = useCallback(() => {
    setElements([]);
    setSelected(null);
  }, []);

  const save = useCallback(async () => {
    try {
      await savePageContent(pageId, JSON.stringify(elements));
      alert('Guardado correctamente.');
    } catch (err) {
      console.error('Error saving:', err);
      alert('Error guardando: ' + err.message);
    }
  }, [pageId, elements]);

  // Event listeners para acciones globales
  useEffect(() => {
    const handleEditorAction = (e) => {
      const { action } = e.detail || {};
      
      switch (action) {
        case 'undo':
          undo();
          break;
        case 'redo':
          redo();
          break;
        case 'save':
          save();
          break;
        case 'clear':
          clearAll();
          break;
        case 'bold':
          if (selected) {
            const element = elements.find(x => x.id === selected);
            if (element) {
              updateHtml(selected, '<b>' + (element.html || '') + '</b>');
            }
          }
          break;
        default:
          break;
      }
    };
    
    const handleAddElement = (ev) => {
      addElement(ev.detail);
    };

    window.addEventListener('editor-action', handleEditorAction);
    window.addEventListener('add-element', handleAddElement);
    
    return () => {
      window.removeEventListener('editor-action', handleEditorAction);
      window.removeEventListener('add-element', handleAddElement);
    };
  }, [selected, elements, undo, redo, save, clearAll, addElement, updateHtml]);

  // Renderizar elementos
  const renderElement = (el) => {
    const isSelected = selected === el.id;
    
    return (
      <div 
        key={el.id} 
        className={'editorElement' + (isSelected ? ' selected' : '')} 
        style={{ left: el.x, top: el.y, width: el.w, height: el.h }}
        onPointerDown={(e) => { 
          e.stopPropagation(); 
          setSelected(el.id); 
          startDrag(e, el.id, 'move'); 
        }}
      >
        <div className="content" style={{ width: '100%', height: '100%' }}>
          {el.type === 'text' && (
            <div 
              contentEditable={editable && isSelected} 
              suppressContentEditableWarning={true} 
              onInput={(ev) => updateHtml(el.id, ev.currentTarget.innerHTML)} 
              dangerouslySetInnerHTML={{ __html: el.html }} 
            />
          )}
          
          {el.type === 'button' && (
            <button 
              style={{ width: '100%', height: '100%' }} 
              dangerouslySetInnerHTML={{ __html: el.html }} 
            />
          )}
          
          {el.type === 'image' && (
            <img 
              src={el.src} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="Imagen" 
            />
          )}
          
          {el.type === 'video' && (
            <iframe 
              src={el.src} 
              style={{ width: '100%', height: '100%' }} 
              frameBorder="0" 
              allowFullScreen 
              title="Video"
            />
          )}
          
          {editable && (
            <div 
              className="handle" 
              onPointerDown={(e) => { 
                e.stopPropagation(); 
                startDrag(e, el.id, 'resize'); 
              }} 
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800 }}>Editor</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn secondary" onClick={undo} disabled={history.length < 2}>
            Deshacer
          </button>
          <button className="btn secondary" onClick={redo} disabled={future.length === 0}>
            Rehacer
          </button>
          <button className="btn" onClick={save}>
            Guardar
          </button>
        </div>
      </div>
      
      <div 
        className="canvas" 
        style={{ marginTop: 12, position: 'relative', flex: 1 }} 
        onPointerDown={() => setSelected(null)}
      >
        {elements.map(renderElement)}
      </div>
      
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <button 
          className="btn secondary small" 
          onClick={() => { 
            if (navigator.clipboard) {
              navigator.clipboard.writeText(JSON.stringify(elements));
              alert('JSON copiado al portapapeles');
            }
          }}
        >
          Copiar JSON
        </button>
      </div>
    </div>
  );
}
