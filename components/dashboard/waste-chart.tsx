import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WasteChartProps {
  userId: string
  userRole?: string
}

export async function WasteChart({ userId, userRole }: WasteChartProps) {
  const supabase = await createClient()

  let query = supabase.from("waste_records").select(`
      weight,
      waste_categories (
        name,
        color
      )
    `)

  if (userRole !== "admin" && userRole !== "tecnico") {
    query = query.eq("user_id", userId)
  }

  const { data: records } = await query

  // Group by category
  const categoryData =
    records?.reduce(
      (acc, record) => {
        const categoryName = record.waste_categories?.name || "Sin categoría"
        const categoryColor = record.waste_categories?.color || "#6B7280"

        if (!acc[categoryName]) {
          acc[categoryName] = {
            name: categoryName,
            weight: 0,
            color: categoryColor,
          }
        }
        acc[categoryName].weight += record.weight || 0
        return acc
      },
      {} as Record<string, { name: string; weight: number; color: string }>,
    ) || {}

  const chartData = Object.values(categoryData)
  const totalWeight = chartData.reduce((sum, item) => sum + item.weight, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item) => {
            const percentage = totalWeight > 0 ? (item.weight / totalWeight) * 100 : 0
            return (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">
                    {item.weight.toFixed(1)} kg ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
          {chartData.length === 0 && <p className="text-center text-gray-500 py-8">No hay datos para mostrar</p>}
        </div>
      </CardContent>
    </Card>
  )
}
