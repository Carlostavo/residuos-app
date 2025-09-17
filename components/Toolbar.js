export default function Toolbar({ onSave, onUndo, onRedo, onClear }) {
  return (
    <div className="toolbar">
      <button className="btn" onClick={onSave}><i className="fa-solid fa-save"></i> Guardar</button>
      <button className="btn secondary" onClick={onUndo}><i className="fa-solid fa-rotate-left"></i> Deshacer</button>
      <button className="btn secondary" onClick={onRedo}><i className="fa-solid fa-rotate-right"></i> Rehacer</button>
      <button className="btn secondary" onClick={onClear}><i className="fa-solid fa-trash"></i> Limpiar</button>
    </div>
  );
}
