import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentWasteRecords } from "@/components/dashboard/recent-waste-records"
import { WasteChart } from "@/components/dashboard/waste-chart"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {profile?.full_name || user.email}</p>
        </div>

        <div className="grid gap-6">
          <DashboardStats userId={user.id} userRole={profile?.role} />

          <div className="grid lg:grid-cols-2 gap-6">
            <WasteChart userId={user.id} userRole={profile?.role} />
            <RecentWasteRecords userId={user.id} userRole={profile?.role} />
          </div>
        </div>
      </main>
    </div>
  )
}
