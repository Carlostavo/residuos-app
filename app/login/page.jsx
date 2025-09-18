import { redirect } from 'next/navigation'

export default function LoginPage() {
  // Redirigir a inicio ya que el login ahora es un modal
  redirect('/inicio')
}
