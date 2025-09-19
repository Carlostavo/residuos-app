import "./globals.css"
import Header from "../components/Header"
import EditorPanel from "../components/EditorPanel"
import { EditProvider, useEdit } from "../lib/EditContext"

function MainWrapper({ children }) {
  const { isEditing } = useEdit()

  return (
    <main className={`transition-all ${isEditing ? "ml-64 bg-grid" : ""}`}>
      {children}
    </main>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <EditProvider>
          <Header />
          <EditorPanel />
          <MainWrapper>{children}</MainWrapper>
        </EditProvider>
      </body>
    </html>
  )
}
