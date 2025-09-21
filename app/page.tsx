import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trash2, Recycle, Users, BarChart3, MapPin, Shield } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Trash2 className="h-8 w-8 text-green-600" />
              <Recycle className="h-4 w-4 text-blue-600 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">EcoManager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/auth/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Gestión Inteligente de Residuos para un Futuro Sostenible
          </h2>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Optimiza la recolección, seguimiento y análisis de residuos con nuestra plataforma integral. Contribuye al
            cuidado del medio ambiente con tecnología avanzada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/auth/register">Comenzar Ahora</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Conocer Más</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Características Principales</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Herramientas completas para la gestión eficiente de residuos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Trash2 className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Registro de Residuos</CardTitle>
              <CardDescription>
                Registra y categoriza diferentes tipos de residuos con información detallada
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Rutas de Recolección</CardTitle>
              <CardDescription>Planifica y optimiza las rutas de recolección para mayor eficiencia</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Análisis y Reportes</CardTitle>
              <CardDescription>Genera reportes detallados y analiza tendencias de gestión de residuos</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Sistema de roles para administradores, técnicos y usuarios regulares</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-teal-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Recycle className="h-6 w-6 text-teal-600" />
              </div>
              <CardTitle>Seguimiento Ambiental</CardTitle>
              <CardDescription>Monitorea el impacto ambiental y las métricas de sostenibilidad</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-red-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Seguridad de Datos</CardTitle>
              <CardDescription>Protección avanzada de datos con autenticación segura y encriptación</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">¿Listo para Transformar tu Gestión de Residuos?</h3>
          <p className="text-xl mb-8 text-green-100">Únete a organizaciones que ya están haciendo la diferencia</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/register">Crear Cuenta Gratuita</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="relative">
                <Trash2 className="h-6 w-6 text-green-400" />
                <Recycle className="h-3 w-3 text-blue-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-lg font-semibold">EcoManager</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 EcoManager. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
