import "./globals.css"
import Header from "../components/Header"
import { AuthProvider } from "../lib/AuthContext"
import { CanvaEditProvider } from "../lib/CanvaEditContext"

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
          <CanvaEditProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </CanvaEditProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
