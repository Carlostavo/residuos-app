"use client"
import { useCanvaEdit } from "@/lib/CanvaEditContext"
import CanvaElement from "./CanvaElement"
import CanvaToolbar from "./CanvaToolbar"
import CanvaAddMenu from "./CanvaAddMenu"

export default function CanvaCanvas({ children }) {
  const { elements, deselectElement, showAddElementMenu } = useCanvaEdit()

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget) {
      deselectElement()
    }
  }

  const handleCanvasRightClick = (e) => {
    e.preventDefault()
    showAddElementMenu(e)
  }

  return (
    <div className="relative min-h-screen w-full" onClick={handleCanvasClick} onContextMenu={handleCanvasRightClick}>
      <div className="relative z-0">{children}</div>

      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="relative w-full h-full pointer-events-auto">
          {Object.keys(elements).map((elementId) => (
            <CanvaElement key={elementId} elementId={elementId} />
          ))}
        </div>
      </div>

      <CanvaToolbar />
      <CanvaAddMenu />
    </div>
  )
}
