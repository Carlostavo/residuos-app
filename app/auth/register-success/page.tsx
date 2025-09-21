import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Mail } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">¡Registro Exitoso!</CardTitle>
            <CardDescription>Verifica tu correo electrónico para continuar</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <p className="text-sm">Hemos enviado un enlace de confirmación a tu correo electrónico.</p>
            </div>
            <p className="text-sm text-gray-500">
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>
            <div className="pt-4">
              <Button asChild className="w-full">
                <Link href="/auth/login">Volver al Inicio de Sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
