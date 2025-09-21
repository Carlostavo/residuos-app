import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, TrendingUp, Users, MapPin } from "lucide-react"

interface DashboardStatsProps {
  userId: string
  userRole?: string
}

export async function DashboardStats({ userId, userRole }: DashboardStatsProps) {
  const supabase = await createClient()

  // Get waste records stats
  let wasteQuery = supabase.from("waste_records").select("id, weight, status")

  if (userRole !== "admin" && userRole !== "tecnico") {
    wasteQuery = wasteQuery.eq("user_id", userId)
  }

  const { data: wasteRecords } = await wasteQuery

  const totalRecords = wasteRecords?.length || 0
  const totalWeight = wasteRecords?.reduce((sum, record) => sum + (record.weight || 0), 0) || 0
  const pendingRecords = wasteRecords?.filter((record) => record.status === "pending").length || 0
  const collectedRecords = wasteRecords?.filter((record) => record.status === "collected").length || 0

  // Get additional stats for admins/technicians
  let totalUsers = 0
  let totalRoutes = 0

  if (userRole === "admin" || userRole === "tecnico") {
    const { data: users } = await supabase.from("profiles").select("id")
    totalUsers = users?.length || 0

    const { data: routes } = await supabase.from("collection_routes").select("id")
    totalRoutes = routes?.length || 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
          <Trash2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecords}</div>
          <p className="text-xs text-muted-foreground">{pendingRecords} pendientes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Peso Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</div>
          <p className="text-xs text-muted-foreground">{collectedRecords} recolectados</p>
        </CardContent>
      </Card>

      {(userRole === "admin" || userRole === "tecnico") && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">usuarios registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rutas</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRoutes}</div>
              <p className="text-xs text-muted-foreground">rutas activas</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
