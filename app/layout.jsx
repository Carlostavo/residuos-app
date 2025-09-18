import './globals.css'


import Header from '../components/Header'

export const metadata = {
  title: 'Gestión de Residuos Sólidos — Editor Pro',
  description: 'Plataforma con editor en línea y Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}
