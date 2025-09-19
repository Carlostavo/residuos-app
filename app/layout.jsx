import './globals.css'
import Header from '../components/Header'
import { EditProvider } from '../contexts/EditContext'
import EditToolbar from '../components/EditToolbar'

export const metadata = {
  title: 'Gestión de Residuos Sólidos',
  description: 'Plataforma de gestión ambiental',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <EditProvider>
          <Header />
          <EditToolbar />
          <div className="flex-1 flex">
            <div className="flex-1 overflow-auto">
              <main className="p-6 max-w-7xl mx-auto w-full">
                {children}
              </main>
            </div>
          </div>
        </EditProvider>
      </body>
    </html>
  )
}
