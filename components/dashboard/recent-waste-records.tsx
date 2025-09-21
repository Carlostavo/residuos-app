import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface RecentWasteRecordsProps {
  userId: string
  userRole?: string
}

export async function RecentWasteRecords({ userId, userRole }: RecentWasteRecordsProps) {
  const supabase = await createClient()

  let query = supabase
    .from("waste_records")
    .select(`
      id,
      weight,
      location,
      status,
      created_at,
      waste_categories (
        name,
        color
      ),
      profiles (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  if (userRole !== "admin" && userRole !== "tecnico") {
    query = query.eq("user_id", userId)
  }

  const { data: records } = await query

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "collected":
        return "bg-blue-100 text-blue-800"
      case "processed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "collected":
        return "Recolectado"
      case "processed":
        return "Procesado"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registros Recientes</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/waste-records">Ver Todos</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records?.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: record.waste_categories?.color || "#6B7280" }}
                  />
                  <span className="font-medium text-sm">{record.waste_categories?.name || "Sin categoría"}</span>
                  <Badge className={getStatusColor(record.status)}>{getStatusText(record.status)}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {record.weight} kg • {record.location || "Sin ubicación"}
                </p>
                {(userRole === "admin" || userRole === "tecnico") && record.profiles && (
                  <p className="text-xs text-gray-500">Por: {record.profiles.full_name || record.profiles.email}</p>
                )}
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(record.created_at), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          ))}
          {!records?.length && <p className="text-center text-gray-500 py-4">No hay registros recientes</p>}
        </div>
      </CardContent>
    </Card>
  )
}
