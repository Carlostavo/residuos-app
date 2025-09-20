import "./globals.css"
import Header from "../components/Header"
import EditPanel from "../components/EditPanel"
import { AuthProvider } from "../lib/AuthContext"
import { EditProvider } from "../lib/EditContext"

export const metadata = {
  title: "Sistema de Gestión de Residuos Sólidos",
  description:
    "Plataforma integral para monitorear indicadores, gestionar metas y generar reportes para una gestión ambiental eficiente",
  keywords: "gestión residuos, reciclaje, sostenibilidad, medio ambiente",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <EditProvider>
            <Header />
            <div className="flex-1 flex">
              <EditPanel />
              <div className="flex-1 overflow-auto" style={{ marginLeft: "0" }}>
                <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">{children}</main>
              </div>
            </div>
          </EditProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
