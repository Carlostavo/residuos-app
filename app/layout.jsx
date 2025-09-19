import "./globals.css"
import Header from "../components/Header"
import EditorPanel from "../components/EditorPanel"
import { EditProvider } from "../lib/EditContext"

export const metadata = {
  title: "Gestión RS",
  description: "Plataforma de seguimiento",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <EditProvider>
          <Header />
          <EditorPanel />
          <main className="ml-64">{children}</main>
        </EditProvider>
      </body>
    </html>
  )
}
