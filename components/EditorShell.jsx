import ToolbarTop from './ToolbarTop'
import EditorSidebar from './EditorSidebar'

export default function EditorShell({ children, onSave, onUndo, onRedo, onPreview, onExit }) {
  return (
    <div className="h-screen">
      <ToolbarTop onSave={onSave} onUndo={onUndo} onRedo={onRedo} onPreview={onPreview} onExit={onExit} />
      <EditorSidebar />
      <div className="ml-80 mt-14 h-[calc(100%-3.5rem)] overflow-auto bg-gray-50 p-6">
        {children}
      </div>
    </div>
  )
}
