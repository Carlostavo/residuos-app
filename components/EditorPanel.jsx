
import { useState } from "react";
import dynamic from "next/dynamic";
import { Rnd } from "react-rnd";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditorPanel({ isOpen, onClose }) {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-40 flex flex-col">
      <div className="flex justify-between items-center p-2 border-b">
        <h2 className="font-bold">Editor</h2>
        <button
          onClick={onClose}
          className="text-red-500 font-semibold hover:underline"
        >
          Cerrar
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ReactQuill value={value} onChange={setValue} />
        <p className="mt-2 text-sm text-gray-500">
          Puedes mover bloques de texto o imágenes.
        </p>
        <Rnd
          default={{
            x: 20,
            y: 20,
            width: 200,
            height: 100,
          }}
          bounds="parent"
          className="border rounded bg-gray-100 flex items-center justify-center cursor-move mt-4"
        >
          Arrastra este bloque
        </Rnd>
      </div>
    </div>
  );
}
