/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Remueve la configuración experimental que causa problemas
  // experimental: {
  //   optimizeCss: true,
  // },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  // Agrega esta configuración para manejar mejor la exportación
  trailingSlash: false,
  // Deshabilita la generación de páginas de error estáticas si causan problemas
  // skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
