import { useState } from 'react'

export default function EditorSidebar({ children }) {
  const [tab, setTab] = useState("bloques")

  return (
    <div className="fixed left-0 top-14 h-[calc(100%-3.5rem)] w-80 bg-white shadow-xl border-r z-40 flex flex-col">
      <div className="flex border-b">
        {["bloques", "propiedades", "estilos"].map(t => (
          <button
            key={t}
            className={`flex-1 py-2 text-sm capitalize ${tab === t ? "border-b-2 border-blue-600 font-bold" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="p-4 flex-1 overflow-auto">
        {tab === "bloques" && <div>➕ Insertar: Texto, Imagen, Video, Botón</div>}
        {tab === "propiedades" && <div>⚙️ Edita propiedades del bloque</div>}
        {tab === "estilos" && <div>🎨 Ajusta colores, fuentes, tamaños</div>}
      </div>
    </div>
  )
}
