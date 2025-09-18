import './globals.css'
import Header from '../components/Header'

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
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}
