// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext'; // Creamos un contexto para la autenticación

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Plataforma de Seguimiento - Daule',
  description: 'Gestión de indicadores y metas para el municipio de Daule.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}