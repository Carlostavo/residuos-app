"use client"

import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, Trash2, Recycle, Plus } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  user: any
  profile: any
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative">
              <Trash2 className="h-8 w-8 text-green-600" />
              <Recycle className="h-4 w-4 text-blue-600 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">EcoManager</h1>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/waste-records">Residuos</Link>
            </Button>
            {(profile?.role === "admin" || profile?.role === "tecnico") && (
              <Button asChild variant="ghost">
                <Link href="/routes">Rutas</Link>
              </Button>
            )}
            <Button asChild variant="ghost">
              <Link href="/reports">Reportes</Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/waste-records/new">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Registro
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{profile?.full_name || user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <LogoutButton variant="ghost" className="w-full justify-start p-0" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
