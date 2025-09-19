import { useState } from "react";
import dynamic from "next/dynamic";
import { Rnd } from "react-rnd";
// NOTA: La importación CSS se ha removido - agregar en globals.css si es necesario

const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="p-4 text-gray-500">Cargando editor...</div>
});

export default function EditorPanel({ isOpen, onClose }) {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-40 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-bold text-gray-800">Editor de Contenido</h2>
        <button
          onClick={onClose}
          className="text-red-500 font-semibold hover:text-red-700 transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <ReactQuill 
            value={value} 
            onChange={setValue}
            theme="snow"
            className="h-64 mb-4"
          />
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Puedes mover bloques de texto o imágenes arrastrándolos.
        </p>
        
        <Rnd
          default={{
            x: 20,
            y: 20,
            width: 200,
            height: 100,
          }}
          bounds="parent"
          className="border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-move p-4 text-sm text-gray-600"
        >
          <div className="text-center">
            <i className="fa-solid fa-grip-horizontal mb-2 text-gray-400"></i>
            <p>Arrastra este bloque</p>
          </div>
        </Rnd>

        {/* Preview del contenido */}
        {value && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Vista previa:</h3>
            <div 
              className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-lg"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={() => {
            console.log("Contenido guardado:", value);
            alert("Contenido guardado (consola)");
          }}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
