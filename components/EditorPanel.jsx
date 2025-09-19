"use client";
import { useEdit } from "@/lib/EditContext";

export default function EditorPanel() {
  const { isEditing } = useEdit();

  if (!isEditing) return null;

  return (
    <aside className="w-64 h-full bg-gray-100 border-r border-gray-300 p-4 fixed left-0 top-0 z-50 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Herramientas</h2>
      <div className="flex flex-col gap-3">
        <button className="p-2 bg-white border rounded hover:bg-gray-200">Negrita</button>
        <button className="p-2 bg-white border rounded hover:bg-gray-200">Cursiva</button>
        <button className="p-2 bg-white border rounded hover:bg-gray-200">Subrayado</button>
        <button className="p-2 bg-white border rounded hover:bg-gray-200">Color Texto</button>
        <button className="p-2 bg-white border rounded hover:bg-gray-200">Insertar Imagen</button>
        <button className="p-2 bg-white border rounded hover:bg-gray-200">Insertar Video</button>
        <button className="p-2 bg-white border rounded hover:bg-gray-200">Enlace</button>
        <button className="p-2 bg-red-200 border rounded hover:bg-red-300">Eliminar</button>
      </div>
    </aside>
  );
}
